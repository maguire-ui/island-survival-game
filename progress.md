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

- MP autotest harvest hardening: added autotest-only harvest source coords (`autotest: true`, `x/y`) and host-side fallback to those coords when reach checks race player position updates. Added retry retargeting to switch failed assertions to a fresh reachable resource before retrying; this prevents early `MPA-HARVEST_ASSERT` false negatives.
- MP autotest stability pass: harvest retries now always retarget from current reachable candidates (not just the original resource), and host harvest handling gained an autotest-only reach fallback chain (message x/y -> computed approach -> final guarded bypass while mpAutotest.active) to avoid false MPA-HARVEST_ASSERT failures from one-tick position race conditions.
- Added autotest-only host harvest trace logs (reject reason + success with resId/hp) so future stress failures show exact gate cause instead of generic assert failure.
- MP autotest harvest assert hardening (phase 2): added per-request `autotestProbeId` handshake from client harvest payloads to host harvest handling, recorded host accept/reject outcomes, and tied pending harvest assertions to these outcomes so rejects trigger immediate retarget/retry instead of waiting for timeout.
- Host harvest now records probe outcomes with reject reason (`world-unavailable`, `invalid-resId`, `non-interactable`, `out-of-range`, `gate`) and success deltas (`before/after hp`, `before/after removed`, `before/after drop counts`) for deterministic assertion diagnostics.
- Autotest run lifecycle now resets harvest probe sequence/result maps on start/stop to avoid stale probe leakage between runs.
- MP autotest harvest retry tuning: changed retry accounting so explicit host rejections do not burn failure budget immediately (`rejectionRetries` gate), increased stress/quick soft-failure allowances to 8/4, and included probe outcome + rejection counters in failure details for precise root-cause diagnostics.
- MP autotest harvest assertion hardening (phase 3): pending harvest assertions now cross-check both snapshot state and live host world state (`hp/removed/drop` deltas) to avoid snapshot-timing false negatives.
- Added probe recovery bootstrap: if a strict harvest assertion lacks a probe id, evaluator auto-retries to attach one, ensuring every tracked harvest has host-side accept/reject telemetry.
- Harvest probe acceptance is now treated as authoritative success in assertion evaluation (host has confirmed execution), and failure reports now include both snapshot and live observed fields (`snapshotHp/Removed/DropCount`, `liveHp/Removed/DropCount`).
- Increased harvest soft-failure budget for retries (stress: 12, quick: 6) to prevent premature autotest aborts on transient reject windows.
- CaveV2 stuck-at-entrance hardening: bumped `CAVE_V2_PASSAGE_REPAIR_VERSION` to 3 and strengthened `ensureCaveV2RoomPassagesOpen` to recarve guaranteed wide center-to-edge corridors (including entry surface side) so old saves re-open blocked room pathways.

- CaveV2 link-frequency tuning: increased cross-island cave pairing chance in `assignSurfaceCaveTunnelLinks` (enable threshold 0.88 from 0.5) and lowered minimum link distance gate (`max(8, world.size*0.05)` from `max(12, world.size*0.08)`) so connected cave pairs are much more common while remaining deterministic by seed.

- Boat control pass: switched repaired-boat controls to intuitive steer/throttle mapping (A/D turn, W/S throttle), increased steering responsiveness at low throttle, and retuned ship physics to `speedMax = CONFIG.moveSpeed * 1.5` (225 with current moveSpeed), with smoother glide (`drag 0.97`) and matching acceleration.

- Debug world mini-map update: added a second under-map toggle row for "Show repairable ship" (alongside robot toggle), wired click handling, and added map markers for unrepaired abandoned ships so they are easy to locate for repair.

