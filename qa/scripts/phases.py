from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Callable, Dict, List

from playwright.sync_api import Browser, Page, sync_playwright


def _attach_page_logging(page: Page, console_errors: List[str]) -> None:
    def _console_text(msg) -> str:
        text_attr = getattr(msg, "text", "")
        return text_attr() if callable(text_attr) else text_attr

    page.on("console", lambda msg: console_errors.append(_console_text(msg)) if msg.type == "error" else None)
    page.on("pageerror", lambda err: console_errors.append(str(err)))

    def _handle_dialog(dialog):
        message_attr = getattr(dialog, "message", "")
        message = message_attr() if callable(message_attr) else (message_attr or "")
        if "debug passcode" in message.lower():
            dialog.accept("123")
        else:
            dialog.dismiss()

    page.on("dialog", _handle_dialog)


def _read_payload(page: Page) -> dict:
    return page.evaluate(
        """() => {
            if (typeof window.render_game_to_text !== 'function') {
              return { missingRenderText: true };
            }
            return JSON.parse(window.render_game_to_text());
        }"""
    )


def _write_page_artifacts(page: Page, artifact_dir: Path, label: str) -> dict:
    payload = _read_payload(page)
    (artifact_dir / f"{label}.json").write_text(json.dumps(payload, indent=2), encoding="utf-8")
    page.screenshot(path=str(artifact_dir / f"{label}.png"))
    return payload


def _write_text_artifact(artifact_dir: Path, name: str, text: str) -> None:
    (artifact_dir / name).write_text(text, encoding="utf-8")


def _open_game_page(browser: Browser, base_url: str, console_errors: List[str], viewport=None) -> Page:
    context = browser.new_context(viewport=viewport or {"width": 1366, "height": 768})
    page = context.new_page()
    _attach_page_logging(page, console_errors)
    page.goto(base_url, wait_until="networkidle")
    page.wait_for_function("() => typeof window.render_game_to_text === 'function'")
    return page


def _start_solo(page: Page) -> dict:
    page.click("#menuPlayBtn")
    page.click("#soloBtn")
    page.wait_for_function(
        """() => {
            const payload = JSON.parse(window.render_game_to_text());
            return payload.mode === 'game' && payload.player && !payload.loadingVisible;
        }""",
        timeout=40000,
    )
    page.wait_for_timeout(1500)
    return _read_payload(page)


def _unlock_debug(page: Page) -> None:
    page.click("#settingsToggle")
    page.wait_for_function("() => !document.querySelector('#settingsPanel')?.classList.contains('hidden')")
    page.click("#unlockDebugBtn")
    page.wait_for_function("() => !document.querySelector('#debugToggle')?.classList.contains('hidden')")
    page.click("#settingsToggle")
    page.wait_for_function("() => document.querySelector('#settingsPanel')?.classList.contains('hidden')")


def _wait_for_menu_api(page: Page) -> None:
    page.wait_for_function("() => typeof window.__isgMenuApi === 'object' && !!window.__isgMenuApi")


def _reload_and_wait(page: Page) -> None:
    page.reload(wait_until="networkidle")
    page.wait_for_function("() => typeof window.render_game_to_text === 'function'")
    _wait_for_menu_api(page)


def _start_mp_autotest(page: Page, mode: str, clients: int = 3, seed: str = "island-1") -> dict:
    return page.evaluate(
        """({ mode, clients, seed }) => {
            return window.__isgDiagnostics.startMpAutotest(mode, { clients, seed });
        }""",
        {"mode": mode, "clients": clients, "seed": seed},
    )


def _read_mp_failure_bundle(page: Page):
    return page.evaluate(
        """() => {
            const raw = window.localStorage.getItem('mp_autotest_last_failure');
            return raw ? JSON.parse(raw) : null;
        }"""
    )


