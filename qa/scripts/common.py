from __future__ import annotations

import json
import os
import socket
import time
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from typing import Dict, Iterable, List


ROOT = Path(__file__).resolve().parents[2]
QA_DIR = ROOT / "qa"
ARTIFACTS_DIR = QA_DIR / "artifacts"
REPORTS_DIR = QA_DIR / "reports"
SCRIPTS_DIR = QA_DIR / "scripts"
SOURCE_WATCH_PATHS = [
    ROOT / "index.html",
    ROOT / "styles.css",
    ROOT / "progress.md",
    ROOT / "src",
    QA_DIR / "scripts",
]


def ensure_qa_dirs() -> None:
    for path in [QA_DIR, ARTIFACTS_DIR, REPORTS_DIR, SCRIPTS_DIR]:
        path.mkdir(parents=True, exist_ok=True)


def timestamp_slug() -> str:
    return datetime.now().strftime("%Y%m%d-%H%M%S")


def write_json(path: Path, payload) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def append_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(text)


@dataclass
class ServerHandle:
    process: object
    base_url: str
    log_path: Path


def _wait_for_port(port: int, timeout: float = 15.0) -> None:
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=0.5):
                return
        except OSError:
            time.sleep(0.2)
    raise RuntimeError(f"Timed out waiting for localhost:{port}")


@contextmanager
def start_static_server(port: int, artifact_dir: Path):
    log_path = artifact_dir / "server.log"
    log_handle = log_path.open("w", encoding="utf-8")

    class RepoRequestHandler(SimpleHTTPRequestHandler):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, directory=str(ROOT), **kwargs)

        def log_message(self, format, *args):  # noqa: A003
            message = "%s - - [%s] %s\n" % (  # noqa: UP031
                self.address_string(),
                self.log_date_time_string(),
                format % args,
            )
            log_handle.write(message)
            log_handle.flush()

        def copyfile(self, source, outputfile):
            try:
                super().copyfile(source, outputfile)
            except (BrokenPipeError, ConnectionResetError):
                log_handle.write("[qa] client disconnected during static file stream\n")
                log_handle.flush()

    bind_port = max(0, int(port))
    try:
        server = ThreadingHTTPServer(("127.0.0.1", bind_port), RepoRequestHandler)
    except OSError:
        server = ThreadingHTTPServer(("127.0.0.1", 0), RepoRequestHandler)
        log_handle.write(
            f"[qa] requested port {bind_port} unavailable, using ephemeral port {server.server_port}\n"
        )
        log_handle.flush()
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        _wait_for_port(server.server_port)
        yield ServerHandle(process=server, base_url=f"http://127.0.0.1:{server.server_port}", log_path=log_path)
    finally:
        server.shutdown()
        server.server_close()
        thread.join(timeout=5)
        log_handle.close()


def snapshot_source_mtimes() -> Dict[str, float]:
    mtimes: Dict[str, float] = {}
    for target in SOURCE_WATCH_PATHS:
        if not target.exists():
            continue
        if target.is_file():
            mtimes[str(target)] = target.stat().st_mtime
            continue
        for path in target.rglob("*"):
            if path.is_file():
                mtimes[str(path)] = path.stat().st_mtime
    return mtimes


def wait_for_source_change(previous: Dict[str, float], poll_seconds: float = 1.0) -> Dict[str, float]:
    while True:
        current = snapshot_source_mtimes()
        if current != previous:
            return current
        time.sleep(poll_seconds)


def format_summary_markdown(attempts: List[dict], latest: dict | None) -> str:
    lines = ["# Latest QA Summary", ""]
    if latest is None:
        lines.append("No runs yet.")
        return "\n".join(lines) + "\n"

    lines.append(f"- Current status: `{latest['status']}`")
    lines.append(f"- Attempt: `{latest['attempt']}`")
    lines.append(f"- Phase count: `{len(latest['phases'])}`")
    lines.append("")
    lines.append("## Phases")
    for phase in latest["phases"]:
        lines.append(f"- `{phase['name']}`: `{phase['status']}` ({phase['duration_ms']} ms)")
        if phase.get("error"):
            lines.append(f"  error: {phase['error']}")
    lines.append("")
    lines.append("## Attempts")
    for run in attempts[-10:]:
        lines.append(f"- attempt `{run['attempt']}` -> `{run['status']}`")
    return "\n".join(lines) + "\n"