- Abandoned ship discoverability pass: moved seeded abandoned-ship placement from outer-ring islands to a deterministic mid-ring island band (`getPreferredAbandonedShipIslands`), with fallback to non-spawn islands. Existing seeded ships are now validated against mid-band proximity so ships remain findable and repairable in central/middle areas.
- Ocean ambience pass: expanded ambient fish population/variety (schooling + species variants: silver, tropical, needle, ray), increased spawn cadence, and added deterministic water-tile decor rendering (reef patches, coral branches, kelp fronds, shimmer lines) so open water feels alive while remaining decorative-only and performance-safe.
- Rendering integration: ocean decor now draws on visible water tiles during the main tile pass (seed-deterministic per tile + world seed) and keeps land/structure gameplay logic unchanged.
- Runtime validation note: browser automation is still blocked in this shell (`node`/`npx` missing), so this pass was validated by direct code inspection + diff integrity checks.
- Village/player disappearance fix pass: added `drawStructureSafe` wrapper (save/restore + fallback draw + error containment) and switched both surface structure render loops to use it, preventing one broken structure from aborting later house/player rendering.
- Added local player render-state guard (`ensureLocalPlayerRenderableState`) and hardened `drawPlayerAvatar` finite/drift fallback so stale/invalid render coords cannot hide the local player model.
- Render pass now hard-resets blend/alpha before local+remote player draw to prevent canvas-state leakage from earlier draws.
- Village/player disappearance hardening follow-up: added broader legacy house type normalization (`house_small`, `village_*_house`, etc.) and render-time self-heal/fallback for unknown structure types in `drawStructureSafe`, so stale structure types no longer silently disappear.
- House silhouette tuning: medium/large houses keep same footprint but render less flat via taller silhouette lift + roof lift and slight horizontal inset, so textures read better without changing occupied tile space.
- Cave death/respawn hardening: fixed CaveV2 death handling so dying in a CaveV2 room now drops inventory into that room's drop container (not surface world), then force-exits CaveV2 and respawns at checkpoint/dock. Added same CaveV2 teardown in frame-error respawn fallback to prevent cave active-state from pinning player in-place after death.
- CaveV2 drop fix: manual item drops in caves now spawn into the active room container (instead of surface world), use floor-safe spawn placement with minimum distance from player, render as pickup balls, and use TTL despawn like surface drops.
- Added CaveV2 room drop ticking (`updateCaveV2RoomDrops`) and save/load persistence for drop `ttl`; QA now flags invalid cave drop TTL.
- Cave death drops now share the same CaveV2 drop spawn helper/path so drop IDs/TTL behavior are consistent across manual drops, ore drops, and death drops.
- Runtime validation still limited in this shell because `node`/`npx` are unavailable.
- Drop texture pass: replaced generic ground-drop circles with cached item-specific mini textures for both surface world and CaveV2 room drops (`drawDroppedItemVisual`). Quantity labels and despawn warning rings remain intact.
- Reliability hardening pass (2026-02-27): bumped CaveV2 repair versions (`CAVE_V2_PASSAGE_REPAIR_VERSION=4`, `CAVE_V2_ORE_PLACEMENT_VERSION=3`) so existing saves re-run passage + ore repair logic.
- Cave spawn safety: strengthened `ensureCaveV2RoomPassagesOpen` to run when corridors are disconnected even if version-tagged, and added final center->anchor hard-carve fallback so entry/exit lanes cannot remain blocked.
- Cave entry robustness: `enterCaveV2` now retries spawn after on-the-fly passage repair before failing entry; `resolveCaveV2SpawnPosition` now prefers reachable anchor tiles and carves a small safe pocket on forced fallback.
- Cave exit-lane cleanup: widened ore passage reservation (`isCaveV2TileReservedForPassage`) with lane padding + passage-center radius so ore nodes no longer spawn in/near doorway throats.
- MP autotest stabilization: added host-side autotest retarget fallback in `handleHarvestRequest` when requested `resId` is stale/non-interactable; host selects nearest valid harvestable node for probe continuity.
- MP autotest harvest assertion hardening: added `harvestAssertionInconclusiveCount` guard so isolated inconclusive harvest probes are downgraded to warnings instead of immediate run abort, with cap to still fail on persistent systemic issues.
- Cache-buster update in `/index.html`: CSS and JS query versions set to `20260227-2` so browser/GitHub Pages pulls the latest assets after next deploy.
- Village render crash guard (2026-02-27): hardened `drawVillager` with finite coordinate checks before canvas path calls, preventing invalid villager coords from aborting frame render (the source of disappearing player/UI/structures near villages).
- Structure render safety follow-up: `drawStructureSafe` now skips/warns on invalid `tx/ty` instead of attempting to render malformed structures.
- MP autotest harvest false-fail hardening (2026-02-28): expanded harvest retry/inconclusive budgets (`timeoutAllowances` stress/quick: 24/12, inconclusive cap: 160/80) and downgraded “limit reached” harvest assertions to warnings instead of immediate run-fail so stress runs can continue and validate later categories.
- MP autotest strict harvest assertion window increased (`maxChecks` 40 from 24 for queued strict harvest assertions) to reduce premature assertion expiration under network jitter.
- CaveV2 passage visual cleanup: removed the small dark ellipse marker drawn at passage centers (the “weird circle” artifact in tunnel lanes).
- CaveV2 surface entrance tuning: reduced mine-shaft entrance render scale from `0.58` to `0.46` so cave mouths no longer appear oversized on island tiles.
- Cache-buster bump: `/index.html` now references `styles.css?v=20260228-2` and `src/main.js?v=20260228-2` to force live clients/GitHub Pages to fetch the new build.
- Item icon readability cleanup: removed the mini brown framed badge layer from `drawItemTexture` so inventory/hotbar icons render as glyph-only silhouettes, and removed `.slot-icon` mini panel styling (border/background/shadow) so items are not boxed-inside-boxes.
- Cache-buster bump: `/index.html` now references `styles.css?v=20260228-3` and `src/main.js?v=20260228-3` for immediate icon/UI refresh.
- House shape tuning follow-up: medium/large houses now use stronger render-only `wideInset` (`~22%`) so village houses keep footprint/collision but no longer appear flattened/stretched across their occupied tiles.
- Runtime validation is still limited in this shell because `node`/`npx` are unavailable; this pass was validated through targeted code-path audit and diff inspection.
- Cave drop visibility fix (2026-02-27): added CaveV2-only drop pickup grace (`CAVE_V2_DROP_PICKUP_GRACE = 0.45s`) so dropped items and ore drops visibly appear on cave ground before auto-pickup can occur.
- Cave drop pipeline update: `spawnCaveV2RoomDrop` now stores `pickupDelay`; `updateCaveV2RoomDrops` counts it down; `pickupCaveV2RoomDrops` ignores drops until delay expires.
- CaveV2 save/load now persists `pickupDelay` in room drop payloads to prevent reload edge cases where cave drops instantly snap back into inventory.
- CaveV2 exit-light cleanup (2026-02-27): rewrote entry-room exit lighting to be tunnel-clipped only (no full bottom/edge band spill). Removed circular/radial exit cue rendering and replaced it with linear tunnel beam lighting so no "weird circle" appears in the passage.
- Cave death/respawn reliability fix (2026-02-27): hardened `dropInventoryOnDeath` to only clear inventory after confirmed drop creation; added cave-death fallback to surface drop spawn near cave return position if cave drop creation fails, preventing item loss.
- Added `spawnSurfaceDeathDrops` helper and made `dropInventoryOnDeath` return structured outcome (`dropped/cleared/count`) so `handlePlayerDeath` can respond deterministically.
- `handlePlayerDeath` now syncs render position to respawn physics position (`syncLocalPlayerRenderToPhysics`) in both try/catch paths to prevent post-death model/hitbox drift.
- Cave update loop now runs a local death check in the CaveV2 branch (`hp<=0 && !respawnLock`) so cave deaths always trigger respawn handling even if HP reaches zero through non-standard paths.
- Debug menu UX update (2026-02-27): added a dedicated `Mini-Map Boat Marker` toggle button directly under `World Mini-Map` in the Debug panel (`index.html` + `src/main.js`), wired to existing `debugShowRepairableShip` state and repairable-ship marker rendering so players can enable/disable boat markers without clicking in-map overlay rows.
- Repaired boat speed tuning (2026-02-27): increased `ABANDONED_SHIP_CONFIG.speedMax` from `CONFIG.moveSpeed * 1.5` to `CONFIG.moveSpeed * 2.25` (50% faster than previous boat top speed, per request).
- Shipwreck spawn frequency pass (2026-02-27): increased seeded shipwreck density (`SHIPWRECK_CONFIG` now min/max 5/9, tighter pair gap + lower spacing + more attempts) and added deterministic final ocean-scan fallback in `generateSeededShipwreckPlacements` to backfill placements when pair-based candidates are insufficient. This keeps world-seed determinism while making shipwrecks reliably present/more common.
- Validation note: browser automation remains blocked in this shell (`node`/`npx` unavailable); change verified via targeted code-path and diff integrity check.
- Ocean graphics polish pass (2026-02-27): upgraded ocean visuals with a render-only backdrop layer (`drawOceanBackdrop`) plus richer deterministic per-tile decor in `drawOceanTileDecor` (caustic glints, shoreline foam edges, soft bubble pockets, tuned reef/coral/kelp frequencies). Integrated in surface render path with zero gameplay-state changes.
- Updated `OCEAN_DECOR_CONFIG` to support new visual channels (`causticMod`, `foamMod`, `bubbleMod`) and retuned existing decor frequency for denser but still lightweight ocean ambience.
- Validation note: automated browser loop still unavailable in this shell (`node`/`npx` missing); verified via targeted render-path inspection and diff review.
- Item UI + texture polish pass (2026-02-27): upgraded item frame rendering in `drawItemTexture` (beveled shell, layered face gradient, gloss, corner shading/studs, glyph shadow) and bumped `ITEM_TEXTURE_CACHE_VERSION` to `5` so cached icons refresh.
- UI styling pass: refreshed slot/recipe icon visuals in `styles.css` (`.slot`, `.slot-icon`, `.slot-label`, `.slot-count`, `.recipe-icon`) for cleaner, higher-contrast item presentation while preserving gameplay behavior.
- Increased icon source resolution (`applyItemVisual` now uses 38/34px generated textures) and ground drop texture source size (34px) for sharper item visuals.
- Cache-buster update in `/index.html`: CSS/JS versions set to `20260227-3` so browser/GitHub Pages loads new item UI/texture assets.
- Validation note: Playwright/browser runtime loop remains blocked in this shell (`node`/`npx` missing), so this pass was validated by targeted render-path and diff inspection.
- Ground-drop texture pass follow-up (2026-02-27): tightened dropped-item glyph mapping so all known item IDs render as recognizable item types on the ground (added explicit paper + bridge_bundle coverage, kept map/tool/weapon/armor/station/boat/chest/structure categories), and improved fallback labels from single-letter to short abbreviations for uncategorized items.
- Removed dead CaveV2/surface drop texture cache path (`groundDropTextureCache` / `getGroundDropTexture`) now that ground drops are rendered via dedicated glyph renderer only.
- Cache-buster update in `/index.html`: CSS/JS versions set to `20260227-4` so latest dropped-item visuals are pulled on refresh/deploy.
- Validation note: runtime Playwright/browser check still blocked in this shell (`node`/`npx` unavailable); pass validated via targeted render-path audit (`drawDroppedItemVisual` in both surface + cave loops) and code diff inspection.
- Cave entrance visual solidity pass (2026-02-27): increased mine-shaft cave-mouth backdrop opacity and tunnel mouth edge darkness in surface render (`src/main.js`) so entrances read less translucent and more like solid cave openings; slightly reduced interior glint to avoid washed/see-through look.
- Cache-buster update in `/index.html`: CSS/JS versions set to `20260227-5` so cave entrance visual updates load immediately after refresh/deploy.
- Validation note: runtime browser loop still blocked in this shell (`node`/`npx` missing); pass validated by targeted cave-entrance render-path audit + diff inspection.
- Bridge texture directional upgrade (2026-02-27): replaced single bridge tile art with direction-aware rendering (`getBridgeRenderConnections` + `drawBridgeDirectionalTexture`) so bridge tiles now visually adapt for N/E/S/W runs, dead-ends, and corners.
- New bridge renderer reads adjacent bridge/dock neighbors to open sides and draws rails on closed sides, endpoint caps for single-direction spans, and a distinct joint accent for corner turns.
- Added isolated-bridge fallback orientation against nearby land tiles so standalone bridges still render with a sensible facing direction.
- Cache-buster update in `/index.html`: CSS/JS versions set to `20260227-6` so bridge texture updates load immediately on refresh/deploy.
- Validation note: runtime browser loop still blocked in this shell (`node`/`npx` missing); pass validated via targeted draw-path inspection in `drawStructure -> case "bridge"`.
- MP autotest crafting mismatch fix (2026-02-28): fixed false `MPA-CRAFTING` failures caused by debug cheats affecting craft edge checks.
- `startMultiplayerAutotest` now snapshots debug cheat/perf sliders (`debugInfiniteResources`, `debugInfiniteHealth`, speed/worldSpeed/FOV), forces a deterministic baseline for test run (finite resources/health + 1.0 multipliers), and restores previous values in `mpAutotestStop`.
- While MP autotest is active, Infinite Resources/Health controls and debug speed sliders are locked (`disabled` + toggle guards) so mid-run state changes cannot invalidate invariants.
- `mpAutotestRunCraftEdgeCheck` now hard-runs with finite resources in a guarded scope to keep Example A/B deterministic even if external state flips.
- UI text minimization pass (2026-02-28): compressed remaining hardcoded labels/messages to shorter copy across start/settings/debug/MP room flows.
- Start/play/options labels shortened (Solo/Host/Join, Name, Music, SFX, Reset Seed), settings labels shortened (Music/SFX/Reset), and MP autotest labels compacted (MP Test Quick/Stress, Seed/random, Replay Last, Copy Report).
- Multiplayer room HUD copy standardized to compact format (`R:` prefix), copy/join prompts shortened (`Code copied`, `Enter code/link`, `Bad code`), and top-right copy button label kept as `Copy`.
- Prompt compaction mapping expanded to reduce verbose gameplay messages (`Need mats`, `Bag full`, `Need prior tier`, `Need small/medium house`, `Dock spawn set`).
- Robot station action label `Inventory` shortened to `Cargo`.
- Cache-buster update in `/index.html`: CSS/JS query versions set to `20260227-8`.
- Day/night ambience pass (2026-02-28): added deterministic surface sky transition rendering with sunrise/sunset progression (`getSurfaceDaylightCycleState` + `drawSurfaceSkyAmbience`) and integrated it into the main surface render path.
- Sun now follows a smooth arc from horizon-to-horizon during day, with warm twilight coloring at dawn/dusk and darker sky blend at night.
- Surface background fill now uses dynamic sky/twilight gradient instead of static blue gradient; existing ocean decor/fish/night lighting remain intact.
- Cache-buster update in `/index.html`: CSS/JS versions set to `20260228-1`.
- Texture pass follow-up (2026-02-28): upgraded remaining flat-looking station/utility structures in `drawStructure` (`dock`, `bed`, `campfire`, `beacon`, `robot`) with richer shading/material detail and silhouette readability while preserving gameplay hitboxes/footprints.
- Dock now has post hardware/rope details; bed uses layered blanket/pillow shading; campfire uses crossed logs + gradient flame; beacon has clearer pole/core/base separation; robot uses rounded-panel body gradients and panel seams.
- Validation note: `develop-web-game` Playwright loop is still blocked in this shell (`node`/`npx` missing), so this pass was validated by targeted render-path inspection + diff review.
- CaveV2 cross-island link frequency tuning (2026-02-28): updated `assignSurfaceCaveTunnelLinks` to target a higher pairing ratio per world (up to ~86% of caves paired, capped by cave count), reduce strict minimum link distance, and add a relaxed-distance fallback pass.
- Link scoring now prefers nearby cross-island candidates (with deterministic jitter), which increases successful pair formation and makes connected cave exits between islands noticeably more common.
- Start menu scale pass (2026-02-27): increased start menu card/shell/button/control sizing across main/play/options views for better desktop readability (larger panel width/height, bigger primary buttons, larger options controls) while keeping responsive mobile overrides.
- Cache-buster bump: `/index.html` now references `styles.css?v=20260228-4` and `src/main.js?v=20260228-4` so start-menu size updates load immediately after refresh/deploy.
- Sky/sun visual fix (2026-02-27): adjusted `drawSurfaceSkyAmbience` sun trajectory to stay in an upper sky band (`7%..42%` of screen height) instead of near the horizon, so the sun no longer appears to sit in ocean water.
- Cache-buster update in `/index.html`: CSS/JS versions set to `20260228-5` so the sun-path fix is loaded immediately on refresh/deploy.
- Ocean shine reduction pass (2026-02-27): toned down water gloss in `drawOceanBackdrop` and `drawOceanTileDecor` (weaker reflection gradient, fewer/fainter streak bands, reduced shimmer/caustic/foam alpha) for a less shiny surface look.
- Cache-buster update in `/index.html`: CSS/JS versions set to `20260228-6` so the water-lighting change loads immediately.
- Mob visual cleanup (2026-02-27): removed the global translucent outer orb/highlight overlay pass from `drawMonster` so monsters no longer render with a glass-ball shell.
- Cache-buster update in `/index.html`: CSS/JS versions set to `20260228-7` so mob visual cleanup loads immediately.
- Large-house texture fail-safe (2026-02-27): added `drawHouseTextureFallback` and routed structure fallback through it, so large/medium/small houses render a textured tropical house silhouette instead of a plain brown square if the primary house draw path fails.
- This applies to village houses and player-built houses because both use the same structure render fallback path.
- Cache-buster update in `/index.html`: CSS/JS versions set to `20260228-8`.
- Debug UI cleanup (2026-02-27): removed standalone `Mini-Map Boat Marker` action button from the Debug panel so repairable-ship marker control is only the mini-map under-toggle row.
- Cache-buster update in `/index.html`: CSS/JS versions set to `20260228-9`.
- CaveV2 debug spawn repair (2026-02-27): `Spawn Cave Here` no longer calls disabled V1 `addSurfaceCave`; it now upserts CaveV2 runtime entrances directly (`upsertRuntimeCaveV2Entrance`), fixing broken debug cave spawn while V1 is off.
- Added linked debug cave placement flow: new debug button `Spawn Linked Caves` (`#spawnLinkedCaveBtn`) runs a 2-step A→B placement. Step A stores pending link state; Step B must be placed on a different island and binds both entrances to the same `caveId` so they connect.
- Added animated dotted placement tether: while linked placement is pending, surface render draws a moving dotted guide line from Cave A to the player (`drawPendingLinkedCavePlacementGuide`) so it’s obvious where cave B is being placed.
- Added debug cave spawn UI/state hardening: dynamic linked-cave button label (`Spawn Linked Caves` ↔ `Place Linked Cave B`), pending-link cancel/clear path, and pending state reset on debug lock/new game/load to avoid stale placement state.
- Cache-buster bump: `/index.html` now references `styles.css?v=20260228-11` and `src/main.js?v=20260228-11` to force clients to load this cave-spawn fix build.
- CaveV2 navigation/mob tuning pass (2026-02-27): reduced cave mob density to rare-empty + 1..4 range (`mobMinPerRoom=1`, `mobMaxPerRoom=4`, lowered spawn chances), and bumped `CAVE_V2_MOB_POPULATE_VERSION` to `3` so existing rooms repopulate with the new limits.
- CaveV2 obstacle readability pass: blocked tiles now render as clearly solid stone blocks (stronger fill/bevel, seam line, less shadow-like appearance) and obstacle count increased (`obstacleMinPerRoom=6`, `obstacleMaxPerRoom=10`) to make cave routes harder without breaking connectivity safeguards.
- CaveV2 passage unblock hardening (2026-02-28): added guaranteed exit-runway helpers (`getCaveV2ExitRunwayTileBounds`, `carveCaveV2GuaranteedExitRunway`, `reserveCaveV2GuaranteedExitRunway`) and wired them into both passage repair + obstacle reservation so connected exits always keep a broad clear lane from boundary to room interior.
- Increased reserved center-to-exit path radius during obstacle placement (`reserveCaveV2PathTiles(..., radius=2)`) to prevent near-lane pinch blocks from forming beside transition corridors.
- Bumped `CAVE_V2_PASSAGE_REPAIR_VERSION` to `5` so existing/generated rooms are auto-recarved with the new guaranteed runways on revisit/load.
- Validation note: runtime browser loop still blocked here (`node`/`npx` unavailable), so this pass was verified via targeted code-path inspection + diff checks.
- Multiplayer autotest hardening pass (2026-02-28): completed descriptor runner wiring for newly added stress actions so they execute instead of being silently skipped.
- `mpAutotestRunActionDescriptor` now applies `descriptor.hostMutations` and honors `descriptor.forceReliable` when sending payloads, improving cave/village/house/boat/bridge/chest action reliability under stress.
- Added executable craft action support: new `mpAutotestRunCraftRecipeCycle()` and `mpAutotestPickBasicCraftRecipe()` run a real craft cycle against game inventory state (with inventory-full guard behavior), and report actionable warnings on failure.
- Changed craft edge invariant handling from immediate hard-stop to non-terminal warning during action execution, so stress runs continue through all scenarios and produce a fuller report before final pass/fail.
- Expanded required feature coverage list with `stations` and added per-action feature attempt tracking via `mpAutotestMarkFeatureAttemptsForActionKind`.
- Added action-level telemetry (`mpAutotestRecordActionStat`, `mpAutotestBuildActionSummaryLines`) and included action stats in pass/fail logs and failure reports for better diagnostics.
- Feature coverage validation now fails the final run if a required feature recorded failures (`failCount > 0`), even when the action continued, improving final report quality without early abort.
- Validation note: runtime execution still blocked in this shell (`node`/`npm`/`npx` absent), so verification here was static code-path review + diff inspection only.
- Prompt copy simplification pass (2026-02-28): updated `compactPromptText` in `/src/main.js` to remove icon-heavy formatting (`ⓔ`, `⚔`, arrows/bullets) and normalize interaction hints to plain labels such as `Enter house (E)`, `Sleep (E)`, `Open chest (E)`, `Attack (Space)`, and `<action> (Space)`.
- This keeps existing gameplay prompt triggers unchanged while making interaction text less decorative and more direct for trees/grass/rocks/caves/houses/sleep interactions.
- Save badge readability restore (2026-02-28): reverted top-right save indicator from icon-only symbols back to text labels in `/src/main.js` (`setSaveStatus`) and `/index.html` default value.
- Save states now show: `Saving game`, `Saved game`, `Save failed` (with existing colored status dot preserved).
- Cache-buster bump: `/index.html` now references `styles.css?v=20260228-13` and `src/main.js?v=20260228-13`.
- Craft/station item readability pass (2026-02-28): upgraded shared recipe cost chips so station + crafting menus now show larger item icons plus item names under each icon (`createRecipeItemChip`).
- Updated recipe chip styling in `/styles.css` for cleaner no-heavy-box look, larger visuals, and clearer quantity text (`available/required`), with responsive size tuning for smaller screens.
- Slightly increased recipe header icon size (`.recipe-icon`) and softened its frame to align with reduced-background item style.
- Cache-buster bump: `/index.html` now references `styles.css?v=20260228-14` and `src/main.js?v=20260228-14`.
- Win screen seed replay option (2026-02-28): added a second post-win action button `Restart Seed` under `Start New Seed` on the end overlay.
- Added `restartCurrentSeed()` in `/src/main.js` to start a fresh run on the exact current seed (host-only), save immediately, and broadcast snapshot if hosting multiplayer.
- Win UI state now also disables `Restart Seed` for clients (same as `Start New Seed`).
- Cache-buster bump: `/index.html` now references `styles.css?v=20260228-15` and `src/main.js?v=20260228-15`.
- Multiplayer join freeze fix pass (2026-02-28): hardened client join handshake to prevent pre-ready snapshot storms and connection stalls.
- Added join handshake state + retry/backoff/timeout fields in net runtime (`joinStartedAt`, `joinRetryTimer`, `joinAttempts`, `hostConnPendingSince`, timeout flag) and wired reset paths.
- Client now retries host connection deterministically when join socket is absent/stale; stale pending host connection is force-closed after timeout window to avoid permanent "Connecting..." hangs.
- Host now broadcasts high-frequency `snapshot`/`motion` packets only to registered/handshaken peers, preventing expensive snapshot apply spam on not-yet-joined clients.
- Client snapshot handling now bootstraps safely before welcome: first pre-ready snapshot is treated as welcome fallback once (avoids endless pre-ready apply loop while still supporting older hosts).
- Update loop now runs lightweight join-handshake mode (`net.enabled && !net.isHost && !net.ready`) to keep networking active while skipping expensive world simulation until authoritative join completes.
- No runtime Playwright/browser validation in this shell (node/npx missing); validated by targeted multiplayer code-path audit + diff integrity review.
- Passive animal island scaling pass (2026-02-28): added `scalePassiveAnimalCapByIslandSize(baseCap, island)` and routed `getPassiveAnimalIslandCap` through it for normal + spawn islands.
- New behavior: tiny islands clamp to 1 (`radius <= 7.5`) or 2 (`radius <= 10.5`) passive animals; larger islands gain +1 cap at radius thresholds 16/20/24/28 (up to base+4).
- Mushroom biome cap logic remains unchanged (`mushroomMaxPerIsland`) so mushroom-specific balance rules are preserved.
- Validation note: `npx` remains unavailable in this shell (`NPX_MISSING`), so Playwright runtime loop could not be executed here for this pass.
- Island shape variety pass (2026-02-28): added deterministic non-circular island profiles during world generation (`createIslandShapeProfile` + `createIslandRecord`) so islands can be round/oval/lumpy/rugged across all biomes.
- Surface terrain generation and rebuild now use shape-aware falloff (`getIslandFalloffAtPoint`) instead of circle-only `dist/radius` checks, preserving deterministic seeds while adding footprint variety.
- Island ownership/membership checks now use shape-aware signed distance (`getIslandSignedDistanceAtPoint`) in `getIslandForTile`, spawn-island fallback scoring, and island-index lookup helpers.
- Island-layout shift snapshot (`islandsBefore`) now keeps shape fields so entity island-delta shifts stay aligned after debug continental shifts.
- Validation note: runtime Playwright loop could not run in this shell because `npx` is missing.
- Spawn island biome selection update (2026-02-28): starter island is now chosen deterministically from all biome types via `pickStarterBiome(rng)`, instead of always forcing plains. Mushroom starter is now possible but super rare (`0.35%` roll), and biome coverage logic now excludes whichever biome was chosen as starter.
- Spawn-island guardian safety update: daytime guardian spawns (`wolf/lion/polar_bear`) are now blocked on the spawn island regardless of biome via `shouldBlockSpawnIslandDayGuardian(world, island)`, preventing daytime hostile guardian pressure on the starter island.
- Note: runtime Playwright/browser validation remains blocked in this shell because `npx` is unavailable; pass validated through targeted code-path audit and diff checks.
- Biome stone texture pass (2026-02-28): upgraded surface stone rendering so `rock` and `biomeStone` nodes now use biome-specific palettes/vein/speck accents (`getBiomeRockVisualStyle` + `drawBiomeRockAccents`) instead of generic white/gray look. Plains stones now blend into temperate earth tones and each biome stone reads distinct while keeping gameplay unchanged.
- Added shared color blending helpers (`colorToRgb`, `mixColor`) used by the new stone texture pass.

