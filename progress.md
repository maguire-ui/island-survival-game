Original prompt: Fix CaveV2 so caves use Zelda-style screen-to-screen room transitions (no portals/layers), surface cave entrances look like real cave mouths, and player model/hitbox stay perfectly synced on cave enter/exit. Use the develop-web-game skill workflow and validate with a browser loop.

- CaveV2 emergency fix pass: added player/collision sync proxy updates on cave entry/update/transition and moved/removed CaveV2 player-centered vignette to prevent ghost/radiation look.
- CaveV2 transition hardening: edge boundary snap + side lock anti-bounce + debug lane/boundary visuals added.
- Surface CaveV2 entrances now render as procedural cave mouths (rock rim + shadow + dark interior), replacing the old simple circle look.
- Browser Playwright loop is currently blocked in this shell because node/npx are not installed; cave fixes were validated with code audit + syntax/diff checks only.
