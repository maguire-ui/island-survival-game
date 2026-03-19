from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

from common import ARTIFACTS_DIR, ensure_qa_dirs, start_static_server, timestamp_slug, write_json


SEED = "island-1"


def attach_console_tracking(page: Page, console_errors: list[str]) -> None:
    def on_console(msg):
        if msg.type == "error":
            console_errors.append(msg.text)

    page.on("console", on_console)
    page.on("pageerror", lambda err: console_errors.append(str(err)))
    page.on(
        "dialog",
        lambda dialog: dialog.accept("123") if "debug passcode" in dialog.message.lower() else dialog.dismiss(),
    )


def wait_for_runtime(page: Page) -> None:
    page.wait_for_function("() => typeof window.render_game_to_text === 'function'")
    page.wait_for_function("() => typeof window.__isgDiagnostics === 'object' && !!window.__isgDiagnostics")
    page.wait_for_function("() => typeof window.__isgMenuApi === 'object' && !!window.__isgMenuApi")


def open_game(page: Page, base_url: str) -> None:
    page.goto(base_url, wait_until="networkidle")
    wait_for_runtime(page)


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
    page.wait_for_timeout(1200)


def ensure_debug(page: Page) -> None:
    page.evaluate(
        """() => {
            window.__isgDiagnostics.setDebugUnlocked(true);
            window.__isgDiagnostics.forceDebugDay();
            window.__isgDiagnostics.clearHeldKeys();
        }"""
    )


def save_and_capture(page: Page, artifact_dir: Path, label: str) -> dict:
    page.evaluate("() => window.__isgDiagnostics.saveGameNow()")
    page.wait_for_timeout(200)
    payload = page.evaluate("() => JSON.parse(window.render_game_to_text())")
    runtime_entrances = page.evaluate("() => window.__isgDiagnostics.getRuntimeCaveV2EntrancesForQa()")
    saved_entrances = page.evaluate("() => window.__isgDiagnostics.getSavedCaveV2EntrancesForQa()")
    page.screenshot(path=str(artifact_dir / f"{label}.png"))
    bundle = {
        "payload": payload,
        "runtimeEntrances": runtime_entrances,
        "savedEntrances": saved_entrances,
    }
    write_json(artifact_dir / f"{label}.json", bundle)
    return bundle


def capture_runtime(page: Page, artifact_dir: Path, label: str) -> dict:
    payload = page.evaluate("() => JSON.parse(window.render_game_to_text())")
    runtime_entrances = page.evaluate("() => window.__isgDiagnostics.getRuntimeCaveV2EntrancesForQa()")
    saved_entrances = page.evaluate("() => window.__isgDiagnostics.getSavedCaveV2EntrancesForQa()")
    page.screenshot(path=str(artifact_dir / f"{label}.png"))
    bundle = {
        "payload": payload,
        "runtimeEntrances": runtime_entrances,
        "savedEntrances": saved_entrances,
    }
    write_json(artifact_dir / f"{label}.json", bundle)
    return bundle


def assert_same_summary(actual: dict, expected: dict, label: str) -> None:
    if actual != expected:
        raise AssertionError(f"{label} mismatch\nexpected={json.dumps(expected, indent=2)}\nactual={json.dumps(actual, indent=2)}")


def assert_link_pair_summary(summary: dict) -> None:
    if int(summary.get("entranceCount") or 0) < 2:
        raise AssertionError(f"Expected at least 2 runtime entrances, got {summary}")
    if int(summary.get("linkedPairCount") or 0) < 1:
        raise AssertionError(f"Expected at least 1 linked pair, got {summary}")
    if summary.get("issues"):
        raise AssertionError(f"Runtime entrance issues detected: {summary['issues']}")


