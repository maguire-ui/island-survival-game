from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import Page, sync_playwright

from common import ARTIFACTS_DIR, ensure_qa_dirs, start_static_server, timestamp_slug, write_json


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


def open_inventory(page: Page) -> None:
    hidden = page.evaluate("() => document.querySelector('#inventory')?.classList.contains('hidden') !== false")
    if hidden:
        page.evaluate("() => window.__isgDiagnostics.toggleInventoryForQa()")
        page.wait_for_function("() => !document.querySelector('#inventory')?.classList.contains('hidden')")
    page.wait_for_timeout(150)


def set_slots(page: Page, slots: list[dict]) -> list[dict]:
    return page.evaluate("(slots) => window.__isgDiagnostics.setInventorySlotsForQa(slots)", slots)


def get_slots(page: Page) -> list[dict]:
    return page.evaluate("() => window.__isgDiagnostics.getInventorySlotsForQa()")


def get_ui_summary(page: Page) -> dict:
    return page.evaluate(
        """() => {
            const selectedIndex = (selector) => Array.from(document.querySelectorAll(selector)).findIndex((el) => el.classList.contains('selected'));
            return {
                inventorySlotCount: document.querySelectorAll('#inventorySlots .slot').length,
                hotbarSlotCount: document.querySelectorAll('#hotbar .slot').length,
                inventorySelectedIndex: selectedIndex('#inventorySlots .slot'),
                hotbarSelectedIndex: selectedIndex('#hotbar .slot'),
                bindings: window.__isgDiagnostics.getInventoryUiBindingsForQa(),
            };
        }"""
    )


def click_hotbar(page: Page, index: int) -> None:
    page.locator("#hotbar .slot").nth(index).click()
    page.wait_for_timeout(120)


def click_inventory(page: Page, index: int) -> None:
    page.locator("#inventorySlots .slot").nth(index).click()
    page.wait_for_timeout(120)


def capture(page: Page, artifact_dir: Path, label: str) -> dict:
    payload = page.evaluate("() => JSON.parse(window.render_game_to_text())")
    ui = get_ui_summary(page)
    slots = get_slots(page)
    page.screenshot(path=str(artifact_dir / f"{label}.png"))
    write_json(artifact_dir / f"{label}.json", {"payload": payload, "ui": ui, "slots": slots})
    return {"payload": payload, "ui": ui, "slots": slots}


def assert_slot(slots: list[dict], index: int, item_id: str | None, qty: int = 0) -> None:
    slot = slots[index]
    actual_id = slot.get("id")
    actual_qty = int(slot.get("qty") or 0)
    if actual_id != item_id or actual_qty != qty:
        raise AssertionError(f"slot[{index}] expected {item_id}@{qty}, got {actual_id}@{actual_qty}")


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
        open_inventory(page)

        scenarios: dict[str, dict] = {}

        initial_slots = [
            {"id": "coal", "qty": 5},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": "stone", "qty": 3},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
        ]
        set_slots(page, initial_slots)
        scenarios["initial"] = capture(page, artifact_dir, "initial")
        bindings = scenarios["initial"]["ui"]["bindings"]
        inventory_mapping_indices = [entry["inventoryIndex"] for entry in bindings["inventoryMappings"]]
        hotbar_mapping_indices = [entry["inventoryIndex"] for entry in bindings["hotbarMappings"]]
        if bindings["issues"]:
            raise AssertionError(f"Inventory UI validation issues: {bindings['issues']}")
        if hotbar_mapping_indices != [0, 1, 2, 3]:
            raise AssertionError(f"Unexpected hotbar mapping {hotbar_mapping_indices}")
        if inventory_mapping_indices != [4, 5, 6, 7]:
            raise AssertionError(f"Unexpected inventory mapping {inventory_mapping_indices}")
        if scenarios["initial"]["ui"]["inventorySlotCount"] != 4:
            raise AssertionError(f"Expected 4 backpack slots, got {scenarios['initial']['ui']['inventorySlotCount']}")

        click_hotbar(page, 0)
        click_inventory(page, 0)
        scenarios["hotbar_to_inventory"] = capture(page, artifact_dir, "hotbar_to_inventory")
        slots = scenarios["hotbar_to_inventory"]["slots"]
        assert_slot(slots, 0, "stone", 3)
        assert_slot(slots, 4, "coal", 5)

        set_slots(page, [
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": "coal", "qty": 5},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
        ])
        click_inventory(page, 0)
        click_hotbar(page, 0)
        scenarios["inventory_to_hotbar"] = capture(page, artifact_dir, "inventory_to_hotbar")
        slots = scenarios["inventory_to_hotbar"]["slots"]
        assert_slot(slots, 0, "coal", 5)
        assert_slot(slots, 4, None, 0)

        set_slots(page, [
            {"id": "wood", "qty": 2},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": "stone", "qty": 3},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
        ])
        click_hotbar(page, 0)
        click_inventory(page, 0)
        scenarios["swap"] = capture(page, artifact_dir, "swap")
        slots = scenarios["swap"]["slots"]
        assert_slot(slots, 0, "stone", 3)
        assert_slot(slots, 4, "wood", 2)

        set_slots(page, [
            {"id": "coal", "qty": 5},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": "coal", "qty": 7},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
        ])
        click_hotbar(page, 0)
        click_inventory(page, 0)
        scenarios["stack"] = capture(page, artifact_dir, "stack")
        slots = scenarios["stack"]["slots"]
        assert_slot(slots, 0, None, 0)
        assert_slot(slots, 4, "coal", 12)

        save_slots = [
            {"id": "coal", "qty": 4},
            {"id": "wood", "qty": 1},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": "stone", "qty": 8},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
            {"id": None, "qty": 0},
        ]
        set_slots(page, save_slots)
        page.evaluate("() => window.__isgDiagnostics.saveGameNow()")
        page.reload(wait_until="networkidle")
        wait_for_runtime(page)
        start_solo(page)
        ensure_debug(page)
        open_inventory(page)
        scenarios["after_reload"] = capture(page, artifact_dir, "after_reload")
        slots = scenarios["after_reload"]["slots"]
        assert_slot(slots, 0, "coal", 4)
        assert_slot(slots, 1, "wood", 1)
        assert_slot(slots, 4, "stone", 8)

        result = {
            "consoleErrors": console_errors,
            "scenarios": {
                name: {
                    "inventorySlotCount": data["ui"]["inventorySlotCount"],
                    "hotbarSlotCount": data["ui"]["hotbarSlotCount"],
                    "inventoryBindings": data["ui"]["bindings"]["inventoryMappings"],
                    "hotbarBindings": data["ui"]["bindings"]["hotbarMappings"],
                    "issues": data["ui"]["bindings"]["issues"],
                    "slots": data["slots"],
                }
                for name, data in scenarios.items()
            },
        }
        write_json(artifact_dir / "summary.json", result)
        context.close()
        browser.close()
        if console_errors:
            raise AssertionError(f"Console errors detected: {console_errors[:5]}")
        return result


def main() -> None:
    ensure_qa_dirs()
    artifact_dir = ARTIFACTS_DIR / f"inventory-hotbar-fix-{timestamp_slug()}"
    artifact_dir.mkdir(parents=True, exist_ok=True)
    with start_static_server(4173, artifact_dir) as server:
        result = run_probe(server.base_url, artifact_dir)
    print(json.dumps({"artifactDir": str(artifact_dir), "summary": result}, indent=2))


if __name__ == "__main__":
    main()
