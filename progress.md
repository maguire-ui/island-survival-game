Original prompt: Fix CaveV2 so caves use Zelda-style screen-to-screen room transitions (no portals/layers), surface cave entrances look like real cave mouths, and player model/hitbox stay perfectly synced on cave enter/exit. Use the develop-web-game skill workflow and validate with a browser loop.

- CaveV2 emergency fix pass: added player/collision sync proxy updates on cave entry/update/transition and moved/removed CaveV2 player-centered vignette to prevent ghost/radiation look.
- CaveV2 transition hardening: edge boundary snap + side lock anti-bounce + debug lane/boundary visuals added.
- Surface CaveV2 entrances now render as procedural cave mouths (rock rim + shadow + dark interior), replacing the old simple circle look.
- Browser Playwright loop is currently blocked in this shell because node/npx are not installed; cave fixes were validated with code audit + syntax/diff checks only.
- CaveV2 UX cleanup: room-edge debug boxes and CaveV2 debug summary overlay now render only when Debug + World Map view is enabled.
- CaveV2 surface exit changed from E-interact to edge-path auto-exit through the lit exit corridor; prompt updated to movement-based wording.
- CaveV2 entry-room surface exit opening now renders with brighter light spill/glow so it reads as an exit, distinct from normal room passages.

- House visual pass: replaced shared small/medium/large/hut render block with island-themed procedural models (roof variants, porches/stilts, shutters, awnings, blacksmith variant polish). Villages and player-built houses update through the same draw path.
- Playwright/browser validation still blocked in this shell because npx is missing; validated with code inspection + syntax/diff checks.

- Chest visual pass: replaced in-world chest render with clearer stylized chest model (arched lid, wood slats, iron bands, latch, feet, shadow) for stronger readability/intuition.