def _wait_for_mp_autotest_result(page: Page, timeout_ms: int) -> dict:
    page.wait_for_function(
        """() => {
            const payload = JSON.parse(window.render_game_to_text());
            return !payload.mpAutotest.active
              && (payload.mpAutotest.status === 'pass' || payload.mpAutotest.status === 'fail');
        }""",
        timeout=timeout_ms,
    )
    page.wait_for_timeout(1000)
    return _read_payload(page)


def _write_json_artifact(artifact_dir: Path, name: str, payload) -> None:
    _write_text_artifact(artifact_dir, name, json.dumps(payload, indent=2))


def _find_cave_summary(summary: dict, cave_id: str) -> dict | None:
    caves = summary.get("caves") if isinstance(summary, dict) else None
    if not isinstance(caves, list):
        return None
    for cave in caves:
        if isinstance(cave, dict) and cave.get("caveId") == cave_id:
            return cave
    return None


def _drive_linked_cave_cycle(
    page: Page,
    artifact_dir: Path,
    label: str,
    entrance_id: str,
    exit_kind: str,
    expected_entrance_id: str,
    expected_room_id: str,
) -> dict:
    enter_summary = page.evaluate(
        """(entranceId) => window.__isgDiagnostics.enterCaveV2ByEntranceId(entranceId)""",
        entrance_id,
    )
    _write_json_artifact(artifact_dir, f"{label}-enter-summary.json", enter_summary)
    if not isinstance(enter_summary, dict) or not isinstance(enter_summary.get("active"), dict):
        raise AssertionError(f"{label}: failed to enter cave via {entrance_id}")
    page.wait_for_timeout(1200)
    entered_payload = _write_page_artifacts(page, artifact_dir, f"{label}-entered")
    active = entered_payload.get("caveV2", {}).get("active")
    if not isinstance(active, dict):
        raise AssertionError(f"{label}: cave is not active after entering {entrance_id}")
    if active.get("entryEntranceId") != entrance_id:
        raise AssertionError(f"{label}: wrong entry entrance id {active.get('entryEntranceId')} != {entrance_id}")
    if active.get("roomId") != expected_room_id:
        raise AssertionError(f"{label}: wrong entry room {active.get('roomId')} != {expected_room_id}")
    current_exit_sides = active.get("currentRoomSurfaceExitSides") or []
    if len(current_exit_sides) != 1:
        raise AssertionError(f"{label}: expected exactly one visible surface exit in entry room, got {current_exit_sides}")

    travel_result = page.evaluate(
        """(exitKind) => window.__isgDiagnostics.travelActiveCaveV2ToSurfaceExit(exitKind)""",
        exit_kind,
    )
    _write_json_artifact(artifact_dir, f"{label}-travel-{exit_kind}.json", travel_result)
    if not isinstance(travel_result, dict) or not travel_result.get("ok"):
        raise AssertionError(f"{label}: cave travel failed -> {travel_result}")
    if travel_result.get("expectedEntranceId") != expected_entrance_id:
        raise AssertionError(
            f"{label}: wrong exit entrance id {travel_result.get('expectedEntranceId')} != {expected_entrance_id}"
        )
    if travel_result.get("expectedTile") != travel_result.get("actualTile"):
        raise AssertionError(
            f"{label}: exited on wrong tile {travel_result.get('actualTile')} != {travel_result.get('expectedTile')}"
        )
    page.wait_for_timeout(1200)
    final_payload = _write_page_artifacts(page, artifact_dir, f"{label}-after-{exit_kind}")
    if final_payload.get("caveV2", {}).get("active") is not None:
        raise AssertionError(f"{label}: cave remained active after {exit_kind} exit")
    return {
        "entered": entered_payload,
        "travel": travel_result,
        "final": final_payload,
    }