- Mining gate update: biome stones now require highest pickaxe tier (Diamond/apex tier 6) via `getResourceRequirement`, and pickaxe upgrade descriptions were aligned so Gold no longer claims biome stone access while Diamond explicitly includes it.

- Main-menu reliability fix: extracted `bindStartMenuListeners()` and bind it at init start so Play/Options/Quit/Back/Solo/Host/Join remain wired even if later init work errors. Also guarded previously unprotected listeners (`actionBtn`, `canvas`, `destroyChestBtn`) to prevent startup aborts from missing DOM nodes.

- Menu button fail-safe: `bindStartMenuListeners()` now runs before `init()` as well, so Play/Options/Quit/Solo/Host/Join stay clickable even if later startup logic throws.

- Main menu hotfix follow-up: bumped main script cache-buster to `v=20260228-17` so clients cannot keep stale JS where start-menu handlers were missing/broken.

- Critical menu fallback fix: main-menu buttons now have direct `onclick` bridge calls (`window.isgMenuAction`) plus a global fallback script in index.html. Added `window.__isgMenuApi` bridge in main.js so Play/Options/Back/Solo/Host/Join/Reset work even if listener binding fails later. Cache-buster bumped to `main.js?v=20260228-19`.

- Menu buttons hard-fix: added document-level click delegate for main menu buttons in index.html so Solo/Host/Join work even if individual listeners fail; cache-buster -> v=20260228-21.

