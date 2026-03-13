from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

from playwright.sync_api import sync_playwright

from common import (
    ARTIFACTS_DIR,
    REPORTS_DIR,
    append_text,
    ensure_qa_dirs,
    format_summary_markdown,
    snapshot_source_mtimes,
    start_static_server,
    timestamp_slug,
    wait_for_source_change,
    write_json,
    write_text,
)
from phases import ALL_PHASES


def run_suite(base_url: str, attempt_dir: Path) -> dict:
    phase_results = []
    overall_status = "passed"
    failed_phase = None
    with sync_playwright() as playwright:
        for phase_name, phase_fn in ALL_PHASES:
            phase_dir = attempt_dir / phase_name
            phase_dir.mkdir(parents=True, exist_ok=True)
            started = time.time()
            try:
                result = phase_fn(playwright, base_url, phase_dir)
                phase_results.append({
                    "name": phase_name,
                    "status": "passed",
                    "duration_ms": round((time.time() - started) * 1000),
                    "artifacts": result.get("artifacts", []),
                    "details": result.get("details", {}),
                })
            except Exception as exc:  # noqa: BLE001
                overall_status = "failed"
                failed_phase = phase_name
                phase_results.append({
                    "name": phase_name,
                    "status": "failed",
                    "duration_ms": round((time.time() - started) * 1000),
                    "artifacts": [],
                    "details": {},
                    "error": str(exc),
                })
                break
    return {
        "status": overall_status,
        "failedPhase": failed_phase,
        "phases": phase_results,
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--watch", action="store_true", help="Wait for source changes and rerun from Phase 1 after failures.")
    parser.add_argument("--once", action="store_true", help="Run the suite once and exit.")
    parser.add_argument("--port", type=int, default=4173)
    args = parser.parse_args()

    ensure_qa_dirs()
    attempts = []
    success_streak = 0
    source_snapshot = snapshot_source_mtimes()
    attempt_counter = 0

    while True:
        attempt_counter += 1
        run_slug = f"{timestamp_slug()}-attempt-{attempt_counter:03d}"
        attempt_dir = ARTIFACTS_DIR / run_slug
        attempt_dir.mkdir(parents=True, exist_ok=True)

        with start_static_server(args.port, attempt_dir) as server:
            summary = run_suite(server.base_url, attempt_dir)

        summary["attempt"] = attempt_counter
        summary["artifactDir"] = str(attempt_dir.relative_to(Path.cwd()))
        attempts.append(summary)
        write_json(REPORTS_DIR / "latest-summary.json", summary)
        write_text(REPORTS_DIR / "latest-summary.md", format_summary_markdown(attempts, summary))
        append_text(
            REPORTS_DIR / "failure-history.md",
            f"- attempt `{attempt_counter}` -> `{summary['status']}`"
            + (f" failed at `{summary['failedPhase']}`" if summary["failedPhase"] else "")
            + "\n",
        )

        if summary["status"] == "passed":
            success_streak += 1
            if success_streak >= 2 or args.once:
                return 0
            continue

        success_streak = 0
        if args.once and not args.watch:
            return 1

        print(
            f"QA failed at phase {summary['failedPhase']}. "
            "Waiting for source changes before restarting from Phase 1...",
            flush=True,
        )
        source_snapshot = wait_for_source_change(source_snapshot)


if __name__ == "__main__":
    sys.exit(main())