def phase_boot_ui(playwright, base_url: str, artifact_dir: Path) -> dict:
    console_errors: List[str] = []
    browser = playwright.chromium.launch(headless=True)
    page = None
    try:
      page = _open_game_page(browser, base_url, console_errors)
      page.click("#menuPlayBtn")
      payload = _write_page_artifacts(page, artifact_dir, "play-menu")
      if payload.get("menuView") != "play":
          raise AssertionError(f"Expected play menu, got {payload.get('menuView')}")
      page.click("#menuBackFromPlayBtn")
      page.click("#menuOptionsBtn")
      options_payload = _write_page_artifacts(page, artifact_dir, "options-menu")
      if options_payload.get("menuView") != "options":
          raise AssertionError(f"Expected options menu, got {options_payload.get('menuView')}")
      if console_errors:
          raise AssertionError(f"Console errors during boot_ui: {console_errors[:3]}")
      return {
          "artifacts": ["play-menu.png", "play-menu.json", "options-menu.png", "options-menu.json"],
          "details": {
              "menuView": options_payload.get("menuView"),
          },
      }
    except Exception:
      if page is not None:
          try:
              _write_page_artifacts(page, artifact_dir, "boot-ui-failure")
          except Exception:
              pass
      raise
    finally:
      browser.close()


def phase_solo_smoke(playwright, base_url: str, artifact_dir: Path) -> dict:
    console_errors: List[str] = []
    browser = playwright.chromium.launch(headless=True)
    page = None
    try:
      page = _open_game_page(browser, base_url, console_errors)
      _start_solo(page)
      _unlock_debug(page)
      page.click("#debugToggle")
      page.wait_for_function("() => !document.querySelector('#debugPanel')?.classList.contains('hidden')")
      page.click("#debugFpsBtn")
      page.wait_for_timeout(1500)
      idle_payload = _write_page_artifacts(page, artifact_dir, "idle")
      page.keyboard.down("d")
      page.wait_for_timeout(2000)
      page.keyboard.up("d")
      page.keyboard.down("s")
      page.wait_for_timeout(1200)
      page.keyboard.up("s")
      page.wait_for_timeout(800)
      moving_payload = _write_page_artifacts(page, artifact_dir, "moving")
      page.click("#settingsToggle")
      page.wait_for_timeout(500)
      settings_payload = _write_page_artifacts(page, artifact_dir, "settings-open")

      idle_fps = float(idle_payload["fps"]["smoothed"])
      moving_fps = float(moving_payload["fps"]["smoothed"])
      if idle_fps < 60 or moving_fps < 60:
          raise AssertionError(f"FPS below target: idle={idle_fps}, moving={moving_fps}")
      if settings_payload["panels"]["settings"]["rect"]["x"] < 800:
          raise AssertionError(f"Settings panel is not in the top-right: {settings_payload['panels']['settings']}")
      if console_errors:
          raise AssertionError(f"Console errors during solo_smoke: {console_errors[:3]}")
      return {
          "artifacts": [
              "idle.png",
              "idle.json",
              "moving.png",
              "moving.json",
              "settings-open.png",
              "settings-open.json",
          ],
          "details": {
              "idleFps": idle_fps,
              "movingFps": moving_fps,
              "settingsRect": settings_payload["panels"]["settings"]["rect"],
          },
      }
    except Exception:
      if page is not None:
          try:
              _write_page_artifacts(page, artifact_dir, "solo-failure")
          except Exception:
              pass
      raise
    finally:
      browser.close()


