from __future__ import annotations

import argparse
import json
import time
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

from common import ARTIFACTS_DIR, ensure_qa_dirs, start_static_server, timestamp_slug, write_json


VIEWPORTS = {
    "desktop": {
        "viewport": {"width": 1366, "height": 768},
        "device_scale_factor": 1,
    },
    "retina": {
        "viewport": {"width": 1512, "height": 982},
        "device_scale_factor": 2,
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
    page.wait_for_function("() => typeof window.__isgMenuApi === 'object' && !!window.__isgMenuApi")
    page.wait_for_function("() => typeof window.__isgDiagnostics === 'object' && !!window.__isgDiagnostics")


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


def unlock_debug(page: Page) -> None:
    page.evaluate(
        """() => {
          window.__isgDiagnostics.setDebugUnlocked(true);
          window.__isgDiagnostics.setPerformanceProfilerEnabled(true);
          window.__isgDiagnostics.forceDebugDay();
          window.__isgDiagnostics.clearHeldKeys();
        }"""
    )
    page.wait_for_timeout(300)


def wait_for_samples(page: Page, min_samples: int, timeout_ms: int = 20000) -> None:
    page.wait_for_function(
        """(minSamples) => {
          const summary = window.__isgDiagnostics.getPerformanceSummary();
          return summary && summary.enabled && summary.samples >= minSamples;
        }""",
        arg=min_samples,
        timeout=timeout_ms,
    )


def begin_sample(page: Page) -> None:
    page.evaluate(
        """() => {
          window.__isgDiagnostics.setPerformanceProfilerEnabled(true);
          window.__isgDiagnostics.resetPerformanceSummary();
          window.__isgDiagnostics.clearHeldKeys();
          window.__isgDiagnostics.forceDebugDay();
        }"""
    )
    page.wait_for_timeout(250)


def finish_sample(page: Page, label: str, artifact_dir: Path) -> dict:
    payload = read_payload(page)
    result = {
        "label": label,
        "snapshot": payload,
        "performance": page.evaluate("() => window.__isgDiagnostics.getPerformanceSummary()"),
    }
    write_json(artifact_dir / f"{label}.json", result)
    page.screenshot(path=str(artifact_dir / f"{label}.png"))
    page.evaluate("() => window.__isgDiagnostics.clearHeldKeys()")
    return result


def sample_day_idle(page: Page, artifact_dir: Path) -> dict:
    begin_sample(page)
    wait_for_samples(page, 180)
    return finish_sample(page, "day_idle", artifact_dir)


def sample_walk(page: Page, artifact_dir: Path) -> dict:
    begin_sample(page)
    page.evaluate("() => window.__isgDiagnostics.setHeldKeys(['KeyD'])")
    wait_for_samples(page, 180)
    return finish_sample(page, "walk", artifact_dir)


def sample_menu_spam(page: Page, artifact_dir: Path) -> dict:
    begin_sample(page)
    page.evaluate(
        """async () => {
          for (let i = 0; i < 10; i += 1) {
            window.__isgDiagnostics.toggleSettingsPanel();
            await new Promise((resolve) => window.setTimeout(resolve, 120));
            window.__isgDiagnostics.toggleSettingsPanel();
            await new Promise((resolve) => window.setTimeout(resolve, 90));
            window.__isgDiagnostics.toggleDebugPanel();
            await new Promise((resolve) => window.setTimeout(resolve, 120));
            window.__isgDiagnostics.toggleDebugPanel();
            await new Promise((resolve) => window.setTimeout(resolve, 90));
          }
        }"""
    )
    wait_for_samples(page, 120)
    return finish_sample(page, "menu_spam", artifact_dir)


def sample_night_idle(page: Page, artifact_dir: Path) -> dict:
    begin_sample(page)
    page.evaluate("() => window.__isgDiagnostics.forceDebugNight()")
    wait_for_samples(page, 180)
    return finish_sample(page, "night_idle", artifact_dir)


def sample_cave_idle(page: Page, artifact_dir: Path) -> dict:
    begin_sample(page)
    pair = page.evaluate("() => window.__isgDiagnostics.spawnQaLinkedCavePair()")
    if not isinstance(pair, dict) or not pair.get("firstEntranceId"):
        raise AssertionError(f"Failed to spawn QA linked cave pair: {pair}")
    page.evaluate(
        """(entranceId) => window.__isgDiagnostics.enterCaveV2ByEntranceId(entranceId)""",
        pair["firstEntranceId"],
    )
    page.wait_for_timeout(1000)
    wait_for_samples(page, 180)
    result = finish_sample(page, "cave_idle", artifact_dir)
    result["pair"] = pair
    write_json(artifact_dir / "cave_pair.json", pair)
    page.evaluate("""() => window.__isgDiagnostics.travelActiveCaveV2ToSurfaceExit('entry')""")
    page.wait_for_timeout(1000)
    return result


def sample_post_soak(page: Page, artifact_dir: Path) -> dict:
    begin_sample(page)
    page.evaluate(
        """async () => {
          const sequences = [
            ['KeyD'],
            ['KeyS'],
            ['KeyA'],
            ['KeyW'],
          ];
          for (let i = 0; i < 12; i += 1) {
            window.__isgDiagnostics.setHeldKeys(sequences[i % sequences.length]);
            await new Promise((resolve) => window.setTimeout(resolve, 1200));
          }
          window.__isgDiagnostics.clearHeldKeys();
        }"""
    )
    wait_for_samples(page, 360, timeout_ms=30000)
    return finish_sample(page, "post_soak", artifact_dir)


def build_summary(profile_name: str, scenarios: list[dict], console_errors: list[str], started_at: float) -> dict:
    baseline = {item["label"]: item for item in scenarios}
    return {
        "profile": profile_name,
        "durationSeconds": round(time.time() - started_at, 2),
        "consoleErrors": console_errors,
        "scenarios": scenarios,
        "highLevel": {
            "startupFps": baseline.get("day_idle", {}).get("snapshot", {}).get("fps", {}),
            "dayIdle": baseline.get("day_idle", {}).get("performance", {}),
            "walk": baseline.get("walk", {}).get("performance", {}),
            "nightIdle": baseline.get("night_idle", {}).get("performance", {}),
            "caveIdle": baseline.get("cave_idle", {}).get("performance", {}),
            "postSoak": baseline.get("post_soak", {}).get("performance", {}),
        },
    }


def run_audit(profile_name: str, base_url: str, artifact_dir: Path) -> dict:
    profile = VIEWPORTS[profile_name]
    ensure_qa_dirs()
    console_errors: list[str] = []
    started_at = time.time()
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(
            viewport=profile["viewport"],
            device_scale_factor=profile["device_scale_factor"],
        )
        page = context.new_page()
        attach_console_tracking(page, console_errors)
        try:
            open_game(page, base_url)
            start_solo(page)
            unlock_debug(page)
            scenarios = [
                sample_day_idle(page, artifact_dir),
                sample_walk(page, artifact_dir),
                sample_menu_spam(page, artifact_dir),
                sample_night_idle(page, artifact_dir),
                sample_post_soak(page, artifact_dir),
                sample_cave_idle(page, artifact_dir),
            ]
            summary = build_summary(profile_name, scenarios, console_errors, started_at)
            write_json(artifact_dir / "summary.json", summary)
            return summary
        finally:
            context.close()
            browser.close()


def main() -> int:
    parser = argparse.ArgumentParser(description="Run a repeatable performance audit against the game.")
    parser.add_argument("--profile", choices=sorted(VIEWPORTS.keys()), default="desktop")
    parser.add_argument("--port", type=int, default=4173)
    args = parser.parse_args()

    ensure_qa_dirs()
    run_slug = f"perf-audit-{args.profile}-{timestamp_slug()}"
    artifact_dir = ARTIFACTS_DIR / run_slug
    artifact_dir.mkdir(parents=True, exist_ok=True)

    with start_static_server(args.port, artifact_dir) as server:
        summary = run_audit(args.profile, server.base_url, artifact_dir)
        print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