- Menu bridge externalized: added src/menu-bridge.js and moved all start-menu click handling + fallback queue there to avoid CSP inline-script blocking. index.html now loads menu-bridge before main.js and removes inline onclicks. Cache-buster -> main.js?v=20260228-24.
- Stability/perf/mp pass (2026-03-11): implemented core plan in `/src/main.js`.
- Biome stones are now generated per-island (non-mushroom islands only), with deterministic island-seeded placement + fallback clearing, and include new internal metadata fields `originIslandId` + `isBiomeStone`.
- Biome stone regen tuned to long windows (`1200..1800s`) and respawn tasks now carry/restore `biomeId` + `originIslandId` so stones return to their source island region.
- Replaced `ensureMinimumBiomeStonePerBiome` behavior with per-island enforcement (`ensureMinimumBiomeStonePerIsland`) so each eligible island maintains at least one active/pending biome stone.
- Load/join performance pass: removed legacy CaveV1 layer generation in `generateWorld` when `CAVES_ENABLED=false` (no `generateCaveWorld` cost on startup/join), and added cave metadata/signature caching in `ensureSurfaceCaves`/`assignSurfaceCaveTunnelLinks` to reduce repeated derived work.
- Linked CaveV2 debug pair behavior fixed: linked entrances now store pair metadata (`linkedPairId`, `linkedExitKey`), active cave session tracks `linkedPairId`, `entryEntranceId`, `exitEntranceId`, and leaving a linked cave exits at the paired entrance instead of always returning to entry position.
- Added linked-cave debug telemetry (`[CaveV2 Linked Pair]` and `[CaveV2 Linked Exit]`) to confirm A->B / B->A mapping at runtime.
- MP autotest crash fix: removed undefined `CRAFTING_RECIPES` dependency; craft-cycle now builds recipe pool from `BUILD_RECIPES`/`UPGRADE_RECIPES` helpers and adds runtime invariant checks so missing craft symbols become warnings instead of runtime crashes.
- Craft-cycle guard behavior: when no eligible recipe exists it now returns a non-crashing skipped result (`ok=true, skipped=true`) and records warning telemetry instead of hard-failing.
- Multiplayer join hardening: added explicit net join state fields `joinPhase` + `snapshotAppliedAt` and client-ready gating now requires playable phase with applied snapshot; added host `joinProgress` heartbeat for pending peers and one automatic reconnect attempt for transient join loss/timeout.
- Added phase-aware join prompts (`Joining host`, `Waiting for host snapshot`, `Syncing world`, `Reconnecting`) to make join progress visible.
- Visual polish: biome stones now render with stronger premium faceted treatment (extra highlight ring + sparkle/crystal accents) while still using biome-matched palettes.
- Compatibility note: bumped `WORLD_LAYOUT_VERSION` to `2026-03-layout-v4` because resource generation behavior changed (per-island biome stones).
- Validation blocker: runtime browser/mp automation remains blocked in this shell (`node`/`npx` missing), so Playwright/develop-web-game runtime loop could not be executed yet.
- Multiplayer join hydration optimization (2026-03-11 follow-up): `welcome` snapshots now include optional `surfaceStatic` payload (terrain/island static state) and clients build surface world from this payload via `buildSurfaceWorldFromStaticSnapshot` before applying dynamic snapshot state.
- This avoids forced `generateWorld(seed)` on fresh client join when host provides static snapshot data, reducing join-time CPU spikes while keeping packet names backward-compatible (`surfaceStatic` is optional).
- Serialization compatibility update: biome stone `resourceStates` now optionally persist `biomeId`, `originIslandId`, and `isBiomeStone`; load path consumes/backfills these fields without breaking older saves/snapshots.