def phase_cave_linked_traversal(playwright, base_url: str, artifact_dir: Path) -> dict:
    console_errors: List[str] = []
    browser = playwright.chromium.launch(headless=True)
    page = None
    try:
      page = _open_game_page(browser, base_url, console_errors)
      _wait_for_menu_api(page)
      _start_solo(page)
      pair = page.evaluate("() => window.__isgDiagnostics.spawnQaLinkedCavePair()")
      _write_json_artifact(artifact_dir, "linked-pair.json", pair)
      if not isinstance(pair, dict):
          raise AssertionError("Failed to spawn QA linked cave pair")
      if not pair.get("caveId") or not pair.get("linkedPairId"):
          raise AssertionError(f"Linked cave pair metadata missing: {pair}")
      if pair.get("firstIslandIndex") == pair.get("secondIslandIndex"):
          raise AssertionError(f"Linked cave pair spawned on same island: {pair}")
      cave_summary = _find_cave_summary(pair.get("caveV2", {}), pair["caveId"])
      if not cave_summary:
          raise AssertionError(f"Could not locate cave summary for {pair['caveId']}")
      if cave_summary.get("entryRoomId") == cave_summary.get("linkedSurfaceRoomId"):
          raise AssertionError(f"Linked cave surface exit collapsed into entry room: {cave_summary}")
      if int(cave_summary.get("linkedSurfaceDepth") or 0) < 1:
          raise AssertionError(f"Linked cave exit depth too shallow: {cave_summary}")

      first_entry_return = _drive_linked_cave_cycle(
          page,
          artifact_dir,
          "first-entry-return",
          pair["firstEntranceId"],
          "entry",
          pair["firstEntranceId"],
          cave_summary["entryRoomId"],
      )
      first_to_second = _drive_linked_cave_cycle(
          page,
          artifact_dir,
          "first-to-second",
          pair["firstEntranceId"],
          "linked",
          pair["secondEntranceId"],
          cave_summary["entryRoomId"],
      )
      second_to_first = _drive_linked_cave_cycle(
          page,
          artifact_dir,
          "second-to-first",
          pair["secondEntranceId"],
          "linked",
          pair["firstEntranceId"],
          cave_summary["linkedSurfaceRoomId"],
      )
      if console_errors:
          raise AssertionError(f"Console errors during cave_linked_traversal: {console_errors[:5]}")
      return {
          "artifacts": [
              "linked-pair.json",
              "first-entry-return-enter-summary.json",
              "first-entry-return-entered.png",
              "first-entry-return-entered.json",
              "first-entry-return-travel-entry.json",
              "first-entry-return-after-entry.png",
              "first-entry-return-after-entry.json",
              "first-to-second-enter-summary.json",
              "first-to-second-entered.png",
              "first-to-second-entered.json",
              "first-to-second-travel-linked.json",
              "first-to-second-after-linked.png",
              "first-to-second-after-linked.json",
              "second-to-first-enter-summary.json",
              "second-to-first-entered.png",
              "second-to-first-entered.json",
              "second-to-first-travel-linked.json",
              "second-to-first-after-linked.png",
              "second-to-first-after-linked.json",
          ],
          "details": {
              "pair": pair,
              "cave": cave_summary,
              "firstEntryReturn": first_entry_return["travel"],
              "firstToSecond": first_to_second["travel"],
              "secondToFirst": second_to_first["travel"],
          },
      }
    except Exception:
      if page is not None:
          try:
              _write_page_artifacts(page, artifact_dir, "cave-linked-failure")
          except Exception:
              pass
      raise
    finally:
      browser.close()


