(() => {
  "use strict";

  const CONFIG = Object.freeze({
    tileSize: 32,
    worldSize: 520,
    playerRadius: 12,
    moveSpeed: 150,
    interactRange: 55,
    saveInterval: 5,
    dayLength: 180,
    nightLength: 120,
  });

  const START_MENU_VIEW_ORDER = Object.freeze({
    main: 0,
    worlds: 1,
    play: 2,
    options: 3,
  });
  const START_MENU_SWOOSH_DURATION_MS = 420;
  const START_SCREEN_EXIT_TRANSITION_MS = 280;
  const START_FLOW_TIMEOUT_MS = 18000;
  const JOIN_FLOW_TIMEOUT_MS = 24000;

  const TOUCH_STICK_MAX_DIST = 40;
  const MOBILE_RENDER_DPR_CAP = 2.25;
  const DESKTOP_RENDER_DPR_CAP = 2.0;
  const MOBILE_RENDER_MAX_PIXELS = 2200000;
  const DESKTOP_RENDER_MAX_PIXELS = 6000000;
  const GRAPHICS_PRESET_CONFIG = Object.freeze({
    performance: Object.freeze({ renderScale: 0.68, effectsLevel: 1 }),
    balanced: Object.freeze({ renderScale: 0.82, effectsLevel: 2 }),
    quality: Object.freeze({ renderScale: 0.92, effectsLevel: 2 }),
    ultra: Object.freeze({ renderScale: 1.0, effectsLevel: 2 }),
  });
  const AUTO_GRAPHICS_BASELINE = Object.freeze({
    preset: "ultra",
    renderScale: GRAPHICS_PRESET_CONFIG.ultra.renderScale,
    effectsLevel: 2,
  });
  const GRAPHICS_RUNTIME_PROFILE_CONFIG = Object.freeze({
    performance: Object.freeze({
      worldStepMax: 0.06,
      ambientFishSpawnChance: 0.1,
      ambientFishMaxFactor: 0.1,
      oceanDecorStride: 6,
      snapshotInterval: 0.42,
      motionInterval: 0.05,
      playerSendInterval: 0.055,
      remoteSmoothScale: 1.42,
      maxFixedSteps: 2,
      maxFrameDeltaSeconds: 0.075,
      resourceTickInterval: 0.05,
      ambientFishTickInterval: 0.11,
      villagerTickInterval: 0.066,
      robotTickInterval: 0.066,
      shipTickInterval: 0.066,
    }),
    balanced: Object.freeze({
      worldStepMax: 0.055,
      ambientFishSpawnChance: 0.18,
      ambientFishMaxFactor: 0.2,
      oceanDecorStride: 4,
      snapshotInterval: 0.34,
      motionInterval: 0.036,
      playerSendInterval: 0.038,
      remoteSmoothScale: 1.24,
      maxFixedSteps: 3,
      maxFrameDeltaSeconds: 0.09,
      resourceTickInterval: 0.033,
      ambientFishTickInterval: 0.066,
      villagerTickInterval: 0.05,
      robotTickInterval: 0.05,
      shipTickInterval: 0.05,
    }),
    quality: Object.freeze({
      worldStepMax: 0.055,
      ambientFishSpawnChance: 0.22,
      ambientFishMaxFactor: 0.22,
      oceanDecorStride: 3,
      snapshotInterval: 0.34,
      motionInterval: 0.036,
      playerSendInterval: 0.038,
      remoteSmoothScale: 1.18,
      maxFixedSteps: 3,
      maxFrameDeltaSeconds: 0.09,
      resourceTickInterval: 0.033,
      ambientFishTickInterval: 0.09,
      villagerTickInterval: 0.05,
      robotTickInterval: 0.05,
      shipTickInterval: 0.05,
    }),
    ultra: Object.freeze({
      worldStepMax: 0.055,
      ambientFishSpawnChance: 0.28,
      ambientFishMaxFactor: 0.28,
      oceanDecorStride: 2,
      snapshotInterval: 0.32,
      motionInterval: 0.034,
      playerSendInterval: 0.036,
      remoteSmoothScale: 1.12,
      maxFixedSteps: 3,
      maxFrameDeltaSeconds: 0.09,
      resourceTickInterval: 0.033,
      ambientFishTickInterval: 0.075,
      villagerTickInterval: 0.05,
      robotTickInterval: 0.05,
      shipTickInterval: 0.05,
    }),
  });
  const GRAPHICS_PRESET_IDS = Object.freeze([
    "performance",
    "balanced",
    "quality",
    "ultra",
    "custom",
  ]);

  const NET_CONFIG = Object.freeze({
    snapshotInterval: 0.3,
    motionInterval: 0.025,
    playerSendInterval: 0.025,
    helloRetryInterval: 0.9,
    joinReconnectBase: 1.2,
    joinReconnectMax: 4.0,
    joinHandshakeTimeout: 22,
    joinHeartbeatInterval: 0.9,
    resyncSilenceThreshold: 1.2,
    resyncRequestCooldown: 0.8,
    renderSmooth: 14,
    houseSmooth: 22,
    monsterSmooth: 48,
    animalSmooth: 48,
    villagerSmooth: 44,
    projectileSmooth: 26,
    poisonCloudSmooth: 18,
    robotSmooth: 14,
  });
  const NET_PENDING_REQUEST_TIMEOUT_SECONDS = 8;

  const PLAYER_COLORS = Object.freeze([
    "#f26d6d",
    "#f5b041",
    "#7bd88f",
    "#6fa8ff",
    "#c28bff",
    "#f7d56b",
  ]);

  const QA_SELF_TEST_CONFIG = Object.freeze({
    runInterval: 6,
    saveRoundTripInterval: 32,
    maxIssuesPerRun: 32,
  });

  const MP_DEBUG_SYNC_AUDIT_CONFIG = Object.freeze({
    interval: 2.8,
    pendingLimit: 18,
  });

  const SAVE_KEY = "island_survival_save_v1";
  const SAVE_KEY_PREFIX = "island_survival_seed_save_v1:";
  const ACTIVE_SEED_KEY = "island_survival_active_seed_v1";
  const ACTIVE_WORLD_ID_KEY = "island_survival_active_world_id_v1";
  const SAVE_VERSION = 5;
  const WORLD_LAYOUT_VERSION = "2026-03-layout-v4";
  const WORLD_RECORDS_ENABLED = true;
  const WORLD_SELECT_UI_ENABLED = true;
  const WORLD_THUMBNAILS_ENABLED = true;
  const LEGACY_SEED_ROUTING_ENABLED = true;
  const WORLD_MIGRATION_ASSISTANT_ENABLED = true;
  const LOCAL_WORLD_LIMIT = 3;
  const WORLD_SCHEMA_VERSION = 1;
  const WORLD_METADATA_VERSION = 1;
  const WORLD_PAYLOAD_VERSION = 1;
  const WORLD_DB_NAME = "island_survival_worlds_v1";
  const WORLD_DB_VERSION = 1;
  const WORLD_DB_STORES = Object.freeze({
    meta: "worldMeta",
    save: "worldSave",
    thumb: "worldThumb",
    legacy: "legacyImportState",
  });
  const HOTBAR_SIZE = 4;
  const INVENTORY_SIZE = 8;
  const CHEST_SIZE = 8;
  const MAX_STACK = 99;

  const SURFACE_GUARDIAN_CONFIG = Object.freeze({
    spawnInterval: 5.8,
    maxTotal: 22,
    maxPerIsland: 2,
    minPlayerDistanceTiles: 4.5,
    coverageSoftOverflow: 2,
    coverageSpawnBudget: 2,
  });

  const SETTINGS_KEY = "island_survival_settings_v1";
  const LEGACY_PLAYER_NAME_KEY = "island_mp_name";
  const PLAYER_NAME_MAX_LENGTH = 20;
  const DEBUG_PASSCODE = "123";
  const SETTINGS_DEFAULTS = Object.freeze({
    playerName: "",
    musicVolume: 0.72,
    sfxVolume: 0.62,
    graphicsPreset: AUTO_GRAPHICS_BASELINE.preset,
    renderScale: AUTO_GRAPHICS_BASELINE.renderScale,
    graphicsEffectsLevel: AUTO_GRAPHICS_BASELINE.effectsLevel,
    debugUnlocked: false,
    debugInfiniteResources: false,
    debugInfiniteHealth: false,
    debugSpeedMultiplier: 1,
    debugWorldSpeedMultiplier: 1,
    debugFovMultiplier: 1,
  });

  window.ISGConfig = Object.freeze({
    ACTIVE_SEED_KEY,
    ACTIVE_WORLD_ID_KEY,
    AUTO_GRAPHICS_BASELINE,
    CHEST_SIZE,
    CONFIG,
    DEBUG_PASSCODE,
    DESKTOP_RENDER_DPR_CAP,
    DESKTOP_RENDER_MAX_PIXELS,
    GRAPHICS_PRESET_CONFIG,
    GRAPHICS_PRESET_IDS,
    GRAPHICS_RUNTIME_PROFILE_CONFIG,
    HOTBAR_SIZE,
    INVENTORY_SIZE,
    JOIN_FLOW_TIMEOUT_MS,
    LEGACY_PLAYER_NAME_KEY,
    LEGACY_SEED_ROUTING_ENABLED,
    LOCAL_WORLD_LIMIT,
    MAX_STACK,
    MOBILE_RENDER_DPR_CAP,
    MOBILE_RENDER_MAX_PIXELS,
    MP_DEBUG_SYNC_AUDIT_CONFIG,
    NET_CONFIG,
    NET_PENDING_REQUEST_TIMEOUT_SECONDS,
    PLAYER_COLORS,
    PLAYER_NAME_MAX_LENGTH,
    QA_SELF_TEST_CONFIG,
    SAVE_KEY,
    SAVE_KEY_PREFIX,
    SAVE_VERSION,
    SETTINGS_DEFAULTS,
    SETTINGS_KEY,
    START_FLOW_TIMEOUT_MS,
    START_MENU_SWOOSH_DURATION_MS,
    START_MENU_VIEW_ORDER,
    START_SCREEN_EXIT_TRANSITION_MS,
    SURFACE_GUARDIAN_CONFIG,
    TOUCH_STICK_MAX_DIST,
    WORLD_DB_NAME,
    WORLD_DB_STORES,
    WORLD_DB_VERSION,
    WORLD_LAYOUT_VERSION,
    WORLD_METADATA_VERSION,
    WORLD_MIGRATION_ASSISTANT_ENABLED,
    WORLD_PAYLOAD_VERSION,
    WORLD_RECORDS_ENABLED,
    WORLD_SCHEMA_VERSION,
    WORLD_SELECT_UI_ENABLED,
    WORLD_THUMBNAILS_ENABLED,
  });
})();
