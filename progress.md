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

- CaveV2 cleanup: hid room debug lane/trigger overlays and top cave debug summary bar behind hidden flag `state.debugCaveV2Visuals`; removed active-room outline box for normal cave view.

- CaveV2 obstacle pass: upgraded room obstacle generation to place larger deterministic rock-wall clusters/short barriers while preserving path connectivity between exits and room center. Added reserved exit lanes/center buffer and stronger obstacle counts.

- CaveV2 exit readability pass: hard-disabled CaveV2 dev overlays in render, darkened normal inter-room passage mouths, and strengthened only the true surface exit lighting so the exit reads distinctly.

- CaveV2 mobs pass: guaranteed room-local mobs (1–2 per room) via deterministic spawn helper, plus one-time backfill for older generated rooms with saved marker (caveV2MobPopulateVersion) and save persistence of graphDepth/mob populate version.

- CaveV2 mobs pass follow-up: bumped CAVE_V2_MOB_POPULATE_VERSION to 2 and added a deterministic fallback mob spawn tile so older/generated rooms reliably get at least one cave mob even if stricter obstacle spacing rejects normal placement. Also fixed a duplicate const syntax bug in the cave exit light render block.

- CaveV2 surface entrance art pass: replaced the rocky circular cave mouth with a stylized wooden mine-shaft entrance (timber posts/lintel/braces, ramp, dark tunnel mouth, rubble) in the CaveV2 surface render loop.

- CaveV2 bugfix: guaranteed entry-room surface corridor carve + floor-safe spawn fallback for cave entry/transition/load restore; prevents spawning inside wall/freeze at cave entrance.

- House art pass: tropical texture/theme upgrade for shared house render block (hut/small/medium/large, village + player-built) using bamboo/woven wall detail, stronger thatch roof fringe, tropical palettes, and island porch accents.

- Four-pass code-level QA sweep (integrity -> gameplay/state -> save/load+MP -> UI/render) completed. Fixed MP autotest harvest false failures by making dedicated harvest actions fully reliable (including the positioning payload), filtering autotest harvest targets to only harvestable resources, and extending harvest assertion timeout window. Runtime browser/mp validation still pending in a live environment.

- CaveV2 exit visual cleanup: removed dark oval/circle exit marker in cave rooms; kept light-only spill/rays so surface exits read as light openings instead of objects.

- CaveV2 passage freeze fix: bumped passage repair version and strengthened room passage recarve (wider doorway throats + central hub). Added runtime floor-snap fallback in updateCaveV2 if player ends up on a blocked tile.