def phase_multiplayer_join(playwright, base_url: str, artifact_dir: Path) -> dict:
    console_errors: List[str] = []
    browser = playwright.chromium.launch(headless=True)
    contexts = []
    host = None
    joiner_a = None
    joiner_b = None
    try:
      def open_page():
          page = _open_game_page(browser, base_url, console_errors)
          contexts.append(page.context)
          return page

      host = open_page()
      host.evaluate("() => { window.__isgMenuApi.showPlay(); window.__isgMenuApi.host(); }")
      host.wait_for_function(
          """() => {
              const payload = JSON.parse(window.render_game_to_text());
              return payload.mode === 'game' && payload.multiplayer.isHost && payload.multiplayer.ready;
          }""",
          timeout=50000,
      )
      host.wait_for_timeout(1500)
      host_payload = _write_page_artifacts(host, artifact_dir, "host-ready")
      room_id = host_payload["multiplayer"]["roomId"]
      if not room_id:
          raise AssertionError("Host did not expose a room id")

      joiner_a = open_page()
      joiner_b = open_page()
      join_script = """
        (roomId) => {
          const originalPrompt = window.prompt;
          window.prompt = () => roomId;
          try {
            window.__isgMenuApi.showPlay();
            window.__isgMenuApi.join();
          } finally {
            window.prompt = originalPrompt;
          }
        }
      """
      joiner_a.evaluate(join_script, room_id)
      joiner_b.evaluate(join_script, room_id)

      for idx, page in enumerate([joiner_a, joiner_b], start=1):
          page.wait_for_function(
              """() => {
                  const payload = JSON.parse(window.render_game_to_text());
                  return payload.mode === 'game'
                    && payload.multiplayer.ready
                    && payload.multiplayer.joinPhase === 'playable';
              }""",
              timeout=50000,
          )
          page.wait_for_timeout(1000)
          _write_page_artifacts(page, artifact_dir, f"joiner-{idx}-ready")

      host.keyboard.down("d")
      joiner_a.keyboard.down("s")
      joiner_b.keyboard.down("a")
      host.wait_for_timeout(1000)
      host.keyboard.up("d")
      joiner_a.keyboard.up("s")
      joiner_b.keyboard.up("a")
      host.wait_for_timeout(800)

      final_host = _write_page_artifacts(host, artifact_dir, "host-post-move")
      final_joiner_a = _write_page_artifacts(joiner_a, artifact_dir, "joiner-1-post-move")
      final_joiner_b = _write_page_artifacts(joiner_b, artifact_dir, "joiner-2-post-move")
      for label, payload in {
          "host": final_host,
          "joinerA": final_joiner_a,
          "joinerB": final_joiner_b,
      }.items():
          if payload["multiplayer"]["joinPhase"] not in ("playable", "idle"):
              raise AssertionError(f"{label} is not playable: {payload['multiplayer']}")
      if console_errors:
          raise AssertionError(f"Console errors during multiplayer_join: {console_errors[:5]}")
      return {
          "artifacts": [
              "host-ready.png",
              "host-ready.json",
              "joiner-1-ready.png",
              "joiner-1-ready.json",
              "joiner-2-ready.png",
              "joiner-2-ready.json",
              "host-post-move.png",
              "host-post-move.json",
              "joiner-1-post-move.png",
              "joiner-1-post-move.json",
              "joiner-2-post-move.png",
              "joiner-2-post-move.json",
          ],
          "details": {
              "roomId": room_id,
              "hostStatus": final_host["multiplayer"],
              "joinerAStatus": final_joiner_a["multiplayer"],
              "joinerBStatus": final_joiner_b["multiplayer"],
          },
      }
    except Exception:
      for label, page in [
          ("host-failure", host),
          ("joiner-1-failure", joiner_a),
          ("joiner-2-failure", joiner_b),
      ]:
          if page is None:
              continue
          try:
              _write_page_artifacts(page, artifact_dir, label)
          except Exception:
              pass
      raise
    finally:
      for context in reversed(contexts):
          context.close()
      browser.close()


