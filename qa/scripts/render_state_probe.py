from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

from common import ARTIFACTS_DIR, ensure_qa_dirs, start_static_server, timestamp_slug, write_json

PROFILES = {
    "desktop": {
        "viewport": {"width": 1366, "height": 768},
        "device_scale_factor": 1,
        "is_mobile": False,
        "has_touch": False,
    },
    "retina": {
        "viewport": {"width": 1512, "height": 982},
        "device_scale_factor": 2,
        "is_mobile": False,
        "has_touch": False,
    },
    "mobile": {
        "viewport": {"width": 390, "height": 844},
        "device_scale_factor": 3,
        "is_mobile": True,
        "has_touch": True,
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    },
}


def read_payload(page: Page) -> dict:
    return page.evaluate(
        """() => {
          if (typeof window.render_game_to_text !== 'function') {
            return { missingRenderText: true };
          }
          return JSON.parse(window.render_game_to_text());
        }"""
    )


def attach_console_tracking(page: Page, console_errors: list[str]) -> None:
    def on_console(msg):
        if msg.type == "error":
            console_errors.append(msg.text)

    page.on("console", on_console)
    page.on("pageerror", lambda err: console_errors.append(str(err)))
    page.on("dialog", lambda dialog: dialog.accept("123") if "debug passcode" in dialog.message.lower() else dialog.dismiss())


def open_game(page: Page, base_url: str) -> None:
    page.goto(base_url, wait_until="networkidle")
    page.wait_for_function("() => typeof window.render_game_to_text === 'function'")
    page.wait_for_function("() => typeof window.__isgDiagnostics === 'object' && !!window.__isgDiagnostics")
    page.wait_for_function("() => typeof window.__isgMenuApi === 'object' && !!window.__isgMenuApi")


def start_solo(page: Page) -> None:
    page.click("#menuPlayBtn")
    page.click("#soloBtn")
    page.wait_for_function(
        """() => {
          const payload = JSON.parse(window.render_game_to_text());
          return payload.mode === 'game' && payload.player && payload.world && !payload.loadingVisible;
        }""",
        timeout=50000,
    )
    page.wait_for_timeout(1800)


def prepare_debug(page: Page) -> None:
    page.evaluate(
        """() => {
          window.__isgDiagnostics.setDebugUnlocked(true);
          window.__isgDiagnostics.forceDebugDay();
          window.__isgDiagnostics.clearHeldKeys();
        }"""
    )
    page.click("#debugToggle")
    page.wait_for_timeout(200)
    page.click("#debugFpsBtn")
    page.wait_for_timeout(250)


def sample_timeseries(page: Page, seconds: float, hold_keys: list[str] | None = None) -> list[dict]:
    if hold_keys:
        page.evaluate("(keys) => window.__isgDiagnostics.setHeldKeys(keys)", hold_keys)
    else:
        page.evaluate("() => window.__isgDiagnostics.clearHeldKeys()")
    deadline = time.time() + seconds
    samples = []
    while time.time() < deadline:
        samples.append(read_payload(page).get("renderDiagnostics", {}))
        page.wait_for_timeout(250)
    page.evaluate("() => window.__isgDiagnostics.clearHeldKeys()")
    return samples


def summarize_timeseries(samples: list[dict]) -> dict:
    if not samples:
        return {"sampleCount": 0}
    fps_values = [float(sample.get("fps", 0) or 0) for sample in samples]
    resize_calls = [int(sample.get("totals", {}).get("resizeCalls", 0) or 0) for sample in samples]
    resize_requests = [int(sample.get("totals", {}).get("resizeRequests", 0) or 0) for sample in samples]
    scale_changes = [int(sample.get("totals", {}).get("renderScaleChanges", 0) or 0) for sample in samples]
    active_dprs = sorted({round(float(sample.get("activeDpr", 0) or 0), 3) for sample in samples})
    render_scales = sorted({round(float(sample.get("effectiveRenderScale", 0) or 0), 3) for sample in samples})
    native_ratios = [float(sample.get("nativeResolutionRatio", 0) or 0) for sample in samples]
    return {
        "sampleCount": len(samples),
        "minFps": round(min(fps_values), 2),
        "maxFps": round(max(fps_values), 2),
        "avgFps": round(sum(fps_values) / len(fps_values), 2),
        "resizeCallDelta": resize_calls[-1] - resize_calls[0],
        "resizeRequestDelta": resize_requests[-1] - resize_requests[0],
        "renderScaleChangeDelta": scale_changes[-1] - scale_changes[0],
        "activeDprs": active_dprs,
        "renderScales": render_scales,
        "minNativeResolutionRatio": round(min(native_ratios), 3),
        "maxNativeResolutionRatio": round(max(native_ratios), 3),
        "lastWarnings": samples[-1].get("warnings", []),
        "lastSlowNow": samples[-1].get("slowestCurrent", []),
        "lastDetectors": samples[-1].get("detectors", {}),
        "lastCounts": samples[-1].get("counts", {}),
    }


def run_profile(playwright, base_url: str, artifact_dir: Path, profile_name: str) -> dict:
    config = PROFILES[profile_name]
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(**config)
    page = context.new_page()
    console_errors: list[str] = []
    attach_console_tracking(page, console_errors)
    open_game(page, base_url)
    start_solo(page)
    prepare_debug(page)

    idle_samples = sample_timeseries(page, seconds=4.0)
    walk_samples = sample_timeseries(page, seconds=4.0, hold_keys=["KeyD"])

    payload = read_payload(page)
    page.screenshot(path=str(artifact_dir / f"{profile_name}.png"))

    result = {
        "profile": profile_name,
        "snapshot": payload,
        "idle": summarize_timeseries(idle_samples),
        "walk": summarize_timeseries(walk_samples),
        "consoleErrors": console_errors,
    }
    write_json(artifact_dir / f"{profile_name}.json", result)
    context.close()
    browser.close()
    return result


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--profiles", nargs="+", default=["desktop", "retina", "mobile"])
    args = parser.parse_args()

    ensure_qa_dirs()
    artifact_dir = ARTIFACTS_DIR / f"render-state-probe-{timestamp_slug()}"
    artifact_dir.mkdir(parents=True, exist_ok=True)

    with start_static_server(4173, artifact_dir) as server:
        with sync_playwright() as playwright:
            results = [run_profile(playwright, server.base_url, artifact_dir, profile) for profile in args.profiles]

    summary = {"profiles": results}
    write_json(artifact_dir / "summary.json", summary)
    print(json.dumps({"artifactDir": str(artifact_dir), "profiles": results}, indent=2))


if __name__ == "__main__":
    main()