def traverse_pair(page: Page, first_id: str, second_id: str, artifact_dir: Path, label_prefix: str) -> dict:
    enter_a = page.evaluate("(entranceId) => window.__isgDiagnostics.enterCaveV2ByEntranceId(entranceId)", first_id)
    if not isinstance(enter_a, dict) or not isinstance(enter_a.get("active"), dict):
        raise AssertionError(f"Failed entering first linked cave entrance {first_id}: {enter_a}")
    page.wait_for_timeout(1000)
    page.screenshot(path=str(artifact_dir / f"{label_prefix}-enter-a.png"))
    travel_b = page.evaluate("() => window.__isgDiagnostics.travelActiveCaveV2ToSurfaceExit('linked')")
    if not travel_b.get("ok") or travel_b.get("expectedEntranceId") != second_id:
        raise AssertionError(f"Linked travel A->B failed: {travel_b}")
    page.wait_for_timeout(900)
    page.screenshot(path=str(artifact_dir / f"{label_prefix}-exit-b.png"))

    enter_b = page.evaluate("(entranceId) => window.__isgDiagnostics.enterCaveV2ByEntranceId(entranceId)", second_id)
    if not isinstance(enter_b, dict) or not isinstance(enter_b.get("active"), dict):
        raise AssertionError(f"Failed entering second linked cave entrance {second_id}: {enter_b}")
    page.wait_for_timeout(1000)
    page.screenshot(path=str(artifact_dir / f"{label_prefix}-enter-b.png"))
    travel_a = page.evaluate("() => window.__isgDiagnostics.travelActiveCaveV2ToSurfaceExit('linked')")
    if not travel_a.get("ok") or travel_a.get("expectedEntranceId") != first_id:
        raise AssertionError(f"Linked travel B->A failed: {travel_a}")
    page.wait_for_timeout(900)
    page.screenshot(path=str(artifact_dir / f"{label_prefix}-exit-a.png"))
    return {
        "enterA": enter_a,
        "travelB": travel_b,
        "enterB": enter_b,
        "travelA": travel_a,
    }


def run_probe(base_url: str, artifact_dir: Path) -> dict:
    console_errors: list[str] = []
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        context = browser.new_context(viewport={"width": 1366, "height": 768})
        page = context.new_page()
        attach_console_tracking(page, console_errors)

        open_game(page, base_url)
        start_solo(page)
        ensure_debug(page)

        spawn = page.evaluate("() => window.__isgDiagnostics.spawnQaLinkedCavePair()")
        if not isinstance(spawn, dict) or not spawn.get("firstEntranceId") or not spawn.get("secondEntranceId"):
            raise AssertionError(f"Failed to spawn linked cave pair: {spawn}")
        first_id = spawn["firstEntranceId"]
        second_id = spawn["secondEntranceId"]

        current = capture_runtime(page, artifact_dir, "after-spawn")
        assert_link_pair_summary(current["runtimeEntrances"])

        saved = save_and_capture(page, artifact_dir, "after-save")
        assert_link_pair_summary(saved["savedEntrances"])
        assert_same_summary(saved["runtimeEntrances"], saved["savedEntrances"], "saved vs runtime entrance summary")

        page.reload(wait_until="networkidle")
        wait_for_runtime(page)
        start_solo(page)
        ensure_debug(page)
        after_reload = capture_runtime(page, artifact_dir, "after-reload")
        assert_link_pair_summary(after_reload["runtimeEntrances"])
        assert_same_summary(after_reload["runtimeEntrances"], saved["savedEntrances"], "runtime after reload vs saved")

        traversal = traverse_pair(page, first_id, second_id, artifact_dir, "after-reload")
        write_json(artifact_dir / "traversal.json", traversal)

        page.evaluate("() => window.__isgDiagnostics.saveGameNow()")
        page.reload(wait_until="networkidle")
        wait_for_runtime(page)
        start_solo(page)
        ensure_debug(page)
        second_reload = capture_runtime(page, artifact_dir, "after-second-reload")
        assert_link_pair_summary(second_reload["runtimeEntrances"])
        assert_same_summary(second_reload["runtimeEntrances"], saved["savedEntrances"], "runtime after second reload vs saved")

        result = {
            "spawn": spawn,
            "afterSpawn": current,
            "afterSave": saved,
            "afterReload": after_reload,
            "afterSecondReload": second_reload,
            "traversal": traversal,
            "consoleErrors": console_errors,
        }
        write_json(artifact_dir / "summary.json", result)
        context.close()
        browser.close()
        if console_errors:
            raise AssertionError(f"Console errors detected: {console_errors[:5]}")
        return result


def main() -> None:
    ensure_qa_dirs()
    artifact_dir = ARTIFACTS_DIR / f"cave-linked-persistence-{timestamp_slug()}"
    artifact_dir.mkdir(parents=True, exist_ok=True)
    with start_static_server(4173, artifact_dir) as server:
        result = run_probe(server.base_url, artifact_dir)
    print(json.dumps({"artifactDir": str(artifact_dir), "summary": result}, indent=2))


if __name__ == "__main__":
    main()