def phase_multiplayer_cave_linked(playwright, base_url: str, artifact_dir: Path) -> dict:
    console_errors: List[str] = []
    browser = playwright.chromium.launch(headless=True)
    contexts = []
    host = None
    joiner = None
    try:
      def open_page():
          page = _open_game_page(browser, base_url, console_errors)
          contexts.append(page.context)
          return page

      host = open_page()
      host.evaluate("() => { window.__isgMenuApi.showPlay(); window.__isgMenuApi.host(); }")
      host.wait_for_function(
          """() => {
              const payload = JSON.parse(window.render_game_to_text());
              return payload.mode === 'game' && payload.multiplayer.isHost && payload.multiplayer.ready;
          }""",
          timeout=50000,
      )
      host.wait_for_timeout(1500)
      host_payload = _write_page_artifacts(host, artifact_dir, "mp-cave-host-ready")
      room_id = host_payload["multiplayer"]["roomId"]
      if not room_id:
          raise AssertionError("Host did not expose a room id for multiplayer cave test")

      joiner = open_page()
      joiner.evaluate(
          """
          (roomId) => {
            const originalPrompt = window.prompt;
            window.prompt = () => roomId;
            try {
              window.__isgMenuApi.showPlay();
              window.__isgMenuApi.join();
            } finally {
              window.prompt = originalPrompt;
            }
          }
          """,
          room_id,
      )
      joiner.wait_for_function(
          """() => {
              const payload = JSON.parse(window.render_game_to_text());
              return payload.mode === 'game'
                && payload.multiplayer.ready
                && payload.multiplayer.joinPhase === 'playable';
          }""",
          timeout=50000,
      )
      joiner.wait_for_timeout(1500)
      _write_page_artifacts(joiner, artifact_dir, "mp-cave-joiner-ready")

      pair = host.evaluate("() => window.__isgDiagnostics.spawnQaLinkedCavePair()")
      _write_json_artifact(artifact_dir, "mp-linked-pair.json", pair)
      if not isinstance(pair, dict) or not pair.get("linkedPairId"):
          raise AssertionError(f"Failed to spawn linked cave pair in multiplayer: {pair}")
      joiner.wait_for_function(
          """(entranceId) => {
              return window.__isgDiagnostics.hasCaveV2EntranceId(entranceId) === true;
          }""",
          arg=pair["secondEntranceId"],
          timeout=20000,
      )
      joiner.wait_for_timeout(1000)

      host_cycle = _drive_linked_cave_cycle(
          host,
          artifact_dir,
          "mp-host-first-to-second",
          pair["firstEntranceId"],
          "linked",
          pair["secondEntranceId"],
          _find_cave_summary(pair.get("caveV2", {}), pair["caveId"])["entryRoomId"],
      )
      joiner_cycle = _drive_linked_cave_cycle(
          joiner,
          artifact_dir,
          "mp-joiner-second-to-first",
          pair["secondEntranceId"],
          "linked",
          pair["firstEntranceId"],
          _find_cave_summary(pair.get("caveV2", {}), pair["caveId"])["linkedSurfaceRoomId"],
      )

      host.wait_for_timeout(1200)
      joiner.wait_for_timeout(1200)
      final_host = _write_page_artifacts(host, artifact_dir, "mp-cave-host-final")
      final_joiner = _write_page_artifacts(joiner, artifact_dir, "mp-cave-joiner-final")
      for label, payload in {"host": final_host, "joiner": final_joiner}.items():
          mp = payload.get("multiplayer", {})
          if mp.get("joinPhase") not in ("playable", "idle") or not mp.get("ready"):
              raise AssertionError(f"{label} left playable state after multiplayer cave traversal: {mp}")
      if console_errors:
          raise AssertionError(f"Console errors during multiplayer_cave_linked: {console_errors[:5]}")
      return {
          "artifacts": [
              "mp-cave-host-ready.png",
              "mp-cave-host-ready.json",
              "mp-cave-joiner-ready.png",
              "mp-cave-joiner-ready.json",
              "mp-linked-pair.json",
              "mp-host-first-to-second-enter-summary.json",
              "mp-host-first-to-second-entered.png",
              "mp-host-first-to-second-entered.json",
              "mp-host-first-to-second-travel-linked.json",
              "mp-host-first-to-second-after-linked.png",
              "mp-host-first-to-second-after-linked.json",
              "mp-joiner-second-to-first-enter-summary.json",
              "mp-joiner-second-to-first-entered.png",
              "mp-joiner-second-to-first-entered.json",
              "mp-joiner-second-to-first-travel-linked.json",
              "mp-joiner-second-to-first-after-linked.png",
              "mp-joiner-second-to-first-after-linked.json",
              "mp-cave-host-final.png",
              "mp-cave-host-final.json",
              "mp-cave-joiner-final.png",
              "mp-cave-joiner-final.json",
          ],
          "details": {
              "pair": pair,
              "hostTravel": host_cycle["travel"],
              "joinerTravel": joiner_cycle["travel"],
              "hostMultiplayer": final_host.get("multiplayer"),
              "joinerMultiplayer": final_joiner.get("multiplayer"),
          },
      }
    except Exception:
      for label, page in [
          ("mp-cave-host-failure", host),
          ("mp-cave-joiner-failure", joiner),
      ]:
          if page is None:
              continue
          try:
              _write_page_artifacts(page, artifact_dir, label)
          except Exception:
              pass
      raise
    finally:
      for context in reversed(contexts):
          context.close()
      browser.close()


def phase_save_reload(playwright, base_url: str, artifact_dir: Path) -> dict:
    console_errors: List[str] = []
    browser = playwright.chromium.launch(headless=True)
    page = None
    try:
      page = _open_game_page(browser, base_url, console_errors)
      _wait_for_menu_api(page)
      start_payload = _start_solo(page)
      start_pos = (start_payload["player"]["x"], start_payload["player"]["y"])
      page.keyboard.down("d")
      page.wait_for_timeout(1800)
      page.keyboard.up("d")
      page.keyboard.down("s")
      page.wait_for_timeout(900)
      page.keyboard.up("s")
      page.wait_for_timeout(400)
      moved_payload = _write_page_artifacts(page, artifact_dir, "before-save")
      moved_pos = (moved_payload["player"]["x"], moved_payload["player"]["y"])
      delta = ((moved_pos[0] - start_pos[0]) ** 2 + (moved_pos[1] - start_pos[1]) ** 2) ** 0.5
      if delta < 32:
          raise AssertionError(f"Player did not move enough before save test (delta={delta:.1f})")

      saved_payload = page.evaluate("() => window.__isgDiagnostics.saveGameNow()")
      _write_text_artifact(artifact_dir, "save-now.json", json.dumps(saved_payload, indent=2))
      if saved_payload.get("save", {}).get("statusState") == "error":
          raise AssertionError("Save reported error state")

      _reload_and_wait(page)
      page.evaluate("() => { window.__isgMenuApi.showPlay(); window.__isgMenuApi.solo(); }")
      page.wait_for_function(
          """() => {
              const payload = JSON.parse(window.render_game_to_text());
              return payload.mode === 'game' && payload.player && !payload.loadingVisible;
          }""",
          timeout=40000,
      )
      page.wait_for_timeout(1500)
      reloaded_payload = _write_page_artifacts(page, artifact_dir, "after-reload")
      if moved_payload["world"]["seed"] != reloaded_payload["world"]["seed"]:
          raise AssertionError(
              f"Seed changed across reload: {moved_payload['world']['seed']} -> {reloaded_payload['world']['seed']}"
          )
      if moved_payload["inventory"]["fingerprint"] != reloaded_payload["inventory"]["fingerprint"]:
          raise AssertionError("Inventory fingerprint changed across reload")
      if moved_payload["world"]["structures"] != reloaded_payload["world"]["structures"]:
          raise AssertionError("Structure count changed across reload")
      reload_delta = (
          ((reloaded_payload["player"]["x"] - moved_payload["player"]["x"]) ** 2)
          + ((reloaded_payload["player"]["y"] - moved_payload["player"]["y"]) ** 2)
      ) ** 0.5
      if reload_delta > 96:
          raise AssertionError(f"Reloaded player position drifted too far: {reload_delta:.1f}px")
      if console_errors:
          raise AssertionError(f"Console errors during save_reload: {console_errors[:3]}")
      return {
          "artifacts": [
              "before-save.png",
              "before-save.json",
              "save-now.json",
              "after-reload.png",
              "after-reload.json",
          ],
          "details": {
              "seed": reloaded_payload["world"]["seed"],
              "reloadPositionDelta": round(reload_delta, 2),
              "inventoryFingerprint": reloaded_payload["inventory"]["fingerprint"],
          },
      }
    except Exception:
      if page is not None:
          try:
              _write_page_artifacts(page, artifact_dir, "save-reload-failure")
          except Exception:
              pass
      raise
    finally:
      browser.close()


def _phase_mp_autotest(playwright, base_url: str, artifact_dir: Path, mode: str, timeout_ms: int) -> dict:
    console_errors: List[str] = []
    browser = playwright.chromium.launch(headless=True)
    page = None
    label = f"mp-autotest-{mode}"
    try:
      page = _open_game_page(browser, base_url, console_errors)
      _wait_for_menu_api(page)
      _start_solo(page)
      _unlock_debug(page)
      start_summary = _start_mp_autotest(page, mode, clients=3, seed="island-1")
      _write_text_artifact(artifact_dir, f"{label}-start.json", json.dumps(start_summary, indent=2))
      final_payload = _wait_for_mp_autotest_result(page, timeout_ms)
      _write_page_artifacts(page, artifact_dir, f"{label}-final")
      failure_bundle = _read_mp_failure_bundle(page)
      if failure_bundle:
          _write_text_artifact(artifact_dir, f"{label}-failure-bundle.json", json.dumps(failure_bundle, indent=2))
      status = final_payload.get("mpAutotest", {}).get("status")
      if status != "pass":
          fail_reason = final_payload.get("mpAutotest", {}).get("failReason") or "unknown failure"
          raise AssertionError(f"MP autotest {mode} failed: {fail_reason}")
      if console_errors:
          raise AssertionError(f"Console errors during mp_autotest_{mode}: {console_errors[:5]}")
      artifacts = [
          f"{label}-start.json",
          f"{label}-final.png",
          f"{label}-final.json",
      ]
      if failure_bundle:
          artifacts.append(f"{label}-failure-bundle.json")
      return {
          "artifacts": artifacts,
          "details": {
              "mode": mode,
              "step": final_payload.get("mpAutotest", {}).get("step"),
              "elapsed": final_payload.get("mpAutotest", {}).get("elapsed"),
              "logTail": final_payload.get("mpAutotest", {}).get("logTail"),
          },
      }
    except Exception:
      if page is not None:
          try:
              _write_page_artifacts(page, artifact_dir, f"{label}-failure")
              failure_bundle = _read_mp_failure_bundle(page)
              if failure_bundle:
                  _write_text_artifact(
                      artifact_dir,
                      f"{label}-failure-bundle.json",
                      json.dumps(failure_bundle, indent=2),
                  )
          except Exception:
              pass
      raise
    finally:
      browser.close()


def phase_mp_autotest_quick(playwright, base_url: str, artifact_dir: Path) -> dict:
    return _phase_mp_autotest(playwright, base_url, artifact_dir, "quick", 110000)


def phase_mp_autotest_stress(playwright, base_url: str, artifact_dir: Path) -> dict:
    return _phase_mp_autotest(playwright, base_url, artifact_dir, "stress", 420000)


ALL_PHASES = [
    ("boot_ui", phase_boot_ui),
    ("solo_smoke", phase_solo_smoke),
    ("cave_linked_traversal", phase_cave_linked_traversal),
    ("save_reload", phase_save_reload),
    ("multiplayer_join", phase_multiplayer_join),
    ("multiplayer_cave_linked", phase_multiplayer_cave_linked),
    ("mp_autotest_quick", phase_mp_autotest_quick),
    ("mp_autotest_stress", phase_mp_autotest_stress),
]
