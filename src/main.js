(() => {
  "use strict";

  const canvas = document.getElementById("game");
  const ctx = canvas.getContext("2d");

  const seedDisplay = document.getElementById("seedDisplay");
  const toolDisplay = document.getElementById("toolDisplay");
  const timeDisplay = document.getElementById("timeDisplay");
  const healthFill = document.getElementById("healthFill");
  const saveStatus = document.getElementById("saveStatus");
  const promptEl = document.getElementById("prompt");
  const inventoryPanel = document.getElementById("inventory");
  const hotbarEl = document.getElementById("hotbar");
  const inventorySlotsEl = document.getElementById("inventorySlots");
  const buildMenu = document.getElementById("buildMenu");
  const buildList = document.getElementById("buildList");
  const buildRobotControls = document.getElementById("buildRobotControls");
  const toggleRobotRecallBtn = document.getElementById("toggleRobotRecallBtn");
  const buildRobotControlsHint = document.getElementById("buildRobotControlsHint");
  const stationMenu = document.getElementById("stationMenu");
  const stationTitle = document.getElementById("stationTitle");
  const stationOptions = document.getElementById("stationOptions");
  const chestPanel = document.getElementById("chestPanel");
  const chestPanelTitle = document.getElementById("chestPanelTitle");
  const chestPanelHint = document.getElementById("chestPanelHint");
  const chestSlotsEl = document.getElementById("chestSlots");
  const destroyChestBtn = document.getElementById("destroyChest");
  const shipRepairPanel = document.getElementById("shipRepairPanel");
  const shipRepairTitle = document.getElementById("shipRepairTitle");
  const shipRepairStatus = document.getElementById("shipRepairStatus");
  const shipRepairCost = document.getElementById("shipRepairCost");
  const shipRepairBtn = document.getElementById("shipRepairBtn");
  const shipRepairCloseBtn = document.getElementById("shipRepairClose");
  const endScreen = document.getElementById("endScreen");
  const newRunBtn = document.getElementById("newRunBtn");
  const startScreen = document.getElementById("startScreen");
  const soloBtn = document.getElementById("soloBtn");
  const hostBtn = document.getElementById("hostBtn");
  const joinBtn = document.getElementById("joinBtn");
  const movePadEl = document.getElementById("movePad");
  const stickEl = document.getElementById("stick");
  const stickKnobEl = document.getElementById("stickKnob");
  const inventoryBtn = document.getElementById("inventoryBtn");
  const dropBtn = document.getElementById("dropBtn");
  const actionBtn = document.getElementById("actionBtn");
  const attackBtn = document.getElementById("attackBtn");
  const mpStatus = document.getElementById("mpStatus");
  const roomDisplay = document.getElementById("roomDisplay");
  const mpCopy = document.getElementById("mpCopy");
  const mpJoin = document.getElementById("mpJoin");
  const settingsToggle = document.getElementById("settingsToggle");
  const settingsPanel = document.getElementById("settingsPanel");
  const settingsTabBtn = document.getElementById("settingsTabBtn");
  const objectivesTabBtn = document.getElementById("objectivesTabBtn");
  const settingsContent = document.getElementById("settingsContent");
  const objectivesContent = document.getElementById("objectivesContent");
  const objectiveGuide = document.getElementById("objectiveGuide");
  const musicVolumeInput = document.getElementById("musicVolume");
  const musicVolumeValue = document.getElementById("musicVolumeValue");
  const sfxVolumeInput = document.getElementById("sfxVolume");
  const sfxVolumeValue = document.getElementById("sfxVolumeValue");
  const resetWorldBtn = document.getElementById("resetWorldBtn");
  const unlockDebugBtn = document.getElementById("unlockDebugBtn");
  const debugUnlockStatus = document.getElementById("debugUnlockStatus");
  const debugToggle = document.getElementById("debugToggle");
  const debugPanel = document.getElementById("debugPanel");
  const debugSpeedInput = document.getElementById("debugSpeed");
  const debugSpeedValue = document.getElementById("debugSpeedValue");
  const debugWorldSpeedInput = document.getElementById("debugWorldSpeed");
  const debugWorldSpeedValue = document.getElementById("debugWorldSpeedValue");
  const giveBeaconBtn = document.getElementById("giveBeaconBtn");
  const giveRobotBtn = document.getElementById("giveRobotBtn");
  const spawnCaveBtn = document.getElementById("spawnCaveBtn");
  const spawnVillageBtn = document.getElementById("spawnVillageBtn");
  const debugPlaceBoatBtn = document.getElementById("debugPlaceBoatBtn");
  const forceDayBtn = document.getElementById("forceDayBtn");
  const forceNightBtn = document.getElementById("forceNightBtn");
  const mosesBtn = document.getElementById("mosesBtn");
  const infiniteResourcesBtn = document.getElementById("infiniteResourcesBtn");
  const debugWorldMapBtn = document.getElementById("debugWorldMapBtn");
  const continentalShiftBtn = document.getElementById("continentalShiftBtn");

  const buildCategoryTabs = Array.from(buildMenu.querySelectorAll(".build-category-btn"));
  const buildCategoryIcons = Array.from(buildMenu.querySelectorAll(".build-category-icon"));
  const buildCategoryHint = document.getElementById("buildCategoryHint");

  const CONFIG = {
    tileSize: 32,
    worldSize: 520,
    playerRadius: 12,
    moveSpeed: 150,
    interactRange: 55,
    saveInterval: 5,
    dayLength: 180,
    nightLength: 120,
  };

  const MONSTER = {
    surfaceMax: 30,
    caveMax: 4,
    spawnInterval: 4.2,
    spawnMinTiles: 5,
    spawnMaxTiles: 11,
    speed: 55,
    hp: 6,
    damage: 8,
    attackRange: 26,
    attackCooldown: 1.1,
    aggroRange: 180,
  };

  const TOUCH_STICK_MAX_DIST = 40;

  const MONSTER_CAMPFIRE_FEAR = Object.freeze({
    radiusPadding: 6,
    steerBuffer: 42,
    steerWeight: 1.35,
    panicWeight: 2.5,
  });

  const MONSTER_DAY_BURN = Object.freeze({
    durationMin: 3.8,
    durationMax: 5.4,
    moveSpeedScale: 0.52,
    staggerResetMin: 0.16,
    staggerResetMax: 0.44,
  });

  const MONSTER_BURN_FX = Object.freeze({
    burstMin: 10,
    burstMax: 16,
    spread: 14,
    riseMin: 16,
    riseMax: 42,
    lifeMin: 0.5,
    lifeMax: 1.2,
    sizeMin: 1.8,
    sizeMax: 4.6,
  });

  const POISON_STATUS = Object.freeze({
    minHp: 1,
    maxDuration: 18,
    minDps: 0.2,
    maxDps: 4.2,
    defaultDps: 1.25,
  });

  const SKELETON_ARROW = {
    speed: 235,
    radius: 9,
    maxLife: 2.3,
    missChance: 0.32,
    spread: 0.11,
    missSpread: 0.28,
  };

  const MONSTER_VARIANTS = {
    crawler: {
      name: "Crawler",
      color: "#2b2d3a",
      hp: 7,
      speed: 60,
      damage: 9,
      attackRange: 26,
      attackCooldown: 1.0,
      aggroRange: 210,
      rangedRange: 0,
      drop: {
        bone: { min: 1, max: 2, chance: 0.82 },
        monster_flesh: { min: 1, max: 2, chance: 0.66 },
      },
    },
    brute: {
      name: "Brute",
      color: "#4b3232",
      hp: 12,
      speed: 52,
      damage: 13,
      attackRange: 28,
      attackCooldown: 1.25,
      aggroRange: 205,
      rangedRange: 0,
      drop: {
        bone: { min: 2, max: 4, chance: 0.95 },
        monster_flesh: { min: 1, max: 2, chance: 0.86 },
      },
    },
    skeleton: {
      name: "Skeleton",
      color: "#98a3b4",
      hp: 5,
      speed: 56,
      damage: 8,
      attackRange: 24,
      attackCooldown: 1.4,
      aggroRange: 260,
      rangedRange: 230,
      drop: {
        bone: { min: 2, max: 3, chance: 1 },
        monster_flesh: { min: 1, max: 1, chance: 0.3 },
      },
    },
    marsh_stalker: {
      name: "Marsh Stalker",
      color: "#4e8e68",
      hp: 8,
      speed: 62,
      damage: 8,
      attackRange: 25,
      attackCooldown: 1.0,
      aggroRange: 225,
      rangedRange: 0,
      poisonDuration: 8.5,
      poisonDps: 1.35,
      drop: {
        bone: { min: 1, max: 2, chance: 0.78 },
        monster_flesh: { min: 2, max: 3, chance: 0.9 },
      },
    },
    polar_bear: {
      name: "Polar Bear",
      color: "#dfe9f5",
      hp: 18,
      speed: 66,
      damage: 16,
      attackRange: 30,
      attackCooldown: 1.05,
      aggroRange: 280,
      rangedRange: 0,
      dayImmune: true,
      drop: {
        hide: { min: 2, max: 4, chance: 0.95 },
        bone: { min: 1, max: 2, chance: 0.72 },
      },
    },
    lion: {
      name: "Lion",
      color: "#c79359",
      hp: 14,
      speed: 76,
      damage: 14,
      attackRange: 29,
      attackCooldown: 0.95,
      aggroRange: 300,
      rangedRange: 0,
      dayImmune: true,
      drop: {
        hide: { min: 2, max: 3, chance: 0.9 },
        bone: { min: 1, max: 2, chance: 0.6 },
      },
    },
    wolf: {
      name: "Wolf",
      color: "#9ea6b7",
      hp: 11,
      speed: 84,
      damage: 11,
      attackRange: 27,
      attackCooldown: 0.86,
      aggroRange: 265,
      rangedRange: 0,
      dayImmune: true,
      drop: {
        hide: { min: 1, max: 2, chance: 0.8 },
        bone: { min: 1, max: 2, chance: 0.5 },
      },
    },
  };

  const MONSTER_AUDIO_PROFILES = Object.freeze({
    crawler: {
      idleIntervalMin: 2.8,
      idleIntervalMax: 5.8,
      stepIntervalMin: 0.28,
      stepIntervalMax: 0.55,
      idleRange: CONFIG.tileSize * 11.5,
      moveThreshold: 8,
    },
    brute: {
      idleIntervalMin: 3.2,
      idleIntervalMax: 6.6,
      stepIntervalMin: 0.36,
      stepIntervalMax: 0.72,
      idleRange: CONFIG.tileSize * 12.5,
      moveThreshold: 5,
    },
    skeleton: {
      idleIntervalMin: 2.5,
      idleIntervalMax: 4.9,
      stepIntervalMin: 0.24,
      stepIntervalMax: 0.46,
      idleRange: CONFIG.tileSize * 13.2,
      moveThreshold: 7,
    },
    marsh_stalker: {
      idleIntervalMin: 2.2,
      idleIntervalMax: 4.5,
      stepIntervalMin: 0.22,
      stepIntervalMax: 0.48,
      idleRange: CONFIG.tileSize * 12.2,
      moveThreshold: 6,
    },
    polar_bear: {
      idleIntervalMin: 2.6,
      idleIntervalMax: 4.8,
      stepIntervalMin: 0.3,
      stepIntervalMax: 0.54,
      idleRange: CONFIG.tileSize * 13.2,
      moveThreshold: 6,
    },
    lion: {
      idleIntervalMin: 2.1,
      idleIntervalMax: 4.2,
      stepIntervalMin: 0.24,
      stepIntervalMax: 0.45,
      idleRange: CONFIG.tileSize * 13.8,
      moveThreshold: 7,
    },
    wolf: {
      idleIntervalMin: 1.9,
      idleIntervalMax: 3.8,
      stepIntervalMin: 0.2,
      stepIntervalMax: 0.38,
      idleRange: CONFIG.tileSize * 12.8,
      moveThreshold: 7,
    },
  });

  const NET_CONFIG = {
    snapshotInterval: 0.3,
    motionInterval: 0.08,
    playerSendInterval: 0.05,
    renderSmooth: 12,
    houseSmooth: 18,
    monsterSmooth: 10,
    animalSmooth: 10,
    villagerSmooth: 10,
    robotSmooth: 14,
  };

  const PLAYER_COLORS = [
    "#f26d6d",
    "#f5b041",
    "#7bd88f",
    "#6fa8ff",
    "#c28bff",
    "#f7d56b",
  ];

  const RESPAWN = {
    treeStump: 30,
    treeSapling: 60,
    rock: 120,
    ore: 180,
    grass: 45,
  };

  const DROP_DESPAWN = Object.freeze({
    lifetime: 180,
    warningStart: 30,
    criticalStart: 5,
  });

  const BIOME_STONE_RESPAWN = Object.freeze({
    min: 600,
    max: 600,
    retryDelay: 20,
    minActivePerBiome: 1,
  });

  const VILLAGER_CONFIG = Object.freeze({
    minPerVillage: 2,
    maxPerVillage: 8,
    speedMin: 19,
    speedMax: 31,
    wanderRadiusTiles: 6.8,
    wanderResetMin: 0.7,
    wanderResetMax: 2.2,
  });

  const VILLAGER_COLORS = [
    "#4e6da5",
    "#8f6a4a",
    "#6c8f5b",
    "#8a5f9d",
    "#9b4f4f",
    "#6f8e92",
  ];

  const CAVE_SIZE = 28;

  const SAVE_KEY = "island_survival_save_v1";
  const SAVE_KEY_PREFIX = "island_survival_seed_save_v1:";
  const ACTIVE_SEED_KEY = "island_survival_active_seed_v1";
  const SAVE_VERSION = 5;
  const WORLD_LAYOUT_VERSION = "2026-02-layout-v3";
  const HOTBAR_SIZE = 4;
  const INVENTORY_SIZE = 8;
  const CHEST_SIZE = 8;
  const MAX_STACK = 99;

  const HOUSE_TIERS = {
    small_house: { key: "small_house", name: "Small House", width: 5, height: 4, color: "#8b5d3c" },
    medium_house: { key: "medium_house", name: "Medium House", width: 7, height: 5, color: "#7a5134" },
    large_house: { key: "large_house", name: "Large House", width: 9, height: 6, color: "#6f482f" },
  };

  const REMOVED_STRUCTURE_TYPES = new Set([
    "floor",
    "wall",
    "brick_floor",
    "brick_wall",
    "fence",
  ]);

  const BIOME_STONES = [
    { id: "temperate_stone", name: "Temperate Stone", color: "#8fbf6a" },
    { id: "jungle_stone", name: "Jungle Stone", color: "#4fbf86" },
    { id: "snow_stone", name: "Snow Stone", color: "#a7c9e8" },
    { id: "volcanic_stone", name: "Volcanic Stone", color: "#d07b54" },
    { id: "mangrove_stone", name: "Mangrove Stone", color: "#7bbd93" },
    { id: "redwood_stone", name: "Redwood Stone", color: "#5f8f62" },
    { id: "ashlands_stone", name: "Ashlands Stone", color: "#8f6f64" },
    { id: "marsh_stone", name: "Marsh Stone", color: "#7fb089" },
  ];

  const BIOME_STONE_ITEMS = BIOME_STONES.reduce((acc, stone) => {
    acc[stone.id] = { name: stone.name, color: stone.color };
    return acc;
  }, {});

  const BEACON_BIOME_COST = BIOME_STONES.reduce((acc, stone) => {
    acc[stone.id] = 1;
    return acc;
  }, {});

  const DEBUG_REPAIRED_BOAT_ITEM_ID = "debug_repaired_boat";

  const ITEMS = {
    wood: { name: "Wood", color: "#c89b5f" },
    stone: { name: "Stone", color: "#a1a4b2" },
    ore: { name: "Ore (Legacy)", color: "#8d5aa3" },
    ingot: { name: "Ingot (Legacy)", color: "#c9b36c" },
    coal: { name: "Coal", color: "#2a2f38" },
    iron_ore: { name: "Iron Ore", color: "#8e7c6b" },
    gold_ore: { name: "Gold Ore", color: "#c8a53d" },
    emerald: { name: "Emerald", color: "#2ebf76" },
    diamond: { name: "Diamond", color: "#63d6e9" },
    iron_ingot: { name: "Iron Ingot", color: "#b6b2ac" },
    gold_ingot: { name: "Gold Ingot", color: "#d4b455" },
    plank: { name: "Plank", color: "#b58752" },
    stick: { name: "Stick", color: "#a97a4c" },
    grass: { name: "Grass", color: "#6ec27c" },
    paper: { name: "Paper", color: "#ebe2bf" },
    wayfinder_stone: { name: "Wayfinder Stone", color: "#77b5c9" },
    raw_meat: { name: "Raw Meat", color: "#c96a64" },
    cooked_meat: { name: "Cooked Meat", color: "#d7a172" },
    hide: { name: "Hide", color: "#9f7d57" },
    bone: { name: "Bone", color: "#d6d6c9" },
    monster_flesh: { name: "Monster Flesh", color: "#9b4e59" },
    ...BIOME_STONE_ITEMS,
    bridge: { name: "Bridge", color: "#c7b37a", placeable: true, placeType: "bridge" },
    village_path: { name: "Path Block", color: "#b59b6a", placeable: true, placeType: "village_path" },
    brick: { name: "Brick", color: "#b46a4d" },
    dock: { name: "Dock", color: "#c3a76b", placeable: true, placeType: "dock" },
    small_house: { name: "Small House", color: "#a57a4a", placeable: true, placeType: "small_house" },
    medium_house: { name: "Medium House", color: "#92623d", placeable: true, placeType: "medium_house" },
    large_house: { name: "Large House", color: "#7f5534", placeable: true, placeType: "large_house" },
    bed: { name: "Bed", color: "#d8cab4", placeable: true, placeType: "bed" },
    campfire: { name: "Campfire", color: "#d37a3a", placeable: true, placeType: "campfire" },
    medicine: { name: "POULTICE", color: "#7ec98a" },
    village_map: { name: "Village Map", color: "#d0c394" },
    cave_map: { name: "Cave Map", color: "#a5b4d8" },
    beacon_core: { name: "Beacon Core", color: "#9cd0ff" },
    beacon: { name: "Rescue Beacon", color: "#d9c27a", placeable: true, placeType: "beacon" },
    smelter: { name: "Smelter", color: "#b05b5b", placeable: true, placeType: "smelter" },
    sawmill: { name: "Sawmill", color: "#7d6a46", placeable: true, placeType: "sawmill" },
    kiln: { name: "Kiln", color: "#b37d5c", placeable: true, placeType: "kiln" },
    chest: { name: "Chest", color: "#a8794a", placeable: true, placeType: "chest" },
    robot: { name: "Robot", color: "#7aa1c6", placeable: true, placeType: "robot" },
    [DEBUG_REPAIRED_BOAT_ITEM_ID]: {
      name: "Boat (Repaired)",
      color: "#8f6f4f",
      placeable: true,
      placeType: "abandoned_ship",
      debugOnly: true,
    },
  };

  const ITEM_VISUALS = {
    tree_resource: { symbol: "TREE", bg: "#2f7f4f", border: "#7ed19d", fg: "#ecffef" },
    stop_icon: { symbol: "STOP", bg: "#7f2f37", border: "#ea8d8d", fg: "#ffecec" },
    wood: { symbol: "LOG", bg: "#8a5c35", border: "#b7845a", fg: "#ffe0bc" },
    stone: { symbol: "ROC", bg: "#656d7f", border: "#9da7be", fg: "#f2f5ff" },
    ore: { symbol: "ORE", bg: "#5c3f72", border: "#9f7bc0", fg: "#f4e8ff" },
    ingot: { symbol: "ING", bg: "#8f7c3e", border: "#d8c276", fg: "#fff5d5" },
    coal: { symbol: "COL", bg: "#1f2530", border: "#4a5b71", fg: "#e9f1ff" },
    iron_ore: { symbol: "IRO", bg: "#5b5148", border: "#a89684", fg: "#f6efe6" },
    gold_ore: { symbol: "GOR", bg: "#7d6730", border: "#d5b15e", fg: "#fff4d6" },
    emerald: { symbol: "EMR", bg: "#1f6b4a", border: "#4ecf8b", fg: "#e8fff2" },
    diamond: { symbol: "DIA", bg: "#316c80", border: "#7fe8ff", fg: "#ecfdff" },
    iron_ingot: { symbol: "I-IN", bg: "#6f6c6a", border: "#c8c4bf", fg: "#f8f8f8" },
    gold_ingot: { symbol: "G-IN", bg: "#8a7430", border: "#ebcb63", fg: "#fff8dc" },
    plank: { symbol: "PLK", bg: "#94673a", border: "#d2a470", fg: "#fff0d7" },
    stick: { symbol: "STK", bg: "#7f5a34", border: "#c59a63", fg: "#ffe9cd" },
    grass: { symbol: "GRS", bg: "#2b7f4a", border: "#78cf94", fg: "#ebffef" },
    paper: { symbol: "PPR", bg: "#8e8463", border: "#d8d0b0", fg: "#fffbe9" },
    wayfinder_stone: { symbol: "WAY", bg: "#3e6f82", border: "#8fd4ea", fg: "#e6f9ff" },
    raw_meat: { symbol: "RAW", bg: "#8f403d", border: "#d47a75", fg: "#ffe1dd" },
    cooked_meat: { symbol: "FOOD", bg: "#9e5d3a", border: "#e0a77f", fg: "#fff0e2" },
    hide: { symbol: "HID", bg: "#7d603f", border: "#bc9a73", fg: "#f9e5c9" },
    bone: { symbol: "BNE", bg: "#7c7a6f", border: "#d6d5c8", fg: "#f9f8ee" },
    monster_flesh: { symbol: "FLS", bg: "#6e303a", border: "#c37787", fg: "#ffe5ea" },
    bridge: { symbol: "BRG", bg: "#8a7548", border: "#d2bb82", fg: "#fff3d8" },
    village_path: { symbol: "PTH", bg: "#726243", border: "#c6ab72", fg: "#fff3d7" },
    dock: { symbol: "DCK", bg: "#7c6a43", border: "#c3aa72", fg: "#fff2d2" },
    small_house: { symbol: "HS-S", bg: "#7a4f2f", border: "#bf8e63", fg: "#ffe6cf" },
    medium_house: { symbol: "HS-M", bg: "#694327", border: "#b17f56", fg: "#ffe1c4" },
    large_house: { symbol: "HS-L", bg: "#5e3b24", border: "#a7734d", fg: "#ffdcc0" },
    bed: { symbol: "BED", bg: "#6f89a7", border: "#b7cee7", fg: "#eff7ff" },
    campfire: { symbol: "FIR", bg: "#8a3f26", border: "#d88956", fg: "#ffe5ce" },
    medicine: { symbol: "MED", bg: "#3f8357", border: "#80cd9a", fg: "#e9ffef" },
    village_map: { symbol: "VMP", bg: "#7f7051", border: "#cfbf8f", fg: "#fff9e7" },
    cave_map: { symbol: "CMP", bg: "#596587", border: "#a8b8e4", fg: "#edf2ff" },
    beacon_core: { symbol: "CORE", bg: "#4d6f8f", border: "#9cccf2", fg: "#e8f8ff" },
    beacon: { symbol: "BCN", bg: "#876f38", border: "#d3b86d", fg: "#fff5d8" },
    smelter: { symbol: "SML", bg: "#683434", border: "#bf6b6b", fg: "#ffe3e3" },
    sawmill: { symbol: "SAW", bg: "#5d5238", border: "#ad9a68", fg: "#f6efd7" },
    kiln: { symbol: "KLN", bg: "#7a4f39", border: "#c48c6f", fg: "#ffe9de" },
    chest: { symbol: "CHS", bg: "#7e5833", border: "#c49a6a", fg: "#ffebd2" },
    robot: { symbol: "BOT", bg: "#34506a", border: "#7ab7e1", fg: "#eaf6ff" },
    temperate_stone: { symbol: "T-ST", bg: "#4f7f43", border: "#8fc17f", fg: "#ebffe8" },
    jungle_stone: { symbol: "J-ST", bg: "#2f7f56", border: "#62c89a", fg: "#e7fff3" },
    snow_stone: { symbol: "S-ST", bg: "#587a99", border: "#a9d4f3", fg: "#ecf8ff" },
    volcanic_stone: { symbol: "V-ST", bg: "#7f513f", border: "#d08c6b", fg: "#fff0e6" },
    mangrove_stone: { symbol: "M-ST", bg: "#456f56", border: "#8bc8a2", fg: "#eefff4" },
    redwood_stone: { symbol: "R-ST", bg: "#3f6b43", border: "#77ab7c", fg: "#eefde9" },
    ashlands_stone: { symbol: "A-ST", bg: "#66555a", border: "#a98b80", fg: "#fff1ea" },
    marsh_stone: { symbol: "MR-S", bg: "#466c59", border: "#88c29d", fg: "#effff6" },
  };

  const VILLAGE_LOOT_TABLE = [
    { id: "plank", min: 3, max: 8, weight: 22 },
    { id: "wood", min: 5, max: 12, weight: 20 },
    { id: "stick", min: 3, max: 8, weight: 16 },
    { id: "stone", min: 4, max: 10, weight: 18 },
    { id: "raw_meat", min: 1, max: 3, weight: 10 },
    { id: "cooked_meat", min: 1, max: 3, weight: 12 },
    { id: "medicine", min: 1, max: 2, weight: 9 },
    { id: "coal", min: 1, max: 3, weight: 8 },
    { id: "iron_ore", min: 1, max: 2, weight: 7 },
    { id: "gold_ore", min: 1, max: 1, weight: 4 },
    { id: "campfire", min: 1, max: 1, weight: 5 },
  ];

  const SHIPWRECK_LOOT_TABLE = [
    { id: "wood", min: 6, max: 18, weight: 28 },
    { id: "bridge", min: 2, max: 6, weight: 22 },
    { id: "stick", min: 5, max: 14, weight: 20 },
    { id: "cooked_meat", min: 1, max: 4, weight: 16 },
    { id: "plank", min: 3, max: 8, weight: 14 },
    { id: "medicine", min: 1, max: 2, weight: 10 },
    { id: "hide", min: 1, max: 3, weight: 8 },
  ];

  const ORE_LEVELS = Object.freeze({
    coal: 3,
    iron_ore: 2,
    gold_ore: 3,
    emerald: 4,
    diamond: 5,
  });

  const ORE_LABELS = Object.freeze({
    coal: "Coal",
    iron_ore: "Iron Ore",
    gold_ore: "Gold Ore",
    emerald: "Emerald",
    diamond: "Diamond",
  });

  const ORE_COLORS = Object.freeze({
    coal: "#2a2f38",
    iron_ore: "#8e7c6b",
    gold_ore: "#c8a53d",
    emerald: "#2ebf76",
    diamond: "#63d6e9",
  });

  const PICKAXE_TIER_DATA = [
    { tier: 0, name: "Hands", damage: 1 },
    { tier: 1, name: "Wood Pickaxe", damage: 1 },
    { tier: 2, name: "Stone Pickaxe", damage: 2 },
    { tier: 3, name: "Iron Pickaxe", damage: 2 },
    { tier: 4, name: "Gold Pickaxe", damage: 3 },
    { tier: 5, name: "Emerald Pickaxe", damage: 3 },
    { tier: 6, name: "Diamond Pickaxe", damage: 4 },
  ];

  const SWORD_TIER_DATA = [
    { tier: 0, name: "No Sword", damage: 0 },
    { tier: 1, name: "Crude Sword", damage: 1 },
    { tier: 2, name: "Reinforced Edge", damage: 2 },
    { tier: 3, name: "Serrated Edge", damage: 3 },
    { tier: 4, name: "Weighted Blade", damage: 4 },
    { tier: 5, name: "Blood-Hardened Blade", damage: 5 },
  ];

  const PLAYER_UNLOCK_DEFAULTS = Object.freeze({
    pickaxe: false,
    orePickaxe: false,
    relicPickaxe: false,
    mythicPickaxe: false,
    primalPickaxe: false,
    apexPickaxe: false,
    sword: false,
    sword2: false,
    sword3: false,
    sword4: false,
    sword5: false,
  });

  const STRUCTURE_DEFS = {
    bench: { name: "Crafting Bench", color: "#6d4d2c", blocking: true, walkable: false },
    floor: { name: "Floor", color: "#b58a4f", blocking: false, walkable: true },
    village_path: { name: "Village Path", color: "#b59b6a", blocking: false, walkable: true },
    bridge: { name: "Bridge", color: "#c7b37a", blocking: false, walkable: true },
    dock: { name: "Dock", color: "#c3a76b", blocking: false, walkable: true },
    shipwreck: { name: "Shipwreck", color: "#9c7a4b", blocking: false, walkable: true, storage: true },
    abandoned_ship: { name: "Abandoned Ship", color: "#83694a", blocking: false, walkable: true },
    wall: { name: "Wall", color: "#6b4b2c", blocking: true, walkable: false },
    brick_floor: { name: "Brick Floor", color: "#b46a4d", blocking: false, walkable: true },
    brick_wall: { name: "Brick Wall", color: "#a95f45", blocking: true, walkable: false },
    fence: { name: "Fence", color: "#8b6a3f", blocking: true, walkable: false },
    small_house: { name: "Small House", color: "#8b5d3c", blocking: true, walkable: false, house: true },
    medium_house: { name: "Medium House", color: "#7a5134", blocking: true, walkable: false, house: true },
    large_house: { name: "Large House", color: "#6f482f", blocking: true, walkable: false, house: true },
    hut: { name: "Small House", color: "#8b5d3c", blocking: true, walkable: false, house: true },
    bed: { name: "Bed", color: "#d8cab4", blocking: true, walkable: false, sleep: true },
    campfire: { name: "Campfire", color: "#d37a3a", blocking: true, walkable: false, lightRadius: 90 },
    beacon: { name: "Rescue Beacon", color: "#d9c27a", blocking: true, walkable: false, lightRadius: 120, beacon: true },
    smelter: { name: "Smelter", color: "#b05b5b", blocking: true, walkable: false, station: true },
    sawmill: { name: "Sawmill", color: "#7d6a46", blocking: true, walkable: false, station: true },
    kiln: { name: "Kiln", color: "#b37d5c", blocking: true, walkable: false, station: true },
    chest: { name: "Chest", color: "#a8794a", blocking: true, walkable: false, storage: true },
    robot: { name: "Robot", color: "#7aa1c6", blocking: false, walkable: true, station: true, storage: true },
  };

  const BUILD_RECIPES = [
    {
      id: "stick_bundle",
      icon: "stick",
      name: "Stick Bundle",
      description: "Whittle sticks by hand so early tool progression never deadlocks.",
      cost: { wood: 1 },
      output: { stick: 2 },
    },
    {
      id: "bridge",
      name: "Bridge",
      description: "Cross water to reach other islands.",
      cost: { wood: 4, stick: 2 },
    },
    {
      id: "bridge_bundle",
      icon: "bridge",
      name: "Bridge Bundle",
      description: "Craft multiple bridges at once for rapid expansion.",
      cost: { wood: 6, plank: 1, stick: 3 },
      output: { bridge: 5 },
    },
    {
      id: "village_path",
      name: "Path Block",
      description: "Build walkable roads to make player-made villages.",
      cost: { wood: 2, stone: 2, stick: 1 },
      outputQty: 6,
    },
    {
      id: "dock",
      name: "Dock",
      description: "Shoreline checkpoint anchor; bind your respawn point here.",
      cost: { wood: 3, plank: 1, stick: 2 },
    },
    {
      id: "small_house",
      name: "Small House",
      description: "Safe prep space with compact interior.",
      cost: { wood: 19, plank: 7, stone: 6, stick: 8 },
    },
    {
      id: "medium_house",
      name: "Medium House Upgrade",
      description: "Upgrade a small house to expand interior space.",
      cost: { wood: 29, plank: 13, stone: 12, hide: 4, stick: 12 },
    },
    {
      id: "large_house",
      name: "Large House Upgrade",
      description: "Upgrade a medium house to max interior capacity.",
      cost: { wood: 45, plank: 21, iron_ingot: 6, hide: 8, stick: 16 },
    },
    {
      id: "bed",
      name: "Bed",
      description: "Sleep at night to skip to dawn. No healing.",
      cost: { plank: 6, hide: 4, stick: 2 },
    },
    {
      id: "campfire",
      name: "Campfire",
      description: "Permanent light source for nighttime safety and monster deterrence.",
      cost: { wood: 6, stone: 4, stick: 2 },
    },
    {
      id: "medicine",
      name: "POULTICE",
      description: "Fast emergency healing during fights.",
      cost: { raw_meat: 1, hide: 1, wood: 1 },
    },
    {
      id: "chest",
      name: "Chest",
      description: "Extra storage for resources and crafted gear.",
      cost: { wood: 6, plank: 2, stick: 2 },
    },
    {
      id: "smelter",
      name: "Smelter",
      description: "Smelt iron/gold with coal and cook healing food.",
      cost: { stone: 8, wood: 4, stick: 3 },
    },
    {
      id: "sawmill",
      name: "Sawmill",
      description: "Convert logs into planks and sticks for advanced builds.",
      cost: { wood: 8, stone: 2 },
    },
    {
      id: "kiln",
      name: "Kiln",
      description: "Bake bricks used to assemble the rescue beacon.",
      cost: { stone: 6, wood: 2, stick: 2 },
    },
    {
      id: "village_map",
      name: "Village Map",
      description: "Shows a tracked village zone and all active players.",
      cost: { wayfinder_stone: 1, paper: 4, plank: 2, stick: 1 },
    },
    {
      id: "cave_map",
      name: "Cave Map",
      description: "Shows a tracked cave zone and all active players.",
      cost: { wayfinder_stone: 1, paper: 5, plank: 3, stone: 4, stick: 2 },
    },
    {
      id: "beacon",
      name: "Rescue Beacon",
      description: "Ends the game for this seed. Starting this same seed again resets its progress.",
      cost: {
        beacon_core: 1,
        plank: 12,
        stick: 10,
        iron_ingot: 4,
        gold_ingot: 2,
        brick: 6,
        stone: 10,
        ...BEACON_BIOME_COST,
      },
    },
    {
      id: "robot",
      name: "Robot",
      description: "Late-game automation helper. Mine Trees, Stone, or Grass, then collect from robot storage.",
      cost: {
        beacon: 1,
        diamond: 14,
        emerald: 18,
        gold_ingot: 16,
        iron_ingot: 26,
        plank: 42,
        stick: 20,
        brick: 22,
        medicine: 10,
      },
    },
  ];

  const UPGRADE_RECIPES = [
    {
      id: "unlock_wood_pickaxe",
      name: "Wood Pickaxe",
      description: "First mining upgrade. Lets you mine surface stone.",
      cost: { wood: 8, stick: 3 },
      icon: "wood",
      unlock: "pickaxe",
      track: "pickaxe",
      tier: 1,
    },
    {
      id: "unlock_stone_pickaxe",
      name: "Stone Pickaxe",
      description: "Lets you mine coal and iron ore.",
      cost: { wood: 6, stone: 8, stick: 4 },
      icon: "stone",
      unlock: "orePickaxe",
      track: "pickaxe",
      tier: 2,
      requires: ["pickaxe"],
    },
    {
      id: "unlock_iron_pickaxe",
      name: "Iron Pickaxe",
      description: "Lets you mine gold ore and harvest faster.",
      cost: { wood: 4, iron_ingot: 4, stone: 4, stick: 5 },
      icon: "iron_ingot",
      unlock: "relicPickaxe",
      track: "pickaxe",
      tier: 3,
      requires: ["orePickaxe"],
    },
    {
      id: "unlock_gold_pickaxe",
      name: "Gold Pickaxe",
      description: "Lets you mine emerald and biome stones.",
      cost: { iron_ingot: 3, gold_ingot: 4, plank: 6, stick: 4 },
      icon: "gold_ingot",
      unlock: "mythicPickaxe",
      track: "pickaxe",
      tier: 4,
      requires: ["relicPickaxe"],
    },
    {
      id: "unlock_emerald_pickaxe",
      name: "Emerald Pickaxe",
      description: "Lets you mine diamond ore and maxes cave progression.",
      cost: { emerald: 4, gold_ingot: 5, plank: 8, stick: 6 },
      icon: "emerald",
      unlock: "primalPickaxe",
      track: "pickaxe",
      tier: 5,
      requires: ["mythicPickaxe"],
    },
    {
      id: "unlock_diamond_pickaxe",
      name: "Diamond Pickaxe",
      description: "Best mining speed and full resource access.",
      cost: { diamond: 4, emerald: 3, gold_ingot: 4, plank: 10, stick: 8 },
      icon: "diamond",
      unlock: "apexPickaxe",
      track: "pickaxe",
      tier: 6,
      requires: ["primalPickaxe"],
    },
    {
      id: "unlock_wood_sword",
      name: "Crude Sword",
      description: "Basic early weapon crafted from simple survival materials.",
      cost: { wood: 4, stick: 2 },
      icon: "wood",
      unlock: "sword",
      track: "sword",
      tier: 1,
    },
    {
      id: "unlock_stone_sword",
      name: "Reinforced Edge",
      description: "Bone reinforcement for a stronger cutting edge.",
      cost: { bone: 4, stick: 2 },
      icon: "bone",
      unlock: "sword2",
      track: "sword",
      tier: 2,
      requires: ["sword"],
    },
    {
      id: "unlock_iron_sword",
      name: "Serrated Edge",
      description: "Adds flesh serrations to increase sustained damage.",
      cost: { monster_flesh: 5, bone: 2, stick: 3 },
      icon: "monster_flesh",
      unlock: "sword3",
      track: "sword",
      tier: 3,
      requires: ["sword2"],
    },
    {
      id: "unlock_gold_sword",
      name: "Weighted Blade",
      description: "Weights and balances the blade for harder hits.",
      cost: { bone: 8, monster_flesh: 4, stone: 6, stick: 4 },
      icon: "stone",
      unlock: "sword4",
      track: "sword",
      tier: 4,
      requires: ["sword3"],
    },
    {
      id: "unlock_diamond_sword",
      name: "Blood-Hardened Blade",
      description: "Final sword upgrade forged with monster trophies.",
      cost: { monster_flesh: 10, bone: 6, iron_ingot: 2, stick: 5 },
      icon: "monster_flesh",
      unlock: "sword5",
      track: "sword",
      tier: 5,
      requires: ["sword4"],
    },
  ];

  const BUILD_CATEGORY_DEFS = Object.freeze([
    {
      id: "navigation",
      label: "Travel",
      description: "Paths, bridges, and travel structures.",
    },
    {
      id: "housing",
      label: "Homes",
      description: "Houses, beds, and living upgrades.",
    },
    {
      id: "stations",
      label: "Stations",
      description: "Crafting stations for processing resources.",
    },
    {
      id: "survival",
      label: "Survival",
      description: "Fire, medicine, and defensive utility.",
    },
    {
      id: "storage",
      label: "Storage",
      description: "Storage builds to organize supplies.",
    },
    {
      id: "maps",
      label: "Maps",
      description: "Landmark tracking maps and exploration tools.",
    },
    {
      id: "endgame",
      label: "Endgame",
      description: "Late-game automation and rescue objectives.",
    },
    {
      id: "upgrades",
      label: "Upgrades",
      description: "Unlock stronger tools and weapons.",
    },
  ]);

  const BUILD_RECIPE_CATEGORIES = Object.freeze({
    stick_bundle: "navigation",
    bridge: "navigation",
    bridge_bundle: "navigation",
    village_path: "navigation",
    dock: "navigation",
    small_house: "housing",
    medium_house: "housing",
    large_house: "housing",
    bed: "housing",
    smelter: "stations",
    sawmill: "stations",
    kiln: "stations",
    campfire: "survival",
    medicine: "survival",
    chest: "storage",
    village_map: "maps",
    cave_map: "maps",
    beacon: "endgame",
    robot: "endgame",
  });

  const UPGRADE_RECIPE_IDS = new Set(UPGRADE_RECIPES.map((recipe) => recipe.id));

  const STATION_RECIPES = {
    smelter: [
      {
        name: "Make Charcoal",
        description: "Burn wood into coal fuel for smelting.",
        input: { wood: 2 },
        output: { coal: 1 },
      },
      {
        name: "Smelt Iron Ingot",
        description: "Refine iron ore with coal.",
        input: { iron_ore: 1, coal: 1 },
        output: { iron_ingot: 1 },
      },
      {
        name: "Smelt Gold Ingot",
        description: "Refine gold ore with coal.",
        input: { gold_ore: 1, coal: 1 },
        output: { gold_ingot: 1 },
      },
      {
        name: "Cook Meat",
        description: "Cooked meat restores health when consumed. Fuel with wood or coal.",
        input: { raw_meat: 1 },
        inputAny: [{ wood: 1 }, { coal: 1 }],
        output: { cooked_meat: 1 },
      },
      {
        name: "Forge Beacon Core",
        description: "Critical component for rescue beacon.",
        input: { iron_ingot: 3, gold_ingot: 2, emerald: 1 },
        output: { beacon_core: 1 },
      },
    ],
    sawmill: [
      {
        name: "Saw Planks",
        description: "Convert logs into planks.",
        input: { wood: 2 },
        output: { plank: 1 },
      },
      {
        name: "Whittle Sticks",
        description: "Carve wood into stick bundles for tools and framing.",
        input: { wood: 1 },
        output: { stick: 2 },
      },
      {
        name: "Press Paper",
        description: "Refine cut grass into map paper.",
        input: { grass: 4 },
        output: { paper: 1 },
      },
    ],
    kiln: [
      {
        name: "Bake Bricks",
        description: "Convert stone into beacon-grade bricks.",
        input: { stone: 2, wood: 1 },
        output: { brick: 1 },
      },
      {
        name: "Forge Wayfinder Stone",
        description: "Shape a wayfinder charm-stone used to craft maps.",
        input: { brick: 1, paper: 1, stick: 1, gold_ingot: 1 },
        output: { wayfinder_stone: 1 },
      },
    ],
  };

  const BIOMES = [
    {
      key: "temperate",
      plains: true,
      land: [43, 122, 61],
      tree: "#2d8a4c",
      grassColor: "#79c66f",
      rock: "#8b8f9c",
      ore: "#8d5aa3",
      stoneColor: BIOME_STONES[0].color,
      sand: [214, 195, 141],
      treeRate: 0.075,
      rockRate: 0.035,
      grassRate: 0.02,
      oreRate: 0.012,
      stoneRate: 0.00055,
    },
    {
      key: "jungle",
      land: [23, 124, 72],
      tree: "#1fb869",
      grassColor: "#59d88f",
      rock: "#7c8a90",
      ore: "#7a4c8b",
      stoneColor: BIOME_STONES[1].color,
      sand: [207, 184, 124],
      treeRate: 0.11,
      rockRate: 0.03,
      grassRate: 0.028,
      grassDropQty: 2,
      oreRate: 0.01,
      stoneRate: 0.00055,
      treeMaxHp: 5,
      treeDropQty: 2,
      treeVisualScale: 1.12,
    },
    {
      key: "snow",
      land: [198, 214, 230],
      tree: "#e8f3ff",
      grassColor: "#b8d8f1",
      rock: "#9fa7b5",
      ore: "#7f6a9f",
      stoneColor: BIOME_STONES[2].color,
      sand: [226, 217, 184],
      treeRate: 0.045,
      rockRate: 0.045,
      grassRate: 0.015,
      oreRate: 0.015,
      stoneRate: 0.00055,
    },
    {
      key: "volcanic",
      land: [90, 72, 64],
      tree: "#8a6648",
      grassColor: "#8f7357",
      rock: "#6d6f7a",
      ore: "#c0724c",
      stoneColor: BIOME_STONES[3].color,
      sand: [201, 160, 113],
      treeRate: 0.02,
      rockRate: 0.04,
      grassRate: 0.01,
      oreRate: 0.03,
      stoneRate: 0.00055,
    },
    {
      key: "mangrove",
      land: [58, 96, 74],
      tree: "#3f835f",
      grassColor: "#6fa487",
      rock: "#6f7b74",
      ore: "#5a6a7c",
      stoneColor: BIOME_STONES[4].color,
      sand: [186, 163, 116],
      treeRate: 0.128,
      rockRate: 0.025,
      grassRate: 0.044,
      grassDropQty: 2,
      oreRate: 0.008,
      stoneRate: 0.00045,
      moveSpeedScale: 0.84,
      coastMoveSpeedScale: 0.74,
      animalSpawnScale: 0.85,
    },
    {
      key: "redwood",
      land: [34, 96, 52],
      tree: "#2f6b45",
      grassColor: "#6eac74",
      rock: "#7b857f",
      ore: "#6a778f",
      stoneColor: BIOME_STONES[5].color,
      sand: [198, 176, 132],
      treeRate: 0.142,
      rockRate: 0.016,
      grassRate: 0.019,
      oreRate: 0.009,
      stoneRate: 0.00045,
      treeMaxHp: 7,
      treeDropQty: 3,
      treeVisualScale: 1.34,
      animalSpawnScale: 0.95,
      nightMonsterStrength: 1.3,
    },
    {
      key: "ashlands",
      land: [72, 66, 68],
      tree: "#74625e",
      grassColor: "#8d7d77",
      rock: "#5f646d",
      ore: "#c07d57",
      stoneColor: BIOME_STONES[6].color,
      sand: [156, 140, 122],
      treeRate: 0.018,
      rockRate: 0.066,
      grassRate: 0.008,
      oreRate: 0.03,
      stoneRate: 0.0004,
      coalRockChance: 0.62,
      animalSpawnScale: 0.2,
    },
    {
      key: "marsh",
      land: [40, 109, 76],
      tree: "#4f9166",
      grassColor: "#78c192",
      rock: "#75877f",
      ore: "#5b6f63",
      stoneColor: BIOME_STONES[7].color,
      sand: [170, 156, 123],
      treeRate: 0.082,
      rockRate: 0.022,
      grassRate: 0.055,
      grassDropQty: 3,
      oreRate: 0.009,
      stoneRate: 0.00045,
      moveSpeedScale: 0.92,
      animalSpawnScale: 0.78,
      poisonMonsterChance: 0.62,
    },
    {
      key: "mushroom",
      land: [126, 82, 134],
      tree: "#d65c9f",
      grassColor: "#b47ad6",
      rock: "#7d6d8d",
      ore: "#8e6db9",
      stoneColor: "#c58ed6",
      sand: [206, 170, 145],
      treeRate: 0.062,
      rockRate: 0.02,
      grassRate: 0.04,
      grassDropQty: 2,
      oreRate: 0.006,
      stoneRate: 0.00035,
      animalSpawnScale: 1.08,
    },
  ];

  const BIOME_PICK_WEIGHTS = [
    0.23, // temperate (plains)
    0.13, // jungle
    0.1,  // snow
    0.1,  // volcanic
    0.14, // mangrove
    0.12, // redwood
    0.08, // ashlands
    0.09, // marsh
    0.01, // mushroom (rarest)
  ];

  const BIOME_KEYS = Object.freeze({
    plains: "temperate",
    jungle: "jungle",
    snow: "snow",
    mushroom: "mushroom",
  });

  const ABANDONED_ROBOT_OUTER_RING_RATIO = 0.16;
  const ABANDONED_ROBOT_FARTHEST_PERCENT = 0.28;
  const MAX_ISLAND_BRIDGE_GAP_TILES = 15;
  const SHIPWRECK_STORAGE_SIZE = CHEST_SIZE;
  const SHIPWRECK_CONFIG = Object.freeze({
    minPerWorld: 3,
    maxPerWorld: 6,
    minPairGapTiles: 5,
    maxPairGapTiles: 30,
    minSpacingTiles: 18,
    pairAttempts: 96,
  });
  const ABANDONED_SHIP_CONFIG = Object.freeze({
    footprint: { w: 4, h: 2 },
    maxPassengers: 5,
    minSpawnDistanceFromSpawnTiles: 24,
    maxSpawnDistanceFromSpawnTiles: 190,
    speedMax: 136,
    accel: 190,
    drag: 0.91,
    turnSpeed: 2.2,
    remoteInputTimeout: 0.35,
    repairCost: Object.freeze({
      wood: MAX_STACK * 2,
      stick: MAX_STACK,
      hide: 26,
      plank: 18,
    }),
  });

  const SURFACE_GUARDIAN_CONFIG = Object.freeze({
    spawnInterval: 5.8,
    maxTotal: 22,
    maxPerIsland: 2,
    minPlayerDistanceTiles: 4.5,
  });

  const MUSHROOM_GREEN_COW_CONFIG = Object.freeze({
    minPerIsland: 3,
    ensureAttemptsPerCow: 28,
    minSpacingTiles: 3.25,
  });

  const AMBIENT_FISH_CONFIG = Object.freeze({
    maxFish: 16,
    spawnIntervalMin: 1.5,
    spawnIntervalMax: 3.4,
    lifeMin: 4.2,
    lifeMax: 9.2,
    speedMin: 14,
    speedMax: 24,
    sizeMin: 4.5,
    sizeMax: 8.6,
  });

  const TREE_TRUNK = "#7a5a2f";

  const WIN_SEQUENCE = {
    beamDuration: 7.2,
    heliStart: 1.2,
    approachEnd: 3.8,
    ladderDropEnd: 5.0,
    climbEnd: 7.0,
    ladderRetractEnd: 8.2,
    heliExitEnd: 10.0,
    textDelay: 10.8,
  };

  const HOSTED_BASE_URL = "";

  const COLORS = {
    water: "#2a6c9d",
    player: "#ffe08a",
    highlight: "rgba(255, 255, 255, 0.6)",
    caveFloor: "#3b2f2a",
    caveWall: "#1c1411",
    caveEntrance: "#3c2a22",
  };

  const DRIFTWOOD_THEME = Object.freeze({
    bpm: 90,
    beatsPerBar: 4,
    introDuration: 16,
    mainLoopBars: 32,
    variationFadeStart: 150,
    variationFadeDuration: 72,
  });

  // Am - F - C - G - Am - F - G - Em
  const DRIFTWOOD_CHORDS = [
    [220.0, 261.63, 329.63],
    [174.61, 220.0, 261.63],
    [130.81, 164.81, 196.0],
    [196.0, 246.94, 293.66],
    [220.0, 261.63, 329.63],
    [174.61, 220.0, 261.63],
    [196.0, 246.94, 293.66],
    [164.81, 196.0, 246.94],
  ];

  const DRIFTWOOD_MELODY_PATTERN = [2, 3, 4, 2, 1, 2, 4, 5, 2, 3, 4, 2, 1, 2, 3, 1];
  const DRIFTWOOD_COUNTER_PATTERN = [4, 5, 3, 5, 4, 2, 5, 3];
  const DRIFTWOOD_BASS_PATTERN = [0.82, 0.58, 0.74, 0.62];
  const DRIFTWOOD_CLICK_PATTERN = [0.3, 0.17, 0.24, 0.18];
  const DRIFTWOOD_SWING_PATTERN = [0.012, 0.048, 0.016, 0.044];
  const MENU_THEME = Object.freeze({
    bpm: 108,
    beatsPerBar: 4,
    chords: [
      [261.63, 329.63, 392.0], // C
      [293.66, 369.99, 440.0], // Dm
      [349.23, 440.0, 523.25], // F
      [329.63, 415.3, 493.88], // Em
    ],
    arpPattern: [0, 1, 2, 1, 0, 2, 1, 3],
  });
  const MENU_THEME_GAIN = 1.45;
  const MUSIC_GAIN_BOOST = 2.35;
  const MONSTER_AUDIO_LIMIT = Object.freeze({
    perFrameMax: 4,
    idleCooldownMs: 90,
    moveCooldownMs: 70,
    windupCooldownMs: 110,
    aggroCooldownMs: 180,
    distantCooldownMs: 220,
  });
  const SETTINGS_KEY = "island_survival_settings_v1";
  const DEBUG_PASSCODE = "123";
  const SETTINGS_DEFAULTS = Object.freeze({
    musicVolume: 0.72,
    sfxVolume: 0.62,
    debugUnlocked: false,
    debugInfiniteResources: false,
    debugSpeedMultiplier: 1,
    debugWorldSpeedMultiplier: 1,
  });
  const MAP_ITEM_SET = new Set(["village_map", "cave_map"]);
  const MAP_PANEL = Object.freeze({
    minSize: 164,
    maxSize: 238,
    screenScale: 0.23,
  });
  const DEBUG_WILD_ROBOT_TOGGLE_HEIGHT = 24;
  const ROBOT_STORAGE_SIZE = CHEST_SIZE;
  const ROBOT_MODE = Object.freeze({
    trees: "trees",
    stone: "stone",
    grass: "grass",
  });
  const ROBOT_CONFIG = Object.freeze({
    speed: 78,
    mineRange: 16,
    mineCooldown: 0.62,
    mineDamage: 1,
    interactionPause: 0.9,
    retargetInterval: 0.8,
    retargetIdleInterval: 0.2,
    maxPathNodes: 14000,
    retargetPathChecks: 6,
    retargetPathFallbackChecks: 32,
    pathNodeSnapDistance: 5,
    stuckMoveEpsilon: 0.1,
    stuckRetargetTime: 1.1,
    sandStuckRetargetTime: 0.7,
    bridgePathChecks: 28,
  });

  let dpr = window.devicePixelRatio || 1;
  let viewWidth = window.innerWidth;
  let viewHeight = window.innerHeight;

  const keyState = new Map();
  let interactPressed = false;
  let attackPressed = false;
  let inventoryOpen = false;
  let buildCategory = "navigation";
  let selectedSlot = null;
  let activeSlot = 0;

  const touch = {
    active: false,
    pointerId: null,
    centerX: 0,
    centerY: 0,
    dx: 0,
    dy: 0,
  };

  const pointer = {
    x: 0,
    y: 0,
    active: false,
  };

  const hotbarSlots = [];
  const inventorySlots = [];
  const chestSlots = [];
  const itemTextureCache = new Map();

  const state = {
    world: null,
    surfaceWorld: null,
    player: null,
    inventory: null,
    structures: [],
    structureGrid: null,
    targetResource: null,
    targetMonster: null,
    targetAnimal: null,
    nearBench: false,
    nearBenchStructure: null,
    nearStation: null,
    nearChest: null,
    nearCave: null,
    nearHouse: null,
    nearBed: null,
    nearDock: null,
    activeStation: null,
    activeChest: null,
    activeCave: null,
    activeHouse: null,
    inCave: false,
    returnPosition: null,
    housePlayer: null,
    spawnTile: null,
    timeOfDay: 0,
    isNight: false,
    surfaceSpawnTimer: 0,
    surfaceGuardianSpawnTimer: SURFACE_GUARDIAN_CONFIG.spawnInterval,
    gameWon: false,
    winTimer: 0,
    winSequencePlayed: false,
    winPlayerPos: null,
    promptText: "",
    promptTimer: 0,
    dirty: false,
    saveTimer: CONFIG.saveInterval,
    nextDropId: 1,
    nextAnimalId: 1,
    respawnLock: false,
    checkpointTimer: 0,
    animalVocalTimer: 2.6,
    settingsTab: "settings",
    musicVolume: SETTINGS_DEFAULTS.musicVolume,
    sfxVolume: SETTINGS_DEFAULTS.sfxVolume,
    debugUnlocked: SETTINGS_DEFAULTS.debugUnlocked,
    debugMoses: false,
    debugInfiniteResources: SETTINGS_DEFAULTS.debugInfiniteResources,
    debugWorldMapVisible: false,
    debugShowAbandonedRobot: false,
    debugContinentalShift: false,
    debugPlaceRepairedBoat: false,
    debugBoatPlacePending: false,
    debugIslandDrag: null,
    debugSpeedMultiplier: SETTINGS_DEFAULTS.debugSpeedMultiplier,
    debugWorldSpeedMultiplier: SETTINGS_DEFAULTS.debugWorldSpeedMultiplier,
    ambientFish: [],
    ambientFishSpawnTimer: 0,
    nearShip: null,
    activeShipRepair: null,
    shipActionPending: false,
    shipControlSendTimer: 0,
  };

  let wasNearBench = false;

  const net = {
    enabled: false,
    ready: false,
    isHost: false,
    peer: null,
    hostConn: null,
    roomId: null,
    hostId: null,
    playerId: null,
    connections: new Map(),
    players: new Map(),
    pendingPlaces: new Map(),
    pendingHousePlaces: new Map(),
    snapshotTimer: NET_CONFIG.snapshotInterval,
    motionTimer: NET_CONFIG.motionInterval,
    playerTimer: NET_CONFIG.playerSendInterval,
    robotPausePingTimer: 0.2,
    localName: "",
    localColor: "",
  };

  const audio = {
    ctx: null,
    master: null,
    limiter: null,
    sfxBus: null,
    musicBus: null,
    musicGain: null,
    padGain: null,
    filter: null,
    oscA: null,
    oscB: null,
    oscC: null,
    bassGain: null,
    bassFilter: null,
    bassOsc: null,
    textureSource: null,
    textureGain: null,
    textureFilter: null,
    variationGain: null,
    lfo: null,
    lfoGain: null,
    caveAmbienceSource: null,
    caveAmbienceGain: null,
    caveAmbienceFilter: null,
    caveAmbienceLfo: null,
    caveAmbienceLfoGain: null,
    noiseBuffer: null,
    chordIndex: 0,
    chordTimer: 0,
    noteTimer: 0,
    noteIndex: 0,
    themeTime: 0,
    introPluckTimer: 0,
    mainTime: 0,
    prevMainBeat: -1,
    loopBeats: 0,
    variationMix: 0,
    monsterStates: new Map(),
    nightWindTimer: 0,
    caveWindTimer: 0,
    distantMonsterTimer: 0,
    dayWindTimer: 0,
    menuActive: false,
    menuBeatTimer: 0,
    menuBeatIndex: 0,
    menuPadTimer: 0,
    sfxLimiter: new Map(),
    enabled: false,
  };

  const PEER_OPTIONS = {
    host: "0.peerjs.com",
    port: 443,
    path: "/",
    secure: true,
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    },
  };

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    if (clean.length !== 6) return [255, 255, 255];
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  }

  function tintColor(hex, amount) {
    const [r, g, b] = hexToRgb(hex);
    const t = amount < 0 ? 0 : 255;
    const p = Math.abs(amount);
    const nr = Math.round((t - r) * p + r);
    const ng = Math.round((t - g) * p + g);
    const nb = Math.round((t - b) * p + b);
    return `rgb(${nr}, ${ng}, ${nb})`;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function pointSegmentDistance(px, py, ax, ay, bx, by) {
    const abx = bx - ax;
    const aby = by - ay;
    const apx = px - ax;
    const apy = py - ay;
    const denom = abx * abx + aby * aby;
    const t = denom > 0 ? clamp((apx * abx + apy * aby) / denom, 0, 1) : 0;
    const cx = ax + abx * t;
    const cy = ay + aby * t;
    return Math.hypot(px - cx, py - cy);
  }

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function smoothValue(current, target, dt, speed = NET_CONFIG.renderSmooth) {
    const factor = 1 - Math.exp(-dt * speed);
    return current + (target - current) * factor;
  }

  function clampVolume(value, fallback) {
    const num = Number(value);
    if (!Number.isFinite(num)) return fallback;
    return clamp(num, 0, 1);
  }

  function clampDebugSpeedMultiplier(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return SETTINGS_DEFAULTS.debugSpeedMultiplier;
    return clamp(num, 1, 4);
  }

  function clampDebugWorldSpeedMultiplier(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return SETTINGS_DEFAULTS.debugWorldSpeedMultiplier;
    return clamp(num, 1, 10);
  }

  function saveUserSettings() {
    const payload = {
      musicVolume: clampVolume(state.musicVolume, SETTINGS_DEFAULTS.musicVolume),
      sfxVolume: clampVolume(state.sfxVolume, SETTINGS_DEFAULTS.sfxVolume),
      debugUnlocked: !!state.debugUnlocked,
      debugInfiniteResources: !!state.debugInfiniteResources,
      debugSpeedMultiplier: clampDebugSpeedMultiplier(state.debugSpeedMultiplier),
      debugWorldSpeedMultiplier: clampDebugWorldSpeedMultiplier(state.debugWorldSpeedMultiplier),
    };
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(payload));
    } catch (err) {
      // ignore settings persistence failures
    }
  }

  function loadUserSettings() {
    let raw = null;
    try {
      raw = window.localStorage.getItem(SETTINGS_KEY);
    } catch (err) {
      raw = null;
    }
    if (!raw) return;
    try {
      const data = JSON.parse(raw);
      state.musicVolume = clampVolume(data.musicVolume, SETTINGS_DEFAULTS.musicVolume);
      state.sfxVolume = clampVolume(data.sfxVolume, SETTINGS_DEFAULTS.sfxVolume);
      // Debug access is session-based: always start locked on every load/join.
      state.debugUnlocked = false;
      // Always start sessions with infinite resources off; users can toggle it per run.
      state.debugInfiniteResources = false;
      state.debugSpeedMultiplier = clampDebugSpeedMultiplier(data.debugSpeedMultiplier);
      state.debugWorldSpeedMultiplier = clampDebugWorldSpeedMultiplier(data.debugWorldSpeedMultiplier);
    } catch (err) {
      state.musicVolume = SETTINGS_DEFAULTS.musicVolume;
      state.sfxVolume = SETTINGS_DEFAULTS.sfxVolume;
      state.debugUnlocked = false;
      state.debugInfiniteResources = SETTINGS_DEFAULTS.debugInfiniteResources;
      state.debugSpeedMultiplier = SETTINGS_DEFAULTS.debugSpeedMultiplier;
      state.debugWorldSpeedMultiplier = SETTINGS_DEFAULTS.debugWorldSpeedMultiplier;
    }
  }

  function updateVolumeUI() {
    if (musicVolumeInput) {
      musicVolumeInput.value = String(Math.round(clampVolume(state.musicVolume, SETTINGS_DEFAULTS.musicVolume) * 100));
    }
    if (musicVolumeValue) {
      musicVolumeValue.textContent = `${Math.round(clampVolume(state.musicVolume, SETTINGS_DEFAULTS.musicVolume) * 100)}%`;
    }
    if (sfxVolumeInput) {
      sfxVolumeInput.value = String(Math.round(clampVolume(state.sfxVolume, SETTINGS_DEFAULTS.sfxVolume) * 100));
    }
    if (sfxVolumeValue) {
      sfxVolumeValue.textContent = `${Math.round(clampVolume(state.sfxVolume, SETTINGS_DEFAULTS.sfxVolume) * 100)}%`;
    }
  }

  function getDebugSpeedMultiplier() {
    if (!state.debugUnlocked) return 1;
    return clampDebugSpeedMultiplier(state.debugSpeedMultiplier);
  }

  function getDebugWorldSpeedMultiplier() {
    if (!state.debugUnlocked) return 1;
    if (netIsClient()) return 1;
    return clampDebugWorldSpeedMultiplier(state.debugWorldSpeedMultiplier);
  }

  function updateDebugSpeedUI() {
    const mult = clampDebugSpeedMultiplier(state.debugSpeedMultiplier);
    if (debugSpeedInput) {
      debugSpeedInput.value = String(Math.round(mult * 100));
      debugSpeedInput.disabled = !state.debugUnlocked;
    }
    if (debugSpeedValue) {
      debugSpeedValue.textContent = `${mult.toFixed(1)}x`;
    }
  }

  function updateDebugWorldSpeedUI() {
    const mult = clampDebugWorldSpeedMultiplier(state.debugWorldSpeedMultiplier);
    if (debugWorldSpeedInput) {
      debugWorldSpeedInput.value = String(Math.round(mult * 100));
      debugWorldSpeedInput.disabled = !state.debugUnlocked;
    }
    if (debugWorldSpeedValue) {
      debugWorldSpeedValue.textContent = `${mult.toFixed(1)}x`;
    }
  }

  function setDebugSpeedFromPercent(percent, persist = true) {
    const mult = clampDebugSpeedMultiplier((Number(percent) || 100) / 100);
    state.debugSpeedMultiplier = mult;
    updateDebugSpeedUI();
    if (persist) saveUserSettings();
  }

  function setDebugWorldSpeedFromPercent(percent, persist = true) {
    const mult = clampDebugWorldSpeedMultiplier((Number(percent) || 100) / 100);
    state.debugWorldSpeedMultiplier = mult;
    updateDebugWorldSpeedUI();
    if (persist) saveUserSettings();
  }

  function applyAudioLevels() {
    const music = clampVolume(state.musicVolume, SETTINGS_DEFAULTS.musicVolume);
    const sfx = clampVolume(state.sfxVolume, SETTINGS_DEFAULTS.sfxVolume);
    if (audio.musicBus) {
      audio.musicBus.gain.setTargetAtTime(
        clamp(music * MUSIC_GAIN_BOOST, 0, 2.2),
        audio.ctx?.currentTime || 0,
        0.04
      );
    }
    if (audio.sfxBus) {
      audio.sfxBus.gain.setTargetAtTime(sfx, audio.ctx?.currentTime || 0, 0.04);
    }
  }

  function setMusicVolumeFromPercent(percent, persist = true) {
    state.musicVolume = clampVolume((Number(percent) || 0) / 100, SETTINGS_DEFAULTS.musicVolume);
    updateVolumeUI();
    applyAudioLevels();
    if (persist) saveUserSettings();
  }

  function setSfxVolumeFromPercent(percent, persist = true) {
    state.sfxVolume = clampVolume((Number(percent) || 0) / 100, SETTINGS_DEFAULTS.sfxVolume);
    updateVolumeUI();
    applyAudioLevels();
    if (persist) saveUserSettings();
  }

  function setDebugUnlocked(unlocked, persist = true) {
    state.debugUnlocked = !!unlocked;
    if (debugToggle) {
      debugToggle.classList.toggle("hidden", !state.debugUnlocked);
      debugToggle.disabled = !state.debugUnlocked;
    }
    if (debugUnlockStatus) {
      debugUnlockStatus.textContent = state.debugUnlocked
        ? "Debug tools unlocked"
        : "Debug tools locked";
    }
    if (unlockDebugBtn) {
      unlockDebugBtn.textContent = state.debugUnlocked
        ? "Debug Tools Unlocked"
        : "Access Debug Tools";
    }
    if (!state.debugUnlocked && debugPanel) {
      debugPanel.classList.add("hidden");
    }
    if (!state.debugUnlocked) {
      state.debugMoses = false;
      state.debugInfiniteResources = false;
      state.debugWorldMapVisible = false;
      state.debugShowAbandonedRobot = false;
      state.debugContinentalShift = false;
      state.debugPlaceRepairedBoat = false;
      state.debugBoatPlacePending = false;
      state.debugIslandDrag = null;
      state.debugSpeedMultiplier = 1;
      state.debugWorldSpeedMultiplier = 1;
      if (buildMenu && !buildMenu.classList.contains("hidden")) {
        renderBuildMenu();
      }
      if (stationMenu && !stationMenu.classList.contains("hidden")) {
        renderStationMenu();
      }
    }
    updateMosesButton();
    updateInfiniteResourcesButton();
    updateDebugWorldMapButton();
    updateContinentalShiftButton();
    updateDebugPlaceBoatButton();
    updateDebugSpeedUI();
    updateDebugWorldSpeedUI();
    if (persist) saveUserSettings();
  }

  function updateMosesButton() {
    if (!mosesBtn) return;
    mosesBtn.textContent = state.debugMoses ? "Moses: On" : "Moses: Off";
    mosesBtn.setAttribute("aria-pressed", state.debugMoses ? "true" : "false");
  }

  function isInfiniteResourcesEnabled() {
    return !!state.debugUnlocked && !!state.debugInfiniteResources;
  }

  function updateInfiniteResourcesButton() {
    if (!infiniteResourcesBtn) return;
    const enabled = isInfiniteResourcesEnabled();
    infiniteResourcesBtn.textContent = enabled
      ? "Infinite Resources: On"
      : "Infinite Resources: Off";
    infiniteResourcesBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
  }

  function updateDebugWorldMapButton() {
    if (!debugWorldMapBtn) return;
    const enabled = !!state.debugWorldMapVisible && !!state.debugUnlocked;
    debugWorldMapBtn.disabled = !state.debugUnlocked;
    debugWorldMapBtn.textContent = enabled
      ? "World Mini-Map: On"
      : "World Mini-Map: Off";
    debugWorldMapBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
  }

  function updateContinentalShiftButton() {
    if (!continentalShiftBtn) return;
    const enabled = !!state.debugUnlocked && !!state.debugContinentalShift;
    continentalShiftBtn.disabled = !state.debugUnlocked;
    continentalShiftBtn.textContent = enabled
      ? "Continental Shift: On"
      : "Continental Shift: Off";
    continentalShiftBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
  }

  function isDebugBoatPlacementActive() {
    return !!state.debugUnlocked && !!state.debugPlaceRepairedBoat;
  }

  function updateDebugPlaceBoatButton() {
    if (!debugPlaceBoatBtn) return;
    const enabled = isDebugBoatPlacementActive();
    debugPlaceBoatBtn.disabled = !state.debugUnlocked;
    debugPlaceBoatBtn.textContent = enabled
      ? "Place Boat (Repaired): On"
      : "Place Boat (Repaired): Off";
    debugPlaceBoatBtn.setAttribute("aria-pressed", enabled ? "true" : "false");
  }

  function ensureAudioContext() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    if (!audio.ctx) {
      const ctx = new AudioCtor();
      const master = ctx.createGain();
      master.gain.value = 0.88;
      const limiter = ctx.createDynamicsCompressor();
      limiter.threshold.setValueAtTime(-18, ctx.currentTime);
      limiter.knee.setValueAtTime(18, ctx.currentTime);
      limiter.ratio.setValueAtTime(8, ctx.currentTime);
      limiter.attack.setValueAtTime(0.003, ctx.currentTime);
      limiter.release.setValueAtTime(0.18, ctx.currentTime);
      master.connect(limiter);
      limiter.connect(ctx.destination);
      const musicBus = ctx.createGain();
      const sfxBus = ctx.createGain();
      musicBus.connect(master);
      sfxBus.connect(master);
      audio.ctx = ctx;
      audio.master = master;
      audio.limiter = limiter;
      audio.musicBus = musicBus;
      audio.sfxBus = sfxBus;
      audio.enabled = true;
      applyAudioLevels();
    }
    if (audio.ctx.state === "suspended") {
      audio.ctx.resume().catch(() => {});
    }
    return audio.ctx;
  }

  function getNoiseBuffer() {
    if (!audio.ctx) return null;
    if (audio.noiseBuffer) return audio.noiseBuffer;
    const size = audio.ctx.sampleRate;
    const buffer = audio.ctx.createBuffer(1, size, audio.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i += 1) {
      data[i] = Math.random() * 2 - 1;
    }
    audio.noiseBuffer = buffer;
    return buffer;
  }

  function getDriftwoodBeatDuration() {
    return 60 / DRIFTWOOD_THEME.bpm;
  }

  function getDriftwoodLoopBeats() {
    return DRIFTWOOD_THEME.mainLoopBars * DRIFTWOOD_THEME.beatsPerBar;
  }

  function driftwoodNoise(seed) {
    const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453123;
    return value - Math.floor(value);
  }

  function getDriftwoodChordIndexAtBeat(beatIndex) {
    const beatsPerChord = DRIFTWOOD_THEME.beatsPerBar;
    const chordCycleBeats = DRIFTWOOD_CHORDS.length * beatsPerChord;
    const wrapped = ((beatIndex % chordCycleBeats) + chordCycleBeats) % chordCycleBeats;
    return Math.floor(wrapped / beatsPerChord);
  }

  function getDriftwoodTone(chord, step) {
    if (!Array.isArray(chord) || chord.length < 3) return 220;
    const tones = [
      chord[0],
      chord[1],
      chord[2],
      chord[0] * 2,
      chord[1] * 2,
      chord[2] * 2,
    ];
    const index = ((step % tones.length) + tones.length) % tones.length;
    return tones[index];
  }

  function stopMenuAudio() {
    audio.menuActive = false;
    audio.menuBeatTimer = 0;
    audio.menuBeatIndex = 0;
    audio.menuPadTimer = 0;
  }

  function stopCaveAmbience() {
    for (const key of ["caveAmbienceLfo", "caveAmbienceSource"]) {
      const node = audio[key];
      if (!node) continue;
      try {
        node.stop();
      } catch (err) {
        // ignore stop errors for already-ended nodes
      }
      try {
        node.disconnect();
      } catch (err) {
        // ignore disconnect errors
      }
      audio[key] = null;
    }
    for (const key of ["caveAmbienceLfoGain", "caveAmbienceFilter", "caveAmbienceGain"]) {
      const node = audio[key];
      if (!node) continue;
      try {
        node.disconnect();
      } catch (err) {
        // ignore disconnect errors
      }
      audio[key] = null;
    }
  }

  function ensureCaveAmbience() {
    if (!audio.ctx || !audio.enabled || !audio.sfxBus) return;
    if (audio.caveAmbienceSource && audio.caveAmbienceGain && audio.caveAmbienceFilter) {
      const now = audio.ctx.currentTime;
      audio.caveAmbienceGain.gain.setTargetAtTime(0.0046, now, 1.2);
      audio.caveAmbienceFilter.frequency.setTargetAtTime(330, now, 1.6);
      return;
    }

    const noise = getNoiseBuffer();
    if (!noise) return;
    const ctx = audio.ctx;
    const now = ctx.currentTime;
    const source = ctx.createBufferSource();
    source.buffer = noise;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(330, now);
    filter.Q.setValueAtTime(0.28, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.0046, now + 1.4);

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.setValueAtTime(0.048, now);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(84, now);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audio.sfxBus);

    source.start(now);
    lfo.start(now);

    audio.caveAmbienceSource = source;
    audio.caveAmbienceFilter = filter;
    audio.caveAmbienceGain = gain;
    audio.caveAmbienceLfo = lfo;
    audio.caveAmbienceLfoGain = lfoGain;
  }

  function stopAmbientAudio() {
    stopCaveAmbience();
    for (const key of ["oscA", "oscB", "oscC", "lfo", "bassOsc", "textureSource"]) {
      const node = audio[key];
      if (!node) continue;
      try {
        node.stop();
      } catch (err) {
        // ignore stop errors for already-ended nodes
      }
      try {
        node.disconnect();
      } catch (err) {
        // ignore disconnect errors
      }
      audio[key] = null;
    }
    for (const key of [
      "lfoGain",
      "filter",
      "musicGain",
      "padGain",
      "bassGain",
      "bassFilter",
      "textureGain",
      "textureFilter",
      "variationGain",
    ]) {
      const node = audio[key];
      if (!node) continue;
      try {
        node.disconnect();
      } catch (err) {
        // ignore disconnect errors
      }
      audio[key] = null;
    }
    audio.themeTime = 0;
    audio.introPluckTimer = 0;
    audio.mainTime = 0;
    audio.prevMainBeat = -1;
    audio.loopBeats = 0;
    audio.variationMix = 0;
    if (audio.monsterStates instanceof Map) audio.monsterStates.clear();
    audio.nightWindTimer = 0;
    audio.caveWindTimer = 0;
    audio.distantMonsterTimer = 0;
    audio.dayWindTimer = 0;
    audio.chordTimer = 0;
    audio.noteTimer = 0;
    audio.noteIndex = 0;
  }

  function setAmbientChord(index, glideSeconds = 1.4) {
    if (!audio.ctx || !audio.oscA || !audio.oscB || !audio.oscC) return;
    const chord = DRIFTWOOD_CHORDS[
      (index % DRIFTWOOD_CHORDS.length + DRIFTWOOD_CHORDS.length) % DRIFTWOOD_CHORDS.length
    ];
    const now = audio.ctx.currentTime;
    const glide = Math.max(0.01, glideSeconds);
    audio.oscA.frequency.setTargetAtTime(chord[0], now, glide);
    audio.oscB.frequency.setTargetAtTime(chord[1], now, glide * 0.92);
    audio.oscC.frequency.setTargetAtTime(chord[2], now, glide * 0.86);
    if (audio.bassOsc) {
      audio.bassOsc.frequency.setTargetAtTime(chord[0] * 0.5, now, glide * 0.75);
    }
    if (audio.filter) {
      const nightShift = state.isNight ? -180 : 180;
      const variationLift = 420 * (audio.variationMix || 0);
      const target = clamp(1700 + nightShift + variationLift, 1050, 3300);
      audio.filter.frequency.setTargetAtTime(target, now, glide * 0.6);
    }
  }

  function startAmbientAudio() {
    if (!audio.ctx || !audio.musicBus) return;
    stopAmbientAudio();
    const ctx = audio.ctx;
    const now = ctx.currentTime;
    const musicGain = ctx.createGain();
    musicGain.gain.setValueAtTime(0.0001, now);
    musicGain.gain.exponentialRampToValueAtTime(0.086, now + 1.9);
    musicGain.connect(audio.musicBus);

    const padFilter = ctx.createBiquadFilter();
    padFilter.type = "lowpass";
    padFilter.frequency.value = 1900;
    padFilter.Q.value = 0.42;

    const padGain = ctx.createGain();
    padGain.gain.value = 0.26;
    padFilter.connect(padGain);
    padGain.connect(musicGain);

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const oscC = ctx.createOscillator();
    oscA.type = "triangle";
    oscB.type = "sawtooth";
    oscC.type = "sine";
    oscA.detune.value = -5;
    oscB.detune.value = 6;
    oscC.detune.value = 2;

    const voiceA = ctx.createGain();
    const voiceB = ctx.createGain();
    const voiceC = ctx.createGain();
    voiceA.gain.value = 0.104;
    voiceB.gain.value = 0.063;
    voiceC.gain.value = 0.067;

    oscA.connect(voiceA);
    oscB.connect(voiceB);
    oscC.connect(voiceC);
    voiceA.connect(padFilter);
    voiceB.connect(padFilter);
    voiceC.connect(padFilter);

    const bassOsc = ctx.createOscillator();
    bassOsc.type = "triangle";
    bassOsc.detune.value = -2;
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = "lowpass";
    bassFilter.frequency.value = 330;
    bassFilter.Q.value = 0.65;
    const bassGain = ctx.createGain();
    bassGain.gain.value = 0.0068;
    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(musicGain);

    const variationGain = ctx.createGain();
    variationGain.gain.value = 0.0001;
    variationGain.connect(musicGain);

    let textureSource = null;
    let textureFilter = null;
    let textureGain = null;
    const noiseBuffer = getNoiseBuffer();
    if (noiseBuffer) {
      textureSource = ctx.createBufferSource();
      textureSource.buffer = noiseBuffer;
      textureSource.loop = true;
      textureFilter = ctx.createBiquadFilter();
      textureFilter.type = "bandpass";
      textureFilter.frequency.value = 640;
      textureFilter.Q.value = 0.4;
      textureGain = ctx.createGain();
      textureGain.gain.value = 0.0012;
      textureSource.connect(textureFilter);
      textureFilter.connect(textureGain);
      textureGain.connect(musicGain);
    }

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.11;
    lfoGain.gain.value = 0.009;
    lfo.connect(lfoGain);
    lfoGain.connect(padGain.gain);

    audio.musicGain = musicGain;
    audio.padGain = padGain;
    audio.filter = padFilter;
    audio.oscA = oscA;
    audio.oscB = oscB;
    audio.oscC = oscC;
    audio.bassOsc = bassOsc;
    audio.bassFilter = bassFilter;
    audio.bassGain = bassGain;
    audio.textureSource = textureSource;
    audio.textureFilter = textureFilter;
    audio.textureGain = textureGain;
    audio.variationGain = variationGain;
    audio.lfo = lfo;
    audio.lfoGain = lfoGain;
    audio.loopBeats = getDriftwoodLoopBeats();
    audio.themeTime = 0;
    audio.introPluckTimer = 0.55;
    audio.mainTime = 0;
    audio.prevMainBeat = -1;
    audio.variationMix = 0;
    audio.chordIndex = 0;
    audio.chordTimer = 0;
    audio.noteTimer = 0;
    audio.noteIndex = 0;
    setAmbientChord(audio.chordIndex, 0.03);

    oscA.start(now);
    oscB.start(now);
    oscC.start(now);
    bassOsc.start(now);
    if (textureSource) textureSource.start(now);
    lfo.start(now);
  }

  function triggerAmbientNote(freq, when, intensity = 0.5, useVariationBus = false) {
    if (!audio.ctx || !audio.musicGain) return;
    const ctx = audio.ctx;
    const start = Math.max(ctx.currentTime, Number.isFinite(when) ? when : ctx.currentTime);
    const targetBus = (useVariationBus && audio.variationGain) ? audio.variationGain : audio.musicGain;
    const clampedIntensity = clamp(Number(intensity) || 0.5, 0.08, 1.2);
    const noteFreq = clamp(Number(freq) || 220, 80, 2500);
    const body = ctx.createOscillator();
    const ping = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    body.type = "triangle";
    ping.type = "sine";
    body.frequency.setValueAtTime(noteFreq, start);
    body.frequency.exponentialRampToValueAtTime(noteFreq * 0.982, start + 0.24);
    ping.frequency.setValueAtTime(noteFreq * 2.02, start);
    ping.frequency.exponentialRampToValueAtTime(noteFreq * 1.52, start + 0.14);
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(clamp(noteFreq * 2.4, 230, 4200), start);
    filter.Q.setValueAtTime(0.7, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.0138 * clampedIntensity, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.44);
    body.connect(filter);
    ping.connect(filter);
    filter.connect(gain);
    gain.connect(targetBus);
    body.start(start);
    ping.start(start);
    body.stop(start + 0.5);
    ping.stop(start + 0.28);
  }

  function triggerDriftwoodHarmonic(freq, when, intensity = 0.2, useVariationBus = false) {
    if (!audio.ctx || !audio.musicGain) return;
    const ctx = audio.ctx;
    const start = Math.max(ctx.currentTime, Number.isFinite(when) ? when : ctx.currentTime);
    const targetBus = (useVariationBus && audio.variationGain) ? audio.variationGain : audio.musicGain;
    const noteFreq = clamp(Number(freq) || 660, 150, 4200);
    const clampedIntensity = clamp(Number(intensity) || 0.2, 0.05, 1.1);
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(noteFreq, start);
    osc.frequency.exponentialRampToValueAtTime(noteFreq * 0.996, start + 1.15);
    filter.type = "highpass";
    filter.frequency.setValueAtTime(clamp(noteFreq * 0.9, 240, 2400), start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.0062 * clampedIntensity, start + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.18);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(targetBus);
    osc.start(start);
    osc.stop(start + 1.24);
  }

  function triggerDriftwoodClick(when, intensity = 0.2) {
    if (!audio.ctx || !audio.musicGain) return;
    const noise = getNoiseBuffer();
    if (!noise) return;
    const ctx = audio.ctx;
    const start = Math.max(ctx.currentTime, Number.isFinite(when) ? when : ctx.currentTime);
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    src.buffer = noise;
    filter.type = "highpass";
    filter.frequency.setValueAtTime(2200, start);
    filter.Q.setValueAtTime(0.8, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.0039 * clamp(intensity, 0.05, 1.2), start + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.025);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(audio.musicGain);
    src.start(start);
    src.stop(start + 0.032);
  }

  function triggerDriftwoodBrush(when, intensity = 0.14) {
    if (!audio.ctx || !audio.musicGain) return;
    const noise = getNoiseBuffer();
    if (!noise) return;
    const ctx = audio.ctx;
    const start = Math.max(ctx.currentTime, Number.isFinite(when) ? when : ctx.currentTime);
    const src = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    src.buffer = noise;
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1300, start);
    filter.Q.setValueAtTime(0.6, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.0022 * clamp(intensity, 0.05, 1.2), start + 0.014);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.12);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(audio.musicGain);
    src.start(start);
    src.stop(start + 0.14);
  }

  function triggerDriftwoodBassPulse(freq, when, intensity = 0.62) {
    if (!audio.ctx || !audio.musicGain) return;
    const ctx = audio.ctx;
    const start = Math.max(ctx.currentTime, Number.isFinite(when) ? when : ctx.currentTime);
    const baseFreq = clamp(Number(freq) || 110, 45, 260);
    const clampedIntensity = clamp(Number(intensity) || 0.62, 0.1, 1.3);
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(baseFreq * 1.12, start);
    osc.frequency.exponentialRampToValueAtTime(baseFreq, start + 0.09);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.92, start + 0.24);
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(340, start);
    filter.Q.setValueAtTime(0.75, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.0092 * clampedIntensity, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.27);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audio.musicGain);
    osc.start(start);
    osc.stop(start + 0.31);
  }

  function scheduleDriftwoodBeat(beatIndex, when) {
    const loopBeats = Math.max(1, audio.loopBeats || getDriftwoodLoopBeats());
    const wrappedBeat = ((beatIndex % loopBeats) + loopBeats) % loopBeats;
    const beatInBar = wrappedBeat % DRIFTWOOD_THEME.beatsPerBar;
    const barIndex = Math.floor(wrappedBeat / DRIFTWOOD_THEME.beatsPerBar);
    const chordIndex = getDriftwoodChordIndexAtBeat(wrappedBeat);

    if (chordIndex !== audio.chordIndex) {
      audio.chordIndex = chordIndex;
      setAmbientChord(chordIndex, 1.2);
    }

    const chord = DRIFTWOOD_CHORDS[chordIndex];
    if (!chord) return;
    const beatDuration = getDriftwoodBeatDuration();
    const bassLevel = DRIFTWOOD_BASS_PATTERN[beatInBar] || 0.62;
    const clickLevel = DRIFTWOOD_CLICK_PATTERN[beatInBar] || 0.18;
    const swing = DRIFTWOOD_SWING_PATTERN[beatInBar] || 0.012;

    triggerDriftwoodBassPulse(chord[0] * 0.5, when, bassLevel + (beatInBar === 0 ? 0.08 : 0));

    triggerDriftwoodClick(when + 0.004, clickLevel);
    triggerDriftwoodBrush(when + beatDuration * 0.5, 0.1 + clickLevel * 0.42);
    if (beatInBar === 1 || beatInBar === 3) {
      triggerDriftwoodClick(when + beatDuration * 0.52, 0.11 + clickLevel * 0.28);
    }

    const melodyStep = DRIFTWOOD_MELODY_PATTERN[wrappedBeat % DRIFTWOOD_MELODY_PATTERN.length];
    const melodyFreq = getDriftwoodTone(chord, melodyStep);
    const pluckLevel = (beatInBar === 0 ? 0.72 : 0.56) + (audio.variationMix > 0.2 ? 0.05 : 0);
    triggerAmbientNote(melodyFreq, when + swing, pluckLevel, false);
    audio.noteIndex += 1;

    if (beatInBar === 2 || wrappedBeat % 8 === 6) {
      triggerDriftwoodHarmonic(chord[1] * 2, when + 0.07, 0.18 + audio.variationMix * 0.18, false);
    }

    if (audio.variationMix > 0.05 && (beatInBar === 1 || beatInBar === 3)) {
      const counterStep = DRIFTWOOD_COUNTER_PATTERN[(barIndex + beatInBar) % DRIFTWOOD_COUNTER_PATTERN.length];
      const counterFreq = getDriftwoodTone(chord, counterStep);
      const mixGain = 0.16 + audio.variationMix * 0.34;
      triggerAmbientNote(counterFreq, when + beatDuration * 0.53, mixGain, true);
      if (beatInBar === 3) {
        triggerDriftwoodHarmonic(counterFreq * 0.5, when + beatDuration * 0.67, mixGain * 0.56, true);
      }
    }
  }

  function updateDriftwoodIntro(dt) {
    audio.introPluckTimer -= dt;
    if (audio.introPluckTimer > 0) return;
    const progress = clamp(audio.themeTime / DRIFTWOOD_THEME.introDuration, 0, 0.999);
    const introChordIndex = Math.floor(progress * 4);
    if (introChordIndex !== audio.chordIndex) {
      audio.chordIndex = introChordIndex;
      setAmbientChord(audio.chordIndex, 2.4);
    }
    const chord = DRIFTWOOD_CHORDS[audio.chordIndex % DRIFTWOOD_CHORDS.length];
    if (chord) {
      const seed = Math.floor(audio.themeTime * 12);
      const toneStep = Math.floor(driftwoodNoise(seed + 13) * 6);
      const freq = getDriftwoodTone(chord, toneStep);
      const now = audio.ctx?.currentTime || 0;
      triggerAmbientNote(freq, now + 0.03, 0.34 + progress * 0.3, false);
      if (progress > 0.28) {
        triggerDriftwoodHarmonic(chord[1] * 2, now + 0.09, 0.12 + progress * 0.2, false);
      }
      audio.noteIndex += 1;
    }
    const gap = 1.6 + driftwoodNoise(Math.floor(audio.themeTime) + 27) * 1.2;
    audio.introPluckTimer += gap;
  }

  function updateDriftwoodMain(dt) {
    if (!audio.ctx) return;
    const beatDuration = getDriftwoodBeatDuration();
    const prevTime = audio.mainTime;
    audio.mainTime += dt;
    const prevBeat = Math.floor(prevTime / beatDuration);
    const nextBeat = Math.floor(audio.mainTime / beatDuration);
    const now = audio.ctx.currentTime;

    for (let beat = prevBeat + 1; beat <= nextBeat; beat += 1) {
      const beatTime = beat * beatDuration;
      const when = now + Math.max(0, beatTime - audio.mainTime);
      scheduleDriftwoodBeat(beat, when);
      audio.prevMainBeat = beat;
    }
  }

  function updateAnimalAmbience(dt) {
    if (!state.player) return;
    if (state.inCave || state.gameWon) return;
    const world = state.surfaceWorld || state.world;
    if (!world || !Array.isArray(world.animals) || world.animals.length === 0) return;
    state.animalVocalTimer -= dt;
    if (state.animalVocalTimer > 0) return;

    const nearby = [];
    for (const animal of world.animals) {
      if (!animal || animal.hp <= 0) continue;
      const dist = Math.hypot(animal.x - state.player.x, animal.y - state.player.y);
      if (dist <= CONFIG.tileSize * 13.5) {
        nearby.push(animal);
      }
    }

    if (nearby.length === 0) {
      state.animalVocalTimer = 2.2 + Math.random() * 2.4;
      return;
    }

    const animal = nearby[Math.floor(Math.random() * nearby.length)];
    playSfx(getAnimalIdleSfx(animal.type), {
      intensity: animal.type === "boar" ? 0.78 : 0.82,
    });
    state.animalVocalTimer = 3.6 + Math.random() * 4.8;
  }

  function getMonsterAudioProfile(type) {
    return MONSTER_AUDIO_PROFILES[type] || MONSTER_AUDIO_PROFILES.crawler;
  }

  function getLocalWorldAudioTag(world) {
    if (!world) return "none";
    const surface = state.surfaceWorld || state.world;
    if (world === surface) {
      return `surface:${surface?.seed || "seed"}`;
    }
    if (state.activeCave?.world === world) {
      return `cave:${state.activeCave?.id ?? "active"}`;
    }
    const cave = surface?.caves?.find((entry) => entry?.world === world);
    if (cave) return `cave:${cave.id}`;
    return `world:${world.size || 0}`;
  }

  function getSfxDistanceIntensity(distance, maxRange) {
    if (!Number.isFinite(distance)) return 1;
    const range = Math.max(1, Number(maxRange) || (CONFIG.tileSize * 12));
    const ratio = clamp(1 - (distance / range), 0, 1);
    return ratio * ratio;
  }

  function canPlayLimitedSfx(key, cooldownMs, nowMs = performance.now()) {
    if (!audio.sfxLimiter) {
      audio.sfxLimiter = new Map();
    }
    const k = String(key || "");
    const cooldown = Math.max(0, Number(cooldownMs) || 0);
    const last = audio.sfxLimiter.get(k);
    if (Number.isFinite(last) && (nowMs - last) < cooldown) {
      return false;
    }
    audio.sfxLimiter.set(k, nowMs);
    if (audio.sfxLimiter.size > 420) {
      const staleBefore = nowMs - 8000;
      for (const [entryKey, value] of audio.sfxLimiter.entries()) {
        if (!Number.isFinite(value) || value < staleBefore) {
          audio.sfxLimiter.delete(entryKey);
        }
      }
    }
    return true;
  }

  function updateEnvironmentalSoundscape(dt) {
    if (!audio.ctx || !audio.enabled || !state.player || !state.world) return;
    const world = state.world;
    const monsters = Array.isArray(world.monsters)
      ? world.monsters.filter((monster) => monster && monster.hp > 0)
      : [];

    if (state.inCave) {
      ensureCaveAmbience();
      audio.caveWindTimer -= dt;
      if (audio.caveWindTimer <= 0) {
        playSfx("caveWind", { intensity: 0.46 + Math.random() * 0.32 });
        audio.caveWindTimer = 4 + Math.random() * 2.8;
      }
      audio.distantMonsterTimer -= dt;
      if (audio.distantMonsterTimer <= 0 && monsters.length > 0) {
        const pick = monsters[Math.floor(Math.random() * monsters.length)];
        const dist = Math.hypot((pick.x ?? 0) - state.player.x, (pick.y ?? 0) - state.player.y);
        const intensity = getSfxDistanceIntensity(Math.max(dist, CONFIG.tileSize * 6), CONFIG.tileSize * 24);
        if (
          intensity > 0.06
          && canPlayLimitedSfx(
            `monster:distant:cave:${state.activeCave?.id ?? "active"}`,
            MONSTER_AUDIO_LIMIT.distantCooldownMs
          )
        ) {
          playSfx("monsterIdle", {
            monsterType: pick.type,
            inCave: true,
            intensity: 0.2 + intensity * 0.55,
            distance: dist,
          });
        }
        audio.distantMonsterTimer = 3.7 + Math.random() * 3.4;
      }
      return;
    }
    stopCaveAmbience();

    if (state.isNight) {
      audio.nightWindTimer -= dt;
      if (audio.nightWindTimer <= 0) {
        playSfx("nightWind", { intensity: 0.5 + Math.random() * 0.5 });
        audio.nightWindTimer = 6.4 + Math.random() * 4.2;
      }
      audio.distantMonsterTimer -= dt;
      if (audio.distantMonsterTimer <= 0 && monsters.length > 0) {
        const pick = monsters[Math.floor(Math.random() * monsters.length)];
        const dist = Math.hypot((pick.x ?? 0) - state.player.x, (pick.y ?? 0) - state.player.y);
        const intensity = getSfxDistanceIntensity(Math.max(dist, CONFIG.tileSize * 5), CONFIG.tileSize * 26);
        if (
          intensity > 0.08
          && canPlayLimitedSfx(
            `monster:distant:surface:${state.surfaceWorld?.seed ?? "seed"}`,
            MONSTER_AUDIO_LIMIT.distantCooldownMs
          )
        ) {
          playSfx("monsterIdle", {
            monsterType: pick.type,
            inCave: false,
            intensity: 0.16 + intensity * 0.6,
            distance: dist,
          });
        }
        audio.distantMonsterTimer = 4.1 + Math.random() * 4.8;
      }
      return;
    }

    audio.dayWindTimer -= dt;
    if (audio.dayWindTimer <= 0) {
      playSfx("dayWind", { intensity: 0.25 + Math.random() * 0.25 });
      audio.dayWindTimer = 11 + Math.random() * 8;
    }
  }

  function updateMonsterSoundscape(dt) {
    if (!audio.ctx || !audio.enabled || !state.player || !state.world) return;
    const world = state.world;
    if (!Array.isArray(world.monsters)) return;
    if (!(audio.monsterStates instanceof Map)) {
      audio.monsterStates = new Map();
    }

    const worldTag = getLocalWorldAudioTag(world);
    const nowMs = performance.now();
    let triggeredThisTick = 0;
    const seen = new Set();
    const playerHidden = !state.inCave && !!state.player.inHut;

    for (const monster of world.monsters) {
      if (!monster || monster.hp <= 0) continue;
      const key = `${worldTag}:${monster.id}`;
      seen.add(key);
      const profile = getMonsterAudioProfile(monster.type);
      const dist = Math.hypot((monster.x ?? 0) - state.player.x, (monster.y ?? 0) - state.player.y);
      const aggroRange = Number(monster.aggroRange) || MONSTER.aggroRange;
      const aggroNow = !playerHidden && dist <= aggroRange * 1.02;
      const meleeRange = Number(monster.attackRange) || MONSTER.attackRange;

      const stateEntry = audio.monsterStates.get(key) || {
        x: monster.x,
        y: monster.y,
        idleTimer: profile.idleIntervalMin + Math.random() * (profile.idleIntervalMax - profile.idleIntervalMin),
        stepTimer: profile.stepIntervalMin + Math.random() * (profile.stepIntervalMax - profile.stepIntervalMin),
        windupTimer: 0.25 + Math.random() * 0.45,
        aggro: false,
        prevAttackTimer: Number(monster.attackTimer) || 0,
        lastSeen: nowMs,
      };
      stateEntry.lastSeen = nowMs;

      if (
        triggeredThisTick < MONSTER_AUDIO_LIMIT.perFrameMax
        && aggroNow
        && !stateEntry.aggro
        && dist <= CONFIG.tileSize * 14
        && canPlayLimitedSfx(`monster:aggro:${worldTag}`, MONSTER_AUDIO_LIMIT.aggroCooldownMs, nowMs)
      ) {
        playSfx("monsterAggro", {
          monsterType: monster.type,
          inCave: state.inCave,
          distance: dist,
          intensity: 0.45 + getSfxDistanceIntensity(dist, CONFIG.tileSize * 14) * 0.7,
        });
        triggeredThisTick += 1;
      }
      stateEntry.aggro = aggroNow;

      stateEntry.idleTimer -= dt;
      if (
        triggeredThisTick < MONSTER_AUDIO_LIMIT.perFrameMax
        && dist <= profile.idleRange
        && stateEntry.idleTimer <= 0
        && canPlayLimitedSfx(`monster:idle:${worldTag}`, MONSTER_AUDIO_LIMIT.idleCooldownMs, nowMs)
      ) {
        const idleChance = aggroNow ? 0.34 : 1;
        if (Math.random() <= idleChance) {
          playSfx("monsterIdle", {
            monsterType: monster.type,
            inCave: state.inCave,
            distance: dist,
            intensity: 0.24 + getSfxDistanceIntensity(dist, profile.idleRange) * (aggroNow ? 0.5 : 0.75),
          });
          triggeredThisTick += 1;
        }
        stateEntry.idleTimer = profile.idleIntervalMin
          + Math.random() * (profile.idleIntervalMax - profile.idleIntervalMin)
          + (aggroNow ? 0.4 : 0);
      }

      const moved = Math.hypot((monster.x ?? 0) - (stateEntry.x ?? monster.x), (monster.y ?? 0) - (stateEntry.y ?? monster.y));
      const speed = dt > 0 ? (moved / dt) : 0;
      stateEntry.stepTimer -= dt * clamp(speed / 34, 0.35, 2.7);
      if (
        triggeredThisTick < MONSTER_AUDIO_LIMIT.perFrameMax
        &&
        dist <= CONFIG.tileSize * 10.5
        && speed >= profile.moveThreshold
        && stateEntry.stepTimer <= 0
        && canPlayLimitedSfx(`monster:move:${worldTag}`, MONSTER_AUDIO_LIMIT.moveCooldownMs, nowMs)
      ) {
        playSfx("monsterMove", {
          monsterType: monster.type,
          inCave: state.inCave,
          distance: dist,
          intensity: 0.2 + getSfxDistanceIntensity(dist, CONFIG.tileSize * 11) * 0.75,
        });
        triggeredThisTick += 1;
        stateEntry.stepTimer = profile.stepIntervalMin
          + Math.random() * (profile.stepIntervalMax - profile.stepIntervalMin);
      }

      stateEntry.windupTimer = Math.max(0, stateEntry.windupTimer - dt);
      if (
        triggeredThisTick < MONSTER_AUDIO_LIMIT.perFrameMax
        &&
        aggroNow
        && dist <= Math.max(meleeRange * 1.45, CONFIG.tileSize * 1.8)
        && stateEntry.windupTimer <= 0
        && canPlayLimitedSfx(`monster:windup:${worldTag}`, MONSTER_AUDIO_LIMIT.windupCooldownMs, nowMs)
      ) {
        playSfx("monsterWindup", {
          monsterType: monster.type,
          inCave: state.inCave,
          distance: dist,
          intensity: 0.18 + getSfxDistanceIntensity(dist, CONFIG.tileSize * 8) * 0.55,
        });
        triggeredThisTick += 1;
        stateEntry.windupTimer = Math.max(0.32, (Number(monster.attackCooldown) || 1.0) * 0.72);
      }

      stateEntry.prevAttackTimer = Number(monster.attackTimer) || 0;

      stateEntry.x = monster.x;
      stateEntry.y = monster.y;
      audio.monsterStates.set(key, stateEntry);
    }

    for (const [key, stateEntry] of audio.monsterStates.entries()) {
      const stale = !stateEntry || (nowMs - (stateEntry.lastSeen || 0)) > 12000;
      if (stale || key.startsWith(`${worldTag}:`) && !seen.has(key)) {
        audio.monsterStates.delete(key);
      }
    }
  }

  function updateMenuAudio(dt) {
    if (!audio.ctx || !audio.enabled || !audio.musicBus) return;
    if (!audio.menuActive) {
      audio.menuActive = true;
      audio.menuBeatTimer = 0;
      audio.menuBeatIndex = 0;
      audio.menuPadTimer = 0;
    }
    const beatDuration = 60 / MENU_THEME.bpm;
    audio.menuBeatTimer -= dt;
    audio.menuPadTimer -= dt;
    const now = audio.ctx.currentTime;
    while (audio.menuBeatTimer <= 0) {
      const beat = audio.menuBeatIndex;
      const chord = MENU_THEME.chords[
        Math.floor(beat / MENU_THEME.beatsPerBar) % MENU_THEME.chords.length
      ];
      const arpIndex = MENU_THEME.arpPattern[beat % MENU_THEME.arpPattern.length] % chord.length;
      const when = now + Math.max(0, audio.menuBeatTimer + beatDuration);
      const intensity = 0.52 + ((beat % MENU_THEME.beatsPerBar === 0) ? 0.2 : 0);
      const bassFreq = chord[0] * (beat % MENU_THEME.beatsPerBar === 0 ? 0.5 : 0.25);

      playSfxTone({
        bus: audio.musicBus,
        wave: "triangle",
        freqStart: bassFreq,
        freqEnd: bassFreq * 0.88,
        duration: 0.26,
        attack: 0.02,
        peak: 0.021 * intensity * MENU_THEME_GAIN,
        when,
        filterType: "lowpass",
        filterFreq: 680,
        filterQ: 0.48,
      });
      playSfxTone({
        bus: audio.musicBus,
        wave: "sine",
        freqStart: chord[arpIndex],
        freqEnd: chord[arpIndex] * 0.99,
        duration: 0.2,
        attack: 0.01,
        peak: 0.017 * intensity * MENU_THEME_GAIN,
        when: when + 0.01,
        filterType: "lowpass",
        filterFreq: 2100,
        filterQ: 0.55,
      });
      if (beat % MENU_THEME.beatsPerBar === 2) {
        playSfxTone({
          bus: audio.musicBus,
          wave: "sine",
          freqStart: chord[2] * 1.01,
          freqEnd: chord[2] * 0.96,
          duration: 0.24,
          attack: 0.02,
          peak: 0.011 * intensity * MENU_THEME_GAIN,
          when: when + 0.03,
          filterType: "bandpass",
          filterFreq: 1300,
          filterQ: 0.5,
        });
      }
      audio.menuBeatIndex += 1;
      audio.menuBeatTimer += beatDuration;
    }

    if (audio.menuPadTimer <= 0) {
      const chord = MENU_THEME.chords[
        Math.floor(audio.menuBeatIndex / MENU_THEME.beatsPerBar) % MENU_THEME.chords.length
      ];
      const when = now + 0.02;
      for (let i = 0; i < chord.length; i += 1) {
        playSfxTone({
          bus: audio.musicBus,
          wave: "triangle",
          freqStart: chord[i] * 0.5,
          freqEnd: chord[i] * 0.49,
          duration: 1.2,
          attack: 0.16,
          peak: 0.0045 * MENU_THEME_GAIN,
          when: when + i * 0.015,
          filterType: "lowpass",
          filterFreq: 980,
          filterQ: 0.45,
        });
      }
      audio.menuPadTimer = beatDuration * MENU_THEME.beatsPerBar;
    }
  }

  function updateAudio(dt) {
    if (!audio.ctx || !audio.enabled) return;
    if (startScreen && !startScreen.classList.contains("hidden")) {
      stopAmbientAudio();
      updateMenuAudio(dt);
      return;
    }
    stopMenuAudio();
    if (!state.player || state.gameWon) {
      stopAmbientAudio();
      return;
    }
    if (!audio.oscA || !audio.oscB || !audio.oscC || !audio.musicGain) {
      startAmbientAudio();
      if (!audio.oscA || !audio.oscB || !audio.oscC) return;
    }

    audio.themeTime += dt;
    const now = audio.ctx.currentTime;
    const variationTarget = audio.themeTime >= DRIFTWOOD_THEME.variationFadeStart
      ? clamp(
          (audio.themeTime - DRIFTWOOD_THEME.variationFadeStart) / DRIFTWOOD_THEME.variationFadeDuration,
          0,
          1
        )
      : 0;
    audio.variationMix = smoothValue(audio.variationMix, variationTarget, dt, 0.9);

    if (audio.variationGain) {
      const gainTarget = 0.0001 + audio.variationMix * 1.05;
      audio.variationGain.gain.setTargetAtTime(gainTarget, now, 0.7);
    }
    if (audio.textureGain) {
      const textureTarget = 0.001 + audio.variationMix * 0.0012 + (state.isNight ? 0.00045 : 0);
      audio.textureGain.gain.setTargetAtTime(textureTarget, now, 0.8);
    }
    if (audio.bassGain) {
      const bassBedTarget = state.isNight ? 0.0076 : 0.0068;
      audio.bassGain.gain.setTargetAtTime(bassBedTarget, now, 0.7);
    }
    if (audio.filter) {
      const nightShift = state.isNight ? -180 : 180;
      const filterTarget = clamp(1670 + nightShift + audio.variationMix * 420, 1050, 3300);
      audio.filter.frequency.setTargetAtTime(filterTarget, now, 0.65);
    }

    if (audio.themeTime < DRIFTWOOD_THEME.introDuration) {
      updateDriftwoodIntro(dt);
    } else {
      if (audio.prevMainBeat < 0) {
        audio.chordIndex = getDriftwoodChordIndexAtBeat(0);
        setAmbientChord(audio.chordIndex, 1.25);
        scheduleDriftwoodBeat(0, now + 0.02);
        audio.prevMainBeat = 0;
      }
      updateDriftwoodMain(dt);
    }

    updateAnimalAmbience(dt);
    updateEnvironmentalSoundscape(dt);
    updateMonsterSoundscape(dt);
  }

  function playSfxTone(options = null) {
    if (!audio.ctx || !audio.enabled || !audio.sfxBus) return;
    const opts = options && typeof options === "object" ? options : {};
    const ctx = audio.ctx;
    const now = ctx.currentTime;
    const when = Math.max(now, Number(opts.when) || now);
    const duration = clamp(Number(opts.duration) || 0.12, 0.02, 2.6);
    const attack = clamp(Number(opts.attack) || 0.01, 0.001, duration * 0.8);
    const peak = clamp(Number(opts.peak) || 0.01, 0.0002, 0.6);
    const freqStart = clamp(Number(opts.freqStart) || 220, 20, 9000);
    const freqEnd = clamp(Number(opts.freqEnd ?? freqStart), 20, 9000);
    const wave = opts.wave || "sine";

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freqStart, when);
    if (Math.abs(freqEnd - freqStart) > 0.1) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, freqEnd), when + duration * 0.88);
    }
    if (Number.isFinite(opts.detune)) {
      osc.detune.setValueAtTime(Number(opts.detune), when);
    }

    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(peak, when + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    let outlet = gain;
    if (opts.filterType) {
      const filter = ctx.createBiquadFilter();
      filter.type = opts.filterType;
      filter.frequency.setValueAtTime(clamp(Number(opts.filterFreq) || 1200, 60, 12000), when);
      filter.Q.setValueAtTime(clamp(Number(opts.filterQ) || 0.6, 0.01, 30), when);
      osc.connect(filter);
      filter.connect(gain);
      outlet = gain;
    } else {
      osc.connect(gain);
    }

    const bus = opts.bus && typeof opts.bus.connect === "function"
      ? opts.bus
      : audio.sfxBus;
    outlet.connect(bus);
    osc.start(when);
    osc.stop(when + duration + 0.02);
  }

  function playSfxNoise(options = null) {
    if (!audio.ctx || !audio.enabled || !audio.sfxBus) return;
    const noise = getNoiseBuffer();
    if (!noise) return;
    const opts = options && typeof options === "object" ? options : {};
    const ctx = audio.ctx;
    const now = ctx.currentTime;
    const when = Math.max(now, Number(opts.when) || now);
    const duration = clamp(Number(opts.duration) || 0.1, 0.015, 2.2);
    const attack = clamp(Number(opts.attack) || 0.005, 0.001, duration * 0.75);
    const peak = clamp(Number(opts.peak) || 0.006, 0.0002, 0.5);

    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = opts.filterType || "bandpass";
    filter.frequency.setValueAtTime(clamp(Number(opts.filterFreq) || 1800, 60, 12000), when);
    filter.Q.setValueAtTime(clamp(Number(opts.filterQ) || 0.6, 0.01, 30), when);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(peak, when + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

    src.connect(filter);
    filter.connect(gain);
    const bus = opts.bus && typeof opts.bus.connect === "function"
      ? opts.bus
      : audio.sfxBus;
    gain.connect(bus);
    src.start(when);
    src.stop(when + duration + 0.03);
  }

  function getMonsterAudioTimbre(monsterType) {
    if (monsterType === "brute") {
      return { base: 86, upper: 144, step: 78, noise: 420 };
    }
    if (monsterType === "skeleton") {
      return { base: 174, upper: 258, step: 126, noise: 1880 };
    }
    if (monsterType === "marsh_stalker") {
      return { base: 134, upper: 214, step: 94, noise: 910 };
    }
    if (monsterType === "polar_bear") {
      return { base: 78, upper: 136, step: 70, noise: 360 };
    }
    if (monsterType === "lion") {
      return { base: 102, upper: 178, step: 88, noise: 740 };
    }
    if (monsterType === "wolf") {
      return { base: 120, upper: 208, step: 102, noise: 1120 };
    }
    return { base: 112, upper: 194, step: 96, noise: 1280 };
  }

  function playSfx(kind, options = null) {
    if (!audio.ctx || !audio.enabled || !audio.sfxBus) return;
    const opts = options && typeof options === "object" ? options : {};
    const intensity = clamp(Number(opts.intensity) || 1, 0.06, 1.6);
    const distScale = Number.isFinite(opts.distance)
      ? Math.max(0.08, getSfxDistanceIntensity(opts.distance, Number(opts.distanceRange) || (CONFIG.tileSize * 12)))
      : 1;
    const amp = intensity * distScale;

    if (kind === "chop") {
      playSfx("treeHit", opts);
      return;
    }
    if (kind === "mine") {
      playSfx("stoneHit", opts);
      return;
    }

    if (kind === "treeHit") {
      playSfxTone({
        wave: "triangle",
        freqStart: 236 + Math.random() * 28,
        freqEnd: 132 + Math.random() * 18,
        duration: 0.12,
        attack: 0.008,
        peak: 0.018 * amp,
      });
      playSfxNoise({
        duration: 0.05,
        peak: 0.004 * amp,
        filterType: "bandpass",
        filterFreq: 980 + Math.random() * 260,
        filterQ: 0.78,
      });
      return;
    }

    if (kind === "treeHitLow") {
      playSfxTone({
        wave: "triangle",
        freqStart: 176 + Math.random() * 18,
        freqEnd: 96 + Math.random() * 16,
        duration: 0.16,
        attack: 0.01,
        peak: 0.024 * amp,
      });
      playSfxNoise({
        duration: 0.07,
        peak: 0.005 * amp,
        filterType: "lowpass",
        filterFreq: 1200,
        filterQ: 0.65,
      });
      return;
    }

    if (kind === "treeBreak") {
      playSfxTone({
        wave: "triangle",
        freqStart: 148 + Math.random() * 12,
        freqEnd: 78 + Math.random() * 8,
        duration: 0.3,
        attack: 0.012,
        peak: 0.034 * amp,
      });
      playSfxNoise({
        duration: 0.18,
        peak: 0.008 * amp,
        filterType: "bandpass",
        filterFreq: 820 + Math.random() * 220,
        filterQ: 0.5,
      });
      return;
    }

    if (kind === "stoneHit") {
      playSfxTone({
        wave: "square",
        freqStart: 196 + Math.random() * 34,
        freqEnd: 96 + Math.random() * 22,
        duration: 0.12,
        attack: 0.007,
        peak: 0.018 * amp,
      });
      playSfxNoise({
        duration: 0.05,
        peak: 0.0045 * amp,
        filterType: "highpass",
        filterFreq: 1600 + Math.random() * 500,
        filterQ: 0.72,
      });
      return;
    }

    if (kind === "stoneBreak") {
      playSfxTone({
        wave: "square",
        freqStart: 150 + Math.random() * 24,
        freqEnd: 72 + Math.random() * 12,
        duration: 0.24,
        attack: 0.009,
        peak: 0.03 * amp,
      });
      playSfxNoise({
        duration: 0.16,
        peak: 0.008 * amp,
        filterType: "bandpass",
        filterFreq: 1200 + Math.random() * 400,
        filterQ: 0.62,
      });
      return;
    }

    if (kind === "oreHit") {
      playSfx("stoneHit", { ...opts, intensity: intensity * 0.82 });
      playSfxTone({
        wave: "sine",
        freqStart: 650 + Math.random() * 180,
        freqEnd: 430 + Math.random() * 120,
        duration: 0.13,
        attack: 0.006,
        peak: 0.0085 * amp,
      });
      return;
    }

    if (kind === "oreBreak") {
      playSfx("stoneBreak", { ...opts, intensity: intensity * 0.9 });
      playSfxTone({
        wave: "triangle",
        freqStart: 540 + Math.random() * 160,
        freqEnd: 320 + Math.random() * 100,
        duration: 0.2,
        attack: 0.01,
        peak: 0.011 * amp,
      });
      return;
    }

    if (kind === "grassRustle") {
      playSfxNoise({
        duration: 0.09,
        peak: 0.0043 * amp,
        filterType: "bandpass",
        filterFreq: 2100 + Math.random() * 650,
        filterQ: 0.42,
      });
      return;
    }

    if (kind === "grassCut") {
      playSfxNoise({
        duration: 0.12,
        peak: 0.0058 * amp,
        filterType: "highpass",
        filterFreq: 1800 + Math.random() * 480,
        filterQ: 0.66,
      });
      playSfxTone({
        wave: "triangle",
        freqStart: 280 + Math.random() * 55,
        freqEnd: 180 + Math.random() * 30,
        duration: 0.09,
        attack: 0.006,
        peak: 0.0065 * amp,
      });
      return;
    }

    if (kind === "monsterIdle") {
      const timbre = getMonsterAudioTimbre(opts.monsterType);
      const caveMult = opts.inCave ? 0.85 : 1;
      playSfxTone({
        wave: opts.monsterType === "skeleton" ? "sine" : "triangle",
        freqStart: (timbre.base + Math.random() * 18) * caveMult,
        freqEnd: (timbre.base * 0.78 + Math.random() * 10) * caveMult,
        duration: opts.inCave ? 0.28 : 0.2,
        attack: 0.016,
        peak: (opts.inCave ? 0.011 : 0.009) * amp,
        filterType: "lowpass",
        filterFreq: opts.inCave ? 760 : 1200,
        filterQ: 0.6,
      });
      playSfxNoise({
        duration: opts.inCave ? 0.18 : 0.12,
        peak: (opts.inCave ? 0.0035 : 0.0025) * amp,
        filterType: "bandpass",
        filterFreq: timbre.noise + (Math.random() - 0.5) * 240,
        filterQ: 0.5,
      });
      if (opts.inCave) {
        const when = (audio.ctx?.currentTime || 0) + 0.09;
        playSfxTone({
          wave: "sine",
          freqStart: timbre.upper * 0.9,
          freqEnd: timbre.upper * 0.76,
          duration: 0.24,
          attack: 0.02,
          peak: 0.0028 * amp,
          when,
        });
      }
      return;
    }

    if (kind === "monsterAggro") {
      const timbre = getMonsterAudioTimbre(opts.monsterType);
      const caveMult = opts.inCave ? 0.92 : 1;
      playSfxTone({
        wave: opts.monsterType === "brute" ? "sawtooth" : "triangle",
        freqStart: (timbre.upper * 1.08 + Math.random() * 24) * caveMult,
        freqEnd: (timbre.base * 0.86 + Math.random() * 16) * caveMult,
        duration: 0.34,
        attack: 0.015,
        peak: 0.028 * amp,
      });
      playSfxNoise({
        duration: 0.15,
        peak: 0.0075 * amp,
        filterType: "bandpass",
        filterFreq: opts.inCave ? 930 : 1320,
        filterQ: 0.72,
      });
      return;
    }

    if (kind === "monsterMove") {
      const timbre = getMonsterAudioTimbre(opts.monsterType);
      playSfxTone({
        wave: opts.monsterType === "skeleton" ? "square" : "triangle",
        freqStart: timbre.step + Math.random() * 20,
        freqEnd: timbre.step * 0.72 + Math.random() * 10,
        duration: opts.monsterType === "brute" ? 0.2 : 0.14,
        attack: 0.006,
        peak: 0.013 * amp,
      });
      playSfxNoise({
        duration: 0.07,
        peak: 0.0036 * amp,
        filterType: opts.inCave ? "bandpass" : "highpass",
        filterFreq: opts.inCave ? 740 : 1320,
        filterQ: 0.5,
      });
      return;
    }

    if (kind === "monsterWindup") {
      const timbre = getMonsterAudioTimbre(opts.monsterType);
      playSfxTone({
        wave: "sine",
        freqStart: timbre.upper * 0.74,
        freqEnd: timbre.upper * 1.03,
        duration: 0.18,
        attack: 0.03,
        peak: 0.01 * amp,
      });
      return;
    }

    if (kind === "monsterAttackHit") {
      const timbre = getMonsterAudioTimbre(opts.monsterType);
      playSfxTone({
        wave: "square",
        freqStart: timbre.upper * 0.96,
        freqEnd: timbre.base * 0.66,
        duration: 0.15,
        attack: 0.005,
        peak: 0.019 * amp,
      });
      playSfxNoise({
        duration: 0.08,
        peak: 0.0058 * amp,
        filterType: "bandpass",
        filterFreq: opts.inCave ? 900 : 1500,
        filterQ: 0.8,
      });
      return;
    }

    if (kind === "monsterAttackMiss") {
      const timbre = getMonsterAudioTimbre(opts.monsterType);
      playSfxTone({
        wave: "triangle",
        freqStart: timbre.upper * 0.86,
        freqEnd: timbre.upper * 0.6,
        duration: 0.14,
        attack: 0.012,
        peak: 0.0048 * amp,
      });
      playSfxNoise({
        duration: 0.08,
        attack: 0.01,
        peak: 0.0018 * amp,
        filterType: "bandpass",
        filterFreq: 1180,
        filterQ: 0.55,
      });
      return;
    }

    if (kind === "dayWind") {
      playSfxNoise({
        duration: 1.35,
        attack: 0.18,
        peak: 0.0023 * amp,
        filterType: "bandpass",
        filterFreq: 520,
        filterQ: 0.38,
      });
      return;
    }

    if (kind === "nightWind") {
      playSfxNoise({
        duration: 2.2,
        attack: 0.26,
        peak: 0.0032 * amp,
        filterType: "bandpass",
        filterFreq: 410,
        filterQ: 0.34,
      });
      playSfxTone({
        wave: "sine",
        freqStart: 112 + Math.random() * 26,
        freqEnd: 76 + Math.random() * 16,
        duration: 1.5,
        attack: 0.22,
        peak: 0.0015 * amp,
      });
      return;
    }

    if (kind === "caveWind") {
      playSfxNoise({
        duration: 2.7,
        attack: 0.34,
        peak: 0.0038 * amp,
        filterType: "bandpass",
        filterFreq: 300,
        filterQ: 0.3,
      });
      playSfxTone({
        wave: "triangle",
        freqStart: 98 + Math.random() * 20,
        freqEnd: 58 + Math.random() * 12,
        duration: 1.9,
        attack: 0.18,
        peak: 0.0017 * amp,
      });
      return;
    }

    if (kind === "swing") {
      playSfxTone({
        wave: "sawtooth",
        freqStart: 280,
        freqEnd: 130,
        duration: 0.08,
        attack: 0.008,
        peak: 0.016 * amp,
      });
      return;
    }

    if (kind === "hit") {
      playSfxTone({
        wave: "square",
        freqStart: 190,
        freqEnd: 70,
        duration: 0.12,
        attack: 0.01,
        peak: 0.023 * amp,
      });
      return;
    }

    if (kind === "damage" || kind === "hurt") {
      const pitchJitter = 0.92 + Math.random() * 0.19;
      playSfxTone({
        wave: "triangle",
        freqStart: 188 * pitchJitter,
        freqEnd: 92 * pitchJitter,
        duration: 0.18,
        attack: 0.012,
        peak: 0.028 * amp,
      });
      playSfxTone({
        wave: "sine",
        freqStart: 402 * pitchJitter,
        freqEnd: 230 * pitchJitter,
        duration: 0.12,
        attack: 0.008,
        peak: 0.007 * amp,
      });
      return;
    }

    if (kind === "animalBaa" || kind === "animalGoatIdle") {
      playSfxTone({
        wave: "triangle",
        freqStart: 330 + Math.random() * 70,
        freqEnd: 230 + Math.random() * 45,
        duration: 0.25,
        attack: 0.02,
        peak: 0.012 * amp,
      });
      return;
    }

    if (kind === "animalMoo" || kind === "animalCowIdle") {
      playSfxTone({
        wave: "sine",
        freqStart: 170 + Math.random() * 35,
        freqEnd: 118 + Math.random() * 20,
        duration: 0.3,
        attack: 0.03,
        peak: 0.013 * amp,
      });
      return;
    }

    if (kind === "animalBoarIdle") {
      playSfxTone({
        wave: "triangle",
        freqStart: 148 + Math.random() * 20,
        freqEnd: 88 + Math.random() * 16,
        duration: 0.22,
        attack: 0.018,
        peak: 0.011 * amp,
      });
      playSfxNoise({
        duration: 0.1,
        peak: 0.0028 * amp,
        filterType: "bandpass",
        filterFreq: 780,
        filterQ: 0.5,
      });
      return;
    }

    if (kind === "animalGoatHurt" || kind === "animalCowHurt" || kind === "animalBoarHurt") {
      const pitch = kind === "animalBoarHurt" ? 0.82 : 1;
      playSfxTone({
        wave: "triangle",
        freqStart: (250 + Math.random() * 35) * pitch,
        freqEnd: (138 + Math.random() * 28) * pitch,
        duration: 0.2,
        attack: 0.01,
        peak: 0.013 * amp,
      });
      return;
    }

    if (kind === "animalGoatDeath" || kind === "animalCowDeath" || kind === "animalBoarDeath") {
      const pitch = kind === "animalBoarDeath" ? 0.78 : 0.92;
      playSfxTone({
        wave: "triangle",
        freqStart: (172 + Math.random() * 22) * pitch,
        freqEnd: (78 + Math.random() * 14) * pitch,
        duration: 0.32,
        attack: 0.02,
        peak: 0.016 * amp,
      });
      playSfxNoise({
        duration: 0.14,
        peak: 0.0035 * amp,
        filterType: "bandpass",
        filterFreq: 620,
        filterQ: 0.42,
      });
      return;
    }

    if (kind === "ui") {
      playSfxTone({
        wave: "sine",
        freqStart: 360,
        freqEnd: 260,
        duration: 0.1,
        attack: 0.01,
        peak: 0.01 * amp,
      });
      return;
    }

    playSfxTone({
      wave: "sine",
      freqStart: 340,
      freqEnd: 240,
      duration: 0.09,
      attack: 0.008,
      peak: 0.008 * amp,
    });
  }

  function netIsHost() {
    return net.enabled && net.isHost;
  }

  function netIsClient() {
    return net.enabled && !net.isHost;
  }

  function netIsClientReady() {
    return net.enabled && !net.isHost && net.ready;
  }

  function updateMpStatus(text) {
    if (mpStatus) {
      mpStatus.textContent = text;
    }
  }

  function getRoomIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const queryRoom = params.get("room");
    if (queryRoom) return queryRoom;
    const hash = window.location.hash.replace("#", "");
    if (!hash) return null;
    const hashParams = new URLSearchParams(hash);
    return hashParams.get("room") || hash;
  }

  function setRoomIdInUrl(roomId) {
    if (!shouldPersistRoomInUrl()) return;
    const url = new URL(window.location.href);
    url.hash = `room=${roomId}`;
    window.history.replaceState(null, "", url.toString());
  }

  function shouldPersistRoomInUrl() {
    return !HOSTED_BASE_URL && window.location.protocol !== "file:";
  }

  function getOrCreateRoomId() {
    let roomId = getRoomIdFromUrl();
    if (!roomId) {
      roomId = `island-${Math.random().toString(36).slice(2, 8)}`;
      setRoomIdInUrl(roomId);
    }
    return roomId;
  }

  function resetMultiplayer(roomId) {
    if (!roomId) return;
    try {
      net.peer?.destroy();
    } catch (err) {
      // ignore
    }
    net.ready = false;
    net.isHost = false;
    net.peer = null;
    net.hostConn = null;
    net.playerId = null;
    net.connections.clear();
    net.players.clear();
    net.pendingPlaces.clear();
    net.pendingHousePlaces.clear();
    net.roomId = roomId;
    net.hostId = `${roomId}-host`;
    if (roomDisplay) {
      roomDisplay.textContent = `Room: ${roomId}`;
    }
    updateMpStatus("MP: Connecting");
    connectAsHostCandidate();
  }

  function getLocalProfile() {
    let name = "";
    let color = "";
    try {
      name = window.localStorage.getItem("island_mp_name") || "";
      color = window.localStorage.getItem("island_mp_color") || "";
    } catch (err) {
      name = "";
      color = "";
    }
    if (!name) {
      name = `Survivor-${Math.floor(100 + Math.random() * 900)}`;
      try {
        window.localStorage.setItem("island_mp_name", name);
      } catch (err) {
        // ignore
      }
    }
    if (!color) {
      color = PLAYER_COLORS[Math.floor(Math.random() * PLAYER_COLORS.length)];
      try {
        window.localStorage.setItem("island_mp_color", color);
      } catch (err) {
        // ignore
      }
    }
    return { name, color };
  }

  function buildSharePayload() {
    if (HOSTED_BASE_URL) {
      try {
        const hosted = new URL(HOSTED_BASE_URL);
        hosted.hash = `room=${net.roomId}`;
        return { text: hosted.toString(), prompt: "Hosted link copied" };
      } catch (err) {
        // fall through
      }
    }

    const url = new URL(window.location.href);
    if (url.protocol === "file:") {
      return {
        text: net.roomId,
        prompt: "Room code copied. Use Join Room on the other device.",
      };
    }
    url.hash = `room=${net.roomId}`;
    return { text: url.toString(), prompt: "Link copied" };
  }

  function copyRoomLink() {
    const payload = buildSharePayload();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(payload.text)
        .then(() => setPrompt(payload.prompt, 1.6))
        .catch(() => setPrompt(payload.text, 2.2));
    } else {
      setPrompt(payload.text, 2.2);
    }
  }

  function parseRoomInput(input) {
    if (!input) return null;
    let text = String(input).trim();
    if (!text) return null;
    if (text.startsWith("#")) text = text.slice(1);
    if (text.startsWith("room=")) text = text.slice(5);
    if (text.includes("://")) {
      try {
        const url = new URL(text);
        const hash = url.hash ? url.hash.replace(/^#/, "") : "";
        const hashParams = new URLSearchParams(hash);
        let room = hashParams.get("room");
        if (!room) room = url.searchParams.get("room");
        if (!room && hash) room = hash.startsWith("room=") ? hash.slice(5) : hash;
        return room || null;
      } catch (err) {
        // fall through to plain text
      }
    }
    return text || null;
  }

  function joinRoomPrompt() {
    const current = getRoomIdFromUrl() || net.roomId || "";
    const input = window.prompt("Enter room code or link:", current);
    const roomId = parseRoomInput(input);
    if (!roomId) {
      setPrompt("Invalid room code", 1.2);
      return;
    }
    if (shouldPersistRoomInUrl()) {
      setRoomIdInUrl(roomId);
    }
    resetMultiplayer(roomId);
  }

  function initMultiplayer() {
    if (typeof window.Peer !== "function") {
      updateMpStatus("MP: Offline");
      if (mpCopy) mpCopy.disabled = true;
      if (mpJoin) mpJoin.disabled = true;
      return;
    }
    net.enabled = true;
    const profile = getLocalProfile();
    net.localName = profile.name;
    net.localColor = profile.color;
    net.roomId = getOrCreateRoomId();
    net.hostId = `${net.roomId}-host`;
    if (roomDisplay) {
      roomDisplay.textContent = `Room: ${net.roomId}`;
    }
    updateMpStatus("MP: Connecting");
    if (mpCopy) {
      mpCopy.disabled = false;
      mpCopy.textContent = window.location.protocol === "file:" ? "Copy Room" : "Copy Link";
      mpCopy.addEventListener("click", copyRoomLink);
    }
    if (mpJoin) {
      mpJoin.disabled = false;
      mpJoin.addEventListener("click", joinRoomPrompt);
    }
    connectAsHostCandidate();
  }

  function initMultiplayerJoin(roomId) {
    if (typeof window.Peer !== "function") {
      updateMpStatus("MP: Offline");
      return;
    }
    net.enabled = true;
    const profile = getLocalProfile();
    net.localName = profile.name;
    net.localColor = profile.color;
    net.roomId = roomId;
    net.hostId = `${roomId}-host`;
    if (roomDisplay) {
      roomDisplay.textContent = `Room: ${net.roomId}`;
    }
    updateMpStatus("MP: Joining");
    connectAsClient();
  }

  function hideStartScreen() {
    if (startScreen) startScreen.classList.add("hidden");
  }

  function startSolo() {
    net.enabled = false;
    hideStartScreen();
    if (!state.world) {
      loadOrCreateGame();
      updateAllSlotUI();
    }
  }

  function startHost() {
    hideStartScreen();
    initMultiplayer();
    if (!state.world) {
      loadOrCreateGame();
      updateAllSlotUI();
    }
  }

  function startJoin() {
    const input = window.prompt("Enter room code:", "");
    const roomId = parseRoomInput(input);
    if (!roomId) {
      setPrompt("Invalid room code", 1.2);
      return;
    }
    hideStartScreen();
    initMultiplayerJoin(roomId);
    if (!state.world) {
      loadOrCreateGame();
      updateAllSlotUI();
    }
  }

  function connectAsHostCandidate() {
    const peer = new Peer(net.hostId, PEER_OPTIONS);
    net.peer = peer;
    peer.on("open", (id) => {
      if (id === net.hostId) {
        net.isHost = true;
        net.playerId = id;
        net.ready = true;
        updateMpStatus("MP: Host");
      }
    });
    peer.on("connection", (conn) => {
      if (net.isHost) setupConnection(conn, true);
    });
    peer.on("error", (err) => {
      if (err.type === "unavailable-id") {
        peer.destroy();
        connectAsClient();
        return;
      }
      console.warn("Peer error", err);
      updateMpStatus("MP: Error");
    });
  }

  function connectAsClient() {
    net.isHost = false;
    const peer = new Peer(undefined, PEER_OPTIONS);
    net.peer = peer;
    peer.on("open", (id) => {
      net.playerId = id;
      updateMpStatus("MP: Joining");
      connectToHost();
    });
    peer.on("error", (err) => {
      console.warn("Peer error", err);
      updateMpStatus("MP: Error");
    });
  }

  function connectToHost() {
    if (!net.peer) return;
    const conn = net.peer.connect(net.hostId, { reliable: true });
    net.hostConn = conn;
    setupConnection(conn, false);
  }

  function setupConnection(conn, isHostSide) {
    if (net.isHost) {
      net.connections.set(conn.peer, conn);
    }
    conn.on("open", () => {
      if (!isHostSide) {
        sendHello();
        updateMpStatus("MP: Connected");
      }
    });
    conn.on("data", (data) => handleNetMessage(conn, data));
    conn.on("close", () => {
      if (net.isHost) {
        net.connections.delete(conn.peer);
        net.players.delete(conn.peer);
        const shipChanged = removePlayerFromAllShips(conn.peer);
        if (shipChanged) {
          markDirty();
          const motion = buildMotionUpdate();
          if (motion) broadcastNet(motion);
        }
        broadcastNet({ type: "playerLeft", id: conn.peer }, conn.peer);
      } else {
        updateMpStatus("MP: Disconnected");
        net.ready = false;
      }
    });
    conn.on("error", (err) => {
      console.warn("Connection error", err);
    });
  }

  function sendHello() {
    if (!net.hostConn || !net.hostConn.open) return;
    net.hostConn.send({
      type: "hello",
      name: net.localName,
      color: net.localColor,
    });
  }

  function sendToHost(payload) {
    if (net.hostConn && net.hostConn.open) {
      net.hostConn.send(payload);
    }
  }

  function broadcastNet(payload, exceptId = null) {
    for (const [peerId, conn] of net.connections.entries()) {
      if (peerId === exceptId) continue;
      if (conn.open) conn.send(payload);
    }
  }

  function netSend(payload) {
    if (!net.enabled) return;
    if (net.isHost) {
      broadcastNet(payload);
    } else {
      sendToHost(payload);
    }
  }

  function handleNetMessage(conn, message) {
    if (!message || typeof message !== "object") return;
    switch (message.type) {
      case "hello":
        if (net.isHost) handleHello(conn, message);
        break;
      case "welcome":
        if (!net.isHost) handleWelcome(message);
        break;
      case "snapshot":
        if (!net.isHost) applyNetworkSnapshot(message);
        break;
      case "motion":
        if (!net.isHost) applyNetworkMotion(message);
        break;
      case "playerUpdate":
        if (net.isHost) {
          handlePlayerUpdate(conn, message);
        } else {
          applyRemotePlayerUpdate(message);
        }
        break;
      case "place":
        if (net.isHost) handlePlaceRequest(conn, message);
        break;
      case "placeResult":
        if (!net.isHost) handlePlaceResult(message);
        break;
      case "housePlace":
        if (net.isHost) handleHousePlaceRequest(conn, message);
        break;
      case "housePlaceResult":
        if (!net.isHost) handleHousePlaceResult(message);
        break;
      case "harvest":
        if (net.isHost) handleHarvestRequest(conn, message);
        break;
      case "attack":
        if (net.isHost) handleAttackRequest(conn, message);
        break;
      case "chestUpdate":
        if (net.isHost) handleChestUpdate(conn, message);
        break;
      case "robotCommand":
        if (net.isHost) handleRobotCommand(conn, message);
        break;
      case "shipAction":
        if (net.isHost) handleShipAction(conn, message);
        break;
      case "shipControl":
        if (net.isHost) handleShipControl(conn, message);
        break;
      case "shipRepairCommit":
        if (!net.isHost) handleShipRepairCommit(message);
        break;
      case "debugBoatPlace":
        if (net.isHost) handleDebugBoatPlace(conn, message);
        break;
      case "debugBoatPlaceResult":
        if (!net.isHost) handleDebugBoatPlaceResult(message);
        break;
      case "benchRobotControl":
        if (net.isHost) handleBenchRobotControl(conn, message);
        break;
      case "houseChestUpdate":
        if (net.isHost) handleHouseChestUpdate(conn, message);
        break;
      case "houseDestroyChest":
        if (net.isHost) handleHouseDestroyChest(conn, message);
        break;
      case "destroyChest":
        if (net.isHost) handleDestroyChest(conn, message);
        break;
      case "sleep":
        if (net.isHost) handleSleepRequest(conn);
        break;
      case "dropPickup":
        if (net.isHost) handleDropPickup(conn, message);
        break;
      case "dropItem":
        if (net.isHost) handleDropItemRequest(conn, message);
        break;
      case "deathDrop":
        if (net.isHost) handleDeathDropRequest(conn, message);
        break;
      case "damage":
        if (!net.isHost) handleDamageMessage(message);
        break;
      case "respawn":
        if (!net.isHost) handleRespawnMessage(message);
        break;
      case "playerLeft":
        if (!net.isHost) net.players.delete(message.id);
        break;
      default:
        break;
    }
  }

  function getPlayersSnapshot() {
    const players = [];
    if (state.player) {
      players.push({
        id: net.playerId || "local",
        name: net.localName || "Survivor",
        color: net.localColor || COLORS.player,
        x: state.player.x,
        y: state.player.y,
        facing: state.player.facing,
        hp: state.player.hp,
        maxHp: state.player.maxHp,
        toolTier: state.player.toolTier,
        checkpoint: normalizeCheckpoint(state.player.checkpoint),
        inHut: state.player.inHut,
        houseKey: state.player.inHut ? getHouseKey(state.activeHouse) : null,
        houseX: state.player.inHut ? state.housePlayer?.x ?? null : null,
        houseY: state.player.inHut ? state.housePlayer?.y ?? null : null,
        inCave: state.inCave,
        caveId: state.activeCave?.id ?? null,
        unlocks: normalizeUnlocks(state.player.unlocks),
      });
    }
    for (const [id, player] of net.players.entries()) {
      players.push({
        id,
        name: player.name,
        color: player.color,
        x: player.x,
        y: player.y,
        facing: player.facing,
        hp: player.hp,
        maxHp: player.maxHp,
        toolTier: player.toolTier,
        checkpoint: normalizeCheckpoint(player.checkpoint),
        inHut: player.inHut,
        houseKey: player.houseKey ?? null,
        houseX: player.houseX ?? null,
        houseY: player.houseY ?? null,
        inCave: player.inCave,
        caveId: player.caveId,
        unlocks: normalizeUnlocks(player.unlocks),
      });
    }
    return players;
  }

  function serializeWorldState(world) {
    return {
      resourceStates: world.resources.map((res) => serializeResource(res)),
      respawnTasks: world.respawnTasks ?? [],
      drops: (world.drops ?? []).map((drop) => ({
        id: drop.id,
        itemId: drop.itemId,
        qty: drop.qty,
        x: drop.x,
        y: drop.y,
        ttl: Number.isFinite(drop.ttl) ? drop.ttl : DROP_DESPAWN.lifetime,
      })),
      monsters: (world.monsters ?? []).map((monster) => ({
        id: monster.id,
        type: monster.type ?? "crawler",
        x: monster.x,
        y: monster.y,
        hp: monster.hp,
        maxHp: monster.maxHp,
        attackTimer: Math.max(0, Number(monster.attackTimer) || 0),
        dayBurning: !!monster.dayBurning,
        burnTimer: Math.max(0, Number(monster.burnTimer) || 0),
        burnDuration: Math.max(0, Number(monster.burnDuration) || 0),
        poisonDuration: Math.max(0, Number(monster.poisonDuration) || 0),
        poisonDps: Math.max(0, Number(monster.poisonDps) || 0),
      })),
      projectiles: (world.projectiles ?? []).map((projectile) => ({
        id: projectile.id,
        type: projectile.type || "arrow",
        monsterType: projectile.monsterType || "skeleton",
        x: projectile.x,
        y: projectile.y,
        vx: projectile.vx,
        vy: projectile.vy,
        life: projectile.life,
        maxLife: projectile.maxLife,
        damage: projectile.damage,
        radius: projectile.radius,
        poisonDuration: Math.max(0, Number(projectile.poisonDuration) || 0),
        poisonDps: Math.max(0, Number(projectile.poisonDps) || 0),
      })),
      animals: (world.animals ?? []).map((animal) => ({
        id: animal.id,
        type: animal.type,
        x: animal.x,
        y: animal.y,
        hp: animal.hp,
        maxHp: animal.maxHp,
        speed: animal.speed,
        color: animal.color,
      })),
      villagers: (world.villagers ?? []).map((villager) => ({
        id: villager.id,
        x: villager.x,
        y: villager.y,
        homeX: villager.homeX,
        homeY: villager.homeY,
        speed: villager.speed,
        color: villager.color,
        wanderRadius: villager.wanderRadius,
      })),
    };
  }

  function serializeStructuresList() {
    return state.structures
      .filter((structure) => !structure.removed)
      .map((structure) => ({
        type: structure.type,
        tx: structure.tx,
        ty: structure.ty,
        storage: structure.storage
          ? structure.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
          : null,
        meta: serializeStructureMeta(structure),
      }));
  }

  function serializeStructureMeta(structure) {
    if (!structure) return null;
    if (structure.type === "robot") {
      const robot = ensureRobotMeta(structure);
      if (!robot) return null;
      const meta = {
        robot: {
          homeTx: robot.homeTx,
          homeTy: robot.homeTy,
          x: robot.x,
          y: robot.y,
          mode: robot.mode,
          manualStop: !!robot.manualStop,
          state: robot.state,
          targetResourceId: Number.isInteger(robot.targetResourceId) ? robot.targetResourceId : null,
          mineTimer: robot.mineTimer,
          retargetTimer: robot.retargetTimer,
          pauseTimer: robot.pauseTimer,
          recallActive: !!robot.recallActive,
          recallBenchTx: Number.isInteger(robot.recallBenchTx) ? robot.recallBenchTx : null,
          recallBenchTy: Number.isInteger(robot.recallBenchTy) ? robot.recallBenchTy : null,
        },
      };
      if (structure.meta?.wildSpawn) meta.wildSpawn = true;
      return meta;
    }
    if (structure.type === "abandoned_ship") {
      const ship = ensureAbandonedShipMeta(structure);
      if (!ship) return null;
      const meta = {
        ship: {
          x: ship.x,
          y: ship.y,
          angle: ship.angle,
          vx: ship.vx,
          vy: ship.vy,
          repaired: !!ship.repaired,
          damage: ship.damage,
          driverId: ship.driverId,
          seats: Array.isArray(ship.seats) ? ship.seats.slice(0, ABANDONED_SHIP_CONFIG.maxPassengers) : [],
          driverInputX: ship.driverInputX,
          driverInputY: ship.driverInputY,
          controlAge: ship.controlAge,
        },
      };
      if (structure.meta?.seeded) meta.seeded = true;
      if (structure.meta?.debugPlaced) meta.debugPlaced = true;
      return meta;
    }
    if (!structure.meta) return null;
    const meta = structure.meta;
    if (meta.house) {
      const extra = {};
      if (meta.village) extra.village = true;
      if (meta.spawnedByPlayer) extra.spawnedByPlayer = true;
      return {
        ...extra,
        house: {
          tier: meta.house.tier,
          width: meta.house.width,
          height: meta.house.height,
          items: (meta.house.items || []).map((item) => ({
            type: item.type,
            tx: item.tx,
            ty: item.ty,
            storage: item.storage
              ? item.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
              : null,
          })),
        },
      };
    }
    // Preserve non-house metadata (e.g. village/spawn markers).
    return JSON.parse(JSON.stringify(meta));
  }

  function buildMonstersFromSnapshot(previous, snapshotMonsters, world = null) {
    const prevMap = new Map(
      Array.isArray(previous) ? previous.map((monster) => [monster.id, monster]) : []
    );
    if (!Array.isArray(snapshotMonsters)) return [];
    const seenIds = new Set();
    const built = snapshotMonsters.map((monster) => {
      if (!Number.isInteger(monster?.id)) return null;
      seenIds.add(monster.id);
      const prev = prevMap.get(monster.id);
      const type = monster.type ?? "crawler";
      const variant = getMonsterVariant(type);
      const sourceX = Number.isFinite(monster?.x) ? monster.x : (Number.isFinite(prev?.x) ? prev.x : prev?.renderX);
      const sourceY = Number.isFinite(monster?.y) ? monster.y : (Number.isFinite(prev?.y) ? prev.y : prev?.renderY);
      const validPos = world
        ? clampEntityPositionToWalkable(world, sourceX, sourceY, world === state.surfaceWorld ? 24 : 16)
        : (Number.isFinite(sourceX) && Number.isFinite(sourceY)
            ? { x: sourceX, y: sourceY }
            : null);
      if (!validPos) return null;
      const burnTimer = Math.max(
        0,
        typeof monster.burnTimer === "number"
          ? monster.burnTimer
          : (prev?.burnTimer ?? 0)
      );
      const burnDuration = Math.max(
        0,
        typeof monster.burnDuration === "number"
          ? monster.burnDuration
          : (prev?.burnDuration ?? 0)
      );
      return {
        id: monster.id,
        type,
        color: variant.color,
        x: validPos.x,
        y: validPos.y,
        hp: monster.hp,
        maxHp: monster.maxHp,
        speed: variant.speed,
        damage: variant.damage,
        attackRange: variant.attackRange,
        attackCooldown: variant.attackCooldown,
        aggroRange: variant.aggroRange,
        rangedRange: variant.rangedRange,
        attackTimer: Math.max(
          0,
          Number(monster.attackTimer ?? prev?.attackTimer) || 0
        ),
        hitTimer: 0,
        wanderTimer: 0,
        dayBurning: !!monster.dayBurning || burnTimer > 0,
        burnTimer,
        burnDuration,
        poisonDuration: Math.max(
          0,
          Number(
            monster.poisonDuration
            ?? prev?.poisonDuration
            ?? variant.poisonDuration
          ) || 0
        ),
        poisonDps: Math.max(
          0,
          Number(
            monster.poisonDps
            ?? prev?.poisonDps
            ?? variant.poisonDps
          ) || 0
        ),
        dir: { x: 0, y: 0 },
        renderX: prev?.renderX ?? validPos.x,
        renderY: prev?.renderY ?? validPos.y,
      };
    }).filter(Boolean);
    if (world) {
      for (const [id, prev] of prevMap.entries()) {
        if (seenIds.has(id)) continue;
        if (!prev || (!prev.dayBurning && (prev.burnTimer ?? 0) <= 0)) continue;
        const x = Number.isFinite(prev.x) ? prev.x : prev.renderX;
        const y = Number.isFinite(prev.y) ? prev.y : prev.renderY;
        if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
        spawnMonsterBurnBurst(world, x, y, 8);
      }
    }
    return built;
  }

  function buildProjectilesFromSnapshot(previous, snapshotProjectiles) {
    const prevMap = new Map(
      Array.isArray(previous) ? previous.map((projectile) => [projectile.id, projectile]) : []
    );
    if (!Array.isArray(snapshotProjectiles)) return [];
    return snapshotProjectiles.map((projectile) => {
      if (!Number.isInteger(projectile?.id)) return null;
      const prev = prevMap.get(projectile.id);
      return {
        id: projectile.id,
        type: projectile.type || "arrow",
        monsterType: projectile.monsterType || prev?.monsterType || "skeleton",
        x: projectile.x,
        y: projectile.y,
        vx: projectile.vx,
        vy: projectile.vy,
        life: projectile.life,
        maxLife: projectile.maxLife,
        damage: projectile.damage,
        radius: projectile.radius,
        poisonDuration: Math.max(0, Number(projectile.poisonDuration) || 0),
        poisonDps: Math.max(0, Number(projectile.poisonDps) || 0),
        renderX: prev?.renderX ?? projectile.x,
        renderY: prev?.renderY ?? projectile.y,
      };
    }).filter(Boolean);
  }

  function buildSnapshot() {
    const surface = state.surfaceWorld || state.world;
    return {
      type: "snapshot",
      seed: surface.seed,
      islandLayout: serializeIslandLayout(surface),
      timeOfDay: state.timeOfDay,
      isNight: state.isNight,
      gameWon: state.gameWon,
      world: serializeWorldState(surface),
      caves: surface.caves?.map((cave) => ({
        id: cave.id,
        tx: cave.tx,
        ty: cave.ty,
        spawnedByPlayer: !!cave.spawnedByPlayer,
        hostileBlocked: !!cave.hostileBlocked,
        world: serializeWorldState(cave.world),
      })) ?? [],
      structures: serializeStructuresList(),
      players: getPlayersSnapshot(),
    };
  }

  function serializeWorldMotion(world) {
    return {
      monsters: (world.monsters ?? []).map((monster) => ({
        id: monster.id,
        type: monster.type ?? "crawler",
        x: monster.x,
        y: monster.y,
        hp: monster.hp,
        maxHp: monster.maxHp,
        attackTimer: Math.max(0, Number(monster.attackTimer) || 0),
        dayBurning: !!monster.dayBurning,
        burnTimer: Math.max(0, Number(monster.burnTimer) || 0),
        burnDuration: Math.max(0, Number(monster.burnDuration) || 0),
        poisonDuration: Math.max(0, Number(monster.poisonDuration) || 0),
        poisonDps: Math.max(0, Number(monster.poisonDps) || 0),
      })),
      projectiles: (world.projectiles ?? []).map((projectile) => ({
        id: projectile.id,
        type: projectile.type || "arrow",
        monsterType: projectile.monsterType || "skeleton",
        x: projectile.x,
        y: projectile.y,
        vx: projectile.vx,
        vy: projectile.vy,
        life: projectile.life,
        maxLife: projectile.maxLife,
        damage: projectile.damage,
        radius: projectile.radius,
        poisonDuration: Math.max(0, Number(projectile.poisonDuration) || 0),
        poisonDps: Math.max(0, Number(projectile.poisonDps) || 0),
      })),
      animals: (world.animals ?? []).map((animal) => ({
        id: animal.id,
        type: animal.type,
        x: animal.x,
        y: animal.y,
        hp: animal.hp,
        maxHp: animal.maxHp,
        speed: animal.speed,
        color: animal.color,
      })),
      villagers: (world.villagers ?? []).map((villager) => ({
        id: villager.id,
        x: villager.x,
        y: villager.y,
        homeX: villager.homeX,
        homeY: villager.homeY,
        speed: villager.speed,
        color: villager.color,
        wanderRadius: villager.wanderRadius,
      })),
    };
  }

  function serializeRobotMotion() {
    if (!Array.isArray(state.structures)) return [];
    const robots = [];
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.type !== "robot") continue;
      const robot = ensureRobotMeta(structure);
      if (!robot) continue;
      robots.push({
        tx: structure.tx,
        ty: structure.ty,
        x: robot.x,
        y: robot.y,
        mode: robot.mode,
        state: robot.state,
        manualStop: !!robot.manualStop,
        recallActive: !!robot.recallActive,
        recallBenchTx: Number.isInteger(robot.recallBenchTx) ? robot.recallBenchTx : null,
        recallBenchTy: Number.isInteger(robot.recallBenchTy) ? robot.recallBenchTy : null,
      });
    }
    return robots;
  }

  function serializeShipMotion() {
    if (!Array.isArray(state.structures)) return [];
    const ships = [];
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.type !== "abandoned_ship") continue;
      const ship = ensureAbandonedShipMeta(structure);
      if (!ship) continue;
      ships.push({
        tx: structure.tx,
        ty: structure.ty,
        x: ship.x,
        y: ship.y,
        angle: ship.angle,
        vx: ship.vx,
        vy: ship.vy,
        repaired: !!ship.repaired,
        damage: ship.damage,
        driverId: ship.driverId,
        seats: Array.isArray(ship.seats) ? ship.seats.slice(0, ABANDONED_SHIP_CONFIG.maxPassengers) : [],
      });
    }
    return ships;
  }

  function buildMotionUpdate() {
    const surface = state.surfaceWorld || state.world;
    if (!surface) return null;
    return {
      type: "motion",
      seed: surface.seed,
      world: serializeWorldMotion(surface),
      caves: (surface.caves ?? [])
        .filter((cave) => cave?.world && getPlayersForWorld(cave.world).length > 0)
        .map((cave) => ({
          id: cave.id,
          world: serializeWorldMotion(cave.world),
        })),
      robots: serializeRobotMotion(),
      ships: serializeShipMotion(),
    };
  }

  function applyMotionWorld(world, motionWorld) {
    if (!world || !motionWorld || typeof motionWorld !== "object") return;
    if (Array.isArray(motionWorld.monsters)) {
      world.monsters = buildMonstersFromSnapshot(world.monsters, motionWorld.monsters, world);
    }
    if (Array.isArray(motionWorld.projectiles)) {
      world.projectiles = buildProjectilesFromSnapshot(world.projectiles, motionWorld.projectiles);
    }
    if (Array.isArray(motionWorld.animals)) {
      applyAnimals(world, motionWorld.animals);
    }
    if (Array.isArray(motionWorld.villagers)) {
      applyVillagers(world, motionWorld.villagers);
    }
  }

  function applyRobotMotion(robots) {
    if (!Array.isArray(robots)) return;
    for (const entry of robots) {
      if (!entry || !Number.isInteger(entry.tx) || !Number.isInteger(entry.ty)) continue;
      const structure = getStructureAt(entry.tx, entry.ty);
      if (!structure || structure.removed || structure.type !== "robot") continue;
      const robot = ensureRobotMeta(structure);
      if (!robot) continue;
      if (Number.isFinite(entry.x)) robot.x = entry.x;
      if (Number.isFinite(entry.y)) robot.y = entry.y;
      if (typeof entry.mode === "string" || entry.mode === null) {
        robot.mode = normalizeRobotMode(entry.mode);
      }
      if (typeof entry.state === "string") robot.state = entry.state;
      if (typeof entry.manualStop === "boolean") robot.manualStop = entry.manualStop;
      if (typeof entry.recallActive === "boolean") robot.recallActive = entry.recallActive;
      if (Number.isInteger(entry.recallBenchTx) && Number.isInteger(entry.recallBenchTy)) {
        robot.recallBenchTx = entry.recallBenchTx;
        robot.recallBenchTy = entry.recallBenchTy;
      } else if (!robot.recallActive) {
        robot.recallBenchTx = null;
        robot.recallBenchTy = null;
      }
    }
  }

  function findAbandonedShipStructureForMotion(entry) {
    if (!entry || !Array.isArray(state.structures)) return null;
    if (Number.isInteger(entry.tx) && Number.isInteger(entry.ty)) {
      const atTile = getStructureAt(entry.tx, entry.ty);
      if (atTile && !atTile.removed && atTile.type === "abandoned_ship") {
        return atTile;
      }
    }
    let best = null;
    let bestDist = Infinity;
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.type !== "abandoned_ship") continue;
      const ship = ensureAbandonedShipMeta(structure);
      if (!ship) continue;
      const dx = (Number(entry.x) || ship.x) - ship.x;
      const dy = (Number(entry.y) || ship.y) - ship.y;
      const dist = Math.hypot(dx, dy);
      if (dist < bestDist) {
        best = structure;
        bestDist = dist;
      }
    }
    return best;
  }

  function applyShipMotion(ships) {
    if (!Array.isArray(ships)) return;
    for (const entry of ships) {
      const structure = findAbandonedShipStructureForMotion(entry);
      if (!structure) continue;
      const ship = ensureAbandonedShipMeta(structure);
      if (!ship) continue;
      if (Number.isFinite(entry.x)) ship.x = entry.x;
      if (Number.isFinite(entry.y)) ship.y = entry.y;
      if (Number.isFinite(entry.angle)) ship.angle = normalizeAngleRadians(entry.angle);
      if (Number.isFinite(entry.vx)) ship.vx = entry.vx;
      if (Number.isFinite(entry.vy)) ship.vy = entry.vy;
      if (typeof entry.repaired === "boolean") ship.repaired = entry.repaired;
      if (Number.isFinite(entry.damage)) ship.damage = clamp(entry.damage, 0, 100);
      ship.driverId = typeof entry.driverId === "string" && entry.driverId.length > 0
        ? entry.driverId
        : null;
      if (Array.isArray(entry.seats)) {
        ship.seats = Array.from(
          { length: ABANDONED_SHIP_CONFIG.maxPassengers },
          (_, index) => {
            const value = entry.seats[index];
            return typeof value === "string" && value.length > 0 ? value : null;
          }
        );
      }
      if (ship.driverId && !ship.seats.includes(ship.driverId)) ship.driverId = null;
      const incomingTx = Number.isInteger(entry.tx) ? entry.tx : structure.tx;
      const incomingTy = Number.isInteger(entry.ty) ? entry.ty : structure.ty;
      if (incomingTx !== structure.tx || incomingTy !== structure.ty) {
        setStructureFootprintInGrid(structure, false);
        structure.tx = incomingTx;
        structure.ty = incomingTy;
        setStructureFootprintInGrid(structure, true);
      }
    }
  }

  function applyNetworkMotion(message) {
    if (!message || !message.seed) return;
    if (!state.surfaceWorld || state.surfaceWorld.seed !== message.seed) return;
    applyMotionWorld(state.surfaceWorld, message.world);
    if (Array.isArray(message.caves) && Array.isArray(state.surfaceWorld.caves)) {
      for (const caveMotion of message.caves) {
        if (!caveMotion || typeof caveMotion.id !== "number") continue;
        const cave = state.surfaceWorld.caves.find((entry) => entry.id === caveMotion.id);
        if (!cave?.world) continue;
        applyMotionWorld(cave.world, caveMotion.world);
      }
    }
    applyRobotMotion(message.robots);
    applyShipMotion(message.ships);
    syncShipOccupantPositions();
  }

  function applySnapshotStructures(structures) {
    const world = state.surfaceWorld;
    if (!world) return;
    const previousRobotRender = new Map();
    const previousShipRender = new Map();
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.type !== "robot") continue;
      const robot = ensureRobotMeta(structure);
      if (!robot) continue;
      previousRobotRender.set(`${structure.tx},${structure.ty}`, {
        x: Number.isFinite(robot.renderX) ? robot.renderX : robot.x,
        y: Number.isFinite(robot.renderY) ? robot.renderY : robot.y,
      });
    }
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.type !== "abandoned_ship") continue;
      const ship = ensureAbandonedShipMeta(structure);
      if (!ship) continue;
      previousShipRender.set(`${structure.tx},${structure.ty}`, {
        x: Number.isFinite(ship.renderX) ? ship.renderX : ship.x,
        y: Number.isFinite(ship.renderY) ? ship.renderY : ship.y,
        angle: Number.isFinite(ship.renderAngle) ? ship.renderAngle : ship.angle,
      });
    }
    const activeHousePos = state.activeHouse ? { tx: state.activeHouse.tx, ty: state.activeHouse.ty } : null;
    const activeChestPos = (state.activeChest && !state.activeChest.interior)
      ? { tx: state.activeChest.tx, ty: state.activeChest.ty }
      : null;
    const activeStationPos = (state.activeStation && !state.activeStation.interior)
      ? { tx: state.activeStation.tx, ty: state.activeStation.ty }
      : null;
    state.structures = [];
    state.structureGrid = new Array(world.size * world.size).fill(null);
    if (!Array.isArray(structures)) return;
    const bridgeSet = new Set(
      structures
        .filter((entry) => entry && (entry.type === "bridge" || entry.type === "dock"))
        .map((entry) => `${entry.tx},${entry.ty}`)
    );
    const anchoredBridgeSet = getAnchoredBridgeNetwork(world, bridgeSet);
    for (const entry of structures) {
      if (!entry) continue;
      const normalized = { ...entry, type: normalizeLegacyStructureType(entry.type) };
      if (!isStructureValidOnLoad(world, normalized, bridgeSet, anchoredBridgeSet)) continue;
      const storageSize = normalized.type === "robot"
        ? ROBOT_STORAGE_SIZE
        : ((normalized.type === "chest" || normalized.type === "shipwreck") ? CHEST_SIZE : null);
      clearResourcesForFootprint(world, normalized.type, normalized.tx, normalized.ty);
      const structure = addStructure(normalized.type, normalized.tx, normalized.ty, {
        storage: Array.isArray(entry.storage)
          ? sanitizeInventorySlots(
              entry.storage,
              Number.isInteger(storageSize) ? storageSize : entry.storage.length
            )
          : null,
        meta: entry.meta ? JSON.parse(JSON.stringify(entry.meta)) : null,
      });
      if (structure.type === "chest") structure.storage = sanitizeInventorySlots(structure.storage, CHEST_SIZE);
      if (structure.type === "shipwreck") structure.storage = sanitizeInventorySlots(structure.storage, SHIPWRECK_STORAGE_SIZE);
      if (structure.type === "robot") structure.storage = sanitizeInventorySlots(structure.storage, ROBOT_STORAGE_SIZE);
      if (structure.type === "robot") {
        const robot = ensureRobotMeta(structure);
        const previous = previousRobotRender.get(`${structure.tx},${structure.ty}`);
        if (robot && previous) {
          robot.renderX = previous.x;
          robot.renderY = previous.y;
        }
      }
      if (structure.type === "abandoned_ship") {
        const ship = ensureAbandonedShipMeta(structure);
        const previous = previousShipRender.get(`${structure.tx},${structure.ty}`);
        if (ship && previous) {
          ship.renderX = previous.x;
          ship.renderY = previous.y;
          ship.renderAngle = previous.angle;
        }
      }
    }

    if (activeChestPos) {
      const chest = getStructureAt(activeChestPos.tx, activeChestPos.ty);
      if (isSurfaceStorageStructure(chest)) {
        state.activeChest = chest;
      } else {
        closeChest();
      }
    }

    if (activeStationPos) {
      const station = getStructureAt(activeStationPos.tx, activeStationPos.ty);
      if (station && STRUCTURE_DEFS[station.type]?.station) {
        state.activeStation = station;
      } else {
        closeStationMenu();
      }
    }

    if (activeHousePos) {
      const house = getStructureAt(activeHousePos.tx, activeHousePos.ty);
      if (house && isHouseType(house.type)) {
        state.activeHouse = house;
      } else {
        state.activeHouse = null;
        state.housePlayer = null;
        state.player.inHut = false;
      }
    }

    if (state.activeShipRepair) {
      const repairTarget = getStructureAt(state.activeShipRepair.tx, state.activeShipRepair.ty);
      if (repairTarget && !repairTarget.removed && repairTarget.type === "abandoned_ship") {
        state.activeShipRepair = repairTarget;
      } else {
        closeShipRepairPanel();
      }
    }
    syncShipOccupantPositions();
  }

  function applyPlayersSnapshot(players) {
    if (!Array.isArray(players)) return;
    const previous = net.players;
    const next = new Map();
    for (const entry of players) {
      if (!entry || !entry.id) continue;
      if (entry.id === net.playerId) {
        if (typeof entry.hp === "number") state.player.hp = entry.hp;
        if (typeof entry.maxHp === "number") state.player.maxHp = entry.maxHp;
        if (typeof entry.toolTier === "number") state.player.toolTier = entry.toolTier;
        state.player.unlocks = normalizeUnlocks(entry.unlocks ?? state.player.unlocks);
        state.player.checkpoint = normalizeCheckpoint(entry.checkpoint) ?? state.player.checkpoint;
        updateHealthUI();
        updateToolDisplay();
        continue;
      }
      const prev = previous.get(entry.id);
      next.set(entry.id, {
        id: entry.id,
        name: entry.name ?? "Survivor",
        color: entry.color ?? "#ffffff",
        x: entry.x ?? 0,
        y: entry.y ?? 0,
        facing: entry.facing ?? { x: 1, y: 0 },
        hp: entry.hp ?? 100,
        maxHp: entry.maxHp ?? 100,
        toolTier: entry.toolTier ?? 1,
        checkpoint: normalizeCheckpoint(entry.checkpoint) ?? prev?.checkpoint ?? null,
        inHut: !!entry.inHut,
        houseKey: entry.houseKey ?? null,
        houseX: typeof entry.houseX === "number" ? entry.houseX : null,
        houseY: typeof entry.houseY === "number" ? entry.houseY : null,
        inCave: !!entry.inCave,
        caveId: entry.caveId ?? null,
        unlocks: normalizeUnlocks(entry.unlocks ?? prev?.unlocks),
        renderX: prev?.renderX ?? entry.x ?? 0,
        renderY: prev?.renderY ?? entry.y ?? 0,
      });
    }
    net.players = next;
  }

  function ensureSurfaceCaves(world, caveEntries) {
    if (!world || !Array.isArray(caveEntries)) return;
    for (const entry of caveEntries) {
      if (!entry || typeof entry.id !== "number") continue;
      const existingById = world.caves.find((cave) => cave.id === entry.id);
      if (existingById) {
        if (entry.spawnedByPlayer) existingById.spawnedByPlayer = true;
        if (typeof entry.hostileBlocked === "boolean") {
          existingById.hostileBlocked = entry.hostileBlocked;
        } else {
          existingById.hostileBlocked = shouldBlockCaveHostilesForSurfaceTile(world, existingById.tx, existingById.ty);
        }
        continue;
      }
      if (typeof entry.tx !== "number" || typeof entry.ty !== "number") continue;
      const tx = Math.floor(entry.tx);
      const ty = Math.floor(entry.ty);
      if (!inBounds(tx, ty, world.size)) continue;
      const idx = tileIndex(tx, ty, world.size);
      if (!world.tiles[idx]) continue;
      if (world.caves.some((cave) => cave.tx === tx && cave.ty === ty)) continue;
      addSurfaceCave(world, tx, ty, entry.id, {
        spawnedByPlayer: !!entry.spawnedByPlayer,
        hostileBlocked: typeof entry.hostileBlocked === "boolean"
          ? entry.hostileBlocked
          : shouldBlockCaveHostilesForSurfaceTile(world, tx, ty),
      });
    }
  }

  function applyNetworkSnapshot(snapshot) {
    if (!snapshot || !snapshot.seed) return;
    if (!state.surfaceWorld || state.surfaceWorld.seed !== snapshot.seed) {
      closeStationMenu();
      closeChest();
      closeShipRepairPanel();
      closeInventory();
      if (buildMenu) buildMenu.classList.add("hidden");
      selectedSlot = null;
      wasNearBench = false;
      const world = generateWorld(snapshot.seed);
      state.surfaceWorld = world;
      state.world = world;
      state.inCave = false;
      state.activeCave = null;
      state.activeHouse = null;
      state.housePlayer = null;
      state.returnPosition = null;
      state.ambientFish = [];
      state.ambientFishSpawnTimer = 0;
      state.structures = [];
      state.structureGrid = new Array(world.size * world.size).fill(null);
      state.spawnTile = findSpawnTile(world);
      if (!state.player) {
        state.player = {
          x: (state.spawnTile.x + 0.5) * CONFIG.tileSize,
          y: (state.spawnTile.y + 0.5) * CONFIG.tileSize,
          toolTier: 1,
          unlocks: normalizeUnlocks(null),
          checkpoint: {
            x: (state.spawnTile.x + 0.5) * CONFIG.tileSize,
            y: (state.spawnTile.y + 0.5) * CONFIG.tileSize,
          },
          facing: { x: 1, y: 0 },
          maxHp: 100,
          hp: 100,
          poisonTimer: 0,
          poisonDps: 0,
          inHut: false,
          invincible: 0,
          attackTimer: 0,
        };
        setPlayerCheckpoint(state.player, world, state.player.x, state.player.y, true);
      }
      if (!state.inventory) {
        state.inventory = createEmptyInventory(INVENTORY_SIZE);
      }
    }

    const world = state.surfaceWorld;
    if (Array.isArray(snapshot.islandLayout)) {
      applySurfaceIslandLayout(world, snapshot.islandLayout, { shiftSession: false });
      if (!state.spawnTile || !isSpawnableTile(world, state.spawnTile.x, state.spawnTile.y)) {
        state.spawnTile = findSpawnTile(world);
      }
    }
    ensurePlayerProgress(state.player);
    ensureSurfaceCaves(world, snapshot.caves);
    applyResourceStates(world, snapshot.world?.resourceStates ?? []);
    applyRespawnTasks(world, snapshot.world?.respawnTasks ?? []);
    normalizeSurfaceResources(world);
    applyDrops(world, snapshot.world?.drops ?? []);
    applyAnimals(world, snapshot.world?.animals ?? []);
    applyVillagers(world, snapshot.world?.villagers ?? []);
    world.monsters = buildMonstersFromSnapshot(world.monsters, snapshot.world?.monsters, world);
    world.projectiles = buildProjectilesFromSnapshot(world.projectiles, snapshot.world?.projectiles);

    if (Array.isArray(world.caves) && Array.isArray(snapshot.caves)) {
      for (const cave of world.caves) {
        const caveSnapshot = snapshot.caves.find((entry) => entry.id === cave.id);
        if (!caveSnapshot) continue;
        cave.hostileBlocked = typeof caveSnapshot.hostileBlocked === "boolean"
          ? caveSnapshot.hostileBlocked
          : shouldBlockCaveHostilesForSurfaceTile(world, cave.tx, cave.ty);
        applyResourceStates(cave.world, caveSnapshot.world?.resourceStates ?? []);
        applyRespawnTasks(cave.world, caveSnapshot.world?.respawnTasks ?? []);
        applyDrops(cave.world, caveSnapshot.world?.drops ?? []);
        applyAnimals(cave.world, caveSnapshot.world?.animals ?? []);
        applyVillagers(cave.world, caveSnapshot.world?.villagers ?? []);
        cave.world.monsters = buildMonstersFromSnapshot(cave.world.monsters, caveSnapshot.world?.monsters, cave.world);
        cave.world.projectiles = buildProjectilesFromSnapshot(cave.world.projectiles, caveSnapshot.world?.projectiles);
        if (isCaveHostilesBlocked(world, cave)) {
          cave.world.monsters = [];
          cave.world.projectiles = [];
        }
      }
    }

    applySnapshotStructures(snapshot.structures);
    const wasWon = state.gameWon;
    state.timeOfDay = typeof snapshot.timeOfDay === "number" ? snapshot.timeOfDay : state.timeOfDay;
    state.isNight = !!snapshot.isNight;
    state.gameWon = !!snapshot.gameWon;
    updateTimeUI();
    seedDisplay.textContent = `Seed: ${snapshot.seed}`;
    applyPlayersSnapshot(snapshot.players);
    if (state.inCave && state.activeCave) {
      state.world = state.activeCave.world;
    } else if (state.surfaceWorld) {
      state.world = state.surfaceWorld;
    }
    updateObjectiveUI();
    if (state.gameWon && !wasWon && !state.winSequencePlayed) {
      state.winPlayerPos = state.player ? { x: state.player.x, y: state.player.y } : state.winPlayerPos;
      startWinSequence();
    } else if (!state.gameWon && wasWon) {
      state.winSequencePlayed = false;
      state.winTimer = 0;
      state.winPlayerPos = null;
      if (endScreen) endScreen.classList.remove("animate");
      if (endScreen) endScreen.classList.remove("text-ready");
    }
    if (inventoryOpen || state.activeChest || state.activeStation || buildMenuOpen()) {
      updateAllSlotUI();
    }
  }

  function handleHello(conn, message) {
    if (!state.player) return;
    if (!net.connections.has(conn.peer)) {
      net.connections.set(conn.peer, conn);
    }
    const name = typeof message.name === "string" ? message.name.slice(0, 16) : "Survivor";
    const color = typeof message.color === "string" ? message.color : PLAYER_COLORS[0];
    const spawn = findSpawnForJoin();
    const player = {
      id: conn.peer,
      name,
      color,
      x: spawn.x,
      y: spawn.y,
      facing: { x: 1, y: 0 },
      hp: 100,
      maxHp: 100,
      toolTier: 1,
      unlocks: normalizeUnlocks(null),
      checkpoint: { x: spawn.x, y: spawn.y },
      inHut: false,
      houseKey: null,
      houseX: null,
      houseY: null,
      inCave: false,
      caveId: null,
    };
    net.players.set(conn.peer, player);
    const snapshot = buildSnapshot();
    conn.send({
      type: "welcome",
      playerId: conn.peer,
      playerState: player,
      snapshot,
    });
    broadcastNet({
      type: "playerUpdate",
      id: conn.peer,
      name: player.name,
      color: player.color,
      x: player.x,
      y: player.y,
      facing: player.facing,
      hp: player.hp,
      maxHp: player.maxHp,
      toolTier: player.toolTier,
      unlocks: normalizeUnlocks(player.unlocks),
      checkpoint: normalizeCheckpoint(player.checkpoint),
      inHut: player.inHut,
      houseKey: player.houseKey,
      houseX: player.houseX,
      houseY: player.houseY,
      inCave: player.inCave,
      caveId: player.caveId,
    }, conn.peer);
  }

  function handleWelcome(message) {
    if (message.snapshot) {
      applyNetworkSnapshot(message.snapshot);
    }
    net.ready = true;
    state.inCave = false;
    state.activeCave = null;
    state.activeHouse = null;
    state.housePlayer = null;
    state.world = state.surfaceWorld || state.world;
    if (state.player) state.player.inHut = false;
    if (message.playerState && state.player) {
      state.player.x = message.playerState.x ?? state.player.x;
      state.player.y = message.playerState.y ?? state.player.y;
      state.player.hp = message.playerState.hp ?? state.player.hp;
      state.player.maxHp = message.playerState.maxHp ?? state.player.maxHp;
      state.player.toolTier = message.playerState.toolTier ?? state.player.toolTier;
      state.player.unlocks = normalizeUnlocks(message.playerState.unlocks ?? state.player.unlocks);
      state.player.checkpoint = normalizeCheckpoint(message.playerState.checkpoint) ?? state.player.checkpoint;
      updateHealthUI();
      updateToolDisplay();
    }
    clearPoisonStatus(state.player);
    updateHealthUI();
    state.inventory = createEmptyInventory(INVENTORY_SIZE);
    updateAllSlotUI();
  }

  function handlePlayerUpdate(conn, message) {
    const player = net.players.get(conn.peer);
    if (!player) return;
    if (typeof message.name === "string") player.name = message.name;
    if (typeof message.color === "string") player.color = message.color;
    if (typeof message.x === "number") player.x = message.x;
    if (typeof message.y === "number") player.y = message.y;
    if (message.facing) player.facing = message.facing;
    if (typeof message.hp === "number") player.hp = message.hp;
    if (typeof message.maxHp === "number") player.maxHp = message.maxHp;
    if (typeof message.toolTier === "number") player.toolTier = message.toolTier;
    if (message.unlocks) player.unlocks = normalizeUnlocks(message.unlocks);
    player.checkpoint = normalizeCheckpoint(message.checkpoint) ?? player.checkpoint ?? null;
    player.inHut = !!message.inHut;
    player.houseKey = message.houseKey ?? null;
    player.houseX = typeof message.houseX === "number" ? message.houseX : null;
    player.houseY = typeof message.houseY === "number" ? message.houseY : null;
    player.inCave = !!message.inCave;
    player.caveId = message.caveId ?? null;
    if (!player.inCave && !player.inHut && state.surfaceWorld && !normalizeCheckpoint(player.checkpoint)) {
      setPlayerCheckpoint(player, state.surfaceWorld, player.x, player.y, true);
    }
    if (player.renderX == null) player.renderX = player.x;
    if (player.renderY == null) player.renderY = player.y;
    broadcastNet({
      type: "playerUpdate",
      id: conn.peer,
      name: player.name,
      color: player.color,
      x: player.x,
      y: player.y,
      facing: player.facing,
      hp: player.hp,
      maxHp: player.maxHp,
      toolTier: player.toolTier,
      unlocks: normalizeUnlocks(player.unlocks),
      checkpoint: normalizeCheckpoint(player.checkpoint),
      inHut: player.inHut,
      houseKey: player.houseKey,
      houseX: player.houseX,
      houseY: player.houseY,
      inCave: player.inCave,
      caveId: player.caveId,
    }, conn.peer);
  }

  function applyRemotePlayerUpdate(message) {
    if (!message.id || message.id === net.playerId) {
      if (typeof message.hp === "number") {
        state.player.hp = message.hp;
        updateHealthUI();
      }
      if (message.unlocks) {
        state.player.unlocks = normalizeUnlocks(message.unlocks);
        updateToolDisplay();
      }
      if (message.checkpoint) {
        state.player.checkpoint = normalizeCheckpoint(message.checkpoint) ?? state.player.checkpoint;
      }
      return;
    }
    const current = net.players.get(message.id) || {};
    net.players.set(message.id, {
      id: message.id,
      name: message.name ?? current.name ?? "Survivor",
      color: message.color ?? current.color ?? "#ffffff",
      x: typeof message.x === "number" ? message.x : current.x ?? 0,
      y: typeof message.y === "number" ? message.y : current.y ?? 0,
      facing: message.facing ?? current.facing ?? { x: 1, y: 0 },
      hp: typeof message.hp === "number" ? message.hp : current.hp ?? 100,
      maxHp: typeof message.maxHp === "number" ? message.maxHp : current.maxHp ?? 100,
      toolTier: typeof message.toolTier === "number" ? message.toolTier : current.toolTier ?? 1,
      unlocks: normalizeUnlocks(message.unlocks ?? current.unlocks),
      checkpoint: normalizeCheckpoint(message.checkpoint) ?? current.checkpoint ?? null,
      inHut: !!message.inHut,
      houseKey: message.houseKey ?? current.houseKey ?? null,
      houseX: typeof message.houseX === "number" ? message.houseX : current.houseX ?? null,
      houseY: typeof message.houseY === "number" ? message.houseY : current.houseY ?? null,
      inCave: !!message.inCave,
      caveId: message.caveId ?? null,
      renderX: current.renderX ?? (typeof message.x === "number" ? message.x : current.x ?? 0),
      renderY: current.renderY ?? (typeof message.y === "number" ? message.y : current.y ?? 0),
    });
  }

  function handlePlaceRequest(conn, message) {
    const sendFailure = () => {
      if (conn?.open) {
        conn.send({
          type: "placeResult",
          requestId: message?.requestId,
          ok: false,
        });
      }
    };
    if (!conn || !message || !message.itemId) {
      sendFailure();
      return;
    }
    const player = net.players.get(conn.peer);
    if (!player || player.inCave || player.inHut) {
      sendFailure();
      return;
    }
    const world = state.surfaceWorld || state.world;
    const { tx, ty } = message;
    if (!Number.isInteger(tx) || !Number.isInteger(ty)) {
      sendFailure();
      return;
    }
    const placeX = (tx + 0.5) * CONFIG.tileSize;
    const placeY = (ty + 0.5) * CONFIG.tileSize;
    if (!canRemotePlayerReachPoint(player, placeX, placeY, 16)) {
      sendFailure();
      return;
    }
    const result = canPlaceItemAt(world, false, message.itemId, tx, ty);
    if (result.ok) {
      if (result.clearResourceTiles?.length) {
        clearResourceTiles(world, result.clearResourceTiles);
      }
      const itemDef = ITEMS[message.itemId];
      if (!itemDef || itemDef.debugOnly) {
        sendFailure();
        return;
      }
      if (result.upgradeHouse && result.targetHouse) {
        upgradeHouseStructure(result.targetHouse, itemDef.placeType);
      } else {
        addStructure(itemDef.placeType, tx, ty, {
          storage: itemDef.placeType === "chest"
            ? createEmptyInventory(CHEST_SIZE)
            : itemDef.placeType === "robot"
              ? createEmptyInventory(ROBOT_STORAGE_SIZE)
              : null,
        });
      }
      if (itemDef.placeType === "beacon") {
        triggerGameWin();
      }
      markDirty();
    }
    if (conn?.open) {
      conn.send({
        type: "placeResult",
        requestId: message.requestId,
        ok: result.ok,
      });
    }
  }

  function handlePlaceResult(message) {
    if (!message.requestId) return;
    const pending = net.pendingPlaces.get(message.requestId);
    if (!pending) return;
    if (!message.ok) {
      const structure = getStructureAt(pending.tx, pending.ty);
      if (structure && structure.type === pending.type && structure.pending) {
        removeStructure(structure);
      }
      addItem(state.inventory, pending.itemId, 1);
      updateAllSlotUI();
      setPrompt("Placement failed", 1);
    }
    net.pendingPlaces.delete(message.requestId);
  }

  function handleHousePlaceRequest(conn, message) {
    const sendFailure = () => {
      if (conn?.open) {
        conn.send({
          type: "housePlaceResult",
          requestId: message?.requestId,
          ok: false,
        });
      }
    };
    if (!conn || !message) {
      sendFailure();
      return;
    }
    const player = net.players.get(conn.peer);
    if (!player) {
      sendFailure();
      return;
    }
    const house = getStructureAt(message.houseTx, message.houseTy);
    let ok = false;
    if (house && isHouseType(house.type)) {
      if (!canRemotePlayerAccessHouseInterior(player, house, Number(message.tx), Number(message.ty), 2.5)) {
        sendFailure();
        return;
      }
      const result = canPlaceInteriorItem(house, message.itemId, message.tx, message.ty);
      if (result.ok) {
        const itemDef = ITEMS[message.itemId];
        addInteriorStructure(house, itemDef.placeType, message.tx, message.ty);
        markDirty();
        ok = true;
      }
    } else {
      sendFailure();
      return;
    }
    if (conn?.open) {
      conn.send({
        type: "housePlaceResult",
        requestId: message.requestId,
        ok,
      });
    }
  }

  function handleHousePlaceResult(message) {
    if (!message.requestId) return;
    const pending = net.pendingHousePlaces.get(message.requestId);
    if (!pending) return;
    if (!message.ok) {
      addItem(state.inventory, pending.itemId, 1);
      setPrompt("Interior placement failed", 1);
      updateAllSlotUI();
    }
    net.pendingHousePlaces.delete(message.requestId);
  }

  function getRemoteActionWorldForPlayer(player, message) {
    if (!player || !state.surfaceWorld) return null;
    if (player.inHut) return null;
    const wantsCave = message?.world === "cave";
    if (wantsCave) {
      if (!player.inCave) return null;
      const caveId = Number(message?.caveId);
      if (!Number.isInteger(caveId) || caveId !== player.caveId) return null;
      return getCaveWorld(caveId);
    }
    if (player.inCave) return null;
    return state.surfaceWorld;
  }

  function canRemotePlayerReachPoint(player, x, y, rangeMultiplier = 1) {
    if (!player || !Number.isFinite(x) || !Number.isFinite(y)) return false;
    const maxRange = CONFIG.interactRange * Math.max(0.5, Number(rangeMultiplier) || 1);
    return Math.hypot((player.x ?? 0) - x, (player.y ?? 0) - y) <= maxRange;
  }

  function canRemotePlayerAccessSurfaceStructure(player, structure, rangeMultiplier = 1.9) {
    if (!player || !structure) return false;
    if (player.inCave || player.inHut) return false;
    const center = getStructureCenterWorld(structure);
    return canRemotePlayerReachPoint(player, center.x, center.y, rangeMultiplier);
  }

  function canRemotePlayerAccessHouseInterior(player, house, tx, ty, maxDistance = 2.3) {
    if (!player || !house || !isHouseType(house.type)) return false;
    if (!player.inHut) return false;
    if (player.houseKey !== getHouseKey(house)) return false;
    if (!Number.isFinite(player.houseX) || !Number.isFinite(player.houseY)) return false;
    return Math.hypot(player.houseX - tx, player.houseY - ty) <= maxDistance;
  }

  function handleHarvestRequest(conn, message) {
    if (!conn || !message) return;
    const player = net.players.get(conn.peer);
    if (!player) return;
    const world = getRemoteActionWorldForPlayer(player, message);
    if (!world) return;
    const resId = Number(message.resId);
    if (!Number.isInteger(resId)) return;
    const resource = world.resources?.[resId];
    if (!resource || resource.removed) return;
    if (!canRemotePlayerReachPoint(player, resource.x, resource.y, 1.35)) return;
    const sourcePlayer = {
      ...player,
      unlocks: normalizeUnlocks(message.unlocks ?? player.unlocks),
    };
    if (!canHarvestResource(resource, sourcePlayer).ok) return;
    const damage = clamp(getAppliedHarvestDamage(sourcePlayer, resource), 1, 4);
    const playAudio = shouldPlayWorldSfx(world, resource.x, resource.y);
    applyHarvestToResource(world, resource, damage, false, playAudio);
  }

  function handleAttackRequest(conn, message) {
    if (!conn || !message) return;
    const player = net.players.get(conn.peer);
    if (!player) return;
    const world = getRemoteActionWorldForPlayer(player, message);
    if (!world) return;
    const sourcePlayer = {
      ...player,
      unlocks: normalizeUnlocks(message.unlocks ?? player.unlocks),
    };
    const sourceX = Number.isFinite(sourcePlayer?.x) ? sourcePlayer.x : Number(message.x);
    const sourceY = Number.isFinite(sourcePlayer?.y) ? sourcePlayer.y : Number(message.y);
    if (!Number.isFinite(sourceX) || !Number.isFinite(sourceY)) return;
    const sourceFromMsgX = Number(message.x);
    const sourceFromMsgY = Number(message.y);
    if (Number.isFinite(sourceFromMsgX) && Number.isFinite(sourceFromMsgY)) {
      const spoofDist = Math.hypot(sourceFromMsgX - sourceX, sourceFromMsgY - sourceY);
      if (spoofDist > CONFIG.tileSize * 2.4) return;
    }
    const aimXRaw = Number.isFinite(message.aimX) ? message.aimX : (Number.isFinite(message.x) ? message.x : sourceX);
    const aimYRaw = Number.isFinite(message.aimY) ? message.aimY : (Number.isFinite(message.y) ? message.y : sourceY);
    const aimDist = Math.hypot(aimXRaw - sourceX, aimYRaw - sourceY);
    const aimX = aimDist > CONFIG.tileSize * 6 ? sourceX : aimXRaw;
    const aimY = aimDist > CONFIG.tileSize * 6 ? sourceY : aimYRaw;
    const maxReach = MONSTER.attackRange + 12;
    const targetKind = message.targetKind === "monster" || message.targetKind === "animal"
      ? message.targetKind
      : null;
    const targetIdValue = Number(message.targetId);
    const targetId = Number.isInteger(targetIdValue) ? targetIdValue : null;

    let target = null;
    if (targetKind === "monster" && targetId != null && Array.isArray(world.monsters)) {
      target = world.monsters.find((monster) => (
        monster && monster.hp > 0 && monster.id === targetId
      )) || null;
      if (target && Math.hypot(target.x - sourceX, target.y - sourceY) > maxReach) {
        target = null;
      }
    }
    if (!target) {
      target = findNearestMonsterAt(world, { x: aimX, y: aimY }, maxReach);
    }
    if (target && Math.hypot(target.x - sourceX, target.y - sourceY) > maxReach) {
      target = findNearestMonsterAt(world, { x: sourceX, y: sourceY }, maxReach);
    }
    if (target) {
      if (!canDamageMonsters(sourcePlayer)) return;
      const damage = clamp(getAppliedAttackDamage(sourcePlayer, target), 1, 12);
      target.hp -= damage;
      target.hitTimer = 0.2;
      if (shouldPlayWorldSfx(world, target.x, target.y)) {
        playSfx("hit");
      }
      if (target.hp <= 0) {
        target.hp = 0;
        target.dropLootOnDeath = true;
      }
      markDirty();
      return;
    }
    const surface = state.surfaceWorld || state.world;
    if (world !== surface) return;
    let animal = null;
    if (targetKind === "animal" && targetId != null && Array.isArray(world.animals)) {
      animal = world.animals.find((entry) => (
        entry && entry.hp > 0 && entry.id === targetId
      )) || null;
      if (animal && Math.hypot(animal.x - sourceX, animal.y - sourceY) > maxReach) {
        animal = null;
      }
    }
    if (!animal) {
      animal = findNearestAnimalAt(world, { x: aimX, y: aimY }, maxReach);
    }
    if (animal && Math.hypot(animal.x - sourceX, animal.y - sourceY) > maxReach) {
      animal = findNearestAnimalAt(world, { x: sourceX, y: sourceY }, maxReach);
    }
    if (!animal) return;
    const damage = clamp(getAppliedAttackDamage(sourcePlayer, animal), 1, 12);
    animal.hp -= damage;
    animal.hitTimer = 0.2;
    animal.fleeTimer = 2.4;
    if (shouldPlayWorldSfx(world, animal.x, animal.y)) {
      playSfx("hit");
    }
    playAnimalReactionSfx(world, animal, "hurt");
    if (animal.hp <= 0) {
      animal.hp = 0;
      playAnimalReactionSfx(world, animal, "death");
      const drop = getAnimalDrops(animal);
      for (const [itemId, qty] of Object.entries(drop)) {
        spawnDrop(itemId, qty, animal.x, animal.y, state.surfaceWorld || state.world);
      }
    }
    markDirty();
  }

  function handleChestUpdate(conn, message) {
    if (!conn || !message) return;
    if (typeof message.tx !== "number" || typeof message.ty !== "number") return;
    const structure = getStructureAt(message.tx, message.ty);
    if (!isSurfaceStorageStructure(structure)) return;
    const player = net.players.get(conn.peer);
    if (!player || !canRemotePlayerAccessSurfaceStructure(player, structure, structure.type === "robot" ? 2.1 : 1.95)) {
      return;
    }
    if (structure.type === "robot") {
      ensureRobotMeta(structure);
    }
    const storageSize = structure.type === "robot" ? ROBOT_STORAGE_SIZE : SHIPWRECK_STORAGE_SIZE;
    structure.storage = sanitizeInventorySlots(message.storage, storageSize);
    markDirty();
  }

  function canRemotePlayerControlRobot(player, structure) {
    if (!player || !structure || structure.type !== "robot") return false;
    if (player.inCave || player.inHut) return false;
    const robotPos = getStructureCenterWorld(structure);
    const dist = Math.hypot((player.x ?? 0) - robotPos.x, (player.y ?? 0) - robotPos.y);
    return dist <= CONFIG.interactRange * 1.9;
  }

  function canRemotePlayerUseBench(player, structure) {
    if (!player || !structure || structure.type !== "bench") return false;
    if (player.inCave || player.inHut) return false;
    const center = getStructureCenterWorld(structure);
    const dist = Math.hypot((player.x ?? 0) - center.x, (player.y ?? 0) - center.y);
    return dist <= CONFIG.interactRange * 1.9;
  }

  function handleRobotCommand(conn, message) {
    if (!conn || !message) return;
    if (typeof message.tx !== "number" || typeof message.ty !== "number") return;
    const structure = getStructureAt(message.tx, message.ty);
    if (!structure || structure.type !== "robot") return;
    const robot = ensureRobotMeta(structure);
    if (!robot) return;
    const player = net.players.get(conn.peer);
    if (!canRemotePlayerControlRobot(player, structure)) return;

    if (message.action === "setMode") {
      const nextMode = normalizeRobotMode(message.mode);
      if (!isRobotMode(nextMode)) return;
      robot.mode = nextMode;
      robot.manualStop = false;
      robot.recallActive = false;
      robot.recallBenchTx = null;
      robot.recallBenchTy = null;
      robot.targetResourceId = null;
      robot.retargetTimer = 0;
      robot.mineTimer = 0;
      robot.state = "idle";
      clearRobotNavigation(robot);
      setRobotInteractionPause(structure, ROBOT_CONFIG.interactionPause);
      markDirty();
      return;
    }

    if (message.action === "stop") {
      robot.manualStop = true;
      robot.recallActive = false;
      robot.recallBenchTx = null;
      robot.recallBenchTy = null;
      robot.targetResourceId = null;
      robot.retargetTimer = 0;
      robot.mineTimer = 0;
      robot.state = "returning";
      clearRobotNavigation(robot);
      setRobotInteractionPause(structure, ROBOT_CONFIG.interactionPause);
      markDirty();
      return;
    }

    if (message.action === "ping") {
      setRobotInteractionPause(structure, ROBOT_CONFIG.interactionPause);
    }
  }

  function handleShipRepairCommit(message) {
    if (!message) return;
    state.shipActionPending = false;
    const structure = getStructureAt(Math.floor(Number(message.tx)), Math.floor(Number(message.ty)));
    if (!message.ok) {
      setPrompt(message.reason || "Repair failed", 1);
      renderShipRepairPanel();
      return;
    }
    if (!structure || structure.type !== "abandoned_ship") {
      setPrompt("Repair synchronized", 0.9);
      renderShipRepairPanel();
      return;
    }
    const cost = (message.cost && typeof message.cost === "object")
      ? message.cost
      : ABANDONED_SHIP_CONFIG.repairCost;
    if (!hasCost(state.inventory, cost)) {
      setPrompt("Repair confirmed by host", 1.1);
    } else {
      applyCost(state.inventory, cost);
      updateAllSlotUI();
      markDirty();
      setPrompt("Abandoned ship repaired", 1.2);
    }
    closeShipRepairPanel();
  }

  function handleDebugBoatPlaceResult(message) {
    state.debugBoatPlacePending = false;
    if (!message?.ok) {
      setPrompt(message?.reason || "Boat placement failed", 1);
      return;
    }
    setPrompt("Repaired boat placed", 1);
  }

  function sendDebugBoatPlaceResult(conn, requestId, ok, reason = null) {
    if (!conn?.open) return;
    const payload = {
      type: "debugBoatPlaceResult",
      requestId,
      ok: !!ok,
    };
    if (!ok && reason) payload.reason = reason;
    conn.send(payload);
  }

  function handleDebugBoatPlace(conn, message) {
    if (!conn || !message) return;
    const requestId = typeof message.requestId === "string" ? message.requestId : null;
    if (!state.surfaceWorld) {
      sendDebugBoatPlaceResult(conn, requestId, false, "World not ready");
      return;
    }
    if (!state.debugUnlocked) {
      sendDebugBoatPlaceResult(conn, requestId, false, "Debug disabled");
      return;
    }
    const player = net.players.get(conn.peer);
    if (!player) {
      sendDebugBoatPlaceResult(conn, requestId, false, "Player unavailable");
      return;
    }
    if (player.inCave || player.inHut) {
      sendDebugBoatPlaceResult(conn, requestId, false, "Cannot place here");
      return;
    }
    const tx = Math.floor(Number(message.tx));
    const ty = Math.floor(Number(message.ty));
    if (!Number.isInteger(tx) || !Number.isInteger(ty)) {
      sendDebugBoatPlaceResult(conn, requestId, false, "Invalid target");
      return;
    }
    if (!inBounds(tx, ty, state.surfaceWorld.size)) {
      sendDebugBoatPlaceResult(conn, requestId, false, "Out of bounds");
      return;
    }
    const centerX = (tx + 0.5) * CONFIG.tileSize;
    const centerY = (ty + 0.5) * CONFIG.tileSize;
    if (!canRemotePlayerReachPoint(player, centerX, centerY, 16)) {
      sendDebugBoatPlaceResult(conn, requestId, false, "Move closer");
      return;
    }

    const placed = placeDebugRepairedBoatAt(state.surfaceWorld, tx, ty);
    if (!placed.ok) {
      sendDebugBoatPlaceResult(conn, requestId, false, placed.reason || "Must place on water.");
      return;
    }

    markDirty();
    sendDebugBoatPlaceResult(conn, requestId, true);
    broadcastNet(buildSnapshot());
    const motion = buildMotionUpdate();
    if (motion) broadcastNet(motion);
  }

  function handleShipAction(conn, message) {
    if (!conn || !message) return;
    const player = net.players.get(conn.peer);
    if (!player || player.inCave || player.inHut) return;
    if (!Number.isInteger(message.tx) || !Number.isInteger(message.ty)) return;
    const structure = getStructureAt(message.tx, message.ty);
    if (!structure || structure.type !== "abandoned_ship") return;
    const ship = ensureAbandonedShipMeta(structure);
    if (!ship) return;
    if (!canRemotePlayerAccessSurfaceStructure(player, structure, 2.35)) return;
    const action = typeof message.action === "string" ? message.action : "";

    if (action === "board") {
      removePlayerFromAllShips(conn.peer);
      const seatIndex = assignPlayerToShip(structure, conn.peer);
      if (seatIndex == null) return;
      syncShipOccupantPositions();
      markDirty();
      const motion = buildMotionUpdate();
      if (motion) broadcastNet(motion);
      return;
    }

    if (action === "leave") {
      if (!removePlayerFromAllShips(conn.peer)) return;
      syncShipOccupantPositions();
      markDirty();
      const motion = buildMotionUpdate();
      if (motion) broadcastNet(motion);
      return;
    }

    if (action === "repair") {
      if (ship.repaired) {
        if (conn.open) {
          conn.send({
            type: "shipRepairCommit",
            ok: false,
            tx: structure.tx,
            ty: structure.ty,
            reason: "Already repaired",
          });
        }
        return;
      }
      ship.repaired = true;
      ship.vx = 0;
      ship.vy = 0;
      markDirty();
      const motion = buildMotionUpdate();
      if (motion) broadcastNet(motion);
      if (conn.open) {
        conn.send({
          type: "shipRepairCommit",
          ok: true,
          tx: structure.tx,
          ty: structure.ty,
          cost: ABANDONED_SHIP_CONFIG.repairCost,
        });
      }
    }
  }

  function handleShipControl(conn, message) {
    if (!conn || !message) return;
    if (!Number.isInteger(message.tx) || !Number.isInteger(message.ty)) return;
    const structure = getStructureAt(message.tx, message.ty);
    if (!structure || structure.type !== "abandoned_ship") return;
    const ship = ensureAbandonedShipMeta(structure);
    if (!ship) return;
    if (ship.driverId !== conn.peer) return;
    ship.driverInputX = clamp(Number(message.inputX) || 0, -1, 1);
    ship.driverInputY = clamp(Number(message.inputY) || 0, -1, 1);
    ship.controlAge = 0;
  }

  function handleBenchRobotControl(conn, message) {
    if (!conn || !message) return;
    const action = typeof message.action === "string" ? message.action : "";
    if (action !== "call" && action !== "release") return;
    if (!Number.isInteger(message.tx) || !Number.isInteger(message.ty)) return;
    const player = net.players.get(conn.peer);
    if (!player) return;
    const bench = getStructureAt(message.tx, message.ty);
    if (!bench || bench.type !== "bench") return;
    if (!canRemotePlayerUseBench(player, bench)) return;

    if (action === "call") {
      applyCallAllRobotsToBench(bench);
      return;
    }
    if (action === "release") {
      releaseAllRecalledRobots();
    }
  }

  function handleHouseChestUpdate(conn, message) {
    if (!conn || !message) return;
    const player = net.players.get(conn.peer);
    if (!player) return;
    const house = getStructureAt(message.houseTx, message.houseTy);
    if (!house || !isHouseType(house.type)) return;
    if (!canRemotePlayerAccessHouseInterior(player, house, Number(message.tx), Number(message.ty), 2.25)) return;
    const chest = getInteriorStructureAt(house, message.tx, message.ty);
    if (!chest || chest.type !== "chest") return;
    chest.storage = sanitizeInventorySlots(message.storage, CHEST_SIZE);
    markDirty();
  }

  function handleHouseDestroyChest(conn, message) {
    if (!conn || !message) return;
    const player = net.players.get(conn.peer);
    if (!player) return;
    const house = getStructureAt(message.houseTx, message.houseTy);
    if (!house || !isHouseType(house.type)) return;
    if (!canRemotePlayerAccessHouseInterior(player, house, Number(message.tx), Number(message.ty), 2.25)) return;
    const chest = getInteriorStructureAt(house, message.tx, message.ty);
    if (!chest || chest.type !== "chest") return;
    removeInteriorStructure(house, chest);
    markDirty();
  }

  function handleDestroyChest(conn, message) {
    if (!conn || !message) return;
    if (typeof message.tx !== "number" || typeof message.ty !== "number") return;
    const structure = getStructureAt(message.tx, message.ty);
    if (!structure || structure.type !== "chest") return;
    const player = net.players.get(conn.peer);
    if (!player || !canRemotePlayerAccessSurfaceStructure(player, structure, 1.95)) return;
    destroyChest(structure);
  }

  function handleSleepRequest(conn) {
    if (!state.isNight) return;
    if (conn) {
      const player = net.players.get(conn.peer);
      if (!player) return;
      if (player.inCave) return;
      if (!player.inHut) {
        const nearBed = state.structures.some((structure) => {
          if (structure.removed || structure.type !== "bed") return false;
          const sx = (structure.tx + 0.5) * CONFIG.tileSize;
          const sy = (structure.ty + 0.5) * CONFIG.tileSize;
          return Math.hypot(sx - player.x, sy - player.y) < CONFIG.interactRange;
        });
        if (!nearBed) return;
      }
    }
    state.timeOfDay = 0;
    state.isNight = false;
    state.checkpointTimer = 0;
    state.animalVocalTimer = 2.4 + Math.random() * 1.8;
    state.surfaceSpawnTimer = MONSTER.spawnInterval;
    state.gameWon = false;
    if (state.surfaceWorld) {
      igniteSurfaceMonstersForDay(state.surfaceWorld);
    }
    updateTimeUI();

    if (conn) {
      const player = net.players.get(conn.peer);
      if (player) {
        player.inHut = !!player.inHut;
        if (conn.open) {
          conn.send({
            type: "damage",
            hp: player.hp,
            maxHp: player.maxHp,
          });
        }
      }
    }
    markDirty();
  }

  function handleDropPickup(conn, message) {
    if (!conn || !message) return;
    const player = net.players.get(conn.peer);
    if (!player) return;
    const world = getRemoteActionWorldForPlayer(player, message);
    if (!world || !Array.isArray(world.drops)) return;
    const reqX = Number.isFinite(message.x) ? message.x : (player.x ?? 0);
    const reqY = Number.isFinite(message.y) ? message.y : (player.y ?? 0);
    if (Math.hypot(reqX - (player.x ?? 0), reqY - (player.y ?? 0)) > CONFIG.tileSize * 2.6) return;
    const requestedId = Number.isInteger(message.dropId) ? message.dropId : null;
    const requestedQtyRaw = Math.floor(Number(message.qty));
    const requestedQty = Number.isFinite(requestedQtyRaw) && requestedQtyRaw > 0
      ? clamp(requestedQtyRaw, 1, MAX_STACK)
      : null;
    if (requestedId != null) {
      const byIdIndex = world.drops.findIndex((drop) => drop.id === requestedId);
      if (byIdIndex >= 0) {
        const target = world.drops[byIdIndex];
        if (!canRemotePlayerReachPoint(player, target.x, target.y, 1.35)) return;
        if (requestedQty == null || requestedQty >= target.qty) {
          world.drops.splice(byIdIndex, 1);
        } else {
          target.qty = Math.max(0, target.qty - requestedQty);
          if (target.qty <= 0) world.drops.splice(byIdIndex, 1);
        }
        markDirty();
        return;
      }
    }
    let bestIndex = -1;
    let bestDist = Infinity;
    for (let i = 0; i < world.drops.length; i += 1) {
      const drop = world.drops[i];
      if (drop.itemId !== message.itemId) continue;
      const dist = Math.hypot(drop.x - reqX, drop.y - reqY);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    }
    if (bestIndex >= 0 && bestDist <= CONFIG.tileSize * 2) {
      const target = world.drops[bestIndex];
      if (!canRemotePlayerReachPoint(player, target.x, target.y, 1.35)) return;
      if (requestedQty == null || requestedQty >= target.qty) {
        world.drops.splice(bestIndex, 1);
      } else {
        target.qty = Math.max(0, target.qty - requestedQty);
        if (target.qty <= 0) world.drops.splice(bestIndex, 1);
      }
      markDirty();
    }
  }

  function handleDropItemRequest(conn, message) {
    if (!conn || !message) return;
    const player = net.players.get(conn.peer);
    if (!player) return;
    const world = getRemoteActionWorldForPlayer(player, message);
    if (!world) return;
    const itemId = typeof message.itemId === "string" ? message.itemId : null;
    if (!itemId || !ITEMS[itemId]) return;
    const qty = clamp(Math.floor(Number(message.qty) || 0), 1, MAX_STACK);
    const x = Number.isFinite(message.x) ? message.x : null;
    const y = Number.isFinite(message.y) ? message.y : null;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const distFromPlayer = Math.hypot(x - (player.x ?? 0), y - (player.y ?? 0));
    if (distFromPlayer > CONFIG.tileSize * 6) return;
    spawnDrop(itemId, qty, x, y, world);
  }

  function shouldPlayWorldSfx(world, x, y, radius = CONFIG.tileSize * 15) {
    if (!state.player || !world) return false;
    const localWorld = state.inCave ? state.activeCave?.world : (state.surfaceWorld || state.world);
    if (localWorld !== world) return false;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return true;
    return Math.hypot(state.player.x - x, state.player.y - y) <= radius;
  }

  function handleDamageMessage(message) {
    if (typeof message.hp !== "number" || !state.player) return;
    const prevHp = Number(state.player.hp);
    state.player.hp = message.hp;
    if (typeof message.maxHp === "number") {
      state.player.maxHp = Math.max(1, Number(message.maxHp) || state.player.maxHp || 1);
    }
    if (Number(message.poisonDuration) > 0) {
      applyPoisonStatus(message.poisonDuration, Number(message.poisonDps) || POISON_STATUS.defaultDps);
    }
    const damageAmount = Math.max(
      0,
      Number(message.damageAmount)
      || (Number.isFinite(prevHp) ? (prevHp - state.player.hp) : 0)
      || 0
    );
    const monsterType = typeof message.monsterType === "string" ? message.monsterType : null;
    const attackKind = message.attackKind === "projectile"
      ? "projectile"
      : (message.attackKind === "melee" ? "melee" : null);
    if (monsterType) {
      const attackScalar = attackKind === "projectile" ? 0.9 : 1;
      playSfx("monsterAttackHit", {
        monsterType,
        inCave: !!state.inCave,
        intensity: (0.45 + Math.min(1, damageAmount / 14) * 0.55) * attackScalar,
      });
    }
    playSfx("damage", {
      intensity: 0.7 + Math.min(1, damageAmount / 16) * 0.6,
    });
    updateHealthUI();
    if (state.player.hp <= 0) {
      handlePlayerDeath();
    }
  }

  function handleRespawnMessage(message) {
    if (!state.player) return;
    removePlayerFromAllShips(getLocalShipPlayerId());
    if (typeof message.hp === "number") state.player.hp = message.hp;
    if (typeof message.maxHp === "number") state.player.maxHp = message.maxHp;
    if (typeof message.x === "number") state.player.x = message.x;
    if (typeof message.y === "number") state.player.y = message.y;
    state.player.checkpoint = normalizeCheckpoint(message.checkpoint) ?? state.player.checkpoint;
    state.player.inHut = false;
    state.player.invincible = 1;
    state.activeHouse = null;
    state.housePlayer = null;
    state.inCave = false;
    state.activeCave = null;
    state.world = state.surfaceWorld || state.world;
    state.player.attackTimer = 0;
    clearPoisonStatus(state.player);
    interactPressed = false;
    attackPressed = false;
    keyState.clear();
    resetTouchInput();
    closeStationMenu();
    closeChest();
    closeShipRepairPanel();
    closeInventory();
    syncShipOccupantPositions();
    updateHealthUI();
    state.respawnLock = false;
  }

  function findSpawnForJoin() {
    const world = state.surfaceWorld || state.world;
    const base = state.spawnTile || findSpawnTile(world);
    const maxRadius = 6;
    for (let r = 0; r <= maxRadius; r += 1) {
      for (let dy = -r; dy <= r; dy += 1) {
        for (let dx = -r; dx <= r; dx += 1) {
          const tx = base.x + dx;
          const ty = base.y + dy;
          if (!isSpawnableTile(world, tx, ty)) continue;
          const posX = (tx + 0.5) * CONFIG.tileSize;
          const posY = (ty + 0.5) * CONFIG.tileSize;
          let tooClose = false;
          for (const other of net.players.values()) {
            if (Math.hypot(other.x - posX, other.y - posY) < CONFIG.tileSize * 1.2) {
              tooClose = true;
              break;
            }
          }
          if (!tooClose) return { x: posX, y: posY };
        }
      }
    }
    return { x: (base.x + 0.5) * CONFIG.tileSize, y: (base.y + 0.5) * CONFIG.tileSize };
  }

  function getCaveWorld(caveId) {
    if (!state.surfaceWorld || !state.surfaceWorld.caves) return null;
    const cave = state.surfaceWorld.caves.find((entry) => entry.id === caveId);
    return cave ? cave.world : null;
  }

  function sendPlayerUpdate() {
    if (!net.enabled || !state.player) return;
    const payload = {
      type: "playerUpdate",
      id: net.playerId,
      name: net.localName,
      color: net.localColor,
      x: state.player.x,
      y: state.player.y,
      facing: state.player.facing,
      hp: state.player.hp,
      maxHp: state.player.maxHp,
      toolTier: state.player.toolTier,
      unlocks: normalizeUnlocks(state.player.unlocks),
      checkpoint: normalizeCheckpoint(state.player.checkpoint),
      inHut: state.player.inHut,
      houseKey: state.player.inHut ? getHouseKey(state.activeHouse) : null,
      houseX: state.player.inHut ? state.housePlayer?.x ?? null : null,
      houseY: state.player.inHut ? state.housePlayer?.y ?? null : null,
      inCave: state.inCave,
      caveId: state.activeCave?.id ?? null,
    };
    if (net.isHost) {
      broadcastNet(payload);
    } else {
      sendToHost(payload);
    }
  }

  function maintainRobotInteractionPause(dt) {
    const robotStructure = state.activeStation?.type === "robot"
      ? state.activeStation
      : (state.activeChest?.type === "robot" ? state.activeChest : null);
    if (!robotStructure || robotStructure.removed) {
      net.robotPausePingTimer = 0.2;
      return;
    }
    if (!netIsClientReady()) {
      // Keep the robot paused for the entire local interaction window (solo + host).
      setRobotInteractionPause(robotStructure, ROBOT_CONFIG.interactionPause);
      return;
    }
    net.robotPausePingTimer -= dt;
    if (net.robotPausePingTimer <= 0) {
      sendRobotCommand(robotStructure, "ping");
      net.robotPausePingTimer = 0.25;
    }
  }

  function netTick(dt) {
    if (!net.enabled) return;
    if (!netIsClientReady()) net.robotPausePingTimer = 0.2;
    net.playerTimer -= dt;
    if (net.playerTimer <= 0) {
      sendPlayerUpdate();
      net.playerTimer = NET_CONFIG.playerSendInterval;
    }
    if (net.isHost) {
      if (net.connections.size === 0) return;
      net.motionTimer -= dt;
      if (net.motionTimer <= 0) {
        const motion = buildMotionUpdate();
        if (motion) {
          broadcastNet(motion);
        }
        net.motionTimer = NET_CONFIG.motionInterval;
      }
      net.snapshotTimer -= dt;
      if (net.snapshotTimer <= 0) {
        broadcastNet(buildSnapshot());
        net.snapshotTimer = NET_CONFIG.snapshotInterval;
      }
    }
  }

  function smoothRemoteEntityRender(entity, dt, smoothFactor, snapDistance) {
    if (!entity || !Number.isFinite(entity.x) || !Number.isFinite(entity.y)) return;
    if (!Number.isFinite(entity.renderX) || !Number.isFinite(entity.renderY)) {
      entity.renderX = entity.x;
      entity.renderY = entity.y;
      return;
    }
    const drift = Math.hypot(entity.x - entity.renderX, entity.y - entity.renderY);
    if (drift > snapDistance) {
      entity.renderX = entity.x;
      entity.renderY = entity.y;
      return;
    }
    entity.renderX = smoothValue(entity.renderX, entity.x, dt, smoothFactor);
    entity.renderY = smoothValue(entity.renderY, entity.y, dt, smoothFactor);
  }

  function updateRemoteRender(dt) {
    for (const player of net.players.values()) {
      smoothRemoteEntityRender(player, dt, NET_CONFIG.renderSmooth, CONFIG.tileSize * 3.2);

      if (player.inHut && typeof player.houseX === "number" && typeof player.houseY === "number") {
        if (player.renderHouseX == null || player.renderHouseY == null) {
          player.renderHouseX = player.houseX;
          player.renderHouseY = player.houseY;
        } else {
          player.renderHouseX = smoothValue(player.renderHouseX, player.houseX, dt, NET_CONFIG.houseSmooth);
          player.renderHouseY = smoothValue(player.renderHouseY, player.houseY, dt, NET_CONFIG.houseSmooth);
        }
      } else {
        player.renderHouseX = null;
        player.renderHouseY = null;
      }
    }

    if (!net.isHost && state.world?.monsters) {
      for (const monster of state.world.monsters) {
        if (monster.dayBurning && (monster.burnTimer ?? 0) > 0) {
          monster.burnTimer = Math.max(0, monster.burnTimer - dt);
        }
        if (!Number.isFinite(monster.x) || !Number.isFinite(monster.y)) continue;
        monster.renderX = monster.x;
        monster.renderY = monster.y;
      }
    }

    if (!net.isHost && state.world?.animals) {
      for (const animal of state.world.animals) {
        if (!Number.isFinite(animal.x) || !Number.isFinite(animal.y)) continue;
        animal.renderX = animal.x;
        animal.renderY = animal.y;
      }
    }

    if (!net.isHost && state.world?.villagers) {
      for (const villager of state.world.villagers) {
        if (!Number.isFinite(villager.x) || !Number.isFinite(villager.y)) continue;
        villager.renderX = villager.x;
        villager.renderY = villager.y;
      }
    }

    if (!net.isHost && Array.isArray(state.structures)) {
      for (const structure of state.structures) {
        if (!structure || structure.removed || structure.type !== "robot") continue;
        const robot = ensureRobotMeta(structure);
        if (!robot) continue;
        if (robot.renderX == null || robot.renderY == null) {
          robot.renderX = robot.x;
          robot.renderY = robot.y;
        } else {
          const drift = Math.hypot(robot.x - robot.renderX, robot.y - robot.renderY);
          if (drift > CONFIG.tileSize * 8) {
            robot.renderX = robot.x;
            robot.renderY = robot.y;
          } else {
            robot.renderX = smoothValue(robot.renderX, robot.x, dt, NET_CONFIG.robotSmooth);
            robot.renderY = smoothValue(robot.renderY, robot.y, dt, NET_CONFIG.robotSmooth);
          }
        }
      }
      for (const structure of state.structures) {
        if (!structure || structure.removed || structure.type !== "abandoned_ship") continue;
        const ship = ensureAbandonedShipMeta(structure);
        if (!ship) continue;
        if (ship.renderX == null || ship.renderY == null) {
          ship.renderX = ship.x;
          ship.renderY = ship.y;
          ship.renderAngle = ship.angle;
          continue;
        }
        const drift = Math.hypot(ship.x - ship.renderX, ship.y - ship.renderY);
        if (drift > CONFIG.tileSize * 10) {
          ship.renderX = ship.x;
          ship.renderY = ship.y;
        } else {
          ship.renderX = smoothValue(ship.renderX, ship.x, dt, NET_CONFIG.robotSmooth);
          ship.renderY = smoothValue(ship.renderY, ship.y, dt, NET_CONFIG.robotSmooth);
        }
        const angleDelta = normalizeAngleRadians(ship.angle - (ship.renderAngle ?? ship.angle));
        ship.renderAngle = normalizeAngleRadians((ship.renderAngle ?? ship.angle) + angleDelta * clamp(dt * 10, 0, 1));
      }
    }

    if (!net.isHost && state.world?.projectiles) {
      for (const projectile of state.world.projectiles) {
        if (!Number.isFinite(projectile.x) || !Number.isFinite(projectile.y)) continue;
        projectile.renderX = projectile.x;
        projectile.renderY = projectile.y;
      }
    }
  }

  function seedToInt(seedStr) {
    let h = 2166136261;
    for (let i = 0; i < seedStr.length; i += 1) {
      h ^= seedStr.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function hash2d(x, y, seed) {
    let h = seed ^ (x * 374761393 + y * 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return (h ^ (h >>> 16)) >>> 0;
  }

  function rand2d(x, y, seed) {
    return hash2d(x, y, seed) / 4294967296;
  }

  function noise2d(x, y, seed) {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;

    const r00 = rand2d(xi, yi, seed);
    const r10 = rand2d(xi + 1, yi, seed);
    const r01 = rand2d(xi, yi + 1, seed);
    const r11 = rand2d(xi + 1, yi + 1, seed);

    const u = smoothstep(xf);
    const v = smoothstep(yf);

    const a = lerp(r00, r10, u);
    const b = lerp(r01, r11, u);
    return lerp(a, b, v);
  }

  function fbm(x, y, seed) {
    let value = 0;
    let amp = 0.5;
    let freq = 1;
    for (let i = 0; i < 4; i += 1) {
      value += noise2d(x * freq, y * freq, seed + i * 1013) * amp;
      freq *= 2;
      amp *= 0.5;
    }
    return value;
  }

  function makeRng(seed) {
    let value = seed >>> 0;
    return () => {
      value = (Math.imul(1664525, value) + 1013904223) >>> 0;
      return value / 4294967296;
    };
  }

  function normalizeUnlocks(raw) {
    const base = { ...PLAYER_UNLOCK_DEFAULTS };
    if (!raw || typeof raw !== "object") return base;
    for (const key of Object.keys(base)) {
      base[key] = !!raw[key];
    }
    // Legacy migration from older key layout.
    if (raw.relicPickaxe) {
      base.pickaxe = true;
      base.orePickaxe = true;
      base.relicPickaxe = true;
    } else if (raw.orePickaxe) {
      base.pickaxe = true;
      base.orePickaxe = true;
    } else if (raw.pickaxe) {
      base.pickaxe = true;
    }
    if (raw.sword) {
      base.sword = true;
    }
    return base;
  }

  function normalizeCheckpoint(raw) {
    if (!raw || typeof raw !== "object") return null;
    const x = Number(raw.x);
    const y = Number(raw.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    return { x, y };
  }

  function ensurePlayerProgress(player) {
    if (!player) return;
    player.unlocks = normalizeUnlocks(player.unlocks);
    player.checkpoint = normalizeCheckpoint(player.checkpoint);
    const legacyTier = Number(player.toolTier) || 1;
    if (legacyTier >= 2) {
      player.unlocks.pickaxe = true;
    }
    if (legacyTier >= 3) {
      player.unlocks.orePickaxe = true;
      player.unlocks.relicPickaxe = true;
      player.unlocks.sword = true;
    }
  }

  function ensurePlayerStatusEffects(player) {
    if (!player || typeof player !== "object") return;
    if (!Number.isFinite(player.poisonTimer)) player.poisonTimer = 0;
    if (!Number.isFinite(player.poisonDps)) player.poisonDps = 0;
  }

  function clearPoisonStatus(player = state.player) {
    if (!player || typeof player !== "object") return;
    player.poisonTimer = 0;
    player.poisonDps = 0;
  }

  function applyPoisonStatus(duration, dps = POISON_STATUS.defaultDps) {
    if (!state.player) return false;
    ensurePlayerStatusEffects(state.player);
    const clampedDuration = clamp(Number(duration) || 0, 0, POISON_STATUS.maxDuration);
    if (clampedDuration <= 0) return false;
    const clampedDps = clamp(
      Number(dps) || POISON_STATUS.defaultDps,
      POISON_STATUS.minDps,
      POISON_STATUS.maxDps
    );
    state.player.poisonTimer = Math.max(state.player.poisonTimer, clampedDuration);
    state.player.poisonDps = Math.max(state.player.poisonDps, clampedDps);
    updateHealthUI();
    return true;
  }

  function getPickaxeTier(player = state.player) {
    ensurePlayerProgress(player);
    if (player?.unlocks?.apexPickaxe) return 6;
    if (player?.unlocks?.primalPickaxe) return 5;
    if (player?.unlocks?.mythicPickaxe) return 4;
    if (player?.unlocks?.relicPickaxe) return 3;
    if (player?.unlocks?.orePickaxe) return 2;
    if (player?.unlocks?.pickaxe) return 1;
    return 0;
  }

  function getSwordTier(player = state.player) {
    ensurePlayerProgress(player);
    if (player?.unlocks?.sword5) return 5;
    if (player?.unlocks?.sword4) return 4;
    if (player?.unlocks?.sword3) return 3;
    if (player?.unlocks?.sword2) return 2;
    if (player?.unlocks?.sword) return 1;
    return 0;
  }

  function hasPlayerUnlock(player, key) {
    ensurePlayerProgress(player);
    return !!player?.unlocks?.[key];
  }

  function hasUpgradePrereqs(player, recipe) {
    if (!Array.isArray(recipe?.requires) || recipe.requires.length === 0) return true;
    return recipe.requires.every((key) => hasPlayerUnlock(player, key));
  }

  function getUpgradeTrackTier(player, track) {
    let tier = 0;
    for (const recipe of UPGRADE_RECIPES) {
      if (recipe.track !== track) continue;
      if (!recipe.unlock) continue;
      if (hasPlayerUnlock(player, recipe.unlock)) {
        tier = Math.max(tier, Number(recipe.tier) || 0);
      }
    }
    return tier;
  }

  function getVisibleUpgradeRecipes(player) {
    const visible = [];
    const tracks = new Set(
      UPGRADE_RECIPES
        .map((recipe) => recipe.track)
        .filter(Boolean)
    );

    for (const track of tracks) {
      const entries = UPGRADE_RECIPES
        .filter((recipe) => recipe.track === track)
        .sort((a, b) => (a.tier || 0) - (b.tier || 0));
      if (entries.length === 0) continue;
      const currentTier = getUpgradeTrackTier(player, track);
      const next = entries.find((recipe) => (recipe.tier || 0) > currentTier);
      visible.push(next || entries[entries.length - 1]);
    }

    for (const recipe of UPGRADE_RECIPES) {
      if (!recipe.track) visible.push(recipe);
    }

    return visible;
  }

  function tileIndex(x, y, size) {
    return y * size + x;
  }

  function inBounds(x, y, size) {
    return x >= 0 && y >= 0 && x < size && y < size;
  }

  function createResourceGrid(size) {
    return new Array(size * size).fill(-1);
  }

  function pickBiome(rng) {
    const roll = clamp(rng(), 0, 0.999999);
    let acc = 0;
    for (let i = 0; i < BIOME_PICK_WEIGHTS.length; i += 1) {
      acc += BIOME_PICK_WEIGHTS[i];
      if (roll < acc) return i;
    }
    return BIOME_PICK_WEIGHTS.length - 1;
  }

  function getSurfaceBiomeIdAtTile(world, tx, ty) {
    if (!world || !Array.isArray(world.biomeGrid)) return 0;
    if (!inBounds(tx, ty, world.size)) return 0;
    const biomeId = world.biomeGrid[tileIndex(tx, ty, world.size)];
    if (!Number.isInteger(biomeId) || biomeId < 0 || biomeId >= BIOMES.length) return 0;
    return biomeId;
  }

  function getSurfaceBiomeAtTile(world, tx, ty) {
    return BIOMES[getSurfaceBiomeIdAtTile(world, tx, ty)] || BIOMES[0];
  }

  function getSurfaceBiomeAtWorldPosition(world, x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return BIOMES[0];
    const tx = Math.floor(x / CONFIG.tileSize);
    const ty = Math.floor(y / CONFIG.tileSize);
    return getSurfaceBiomeAtTile(world, tx, ty);
  }

  function isMushroomBiomeId(biomeId) {
    const biome = BIOMES[biomeId];
    return biome?.key === BIOME_KEYS.mushroom;
  }

  function isMushroomBiomeAtTile(world, tx, ty) {
    const biomeId = getSurfaceBiomeIdAtTile(world, tx, ty);
    return isMushroomBiomeId(biomeId);
  }

  function getIslandBiomeId(world, island) {
    if (!world || !island) return 0;
    if (Number.isInteger(island.biomeId) && island.biomeId >= 0 && island.biomeId < BIOMES.length) {
      return island.biomeId;
    }
    return getSurfaceBiomeIdAtTile(world, Math.floor(island.x), Math.floor(island.y));
  }

  function getIslandForTile(world, tx, ty) {
    if (!world || !Array.isArray(world.islands) || !Number.isFinite(tx) || !Number.isFinite(ty)) return null;
    const px = tx + 0.5;
    const py = ty + 0.5;
    let best = null;
    let bestDelta = Infinity;
    for (const island of world.islands) {
      if (!island) continue;
      const delta = Math.hypot(px - island.x, py - island.y) - island.radius;
      if (delta <= 0 && delta < bestDelta) {
        best = island;
        bestDelta = delta;
      }
    }
    return best;
  }

  function isSpawnIsland(world, island) {
    if (!world || !island) return false;
    if (island.starter) return true;
    if (state.spawnTile && Number.isFinite(state.spawnTile.x) && Number.isFinite(state.spawnTile.y)) {
      const spawnIsland = getIslandForTile(world, state.spawnTile.x, state.spawnTile.y);
      if (spawnIsland === island) return true;
    }
    return false;
  }

  function isPlainsBiomeId(biomeId) {
    const biome = BIOMES[biomeId];
    return biome?.key === BIOME_KEYS.plains || !!biome?.plains;
  }

  function getGuardianTypeForBiomeId(biomeId, island = null) {
    if (isMushroomBiomeId(biomeId)) return null;
    const biome = BIOMES[biomeId];
    if (!biome) return null;
    if (biome.key === BIOME_KEYS.snow) return "polar_bear";
    if (biome.key === BIOME_KEYS.jungle) return "lion";
    if (isPlainsBiomeId(biomeId)) {
      if (island?.starter) return null;
      return "wolf";
    }
    return null;
  }

  function isGuardianMonsterType(type) {
    return type === "polar_bear" || type === "lion" || type === "wolf";
  }

  function isDayImmuneMonster(monster) {
    const variant = getMonsterVariant(monster?.type);
    return !!variant?.dayImmune;
  }

  function isIslandInOuterRing(world, island) {
    if (!world || !island) return false;
    const ringWidth = Math.max(6, world.size * ABANDONED_ROBOT_OUTER_RING_RATIO);
    const edgeDist = Math.min(island.x, island.y, world.size - island.x, world.size - island.y);
    return edgeDist <= ringWidth;
  }

  function getOutermostIslandsForWildRobot(world) {
    if (!world || !Array.isArray(world.islands)) return [];
    const candidates = world.islands.filter((island) => (
      island
      && !isSpawnIsland(world, island)
      && Number.isFinite(island.x)
      && Number.isFinite(island.y)
      && Number.isFinite(island.radius)
      && island.radius >= 4.5
    ));
    if (candidates.length === 0) return [];
    const centerX = world.size * 0.5;
    const centerY = world.size * 0.5;
    const ranked = candidates
      .map((island) => {
        const dist = Math.hypot(island.x - centerX, island.y - centerY);
        return { island, dist };
      })
      .sort((a, b) => b.dist - a.dist);
    const farthestCount = Math.max(1, Math.ceil(ranked.length * ABANDONED_ROBOT_FARTHEST_PERCENT));
    const farthestSet = new Set(ranked.slice(0, farthestCount).map((entry) => entry.island));
    const selected = ranked
      .filter((entry) => farthestSet.has(entry.island) || isIslandInOuterRing(world, entry.island))
      .sort((a, b) => (
        b.dist - a.dist
        || b.island.radius - a.island.radius
        || a.island.x - b.island.x
        || a.island.y - b.island.y
      ))
      .map((entry) => entry.island);
    if (selected.length > 0) return selected;
    return ranked.map((entry) => entry.island);
  }

  function getIslandIndexForTileInList(islands, tx, ty) {
    if (!Array.isArray(islands) || !Number.isFinite(tx) || !Number.isFinite(ty)) return -1;
    const px = tx + 0.5;
    const py = ty + 0.5;
    let bestIndex = -1;
    let bestDelta = Infinity;
    for (let i = 0; i < islands.length; i += 1) {
      const island = islands[i];
      if (!island) continue;
      const delta = Math.hypot(px - island.x, py - island.y) - island.radius;
      if (delta <= 0 && delta < bestDelta) {
        bestDelta = delta;
        bestIndex = i;
      }
    }
    return bestIndex;
  }

  function getIslandIndexForWorldPositionInList(islands, x, y) {
    if (!Number.isFinite(x) || !Number.isFinite(y)) return -1;
    const tx = Math.floor(x / CONFIG.tileSize);
    const ty = Math.floor(y / CONFIG.tileSize);
    return getIslandIndexForTileInList(islands, tx, ty);
  }

  function getIslandDeltaForTile(islandsBefore, deltas, tx, ty) {
    const islandIndex = getIslandIndexForTileInList(islandsBefore, tx, ty);
    if (islandIndex < 0 || !Array.isArray(deltas)) return null;
    const delta = deltas[islandIndex];
    if (!delta) return null;
    if ((delta.dx || 0) === 0 && (delta.dy || 0) === 0) return null;
    return delta;
  }

  function getIslandDeltaForWorldPosition(islandsBefore, deltas, x, y) {
    const islandIndex = getIslandIndexForWorldPositionInList(islandsBefore, x, y);
    if (islandIndex < 0 || !Array.isArray(deltas)) return null;
    const delta = deltas[islandIndex];
    if (!delta) return null;
    if ((delta.dx || 0) === 0 && (delta.dy || 0) === 0) return null;
    return delta;
  }

  function serializeIslandLayout(world) {
    if (!world || !Array.isArray(world.islands)) return [];
    return world.islands.map((island) => ({
      x: Number.isFinite(island?.x) ? island.x : 0,
      y: Number.isFinite(island?.y) ? island.y : 0,
    }));
  }

  function normalizeIslandLayoutForWorld(world, layout) {
    if (!world || !Array.isArray(world.islands) || !Array.isArray(layout)) return null;
    if (layout.length !== world.islands.length) return null;
    const normalized = [];
    for (let i = 0; i < layout.length; i += 1) {
      const entry = layout[i];
      if (!entry || !Number.isFinite(entry.x) || !Number.isFinite(entry.y)) return null;
      normalized.push({ x: entry.x, y: entry.y });
    }
    return normalized;
  }

  function clampIslandCenterToBounds(world, island, x, y) {
    if (!world || !island) {
      return { x: Number(x) || 0, y: Number(y) || 0 };
    }
    const edgePad = Math.max(6, Number(island.radius) || 0) + 14;
    const minCoord = edgePad;
    const maxCoord = Math.max(minCoord, world.size - edgePad);
    return {
      x: clamp(Number(x) || island.x, minCoord, maxCoord),
      y: clamp(Number(y) || island.y, minCoord, maxCoord),
    };
  }

  function clampIslandCenterForDebugDrag(world, islandIndex, x, y) {
    if (!world || !Array.isArray(world.islands)) return { x, y };
    const island = world.islands[islandIndex];
    if (!island) return { x, y };
    return clampIslandCenterToBounds(world, island, x, y);
  }

  function rebuildSurfaceTerrainFromIslands(world) {
    if (!world || !Array.isArray(world.islands)) return false;
    const size = world.size;
    const seed = Number.isFinite(world.seedInt) ? world.seedInt : seedToInt(String(world.seed || "island-1"));
    const tiles = new Array(size * size).fill(0);
    const shades = new Array(size * size).fill(1);
    const biomeGrid = new Array(size * size).fill(-1);
    const beachGrid = new Array(size * size).fill(false);

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        let base = 0;
        let bestIndex = -1;
        for (let i = 0; i < world.islands.length; i += 1) {
          const island = world.islands[i];
          if (!island) continue;
          const dx = x - island.x;
          const dy = y - island.y;
          const dist = Math.hypot(dx, dy);
          const falloff = clamp(1 - dist / island.radius, 0, 1);
          if (falloff > base) {
            base = falloff;
            bestIndex = i;
          }
        }

        const edgeNoise = fbm(x * 0.2, y * 0.2, seed + 200);
        const height = base + (edgeNoise - 0.5) * 0.3 * base;
        const idx = tileIndex(x, y, size);
        const isLand = height > 0.2;
        tiles[idx] = isLand ? 1 : 0;
        if (isLand && bestIndex !== -1) {
          biomeGrid[idx] = world.islands[bestIndex].biomeId;
          shades[idx] = 0.76 + fbm(x * 0.25, y * 0.25, seed + 500) * 0.35;
        } else {
          biomeGrid[idx] = -1;
          shades[idx] = 0.7 + fbm(x * 0.25, y * 0.25, seed + 500) * 0.2;
        }
      }
    }

    function countLandTilesByBiome() {
      const counts = new Array(BIOMES.length).fill(0);
      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const idx = tileIndex(x, y, size);
          if (!tiles[idx]) continue;
          const biomeId = biomeGrid[idx];
          if (!Number.isInteger(biomeId) || biomeId < 0 || biomeId >= BIOMES.length) continue;
          counts[biomeId] += 1;
        }
      }
      return counts;
    }

    function stampBiomeLandForIsland(island, biomeId) {
      if (!island) return 0;
      const cx = clamp(Math.floor(island.x), 1, size - 2);
      const cy = clamp(Math.floor(island.y), 1, size - 2);
      const radius = Math.max(2, Math.min(4, Math.floor(island.radius * 0.34)));
      let painted = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const tx = cx + dx;
          const ty = cy + dy;
          if (!inBounds(tx, ty, size)) continue;
          if (tx <= 0 || ty <= 0 || tx >= size - 1 || ty >= size - 1) continue;
          if (Math.hypot(dx, dy) > radius + 0.35) continue;
          const idx = tileIndex(tx, ty, size);
          tiles[idx] = 1;
          biomeGrid[idx] = biomeId;
          shades[idx] = 0.78 + fbm(tx * 0.25, ty * 0.25, seed + 500) * 0.3;
          painted += 1;
        }
      }
      return painted;
    }

    function ensureBiomeLandCoverage() {
      const minTilesPerBiome = 10;
      const counts = countLandTilesByBiome();
      for (let biomeId = 0; biomeId < BIOMES.length; biomeId += 1) {
        if (counts[biomeId] >= minTilesPerBiome) continue;
        const candidates = world.islands
          .filter((island) => island && island.biomeId === biomeId)
          .sort((a, b) => b.radius - a.radius);
        for (const island of candidates) {
          if (counts[biomeId] >= minTilesPerBiome) break;
          counts[biomeId] += stampBiomeLandForIsland(island, biomeId);
        }
      }
    }

    ensureBiomeLandCoverage();

    for (let y = 1; y < size - 1; y += 1) {
      for (let x = 1; x < size - 1; x += 1) {
        const idx = tileIndex(x, y, size);
        if (!tiles[idx]) continue;
        if (
          !tiles[tileIndex(x + 1, y, size)]
          || !tiles[tileIndex(x - 1, y, size)]
          || !tiles[tileIndex(x, y + 1, size)]
          || !tiles[tileIndex(x, y - 1, size)]
        ) {
          beachGrid[idx] = true;
        }
      }
    }

    world.tiles = tiles;
    world.shades = shades;
    world.biomeGrid = biomeGrid;
    world.beachGrid = beachGrid;
    return true;
  }

  function shiftSurfaceWorldByIslandDeltas(world, islandsBefore, deltas) {
    if (!world || !Array.isArray(islandsBefore) || !Array.isArray(deltas)) return;
    const tileSize = CONFIG.tileSize;

    const shiftTile = (tx, ty) => {
      const delta = getIslandDeltaForTile(islandsBefore, deltas, tx, ty);
      if (!delta) return null;
      return {
        tx: tx + delta.dx,
        ty: ty + delta.dy,
        delta,
      };
    };

    const shiftWorldPos = (x, y) => {
      const delta = getIslandDeltaForWorldPosition(islandsBefore, deltas, x, y);
      if (!delta) return null;
      return {
        x: x + delta.dx * tileSize,
        y: y + delta.dy * tileSize,
        delta,
      };
    };

    if (Array.isArray(world.resources)) {
      for (const resource of world.resources) {
        if (!resource) continue;
        const tx = Number.isFinite(resource.tx)
          ? Math.floor(resource.tx)
          : Math.floor((Number(resource.x) || 0) / tileSize);
        const ty = Number.isFinite(resource.ty)
          ? Math.floor(resource.ty)
          : Math.floor((Number(resource.y) || 0) / tileSize);
        const moved = shiftTile(tx, ty);
        if (!moved) continue;
        resource.tx = moved.tx;
        resource.ty = moved.ty;
        resource.x = (moved.tx + 0.5) * tileSize;
        resource.y = (moved.ty + 0.5) * tileSize;
      }
    }

    if (Array.isArray(world.respawnTasks)) {
      for (const task of world.respawnTasks) {
        if (!task || !Number.isFinite(task.tx) || !Number.isFinite(task.ty)) continue;
        const moved = shiftTile(Math.floor(task.tx), Math.floor(task.ty));
        if (!moved) continue;
        task.tx = moved.tx;
        task.ty = moved.ty;
      }
    }

    if (Array.isArray(world.drops)) {
      for (const drop of world.drops) {
        if (!drop || !Number.isFinite(drop.x) || !Number.isFinite(drop.y)) continue;
        const moved = shiftWorldPos(drop.x, drop.y);
        if (!moved) continue;
        drop.x = moved.x;
        drop.y = moved.y;
      }
    }

    if (Array.isArray(world.caves)) {
      for (const cave of world.caves) {
        if (!cave || !Number.isFinite(cave.tx) || !Number.isFinite(cave.ty)) continue;
        const moved = shiftTile(Math.floor(cave.tx), Math.floor(cave.ty));
        if (!moved) continue;
        cave.tx = moved.tx;
        cave.ty = moved.ty;
      }
    }

    if (Array.isArray(world.monsters)) {
      for (const monster of world.monsters) {
        if (!monster || !Number.isFinite(monster.x) || !Number.isFinite(monster.y)) continue;
        const moved = shiftWorldPos(monster.x, monster.y);
        if (!moved) continue;
        monster.x = moved.x;
        monster.y = moved.y;
        if (Number.isFinite(monster.renderX)) monster.renderX += moved.delta.dx * tileSize;
        if (Number.isFinite(monster.renderY)) monster.renderY += moved.delta.dy * tileSize;
      }
    }

    if (Array.isArray(world.projectiles)) {
      for (const projectile of world.projectiles) {
        if (!projectile || !Number.isFinite(projectile.x) || !Number.isFinite(projectile.y)) continue;
        const moved = shiftWorldPos(projectile.x, projectile.y);
        if (!moved) continue;
        projectile.x = moved.x;
        projectile.y = moved.y;
        if (Number.isFinite(projectile.renderX)) projectile.renderX += moved.delta.dx * tileSize;
        if (Number.isFinite(projectile.renderY)) projectile.renderY += moved.delta.dy * tileSize;
      }
    }

    if (Array.isArray(world.animals)) {
      for (const animal of world.animals) {
        if (!animal || !Number.isFinite(animal.x) || !Number.isFinite(animal.y)) continue;
        const moved = shiftWorldPos(animal.x, animal.y);
        if (!moved) continue;
        animal.x = moved.x;
        animal.y = moved.y;
        if (Number.isFinite(animal.renderX)) animal.renderX += moved.delta.dx * tileSize;
        if (Number.isFinite(animal.renderY)) animal.renderY += moved.delta.dy * tileSize;
      }
    }

    if (Array.isArray(world.villagers)) {
      for (const villager of world.villagers) {
        if (!villager) continue;
        if (Number.isFinite(villager.x) && Number.isFinite(villager.y)) {
          const moved = shiftWorldPos(villager.x, villager.y);
          if (moved) {
            villager.x = moved.x;
            villager.y = moved.y;
            if (Number.isFinite(villager.renderX)) villager.renderX += moved.delta.dx * tileSize;
            if (Number.isFinite(villager.renderY)) villager.renderY += moved.delta.dy * tileSize;
          }
        }
        if (Number.isFinite(villager.homeX) && Number.isFinite(villager.homeY)) {
          const movedHome = shiftWorldPos(villager.homeX, villager.homeY);
          if (movedHome) {
            villager.homeX = movedHome.x;
            villager.homeY = movedHome.y;
          }
        }
      }
    }
  }

  function shiftSurfaceSessionStateByIslandDeltas(world, islandsBefore, deltas) {
    if (!world || !Array.isArray(islandsBefore) || !Array.isArray(deltas)) return;
    const tileSize = CONFIG.tileSize;

    const shiftTile = (tx, ty) => {
      const delta = getIslandDeltaForTile(islandsBefore, deltas, tx, ty);
      if (!delta) return null;
      return {
        tx: tx + delta.dx,
        ty: ty + delta.dy,
        delta,
      };
    };

    const shiftWorldPos = (x, y) => {
      const delta = getIslandDeltaForWorldPosition(islandsBefore, deltas, x, y);
      if (!delta) return null;
      return {
        x: x + delta.dx * tileSize,
        y: y + delta.dy * tileSize,
        delta,
      };
    };

    if (Array.isArray(state.structures)) {
      for (const structure of state.structures) {
        if (!structure || structure.removed || structure.interior) continue;
        const footprint = getStructureFootprint(structure.type);
        const anchorTx = structure.tx + footprint.w * 0.5;
        const anchorTy = structure.ty + footprint.h * 0.5;
        const moved = shiftTile(anchorTx, anchorTy);
        if (!moved) continue;
        structure.tx = Math.floor(structure.tx + moved.delta.dx);
        structure.ty = Math.floor(structure.ty + moved.delta.dy);
        if (structure.type === "robot") {
          const robot = ensureRobotMeta(structure);
          if (!robot) continue;
          if (Number.isFinite(robot.homeTx)) robot.homeTx += moved.delta.dx;
          else robot.homeTx = structure.tx;
          if (Number.isFinite(robot.homeTy)) robot.homeTy += moved.delta.dy;
          else robot.homeTy = structure.ty;
          if (Number.isFinite(robot.x)) robot.x += moved.delta.dx * tileSize;
          if (Number.isFinite(robot.y)) robot.y += moved.delta.dy * tileSize;
          if (Number.isFinite(robot.renderX)) robot.renderX += moved.delta.dx * tileSize;
          if (Number.isFinite(robot.renderY)) robot.renderY += moved.delta.dy * tileSize;
          robot.targetResourceId = null;
          robot.retargetTimer = 0;
          clearRobotNavigation(robot);
        }
      }
    }

    if (state.player && !state.inCave && !state.player.inHut) {
      const moved = shiftWorldPos(state.player.x, state.player.y);
      if (moved) {
        state.player.x = moved.x;
        state.player.y = moved.y;
      }
    }

    const localCheckpoint = normalizeCheckpoint(state.player?.checkpoint);
    if (localCheckpoint) {
      const moved = shiftWorldPos(localCheckpoint.x, localCheckpoint.y);
      if (moved && state.player) {
        state.player.checkpoint = { x: moved.x, y: moved.y };
      }
    }

    if (state.spawnTile && Number.isFinite(state.spawnTile.x) && Number.isFinite(state.spawnTile.y)) {
      const moved = shiftTile(state.spawnTile.x, state.spawnTile.y);
      if (moved) {
        state.spawnTile.x = Math.floor(moved.tx);
        state.spawnTile.y = Math.floor(moved.ty);
      }
    }

    if (state.returnPosition && Number.isFinite(state.returnPosition.x) && Number.isFinite(state.returnPosition.y)) {
      const moved = shiftWorldPos(state.returnPosition.x, state.returnPosition.y);
      if (moved) {
        state.returnPosition.x = moved.x;
        state.returnPosition.y = moved.y;
      }
    }

    if (state.winPlayerPos && Number.isFinite(state.winPlayerPos.x) && Number.isFinite(state.winPlayerPos.y)) {
      const moved = shiftWorldPos(state.winPlayerPos.x, state.winPlayerPos.y);
      if (moved) {
        state.winPlayerPos.x = moved.x;
        state.winPlayerPos.y = moved.y;
      }
    }

    for (const remote of net.players.values()) {
      if (!remote) continue;
      if (!remote.inCave && !remote.inHut && Number.isFinite(remote.x) && Number.isFinite(remote.y)) {
        const moved = shiftWorldPos(remote.x, remote.y);
        if (moved) {
          remote.x = moved.x;
          remote.y = moved.y;
          if (Number.isFinite(remote.renderX)) remote.renderX += moved.delta.dx * tileSize;
          if (Number.isFinite(remote.renderY)) remote.renderY += moved.delta.dy * tileSize;
        }
      }
      const checkpoint = normalizeCheckpoint(remote.checkpoint);
      if (checkpoint) {
        const movedCheckpoint = shiftWorldPos(checkpoint.x, checkpoint.y);
        if (movedCheckpoint) {
          remote.checkpoint = { x: movedCheckpoint.x, y: movedCheckpoint.y };
        }
      }
    }
  }

  function rebuildSurfaceStructureGrid(world) {
    if (!world) return;
    state.structureGrid = new Array(world.size * world.size).fill(null);
    if (!Array.isArray(state.structures)) return;
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.interior) continue;
      const footprint = getStructureFootprint(structure.type);
      const maxTx = Math.max(0, world.size - footprint.w);
      const maxTy = Math.max(0, world.size - footprint.h);
      structure.tx = clamp(Math.floor(Number(structure.tx) || 0), 0, maxTx);
      structure.ty = clamp(Math.floor(Number(structure.ty) || 0), 0, maxTy);
      if (structure.type === "robot") {
        const robot = ensureRobotMeta(structure);
        if (robot) {
          if (!Number.isFinite(robot.homeTx)) robot.homeTx = structure.tx;
          if (!Number.isFinite(robot.homeTy)) robot.homeTy = structure.ty;
        }
      }
      setStructureFootprintInGrid(structure, true);
    }
  }

  function reindexSurfaceResourcesAfterIslandLayout(world) {
    if (!world) return;
    world.resourceGrid = createResourceGrid(world.size);
    if (!Array.isArray(world.resources)) return;
    for (const resource of world.resources) {
      if (!resource) continue;
      const baseTx = Number.isFinite(resource.tx)
        ? Math.floor(resource.tx)
        : Math.floor((Number(resource.x) || 0) / CONFIG.tileSize);
      const baseTy = Number.isFinite(resource.ty)
        ? Math.floor(resource.ty)
        : Math.floor((Number(resource.y) || 0) / CONFIG.tileSize);
      let tx = clamp(baseTx, 0, world.size - 1);
      let ty = clamp(baseTy, 0, world.size - 1);
      resource.tx = tx;
      resource.ty = ty;
      resource.x = (tx + 0.5) * CONFIG.tileSize;
      resource.y = (ty + 0.5) * CONFIG.tileSize;

      if (resource.removed) continue;
      let idx = tileIndex(tx, ty, world.size);
      let valid = world.tiles[idx] === 1
        && !world.beachGrid?.[idx]
        && world.resourceGrid[idx] === -1;
      if (!valid) {
        const nearby = findNearestEntityLandTile(world, tx, ty, 8);
        if (nearby) {
          const nearIdx = tileIndex(nearby.tx, nearby.ty, world.size);
          if (!world.beachGrid?.[nearIdx] && world.resourceGrid[nearIdx] === -1) {
            tx = nearby.tx;
            ty = nearby.ty;
            idx = nearIdx;
            valid = true;
          }
        }
      }
      if (!valid) {
        resource.removed = true;
        continue;
      }
      resource.tx = tx;
      resource.ty = ty;
      resource.x = (tx + 0.5) * CONFIG.tileSize;
      resource.y = (ty + 0.5) * CONFIG.tileSize;
      world.resourceGrid[idx] = resource.id;
    }
  }

  function normalizeSurfaceCavesAfterIslandLayout(world, checkStructures = true) {
    if (!world || !Array.isArray(world.caves)) return;
    const used = new Set();
    const maxRadius = Math.max(8, Math.floor(world.size * 0.12));

    const canUseTile = (tx, ty) => {
      if (!inBounds(tx, ty, world.size)) return false;
      const idx = tileIndex(tx, ty, world.size);
      if (!world.tiles[idx]) return false;
      if (world.beachGrid?.[idx]) return false;
      if (used.has(`${tx},${ty}`)) return false;
      if (checkStructures) {
        const structure = getStructureAt(tx, ty);
        if (structure && !structure.removed) return false;
      }
      return true;
    };

    for (const cave of world.caves) {
      if (!cave) continue;
      let tx = clamp(Math.floor(Number(cave.tx) || 0), 1, world.size - 2);
      let ty = clamp(Math.floor(Number(cave.ty) || 0), 1, world.size - 2);
      if (!canUseTile(tx, ty)) {
        let found = null;
        for (let radius = 1; radius <= maxRadius && !found; radius += 1) {
          for (let dy = -radius; dy <= radius && !found; dy += 1) {
            for (let dx = -radius; dx <= radius; dx += 1) {
              if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
              const nx = tx + dx;
              const ny = ty + dy;
              if (!canUseTile(nx, ny)) continue;
              found = { tx: nx, ty: ny };
              break;
            }
          }
        }
        if (found) {
          tx = found.tx;
          ty = found.ty;
        }
      }
      cave.tx = tx;
      cave.ty = ty;
      used.add(`${tx},${ty}`);
      cave.hostileBlocked = shouldBlockCaveHostilesForSurfaceTile(world, tx, ty);
      if (cave.hostileBlocked && cave.world) {
        cave.world.monsters = [];
        cave.world.projectiles = [];
      }
    }
  }

  function clampSurfaceEntitiesAfterIslandLayout(world) {
    if (!world) return;
    if (Array.isArray(world.animals)) {
      world.animals = world.animals.map((animal) => {
        if (!animal || !Number.isFinite(animal.x) || !Number.isFinite(animal.y)) return null;
        const clampedPos = clampEntityPositionToLand(world, animal.x, animal.y, 22);
        if (!clampedPos) return null;
        animal.x = clampedPos.x;
        animal.y = clampedPos.y;
        if (Number.isFinite(animal.renderX)) animal.renderX = clampedPos.x;
        if (Number.isFinite(animal.renderY)) animal.renderY = clampedPos.y;
        return animal;
      }).filter(Boolean);
      world.nextAnimalId = world.animals.reduce((max, animal) => Math.max(max, (animal.id || 0) + 1), 1);
    }

    if (Array.isArray(world.monsters)) {
      world.monsters = world.monsters.map((monster) => {
        if (!monster || !Number.isFinite(monster.x) || !Number.isFinite(monster.y)) return null;
        const clampedPos = clampEntityPositionToWalkable(world, monster.x, monster.y, 26);
        if (!clampedPos) return null;
        monster.x = clampedPos.x;
        monster.y = clampedPos.y;
        if (Number.isFinite(monster.renderX)) monster.renderX = clampedPos.x;
        if (Number.isFinite(monster.renderY)) monster.renderY = clampedPos.y;
        return monster;
      }).filter(Boolean);
      world.nextMonsterId = world.monsters.reduce((max, monster) => Math.max(max, (monster.id || 0) + 1), 1);
    }

    if (Array.isArray(world.villagers)) {
      world.villagers = world.villagers.map((villager) => {
        if (!villager || !Number.isFinite(villager.x) || !Number.isFinite(villager.y)) return null;
        const clampedPos = clampEntityPositionToLand(world, villager.x, villager.y, 24);
        if (!clampedPos) return null;
        villager.x = clampedPos.x;
        villager.y = clampedPos.y;
        if (Number.isFinite(villager.renderX)) villager.renderX = clampedPos.x;
        if (Number.isFinite(villager.renderY)) villager.renderY = clampedPos.y;
        if (Number.isFinite(villager.homeX) && Number.isFinite(villager.homeY)) {
          const homePos = clampEntityPositionToLand(world, villager.homeX, villager.homeY, 26);
          if (homePos) {
            villager.homeX = homePos.x;
            villager.homeY = homePos.y;
          }
        }
        return villager;
      }).filter(Boolean);
      world.nextVillagerId = world.villagers.reduce((max, villager) => Math.max(max, (villager.id || 0) + 1), 1);
    }

    if (Array.isArray(world.projectiles)) {
      world.projectiles = world.projectiles.filter((projectile) => {
        if (!projectile || !Number.isFinite(projectile.x) || !Number.isFinite(projectile.y)) return false;
        const tx = Math.floor(projectile.x / CONFIG.tileSize);
        const ty = Math.floor(projectile.y / CONFIG.tileSize);
        return inBounds(tx, ty, world.size);
      });
      world.nextProjectileId = world.projectiles.reduce((max, projectile) => Math.max(max, (projectile.id || 0) + 1), 1);
    }
  }

  function applySurfaceIslandLayout(world, layout, options = {}) {
    const shiftSession = !!options.shiftSession;
    if (!world || !Array.isArray(world.islands)) return false;
    const normalizedLayout = normalizeIslandLayoutForWorld(world, layout);
    if (!normalizedLayout) return false;

    const islandsBefore = world.islands.map((island) => ({
      x: island.x,
      y: island.y,
      radius: island.radius,
      biomeId: island.biomeId,
      starter: !!island.starter,
    }));

    const deltas = [];
    let changed = false;
    for (let i = 0; i < world.islands.length; i += 1) {
      const island = world.islands[i];
      if (!island) {
        deltas.push({ dx: 0, dy: 0 });
        continue;
      }
      const target = normalizedLayout[i];
      const clampedTarget = clampIslandCenterToBounds(world, island, target.x, target.y);
      const dx = Math.round(clampedTarget.x - island.x);
      const dy = Math.round(clampedTarget.y - island.y);
      if (dx !== 0 || dy !== 0) changed = true;
      deltas.push({ dx, dy });
    }
    if (!changed) return false;

    shiftSurfaceWorldByIslandDeltas(world, islandsBefore, deltas);
    if (shiftSession) {
      shiftSurfaceSessionStateByIslandDeltas(world, islandsBefore, deltas);
    }

    for (let i = 0; i < world.islands.length; i += 1) {
      const island = world.islands[i];
      if (!island) continue;
      island.x += deltas[i].dx;
      island.y += deltas[i].dy;
    }

    rebuildSurfaceTerrainFromIslands(world);

    if (shiftSession) {
      rebuildSurfaceStructureGrid(world);
    }
    normalizeSurfaceCavesAfterIslandLayout(world, shiftSession);
    reindexSurfaceResourcesAfterIslandLayout(world);

    if (shiftSession && Array.isArray(state.structures)) {
      for (const structure of state.structures) {
        if (!structure || structure.removed || structure.interior) continue;
        clearResourcesForFootprint(world, structure.type, structure.tx, structure.ty);
      }
    }
    for (const cave of world.caves || []) {
      if (!cave) continue;
      clearResourceForStructure(world, cave.tx, cave.ty);
    }
    normalizeSurfaceResources(world);
    clampSurfaceEntitiesAfterIslandLayout(world);

    if (shiftSession) {
      if (state.player && !state.inCave && !state.player.inHut) {
        const playerPos = clampEntityPositionToWalkable(world, state.player.x, state.player.y, 28);
        if (playerPos) {
          state.player.x = playerPos.x;
          state.player.y = playerPos.y;
        }
      }
      for (const remote of net.players.values()) {
        if (!remote || remote.inCave || remote.inHut) continue;
        if (!Number.isFinite(remote.x) || !Number.isFinite(remote.y)) continue;
        const remotePos = clampEntityPositionToWalkable(world, remote.x, remote.y, 28);
        if (!remotePos) continue;
        remote.x = remotePos.x;
        remote.y = remotePos.y;
        if (Number.isFinite(remote.renderX)) remote.renderX = remotePos.x;
        if (Number.isFinite(remote.renderY)) remote.renderY = remotePos.y;
      }
      if (!state.spawnTile || !isSpawnableTile(world, state.spawnTile.x, state.spawnTile.y)) {
        state.spawnTile = findSpawnTile(world);
      }
      if (state.player) {
        const checkpoint = normalizeCheckpoint(state.player.checkpoint);
        if (!checkpoint || !isSpawnableTile(world, Math.floor(checkpoint.x / CONFIG.tileSize), Math.floor(checkpoint.y / CONFIG.tileSize))) {
          const fallbackX = (!state.inCave && !state.player.inHut && Number.isFinite(state.player.x))
            ? state.player.x
            : ((state.spawnTile?.x ?? Math.floor(world.size / 2)) + 0.5) * CONFIG.tileSize;
          const fallbackY = (!state.inCave && !state.player.inHut && Number.isFinite(state.player.y))
            ? state.player.y
            : ((state.spawnTile?.y ?? Math.floor(world.size / 2)) + 0.5) * CONFIG.tileSize;
          setPlayerCheckpoint(state.player, world, fallbackX, fallbackY, true);
        }
      }
      if (state.returnPosition && Number.isFinite(state.returnPosition.x) && Number.isFinite(state.returnPosition.y)) {
        const returnPos = clampEntityPositionToWalkable(world, state.returnPosition.x, state.returnPosition.y, 28);
        if (returnPos) {
          state.returnPosition.x = returnPos.x;
          state.returnPosition.y = returnPos.y;
        }
      }
    }

    if (shiftSession && !netIsClient() && Array.isArray(world.animals)) {
      ensureSeedShipFeatures(world);
      ensureMushroomIslandGreenCows(world, 32);
      ensureSpawnIslandHarvestAnimals(world, state.spawnTile, 4, 32);
    }

    return true;
  }

  function moveSurfaceIslandForContinentalShift(world, islandIndex, targetX, targetY) {
    if (!world || !Array.isArray(world.islands)) return false;
    if (!Number.isInteger(islandIndex) || islandIndex < 0 || islandIndex >= world.islands.length) return false;
    const island = world.islands[islandIndex];
    if (!island) return false;
    const clampedTarget = clampIslandCenterForDebugDrag(world, islandIndex, targetX, targetY);
    const layout = serializeIslandLayout(world);
    layout[islandIndex] = {
      x: Math.round(clampedTarget.x),
      y: Math.round(clampedTarget.y),
    };
    return applySurfaceIslandLayout(world, layout, { shiftSession: true });
  }

  function getBiomeTreeMaxHp(biome) {
    const maxHp = Number(biome?.treeMaxHp);
    if (!Number.isFinite(maxHp)) return 4;
    return clamp(Math.round(maxHp), 4, 12);
  }

  function getBiomeTreeDropQty(biome) {
    const dropQty = Number(biome?.treeDropQty);
    if (!Number.isFinite(dropQty)) return 1;
    return clamp(Math.round(dropQty), 1, 6);
  }

  function getBiomeTreeVisualScale(biome) {
    const scale = Number(biome?.treeVisualScale);
    if (!Number.isFinite(scale)) return 1;
    return clamp(scale, 1, 1.65);
  }

  function getBiomeGrassDropQty(biome) {
    const explicit = Number(biome?.grassDropQty);
    if (Number.isFinite(explicit)) return clamp(Math.round(explicit), 1, 6);
    const grassRate = Number(biome?.grassRate) || 0;
    if (grassRate >= 0.05) return 2;
    return 1;
  }

  function getSurfaceMoveSpeedScale(world, x, y) {
    const biome = getSurfaceBiomeAtWorldPosition(world, x, y);
    let scale = Number.isFinite(biome.moveSpeedScale) ? biome.moveSpeedScale : 1;
    if (biome.key === "mangrove" && world && Array.isArray(world.beachGrid)) {
      const tx = Math.floor(x / CONFIG.tileSize);
      const ty = Math.floor(y / CONFIG.tileSize);
      if (inBounds(tx, ty, world.size) && world.beachGrid[tileIndex(tx, ty, world.size)]) {
        const coastScale = Number(biome.coastMoveSpeedScale);
        if (Number.isFinite(coastScale)) {
          scale = Math.min(scale, coastScale);
        }
      }
    }
    return clamp(scale, 0.4, 1.4);
  }

  function getSurfaceAnimalSpawnScale(world, tx, ty) {
    const biome = getSurfaceBiomeAtTile(world, tx, ty);
    const scale = Number(biome.animalSpawnScale);
    if (!Number.isFinite(scale)) return 1;
    return clamp(scale, 0, 1);
  }

  function getMonsterVariant(type) {
    return MONSTER_VARIANTS[type] || MONSTER_VARIANTS.crawler;
  }

  function pickMonsterType(rng = Math.random) {
    const roll = rng();
    if (roll < 0.5) return "crawler";
    if (roll < 0.78) return "brute";
    return "skeleton";
  }

  function pickMonsterTypeForBiome(biome, rng = Math.random, isNight = state.isNight) {
    if (!biome || typeof biome !== "object") return pickMonsterType(rng);
    if (isNight && biome.key === "marsh") {
      const poisonChance = clamp(Number(biome.poisonMonsterChance) || 0.62, 0.1, 1);
      if (rng() < poisonChance) return "marsh_stalker";
    }
    return pickMonsterType(rng);
  }

  function generateCaveWorld(seed, caveId, options = null) {
    const size = CAVE_SIZE;
    const caveSeed = seed + caveId * 7919;
    const rng = makeRng(caveSeed);
    const spawnHostiles = options?.spawnHostiles !== false;
    const tiles = new Array(size * size).fill(0);
    const shades = new Array(size * size).fill(1);
    const resources = [];
    const occupancy = new Array(size * size).fill(false);
    const resourceGrid = createResourceGrid(size);
    const landmarks = [];
    const entrance = {
      tx: clamp(Math.floor(size / 2 + (rng() - 0.5) * 8), 4, size - 5),
      ty: size - 3 - Math.floor(rng() * 2),
    };
    const styleRoll = rng();
    const caveStyle = styleRoll < 0.33
      ? {
          mainStepsScale: 12.5,
          turnChance: 0.54,
          sideBranchChance: 0.1,
          sideBranchMin: 3,
          sideBranchMax: 6,
          tunnelRadius: 0.82,
          chamberRadius: 1.28,
          chamberChance: 0.012,
          extraWalkers: 0,
          extraWalkerSteps: 0,
          erosionChance: 0.0,
        }
      : styleRoll < 0.66
        ? {
            mainStepsScale: 13.5,
            turnChance: 0.48,
            sideBranchChance: 0.12,
            sideBranchMin: 3,
            sideBranchMax: 7,
            tunnelRadius: 0.9,
            chamberRadius: 1.36,
            chamberChance: 0.018,
            extraWalkers: 0,
            extraWalkerSteps: 0,
            erosionChance: 0.0,
          }
        : {
            mainStepsScale: 11.8,
            turnChance: 0.58,
            sideBranchChance: 0.08,
            sideBranchMin: 2,
            sideBranchMax: 5,
            tunnelRadius: 0.78,
            chamberRadius: 1.22,
            chamberChance: 0.01,
            extraWalkers: 0,
            extraWalkerSteps: 0,
            erosionChance: 0.0,
          };

    function carveCircle(cx, cy, radius) {
      for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
        for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
          if (!inBounds(x, y, size)) continue;
          if (x <= 0 || y <= 0 || x >= size - 1 || y >= size - 1) continue;
          if (Math.hypot(x - cx, y - cy) <= radius + 0.2) {
            tiles[tileIndex(x, y, size)] = 1;
          }
        }
      }
    }

    carveCircle(entrance.tx, entrance.ty, 1.15 + rng() * 0.35);
    let walkerX = entrance.tx;
    let walkerY = entrance.ty - 1;
    let dir = rng() < 0.5 ? { x: 0, y: -1 } : (rng() < 0.5 ? { x: -1, y: 0 } : { x: 1, y: 0 });
    const chambers = [];
    const walkerTrail = [];
    const mainSteps = size * caveStyle.mainStepsScale;
    for (let step = 0; step < mainSteps; step += 1) {
      if (rng() < caveStyle.turnChance) {
        const turn = rng();
        if (turn < 0.24) dir = { x: 1, y: 0 };
        else if (turn < 0.48) dir = { x: -1, y: 0 };
        else if (turn < 0.8) dir = { x: 0, y: -1 };
        else dir = { x: 0, y: 1 };
      }
      walkerX = clamp(walkerX + dir.x, 2, size - 3);
      walkerY = clamp(walkerY + dir.y, 2, size - 3);
      walkerTrail.push({ x: walkerX, y: walkerY });
      const radius = rng() < caveStyle.chamberChance ? caveStyle.chamberRadius : caveStyle.tunnelRadius;
      carveCircle(walkerX, walkerY, radius);
      if (radius > 2 && chambers.length < 7) {
        chambers.push({ x: walkerX, y: walkerY });
      }
      if (rng() < caveStyle.sideBranchChance) {
        let bx = walkerX;
        let by = walkerY;
        const bDir = rng() < 0.25
          ? { x: 1, y: 0 }
          : rng() < 0.5
            ? { x: -1, y: 0 }
            : rng() < 0.75
              ? { x: 0, y: 1 }
              : { x: 0, y: -1 };
        const branchLen = caveStyle.sideBranchMin + Math.floor(rng() * caveStyle.sideBranchMax);
        for (let i = 0; i < branchLen; i += 1) {
          bx = clamp(bx + bDir.x, 2, size - 3);
          by = clamp(by + (rng() < 0.3 ? (rng() < 0.5 ? 1 : -1) : 0), 2, size - 3);
          carveCircle(bx, by, Math.max(0.85, caveStyle.tunnelRadius - 0.18));
        }
      }
    }

    for (let walker = 0; walker < caveStyle.extraWalkers; walker += 1) {
      const source =
        (chambers.length > 0 && rng() < 0.7)
          ? chambers[Math.floor(rng() * chambers.length)]
          : walkerTrail[Math.floor(rng() * Math.max(1, walkerTrail.length))] || { x: walkerX, y: walkerY };
      let bx = source.x;
      let by = source.y;
      let bDir = rng() < 0.25
        ? { x: 1, y: 0 }
        : rng() < 0.5
          ? { x: -1, y: 0 }
          : rng() < 0.75
            ? { x: 0, y: 1 }
            : { x: 0, y: -1 };
      const steps = caveStyle.extraWalkerSteps + Math.floor(rng() * Math.max(1, caveStyle.extraWalkerSteps));
      for (let i = 0; i < steps; i += 1) {
        if (rng() < 0.27) {
          bDir = rng() < 0.25
            ? { x: 1, y: 0 }
            : rng() < 0.5
              ? { x: -1, y: 0 }
              : rng() < 0.75
                ? { x: 0, y: 1 }
                : { x: 0, y: -1 };
        }
        bx = clamp(bx + bDir.x, 2, size - 3);
        by = clamp(by + bDir.y, 2, size - 3);
        const branchRadius = rng() < 0.06 ? caveStyle.chamberRadius * 0.78 : caveStyle.tunnelRadius * (0.9 + rng() * 0.24);
        carveCircle(bx, by, branchRadius);
        if (rng() < 0.04 && chambers.length < 10) {
          chambers.push({ x: bx, y: by });
        }
      }
    }

    for (let y = 2; y < size - 2; y += 1) {
      for (let x = 2; x < size - 2; x += 1) {
        const idx = tileIndex(x, y, size);
        if (tiles[idx]) continue;
        const neighbors =
          Number(tiles[tileIndex(x + 1, y, size)])
          + Number(tiles[tileIndex(x - 1, y, size)])
          + Number(tiles[tileIndex(x, y + 1, size)])
          + Number(tiles[tileIndex(x, y - 1, size)]);
        if (neighbors >= 3 && rng() < caveStyle.erosionChance) {
          tiles[idx] = 1;
        }
      }
    }

    // Trim oversized open areas so caves stay narrow/winding instead of boxy.
    for (let y = 2; y < size - 2; y += 1) {
      for (let x = 2; x < size - 2; x += 1) {
        const idx = tileIndex(x, y, size);
        if (!tiles[idx]) continue;
        if (Math.hypot(x - entrance.tx, y - entrance.ty) < 3) continue;
        let openNeighbors = 0;
        for (let oy = -1; oy <= 1; oy += 1) {
          for (let ox = -1; ox <= 1; ox += 1) {
            if (ox === 0 && oy === 0) continue;
            if (tiles[tileIndex(x + ox, y + oy, size)]) openNeighbors += 1;
          }
        }
        if (openNeighbors >= 7 && rng() < 0.48) {
          tiles[idx] = 0;
        }
      }
    }

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = tileIndex(x, y, size);
        shades[idx] = 0.45 + fbm(x * 0.18, y * 0.18, caveSeed + 300) * 0.22;
      }
    }

    function isClear(rx, ry, radius) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = rx + dx;
          const ny = ry + dy;
          if (!inBounds(nx, ny, size)) continue;
          if (occupancy[tileIndex(nx, ny, size)]) return false;
        }
      }
      return true;
    }

    function addResource(type, tx, ty, hp, extra = null) {
      const idx = tileIndex(tx, ty, size);
      occupancy[idx] = true;
      const res = {
        id: resources.length,
        type,
        x: (tx + 0.5) * CONFIG.tileSize,
        y: (ty + 0.5) * CONFIG.tileSize,
        tx,
        ty,
        hp,
        maxHp: hp,
        removed: false,
        hitTimer: 0,
        stage: "alive",
        respawnTimer: 0,
      };
      if (extra) Object.assign(res, extra);
      resources.push(res);
      resourceGrid[idx] = res.id;
    }

    for (let y = 1; y < size - 1; y += 1) {
      for (let x = 1; x < size - 1; x += 1) {
        const idx = tileIndex(x, y, size);
        if (!tiles[idx]) continue;
        if (!isClear(x, y, 1)) continue;
        const r = rand2d(x, y, caveSeed + 42);
        const depth = 1 - y / (size - 1);
        if (r < 0.02) {
          addResource("ore", x, y, 4, { oreKind: "coal" });
        } else if (r < 0.034) {
          addResource("ore", x, y, 5, { oreKind: "iron_ore" });
        } else if (r < 0.043 && depth > 0.2) {
          addResource("ore", x, y, 5, { oreKind: "gold_ore" });
        } else if (r < 0.049 && depth > 0.35) {
          addResource("ore", x, y, 6, { oreKind: "emerald" });
        } else if (r < 0.053 && depth > 0.5) {
          addResource("ore", x, y, 7, { oreKind: "diamond" });
        } else if (r < 0.065) {
          addResource("rock", x, y, 4);
        }
      }
    }

    function getCaveOreHp(oreKind) {
      if (oreKind === "coal") return 4;
      if (oreKind === "iron_ore") return 5;
      if (oreKind === "gold_ore") return 5;
      if (oreKind === "emerald") return 6;
      if (oreKind === "diamond") return 7;
      return 5;
    }

    function getCaveOreMinDepth(oreKind) {
      if (oreKind === "gold_ore") return 0.2;
      if (oreKind === "emerald") return 0.35;
      if (oreKind === "diamond") return 0.5;
      return 0;
    }

    function getCaveDepthAtY(ty) {
      return 1 - ty / (size - 1);
    }

    function hasCaveOreKind(oreKind) {
      return resources.some(
        (res) => res && !res.removed && res.type === "ore" && (res.oreKind || "iron_ore") === oreKind
      );
    }

    function canPlaceGuaranteedOreAt(tx, ty, oreKind, mode = "empty") {
      if (!inBounds(tx, ty, size)) return false;
      const idx = tileIndex(tx, ty, size);
      if (!tiles[idx]) return false;
      if (Math.hypot(tx - entrance.tx, ty - entrance.ty) < 4.5) return false;
      if (getCaveDepthAtY(ty) < getCaveOreMinDepth(oreKind)) return false;

      const existingId = resourceGrid[idx];
      if (existingId === -1 || existingId == null) return true;
      if (mode === "empty") return false;

      const existing = resources[existingId];
      if (!existing || existing.removed) return true;
      if (mode === "preferred") {
        return existing.type === "rock"
          || (existing.type === "ore" && existing.oreKind === "coal");
      }
      return true;
    }

    function spawnGuaranteedOreAt(tx, ty, oreKind) {
      const idx = tileIndex(tx, ty, size);
      const hp = getCaveOreHp(oreKind);
      const existingId = resourceGrid[idx];
      if (existingId !== -1 && existingId != null) {
        const existing = resources[existingId];
        if (existing && !existing.removed) {
          existing.type = "ore";
          existing.oreKind = oreKind;
          existing.maxHp = hp;
          existing.hp = hp;
          existing.stage = "alive";
          existing.respawnTimer = 0;
          existing.hitTimer = 0;
          existing.removed = false;
          resourceGrid[idx] = existing.id;
          return true;
        }
      }
      addResource("ore", tx, ty, hp, { oreKind });
      return true;
    }

    function ensureGuaranteedCaveOre(oreKind, salt) {
      if (hasCaveOreKind(oreKind)) return false;
      const scans = ["empty", "preferred"];
      const maxAttempts = (size - 2) * (size - 2) * 2;
      for (const mode of scans) {
        for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
          const x = 1 + Math.floor(rand2d(attempt + 13, salt + 71, caveSeed + 9103) * (size - 2));
          const y = 1 + Math.floor(rand2d(salt + 29, attempt + 41, caveSeed + 11779) * (size - 2));
          if (!canPlaceGuaranteedOreAt(x, y, oreKind, mode)) continue;
          return spawnGuaranteedOreAt(x, y, oreKind);
        }
      }
      return false;
    }

    const guaranteedOreKinds = ["iron_ore", "gold_ore", "emerald", "diamond"];
    for (let i = 0; i < guaranteedOreKinds.length; i += 1) {
      ensureGuaranteedCaveOre(guaranteedOreKinds[i], 131 + i * 97);
    }

    for (const chamber of chambers.slice(0, 4)) {
      landmarks.push({
        x: (chamber.x + 0.5) * CONFIG.tileSize,
        y: (chamber.y + 0.5) * CONFIG.tileSize,
        color: rng() < 0.5 ? "#86b9d7" : "#9ad0a1",
      });
    }

    const monsters = [];
    let nextMonsterId = 1;
    const monsterCount = spawnHostiles ? (2 + Math.floor(rng() * 3)) : 0;
    for (let i = 0; i < monsterCount; i += 1) {
      for (let attempt = 0; attempt < 50; attempt += 1) {
        const tx = 2 + Math.floor(rng() * (size - 4));
        const ty = 2 + Math.floor(rng() * (size - 4));
        const idx = tileIndex(tx, ty, size);
        if (!tiles[idx]) continue;
        if (Math.hypot(tx - entrance.tx, ty - entrance.ty) < 7) continue;
        if (resourceGrid[idx] !== -1) continue;
        const type = pickMonsterType(rng);
        const variant = getMonsterVariant(type);
        monsters.push({
          id: nextMonsterId++,
          type,
          color: variant.color,
          x: (tx + 0.5) * CONFIG.tileSize,
          y: (ty + 0.5) * CONFIG.tileSize,
          hp: variant.hp,
          maxHp: variant.hp,
          speed: variant.speed * 0.9,
          damage: variant.damage,
          attackRange: variant.attackRange,
          attackCooldown: variant.attackCooldown,
          aggroRange: variant.aggroRange,
          rangedRange: variant.rangedRange,
          attackTimer: 0,
          hitTimer: 0,
          wanderTimer: 0,
          dayBurning: false,
          burnTimer: 0,
          burnDuration: 0,
          dir: { x: 0, y: 0 },
        });
        break;
      }
    }

    return {
      id: caveId,
      seed: caveSeed,
      size,
      tiles,
      shades,
      resources,
      resourceGrid,
      drops: [],
      respawnTasks: [],
      entrance,
      caves: [],
      monsters,
      nextMonsterId,
      monsterBurnFx: [],
      projectiles: [],
      nextProjectileId: 1,
      villagers: [],
      nextVillagerId: 1,
      landmarks,
      ambience: "wind-echo",
    };
  }

  function generateWorld(seedStr) {
    const seed = seedToInt(seedStr);
    const size = CONFIG.worldSize;
    const tiles = new Array(size * size).fill(0);
    const shades = new Array(size * size).fill(1);
    const biomeGrid = new Array(size * size).fill(-1);
    const beachGrid = new Array(size * size).fill(false);
    const rng = makeRng(seed);
    const islands = [];
    const islandScale = Math.max(1, size / 160);
    const baseCount = Math.floor((20 + rng() * 12) * Math.pow(islandScale, 1.08));
    const requiredBiomes = BIOMES.map((_, index) => index).filter((id) => id !== 0);
    const islandCount = Math.max(baseCount, requiredBiomes.length + 1);

    function getIslandSpacingMetrics(x, y, radius, minGapScale = 0.82) {
      let minGap = Infinity;
      let nearestDistance = Infinity;
      for (const island of islands) {
        const dist = Math.hypot(island.x - x, island.y - y);
        const desiredGap = (radius + island.radius) * minGapScale;
        minGap = Math.min(minGap, dist - desiredGap);
        nearestDistance = Math.min(nearestDistance, dist);
      }
      return {
        minGap,
        nearestDistance,
      };
    }

    function placeIsland(radius, minGapScale = 0.82) {
      const edgePad = 14;
      const minCoord = radius + edgePad;
      const maxCoord = size - radius - edgePad;
      if (maxCoord <= minCoord) return null;
      let best = null;
      let bestScore = -Infinity;
      const attempts = 96;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        const x = minCoord + rng() * (maxCoord - minCoord);
        const y = minCoord + rng() * (maxCoord - minCoord);
        const metrics = getIslandSpacingMetrics(x, y, radius, minGapScale);
        if (metrics.minGap < -0.8) continue;
        const spreadPenalty = Math.max(0, metrics.nearestDistance - (radius * 5.4)) * 0.05;
        const score = metrics.minGap
          + Math.min(metrics.nearestDistance, radius * 4.8) * 0.038
          - spreadPenalty
          + (rng() - 0.5) * 0.55;
        if (score > bestScore) {
          bestScore = score;
          best = { x, y };
        }
      }
      if (best) return best;
      for (let attempt = 0; attempt < 48; attempt += 1) {
        const x = minCoord + rng() * (maxCoord - minCoord);
        const y = minCoord + rng() * (maxCoord - minCoord);
        const metrics = getIslandSpacingMetrics(x, y, radius, minGapScale * 0.95);
        if (metrics.minGap >= -0.25) {
          return { x, y };
        }
      }
      return null;
    }

    const starterRadius = 18 + rng() * 6;
    const starterPos = {
      x: size * 0.5 + (rng() - 0.5) * size * 0.1,
      y: size * 0.5 + (rng() - 0.5) * size * 0.1,
    };
    islands.push({
      x: starterPos.x,
      y: starterPos.y,
      radius: starterRadius,
      biomeId: 0,
      starter: true,
    });

    for (const biomeId of requiredBiomes) {
      const baseRadius = 8 + rng() * 10;
      let placed = false;
      for (let shrink = 0; shrink < 4; shrink += 1) {
        const radius = Math.max(6, baseRadius - shrink * 1.3);
        const pos = placeIsland(radius);
        if (!pos) continue;
        islands.push({
          x: pos.x,
          y: pos.y,
          radius,
          biomeId,
          starter: false,
        });
        placed = true;
        break;
      }
      if (!placed) continue;
    }

    for (const biomeId of requiredBiomes) {
      if (islands.some((island) => island.biomeId === biomeId)) continue;
      const radius = 6 + rng() * 3;
      const edgePad = 12;
      for (let attempt = 0; attempt < 28; attempt += 1) {
        const angle = (attempt / 28) * Math.PI * 2 + biomeId * 0.83;
        const ring = size * (0.2 + attempt * 0.008);
        const x = clamp(starterPos.x + Math.cos(angle) * ring, radius + edgePad, size - radius - edgePad);
        const y = clamp(starterPos.y + Math.sin(angle) * ring, radius + edgePad, size - radius - edgePad);
        const metrics = getIslandSpacingMetrics(x, y, radius, 0.75);
        if (metrics.minGap < -1.2) continue;
        islands.push({
          x,
          y,
          radius,
          biomeId,
          starter: false,
        });
        break;
      }
    }

    for (let i = islands.length; i < islandCount; i += 1) {
      const radius = 6 + rng() * 11;
      const pos = placeIsland(radius);
      if (!pos) continue;
      islands.push({
        x: pos.x,
        y: pos.y,
        radius,
        biomeId: pickBiome(rng),
        starter: false,
      });
    }

    function getBiomeIslandCounts() {
      const counts = new Array(BIOMES.length).fill(0);
      for (const island of islands) {
        const biomeId = Number.isInteger(island?.biomeId)
          && island.biomeId >= 0
          && island.biomeId < BIOMES.length
          ? island.biomeId
          : 0;
        island.biomeId = biomeId;
        counts[biomeId] += 1;
      }
      return counts;
    }

    function pickIslandForBiomeReassignment(biomeCounts, lockedIslands) {
      let best = null;
      let bestScore = -Infinity;
      for (const island of islands) {
        if (!island || island.starter || lockedIslands.has(island)) continue;
        const currentBiomeId = Number.isInteger(island.biomeId) ? island.biomeId : 0;
        if (biomeCounts[currentBiomeId] <= 1) continue;
        const score = island.radius + (currentBiomeId === 0 ? 1.25 : 0);
        if (score > bestScore) {
          best = island;
          bestScore = score;
        }
      }
      if (best) return best;
      for (const island of islands) {
        if (!island || island.starter || lockedIslands.has(island)) continue;
        return island;
      }
      return null;
    }

    function ensureBiomeIslandCoverage() {
      const lockedIslands = new Set(islands.filter((island) => island?.starter));
      let biomeCounts = getBiomeIslandCounts();
      for (let biomeId = 1; biomeId < BIOMES.length; biomeId += 1) {
        if (biomeCounts[biomeId] > 0) continue;
        const radius = 6.4 + rng() * 3.4;
        const pos = placeIsland(radius, 0.72);
        if (pos) {
          const island = {
            x: pos.x,
            y: pos.y,
            radius,
            biomeId,
            starter: false,
          };
          islands.push(island);
          lockedIslands.add(island);
          biomeCounts = getBiomeIslandCounts();
          continue;
        }
        const donor = pickIslandForBiomeReassignment(biomeCounts, lockedIslands);
        if (!donor) {
          const forcedRadius = 5.8 + rng() * 1.2;
          const edgePad = forcedRadius + 12;
          const angle = biomeId * 2.3999632297 + rng() * 0.35;
          const ring = Math.max(size * 0.23, forcedRadius + 18);
          const forcedIsland = {
            x: clamp(starterPos.x + Math.cos(angle) * ring, edgePad, size - edgePad),
            y: clamp(starterPos.y + Math.sin(angle) * ring, edgePad, size - edgePad),
            radius: forcedRadius,
            biomeId,
            starter: false,
          };
          islands.push(forcedIsland);
          lockedIslands.add(forcedIsland);
          biomeCounts = getBiomeIslandCounts();
          continue;
        }
        const donorBiomeId = Number.isInteger(donor.biomeId) ? donor.biomeId : 0;
        biomeCounts[donorBiomeId] = Math.max(0, biomeCounts[donorBiomeId] - 1);
        donor.biomeId = biomeId;
        biomeCounts[biomeId] += 1;
        lockedIslands.add(donor);
      }
      getBiomeIslandCounts();
    }

    function relaxIslandLayout(iterations = 6) {
      if (islands.length <= 2) return;
      const centerX = size * 0.5;
      const centerY = size * 0.5;
      const maxBridgeGap = Math.max(6, Number(MAX_ISLAND_BRIDGE_GAP_TILES) || 15);
      for (let iter = 0; iter < iterations; iter += 1) {
        for (let i = 1; i < islands.length; i += 1) {
          const island = islands[i];
          let pushX = 0;
          let pushY = 0;
          let nearestDx = 0;
          let nearestDy = 0;
          let nearestDist = Infinity;
          let nearestEdgeGap = Infinity;
          for (let j = 0; j < islands.length; j += 1) {
            if (i === j) continue;
            const other = islands[j];
            const dx = island.x - other.x;
            const dy = island.y - other.y;
            const dist = Math.hypot(dx, dy) || 0.0001;
            const desired = (island.radius + other.radius) * 0.9 + 8;
            const edgeGap = dist - (island.radius + other.radius);
            if (edgeGap < nearestEdgeGap) {
              nearestEdgeGap = edgeGap;
              nearestDist = dist;
              nearestDx = dx;
              nearestDy = dy;
            }
            if (dist < desired) {
              const strength = (desired - dist) / desired;
              pushX += (dx / dist) * strength;
              pushY += (dy / dist) * strength;
            }
          }
          const edgePad = island.radius + 14;
          if (island.x < edgePad) pushX += (edgePad - island.x) * 0.06;
          else if (island.x > size - edgePad) pushX -= (island.x - (size - edgePad)) * 0.06;
          if (island.y < edgePad) pushY += (edgePad - island.y) * 0.06;
          else if (island.y > size - edgePad) pushY -= (island.y - (size - edgePad)) * 0.06;

          if (nearestDist < Infinity && nearestEdgeGap > maxBridgeGap) {
            const overflow = nearestEdgeGap - maxBridgeGap;
            const attraction = clamp(overflow * 0.06, 0.08, 1.75);
            pushX -= (nearestDx / nearestDist) * attraction;
            pushY -= (nearestDy / nearestDist) * attraction;
          }

          const centerPull = 0.0013;
          const nextX = island.x + pushX * 3.25 + (centerX - island.x) * centerPull;
          const nextY = island.y + pushY * 3.25 + (centerY - island.y) * centerPull;
          island.x = clamp(nextX, edgePad, size - edgePad);
          island.y = clamp(nextY, edgePad, size - edgePad);
        }
      }
    }

    function enforceIslandBridgeGap(limitTiles = MAX_ISLAND_BRIDGE_GAP_TILES, iterations = 14) {
      if (islands.length <= 2) return;
      const safeLimit = Math.max(6, Number(limitTiles) || 15);
      for (let pass = 0; pass < iterations; pass += 1) {
        let adjusted = false;
        for (let i = 1; i < islands.length; i += 1) {
          const island = islands[i];
          let nearest = null;
          let nearestDist = Infinity;
          for (let j = 0; j < islands.length; j += 1) {
            if (i === j) continue;
            const other = islands[j];
            const dx = island.x - other.x;
            const dy = island.y - other.y;
            const dist = Math.hypot(dx, dy) || 0.0001;
            if (dist < nearestDist) {
              nearestDist = dist;
              nearest = { dx, dy, other };
            }
          }
          if (!nearest || !nearest.other) continue;
          const edgeGap = nearestDist - (island.radius + nearest.other.radius);
          if (edgeGap <= safeLimit + 0.35) continue;
          const shift = Math.min(4.2, edgeGap - safeLimit);
          const edgePad = island.radius + 14;
          const nextX = clamp(
            island.x - (nearest.dx / nearestDist) * shift,
            edgePad,
            size - edgePad
          );
          const nextY = clamp(
            island.y - (nearest.dy / nearestDist) * shift,
            edgePad,
            size - edgePad
          );
          if (Math.hypot(nextX - island.x, nextY - island.y) > 0.01) {
            island.x = nextX;
            island.y = nextY;
            adjusted = true;
          }
        }
        if (!adjusted) break;
        relaxIslandLayout(1);
      }
    }

    ensureBiomeIslandCoverage();
    relaxIslandLayout(6);
    enforceIslandBridgeGap();

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        let base = 0;
        let bestIndex = -1;
        for (let i = 0; i < islands.length; i += 1) {
          const island = islands[i];
          const dx = x - island.x;
          const dy = y - island.y;
          const dist = Math.hypot(dx, dy);
          const falloff = clamp(1 - dist / island.radius, 0, 1);
          if (falloff > base) {
            base = falloff;
            bestIndex = i;
          }
        }

        const edgeNoise = fbm(x * 0.2, y * 0.2, seed + 200);
        const height = base + (edgeNoise - 0.5) * 0.3 * base;
        const idx = tileIndex(x, y, size);
        const isLand = height > 0.2;
        tiles[idx] = isLand ? 1 : 0;
        if (isLand && bestIndex !== -1) {
          biomeGrid[idx] = islands[bestIndex].biomeId;
          shades[idx] = 0.76 + fbm(x * 0.25, y * 0.25, seed + 500) * 0.35;
        } else {
          biomeGrid[idx] = -1;
          shades[idx] = 0.7 + fbm(x * 0.25, y * 0.25, seed + 500) * 0.2;
        }
      }
    }

    function countLandTilesByBiome() {
      const counts = new Array(BIOMES.length).fill(0);
      for (let y = 0; y < size; y += 1) {
        for (let x = 0; x < size; x += 1) {
          const idx = tileIndex(x, y, size);
          if (!tiles[idx]) continue;
          const biomeId = biomeGrid[idx];
          if (!Number.isInteger(biomeId) || biomeId < 0 || biomeId >= BIOMES.length) continue;
          counts[biomeId] += 1;
        }
      }
      return counts;
    }

    function stampBiomeLandForIsland(island, biomeId) {
      if (!island) return 0;
      const cx = clamp(Math.floor(island.x), 1, size - 2);
      const cy = clamp(Math.floor(island.y), 1, size - 2);
      const radius = Math.max(2, Math.min(4, Math.floor(island.radius * 0.34)));
      let painted = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const tx = cx + dx;
          const ty = cy + dy;
          if (!inBounds(tx, ty, size)) continue;
          if (tx <= 0 || ty <= 0 || tx >= size - 1 || ty >= size - 1) continue;
          if (Math.hypot(dx, dy) > radius + 0.35) continue;
          const idx = tileIndex(tx, ty, size);
          tiles[idx] = 1;
          biomeGrid[idx] = biomeId;
          shades[idx] = 0.78 + fbm(tx * 0.25, ty * 0.25, seed + 500) * 0.3;
          painted += 1;
        }
      }
      return painted;
    }

    function ensureBiomeLandCoverage() {
      const minTilesPerBiome = 10;
      const counts = countLandTilesByBiome();
      for (let biomeId = 0; biomeId < BIOMES.length; biomeId += 1) {
        if (counts[biomeId] >= minTilesPerBiome) continue;
        const candidates = islands
          .filter((island) => island && island.biomeId === biomeId)
          .sort((a, b) => b.radius - a.radius);
        for (const island of candidates) {
          if (counts[biomeId] >= minTilesPerBiome) break;
          counts[biomeId] += stampBiomeLandForIsland(island, biomeId);
        }
      }
    }

    ensureBiomeLandCoverage();

    for (let y = 1; y < size - 1; y += 1) {
      for (let x = 1; x < size - 1; x += 1) {
        const idx = tileIndex(x, y, size);
        if (!tiles[idx]) continue;
        if (
          !tiles[tileIndex(x + 1, y, size)] ||
          !tiles[tileIndex(x - 1, y, size)] ||
          !tiles[tileIndex(x, y + 1, size)] ||
          !tiles[tileIndex(x, y - 1, size)]
        ) {
          beachGrid[idx] = true;
        }
      }
    }

    const resources = [];
    const occupancy = new Array(size * size).fill(false);
    const resourceGrid = createResourceGrid(size);

    function isClear(rx, ry, radius) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const nx = rx + dx;
          const ny = ry + dy;
          if (!inBounds(nx, ny, size)) continue;
          if (occupancy[tileIndex(nx, ny, size)]) return false;
        }
      }
      return true;
    }

    function addResource(type, tx, ty, hp, extra = null) {
      const idx = tileIndex(tx, ty, size);
      occupancy[idx] = true;
      const res = {
        id: resources.length,
        type,
        x: (tx + 0.5) * CONFIG.tileSize,
        y: (ty + 0.5) * CONFIG.tileSize,
        tx,
        ty,
        hp,
        maxHp: hp,
        removed: false,
        hitTimer: 0,
        stage: "alive",
        respawnTimer: 0,
      };
      if (extra) Object.assign(res, extra);
      resources.push(res);
      resourceGrid[idx] = res.id;
    }

    for (let y = 1; y < size - 1; y += 1) {
      for (let x = 1; x < size - 1; x += 1) {
        const idx = tileIndex(x, y, size);
        if (!tiles[idx]) continue;
        if (beachGrid[idx]) continue;
        const biomeId = biomeGrid[idx] >= 0 ? biomeGrid[idx] : 0;
        const biome = BIOMES[biomeId] || BIOMES[0];
        const r = rand2d(x, y, seed + 42);
        if (r < biome.treeRate && isClear(x, y, 2)) {
          const treeHp = getBiomeTreeMaxHp(biome);
          const treeDrops = getBiomeTreeDropQty(biome);
          addResource("tree", x, y, treeHp, treeDrops > 1 ? { dropQty: treeDrops } : null);
        } else if (r < biome.treeRate + biome.rockRate && isClear(x, y, 2)) {
          const coalRoll = rand2d(x, y, seed + 813);
          if (biome.key === "ashlands" && coalRoll < (biome.coalRockChance || 0)) {
            addResource("rock", x, y, 4, { dropOverride: "coal" });
          } else {
            addResource("rock", x, y, 4);
          }
        } else if (r < biome.treeRate + biome.rockRate + (biome.grassRate || 0) && isClear(x, y, 1)) {
          const grassDrops = getBiomeGrassDropQty(biome);
          addResource("grass", x, y, 1, grassDrops > 1 ? { dropQty: grassDrops } : null);
        }
      }
    }

    function hasBiomeStone(biomeId) {
      return resources.some((res) => res.type === "biomeStone" && res.biomeId === biomeId);
    }

    function biomeStoneCount(biomeId) {
      return resources.reduce(
        (count, res) => count + Number(res.type === "biomeStone" && res.biomeId === biomeId),
        0
      );
    }

    function placeBiomeStone(biomeId) {
      for (let attempt = 0; attempt < 400; attempt += 1) {
        const x = Math.floor(rng() * size);
        const y = Math.floor(rng() * size);
        const idx = tileIndex(x, y, size);
        if (!tiles[idx]) continue;
        if (beachGrid[idx]) continue;
        if (biomeGrid[idx] !== biomeId) continue;
        if (resourceGrid[idx] !== -1) continue;
        if (!isClear(x, y, 2)) continue;
        addResource("biomeStone", x, y, 6, { biomeId });
        return true;
      }
      // Fallback for dense islands: clear one non-stone resource so each biome can still guarantee at least one stone.
      for (let attempt = 0; attempt < 550; attempt += 1) {
        const x = Math.floor(rng() * size);
        const y = Math.floor(rng() * size);
        const idx = tileIndex(x, y, size);
        if (!tiles[idx]) continue;
        if (beachGrid[idx]) continue;
        if (biomeGrid[idx] !== biomeId) continue;
        const resId = resourceGrid[idx];
        if (resId !== -1 && resId !== null && resId !== undefined) {
          const existing = resources[resId];
          if (!existing || existing.type === "biomeStone") continue;
          existing.removed = true;
          resourceGrid[idx] = -1;
        }
        addResource("biomeStone", x, y, 6, { biomeId });
        return true;
      }
      return false;
    }

    const biomeStoneBiomeCount = Math.min(BIOMES.length, BIOME_STONES.length);
    for (let biomeId = 0; biomeId < biomeStoneBiomeCount; biomeId += 1) {
      const targetCount = 1;
      while (biomeStoneCount(biomeId) < targetCount) {
        if (!placeBiomeStone(biomeId)) break;
      }
      if (!hasBiomeStone(biomeId)) {
        placeBiomeStone(biomeId);
      }
    }

    const caves = [];
    const maxCaves = Math.max(1, Math.floor(islandCount * 0.08));
    const starterCaveChance = 0.03;
    const caveCandidateIslands = islands
      .filter((island) => {
        if (island.radius < 8) return false;
        if (!island.starter) return true;
        return rng() < starterCaveChance;
      })
      .sort((a, b) => b.radius - a.radius);

    function hasCaveAt(tx, ty) {
      return caves.some((cave) => cave.tx === tx && cave.ty === ty);
    }

    function clearResourceAt(tx, ty) {
      const idx = tileIndex(tx, ty, size);
      const resId = resourceGrid[idx];
      if (resId === -1 || resId == null) return;
      const res = resources[resId];
      if (!res) return;
      res.removed = true;
      resourceGrid[idx] = -1;
      occupancy[idx] = false;
    }

    function canUseCaveTile(tx, ty, allowOccupied = false) {
      if (!inBounds(tx, ty, size)) return false;
      const idx = tileIndex(tx, ty, size);
      if (!tiles[idx]) return false;
      if (beachGrid[idx]) return false;
      if (!allowOccupied && resourceGrid[idx] !== -1) return false;
      if (hasCaveAt(tx, ty)) return false;
      return true;
    }

    function addCaveAt(tx, ty, allowOccupied = false) {
      if (!canUseCaveTile(tx, ty, allowOccupied)) return false;
      if (allowOccupied) clearResourceAt(tx, ty);
      const hostileBlocked = isMushroomBiomeAtTile({ biomeGrid, size }, tx, ty);
      caves.push({
        id: caves.length,
        tx,
        ty,
        spawnedByPlayer: false,
        hostileBlocked,
        world: generateCaveWorld(seed, caves.length, { spawnHostiles: !hostileBlocked }),
      });
      return true;
    }

    function findCaveSpotOnIsland(island, allowOccupied = false) {
      const maxRadius = island.radius * 0.78;
      for (let attempt = 0; attempt < 28; attempt += 1) {
        const tx = Math.floor(island.x + (rng() - 0.5) * maxRadius);
        const ty = Math.floor(island.y + (rng() - 0.5) * maxRadius);
        if (canUseCaveTile(tx, ty, allowOccupied)) return { tx, ty };
      }
      for (let ring = 0.1; ring <= 0.72; ring += 0.08) {
        const radius = island.radius * ring;
        const points = 22;
        for (let i = 0; i < points; i += 1) {
          const angle = (i / points) * Math.PI * 2 + ring * 7.1;
          const tx = Math.floor(island.x + Math.cos(angle) * radius);
          const ty = Math.floor(island.y + Math.sin(angle) * radius);
          if (canUseCaveTile(tx, ty, allowOccupied)) return { tx, ty };
        }
      }
      return null;
    }

    function findGuaranteedCaveSpot() {
      const sortedIslands = islands
        .slice()
        .sort((a, b) => (Number(a.starter) - Number(b.starter)) || (b.radius - a.radius));
      for (const island of sortedIslands) {
        const spot = findCaveSpotOnIsland(island, true);
        if (spot) return spot;
        const cx = Math.floor(island.x);
        const cy = Math.floor(island.y);
        if (canUseCaveTile(cx, cy, true)) return { tx: cx, ty: cy };
        const maxRadius = Math.max(2, Math.floor(island.radius * 0.9));
        for (let radius = 1; radius <= maxRadius; radius += 1) {
          for (let dy = -radius; dy <= radius; dy += 1) {
            for (let dx = -radius; dx <= radius; dx += 1) {
              const tx = cx + dx;
              const ty = cy + dy;
              if (!canUseCaveTile(tx, ty, true)) continue;
              return { tx, ty };
            }
          }
        }
      }

      for (let y = 1; y < size - 1; y += 1) {
        for (let x = 1; x < size - 1; x += 1) {
          if (!canUseCaveTile(x, y, true)) continue;
          return { tx: x, ty: y };
        }
      }

      return null;
    }

    for (const island of caveCandidateIslands) {
      if (caves.length >= maxCaves) break;
      if (rng() > 0.2) continue;
      const spot = findCaveSpotOnIsland(island, false) || findCaveSpotOnIsland(island, true);
      if (!spot) continue;
      addCaveAt(spot.tx, spot.ty, true);
    }

    if (caves.length === 0) {
      for (const island of caveCandidateIslands) {
        const spot = findCaveSpotOnIsland(island, true);
        if (!spot) continue;
        if (addCaveAt(spot.tx, spot.ty, true)) {
          break;
        }
      }
    }

    if (caves.length === 0) {
      for (let y = 2; y < size - 2; y += 2) {
        let placed = false;
        for (let x = 2; x < size - 2; x += 2) {
          if (!canUseCaveTile(x, y, true)) continue;
          if (addCaveAt(x, y, true)) {
            placed = true;
            break;
          }
        }
        if (placed) break;
      }
    }

    if (caves.length === 0) {
      const guaranteed = findGuaranteedCaveSpot();
      if (guaranteed) {
        addCaveAt(guaranteed.tx, guaranteed.ty, true);
      }
    }

    return {
      seed: seedStr,
      seedInt: seed,
      size,
      tiles,
      shades,
      resources,
      resourceGrid,
      biomeGrid,
      beachGrid,
      islands,
      caves,
      drops: [],
      respawnTasks: [],
      monsters: [],
      nextMonsterId: 1,
      monsterBurnFx: [],
      projectiles: [],
      nextProjectileId: 1,
      animals: [],
      nextAnimalId: 1,
      animalSpawnTimer: 3,
      villagers: [],
      nextVillagerId: 1,
    };
  }

  function isSpawnableTile(world, tx, ty) {
    if (!inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    if (!world.tiles[idx]) return false;
    const res = getResourceAt(world, tx, ty);
    if (res) return false;
    const structure = getStructureAt(tx, ty);
    if (structure) {
      const def = STRUCTURE_DEFS[structure.type];
      if (def?.blocking) return false;
    }
    return true;
  }

  function findSpawnTile(world) {
    const size = world.size;
    if (Array.isArray(world.islands) && world.islands.length > 0) {
      const starter = world.islands.find((island) => island.starter) ?? world.islands[0];
      const cx = Math.floor(starter.x);
      const cy = Math.floor(starter.y);
      const maxRadius = Math.ceil(starter.radius);
      if (isSpawnableTile(world, cx, cy)) return { x: cx, y: cy };

      for (let r = 1; r <= maxRadius; r += 1) {
        for (let dy = -r; dy <= r; dy += 1) {
          for (let dx = -r; dx <= r; dx += 1) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (!inBounds(nx, ny, size)) continue;
            if (isSpawnableTile(world, nx, ny)) return { x: nx, y: ny };
          }
        }
      }
    }

    const cx = Math.floor(size / 2);
    const cy = Math.floor(size / 2);
    if (isSpawnableTile(world, cx, cy)) return { x: cx, y: cy };

    for (let r = 1; r < size; r += 1) {
      for (let dy = -r; dy <= r; dy += 1) {
        for (let dx = -r; dx <= r; dx += 1) {
          const nx = cx + dx;
          const ny = cy + dy;
          if (!inBounds(nx, ny, size)) continue;
          if (isSpawnableTile(world, nx, ny)) return { x: nx, y: ny };
        }
      }
    }

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        if (isSpawnableTile(world, x, y)) return { x, y };
      }
    }

    return { x: cx, y: cy };
  }

  function createEmptyInventory(size) {
    return Array.from({ length: size }, () => ({ id: null, qty: 0 }));
  }

  function normalizeLegacyItemId(itemId) {
    if (itemId === "lantern") return "campfire";
    return itemId;
  }

  function isKnownItemId(itemId) {
    const normalized = normalizeLegacyItemId(itemId);
    return typeof normalized === "string" && !!ITEMS[normalized];
  }

  function sanitizeInventorySlots(slots, expectedSize = null) {
    const size = Number.isInteger(expectedSize) && expectedSize >= 0
      ? expectedSize
      : (Array.isArray(slots) ? slots.length : 0);
    const source = Array.isArray(slots) ? slots : [];
    const output = [];
    for (let i = 0; i < size; i += 1) {
      const slot = source[i] || {};
      const normalizedId = normalizeLegacyItemId(slot.id);
      const id = isKnownItemId(normalizedId) ? normalizedId : null;
      const qty = id
        ? clamp(Math.floor(Number(slot.qty) || 0), 1, MAX_STACK)
        : 0;
      output.push({ id: qty > 0 ? id : null, qty: qty > 0 ? qty : 0 });
    }
    return output;
  }

  function sanitizeDropEntries(drops) {
    if (!Array.isArray(drops)) return [];
    const output = [];
    for (const drop of drops) {
      const normalizedId = normalizeLegacyItemId(drop?.itemId);
      if (!drop || !isKnownItemId(normalizedId)) continue;
      const qty = clamp(Math.floor(Number(drop.qty) || 0), 1, MAX_STACK);
      if (qty <= 0) continue;
      const ttlRaw = Number(drop.ttl);
      const ttl = Number.isFinite(ttlRaw)
        ? clamp(ttlRaw, 0, DROP_DESPAWN.lifetime)
        : DROP_DESPAWN.lifetime;
      const id = Number.isInteger(drop.id) && drop.id >= 0
        ? drop.id
        : null;
      output.push({
        id,
        itemId: normalizedId,
        qty,
        x: Number.isFinite(drop.x) ? drop.x : 0,
        y: Number.isFinite(drop.y) ? drop.y : 0,
        ttl,
      });
    }
    return output;
  }

  function addItem(inventory, itemId, amount) {
    let remaining = amount;

    for (const slot of inventory) {
      if (slot.id === itemId && slot.qty < MAX_STACK) {
        const space = MAX_STACK - slot.qty;
        const toAdd = Math.min(space, remaining);
        slot.qty += toAdd;
        remaining -= toAdd;
        if (remaining <= 0) return 0;
      }
    }

    for (const slot of inventory) {
      if (!slot.id) {
        const toAdd = Math.min(MAX_STACK, remaining);
        slot.id = itemId;
        slot.qty = toAdd;
        remaining -= toAdd;
        if (remaining <= 0) return 0;
      }
    }

    return remaining;
  }

  function canAddItem(inventory, itemId, amount) {
    const temp = inventory.map((slot) => ({ id: slot.id, qty: slot.qty }));
    const left = addItem(temp, itemId, amount);
    return left === 0;
  }

  function canAddItems(inventory, items) {
    const temp = inventory.map((slot) => ({ id: slot.id, qty: slot.qty }));
    for (const [itemId, qty] of Object.entries(items)) {
      if (addItem(temp, itemId, qty) > 0) return false;
    }
    return true;
  }

  function removeItem(inventory, itemId, amount) {
    let remaining = amount;
    for (const slot of inventory) {
      if (slot.id !== itemId) continue;
      const taken = Math.min(slot.qty, remaining);
      slot.qty -= taken;
      remaining -= taken;
      if (slot.qty <= 0) {
        slot.id = null;
        slot.qty = 0;
      }
      if (remaining <= 0) return 0;
    }
    return remaining;
  }

  function countItem(inventory, itemId) {
    return inventory.reduce((sum, slot) => sum + (slot.id === itemId ? slot.qty : 0), 0);
  }

  function hasCost(inventory, cost) {
    if (isInfiniteResourcesEnabled()) return true;
    return Object.entries(cost).every(([itemId, qty]) => countItem(inventory, itemId) >= qty);
  }

  function applyCost(inventory, cost) {
    if (isInfiniteResourcesEnabled()) return;
    for (const [itemId, qty] of Object.entries(cost)) {
      removeItem(inventory, itemId, qty);
    }
  }

  function moveSlotBetween(fromInv, fromIndex, toInv, toIndex) {
    if (fromInv === toInv && fromIndex === toIndex) return;
    const from = fromInv[fromIndex];
    const to = toInv[toIndex];
    if (!from.id) return;

    if (!to.id) {
      to.id = from.id;
      to.qty = from.qty;
      from.id = null;
      from.qty = 0;
      return;
    }

    if (to.id === from.id) {
      const space = MAX_STACK - to.qty;
      if (space <= 0) return;
      const moved = Math.min(space, from.qty);
      to.qty += moved;
      from.qty -= moved;
      if (from.qty <= 0) {
        from.id = null;
        from.qty = 0;
      }
      return;
    }

    const tempId = to.id;
    const tempQty = to.qty;
    to.id = from.id;
    to.qty = from.qty;
    from.id = tempId;
    from.qty = tempQty;
  }

  function moveSlotToFirstAvailable(fromInv, fromIndex, toInv) {
    const from = fromInv?.[fromIndex];
    if (!from || !from.id || !Array.isArray(toInv)) return false;
    let emptyIndex = -1;
    for (let i = 0; i < toInv.length; i += 1) {
      const slot = toInv[i];
      if (!slot.id) {
        if (emptyIndex < 0) emptyIndex = i;
        continue;
      }
      if (slot.id !== from.id || slot.qty >= MAX_STACK) continue;
      moveSlotBetween(fromInv, fromIndex, toInv, i);
      return true;
    }
    if (emptyIndex >= 0) {
      moveSlotBetween(fromInv, fromIndex, toInv, emptyIndex);
      return true;
    }
    return false;
  }

  function setPrompt(text, duration = 0) {
    state.promptText = text;
    state.promptTimer = duration;
  }

  function updatePrompt(dt) {
    if (state.promptTimer > 0) {
      state.promptTimer -= dt;
      if (state.promptTimer <= 0) {
        state.promptText = "";
      }
    }

    if (state.promptText) {
      promptEl.textContent = state.promptText;
      promptEl.classList.add("visible");
    } else {
      promptEl.classList.remove("visible");
    }
  }

  function markDirty() {
    state.dirty = true;
    if (!netIsClientReady()) {
      saveStatus.textContent = "Saving...";
    }
  }

  function hasPlacedStructure(type) {
    return state.structures.some((structure) => !structure.removed && structure.type === type);
  }

  function getObjectiveSteps() {
    const inv = state.inventory || [];
    const woodCount = countItem(inv, "wood");
    const pickaxeTier = getPickaxeTier(state.player);
    const swordTier = getSwordTier(state.player);
    const stoneCount = countItem(inv, "stone");
    const coalCount = countItem(inv, "coal");
    const ironOreCount = countItem(inv, "iron_ore");
    const ironIngotCount = countItem(inv, "iron_ingot");
    const goldOreCount = countItem(inv, "gold_ore");
    const goldIngotCount = countItem(inv, "gold_ingot");
    const emeraldCount = countItem(inv, "emerald");
    const diamondCount = countItem(inv, "diamond");
    const hasSmelter = hasPlacedStructure("smelter");
    const biomeFound = BIOME_STONES.filter((stone) => countItem(inv, stone.id) > 0).length;
    const hasBeaconCore = countItem(inv, "beacon_core") > 0;
    const hasBeaconItem = countItem(inv, "beacon") > 0;
    const beaconBuilt = hasPlacedStructure("beacon") || state.gameWon;

    const stonesReady = biomeFound >= BIOME_STONES.length || hasBeaconItem || beaconBuilt;
    const coreReady = hasBeaconCore || hasBeaconItem || beaconBuilt;

    return [
      {
        title: "Gather starter wood",
        desc: `Chop trees and collect at least 10 wood (${woodCount}/10).`,
        done: woodCount >= 10,
      },
      {
        title: "Unlock Wood Pickaxe",
        desc: "Use Upgrades tab to unlock stone mining.",
        done: pickaxeTier >= 1,
      },
      {
        title: "Unlock Stone Pickaxe",
        desc: `Mine stone and unlock coal/iron access (stone ${stoneCount}).`,
        done: pickaxeTier >= 2,
      },
      {
        title: "Set up smelting",
        desc: `Place a Smelter and gather coal + iron ore (coal ${coalCount}, iron ${ironOreCount}).`,
        done: hasSmelter && coalCount >= 1 && ironOreCount >= 1,
      },
      {
        title: "Upgrade pickaxe chain",
        desc: `Reach Emerald Pickaxe to unlock diamond mining (current tier ${pickaxeTier}/5).`,
        done: pickaxeTier >= 5,
      },
      {
        title: "Upgrade sword chain",
        desc: `Improve combat survivability (current sword tier ${swordTier}/5).`,
        done: swordTier >= 3,
      },
      {
        title: "Refine advanced materials",
        desc: `Smelt iron and gold for progression (iron ingots ${ironIngotCount}, gold ingots ${goldIngotCount}).`,
        done: ironIngotCount >= 3 && goldIngotCount >= 2,
      },
      {
        title: "Collect biome stones",
        desc: `Find all biome stone types (${biomeFound}/${BIOME_STONES.length}).`,
        done: stonesReady,
      },
      {
        title: "Forge Beacon Core",
        desc: "Use a Smelter to craft a Beacon Core.",
        done: coreReady,
      },
      {
        title: "Build and place Rescue Beacon",
        desc: `Use refined loot (gold ${goldOreCount}, emerald ${emeraldCount}, diamond ${diamondCount}) and place beacon on a beach.`,
        done: beaconBuilt,
      },
    ];
  }

  function renderObjectiveGuide() {
    if (!objectiveGuide) return;
    const steps = getObjectiveSteps();
    objectiveGuide.innerHTML = "";
    for (const step of steps) {
      const card = document.createElement("div");
      card.className = `objective-step${step.done ? " done" : ""}`;
      const title = document.createElement("div");
      title.className = "objective-step-title";
      title.textContent = `${step.done ? "Complete" : "Goal"}: ${step.title}`;
      const desc = document.createElement("div");
      desc.className = "objective-step-desc";
      desc.textContent = step.desc;
      card.appendChild(title);
      card.appendChild(desc);
      objectiveGuide.appendChild(card);
    }
  }

  function updateObjectiveUI() {
    renderObjectiveGuide();
    if (endScreen) {
      endScreen.classList.toggle("hidden", !state.gameWon);
      if (!state.gameWon) {
        endScreen.classList.remove("text-ready");
      }
    }
    if (newRunBtn) {
      newRunBtn.disabled = netIsClientReady();
    }
  }

  function startWinSequence() {
    state.winTimer = 0;
    state.winSequencePlayed = true;
    state.winPlayerPos = state.winPlayerPos ?? (state.player ? { x: state.player.x, y: state.player.y } : null);
    if (endScreen) {
      endScreen.classList.remove("animate");
      void endScreen.offsetWidth;
      endScreen.classList.add("animate");
    }
  }

  function updateWinSequence(dt) {
    if (!state.gameWon) return;
    state.winTimer = Math.min(state.winTimer + dt, 12);
    if (endScreen) {
      endScreen.classList.toggle("text-ready", state.winTimer >= WIN_SEQUENCE.textDelay);
    }
  }

  function triggerGameWin() {
    if (state.gameWon) return;
    state.gameWon = true;
    stopAmbientAudio();
    state.winPlayerPos = { x: state.player?.x ?? 0, y: state.player?.y ?? 0 };
    state.timeOfDay = 0;
    state.isNight = false;
    if (state.surfaceWorld) {
      state.surfaceWorld.monsters = [];
      state.surfaceWorld.projectiles = [];
    }
    updateTimeUI();
    updateObjectiveUI();
    startWinSequence();
    setPrompt("Rescue beacon lit!", 2);
    markDirty();
  }

  function serializeResource(res) {
    return {
      hp: res.hp,
      removed: res.removed,
      stage: res.stage ?? "alive",
      respawnTimer: res.respawnTimer ?? 0,
    };
  }

  function canonicalizeSeedValue(seed) {
    const raw = String(seed ?? "").trim().toLowerCase();
    if (!raw) return "island-1";
    const compact = raw
      .replace(/[\s_]+/g, "-")
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    return compact || "island-1";
  }

  function normalizeSeedValue(seed) {
    return canonicalizeSeedValue(seed);
  }

  function getSeedSaveKey(seed) {
    return `${SAVE_KEY_PREFIX}${normalizeSeedValue(seed)}`;
  }

  function getSeedAliasCandidates(seed) {
    const raw = String(seed ?? "").trim();
    const candidates = new Set();
    if (raw) {
      candidates.add(raw);
      candidates.add(raw.toLowerCase());
      candidates.add(raw.replace(/\s+/g, "-"));
      candidates.add(raw.replace(/\s+/g, "_"));
      candidates.add(raw.replace(/[\s_]+/g, "-").toLowerCase());
    }
    candidates.add(normalizeSeedValue(raw));
    return Array.from(candidates).filter(Boolean);
  }

  function getStoredActiveSeed() {
    try {
      const seed = localStorage.getItem(ACTIVE_SEED_KEY);
      return seed ? normalizeSeedValue(seed) : null;
    } catch (err) {
      return null;
    }
  }

  function setStoredActiveSeed(seed) {
    const normalized = normalizeSeedValue(seed);
    try {
      localStorage.setItem(ACTIVE_SEED_KEY, normalized);
    } catch (err) {
      // ignore persistence failures
    }
    return normalized;
  }

  function readSaveFromKey(key) {
    let raw = null;
    try {
      raw = localStorage.getItem(key);
    } catch (err) {
      raw = null;
    }
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (!data || typeof data !== "object") return null;
      const version = Number(data.version);
      data.version = Number.isFinite(version) ? version : 1;
      return data;
    } catch (err) {
      console.warn("Save parse failed", err);
      return null;
    }
  }

  function saveBelongsToSeed(save, canonicalSeed, keyHint = null) {
    if (!save || typeof save !== "object") return false;
    const normalizedTarget = normalizeSeedValue(canonicalSeed);
    const embedded = String(save.seed ?? "").trim();
    if (embedded) {
      return normalizeSeedValue(embedded) === normalizedTarget;
    }
    if (typeof keyHint === "string" && keyHint.startsWith(SAVE_KEY_PREFIX)) {
      const keySeed = keyHint.slice(SAVE_KEY_PREFIX.length);
      return normalizeSeedValue(keySeed) === normalizedTarget;
    }
    return false;
  }

  function readSaveForSeed(seedInput) {
    const canonicalSeed = normalizeSeedValue(seedInput);
    const aliases = getSeedAliasCandidates(seedInput);
    const checkedKeys = new Set();

    for (const alias of aliases) {
      const exact = String(alias ?? "").trim();
      if (!exact) continue;
      const key = `${SAVE_KEY_PREFIX}${exact}`;
      if (checkedKeys.has(key)) continue;
      checkedKeys.add(key);
      const save = readSaveFromKey(key);
      if (save && saveBelongsToSeed(save, canonicalSeed, key)) return { key, save };
    }

    const canonicalKey = getSeedSaveKey(canonicalSeed);
    if (!checkedKeys.has(canonicalKey)) {
      checkedKeys.add(canonicalKey);
      const save = readSaveFromKey(canonicalKey);
      if (save && saveBelongsToSeed(save, canonicalSeed, canonicalKey)) {
        return { key: canonicalKey, save };
      }
    }

    try {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(SAVE_KEY_PREFIX) || checkedKeys.has(key)) continue;
        const save = readSaveFromKey(key);
        if (!save) continue;
        if (saveBelongsToSeed(save, canonicalSeed, key)) {
          return { key, save };
        }
      }
    } catch (err) {
      // ignore localStorage enumeration issues
    }

    return null;
  }

  function isSaveLayoutCompatible(save) {
    if (!save || typeof save !== "object") return false;
    const saveSize = Number(save.worldSize);
    if (!Number.isFinite(saveSize) || saveSize !== CONFIG.worldSize) return false;
    return String(save.worldLayoutVersion || "") === WORLD_LAYOUT_VERSION;
  }

  function sanitizeSaveForCurrentLayout(save, seed) {
    if (!save || typeof save !== "object") return null;
    const sanitizedPlayer = {
      ...(save.player || {}),
      x: null,
      y: null,
      checkpoint: null,
      inCave: false,
      caveId: null,
      returnPosition: null,
      hp: Number(save.player?.maxHp) || Number(save.player?.hp) || 100,
    };
    return {
      ...save,
      seed: normalizeSeedValue(seed ?? save.seed),
      worldSize: CONFIG.worldSize,
      worldLayoutVersion: WORLD_LAYOUT_VERSION,
      islandLayout: null,
      player: sanitizedPlayer,
      timeOfDay: 0,
      gameWon: false,
      resourceStates: [],
      respawnTasks: [],
      structures: [],
      drops: [],
      monsters: [],
      animals: [],
      villagers: [],
      caves: [],
    };
  }

  function saveGame() {
    if (netIsClientReady()) return;
    if (!state.world || !state.player) return;
    const surface = state.surfaceWorld || state.world;
    if (!surface) return;
    const seedKey = getSeedSaveKey(surface.seed);

    const data = {
      version: SAVE_VERSION,
      seed: surface.seed,
      worldSize: surface.size,
      worldLayoutVersion: WORLD_LAYOUT_VERSION,
      islandLayout: serializeIslandLayout(surface),
      player: {
        x: state.player.x,
        y: state.player.y,
        toolTier: state.player.toolTier,
        unlocks: normalizeUnlocks(state.player.unlocks),
        checkpoint: normalizeCheckpoint(state.player.checkpoint),
        maxHp: state.player.maxHp,
        hp: state.player.hp,
        inCave: state.inCave,
        caveId: state.activeCave?.id ?? null,
        returnPosition: state.returnPosition,
      },
      timeOfDay: state.timeOfDay,
      gameWon: state.gameWon,
      inventory: state.inventory,
      resourceStates: surface.resources.map((res) => serializeResource(res)),
      respawnTasks: surface.respawnTasks ?? [],
      structures: state.structures
        .filter((structure) => !structure.removed)
        .map((structure) => ({
          type: structure.type,
          tx: structure.tx,
          ty: structure.ty,
          storage: structure.storage ? structure.storage.map((slot) => ({ ...slot })) : null,
          meta: serializeStructureMeta(structure),
        })),
      drops: (surface.drops ?? []).map((drop) => ({
        id: drop.id,
        itemId: drop.itemId,
        qty: drop.qty,
        x: drop.x,
        y: drop.y,
        ttl: Number.isFinite(drop.ttl) ? drop.ttl : DROP_DESPAWN.lifetime,
      })),
      monsters: (surface.monsters ?? []).map((monster) => ({
        id: monster.id,
        type: monster.type ?? "crawler",
        x: monster.x,
        y: monster.y,
        hp: monster.hp,
        maxHp: monster.maxHp,
        attackTimer: Math.max(0, Number(monster.attackTimer) || 0),
        dayBurning: !!monster.dayBurning,
        burnTimer: Math.max(0, Number(monster.burnTimer) || 0),
        burnDuration: Math.max(0, Number(monster.burnDuration) || 0),
        poisonDuration: Math.max(0, Number(monster.poisonDuration) || 0),
        poisonDps: Math.max(0, Number(monster.poisonDps) || 0),
      })),
      animals: (surface.animals ?? []).map((animal) => ({
        id: animal.id,
        type: animal.type,
        x: animal.x,
        y: animal.y,
        hp: animal.hp,
        maxHp: animal.maxHp,
        speed: animal.speed,
        color: animal.color,
      })),
      villagers: (surface.villagers ?? []).map((villager) => ({
        id: villager.id,
        x: villager.x,
        y: villager.y,
        homeX: villager.homeX,
        homeY: villager.homeY,
        speed: villager.speed,
        color: villager.color,
        wanderRadius: villager.wanderRadius,
      })),
      caves: surface.caves?.map((cave) => ({
        id: cave.id,
        tx: cave.tx,
        ty: cave.ty,
        spawnedByPlayer: !!cave.spawnedByPlayer,
        hostileBlocked: !!cave.hostileBlocked,
        resourceStates: cave.world.resources.map((res) => serializeResource(res)),
        respawnTasks: cave.world.respawnTasks ?? [],
        drops: (cave.world.drops ?? []).map((drop) => ({
          id: drop.id,
          itemId: drop.itemId,
          qty: drop.qty,
          x: drop.x,
          y: drop.y,
          ttl: Number.isFinite(drop.ttl) ? drop.ttl : DROP_DESPAWN.lifetime,
        })),
        monsters: (cave.world.monsters ?? []).map((monster) => ({
          id: monster.id,
          type: monster.type ?? "crawler",
          x: monster.x,
          y: monster.y,
          hp: monster.hp,
          maxHp: monster.maxHp,
          attackTimer: Math.max(0, Number(monster.attackTimer) || 0),
          dayBurning: !!monster.dayBurning,
          burnTimer: Math.max(0, Number(monster.burnTimer) || 0),
          burnDuration: Math.max(0, Number(monster.burnDuration) || 0),
          poisonDuration: Math.max(0, Number(monster.poisonDuration) || 0),
          poisonDps: Math.max(0, Number(monster.poisonDps) || 0),
        })),
      })) ?? [],
    };

    try {
      localStorage.setItem(seedKey, JSON.stringify(data));
      setStoredActiveSeed(surface.seed);
      saveStatus.textContent = "Saved";
    } catch (err) {
      saveStatus.textContent = "Save failed";
      console.warn("Save failed", err);
    }

    state.dirty = false;
    state.saveTimer = CONFIG.saveInterval;
  }

  function loadGame(seedStr = null) {
    const requestedInput = seedStr ?? getStoredActiveSeed() ?? "island-1";
    const requestedSeed = normalizeSeedValue(requestedInput);
    const match = readSaveForSeed(requestedInput);
    if (match?.save) {
      let seededSave = match.save;
      const canonicalKey = getSeedSaveKey(requestedSeed);
      if (!saveBelongsToSeed(seededSave, requestedSeed, match.key)) {
        return null;
      }
      if (match.key !== canonicalKey) {
        const migrated = { ...seededSave, seed: requestedSeed };
        try {
          localStorage.setItem(canonicalKey, JSON.stringify(migrated));
          if (match.key !== canonicalKey) {
            localStorage.removeItem(match.key);
          }
        } catch (err) {
          // ignore migration persistence failures
        }
        seededSave = migrated;
      }
      return seededSave;
    }

    // Backward compatibility: migrate legacy single-slot save into per-seed storage.
    const legacy = readSaveFromKey(SAVE_KEY);
    if (legacy) {
      const legacySeed = normalizeSeedValue(legacy.seed);
      try {
        localStorage.setItem(getSeedSaveKey(legacySeed), JSON.stringify(legacy));
        localStorage.removeItem(SAVE_KEY);
      } catch (err) {
        // ignore migration persistence failures
      }
      if (!getStoredActiveSeed()) {
        setStoredActiveSeed(legacySeed);
      }
      if (legacySeed === requestedSeed) {
        return legacy;
      }
    }
    return null;
  }

  function migrateSave(data) {
    if (!data) return null;
    const version = Number(data.version);
    data.version = Number.isFinite(version) ? version : 1;
    const islandLayout = Array.isArray(data.islandLayout) ? data.islandLayout : null;
    if (data.version === SAVE_VERSION) {
      return {
        ...data,
        version: SAVE_VERSION,
        seed: normalizeSeedValue(data.seed),
        islandLayout,
        monsters: Array.isArray(data.monsters) ? data.monsters : [],
        villagers: Array.isArray(data.villagers) ? data.villagers : [],
      };
    }
    if (data.version === 1) {
      return {
        version: SAVE_VERSION,
        seed: normalizeSeedValue(data.seed),
        islandLayout,
        player: {
          x: data.player?.x ?? 0,
          y: data.player?.y ?? 0,
          toolTier: 1,
          maxHp: 100,
          hp: 100,
          inCave: false,
          caveId: null,
          returnPosition: null,
        },
        timeOfDay: 0,
        gameWon: false,
        inventory: Array.isArray(data.inventory) ? data.inventory : createEmptyInventory(INVENTORY_SIZE),
        resourceStates: Array.isArray(data.resourceStates) ? data.resourceStates : [],
        respawnTasks: [],
        structures: [],
        drops: Array.isArray(data.drops) ? data.drops : [],
        monsters: Array.isArray(data.monsters) ? data.monsters : [],
        animals: Array.isArray(data.animals) ? data.animals : [],
        villagers: [],
        caves: [],
      };
    }
    if (data.version === 2) {
      return {
        version: SAVE_VERSION,
        seed: normalizeSeedValue(data.seed),
        islandLayout,
        player: {
          x: data.player?.x ?? 0,
          y: data.player?.y ?? 0,
          toolTier: data.player?.toolTier ?? 1,
          maxHp: 100,
          hp: 100,
          inCave: false,
          caveId: null,
          returnPosition: null,
        },
        timeOfDay: 0,
        gameWon: false,
        inventory: Array.isArray(data.inventory) ? data.inventory : createEmptyInventory(INVENTORY_SIZE),
        resourceStates: Array.isArray(data.resourceStates) ? data.resourceStates : [],
        respawnTasks: [],
        structures: Array.isArray(data.structures) ? data.structures : [],
        drops: Array.isArray(data.drops) ? data.drops : [],
        monsters: Array.isArray(data.monsters) ? data.monsters : [],
        animals: Array.isArray(data.animals) ? data.animals : [],
        villagers: [],
        caves: [],
      };
    }
    if (data.version === 3) {
      return {
        version: SAVE_VERSION,
        seed: normalizeSeedValue(data.seed),
        islandLayout,
        player: {
          x: data.player?.x ?? 0,
          y: data.player?.y ?? 0,
          toolTier: data.player?.toolTier ?? 1,
          maxHp: data.player?.maxHp ?? 100,
          hp: data.player?.hp ?? 100,
          inCave: data.player?.inCave ?? false,
          caveId: data.player?.caveId ?? null,
          returnPosition: data.player?.returnPosition ?? null,
        },
        timeOfDay: typeof data.timeOfDay === "number" ? data.timeOfDay : 0,
        gameWon: false,
        inventory: Array.isArray(data.inventory) ? data.inventory : createEmptyInventory(INVENTORY_SIZE),
        resourceStates: Array.isArray(data.resourceStates) ? data.resourceStates : [],
        respawnTasks: Array.isArray(data.respawnTasks) ? data.respawnTasks : [],
        structures: Array.isArray(data.structures) ? data.structures : [],
        drops: Array.isArray(data.drops) ? data.drops : [],
        monsters: Array.isArray(data.monsters) ? data.monsters : [],
        animals: Array.isArray(data.animals) ? data.animals : [],
        villagers: [],
        caves: Array.isArray(data.caves) ? data.caves : [],
      };
    }
    if (data.version === 4) {
      return {
        version: SAVE_VERSION,
        seed: normalizeSeedValue(data.seed),
        islandLayout,
        player: {
          x: data.player?.x ?? 0,
          y: data.player?.y ?? 0,
          toolTier: data.player?.toolTier ?? 1,
          maxHp: data.player?.maxHp ?? 100,
          hp: data.player?.hp ?? 100,
          inCave: data.player?.inCave ?? false,
          caveId: data.player?.caveId ?? null,
          returnPosition: data.player?.returnPosition ?? null,
        },
        timeOfDay: typeof data.timeOfDay === "number" ? data.timeOfDay : 0,
        gameWon: !!data.gameWon,
        inventory: Array.isArray(data.inventory) ? data.inventory : createEmptyInventory(INVENTORY_SIZE),
        resourceStates: Array.isArray(data.resourceStates) ? data.resourceStates : [],
        respawnTasks: Array.isArray(data.respawnTasks) ? data.respawnTasks : [],
        structures: Array.isArray(data.structures)
          ? data.structures.map((entry) => ({
              ...entry,
              meta: entry?.meta ?? null,
            }))
          : [],
        drops: Array.isArray(data.drops) ? data.drops : [],
        monsters: Array.isArray(data.monsters) ? data.monsters : [],
        animals: Array.isArray(data.animals) ? data.animals : [],
        villagers: [],
        caves: Array.isArray(data.caves) ? data.caves : [],
      };
    }
    return {
      version: SAVE_VERSION,
      seed: normalizeSeedValue(data.seed),
      islandLayout,
      player: {
        x: data.player?.x ?? 0,
        y: data.player?.y ?? 0,
        toolTier: data.player?.toolTier ?? 1,
        unlocks: normalizeUnlocks(data.player?.unlocks),
        checkpoint: normalizeCheckpoint(data.player?.checkpoint),
        maxHp: data.player?.maxHp ?? 100,
        hp: data.player?.hp ?? 100,
        inCave: data.player?.inCave ?? false,
        caveId: data.player?.caveId ?? null,
        returnPosition: data.player?.returnPosition ?? null,
      },
      timeOfDay: typeof data.timeOfDay === "number" ? data.timeOfDay : 0,
      gameWon: !!data.gameWon,
      inventory: Array.isArray(data.inventory) ? data.inventory : createEmptyInventory(INVENTORY_SIZE),
      resourceStates: Array.isArray(data.resourceStates) ? data.resourceStates : [],
      respawnTasks: Array.isArray(data.respawnTasks) ? data.respawnTasks : [],
      structures: Array.isArray(data.structures)
        ? data.structures.map((entry) => ({
            ...entry,
            meta: entry?.meta ?? null,
          }))
        : [],
      drops: Array.isArray(data.drops) ? data.drops : [],
      monsters: Array.isArray(data.monsters) ? data.monsters : [],
      animals: Array.isArray(data.animals) ? data.animals : [],
      villagers: Array.isArray(data.villagers) ? data.villagers : [],
      caves: Array.isArray(data.caves) ? data.caves : [],
    };
  }

  function applyResourceStates(world, resourceStates) {
    if (!Array.isArray(resourceStates)) return;
    for (let i = 0; i < world.resources.length; i += 1) {
      const res = world.resources[i];
      const savedRes = resourceStates[i];
      if (!savedRes) continue;
      if (typeof savedRes.hp === "number") res.hp = savedRes.hp;
      res.removed = !!savedRes.removed;
      res.stage = savedRes.stage ?? res.stage ?? "alive";
      res.respawnTimer = typeof savedRes.respawnTimer === "number" ? savedRes.respawnTimer : 0;
      res.hitTimer = 0;
      if (res.removed) {
        const idx = tileIndex(res.tx, res.ty, world.size);
        world.resourceGrid[idx] = -1;
      }
    }
  }

  function applyDrops(world, drops) {
    world.drops = sanitizeDropEntries(drops).map((drop) => {
      const id = Number.isInteger(drop.id) ? drop.id : state.nextDropId++;
      if (id >= state.nextDropId) state.nextDropId = id + 1;
      return {
        id,
        itemId: drop.itemId,
        qty: drop.qty,
        x: drop.x,
        y: drop.y,
        ttl: Number.isFinite(drop.ttl) ? drop.ttl : DROP_DESPAWN.lifetime,
      };
    });
  }

  function getBiomeStoneRespawnDelay() {
    const min = Math.max(120, Number(BIOME_STONE_RESPAWN.min) || 600);
    const configuredMax = Number(BIOME_STONE_RESPAWN.max);
    const max = Number.isFinite(configuredMax) ? Math.max(min, configuredMax) : min;
    return min + Math.random() * (max - min);
  }

  function getRespawnDelayForTaskType(type) {
    if (type === "grass") return RESPAWN.grass;
    if (type === "ore") return RESPAWN.ore;
    if (type === "biomeStone") return getBiomeStoneRespawnDelay();
    return RESPAWN.rock;
  }

  function applyRespawnTasks(world, tasks) {
    world.respawnTasks = Array.isArray(tasks)
      ? tasks.map((task) => ({
          type: task.type,
          id: typeof task.id === "number" ? task.id : null,
          tx: Math.floor(Number(task.tx) || 0),
          ty: Math.floor(Number(task.ty) || 0),
          timer: typeof task.timer === "number"
            ? task.timer
            : getRespawnDelayForTaskType(task.type),
        }))
      : [];
  }

  function normalizeSurfaceResources(world) {
    if (!world || !Array.isArray(world.resources) || !Array.isArray(world.resourceGrid)) return;
    if (!Array.isArray(world.respawnTasks)) world.respawnTasks = [];

    for (const res of world.resources) {
      if (!res) continue;
      const idx = tileIndex(res.tx, res.ty, world.size);

      // Surface ore is disabled: convert any legacy/generated ore nodes into rock nodes.
      if (res.type === "ore") {
        const prevMax = Number(res.maxHp) > 0 ? res.maxHp : 5;
        const prevHp = typeof res.hp === "number" ? res.hp : prevMax;
        const ratio = clamp(prevHp / prevMax, 0, 1);
        res.type = "rock";
        res.maxHp = 4;
        res.hp = Math.max(1, Math.round(res.maxHp * ratio));
      }

      if (res.type === "tree" && res.stage && res.stage !== "alive") {
        res.removed = false;
        world.resourceGrid[idx] = res.id;
      } else if (res.removed) {
        world.resourceGrid[idx] = -1;
      } else {
        world.resourceGrid[idx] = res.id;
      }

      // Rebalance legacy worlds so upgraded tools do not one-tap trees.
      if (res.type === "tree") {
        const tileBiome = getSurfaceBiomeAtTile(world, res.tx, res.ty);
        const targetTreeHp = getBiomeTreeMaxHp(tileBiome);
        if (!Number.isFinite(res.maxHp) || res.maxHp < targetTreeHp) {
          const prevMax = Number.isFinite(res.maxHp) && res.maxHp > 0 ? res.maxHp : 3;
          const prevHp = Number.isFinite(res.hp) ? res.hp : prevMax;
          const ratio = clamp(prevHp / prevMax, 0, 1);
          res.maxHp = targetTreeHp;
          res.hp = Math.max(1, Math.round(targetTreeHp * ratio));
        }
        const targetDropQty = getBiomeTreeDropQty(tileBiome);
        const currentDropQty = Math.floor(Number(res.dropQty) || 1);
        if (targetDropQty > 1) {
          if (currentDropQty < targetDropQty) {
            res.dropQty = targetDropQty;
          }
        } else if (currentDropQty <= 1 && "dropQty" in res) {
          delete res.dropQty;
        }
      }

      if (res.type === "grass") {
        const tileBiome = getSurfaceBiomeAtTile(world, res.tx, res.ty);
        const targetDropQty = getBiomeGrassDropQty(tileBiome);
        const currentDropQty = Math.floor(Number(res.dropQty) || 1);
        if (targetDropQty > 1) {
          if (currentDropQty < targetDropQty) {
            res.dropQty = targetDropQty;
          }
        } else if (currentDropQty <= 1 && "dropQty" in res) {
          delete res.dropQty;
        }
      }

      if (res.type === "rock" && res.removed) {
        const hasTask = world.respawnTasks.some((task) => task?.type === "rock" && task.id === res.id);
        if (!hasTask) {
          world.respawnTasks.push({
            type: "rock",
            id: res.id,
            tx: res.tx,
            ty: res.ty,
            timer: RESPAWN.rock,
          });
        }
      }

      if (res.type === "grass" && res.removed) {
        const hasTask = world.respawnTasks.some((task) => task?.type === "grass" && task.id === res.id);
        if (!hasTask) {
          world.respawnTasks.push({
            type: "grass",
            id: res.id,
            tx: res.tx,
            ty: res.ty,
            timer: RESPAWN.grass,
          });
        }
      }

      if (res.type === "biomeStone" && res.removed) {
        queueBiomeStoneRespawnTask(world, res);
      }
    }

    ensureMinimumBiomeStonePerBiome(world);
  }

  function isValidEntityLandTile(world, tx, ty) {
    if (!world || !inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    return world.tiles[idx] === 1;
  }

  function findNearestEntityLandTile(world, startTx, startTy, maxRadius = 18) {
    if (!world || !Number.isFinite(startTx) || !Number.isFinite(startTy)) return null;
    const baseTx = Math.floor(startTx);
    const baseTy = Math.floor(startTy);
    if (isValidEntityLandTile(world, baseTx, baseTy)) {
      return { tx: baseTx, ty: baseTy };
    }
    for (let radius = 1; radius <= maxRadius; radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
          const tx = baseTx + dx;
          const ty = baseTy + dy;
          if (!isValidEntityLandTile(world, tx, ty)) continue;
          return { tx, ty };
        }
      }
    }
    return null;
  }

  function clampEntityPositionToLand(world, x, y, maxRadius = 18) {
    if (!world || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    const tx = Math.floor(x / CONFIG.tileSize);
    const ty = Math.floor(y / CONFIG.tileSize);
    if (isValidEntityLandTile(world, tx, ty)) {
      return { tx, ty, x, y };
    }
    const tile = findNearestEntityLandTile(world, tx, ty, maxRadius);
    if (!tile) return null;
    return {
      tx: tile.tx,
      ty: tile.ty,
      x: (tile.tx + 0.5) * CONFIG.tileSize,
      y: (tile.ty + 0.5) * CONFIG.tileSize,
    };
  }

  function findNearestWalkableTileInWorld(world, startTx, startTy, maxRadius = 18) {
    if (!world || !Number.isFinite(startTx) || !Number.isFinite(startTy)) return null;
    const baseTx = Math.floor(startTx);
    const baseTy = Math.floor(startTy);
    if (isWalkableTileInWorld(world, baseTx, baseTy)) {
      return { tx: baseTx, ty: baseTy };
    }
    for (let radius = 1; radius <= maxRadius; radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
          const tx = baseTx + dx;
          const ty = baseTy + dy;
          if (!isWalkableTileInWorld(world, tx, ty)) continue;
          return { tx, ty };
        }
      }
    }
    return null;
  }

  function clampEntityPositionToWalkable(world, x, y, maxRadius = 18) {
    if (!world || !Number.isFinite(x) || !Number.isFinite(y)) return null;
    const tx = Math.floor(x / CONFIG.tileSize);
    const ty = Math.floor(y / CONFIG.tileSize);
    if (isWalkableTileInWorld(world, tx, ty)) {
      return { tx, ty, x, y };
    }
    const tile = findNearestWalkableTileInWorld(world, tx, ty, maxRadius);
    if (!tile) return null;
    return {
      tx: tile.tx,
      ty: tile.ty,
      x: (tile.tx + 0.5) * CONFIG.tileSize,
      y: (tile.ty + 0.5) * CONFIG.tileSize,
    };
  }

  function applyAnimals(world, animals) {
    const prevAnimals = new Map(
      Array.isArray(world.animals) ? world.animals.map((animal) => [animal.id, animal]) : []
    );
    let autoId = Number.isInteger(world.nextAnimalId) && world.nextAnimalId > 0
      ? world.nextAnimalId
      : 1;
    world.animals = Array.isArray(animals)
      ? animals
        .map((animal) => {
          const cfg = getAnimalTypeConfig(animal?.type);
          const type = cfg.type;
          const sourceX = Number.isFinite(animal?.x) ? animal.x : 0;
          const sourceY = Number.isFinite(animal?.y) ? animal.y : 0;
          const pos = clampEntityPositionToLand(world, sourceX, sourceY, 22);
          if (!pos) return null;
          const id = typeof animal.id === "number" ? animal.id : autoId++;
          const prev = prevAnimals.get(id);
          return {
            id,
            type,
            x: pos.x,
            y: pos.y,
            hp: typeof animal.hp === "number" ? animal.hp : cfg.hp,
            maxHp: typeof animal.maxHp === "number" ? animal.maxHp : cfg.hp,
            speed: typeof animal.speed === "number" ? animal.speed : cfg.speed,
            color: animal.color || cfg.color,
            drop: cfg.drop,
            hitTimer: 0,
            fleeTimer: 0,
            wanderTimer: 0,
            dir: { x: 0, y: 0 },
            renderX: prev?.renderX ?? pos.x,
            renderY: prev?.renderY ?? pos.y,
          };
        })
        .filter(Boolean)
      : [];
    world.nextAnimalId = world.animals.reduce((max, animal) => Math.max(max, animal.id + 1), autoId);
  }

  function applyVillagers(world, villagers) {
    const prevVillagers = new Map(
      Array.isArray(world.villagers) ? world.villagers.map((villager) => [villager.id, villager]) : []
    );
    let autoId = Number.isInteger(world.nextVillagerId) && world.nextVillagerId > 0
      ? world.nextVillagerId
      : 1;
    world.villagers = Array.isArray(villagers)
      ? villagers
        .map((villager) => {
          const baseId = typeof villager?.id === "number" ? villager.id : autoId++;
          const sourceX = Number.isFinite(villager?.x) ? villager.x : 0;
          const sourceY = Number.isFinite(villager?.y) ? villager.y : 0;
          const pos = clampEntityPositionToLand(world, sourceX, sourceY, 24);
          if (!pos) return null;
          const x = pos.x;
          const y = pos.y;
          const prev = prevVillagers.get(baseId);
          const speed = clamp(
            Number(villager?.speed) || ((VILLAGER_CONFIG.speedMin + VILLAGER_CONFIG.speedMax) * 0.5),
            VILLAGER_CONFIG.speedMin,
            VILLAGER_CONFIG.speedMax
          );
          const wanderRadius = clamp(
            Number(villager?.wanderRadius) || (VILLAGER_CONFIG.wanderRadiusTiles * CONFIG.tileSize),
            CONFIG.tileSize * 4,
            CONFIG.tileSize * 12
          );
          return {
            id: baseId,
            x,
            y,
            homeX: Number.isFinite(villager?.homeX) ? villager.homeX : x,
            homeY: Number.isFinite(villager?.homeY) ? villager.homeY : y,
            speed,
            color: villager?.color || VILLAGER_COLORS[baseId % VILLAGER_COLORS.length],
            wanderRadius,
            wanderTimer: 0,
            dir: { x: 0, y: 0 },
            renderX: prev?.renderX ?? x,
            renderY: prev?.renderY ?? y,
          };
        })
        .filter(Boolean)
      : [];
    world.nextVillagerId = world.villagers.reduce((max, villager) => Math.max(max, villager.id + 1), 1);
  }

  function bridgeTouchesLand(world, tx, ty) {
    if (!world) return false;
    const neighbors = [
      { tx: tx - 1, ty },
      { tx: tx + 1, ty },
      { tx, ty: ty - 1 },
      { tx, ty: ty + 1 },
    ];
    for (const next of neighbors) {
      if (!inBounds(next.tx, next.ty, world.size)) continue;
      const idx = tileIndex(next.tx, next.ty, world.size);
      if (world.tiles[idx] === 1) return true;
    }
    return false;
  }

  function getAnchoredBridgeNetwork(world, bridgeSet) {
    const anchored = new Set();
    if (!world || !(bridgeSet instanceof Set) || bridgeSet.size === 0) return anchored;
    const queue = [];
    for (const key of bridgeSet) {
      const [sx, sy] = String(key).split(",");
      const tx = Number(sx);
      const ty = Number(sy);
      if (!Number.isFinite(tx) || !Number.isFinite(ty)) continue;
      if (!bridgeTouchesLand(world, tx, ty)) continue;
      anchored.add(key);
      queue.push({ tx, ty });
    }
    let cursor = 0;
    while (cursor < queue.length) {
      const node = queue[cursor++];
      const neighbors = [
        { tx: node.tx - 1, ty: node.ty },
        { tx: node.tx + 1, ty: node.ty },
        { tx: node.tx, ty: node.ty - 1 },
        { tx: node.tx, ty: node.ty + 1 },
      ];
      for (const next of neighbors) {
        const nextKey = `${next.tx},${next.ty}`;
        if (!bridgeSet.has(nextKey) || anchored.has(nextKey)) continue;
        anchored.add(nextKey);
        queue.push(next);
      }
    }
    return anchored;
  }

  function isWaterStructureType(type) {
    return type === "bridge"
      || type === "dock"
      || type === "shipwreck"
      || type === "abandoned_ship";
  }

  function canUseWaterStructureFootprint(world, type, tx, ty, options = {}) {
    const { ignoreStructureId = null } = options;
    if (!world) return false;
    const footprint = getStructureFootprint(type);
    for (let oy = 0; oy < footprint.h; oy += 1) {
      for (let ox = 0; ox < footprint.w; ox += 1) {
        const fx = tx + ox;
        const fy = ty + oy;
        if (!inBounds(fx, fy, world.size)) return false;
        const idx = tileIndex(fx, fy, world.size);
        if (world.tiles[idx] !== 0) return false;
        const occupied = getStructureAt(fx, fy);
        if (occupied && !occupied.removed && occupied.id !== ignoreStructureId) return false;
      }
    }
    return true;
  }

  function isStructureValidOnLoad(world, entry, bridgeSet, anchoredBridgeSet = null) {
    if (!entry || !inBounds(entry.tx, entry.ty, world.size)) return false;
    if (REMOVED_STRUCTURE_TYPES.has(entry.type)) return false;
    const idx = tileIndex(entry.tx, entry.ty, world.size);
    const baseLand = world.tiles[idx] === 1;

    if (isWaterStructureType(entry.type)) {
      if (baseLand) return false;
      if (entry.type === "bridge" || entry.type === "dock") {
        const key = `${entry.tx},${entry.ty}`;
        if (anchoredBridgeSet instanceof Set && !anchoredBridgeSet.has(key)) {
          return false;
        }
        if (bridgeTouchesLand(world, entry.tx, entry.ty)) return true;
        const toKey = (tx, ty) => `${tx},${ty}`;
        const left = inBounds(entry.tx - 1, entry.ty, world.size)
          && (world.tiles[tileIndex(entry.tx - 1, entry.ty, world.size)] === 1
            || bridgeSet?.has(toKey(entry.tx - 1, entry.ty)));
        const right = inBounds(entry.tx + 1, entry.ty, world.size)
          && (world.tiles[tileIndex(entry.tx + 1, entry.ty, world.size)] === 1
            || bridgeSet?.has(toKey(entry.tx + 1, entry.ty)));
        const up = inBounds(entry.tx, entry.ty - 1, world.size)
          && (world.tiles[tileIndex(entry.tx, entry.ty - 1, world.size)] === 1
            || bridgeSet?.has(toKey(entry.tx, entry.ty - 1)));
        const down = inBounds(entry.tx, entry.ty + 1, world.size)
          && (world.tiles[tileIndex(entry.tx, entry.ty + 1, world.size)] === 1
            || bridgeSet?.has(toKey(entry.tx, entry.ty + 1)));
        if (!(left || right || up || down)) return false;
      }
      return canUseWaterStructureFootprint(world, entry.type, entry.tx, entry.ty);
    }

    if (!baseLand) return false;
    const footprint = getStructureFootprint(entry.type);
    for (let oy = 0; oy < footprint.h; oy += 1) {
      for (let ox = 0; ox < footprint.w; ox += 1) {
        const tx = entry.tx + ox;
        const ty = entry.ty + oy;
        if (!inBounds(tx, ty, world.size)) return false;
        const tileIdx = tileIndex(tx, ty, world.size);
        if (world.tiles[tileIdx] !== 1) return false;
        if (getCaveAt(world, tx, ty)) return false;
        const occupied = getStructureAt(tx, ty);
        if (occupied && !occupied.removed) return false;
      }
    }
    if (entry.type === "beacon") {
      const idxBeach = tileIndex(entry.tx, entry.ty, world.size);
      if (!world.beachGrid?.[idxBeach]) return false;
    }
    return true;
  }

  function clearResourceForStructure(world, tx, ty) {
    const res = getResourceAt(world, tx, ty);
    if (res) {
      res.removed = true;
      const idx = tileIndex(tx, ty, world.size);
      world.resourceGrid[idx] = -1;
    }
  }

  function clearResourcesForFootprint(world, type, tx, ty) {
    forEachStructureFootprintTile(type, tx, ty, (fx, fy) => {
      clearResourceForStructure(world, fx, fy);
    });
  }

  function clearResourceTiles(world, clearTiles) {
    if (!Array.isArray(clearTiles) || clearTiles.length === 0) return;
    for (const tile of clearTiles) {
      clearResourceForStructure(world, tile.tx, tile.ty);
    }
  }

  function canUseStructureFootprint(world, type, tx, ty, options = {}) {
    const {
      ignoreStructureId = null,
      allowResourceClear = false,
    } = options;
    if (!world) return { ok: false, reason: "No world", clearResourceTiles: [] };
    const clearResourceTiles = [];
    let failReason = null;
    forEachStructureFootprintTile(type, tx, ty, (fx, fy) => {
      if (failReason) return;
      if (!inBounds(fx, fy, world.size)) {
        failReason = "Out of bounds";
        return;
      }
      const idx = tileIndex(fx, fy, world.size);
      if (world.tiles[idx] !== 1) {
        failReason = "Needs land";
        return;
      }
      if (world === state.surfaceWorld && getCaveAt(world, fx, fy)) {
        failReason = "Cave";
        return;
      }
      const occupied = getStructureAt(fx, fy);
      if (occupied && !occupied.removed && occupied.id !== ignoreStructureId) {
        failReason = "Occupied";
        return;
      }
      const res = getResourceAt(world, fx, fy);
      if (!res) return;
      if (allowResourceClear || (res.stage && res.stage !== "alive")) {
        clearResourceTiles.push({ tx: fx, ty: fy });
      } else {
        failReason = "Blocked";
      }
    });
    if (failReason) {
      return { ok: false, reason: failReason, clearResourceTiles: [] };
    }
    return { ok: true, reason: "", clearResourceTiles };
  }

  function setActiveSlot(index) {
    activeSlot = clamp(index, 0, HOTBAR_SIZE - 1);
    updateAllSlotUI();
  }

  function getPlayerToolLabel(player) {
    ensurePlayerProgress(player);
    const pickTier = getPickaxeTier(player);
    const entry = PICKAXE_TIER_DATA[pickTier] || PICKAXE_TIER_DATA[0];
    return entry.name;
  }

  function updateToolDisplay() {
    if (!state.player) return;
    const pickaxeLabel = getPlayerToolLabel(state.player);
    const swordTier = getSwordTier(state.player);
    const swordLabel = SWORD_TIER_DATA[swordTier]?.name || "No Sword";
    toolDisplay.textContent = `Tool: ${pickaxeLabel} | ${swordLabel}`;
  }

  function updateHealthUI() {
    if (!state.player) return;
    ensurePlayerStatusEffects(state.player);
    const pct = clamp(state.player.hp / state.player.maxHp, 0, 1);
    healthFill.style.width = `${Math.round(pct * 100)}%`;
    const poisoned = state.player.poisonTimer > 0.01;
    healthFill.style.background = poisoned
      ? "linear-gradient(90deg, #42a84f, #98e46d)"
      : "linear-gradient(90deg, #e04b4b, #f3b16b)";
    healthFill.style.boxShadow = poisoned
      ? "inset 0 0 7px rgba(205, 255, 190, 0.35)"
      : "inset 0 0 6px rgba(255, 255, 255, 0.2)";
  }

  function updateTimeUI() {
    const label = state.isNight ? "Night" : "Day";
    timeDisplay.textContent = label;
    timeDisplay.style.background = state.isNight
      ? "rgba(40, 40, 80, 0.5)"
      : "rgba(40, 120, 80, 0.4)";
  }

  function isHouseType(type) {
    return type === "hut" || type === "small_house" || type === "medium_house" || type === "large_house";
  }

  function normalizeLegacyStructureType(type) {
    if (type === "hut") return "small_house";
    // Lanterns were removed; fold old saves/snapshots into campfires.
    if (type === "lantern") return "campfire";
    return type;
  }

  function getStructureFootprint(type) {
    if (type === "medium_house") return { w: 2, h: 1 };
    if (type === "large_house") return { w: 2, h: 2 };
    if (type === "shipwreck") return { w: 2, h: 2 };
    if (type === "abandoned_ship") return ABANDONED_SHIP_CONFIG.footprint;
    return { w: 1, h: 1 };
  }

  function forEachStructureFootprintTile(type, tx, ty, callback) {
    const footprint = getStructureFootprint(type);
    for (let oy = 0; oy < footprint.h; oy += 1) {
      for (let ox = 0; ox < footprint.w; ox += 1) {
        callback(tx + ox, ty + oy, ox, oy, footprint);
      }
    }
  }

  function getStructureCenterWorld(structure) {
    if (structure?.type === "robot") {
      const robotPos = getRobotDisplayPosition(structure, false);
      if (robotPos) return robotPos;
    }
    if (structure?.type === "abandoned_ship") {
      const shipPos = getAbandonedShipDisplayPosition(structure, false);
      if (shipPos) return { x: shipPos.x, y: shipPos.y };
    }
    const footprint = getStructureFootprint(structure?.type);
    return {
      x: (structure.tx + footprint.w * 0.5) * CONFIG.tileSize,
      y: (structure.ty + footprint.h * 0.5) * CONFIG.tileSize,
    };
  }

  function getHouseTier(type) {
    if (type === "hut") return HOUSE_TIERS.small_house;
    return HOUSE_TIERS[type] || HOUSE_TIERS.small_house;
  }

  function createHouseMeta(type) {
    const tier = getHouseTier(type);
    return {
      house: {
        tier: tier.key,
        width: tier.width,
        height: tier.height,
        items: [],
      },
    };
  }

  function ensureHouseMeta(structure) {
    if (!structure || !isHouseType(structure.type)) return;
    const tier = getHouseTier(structure.type);
    if (!structure.meta) {
      structure.meta = {};
    }
    if (!structure.meta.house) {
      structure.meta.house = createHouseMeta(structure.type).house;
      return;
    }
    if (!Array.isArray(structure.meta.house.items)) structure.meta.house.items = [];
    structure.meta.house.tier = tier.key;
    const prevWidth = Number(structure.meta.house.width) || tier.width;
    const prevHeight = Number(structure.meta.house.height) || tier.height;
    if (prevWidth !== tier.width || prevHeight !== tier.height) {
      const shiftX = Math.floor((tier.width - prevWidth) * 0.5);
      const shiftY = Math.floor((tier.height - prevHeight) * 0.5);
      for (const item of structure.meta.house.items) {
        item.tx = clamp((item.tx ?? 0) + shiftX, 0, tier.width - 1);
        item.ty = clamp((item.ty ?? 0) + shiftY, 0, tier.height - 1);
      }
    }
    structure.meta.house.width = tier.width;
    structure.meta.house.height = tier.height;
    for (const item of structure.meta.house.items) {
      if (!item || typeof item !== "object") continue;
      item.type = normalizeLegacyStructureType(item.type);
      if (item.type === "chest") {
        item.storage = sanitizeInventorySlots(item.storage, CHEST_SIZE);
      } else {
        item.storage = null;
      }
    }
  }

  function getHouseInterior(structure) {
    if (!structure) return null;
    ensureHouseMeta(structure);
    return structure.meta?.house ?? null;
  }

  function normalizeRobotMode(mode) {
    if (mode === ROBOT_MODE.trees || mode === ROBOT_MODE.stone || mode === ROBOT_MODE.grass) {
      return mode;
    }
    // Backward compatibility with older saves/snapshots.
    if (mode === "stone_grass") return ROBOT_MODE.stone;
    return null;
  }

  function isRobotMode(mode) {
    return normalizeRobotMode(mode) !== null;
  }

  function createRobotMeta(tx, ty) {
    return {
      robot: {
        homeTx: tx,
        homeTy: ty,
        x: (tx + 0.5) * CONFIG.tileSize,
        y: (ty + 0.5) * CONFIG.tileSize,
        discovered: true,
        mode: null,
        manualStop: false,
        state: "idle",
        targetResourceId: null,
        mineTimer: 0,
        retargetTimer: 0,
        pauseTimer: 0,
        recallActive: false,
        recallBenchTx: null,
        recallBenchTy: null,
      },
    };
  }

  function ensureRobotMeta(structure) {
    if (!structure || structure.type !== "robot") return null;
    if (!structure.meta || typeof structure.meta !== "object") {
      structure.meta = createRobotMeta(structure.tx, structure.ty);
    }
    if (!structure.meta.robot || typeof structure.meta.robot !== "object") {
      structure.meta.robot = createRobotMeta(structure.tx, structure.ty).robot;
    }
    const robot = structure.meta.robot;
    if (!Number.isFinite(robot.homeTx)) robot.homeTx = structure.tx;
    if (!Number.isFinite(robot.homeTy)) robot.homeTy = structure.ty;
    if (!Number.isFinite(robot.x)) robot.x = (robot.homeTx + 0.5) * CONFIG.tileSize;
    if (!Number.isFinite(robot.y)) robot.y = (robot.homeTy + 0.5) * CONFIG.tileSize;
    if (!Number.isFinite(robot.renderX)) robot.renderX = robot.x;
    if (!Number.isFinite(robot.renderY)) robot.renderY = robot.y;
    if (typeof robot.discovered !== "boolean") {
      robot.discovered = !structure.meta?.wildSpawn;
    } else {
      robot.discovered = !!robot.discovered;
    }
    robot.mode = normalizeRobotMode(robot.mode);
    robot.manualStop = !!robot.manualStop;
    if (typeof robot.state !== "string") robot.state = "idle";
    if (!Number.isFinite(robot.mineTimer)) robot.mineTimer = 0;
    if (!Number.isFinite(robot.retargetTimer)) robot.retargetTimer = 0;
    if (!Number.isFinite(robot.pauseTimer)) robot.pauseTimer = 0;
    robot.recallActive = !!robot.recallActive;
    if (!Number.isInteger(robot.recallBenchTx)) robot.recallBenchTx = null;
    if (!Number.isInteger(robot.recallBenchTy)) robot.recallBenchTy = null;
    if (!Number.isInteger(robot.targetResourceId)) robot.targetResourceId = null;
    structure.storage = sanitizeInventorySlots(structure.storage, ROBOT_STORAGE_SIZE);
    return robot;
  }

  function setRobotDiscovered(structure, discovered = true) {
    const robot = ensureRobotMeta(structure);
    if (!robot) return false;
    const nextValue = !!discovered;
    if (robot.discovered === nextValue) return false;
    robot.discovered = nextValue;
    return true;
  }

  function getRobotPosition(structure) {
    const robot = ensureRobotMeta(structure);
    if (!robot) return null;
    return { x: robot.x, y: robot.y };
  }

  function getRobotVisualOffset(structure, tileSourceX = null, tileSourceY = null) {
    if (!structure || structure.type !== "robot" || !Array.isArray(state.structures)) {
      return { x: 0, y: 0 };
    }
    const robot = ensureRobotMeta(structure);
    if (!robot) return { x: 0, y: 0 };
    const anchorX = Number.isFinite(tileSourceX) ? tileSourceX : robot.x;
    const anchorY = Number.isFinite(tileSourceY) ? tileSourceY : robot.y;
    if (!Number.isFinite(anchorX) || !Number.isFinite(anchorY)) {
      return { x: 0, y: 0 };
    }
    const tileTx = Math.floor(anchorX / CONFIG.tileSize);
    const tileTy = Math.floor(anchorY / CONFIG.tileSize);
    const stackedIds = [];
    for (const candidate of state.structures) {
      if (!candidate || candidate.removed || candidate.type !== "robot") continue;
      const candidateRobot = ensureRobotMeta(candidate);
      if (!candidateRobot) continue;
      const candidateTx = Math.floor(candidateRobot.x / CONFIG.tileSize);
      const candidateTy = Math.floor(candidateRobot.y / CONFIG.tileSize);
      if (candidateTx !== tileTx || candidateTy !== tileTy) continue;
      stackedIds.push(candidate.id);
    }
    if (stackedIds.length <= 1) return { x: 0, y: 0 };
    stackedIds.sort((a, b) => a - b);
    const slot = stackedIds.indexOf(structure.id);
    if (slot < 0) return { x: 0, y: 0 };

    const spread = Math.min(CONFIG.tileSize * 0.28, 7 + Math.ceil(Math.min(stackedIds.length, 8) * 0.5));
    const seed = ((tileTx * 73856093) ^ (tileTy * 19349663)) >>> 0;
    const baseAngle = (seed % 360) * (Math.PI / 180);
    const angle = stackedIds.length === 2
      ? (baseAngle + (slot === 0 ? Math.PI * 0.25 : Math.PI * 1.25))
      : (baseAngle + (slot * (Math.PI * 2 / stackedIds.length)));

    return {
      x: Math.cos(angle) * spread,
      y: Math.sin(angle) * spread,
    };
  }

  function getRobotDisplayPosition(structure, useRenderPosition = false) {
    const robot = ensureRobotMeta(structure);
    if (!robot) return null;
    const baseX = useRenderPosition && Number.isFinite(robot.renderX) ? robot.renderX : robot.x;
    const baseY = useRenderPosition && Number.isFinite(robot.renderY) ? robot.renderY : robot.y;
    const offset = getRobotVisualOffset(structure, robot.x, robot.y);
    return {
      x: baseX + offset.x,
      y: baseY + offset.y,
    };
  }

  function setRobotInteractionPause(structure, duration = ROBOT_CONFIG.interactionPause) {
    const robot = ensureRobotMeta(structure);
    if (!robot) return;
    robot.pauseTimer = Math.max(robot.pauseTimer || 0, duration);
  }

  function getLocalShipPlayerId() {
    return net.playerId || "local";
  }

  function normalizeAngleRadians(angle) {
    if (!Number.isFinite(angle)) return 0;
    let wrapped = angle % (Math.PI * 2);
    if (wrapped > Math.PI) wrapped -= Math.PI * 2;
    if (wrapped < -Math.PI) wrapped += Math.PI * 2;
    return wrapped;
  }

  function getAbandonedShipSeatOffsets() {
    const seatA = CONFIG.tileSize * 0.32;
    const seatB = CONFIG.tileSize * 0.68;
    return [
      { x: -seatA, y: -seatA * 0.45 },
      { x: seatA * 0.1, y: -seatA * 0.45 },
      { x: seatB, y: -seatA * 0.45 },
      { x: -seatA * 0.5, y: seatA * 0.52 },
      { x: seatA * 0.52, y: seatA * 0.52 },
    ].slice(0, ABANDONED_SHIP_CONFIG.maxPassengers);
  }

  function createAbandonedShipMeta(tx, ty) {
    const footprint = getStructureFootprint("abandoned_ship");
    const centerX = (tx + footprint.w * 0.5) * CONFIG.tileSize;
    const centerY = (ty + footprint.h * 0.5) * CONFIG.tileSize;
    return {
      ship: {
        x: centerX,
        y: centerY,
        renderX: centerX,
        renderY: centerY,
        angle: 0,
        renderAngle: 0,
        vx: 0,
        vy: 0,
        repaired: false,
        damage: 0,
        driverId: null,
        seats: Array.from({ length: ABANDONED_SHIP_CONFIG.maxPassengers }, () => null),
        driverInputX: 0,
        driverInputY: 0,
        controlAge: 0,
      },
    };
  }

  function ensureAbandonedShipMeta(structure) {
    if (!structure || structure.type !== "abandoned_ship") return null;
    if (!structure.meta || typeof structure.meta !== "object") {
      structure.meta = createAbandonedShipMeta(structure.tx, structure.ty);
    }
    if (!structure.meta.ship || typeof structure.meta.ship !== "object") {
      structure.meta.ship = createAbandonedShipMeta(structure.tx, structure.ty).ship;
    }
    const ship = structure.meta.ship;
    const footprint = getStructureFootprint("abandoned_ship");
    const defaultX = (structure.tx + footprint.w * 0.5) * CONFIG.tileSize;
    const defaultY = (structure.ty + footprint.h * 0.5) * CONFIG.tileSize;
    if (!Number.isFinite(ship.x)) ship.x = defaultX;
    if (!Number.isFinite(ship.y)) ship.y = defaultY;
    if (!Number.isFinite(ship.renderX)) ship.renderX = ship.x;
    if (!Number.isFinite(ship.renderY)) ship.renderY = ship.y;
    ship.angle = normalizeAngleRadians(ship.angle);
    ship.renderAngle = normalizeAngleRadians(
      Number.isFinite(ship.renderAngle) ? ship.renderAngle : ship.angle
    );
    ship.vx = Number.isFinite(ship.vx) ? ship.vx : 0;
    ship.vy = Number.isFinite(ship.vy) ? ship.vy : 0;
    ship.repaired = !!ship.repaired;
    ship.damage = clamp(Number(ship.damage) || 0, 0, 100);
    ship.driverInputX = clamp(Number(ship.driverInputX) || 0, -1, 1);
    ship.driverInputY = clamp(Number(ship.driverInputY) || 0, -1, 1);
    ship.controlAge = Math.max(0, Number(ship.controlAge) || 0);
    const maxSeats = ABANDONED_SHIP_CONFIG.maxPassengers;
    const seats = Array.from({ length: maxSeats }, (_, index) => {
      const value = Array.isArray(ship.seats) ? ship.seats[index] : null;
      return typeof value === "string" && value.length > 0 ? value : null;
    });
    ship.seats = seats;
    ship.driverId = typeof ship.driverId === "string" && ship.driverId.length > 0
      ? ship.driverId
      : null;
    if (ship.driverId && !ship.seats.includes(ship.driverId)) {
      ship.driverId = null;
    }
    if (!ship.driverId) {
      ship.driverId = ship.seats.find((id) => typeof id === "string") || null;
    }
    return ship;
  }

  function getAbandonedShipDisplayPosition(structure, useRenderPosition = false) {
    const ship = ensureAbandonedShipMeta(structure);
    if (!ship) return null;
    return {
      x: useRenderPosition && Number.isFinite(ship.renderX) ? ship.renderX : ship.x,
      y: useRenderPosition && Number.isFinite(ship.renderY) ? ship.renderY : ship.y,
      angle: useRenderPosition && Number.isFinite(ship.renderAngle) ? ship.renderAngle : ship.angle,
    };
  }

  function isInventoryFull(inventory) {
    if (!Array.isArray(inventory) || inventory.length === 0) return true;
    for (const slot of inventory) {
      if (!slot.id) return false;
      if (slot.qty < MAX_STACK) return false;
    }
    return true;
  }

  function getRobotModeLabel(mode) {
    if (!isRobotMode(mode)) return "Unassigned";
    if (mode === ROBOT_MODE.stone) return "Mine Stone";
    if (mode === ROBOT_MODE.grass) return "Mine Grass";
    return "Mine Trees";
  }

  function getRobotStatusLabel(structure) {
    const robot = ensureRobotMeta(structure);
    if (!robot) return "Idle";
    if (robot.pauseTimer > 0) return "Paused (interacting)";
    if (robot.recallActive) {
      if (robot.state === "recalling") return "Heading to called bench";
      return "Holding at called bench";
    }
    if (robot.manualStop) {
      if (robot.state === "returning") return "Stopping (returning to spawn bench)";
      return "Stopped at spawn bench";
    }
    if (!isRobotMode(robot.mode)) return "Awaiting assignment";
    if (robot.state === "returning") return "Returning to base";
    if (robot.state === "waiting") return "Waiting (inventory full)";
    if (robot.state === "moving") return "Moving to target";
    if (robot.state === "mining") return `Mining (${getRobotModeLabel(robot.mode)})`;
    return "Idle";
  }

  function robotCanMineResource(robot, resource) {
    if (!robot || !resource || resource.removed) return false;
    if (resource.stage && resource.stage !== "alive") return false;
    if (robot.mode === ROBOT_MODE.trees) {
      return resource.type === "tree";
    }
    if (robot.mode === ROBOT_MODE.stone) return resource.type === "rock";
    if (robot.mode === ROBOT_MODE.grass) return resource.type === "grass";
    return false;
  }

  function getHouseKey(structure) {
    if (!structure) return null;
    return `${structure.tx},${structure.ty}`;
  }

  function setStructureFootprintInGrid(structure, place) {
    if (!structure || !state.structureGrid) return;
    const size = state.surfaceWorld?.size ?? state.world.size;
    forEachStructureFootprintTile(structure.type, structure.tx, structure.ty, (tx, ty) => {
      if (!inBounds(tx, ty, size)) return;
      const idx = tileIndex(tx, ty, size);
      if (place) {
        state.structureGrid[idx] = structure.id;
      } else if (state.structureGrid[idx] === structure.id) {
        state.structureGrid[idx] = null;
      }
    });
  }

  function addStructure(type, tx, ty, options = {}) {
    const structure = {
      id: state.structures.length,
      type,
      tx,
      ty,
      removed: false,
      pending: !!options.pending,
      storage: options.storage || null,
      meta: options.meta || null,
    };
    if (isHouseType(type)) {
      ensureHouseMeta(structure);
    }
    if (type === "robot") {
      ensureRobotMeta(structure);
    }
    if (type === "abandoned_ship") {
      ensureAbandonedShipMeta(structure);
    }
    if (type === "shipwreck") {
      structure.storage = sanitizeInventorySlots(
        structure.storage,
        SHIPWRECK_STORAGE_SIZE
      );
    }
    state.structures.push(structure);
    setStructureFootprintInGrid(structure, true);
    return structure;
  }

  function getStructureAt(tx, ty) {
    if (!state.structureGrid) return null;
    const size = state.surfaceWorld?.size ?? state.world.size;
    if (!inBounds(tx, ty, size)) return null;
    const idx = tileIndex(tx, ty, size);
    const structureId = state.structureGrid[idx];
    if (structureId === null || structureId === undefined) return null;
    const structure = state.structures[structureId];
    if (!structure || structure.removed) return null;
    return structure;
  }

  function getResourceAt(world, tx, ty) {
    if (!world || !world.resourceGrid) return null;
    if (!inBounds(tx, ty, world.size)) return null;
    const idx = tileIndex(tx, ty, world.size);
    const resId = world.resourceGrid[idx];
    if (resId === -1 || resId === null || resId === undefined) return null;
    const res = world.resources[resId];
    if (!res || res.removed) return null;
    return res;
  }

  function removeStructure(structure) {
    if (!structure || structure.removed) return;
    structure.removed = true;
    setStructureFootprintInGrid(structure, false);
  }

  function findBenchSpot(world, spawn) {
    for (let radius = 1; radius < 6; radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const tx = spawn.x + dx;
          const ty = spawn.y + dy;
          if (!inBounds(tx, ty, world.size)) continue;
          const idx = tileIndex(tx, ty, world.size);
          if (!world.tiles[idx]) continue;
          if (world.resourceGrid[idx] !== -1) continue;
          if (getCaveAt(world, tx, ty)) continue;
          return { tx, ty };
        }
      }
    }
    return { tx: spawn.x, ty: spawn.y };
  }

  function canPlaceVillageTile(world, tx, ty) {
    if (!world || !inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    if (!world.tiles[idx]) return false;
    if (world.beachGrid?.[idx]) return false;
    if (getCaveAt(world, tx, ty)) return false;
    const structure = getStructureAt(tx, ty);
    if (structure && !structure.removed) return false;
    return true;
  }

  function randomLootEntry(rng) {
    const total = VILLAGE_LOOT_TABLE.reduce((sum, entry) => sum + entry.weight, 0);
    let roll = rng() * total;
    for (const entry of VILLAGE_LOOT_TABLE) {
      roll -= entry.weight;
      if (roll <= 0) return entry;
    }
    return VILLAGE_LOOT_TABLE[0];
  }

  function fillVillageChest(storage, rng) {
    if (!Array.isArray(storage)) return;
    for (const slot of storage) {
      slot.id = null;
      slot.qty = 0;
    }
    const picks = 2 + Math.floor(rng() * 3);
    for (let i = 0; i < picks; i += 1) {
      const loot = randomLootEntry(rng);
      const qty = loot.min + Math.floor(rng() * (loot.max - loot.min + 1));
      addItem(storage, loot.id, qty);
    }
  }

  function buildVillageStructureMeta(spawnedByPlayer = false) {
    if (spawnedByPlayer) return { village: true, spawnedByPlayer: true };
    return { village: true };
  }

  function addVillageHouse(world, tx, ty, type, rng, withChest, withBed, spawnedByPlayer = false) {
    const footprintCheck = canUseStructureFootprint(world, type, tx, ty, { allowResourceClear: true });
    if (!footprintCheck.ok) return null;
    let villageTilesValid = true;
    forEachStructureFootprintTile(type, tx, ty, (fx, fy) => {
      if (!villageTilesValid) return;
      if (!canPlaceVillageTile(world, fx, fy)) villageTilesValid = false;
    });
    if (!villageTilesValid) return null;
    clearResourceTiles(world, footprintCheck.clearResourceTiles);
    const house = addStructure(type, tx, ty, { meta: buildVillageStructureMeta(spawnedByPlayer) });
    if (!house) return null;
    ensureHouseMeta(house);
    const interior = getHouseInterior(house);
    if (!interior) return house;
    if (withBed) {
      const bedTx = clamp(Math.floor(interior.width * 0.22), 0, interior.width - 1);
      const bedTy = clamp(Math.floor(interior.height * 0.22), 0, interior.height - 1);
      addInteriorStructure(house, "bed", bedTx, bedTy);
    }
    if (withChest) {
      const chest = addInteriorStructure(house, "chest", Math.max(0, interior.width - 2), 1);
      if (chest?.storage) {
        fillVillageChest(chest.storage, rng);
      }
    }
    if (rng() < 0.6) {
      addInteriorStructure(
        house,
        "campfire",
        Math.max(0, Math.floor(interior.width / 2)),
        Math.max(0, Math.floor(interior.height / 2) - 1)
      );
    }
    return house;
  }

  function placeVillagePath(world, tx, ty, spawnedByPlayer = false) {
    if (!canPlaceVillageTile(world, tx, ty)) return false;
    if (getStructureAt(tx, ty)) return false;
    clearResourceForStructure(world, tx, ty);
    addStructure("village_path", tx, ty, { meta: buildVillageStructureMeta(spawnedByPlayer) });
    return true;
  }

  function canVillageVillagerUseTile(world, tx, ty) {
    if (!world || !inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    if (world.tiles[idx] !== 1) return false;
    if (world.beachGrid?.[idx]) return false;
    if (getCaveAt(world, tx, ty)) return false;
    const structure = getStructureAt(tx, ty);
    if (!structure || structure.removed) return true;
    const def = STRUCTURE_DEFS[structure.type];
    if (def?.blocking) return false;
    return true;
  }

  function spawnVillageVillager(world, tx, ty, homeTx, homeTy, rng = Math.random) {
    if (!canVillageVillagerUseTile(world, tx, ty)) return null;
    if (!Array.isArray(world.villagers)) world.villagers = [];
    if (!Number.isInteger(world.nextVillagerId) || world.nextVillagerId < 1) world.nextVillagerId = 1;
    const id = world.nextVillagerId++;
    const x = (tx + 0.5) * CONFIG.tileSize;
    const y = (ty + 0.5) * CONFIG.tileSize;
    const baseRadius = VILLAGER_CONFIG.wanderRadiusTiles * CONFIG.tileSize;
    const speed = VILLAGER_CONFIG.speedMin + rng() * (VILLAGER_CONFIG.speedMax - VILLAGER_CONFIG.speedMin);
    const villager = {
      id,
      x,
      y,
      homeX: (homeTx + 0.5) * CONFIG.tileSize,
      homeY: (homeTy + 0.5) * CONFIG.tileSize,
      speed,
      color: VILLAGER_COLORS[id % VILLAGER_COLORS.length],
      wanderRadius: clamp(baseRadius * (0.82 + rng() * 0.34), CONFIG.tileSize * 4, CONFIG.tileSize * 12),
      wanderTimer: VILLAGER_CONFIG.wanderResetMin + rng() * (VILLAGER_CONFIG.wanderResetMax - VILLAGER_CONFIG.wanderResetMin),
      dir: { x: 0, y: 0 },
      renderX: x,
      renderY: y,
    };
    const angle = rng() * Math.PI * 2;
    villager.dir.x = Math.cos(angle);
    villager.dir.y = Math.sin(angle);
    world.villagers.push(villager);
    return villager;
  }

  function spawnVillageVillagers(world, centerTx, centerTy, houses = [], rng = Math.random) {
    if (!world) return 0;
    if (!Array.isArray(world.villagers)) world.villagers = [];
    if (!Number.isInteger(world.nextVillagerId) || world.nextVillagerId < 1) world.nextVillagerId = 1;

    const homeX = (centerTx + 0.5) * CONFIG.tileSize;
    const homeY = (centerTy + 0.5) * CONFIG.tileSize;
    const existingNearby = world.villagers.filter((villager) => {
      const hx = Number.isFinite(villager.homeX) ? villager.homeX : villager.x;
      const hy = Number.isFinite(villager.homeY) ? villager.homeY : villager.y;
      return Math.hypot(hx - homeX, hy - homeY) <= CONFIG.tileSize * 10;
    }).length;

    const houseCount = Array.isArray(houses) ? houses.length : 0;
    const desired = clamp(
      Math.floor(2 + houseCount * 0.7 + rng() * 2.1),
      VILLAGER_CONFIG.minPerVillage,
      VILLAGER_CONFIG.maxPerVillage
    );
    const need = Math.max(0, desired - existingNearby);
    if (need <= 0) return 0;

    const candidateSet = new Set();
    const pushCandidate = (tx, ty) => {
      if (!canVillageVillagerUseTile(world, tx, ty)) return;
      candidateSet.add(`${tx},${ty}`);
    };

    for (let dy = -8; dy <= 8; dy += 1) {
      for (let dx = -8; dx <= 8; dx += 1) {
        if (Math.hypot(dx, dy) > 8.5) continue;
        pushCandidate(centerTx + dx, centerTy + dy);
      }
    }
    for (const house of (houses || [])) {
      for (let dy = -4; dy <= 4; dy += 1) {
        for (let dx = -4; dx <= 4; dx += 1) {
          if (Math.hypot(dx, dy) > 4.5) continue;
          pushCandidate(house.tx + dx, house.ty + dy);
        }
      }
    }

    const candidates = Array.from(candidateSet)
      .map((key) => {
        const [sx, sy] = key.split(",");
        const tx = Number(sx);
        const ty = Number(sy);
        const structure = getStructureAt(tx, ty);
        const dist = Math.hypot(tx - centerTx, ty - centerTy);
        const score = (structure?.meta?.village ? 2.5 : 0) - dist * 0.07 + rng() * 0.5;
        return { tx, ty, score };
      })
      .sort((a, b) => b.score - a.score);

    let spawned = 0;
    const minSeparation = CONFIG.tileSize * 0.85;
    for (const candidate of candidates) {
      if (spawned >= need) break;
      const wx = (candidate.tx + 0.5) * CONFIG.tileSize;
      const wy = (candidate.ty + 0.5) * CONFIG.tileSize;
      const crowded = world.villagers.some((villager) => Math.hypot(villager.x - wx, villager.y - wy) < minSeparation);
      if (crowded) continue;
      const villager = spawnVillageVillager(world, candidate.tx, candidate.ty, centerTx, centerTy, rng);
      if (!villager) continue;
      spawned += 1;
    }
    return spawned;
  }

  function carveVillagePathLine(world, x0, y0, x1, y1, spawnedByPlayer = false) {
    let x = x0;
    let y = y0;
    const stepX = x1 > x0 ? 1 : -1;
    const stepY = y1 > y0 ? 1 : -1;
    while (x !== x1) {
      placeVillagePath(world, x, y, spawnedByPlayer);
      x += stepX;
    }
    while (y !== y1) {
      placeVillagePath(world, x, y, spawnedByPlayer);
      y += stepY;
    }
    placeVillagePath(world, x1, y1, spawnedByPlayer);
  }

  function spawnVillageAt(world, centerTx, centerTy, rng = Math.random, options = null) {
    if (!world) return { ok: false, reason: "No world" };
    if (!canPlaceVillageTile(world, centerTx, centerTy)) return { ok: false, reason: "Bad center" };
    const spawnedByPlayer = !!options?.spawnedByPlayer;
    const layouts = [
      [
        { dx: -4, dy: -1 }, { dx: -1, dy: -4 }, { dx: 3, dy: -3 },
        { dx: 5, dy: 0 }, { dx: 2, dy: 3 }, { dx: -3, dy: 4 },
      ],
      [
        { dx: -5, dy: 0 }, { dx: -2, dy: -3 }, { dx: 2, dy: -4 },
        { dx: 5, dy: -1 }, { dx: 4, dy: 3 }, { dx: -1, dy: 4 },
      ],
      [
        { dx: -4, dy: -3 }, { dx: 0, dy: -4 }, { dx: 4, dy: -2 },
        { dx: 5, dy: 2 }, { dx: 1, dy: 4 }, { dx: -4, dy: 3 },
      ],
      [
        { dx: -3, dy: -1 }, { dx: 0, dy: -3 }, { dx: 3, dy: -1 },
        { dx: 2, dy: 2 }, { dx: -2, dy: 2 },
      ],
      [
        { dx: -2, dy: -2 }, { dx: 2, dy: -2 }, { dx: 3, dy: 1 },
        { dx: 0, dy: 3 }, { dx: -3, dy: 1 },
      ],
    ];
    const layout = layouts[Math.floor(rng() * layouts.length)];
    const houses = [];

    for (let i = 0; i < layout.length; i += 1) {
      const node = layout[i];
      const tx = centerTx + node.dx;
      const ty = centerTy + node.dy;
      const tierRoll = rng();
      const type = tierRoll < 0.52 ? "small_house" : (tierRoll < 0.87 ? "medium_house" : "large_house");
      const withChest = i % 2 === 0 || rng() < 0.3;
      const withBed = i % 3 !== 1 || rng() < 0.45;
      const house = addVillageHouse(world, tx, ty, type, rng, withChest, withBed, spawnedByPlayer);
      if (house) houses.push(house);
    }

    const minimumHouses = layout.length <= 5 ? 3 : 4;
    if (houses.length < minimumHouses) {
      for (const house of houses) {
        removeStructure(house);
      }
      return { ok: false, reason: "Village footprint blocked" };
    }

    for (const house of houses) {
      const footprint = getStructureFootprint(house.type);
      const pathTx = house.tx + Math.floor(footprint.w / 2);
      const pathTy = house.ty + Math.floor(footprint.h / 2);
      carveVillagePathLine(world, centerTx, centerTy, pathTx, pathTy, spawnedByPlayer);
    }
    placeVillagePath(world, centerTx, centerTy, spawnedByPlayer);

    const decorOffsets = [
      { dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
    ];
    for (const spot of decorOffsets) {
      placeVillagePath(world, centerTx + spot.dx, centerTy + spot.dy, spawnedByPlayer);
    }
    if (canPlaceVillageTile(world, centerTx + 1, centerTy + 1) && !getStructureAt(centerTx + 1, centerTy + 1)) {
      clearResourceForStructure(world, centerTx + 1, centerTy + 1);
      addStructure("campfire", centerTx + 1, centerTy + 1, { meta: buildVillageStructureMeta(spawnedByPlayer) });
    }
    if (canPlaceVillageTile(world, centerTx - 1, centerTy + 1) && !getStructureAt(centerTx - 1, centerTy + 1)) {
      clearResourceForStructure(world, centerTx - 1, centerTy + 1);
      addStructure("bench", centerTx - 1, centerTy + 1, { meta: buildVillageStructureMeta(spawnedByPlayer) });
    }

    const villagers = spawnVillageVillagers(world, centerTx, centerTy, houses, rng);
    return { ok: true, houses: houses.length, villagers };
  }

  function seedSurfaceVillages(world) {
    if (!world || !Array.isArray(world.islands)) return;
    const rng = makeRng((world.seedInt ?? seedToInt(world.seed || "island")) + 170341);
    const starterVillageChance = 0.03;
    const islandEntries = world.islands.map((island, index) => ({ island, index }));

    function getIslandIndexForTile(tx, ty) {
      const px = tx + 0.5;
      const py = ty + 0.5;
      let bestIndex = -1;
      let bestDelta = Infinity;
      for (const entry of islandEntries) {
        const dx = px - entry.island.x;
        const dy = py - entry.island.y;
        const delta = Math.hypot(dx, dy) - entry.island.radius;
        if (delta <= 0 && delta < bestDelta) {
          bestDelta = delta;
          bestIndex = entry.index;
        }
      }
      return bestIndex;
    }

    const caveIslandIndexes = new Set();
    for (const cave of world.caves || []) {
      if (!cave) continue;
      const islandIndex = getIslandIndexForTile(cave.tx, cave.ty);
      if (islandIndex >= 0) caveIslandIndexes.add(islandIndex);
    }

    const starterEntry = islandEntries.find(
      ({ island, index }) => island?.starter && island.radius >= 8 && !caveIslandIndexes.has(index)
    );
    const allowStarterVillage = !!starterEntry && rng() < starterVillageChance;

    function isIslandAllowedForVillage(island, index) {
      if (!island || island.radius < 8) return false;
      if (caveIslandIndexes.has(index)) return false;
      if (island.starter) return allowStarterVillage;
      return true;
    }

    const candidates = islandEntries
      .filter(({ island, index }) => !island.starter && isIslandAllowedForVillage(island, index))
      .map((entry) => entry.island)
      .sort((a, b) => b.radius - a.radius);
    const fallbackCandidates = candidates.slice();
    if (allowStarterVillage && starterEntry) fallbackCandidates.push(starterEntry.island);

    function trySpawnVillageOnIsland(island, attempts = 24) {
      if (!island) return false;
      for (let attempt = 0; attempt < attempts; attempt += 1) {
        const tx = Math.floor(island.x + (rng() - 0.5) * island.radius * 0.45);
        const ty = Math.floor(island.y + (rng() - 0.5) * island.radius * 0.45);
        const result = spawnVillageAt(world, tx, ty, rng);
        if (result.ok) return true;
      }
      for (let ring = 0.12; ring <= 0.52; ring += 0.08) {
        const radius = island.radius * ring;
        const points = 18;
        for (let i = 0; i < points; i += 1) {
          const angle = (i / points) * Math.PI * 2 + ring * 6.4;
          const tx = Math.floor(island.x + Math.cos(angle) * radius);
          const ty = Math.floor(island.y + Math.sin(angle) * radius);
          const result = spawnVillageAt(world, tx, ty, rng);
          if (result.ok) return true;
        }
      }
      return false;
    }

    let placed = 0;
    const targetVillages = Math.max(1, Math.min(2, Math.floor(candidates.length / 8) + 1));
    for (const island of candidates) {
      if (placed >= targetVillages) break;
      if (rng() > 0.12) continue;
      if (trySpawnVillageOnIsland(island, 18)) {
        placed += 1;
      }
    }

    for (const island of fallbackCandidates) {
      if (placed >= targetVillages) break;
      if (trySpawnVillageOnIsland(island, 64)) {
        placed += 1;
      }
    }

    if (placed >= targetVillages) return;
    for (let y = 2; y < world.size - 2; y += 2) {
      let anyPlaced = false;
      for (let x = 2; x < world.size - 2; x += 2) {
        const islandIndex = getIslandIndexForTile(x, y);
        if (islandIndex < 0) continue;
        const island = world.islands[islandIndex];
        if (!isIslandAllowedForVillage(island, islandIndex)) continue;
        const result = spawnVillageAt(world, x, y, rng);
        if (result.ok) {
          placed += 1;
          anyPlaced = true;
          if (placed >= targetVillages) return;
        }
      }
      if (anyPlaced && placed >= targetVillages) return;
    }

    if (placed > 0) return;
    for (const island of world.islands
      .slice()
      .sort((a, b) => (b.radius - a.radius) || Number(a.starter) - Number(b.starter))) {
      const islandIndex = world.islands.indexOf(island);
      if (!isIslandAllowedForVillage(island, islandIndex)) continue;
      const tx = Math.floor(island.x);
      const ty = Math.floor(island.y);
      const result = spawnVillageAt(world, tx, ty, rng);
      if (result.ok) return;
    }
  }

  function hasVillageStructures() {
    return Array.isArray(state.structures)
      && state.structures.some((structure) => structure && !structure.removed && !!structure.meta?.village);
  }

  function ensureSurfaceVillagePresence(world) {
    if (!world || !Array.isArray(state.structures)) return false;
    if (hasVillageStructures()) return false;
    const beforeCount = state.structures.length;
    seedSurfaceVillages(world);
    const added = state.structures.length > beforeCount && hasVillageStructures();
    if (added) {
      markDirty();
    }
    return added;
  }

  function ensureVillageVillagers(world, rng = Math.random) {
    if (!world || !Array.isArray(state.structures)) return 0;
    if (!Array.isArray(world.villagers)) world.villagers = [];
    if (!Number.isInteger(world.nextVillagerId) || world.nextVillagerId < 1) world.nextVillagerId = 1;
    const centers = getVillageCenters(world);
    if (centers.length === 0) return 0;
    let spawned = 0;
    for (const center of centers) {
      spawned += spawnVillageVillagers(world, Math.floor(center.tx), Math.floor(center.ty), [], rng);
    }
    if (spawned > 0) {
      markDirty();
    }
    return spawned;
  }

  function canPlaceWildRobotTile(world, tx, ty) {
    if (!world || !inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    if (world.tiles[idx] !== 1) return false;
    if (world.beachGrid?.[idx]) return false;
    if (getCaveAt(world, tx, ty)) return false;
    const structure = getStructureAt(tx, ty);
    if (structure && !structure.removed) return false;
    return true;
  }

  function spawnWildRobotAt(world, tx, ty) {
    if (!canPlaceWildRobotTile(world, tx, ty)) return false;
    clearResourceForStructure(world, tx, ty);
    const structure = addStructure("robot", tx, ty, {
      meta: {
        wildSpawn: true,
      },
    });
    const robot = ensureRobotMeta(structure);
    if (!robot) return false;
    robot.discovered = false;
    robot.mode = null;
    robot.manualStop = false;
    robot.state = "idle";
    robot.targetResourceId = null;
    robot.mineTimer = 0;
    robot.retargetTimer = 0;
    robot.pauseTimer = 0;
    robot.recallActive = false;
    robot.recallBenchTx = null;
    robot.recallBenchTy = null;
    return true;
  }

  function hasWildSpawnRobot() {
    return Array.isArray(state.structures)
      && state.structures.some(
        (structure) => structure
          && !structure.removed
          && structure.type === "robot"
          && !!structure.meta?.wildSpawn
      );
  }

  function getWildSpawnRobots() {
    if (!Array.isArray(state.structures)) return [];
    return state.structures.filter((structure) => (
      structure
      && !structure.removed
      && structure.type === "robot"
      && !!structure.meta?.wildSpawn
    ));
  }

  function isWildRobotPlacementValid(world, structure, outerCandidateSet = null) {
    if (!world || !structure || structure.removed || structure.type !== "robot") return false;
    if (!Number.isInteger(structure.tx) || !Number.isInteger(structure.ty)) return false;
    if (!inBounds(structure.tx, structure.ty, world.size)) return false;
    const idx = tileIndex(structure.tx, structure.ty, world.size);
    if (world.tiles[idx] !== 1 || world.beachGrid?.[idx]) return false;
    if (getCaveAt(world, structure.tx, structure.ty)) return false;
    const island = getIslandForTile(world, structure.tx, structure.ty);
    if (!island || isSpawnIsland(world, island)) return false;
    if (!outerCandidateSet || outerCandidateSet.size === 0) return true;
    return outerCandidateSet.has(island);
  }

  function findWildRobotTileOnIsland(world, island, seedInt, salt = 0) {
    if (!world || !island) return null;
    const islandSeed = (
      (Math.floor(island.x * 131) << 1)
      ^ (Math.floor(island.y * 97) << 3)
      ^ (Math.floor(island.radius * 100) << 5)
      ^ seedInt
      ^ (salt * 911)
    );
    for (let attempt = 0; attempt < 88; attempt += 1) {
      const angle = rand2d(attempt + 17, islandSeed + 47, seedInt + 13091) * Math.PI * 2;
      const radius = island.radius * (0.14 + rand2d(islandSeed + 101, attempt + 79, seedInt + 19411) * 0.68);
      const tx = Math.floor(island.x + Math.cos(angle) * radius);
      const ty = Math.floor(island.y + Math.sin(angle) * radius);
      if (!canPlaceWildRobotTile(world, tx, ty)) continue;
      return { tx, ty };
    }
    const searchRadius = Math.max(3, Math.ceil(island.radius));
    const cx = Math.floor(island.x);
    const cy = Math.floor(island.y);
    for (let ring = 0; ring <= searchRadius; ring += 1) {
      for (let dy = -ring; dy <= ring; dy += 1) {
        for (let dx = -ring; dx <= ring; dx += 1) {
          const tx = cx + dx;
          const ty = cy + dy;
          if (!inBounds(tx, ty, world.size)) continue;
          if (Math.hypot((tx + 0.5) - island.x, (ty + 0.5) - island.y) > island.radius * 0.95) continue;
          if (!canPlaceWildRobotTile(world, tx, ty)) continue;
          return { tx, ty };
        }
      }
    }
    return null;
  }

  function spawnGuaranteedOuterWildRobot(world) {
    if (!world || !Array.isArray(world.islands) || world.islands.length < 2) return false;
    if (!Array.isArray(state.structures) || !state.structureGrid) return false;
    const seedInt = Number.isFinite(world.seedInt) ? world.seedInt : seedToInt(String(world.seed || "island-1"));
    const outerIslands = getOutermostIslandsForWildRobot(world);
    if (outerIslands.length > 0) {
      const startIndex = Math.floor(rand2d(811, 97, seedInt + 9391) * outerIslands.length);
      for (let i = 0; i < outerIslands.length; i += 1) {
        const island = outerIslands[(startIndex + i) % outerIslands.length];
        const tile = findWildRobotTileOnIsland(world, island, seedInt, i);
        if (!tile) continue;
        if (spawnWildRobotAt(world, tile.tx, tile.ty)) return true;
      }
    }

    const ringWidth = Math.max(6, world.size * ABANDONED_ROBOT_OUTER_RING_RATIO);
    const outerSet = new Set(outerIslands);
    for (let pass = 0; pass < 2; pass += 1) {
      for (let y = 1; y < world.size - 1; y += 1) {
        for (let x = 1; x < world.size - 1; x += 1) {
          if (!canPlaceWildRobotTile(world, x, y)) continue;
          const island = getIslandForTile(world, x, y);
          if (!island || isSpawnIsland(world, island)) continue;
          if (outerSet.size > 0 && !outerSet.has(island)) continue;
          const edgeDist = Math.min(x, y, world.size - x, world.size - y);
          if (pass === 0 && edgeDist > ringWidth) continue;
          if (spawnWildRobotAt(world, x, y)) return true;
        }
      }
    }
    return false;
  }

  /** Ensures exactly one designated abandoned robot exists, and that it lives on an outer island. */
  function ensureSingleWildSpawnRobot(world = state.surfaceWorld || state.world) {
    if (!world || !Array.isArray(state.structures)) return false;
    const outerCandidateSet = new Set(getOutermostIslandsForWildRobot(world));
    const wildRobots = getWildSpawnRobots()
      .slice()
      .sort((a, b) => (a.tx - b.tx) || (a.ty - b.ty) || ((a.id || 0) - (b.id || 0)));
    let changed = false;
    let keep = null;

    for (const structure of wildRobots) {
      if (!keep) {
        keep = structure;
        continue;
      }
      if (!structure.meta) structure.meta = {};
      if (structure.meta.wildSpawn) {
        structure.meta.wildSpawn = false;
        changed = true;
      }
    }

    if (keep && !isWildRobotPlacementValid(world, keep, outerCandidateSet)) {
      if (!keep.meta) keep.meta = {};
      if (keep.meta.wildSpawn) {
        keep.meta.wildSpawn = false;
        changed = true;
      }
      keep = null;
    }

    if (!keep) {
      const spawned = spawnGuaranteedOuterWildRobot(world);
      changed = changed || spawned;
    }

    return changed;
  }

  function ensureGuaranteedOuterWildRobot(world) {
    return ensureSingleWildSpawnRobot(world);
  }

  function getWeightedLootEntry(rng, table) {
    if (!Array.isArray(table) || table.length === 0) return null;
    const totalWeight = table.reduce((sum, entry) => sum + Math.max(0, Number(entry?.weight) || 0), 0);
    if (totalWeight <= 0) return null;
    let roll = rng() * totalWeight;
    for (const entry of table) {
      roll -= Math.max(0, Number(entry?.weight) || 0);
      if (roll <= 0) return entry;
    }
    return table[table.length - 1];
  }

  function fillShipwreckStorageForSeed(storage, seedInt, wreckIndex) {
    if (!Array.isArray(storage)) return;
    for (const slot of storage) {
      slot.id = null;
      slot.qty = 0;
    }
    const rng = makeRng((seedInt ^ (wreckIndex * 1103515245)) >>> 0);
    const picks = 3 + Math.floor(rng() * 3);
    for (let i = 0; i < picks; i += 1) {
      const loot = getWeightedLootEntry(rng, SHIPWRECK_LOOT_TABLE);
      if (!loot?.id || !ITEMS[loot.id]) continue;
      const min = Math.max(1, Math.floor(Number(loot.min) || 1));
      const max = Math.max(min, Math.floor(Number(loot.max) || min));
      const qty = min + Math.floor(rng() * (max - min + 1));
      addItem(storage, loot.id, clamp(qty, 1, MAX_STACK));
    }
  }

  function getStructureCenterTile(type, tx, ty) {
    const footprint = getStructureFootprint(type);
    return {
      x: tx + footprint.w * 0.5,
      y: ty + footprint.h * 0.5,
    };
  }

  function getStructureAnchorForCenterTile(type, centerX, centerY) {
    const footprint = getStructureFootprint(type);
    return {
      tx: Math.round(centerX - footprint.w * 0.5),
      ty: Math.round(centerY - footprint.h * 0.5),
    };
  }

  function getAllSurfaceStructureAnchors(type) {
    if (!Array.isArray(state.structures)) return [];
    return state.structures.filter((structure) => (
      structure
      && !structure.removed
      && structure.type === type
    ));
  }

  function generateSeededShipwreckPlacements(world) {
    if (!world || !Array.isArray(world.islands)) return [];
    const seedInt = Number.isFinite(world.seedInt) ? world.seedInt : seedToInt(String(world.seed || "island-1"));
    const candidates = [];
    const islands = world.islands;
    const maxPairGap = Math.max(SHIPWRECK_CONFIG.minPairGapTiles + 1, SHIPWRECK_CONFIG.maxPairGapTiles);
    const targetCount = clamp(
      Math.floor(islands.length / 8),
      SHIPWRECK_CONFIG.minPerWorld,
      SHIPWRECK_CONFIG.maxPerWorld
    );

    for (let i = 0; i < islands.length; i += 1) {
      const a = islands[i];
      if (!a || a.radius < 5) continue;
      for (let j = i + 1; j < islands.length; j += 1) {
        const b = islands[j];
        if (!b || b.radius < 5) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= 0.001) continue;
        const edgeGap = dist - (a.radius + b.radius);
        if (edgeGap < SHIPWRECK_CONFIG.minPairGapTiles || edgeGap > maxPairGap) continue;
        const nx = dx / dist;
        const ny = dy / dist;
        const px = -ny;
        const py = nx;
        const span = Math.max(1, edgeGap * 0.5);
        for (let attempt = 0; attempt < 4; attempt += 1) {
          const noiseA = rand2d(seedInt + i * 17 + attempt * 11, seedInt + j * 31 + 91, seedInt + 7003);
          const noiseB = rand2d(seedInt + j * 29 + attempt * 13, seedInt + i * 43 + 127, seedInt + 9411);
          const t = 0.35 + noiseA * 0.3;
          const lateral = (noiseB - 0.5) * span;
          const centerX = a.x + dx * t + px * lateral;
          const centerY = a.y + dy * t + py * lateral;
          const anchor = getStructureAnchorForCenterTile("shipwreck", centerX, centerY);
          const key = `${anchor.tx},${anchor.ty}`;
          const score = rand2d(seedInt + i * 131 + j * 197, attempt * 19 + 73, seedInt + 15491);
          candidates.push({
            tx: anchor.tx,
            ty: anchor.ty,
            centerX,
            centerY,
            key,
            score,
          });
        }
      }
    }

    candidates.sort((a, b) => (
      b.score - a.score
      || a.tx - b.tx
      || a.ty - b.ty
    ));

    const placements = [];
    const seen = new Set();
    for (const candidate of candidates) {
      if (placements.length >= targetCount) break;
      if (seen.has(candidate.key)) continue;
      if (!canUseWaterStructureFootprint(world, "shipwreck", candidate.tx, candidate.ty)) continue;
      const tooClose = placements.some((entry) => {
        const ax = entry.tx + 1;
        const ay = entry.ty + 1;
        const bx = candidate.tx + 1;
        const by = candidate.ty + 1;
        return Math.hypot(ax - bx, ay - by) < SHIPWRECK_CONFIG.minSpacingTiles;
      });
      if (tooClose) continue;
      placements.push({ tx: candidate.tx, ty: candidate.ty });
      seen.add(candidate.key);
    }

    if (placements.length >= targetCount) return placements;
    const fallbackRng = makeRng((seedInt ^ 0x8d3a5f91) >>> 0);
    for (let attempt = 0; attempt < SHIPWRECK_CONFIG.pairAttempts; attempt += 1) {
      if (placements.length >= targetCount) break;
      const island = islands[Math.floor(fallbackRng() * islands.length)];
      if (!island) continue;
      const angle = fallbackRng() * Math.PI * 2;
      const dist = island.radius + 3 + fallbackRng() * 11;
      const centerX = island.x + Math.cos(angle) * dist;
      const centerY = island.y + Math.sin(angle) * dist;
      const anchor = getStructureAnchorForCenterTile("shipwreck", centerX, centerY);
      if (!canUseWaterStructureFootprint(world, "shipwreck", anchor.tx, anchor.ty)) continue;
      const tooClose = placements.some((entry) => (
        Math.hypot((entry.tx + 1) - (anchor.tx + 1), (entry.ty + 1) - (anchor.ty + 1)) < SHIPWRECK_CONFIG.minSpacingTiles
      ));
      if (tooClose) continue;
      placements.push({ tx: anchor.tx, ty: anchor.ty });
    }

    return placements;
  }

  function ensureSeededShipwrecks(world) {
    if (!world || !Array.isArray(state.structures)) return false;
    const seedInt = Number.isFinite(world.seedInt) ? world.seedInt : seedToInt(String(world.seed || "island-1"));
    const placements = generateSeededShipwreckPlacements(world);
    const byIndex = new Map();
    const toRemove = [];
    let changed = false;

    for (const structure of getAllSurfaceStructureAnchors("shipwreck")) {
      const index = Number.isInteger(structure?.meta?.shipwreckIndex) ? structure.meta.shipwreckIndex : null;
      if (index == null || index < 0 || index >= placements.length) {
        toRemove.push(structure);
        continue;
      }
      if (byIndex.has(index)) {
        toRemove.push(structure);
        continue;
      }
      byIndex.set(index, structure);
    }

    for (const structure of toRemove) {
      removeStructure(structure);
      changed = true;
    }

    for (let index = 0; index < placements.length; index += 1) {
      const placement = placements[index];
      const existing = byIndex.get(index);
      if (existing) {
        const validSpot = canUseWaterStructureFootprint(world, "shipwreck", placement.tx, placement.ty, {
          ignoreStructureId: existing.id,
        });
        if (!validSpot) {
          removeStructure(existing);
          changed = true;
          byIndex.delete(index);
        } else if (existing.tx !== placement.tx || existing.ty !== placement.ty) {
          setStructureFootprintInGrid(existing, false);
          existing.tx = placement.tx;
          existing.ty = placement.ty;
          setStructureFootprintInGrid(existing, true);
          changed = true;
        }
      }

      if (!byIndex.has(index)) {
        if (!canUseWaterStructureFootprint(world, "shipwreck", placement.tx, placement.ty)) continue;
        const structure = addStructure("shipwreck", placement.tx, placement.ty, {
          storage: createEmptyInventory(SHIPWRECK_STORAGE_SIZE),
          meta: {
            seeded: true,
            shipwreckIndex: index,
          },
        });
        fillShipwreckStorageForSeed(structure.storage, seedInt, index);
        changed = true;
        continue;
      }

      const kept = byIndex.get(index);
      if (!kept.meta) kept.meta = {};
      kept.meta.seeded = true;
      kept.meta.shipwreckIndex = index;
      kept.storage = sanitizeInventorySlots(kept.storage, SHIPWRECK_STORAGE_SIZE);
    }

    return changed;
  }

  function getSpawnAnchorTile(world) {
    const spawn = state.spawnTile || findSpawnTile(world);
    return {
      x: Number.isFinite(spawn?.x) ? spawn.x + 0.5 : world.size * 0.5,
      y: Number.isFinite(spawn?.y) ? spawn.y + 0.5 : world.size * 0.5,
    };
  }

  function isAbandonedShipStructureValid(world, structure, outerIslands = null) {
    if (!world || !structure || structure.removed || structure.type !== "abandoned_ship") return false;
    if (!canUseWaterStructureFootprint(world, structure.type, structure.tx, structure.ty, { ignoreStructureId: structure.id })) {
      return false;
    }
    const center = getStructureCenterTile(structure.type, structure.tx, structure.ty);
    const spawn = getSpawnAnchorTile(world);
    const spawnDist = Math.hypot(center.x - spawn.x, center.y - spawn.y);
    if (spawnDist < ABANDONED_SHIP_CONFIG.minSpawnDistanceFromSpawnTiles) return false;
    if (spawnDist > ABANDONED_SHIP_CONFIG.maxSpawnDistanceFromSpawnTiles) return false;
    const nearestIsland = getIslandForTile(world, Math.floor(center.x), Math.floor(center.y));
    if (nearestIsland) return false;
    if (!Array.isArray(outerIslands) || outerIslands.length === 0) return true;
    return outerIslands.some((island) => {
      const dist = Math.hypot(center.x - island.x, center.y - island.y);
      return dist <= island.radius + 16;
    });
  }

  function findAbandonedShipPlacement(world) {
    if (!world || !Array.isArray(world.islands)) return null;
    const seedInt = Number.isFinite(world.seedInt) ? world.seedInt : seedToInt(String(world.seed || "island-1"));
    const outerIslands = getOutermostIslandsForWildRobot(world);
    if (outerIslands.length === 0) return null;
    const spawn = getSpawnAnchorTile(world);
    const islandStart = Math.floor(rand2d(seedInt + 17, seedInt + 41, seedInt + 73) * outerIslands.length);

    for (let order = 0; order < outerIslands.length; order += 1) {
      const island = outerIslands[(islandStart + order) % outerIslands.length];
      if (!island) continue;
      for (let attempt = 0; attempt < 48; attempt += 1) {
        const a = rand2d(seedInt + order * 31 + attempt * 13, seedInt + 191, seedInt + 4001);
        const b = rand2d(seedInt + order * 43 + attempt * 17, seedInt + 317, seedInt + 5171);
        const angle = a * Math.PI * 2;
        const ring = island.radius + 3 + b * 10;
        const centerX = island.x + Math.cos(angle) * ring;
        const centerY = island.y + Math.sin(angle) * ring;
        const spawnDist = Math.hypot(centerX - spawn.x, centerY - spawn.y);
        if (spawnDist < ABANDONED_SHIP_CONFIG.minSpawnDistanceFromSpawnTiles) continue;
        if (spawnDist > ABANDONED_SHIP_CONFIG.maxSpawnDistanceFromSpawnTiles) continue;
        const anchor = getStructureAnchorForCenterTile("abandoned_ship", centerX, centerY);
        if (!canUseWaterStructureFootprint(world, "abandoned_ship", anchor.tx, anchor.ty)) continue;
        const nearOuter = outerIslands.some((candidateIsland) => {
          const dist = Math.hypot(centerX - candidateIsland.x, centerY - candidateIsland.y);
          return dist <= candidateIsland.radius + 16;
        });
        if (!nearOuter) continue;
        return anchor;
      }
    }
    return null;
  }

  function ensureSingleAbandonedShip(world = state.surfaceWorld || state.world) {
    if (!world || !Array.isArray(state.structures)) return false;
    const outerIslands = getOutermostIslandsForWildRobot(world);
    const allShips = getAllSurfaceStructureAnchors("abandoned_ship")
      .slice()
      .sort((a, b) => (a.tx - b.tx) || (a.ty - b.ty) || ((a.id || 0) - (b.id || 0)));
    const ships = allShips.filter((structure) => !structure?.meta?.debugPlaced);
    let changed = false;
    let keep = null;

    for (const structure of ships) {
      if (!keep) {
        keep = structure;
        continue;
      }
      removeStructure(structure);
      changed = true;
    }

    if (keep && !isAbandonedShipStructureValid(world, keep, outerIslands)) {
      removeStructure(keep);
      keep = null;
      changed = true;
    }

    if (!keep) {
      const placement = findAbandonedShipPlacement(world);
      if (placement && canUseWaterStructureFootprint(world, "abandoned_ship", placement.tx, placement.ty)) {
        const ship = addStructure("abandoned_ship", placement.tx, placement.ty, {
          meta: {
            seeded: true,
          },
        });
        ensureAbandonedShipMeta(ship);
        changed = true;
      }
    }

    return changed;
  }

  function ensureSeedShipFeatures(world = state.surfaceWorld || state.world) {
    if (!world) return false;
    let changed = false;
    if (ensureSingleAbandonedShip(world)) changed = true;
    if (ensureSeededShipwrecks(world)) changed = true;
    return changed;
  }

  function getAbandonedShipStructures() {
    if (!Array.isArray(state.structures)) return [];
    return state.structures.filter((structure) => (
      structure
      && !structure.removed
      && structure.type === "abandoned_ship"
    ));
  }

  function getShipSeatInfoForPlayer(playerId) {
    if (!playerId) return null;
    for (const structure of getAbandonedShipStructures()) {
      const ship = ensureAbandonedShipMeta(structure);
      if (!ship || !Array.isArray(ship.seats)) continue;
      const seatIndex = ship.seats.indexOf(playerId);
      if (seatIndex >= 0) {
        return {
          structure,
          ship,
          seatIndex,
          isDriver: ship.driverId === playerId,
        };
      }
    }
    return null;
  }

  function getShipSeatWorldPosition(structure, seatIndex, useRender = false) {
    const shipPos = getAbandonedShipDisplayPosition(structure, useRender);
    if (!shipPos) return null;
    const offsets = getAbandonedShipSeatOffsets();
    const seat = offsets[clamp(seatIndex, 0, offsets.length - 1)] || offsets[0];
    const cos = Math.cos(shipPos.angle);
    const sin = Math.sin(shipPos.angle);
    const localX = Number(seat?.x) || 0;
    const localY = Number(seat?.y) || 0;
    return {
      x: shipPos.x + localX * cos - localY * sin,
      y: shipPos.y + localX * sin + localY * cos,
      angle: shipPos.angle,
    };
  }

  function removePlayerFromShipStructure(structure, playerId) {
    const ship = ensureAbandonedShipMeta(structure);
    if (!ship || !playerId) return false;
    let changed = false;
    for (let i = 0; i < ship.seats.length; i += 1) {
      if (ship.seats[i] !== playerId) continue;
      ship.seats[i] = null;
      changed = true;
    }
    if (ship.driverId === playerId) {
      ship.driverId = ship.seats.find((id) => typeof id === "string" && id.length > 0) || null;
      changed = true;
    }
    if (!ship.driverId) {
      ship.driverInputX = 0;
      ship.driverInputY = 0;
      ship.controlAge = 0;
      ship.vx = 0;
      ship.vy = 0;
    }
    return changed;
  }

  function removePlayerFromAllShips(playerId) {
    if (!playerId) return false;
    let changed = false;
    for (const structure of getAbandonedShipStructures()) {
      if (removePlayerFromShipStructure(structure, playerId)) changed = true;
    }
    return changed;
  }

  function assignPlayerToShip(structure, playerId) {
    const ship = ensureAbandonedShipMeta(structure);
    if (!ship || !playerId) return null;
    const existingSeat = ship.seats.indexOf(playerId);
    if (existingSeat >= 0) {
      if (!ship.driverId) ship.driverId = playerId;
      return existingSeat;
    }
    const seatIndex = ship.seats.findIndex((id) => !id);
    if (seatIndex < 0) return null;
    ship.seats[seatIndex] = playerId;
    if (!ship.driverId) ship.driverId = playerId;
    return seatIndex;
  }

  function pruneShipOccupants(structure) {
    const ship = ensureAbandonedShipMeta(structure);
    if (!ship) return false;
    const valid = new Set([getLocalShipPlayerId()]);
    for (const id of net.players.keys()) valid.add(id);
    let changed = false;
    for (let i = 0; i < ship.seats.length; i += 1) {
      const occupantId = ship.seats[i];
      if (!occupantId || valid.has(occupantId)) continue;
      ship.seats[i] = null;
      changed = true;
    }
    if (ship.driverId && !valid.has(ship.driverId)) {
      ship.driverId = null;
      changed = true;
    }
    if (!ship.driverId) {
      const fallbackDriver = ship.seats.find((id) => typeof id === "string" && id.length > 0) || null;
      if (fallbackDriver !== ship.driverId) {
        ship.driverId = fallbackDriver;
        changed = true;
      }
    }
    if (!ship.driverId) {
      ship.driverInputX = 0;
      ship.driverInputY = 0;
      ship.controlAge = 0;
      ship.vx = 0;
      ship.vy = 0;
    }
    return changed;
  }

  function syncShipOccupantPositions() {
    const localSeatInfo = getShipSeatInfoForPlayer(getLocalShipPlayerId());
    if (localSeatInfo && state.player && !state.inCave && !state.player.inHut) {
      const pos = getShipSeatWorldPosition(localSeatInfo.structure, localSeatInfo.seatIndex, !net.isHost);
      if (pos) {
        state.player.x = pos.x;
        state.player.y = pos.y;
        state.player.facing.x = Math.cos(pos.angle);
        state.player.facing.y = Math.sin(pos.angle);
      }
    }

    for (const remote of net.players.values()) {
      if (!remote || remote.inCave || remote.inHut) continue;
      const seatInfo = getShipSeatInfoForPlayer(remote.id);
      if (!seatInfo) continue;
      const pos = getShipSeatWorldPosition(seatInfo.structure, seatInfo.seatIndex, !net.isHost);
      if (!pos) continue;
      remote.x = pos.x;
      remote.y = pos.y;
      remote.renderX = pos.x;
      remote.renderY = pos.y;
      remote.facing = {
        x: Math.cos(pos.angle),
        y: Math.sin(pos.angle),
      };
    }
  }

  function getShipAnchorForWorldPosition(structure, worldX, worldY) {
    const centerTileX = worldX / CONFIG.tileSize;
    const centerTileY = worldY / CONFIG.tileSize;
    return getStructureAnchorForCenterTile(structure.type, centerTileX, centerTileY);
  }

  function canAbandonedShipOccupyAt(world, structure, worldX, worldY) {
    if (!world || !structure) return false;
    const anchor = getShipAnchorForWorldPosition(structure, worldX, worldY);
    return canUseWaterStructureFootprint(world, structure.type, anchor.tx, anchor.ty, {
      ignoreStructureId: structure.id,
    });
  }

  function moveAbandonedShipStructureTo(world, structure, worldX, worldY) {
    if (!world || !structure) return false;
    const ship = ensureAbandonedShipMeta(structure);
    if (!ship) return false;
    if (!canAbandonedShipOccupyAt(world, structure, worldX, worldY)) return false;
    const anchor = getShipAnchorForWorldPosition(structure, worldX, worldY);
    if (anchor.tx !== structure.tx || anchor.ty !== structure.ty) {
      setStructureFootprintInGrid(structure, false);
      structure.tx = anchor.tx;
      structure.ty = anchor.ty;
      setStructureFootprintInGrid(structure, true);
    }
    ship.x = worldX;
    ship.y = worldY;
    return true;
  }

  function getDriverInputForShip(structure, ship) {
    if (!ship?.driverId) return { x: 0, y: 0 };
    const driverId = ship.driverId;
    if (driverId === getLocalShipPlayerId()) {
      const uiLock = inventoryOpen
        || !!state.activeStation
        || !!state.activeChest
        || !!state.activeShipRepair
        || state.gameWon;
      return uiLock ? { x: 0, y: 0 } : getMoveVector();
    }
    if (ship.controlAge > ABANDONED_SHIP_CONFIG.remoteInputTimeout) {
      return { x: 0, y: 0 };
    }
    return {
      x: clamp(Number(ship.driverInputX) || 0, -1, 1),
      y: clamp(Number(ship.driverInputY) || 0, -1, 1),
    };
  }

  function updateAbandonedShips(dt) {
    const world = state.surfaceWorld;
    if (!world) return;
    if (netIsClientReady()) {
      const localSeat = getShipSeatInfoForPlayer(getLocalShipPlayerId());
      if (localSeat?.isDriver) {
        const input = getMoveVector();
        state.shipControlSendTimer -= dt;
        if (state.shipControlSendTimer <= 0) {
          sendShipControlInput(localSeat.structure, input.x, input.y);
          state.shipControlSendTimer = 0.05;
        }
      } else {
        state.shipControlSendTimer = 0;
      }
      syncShipOccupantPositions();
      return;
    }
    let changed = false;

    for (const structure of getAbandonedShipStructures()) {
      const ship = ensureAbandonedShipMeta(structure);
      if (!ship) continue;
      if (pruneShipOccupants(structure)) changed = true;

      ship.controlAge = Math.max(0, ship.controlAge + dt);
      if (!ship.repaired) {
        ship.vx = 0;
        ship.vy = 0;
      }

      const input = ship.repaired ? getDriverInputForShip(structure, ship) : { x: 0, y: 0 };
      const turn = clamp(input.x, -1, 1);
      const throttle = clamp(-input.y, -1, 1);
      if (Math.abs(turn) > 0.001) {
        const turnScalar = 0.45 + Math.abs(throttle) * 0.55;
        ship.angle = normalizeAngleRadians(ship.angle + turn * ABANDONED_SHIP_CONFIG.turnSpeed * turnScalar * dt);
      }
      if (ship.repaired && Math.abs(throttle) > 0.001) {
        ship.vx += Math.cos(ship.angle) * throttle * ABANDONED_SHIP_CONFIG.accel * dt;
        ship.vy += Math.sin(ship.angle) * throttle * ABANDONED_SHIP_CONFIG.accel * dt;
      }

      ship.vx *= Math.pow(ABANDONED_SHIP_CONFIG.drag, dt * 60);
      ship.vy *= Math.pow(ABANDONED_SHIP_CONFIG.drag, dt * 60);
      const speed = Math.hypot(ship.vx, ship.vy);
      if (speed > ABANDONED_SHIP_CONFIG.speedMax) {
        const scale = ABANDONED_SHIP_CONFIG.speedMax / speed;
        ship.vx *= scale;
        ship.vy *= scale;
      } else if (speed < 0.6) {
        ship.vx = 0;
        ship.vy = 0;
      }

      const targetX = ship.x + ship.vx * dt;
      const targetY = ship.y + ship.vy * dt;
      let moved = false;
      if (canAbandonedShipOccupyAt(world, structure, targetX, targetY)) {
        moved = moveAbandonedShipStructureTo(world, structure, targetX, targetY);
      } else {
        const canX = canAbandonedShipOccupyAt(world, structure, targetX, ship.y);
        const canY = canAbandonedShipOccupyAt(world, structure, ship.x, targetY);
        if (canX) {
          moved = moveAbandonedShipStructureTo(world, structure, targetX, ship.y) || moved;
          ship.vy *= 0.35;
        } else if (canY) {
          moved = moveAbandonedShipStructureTo(world, structure, ship.x, targetY) || moved;
          ship.vx *= 0.35;
        } else {
          ship.vx = 0;
          ship.vy = 0;
        }
      }
      if (moved || Math.abs(turn) > 0.001 || Math.abs(throttle) > 0.001) changed = true;
    }

    if (changed && !netIsClientReady()) markDirty();
    syncShipOccupantPositions();
  }

  function sendShipControlInput(structure, inputX, inputY) {
    if (!netIsClientReady() || !structure) return;
    sendToHost({
      type: "shipControl",
      tx: structure.tx,
      ty: structure.ty,
      inputX: clamp(Number(inputX) || 0, -1, 1),
      inputY: clamp(Number(inputY) || 0, -1, 1),
    });
  }

  function startNewGame(seedStr) {
    const normalizedSeed = normalizeSeedValue(seedStr);
    const world = generateWorld(normalizedSeed);
    normalizeSurfaceResources(world);
    state.surfaceWorld = world;
    state.world = world;
    state.structures = [];
    state.structureGrid = new Array(world.size * world.size).fill(null);
    state.inCave = false;
    state.activeCave = null;
    state.returnPosition = null;
    state.nextDropId = 1;
    world.drops = world.drops || [];
    world.respawnTasks = world.respawnTasks || [];
    world.monsters = world.monsters || [];
    world.nextMonsterId = world.nextMonsterId || 1;
    world.projectiles = [];
    world.nextProjectileId = 1;
    world.animals = world.animals || [];
    world.nextAnimalId = world.nextAnimalId || 1;
    world.animalSpawnTimer = 3;
    world.villagers = world.villagers || [];
    world.nextVillagerId = world.nextVillagerId || 1;
    seedSurfaceAnimals(world, 24);
    const spawn = findSpawnTile(world);
    ensureSpawnIslandHarvestAnimals(world, spawn, 4, 32);
    state.spawnTile = spawn;
    state.timeOfDay = 0;
    state.isNight = false;
    state.checkpointTimer = 0;
    state.surfaceSpawnTimer = MONSTER.spawnInterval;
    state.surfaceGuardianSpawnTimer = SURFACE_GUARDIAN_CONFIG.spawnInterval;
    state.gameWon = false;
    state.winSequencePlayed = false;
    state.winTimer = 0;
    state.winPlayerPos = null;
    if (endScreen) {
      endScreen.classList.remove("animate");
      endScreen.classList.remove("text-ready");
    }

    state.player = {
      x: (spawn.x + 0.5) * CONFIG.tileSize,
      y: (spawn.y + 0.5) * CONFIG.tileSize,
      toolTier: 1,
      unlocks: normalizeUnlocks(null),
      checkpoint: {
        x: (spawn.x + 0.5) * CONFIG.tileSize,
        y: (spawn.y + 0.5) * CONFIG.tileSize,
      },
      facing: { x: 1, y: 0 },
      maxHp: 100,
      hp: 100,
      poisonTimer: 0,
      poisonDps: 0,
      inHut: false,
      invincible: 0,
      attackTimer: 0,
    };
    ensurePlayerProgress(state.player);
    setPlayerCheckpoint(state.player, world, state.player.x, state.player.y, true);
    state.activeHouse = null;
    state.housePlayer = null;
    state.inventory = createEmptyInventory(INVENTORY_SIZE);
    state.targetResource = null;
    state.activeStation = null;
    state.activeChest = null;
    closeShipRepairPanel();
    state.shipControlSendTimer = 0;
    state.nearShip = null;
    state.debugBoatPlacePending = false;
    state.ambientFish = [];
    state.ambientFishSpawnTimer = 0;

    const benchSpot = findBenchSpot(world, spawn);
    addStructure("bench", benchSpot.tx, benchSpot.ty, { meta: { spawnBench: true } });
    seedSurfaceVillages(world);
    ensureGuaranteedOuterWildRobot(world);
    ensureSeedShipFeatures(world);
    ensureMushroomIslandGreenCows(world);

    state.dirty = true;
    saveStatus.textContent = "Saving...";
    state.saveTimer = CONFIG.saveInterval;

    setStoredActiveSeed(world.seed);
    seedDisplay.textContent = `Seed: ${world.seed}`;
    updateToolDisplay();
    updateHealthUI();
    updateTimeUI();
    updateObjectiveUI();
    updateAllSlotUI();
  }

  function loadOrCreateGame(preferredSeed = null) {
    const targetSeed = normalizeSeedValue(preferredSeed ?? getStoredActiveSeed() ?? "island-1");
    const savedRaw = loadGame(targetSeed);
    const saved = migrateSave(savedRaw);
    if (saved) {
      const layoutCompatible = isSaveLayoutCompatible(saved);
      const preparedSave = layoutCompatible
        ? saved
        : sanitizeSaveForCurrentLayout(saved, targetSeed);
      const world = generateWorld(preparedSave.seed);
      normalizeSurfaceResources(world);
      if (Array.isArray(preparedSave.islandLayout)) {
        applySurfaceIslandLayout(world, preparedSave.islandLayout, { shiftSession: false });
      }
      state.nextDropId = 1;
      applyResourceStates(world, preparedSave.resourceStates);
      applyRespawnTasks(world, preparedSave.respawnTasks);
      applyDrops(world, preparedSave.drops);
      const savedSurfaceMonsters = Array.isArray(preparedSave.monsters)
        ? preparedSave.monsters
        : world.monsters;
      world.monsters = buildMonstersFromSnapshot(world.monsters, savedSurfaceMonsters, world);
      world.nextMonsterId = world.monsters.reduce((max, monster) => Math.max(max, (monster.id || 0) + 1), 1);
      applyAnimals(world, preparedSave.animals);
      applyVillagers(world, preparedSave.villagers);
      world.projectiles = [];
      world.nextProjectileId = 1;
      world.animals = world.animals || [];
      world.nextAnimalId = world.nextAnimalId || 1;
      world.animalSpawnTimer = 3;
      world.villagers = world.villagers || [];
      world.nextVillagerId = world.nextVillagerId || 1;
      if (world.animals.length === 0) {
        seedSurfaceAnimals(world, 24);
      }
      ensureSurfaceCaves(world, preparedSave.caves);

      if (Array.isArray(world.caves)) {
        for (const cave of world.caves) {
          const savedCave = preparedSave.caves?.find((entry) => entry.id === cave.id);
          cave.hostileBlocked = savedCave && typeof savedCave.hostileBlocked === "boolean"
            ? !!savedCave.hostileBlocked
            : shouldBlockCaveHostilesForSurfaceTile(world, cave.tx, cave.ty);
          if (savedCave) {
            applyResourceStates(cave.world, savedCave.resourceStates);
            applyRespawnTasks(cave.world, savedCave.respawnTasks);
            applyDrops(cave.world, savedCave.drops);
            const savedCaveMonsters = Array.isArray(savedCave.monsters)
              ? savedCave.monsters
              : cave.world.monsters;
            cave.world.monsters = buildMonstersFromSnapshot(cave.world.monsters, savedCaveMonsters, cave.world);
            cave.world.nextMonsterId = cave.world.monsters.reduce((max, monster) => Math.max(max, (monster.id || 0) + 1), 1);
          } else {
            cave.world.drops = cave.world.drops || [];
            cave.world.respawnTasks = cave.world.respawnTasks || [];
            cave.world.monsters = cave.world.monsters || [];
            cave.world.nextMonsterId = cave.world.nextMonsterId || 1;
          }
          cave.world.projectiles = [];
          cave.world.nextProjectileId = 1;
          if (cave.hostileBlocked) {
            cave.world.monsters = [];
            cave.world.projectiles = [];
          }
          cave.world.villagers = cave.world.villagers || [];
          cave.world.nextVillagerId = cave.world.nextVillagerId || 1;
        }
      }

      state.surfaceWorld = world;
      state.world = world;
      state.inventory = sanitizeInventorySlots(preparedSave.inventory, INVENTORY_SIZE);
      state.structures = [];
      state.structureGrid = new Array(world.size * world.size).fill(null);

      if (Array.isArray(preparedSave.structures)) {
        const bridgeSet = new Set(
          preparedSave.structures
            .filter((entry) => entry && (entry.type === "bridge" || entry.type === "dock"))
            .map((entry) => `${entry.tx},${entry.ty}`)
        );
        const anchoredBridgeSet = getAnchoredBridgeNetwork(world, bridgeSet);
        for (const entry of preparedSave.structures) {
          if (!entry) continue;
          const normalized = { ...entry, type: normalizeLegacyStructureType(entry.type) };
          if (!isStructureValidOnLoad(world, normalized, bridgeSet, anchoredBridgeSet)) continue;
          const storageSize = normalized.type === "robot"
            ? ROBOT_STORAGE_SIZE
            : ((normalized.type === "chest" || normalized.type === "shipwreck") ? CHEST_SIZE : null);
          clearResourcesForFootprint(world, normalized.type, normalized.tx, normalized.ty);
          const structure = addStructure(normalized.type, normalized.tx, normalized.ty, {
            storage: Array.isArray(entry.storage)
              ? sanitizeInventorySlots(
                  entry.storage,
                  Number.isInteger(storageSize) ? storageSize : entry.storage.length
                )
              : null,
            meta: entry.meta ? JSON.parse(JSON.stringify(entry.meta)) : null,
          });
          if (structure.type === "chest") structure.storage = sanitizeInventorySlots(structure.storage, CHEST_SIZE);
          if (structure.type === "shipwreck") structure.storage = sanitizeInventorySlots(structure.storage, SHIPWRECK_STORAGE_SIZE);
          if (structure.type === "robot") structure.storage = sanitizeInventorySlots(structure.storage, ROBOT_STORAGE_SIZE);
        }
      }
      const spawnTile = findSpawnTile(world);
      const harvestAnimalsAdded = ensureSpawnIslandHarvestAnimals(world, spawnTile, 4, 32);
      state.player = {
        x: preparedSave.player?.x ?? (spawnTile.x + 0.5) * CONFIG.tileSize,
        y: preparedSave.player?.y ?? (spawnTile.y + 0.5) * CONFIG.tileSize,
        toolTier: preparedSave.player?.toolTier ?? 1,
        unlocks: normalizeUnlocks(preparedSave.player?.unlocks),
        checkpoint: normalizeCheckpoint(preparedSave.player?.checkpoint) ?? {
          x: (spawnTile.x + 0.5) * CONFIG.tileSize,
          y: (spawnTile.y + 0.5) * CONFIG.tileSize,
        },
        facing: { x: 1, y: 0 },
        maxHp: preparedSave.player?.maxHp ?? 100,
        hp: preparedSave.player?.hp ?? 100,
        poisonTimer: 0,
        poisonDps: 0,
        inHut: false,
        invincible: 0,
        attackTimer: 0,
      };
      ensurePlayerProgress(state.player);
      setPlayerCheckpoint(state.player, world, state.player.checkpoint?.x ?? state.player.x, state.player.checkpoint?.y ?? state.player.y, true);
      state.activeHouse = null;
      state.housePlayer = null;
      state.spawnTile = spawnTile;
      state.ambientFish = [];
      state.ambientFishSpawnTimer = 0;
      state.timeOfDay = typeof preparedSave.timeOfDay === "number" ? preparedSave.timeOfDay : 0;
      state.checkpointTimer = 0;
      state.animalVocalTimer = 2.4 + Math.random() * 1.8;
      state.gameWon = !!preparedSave.gameWon;
      state.winSequencePlayed = false;
      state.winTimer = 0;
      state.winPlayerPos = state.player ? { x: state.player.x, y: state.player.y } : null;
      state.isNight = state.timeOfDay >= CONFIG.dayLength;
      state.surfaceSpawnTimer = MONSTER.spawnInterval;
      state.surfaceGuardianSpawnTimer = SURFACE_GUARDIAN_CONFIG.spawnInterval;
      state.inCave = !!preparedSave.player?.inCave;
      state.activeCave = null;
      state.returnPosition = preparedSave.player?.returnPosition ?? null;

      if (state.inCave && world.caves) {
        const cave = world.caves.find((entry) => entry.id === preparedSave.player?.caveId);
        if (cave) {
          state.world = cave.world;
          state.activeCave = cave;
        } else {
          state.inCave = false;
          state.returnPosition = null;
        }
      } else if (state.inCave) {
        state.inCave = false;
        state.returnPosition = null;
      }

      if (state.inCave && state.activeCave) {
        const playerTx = Math.floor(state.player.x / CONFIG.tileSize);
        const playerTy = Math.floor(state.player.y / CONFIG.tileSize);
        if (!inBounds(playerTx, playerTy, state.world.size) || !state.world.tiles[tileIndex(playerTx, playerTy, state.world.size)]) {
          const entrance = state.activeCave.world.entrance;
          state.player.x = (entrance.tx + 0.5) * CONFIG.tileSize;
          state.player.y = (entrance.ty + 0.5) * CONFIG.tileSize;
        }
      } else {
        const playerTx = Math.floor(state.player.x / CONFIG.tileSize);
        const playerTy = Math.floor(state.player.y / CONFIG.tileSize);
        if (!isSpawnableTile(world, playerTx, playerTy)) {
          state.player.x = (spawnTile.x + 0.5) * CONFIG.tileSize;
          state.player.y = (spawnTile.y + 0.5) * CONFIG.tileSize;
        }
      }

      let bench = state.structures.find((s) => s.type === "bench" && !s.removed && !s.meta?.village);
      const benchIdx = bench ? tileIndex(bench.tx, bench.ty, world.size) : -1;
      if (!bench || !world.tiles[benchIdx]) {
        if (bench) removeStructure(bench);
        const benchSpot = findBenchSpot(world, spawnTile);
        addStructure("bench", benchSpot.tx, benchSpot.ty, { meta: { spawnBench: true } });
      }

      const villagesAdded = ensureSurfaceVillagePresence(world);
      const villagersAdded = ensureVillageVillagers(world);
      const wildRobotAdded = ensureGuaranteedOuterWildRobot(world);
      const shipFeaturesAdded = ensureSeedShipFeatures(world);
      const mushroomCowsAdded = ensureMushroomIslandGreenCows(world);

      state.targetResource = null;
      state.activeStation = null;
      state.activeChest = null;
      closeShipRepairPanel();
      state.shipControlSendTimer = 0;
      state.nearShip = null;
      state.debugBoatPlacePending = false;
      state.dirty = (!layoutCompatible)
        || villagesAdded
        || villagersAdded > 0
        || wildRobotAdded
        || shipFeaturesAdded
        || mushroomCowsAdded > 0
        || harvestAnimalsAdded > 0;
      if (state.dirty && !netIsClientReady()) {
        saveStatus.textContent = "Saving...";
      }

      setStoredActiveSeed(world.seed);
      seedDisplay.textContent = `Seed: ${world.seed}`;
      updateToolDisplay();
      updateHealthUI();
      updateTimeUI();
      updateObjectiveUI();
      if (state.gameWon) {
        startWinSequence();
      }
      updateAllSlotUI();
      return;
    }

    startNewGame(targetSeed);
  }

  function getTileAt(world, x, y) {
    const tx = Math.floor(x / CONFIG.tileSize);
    const ty = Math.floor(y / CONFIG.tileSize);
    if (!inBounds(tx, ty, world.size)) return 0;
    return world.tiles[tileIndex(tx, ty, world.size)];
  }

  function isWalkableTileInWorld(world, tx, ty) {
    if (!world || !inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    const baseLand = world.tiles[idx] === 1;

    if (world === state.surfaceWorld) {
      const structure = getStructureAt(tx, ty);
      if (structure) {
        const def = STRUCTURE_DEFS[structure.type];
        if (def?.walkable) return true;
        if (def?.blocking) return false;
      }
    }

    return baseLand;
  }

  function isWalkableAtWorld(world, x, y) {
    const tx = Math.floor(x / CONFIG.tileSize);
    const ty = Math.floor(y / CONFIG.tileSize);
    return isWalkableTileInWorld(world, tx, ty);
  }

  function isWalkableTile(tx, ty) {
    return isWalkableTileInWorld(state.world, tx, ty);
  }

  function isWalkableAt(x, y) {
    return isWalkableAtWorld(state.world, x, y);
  }

  function findNearestResource(world, player) {
    if (!world || !Array.isArray(world.resources)) return null;
    let closest = null;
    let closestDist = Infinity;
    for (const res of world.resources) {
      if (res.removed) continue;
      if (res.stage && res.stage !== "alive") continue;
      const dx = res.x - player.x;
      const dy = res.y - player.y;
      const dist = Math.hypot(dx, dy);
      if (dist < CONFIG.interactRange && dist < closestDist) {
        closest = res;
        closestDist = dist;
      }
    }
    return closest;
  }

  function findNearestResourceAt(world, position, range = CONFIG.interactRange) {
    if (!world || !Array.isArray(world.resources)) return null;
    let closest = null;
    let closestDist = Infinity;
    for (const res of world.resources) {
      if (!res || res.removed) continue;
      if (res.stage && res.stage !== "alive") continue;
      const dist = Math.hypot(res.x - position.x, res.y - position.y);
      if (dist < range && dist < closestDist) {
        closest = res;
        closestDist = dist;
      }
    }
    return closest;
  }

  function getResourceDropId(resource) {
    if (!resource) return null;
    if (typeof resource.dropOverride === "string" && ITEMS[resource.dropOverride]) {
      return resource.dropOverride;
    }
    if (resource.type === "tree") return "wood";
    if (resource.type === "rock") return "stone";
    if (resource.type === "grass") return "grass";
    if (resource.type === "ore") {
      const oreKind = resource.oreKind || "iron_ore";
      return ITEMS[oreKind] ? oreKind : "iron_ore";
    }
    if (resource.type === "biomeStone") {
      return BIOME_STONES[resource.biomeId]?.id ?? "stone";
    }
    return null;
  }

  function getResourceDropQty(resource) {
    if (!resource) return 1;
    const qty = Math.floor(Number(resource.dropQty) || 1);
    return clamp(qty, 1, 6);
  }

  function getResourceRequirement(resource) {
    if (!resource) return null;
    if (resource.type === "rock") return { pickaxeTier: 1, label: "Wood Pickaxe" };
    if (resource.type === "ore") {
      const oreKind = resource.oreKind || "iron_ore";
      const level = ORE_LEVELS[oreKind] ?? 2;
      const pick = PICKAXE_TIER_DATA[level] || PICKAXE_TIER_DATA[2];
      return { pickaxeTier: level, label: pick.name };
    }
    if (resource.type === "biomeStone") return { pickaxeTier: 4, label: "Gold Pickaxe" };
    return null;
  }

  function getResourceBaseHp(resource) {
    if (!resource) return 1;
    if (resource.type === "tree") return 4;
    if (resource.type === "rock") return 4;
    if (resource.type === "grass") return 1;
    if (resource.type === "biomeStone") return 6;
    if (resource.type === "ore") {
      const oreKind = resource.oreKind || "iron_ore";
      if (oreKind === "coal") return 4;
      if (oreKind === "iron_ore") return 5;
      if (oreKind === "gold_ore") return 5;
      if (oreKind === "emerald") return 6;
      if (oreKind === "diamond") return 7;
      return 5;
    }
    return 3;
  }

  function stabilizeResourceHp(resource) {
    if (!resource || resource.removed) return;
    const baseHp = getResourceBaseHp(resource);
    const prevMax = Number(resource.maxHp);
    if (!Number.isFinite(prevMax) || prevMax < baseHp) {
      const fallbackMax = Number.isFinite(prevMax) && prevMax > 0 ? prevMax : baseHp;
      const prevHp = Number.isFinite(resource.hp) ? resource.hp : fallbackMax;
      const ratio = clamp(prevHp / fallbackMax, 0, 1);
      resource.maxHp = baseHp;
      resource.hp = Math.max(1, Math.round(baseHp * ratio));
      return;
    }
    if (!Number.isFinite(resource.hp) || resource.hp <= 0 || resource.hp > resource.maxHp) {
      resource.hp = resource.maxHp;
    }
  }

  function getBiomeStoneBiomeCount() {
    return Math.min(BIOMES.length, BIOME_STONES.length);
  }

  function queueBiomeStoneRespawnTask(world, resource, timerOverride = null) {
    if (!world || !resource || resource.type !== "biomeStone") return false;
    if (!Array.isArray(world.respawnTasks)) world.respawnTasks = [];
    const delay = Number.isFinite(timerOverride)
      ? Math.max(1, Number(timerOverride))
      : getBiomeStoneRespawnDelay();
    const existing = world.respawnTasks.find(
      (task) => task?.type === "biomeStone" && task.id === resource.id
    );
    if (existing) {
      existing.tx = resource.tx;
      existing.ty = resource.ty;
      existing.timer = Math.min(
        Math.max(1, Number(existing.timer) || delay),
        delay
      );
      return false;
    }
    world.respawnTasks.push({
      type: "biomeStone",
      id: resource.id,
      tx: resource.tx,
      ty: resource.ty,
      timer: delay,
    });
    return true;
  }

  function canPlaceBiomeStoneAt(world, tx, ty, biomeId, allowResourceId = null) {
    if (!world || !inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    if (world.tiles[idx] !== 1) return false;
    if (world.beachGrid?.[idx]) return false;
    if (Array.isArray(world.biomeGrid) && world.biomeGrid[idx] !== biomeId) return false;
    const occupiedResId = Array.isArray(world.resourceGrid) ? world.resourceGrid[idx] : -1;
    if (
      occupiedResId !== -1
      && occupiedResId !== null
      && occupiedResId !== undefined
      && occupiedResId !== allowResourceId
    ) {
      return false;
    }
    const surface = state.surfaceWorld || state.world;
    if (world === surface) {
      if (getStructureAt(tx, ty)) return false;
      if (getCaveAt(world, tx, ty)) return false;
    }
    return true;
  }

  function findBiomeStoneSpawnTile(world, biomeId, preferredTx = null, preferredTy = null, allowResourceId = null) {
    if (!world || !Number.isInteger(biomeId) || biomeId < 0 || biomeId >= getBiomeStoneBiomeCount()) return null;

    const tryTile = (tx, ty) => {
      if (!canPlaceBiomeStoneAt(world, tx, ty, biomeId, allowResourceId)) return null;
      return { tx, ty };
    };

    if (Number.isFinite(preferredTx) && Number.isFinite(preferredTy)) {
      const baseTx = Math.floor(preferredTx);
      const baseTy = Math.floor(preferredTy);
      const direct = tryTile(baseTx, baseTy);
      if (direct) return direct;
      for (let radius = 1; radius <= 18; radius += 1) {
        for (let dy = -radius; dy <= radius; dy += 1) {
          for (let dx = -radius; dx <= radius; dx += 1) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== radius) continue;
            const found = tryTile(baseTx + dx, baseTy + dy);
            if (found) return found;
          }
        }
      }
    }

    if (Array.isArray(world.islands) && world.islands.length > 0) {
      const candidates = world.islands.filter(
        (island) => island && Number.isInteger(island.biomeId) && island.biomeId === biomeId
      );
      for (const island of candidates) {
        const radius = Math.max(3, Math.floor((Number(island.radius) || 6) * 0.86));
        for (let attempt = 0; attempt < 60; attempt += 1) {
          const angle = Math.random() * Math.PI * 2;
          const dist = Math.random() * radius;
          const tx = Math.floor(island.x + Math.cos(angle) * dist);
          const ty = Math.floor(island.y + Math.sin(angle) * dist);
          const found = tryTile(tx, ty);
          if (found) return found;
        }
      }
    }

    for (let attempt = 0; attempt < 320; attempt += 1) {
      const tx = Math.floor(Math.random() * world.size);
      const ty = Math.floor(Math.random() * world.size);
      const found = tryTile(tx, ty);
      if (found) return found;
    }

    return null;
  }

  function spawnBiomeStoneResource(world, tx, ty, biomeId) {
    if (!canPlaceBiomeStoneAt(world, tx, ty, biomeId)) return null;
    if (!Array.isArray(world.resources)) world.resources = [];
    if (!Array.isArray(world.resourceGrid)) world.resourceGrid = createResourceGrid(world.size);
    const idx = tileIndex(tx, ty, world.size);
    const resource = {
      id: world.resources.length,
      type: "biomeStone",
      biomeId,
      x: (tx + 0.5) * CONFIG.tileSize,
      y: (ty + 0.5) * CONFIG.tileSize,
      tx,
      ty,
      hp: 6,
      maxHp: 6,
      removed: false,
      hitTimer: 0,
      stage: "alive",
      respawnTimer: 0,
    };
    world.resources.push(resource);
    world.resourceGrid[idx] = resource.id;
    return resource;
  }

  function ensureMinimumBiomeStonePerBiome(world) {
    if (!world || !Array.isArray(world.resources)) return false;
    if (!Array.isArray(world.respawnTasks)) world.respawnTasks = [];
    const minActive = Math.max(1, Number(BIOME_STONE_RESPAWN.minActivePerBiome) || 1);
    const biomeCount = getBiomeStoneBiomeCount();
    let changed = false;

    for (let biomeId = 0; biomeId < biomeCount; biomeId += 1) {
      const stones = world.resources.filter(
        (res) => res && res.type === "biomeStone" && res.biomeId === biomeId
      );
      const activeCount = stones.reduce((count, res) => count + Number(!res.removed), 0);
      if (activeCount >= minActive) continue;

      let pending = stones.filter(
        (res) => world.respawnTasks.some((task) => task?.type === "biomeStone" && task.id === res.id)
      ).length;
      const removed = stones.filter((res) => res.removed);

      while (activeCount + pending < minActive && removed.length > 0) {
        const res = removed.shift();
        if (!res) break;
        if (queueBiomeStoneRespawnTask(world, res)) {
          pending += 1;
          changed = true;
        }
      }

      while (activeCount + pending < minActive) {
        const spot = findBiomeStoneSpawnTile(world, biomeId);
        if (!spot) break;
        const spawned = spawnBiomeStoneResource(world, spot.tx, spot.ty, biomeId);
        if (!spawned) break;
        pending += 1;
        changed = true;
      }
    }
    return changed;
  }

  function canHarvestResource(resource, player = state.player) {
    const req = getResourceRequirement(resource);
    if (!req) return { ok: true, reason: "" };
    if (getPickaxeTier(player) >= (req.pickaxeTier || 0)) {
      return { ok: true, reason: "" };
    }
    return { ok: false, reason: `Need ${req.label}` };
  }

  function canDamageMonsters(player = state.player) {
    return getSwordTier(player) > 0;
  }

  function getHarvestDamage(player = state.player) {
    const tier = getPickaxeTier(player);
    const data = PICKAXE_TIER_DATA[tier] || PICKAXE_TIER_DATA[0];
    return Math.max(1, data.damage);
  }

  function getAppliedHarvestDamage(player, resource) {
    let damage = Math.max(1, Math.floor(getHarvestDamage(player)));
    // Keep apex pickaxe rewarding but avoid instant deleting full-health nodes.
    if (getPickaxeTier(player) >= 6 && resource) {
      const targetMaxHp = Number(resource.maxHp);
      const targetHp = Number(resource.hp);
      if (Number.isFinite(targetMaxHp) && targetMaxHp > 1 && Number.isFinite(targetHp) && targetHp >= targetMaxHp) {
        damage = Math.min(damage, Math.max(1, targetMaxHp - 1));
      }
    }
    return damage;
  }

  function getAttackDamage(player = state.player) {
    const swordTier = getSwordTier(player);
    const swordData = SWORD_TIER_DATA[swordTier] || SWORD_TIER_DATA[0];
    const base = 1 + swordData.damage;
    return Math.max(1, base);
  }

  function getAppliedAttackDamage(player, target) {
    let damage = Math.max(1, Math.floor(getAttackDamage(player)));
    // Diamond sword should reliably two-tap full-health targets instead of randomly one-shotting.
    if (getSwordTier(player) >= 5 && target) {
      const targetMaxHp = Number(target.maxHp);
      const targetHp = Number(target.hp);
      if (Number.isFinite(targetMaxHp) && targetMaxHp > 1 && Number.isFinite(targetHp) && targetHp >= targetMaxHp) {
        damage = Math.min(damage, Math.max(1, targetMaxHp - 1));
      }
    }
    return damage;
  }

  function getResourceActionName(resource) {
    if (!resource) return "";
    if (resource.type === "tree") return "Chop tree";
    if (resource.type === "rock") {
      if (resource.dropOverride === "coal") return "Mine coal rock";
      return "Mine rock";
    }
    if (resource.type === "grass") return "Cut grass";
    if (resource.type === "ore") {
      const oreKind = resource.oreKind || "ore";
      const label = ORE_LABELS[oreKind] || "ore";
      return `Mine ${label.toLowerCase()}`;
    }
    if (resource.type === "biomeStone") return "Mine stone";
    return "Harvest";
  }

  function findNearestStructure(player, predicate) {
    let closest = null;
    let closestDist = Infinity;
    for (const structure of state.structures) {
      if (structure.removed) continue;
      if (!predicate(structure)) continue;
      const center = getStructureCenterWorld(structure);
      const sx = center.x;
      const sy = center.y;
      const dist = Math.hypot(sx - player.x, sy - player.y);
      const footprint = getStructureFootprint(structure.type);
      const halfSpanPx = Math.max(footprint.w, footprint.h) * CONFIG.tileSize * 0.5;
      const maxDist = CONFIG.interactRange + Math.max(0, halfSpanPx - CONFIG.tileSize * 0.5);
      if (dist < maxDist && dist < closestDist) {
        closest = structure;
        closestDist = dist;
      }
    }
    return closest;
  }

  function getInteriorLayout(interior) {
    const marginX = Math.max(90, Math.floor(viewWidth * 0.24));
    const marginY = Math.max(88, Math.floor(viewHeight * 0.2));
    const maxTileX = (viewWidth - marginX * 2) / interior.width;
    const maxTileY = (viewHeight - marginY * 2) / interior.height;
    const tileSize = Math.max(20, Math.min(40, Math.floor(Math.min(maxTileX, maxTileY))));
    const widthPx = interior.width * tileSize;
    const heightPx = interior.height * tileSize;
    return {
      tileSize,
      originX: Math.floor((viewWidth - widthPx) / 2),
      originY: Math.floor((viewHeight - heightPx) / 2),
      widthPx,
      heightPx,
    };
  }

  function getInteriorStructureAt(house, tx, ty) {
    const interior = getHouseInterior(house);
    if (!interior) return null;
    return interior.items.find((item) => item.tx === tx && item.ty === ty) ?? null;
  }

  function addInteriorStructure(house, type, tx, ty) {
    const interior = getHouseInterior(house);
    if (!interior) return null;
    const item = {
      id: interior.items.length ? (Math.max(...interior.items.map((entry) => entry.id ?? 0)) + 1) : 1,
      type,
      tx,
      ty,
      storage: type === "chest" ? createEmptyInventory(CHEST_SIZE) : null,
    };
    interior.items.push(item);
    return item;
  }

  function removeInteriorStructure(house, structure) {
    const interior = getHouseInterior(house);
    if (!interior) return;
    const index = interior.items.findIndex((item) => item === structure || item.id === structure.id);
    if (index >= 0) interior.items.splice(index, 1);
  }

  function isInteriorPlaceType(placeType) {
    return placeType === "bed"
      || placeType === "chest"
      || placeType === "campfire"
      || placeType === "smelter"
      || placeType === "sawmill"
      || placeType === "kiln";
  }

  function getInteriorPlacementTile() {
    const house = state.activeHouse;
    const interior = getHouseInterior(house);
    if (!interior || !state.housePlayer) return null;
    if (pointer.active) {
      const layout = getInteriorLayout(interior);
      const tx = Math.floor((pointer.x - layout.originX) / layout.tileSize);
      const ty = Math.floor((pointer.y - layout.originY) / layout.tileSize);
      return { tx, ty };
    }
    const tx = Math.floor(state.housePlayer.x + state.player.facing.x * 0.8);
    const ty = Math.floor(state.housePlayer.y + state.player.facing.y * 0.8);
    return { tx, ty };
  }

  function canPlaceInteriorItem(house, itemId, tx, ty) {
    const interior = getHouseInterior(house);
    const itemDef = ITEMS[itemId];
    if (!interior || !itemDef) return { ok: false, reason: "No interior" };
    if (!isInteriorPlaceType(itemDef.placeType)) return { ok: false, reason: "Outside only" };
    if (tx < 0 || ty < 0 || tx >= interior.width || ty >= interior.height) {
      return { ok: false, reason: "Out of room" };
    }
    if (ty === interior.height - 1 && tx === Math.floor(interior.width / 2)) {
      return { ok: false, reason: "Doorway" };
    }
    const occupied = getInteriorStructureAt(house, tx, ty);
    if (occupied) return { ok: false, reason: "Occupied" };
    return { ok: true };
  }

  function findNearestInteriorStructure(player, house, predicate) {
    const interior = getHouseInterior(house);
    if (!interior || !state.housePlayer) return null;
    let closest = null;
    let closestDist = Infinity;
    for (const item of interior.items) {
      if (!predicate(item)) continue;
      const dx = (item.tx + 0.5) - state.housePlayer.x;
      const dy = (item.ty + 0.5) - state.housePlayer.y;
      const dist = Math.hypot(dx, dy) * CONFIG.tileSize;
      if (dist < CONFIG.interactRange && dist < closestDist) {
        closest = item;
        closestDist = dist;
      }
    }
    return closest;
  }

  function enterHouse(structure) {
    if (!structure || !isHouseType(structure.type)) return;
    ensureHouseMeta(structure);
    const interior = getHouseInterior(structure);
    state.activeHouse = structure;
    state.player.inHut = true;
    state.housePlayer = {
      x: Math.floor(interior.width / 2) + 0.5,
      y: interior.height - 1.1,
    };
    closeStationMenu();
    closeChest();
    closeShipRepairPanel();
    closeInventory();
    buildMenu.classList.add("hidden");
    setPrompt(`Inside ${STRUCTURE_DEFS[structure.type]?.name}`, 1.2);
    if (net.enabled) sendPlayerUpdate();
  }

  function leaveHouse() {
    if (!state.activeHouse) return;
    state.player.inHut = false;
    state.activeHouse = null;
    state.housePlayer = null;
    state.nearBed = null;
    closeStationMenu();
    closeChest();
    closeShipRepairPanel();
    closeInventory();
    setPrompt("Outside", 0.8);
    if (net.enabled) sendPlayerUpdate();
  }

  function getCaveAt(world, tx, ty) {
    if (!world?.caves) return null;
    return world.caves.find((cave) => cave.tx === tx && cave.ty === ty) ?? null;
  }

  function findOpenSurfaceTileNear(world, startTx, startTy, maxRadius = 8) {
    if (!world) return null;
    for (let radius = 0; radius <= maxRadius; radius += 1) {
      for (let dy = -radius; dy <= radius; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          const tx = startTx + dx;
          const ty = startTy + dy;
          if (!inBounds(tx, ty, world.size)) continue;
          const idx = tileIndex(tx, ty, world.size);
          if (!world.tiles[idx]) continue;
          if (getCaveAt(world, tx, ty)) continue;
          const structure = getStructureAt(tx, ty);
          if (structure && !structure.removed) continue;
          return { tx, ty };
        }
      }
    }
    return null;
  }

  function getSafeRespawnTile(world) {
    if (!world) return { x: 0, y: 0 };
    const anchor = state.spawnTile || findSpawnTile(world);
    const anchorX = Number.isFinite(anchor?.x) ? anchor.x : Math.floor(world.size / 2);
    const anchorY = Number.isFinite(anchor?.y) ? anchor.y : Math.floor(world.size / 2);
    const near = findOpenSurfaceTileNear(world, anchorX, anchorY, 16);
    const tile = near
      ? { x: near.tx, y: near.ty }
      : findSpawnTile(world);
    state.spawnTile = { x: tile.x, y: tile.y };
    return state.spawnTile;
  }

  function getSafeRespawnPosition(world) {
    const tile = getSafeRespawnTile(world);
    return {
      x: (tile.x + 0.5) * CONFIG.tileSize,
      y: (tile.y + 0.5) * CONFIG.tileSize,
    };
  }

  function setPlayerCheckpoint(player, world, x, y, force = false) {
    if (!player || !world) return false;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return false;
    const tx = Math.floor(x / CONFIG.tileSize);
    const ty = Math.floor(y / CONFIG.tileSize);
    if (!inBounds(tx, ty, world.size)) return false;
    const tile = findOpenSurfaceTileNear(world, tx, ty, 10);
    if (!tile) return false;
    const next = {
      x: (tile.tx + 0.5) * CONFIG.tileSize,
      y: (tile.ty + 0.5) * CONFIG.tileSize,
    };
    const prev = normalizeCheckpoint(player.checkpoint);
    if (!force && prev && Math.hypot(prev.x - next.x, prev.y - next.y) < 10) {
      return false;
    }
    player.checkpoint = next;
    return true;
  }

  function getPlayerRespawnPosition(player, world) {
    if (!world) return { x: 0, y: 0 };
    const checkpoint = normalizeCheckpoint(player?.checkpoint);
    if (checkpoint && isCheckpointDockBound(world, checkpoint)) {
      const tx = Math.floor(checkpoint.x / CONFIG.tileSize);
      const ty = Math.floor(checkpoint.y / CONFIG.tileSize);
      const tile = findOpenSurfaceTileNear(world, tx, ty, 10);
      if (tile) {
        return {
          x: (tile.tx + 0.5) * CONFIG.tileSize,
          y: (tile.ty + 0.5) * CONFIG.tileSize,
        };
      }
    }
    return getSafeRespawnPosition(world);
  }

  function isCheckpointDockBound(world, checkpoint) {
    if (!world || !checkpoint) return false;
    const tx = Math.floor(checkpoint.x / CONFIG.tileSize);
    const ty = Math.floor(checkpoint.y / CONFIG.tileSize);
    const maxRadius = 2;
    for (let r = 0; r <= maxRadius; r += 1) {
      for (let dy = -r; dy <= r; dy += 1) {
        for (let dx = -r; dx <= r; dx += 1) {
          const nx = tx + dx;
          const ny = ty + dy;
          if (!inBounds(nx, ny, world.size)) continue;
          const structure = getStructureAt(nx, ny);
          if (!structure || structure.removed || structure.type !== "dock") continue;
          const sx = (structure.tx + 0.5) * CONFIG.tileSize;
          const sy = (structure.ty + 0.5) * CONFIG.tileSize;
          if (Math.hypot(sx - checkpoint.x, sy - checkpoint.y) <= CONFIG.tileSize * 1.6) {
            return true;
          }
        }
      }
    }
    return false;
  }

  function shouldBlockCaveHostilesForSurfaceTile(world, tx, ty) {
    return isMushroomBiomeAtTile(world, tx, ty);
  }

  function isCaveHostilesBlocked(surfaceWorld, cave) {
    if (!surfaceWorld || !cave) return false;
    if (typeof cave.hostileBlocked === "boolean") return cave.hostileBlocked;
    cave.hostileBlocked = shouldBlockCaveHostilesForSurfaceTile(surfaceWorld, cave.tx, cave.ty);
    return cave.hostileBlocked;
  }

  function addSurfaceCave(world, tx, ty, preferredId = null, options = null) {
    if (!world) return null;
    if (!Array.isArray(world.caves)) world.caves = [];
    const spawnedByPlayer = !!options?.spawnedByPlayer;
    const hostileBlocked = typeof options?.hostileBlocked === "boolean"
      ? options.hostileBlocked
      : shouldBlockCaveHostilesForSurfaceTile(world, tx, ty);
    const seedInt = world.seedInt ?? seedToInt(world.seed || "island");
    const usedIds = new Set(world.caves.map((entry) => entry.id));
    let id = typeof preferredId === "number" ? preferredId : 0;
    if (!Number.isFinite(id) || usedIds.has(id)) {
      id = 0;
      while (usedIds.has(id)) id += 1;
    }
    clearResourceForStructure(world, tx, ty);
    const cave = {
      id,
      tx,
      ty,
      spawnedByPlayer,
      hostileBlocked,
      world: generateCaveWorld(seedInt, id, { spawnHostiles: !hostileBlocked }),
    };
    world.caves.push(cave);
    return cave;
  }

  function findNearestCave(world, player) {
    if (!world?.caves) return null;
    let closest = null;
    let closestDist = Infinity;
    for (const cave of world.caves) {
      const cx = (cave.tx + 0.5) * CONFIG.tileSize;
      const cy = (cave.ty + 0.5) * CONFIG.tileSize;
      const dist = Math.hypot(cx - player.x, cy - player.y);
      if (dist < CONFIG.interactRange && dist < closestDist) {
        closest = cave;
        closestDist = dist;
      }
    }
    return closest;
  }

  function isMapItem(itemId) {
    return MAP_ITEM_SET.has(itemId);
  }

  function getActiveMapItemId() {
    const slot = state.inventory?.[activeSlot];
    if (!slot?.id) return null;
    return isMapItem(slot.id) ? slot.id : null;
  }

  function getLocalSurfaceMapPosition() {
    if (!state.player) return null;
    if (state.inCave && state.returnPosition) {
      return {
        x: state.returnPosition.x,
        y: state.returnPosition.y,
      };
    }
    return {
      x: state.player.x,
      y: state.player.y,
    };
  }

  function getDebugSurfacePlayerMarkers() {
    const markers = [];
    const local = getLocalSurfaceMapPosition();
    if (local) {
      markers.push({
        id: net.playerId || "local",
        name: net.localName || "You",
        color: net.localColor || COLORS.player,
        x: local.x,
        y: local.y,
        inCave: !!state.inCave,
      });
    }

    for (const player of net.players.values()) {
      if (!player) continue;
      const checkpoint = normalizeCheckpoint(player.checkpoint);
      const worldX = player.inCave
        ? (checkpoint?.x ?? (Number.isFinite(player.x) ? player.x : null))
        : (Number.isFinite(player.renderX) ? player.renderX : player.x);
      const worldY = player.inCave
        ? (checkpoint?.y ?? (Number.isFinite(player.y) ? player.y : null))
        : (Number.isFinite(player.renderY) ? player.renderY : player.y);
      if (!Number.isFinite(worldX) || !Number.isFinite(worldY)) continue;
      markers.push({
        id: player.id || `${worldX.toFixed(2)}:${worldY.toFixed(2)}`,
        name: player.name || "Survivor",
        color: player.color || "#6fa8ff",
        x: worldX,
        y: worldY,
        inCave: !!player.inCave,
      });
    }

    return markers;
  }

  function getVillageCenters(world, options = null) {
    if (!world) return [];
    const includePlayerSpawned = options?.includePlayerSpawned !== false;
    const villageNodes = state.structures
      .filter((structure) => (
        structure
        && !structure.removed
        && !!structure.meta?.village
        && (includePlayerSpawned || !structure.meta?.spawnedByPlayer)
      ))
      .map((structure) => ({
        tx: structure.tx + 0.5,
        ty: structure.ty + 0.5,
      }));
    if (villageNodes.length === 0) return [];
    const clusters = [];
    for (const node of villageNodes) {
      let selected = null;
      let selectedDist = Infinity;
      for (const cluster of clusters) {
        const centerTx = cluster.sumTx / cluster.count;
        const centerTy = cluster.sumTy / cluster.count;
        const dist = Math.hypot(node.tx - centerTx, node.ty - centerTy);
        if (dist < 8 && dist < selectedDist) {
          selected = cluster;
          selectedDist = dist;
        }
      }
      if (!selected) {
        clusters.push({
          sumTx: node.tx,
          sumTy: node.ty,
          count: 1,
        });
      } else {
        selected.sumTx += node.tx;
        selected.sumTy += node.ty;
        selected.count += 1;
      }
    }
    return clusters.map((cluster, index) => {
      const tx = cluster.sumTx / cluster.count;
      const ty = cluster.sumTy / cluster.count;
      return {
        key: `village-${index}-${Math.round(tx * 10)}-${Math.round(ty * 10)}`,
        tx,
        ty,
        x: tx * CONFIG.tileSize,
        y: ty * CONFIG.tileSize,
      };
    });
  }

  function findNearestTarget(targets, fromX, fromY) {
    if (!Array.isArray(targets) || targets.length === 0) return null;
    let closest = null;
    let closestDist = Infinity;
    for (const target of targets) {
      const dist = Math.hypot(target.x - fromX, target.y - fromY);
      if (dist < closestDist) {
        closest = target;
        closestDist = dist;
      }
    }
    return closest;
  }

  function getCompassDirectionLabel(dx, dy) {
    if (!Number.isFinite(dx) || !Number.isFinite(dy)) return "unknown";
    if (Math.hypot(dx, dy) <= CONFIG.tileSize * 0.5) return "here";
    const heading = (Math.atan2(dx, -dy) * 180 / Math.PI + 360) % 360;
    const labels = [
      "north",
      "northeast",
      "east",
      "southeast",
      "south",
      "southwest",
      "west",
      "northwest",
    ];
    const idx = Math.round(heading / 45) % labels.length;
    return labels[idx];
  }

  function getMapItemTitle(mapItemId) {
    if (mapItemId === "village_map") return "Village Wayfinder";
    return "Cave Wayfinder";
  }

  function getMapTargetForItem(world, mapItemId, fromX, fromY) {
    if (!world || !mapItemId) return null;
    if (mapItemId === "village_map") {
      if (!netIsClient()) {
        ensureSurfaceVillagePresence(world);
      }
      const villages = getVillageCenters(world, { includePlayerSpawned: false });
      const nearestVillage = findNearestTarget(villages, fromX, fromY);
      if (!nearestVillage) return null;
      return {
        x: nearestVillage.x,
        y: nearestVillage.y,
        label: "Nearest village",
      };
    }
    if (mapItemId === "cave_map") {
      const caves = (world.caves || [])
        .filter((cave) => cave && !cave.spawnedByPlayer)
        .map((cave) => ({
          key: `cave-${cave.id}`,
          x: (cave.tx + 0.5) * CONFIG.tileSize,
          y: (cave.ty + 0.5) * CONFIG.tileSize,
        }));
      const nearestCave = findNearestTarget(caves, fromX, fromY);
      if (!nearestCave) return null;
      return {
        x: nearestCave.x,
        y: nearestCave.y,
        label: "Nearest cave",
      };
    }
    return null;
  }

  function spawnDrop(itemId, qty, x, y, world = state.world, ttl = DROP_DESPAWN.lifetime) {
    if (qty <= 0 || !world || !ITEMS[itemId]) return;
    world.drops.push({
      id: state.nextDropId++,
      itemId,
      qty,
      x,
      y,
      ttl: clamp(Number(ttl) || DROP_DESPAWN.lifetime, 0, DROP_DESPAWN.lifetime),
    });
    markDirty();
  }

  function getDropSpawnPosition(world, playerX, playerY, facing, tilesAway = 2) {
    const dirX = Number.isFinite(facing?.x) ? facing.x : 1;
    const dirY = Number.isFinite(facing?.y) ? facing.y : 0;
    const len = Math.hypot(dirX, dirY) || 1;
    const nx = dirX / len;
    const ny = dirY / len;
    const distance = CONFIG.tileSize * Math.max(1, tilesAway);
    const targetX = playerX + nx * distance;
    const targetY = playerY + ny * distance;
    const tx = Math.floor(targetX / CONFIG.tileSize);
    const ty = Math.floor(targetY / CONFIG.tileSize);

    if (world && isWalkableTileInWorld(world, tx, ty)) {
      return {
        x: (tx + 0.5) * CONFIG.tileSize,
        y: (ty + 0.5) * CONFIG.tileSize,
      };
    }

    if (world) {
      let best = null;
      let bestScore = Infinity;
      for (let radius = 1; radius <= 3; radius += 1) {
        for (let dy = -radius; dy <= radius; dy += 1) {
          for (let dx = -radius; dx <= radius; dx += 1) {
            const nxTile = tx + dx;
            const nyTile = ty + dy;
            if (!isWalkableTileInWorld(world, nxTile, nyTile)) continue;
            const candidateX = (nxTile + 0.5) * CONFIG.tileSize;
            const candidateY = (nyTile + 0.5) * CONFIG.tileSize;
            const fromPlayer = Math.hypot(candidateX - playerX, candidateY - playerY);
            if (fromPlayer < CONFIG.tileSize * 1.4) continue;
            const score = Math.hypot(candidateX - targetX, candidateY - targetY);
            if (score < bestScore) {
              bestScore = score;
              best = { x: candidateX, y: candidateY };
            }
          }
        }
      }
      if (best) return best;
    }

    return { x: targetX, y: targetY };
  }

  function getDropSourceSlotIndex() {
    if (selectedSlot?.scope === "inventory" && Number.isInteger(selectedSlot.index)) {
      return clamp(selectedSlot.index, 0, INVENTORY_SIZE - 1);
    }
    return clamp(activeSlot, 0, HOTBAR_SIZE - 1);
  }

  function dropSelectedItem() {
    if (!state.player || !Array.isArray(state.inventory)) return;
    if (state.player.inHut) {
      setPrompt("Leave house to drop items", 1);
      return;
    }

    const slotIndex = getDropSourceSlotIndex();
    const slot = state.inventory[slotIndex];
    if (!slot?.id || slot.qty <= 0) {
      setPrompt("No item selected", 0.9);
      return;
    }

    const dropQty = slot.qty;
    const dropItemId = slot.id;
    const world = state.world;
    const dropPos = getDropSpawnPosition(world, state.player.x, state.player.y, state.player.facing, 2);
    slot.id = null;
    slot.qty = 0;
    if (selectedSlot?.scope === "inventory" && selectedSlot.index === slotIndex) {
      selectedSlot = null;
    }
    updateAllSlotUI();
    playSfx("ui");

    if (netIsClientReady()) {
      sendToHost({
        type: "dropItem",
        world: state.inCave ? "cave" : "surface",
        caveId: state.activeCave?.id ?? null,
        itemId: dropItemId,
        qty: dropQty,
        x: dropPos.x,
        y: dropPos.y,
      });
    } else {
      spawnDrop(dropItemId, dropQty, dropPos.x, dropPos.y, world);
    }

    markDirty();
    setPrompt(`Dropped ${ITEMS[dropItemId]?.name || dropItemId}`, 0.9);
  }

  function updateDropsInWorld(world, dt = 0, allowPickup = false) {
    if (!world) return { changed: false, pickedUp: false };
    if (!Array.isArray(world.drops)) world.drops = [];
    const step = Number.isFinite(dt) ? Math.max(0, dt) : 0;
    const authoritative = !netIsClientReady();
    let changed = false;
    let pickedUp = false;

    for (const drop of world.drops) {
      if (!drop) continue;
      drop.qty = Math.max(0, Math.floor(Number(drop.qty) || 0));
      if (drop.qty <= 0) continue;
      if (!Number.isFinite(drop.ttl)) {
        drop.ttl = DROP_DESPAWN.lifetime;
        changed = true;
      }

      if (authoritative) {
        drop.ttl = Math.max(0, drop.ttl - step);
        if (drop.ttl <= 0) {
          drop.qty = 0;
          changed = true;
          continue;
        }
      } else {
        // Smooth local warning visuals between host snapshots.
        drop.ttl = Math.max(0, drop.ttl - step);
      }

      if (!allowPickup || !state.player) continue;
      const dist = Math.hypot(drop.x - state.player.x, drop.y - state.player.y);
      if (dist < CONFIG.interactRange * 0.8) {
        const beforeQty = drop.qty;
        const remaining = addItem(state.inventory, drop.itemId, beforeQty);
        if (remaining < beforeQty) {
          const pickedQty = beforeQty - remaining;
          drop.qty = remaining;
          changed = true;
          pickedUp = true;
          markDirty();
          if (netIsClient()) {
            sendToHost({
              type: "dropPickup",
              world: state.inCave ? "cave" : "surface",
              caveId: state.activeCave?.id ?? null,
              dropId: drop.id,
              qty: pickedQty,
              itemId: drop.itemId,
              x: drop.x,
              y: drop.y,
            });
          }
        }
      }
    }

    const previousCount = world.drops.length;
    if (authoritative) {
      world.drops = world.drops.filter((drop) => drop && drop.qty > 0 && drop.ttl > 0);
    } else {
      world.drops = world.drops.filter((drop) => drop && drop.qty > 0);
    }
    if (world.drops.length !== previousCount) changed = true;
    if (authoritative && changed) markDirty();
    return { changed, pickedUp };
  }

  function updateDrops(dt = 0) {
    if (!state.world) return;
    const step = Number.isFinite(dt) ? Math.max(0, dt) : 0;

    const authoritative = !netIsClientReady();
    const worlds = [state.world];
    if (authoritative && state.surfaceWorld && state.surfaceWorld !== state.world) {
      worlds.push(state.surfaceWorld);
    }
    if (authoritative && Array.isArray(state.surfaceWorld?.caves)) {
      for (const cave of state.surfaceWorld.caves) {
        if (!cave?.world) continue;
        if (cave.world === state.world) continue;
        worlds.push(cave.world);
      }
    }

    const canPickup = !!state.player && !state.player.inHut;
    let inventoryChanged = false;
    for (const world of worlds) {
      const result = updateDropsInWorld(world, step, world === state.world && canPickup);
      if (result.pickedUp) inventoryChanged = true;
    }
    if (inventoryChanged) updateAllSlotUI();
  }

  function applyHarvestToResource(world, resource, damage, awardItems, emitSfx = true) {
    if (!resource || resource.removed) return;
    const dropId = getResourceDropId(resource);
    if (!dropId) return;
    const dropQty = getResourceDropQty(resource);
    stabilizeResourceHp(resource);

    const prevHp = Number.isFinite(resource.hp) ? resource.hp : resource.maxHp;
    let nextDamage = Math.max(1, Math.floor(Number(damage) || 1));
    // Keep full nodes from being one-tapped due bad legacy HP data or malformed messages.
    if (resource.type !== "grass" && resource.hp === resource.maxHp) {
      nextDamage = Math.min(nextDamage, Math.max(1, resource.maxHp - 1));
    }
    resource.hp -= nextDamage;
    resource.hitTimer = 0.18;
    const didBreak = resource.hp <= 0;
    if (emitSfx) {
      const hpRatio = resource.maxHp > 0 ? clamp(resource.hp / resource.maxHp, 0, 1) : 1;
      if (resource.type === "tree") {
        if (didBreak) playSfx("treeBreak");
        else if (hpRatio < 0.36 || prevHp <= 2) playSfx("treeHitLow");
        else playSfx("treeHit");
      } else if (resource.type === "grass") {
        playSfx(didBreak ? "grassCut" : "grassRustle");
      } else if (resource.type === "ore" || resource.dropOverride === "coal") {
        playSfx(didBreak ? "oreBreak" : "oreHit");
      } else if (resource.type === "rock" || resource.type === "biomeStone") {
        playSfx(didBreak ? "stoneBreak" : "stoneHit", {
          intensity: resource.type === "biomeStone" ? 1.15 : 1,
        });
      } else {
        playSfx("hit");
      }
    }

    if (didBreak) {
      if (resource.type === "tree") {
        resource.hp = 0;
        resource.stage = "stump";
        resource.removed = false;
        resource.respawnTimer = RESPAWN.treeStump;
        const idx = tileIndex(resource.tx, resource.ty, world.size);
        world.resourceGrid[idx] = resource.id;
      } else {
        resource.removed = true;
        const idx = tileIndex(resource.tx, resource.ty, world.size);
        world.resourceGrid[idx] = -1;
        if (!Array.isArray(world.respawnTasks)) world.respawnTasks = [];
        if (
          resource.type === "rock"
          || resource.type === "grass"
          || resource.type === "biomeStone"
          || resource.type === "ore"
        ) {
          const respawnType = resource.type === "biomeStone"
            ? "biomeStone"
            : (resource.type === "ore" ? "ore" : resource.type);
          const respawnDelay = respawnType === "biomeStone"
            ? getBiomeStoneRespawnDelay()
            : (respawnType === "grass" ? RESPAWN.grass : (respawnType === "ore" ? RESPAWN.ore : RESPAWN.rock));
          const exists = world.respawnTasks.some((task) => task?.type === respawnType && task.id === resource.id);
          if (!exists) {
            world.respawnTasks.push({
              type: respawnType,
              id: resource.id,
              tx: resource.tx,
              ty: resource.ty,
              timer: respawnDelay,
            });
          }
        }
      }
      if (awardItems) {
        addItem(state.inventory, dropId, dropQty);
        updateAllSlotUI();
        setPrompt(`Collected ${ITEMS[dropId].name} x${dropQty}`, 1);
      }
      markDirty();
      return;
    }

    markDirty();
  }

  function attemptHarvest(resource) {
    if (!resource) return;

    const dropId = getResourceDropId(resource);
    if (!dropId) return;
    const dropQty = getResourceDropQty(resource);

    const gate = canHarvestResource(resource);
    if (!gate.ok) {
      setPrompt(gate.reason, 1.1);
      return;
    }

    if (!canAddItem(state.inventory, dropId, dropQty)) {
      setPrompt("Inventory full", 1.2);
      return;
    }

    const damage = getAppliedHarvestDamage(state.player, resource);
    applyHarvestToResource(state.world, resource, damage, true);

    if (netIsClient()) {
      sendToHost({
        type: "harvest",
        world: state.inCave ? "cave" : "surface",
        caveId: state.activeCave?.id ?? null,
        resId: resource.id,
        damage,
        unlocks: normalizeUnlocks(state.player.unlocks),
      });
    }
  }

  function updateAllSlotUI() {
    for (let i = 0; i < inventorySlots.length; i += 1) {
      const slotData = state.inventory[i];
      const view = inventorySlots[i];
      const hotbar = hotbarSlots[i];
      const selected = selectedSlot && selectedSlot.scope === "inventory" && selectedSlot.index === i;
      const active = i === activeSlot;
      applySlotView(view, slotData, selected, false);
      if (hotbar) applySlotView(hotbar, slotData, selected, active);
    }

    if (state.activeChest && state.activeChest.storage) {
      for (let i = 0; i < chestSlots.length; i += 1) {
        const slotData = state.activeChest.storage[i];
        const view = chestSlots[i];
        const selected = selectedSlot && selectedSlot.scope === "chest" && selectedSlot.index === i;
        applySlotView(view, slotData, selected, false);
      }
    }

    if (buildMenuOpen()) {
      renderBuildMenu();
    }

    if (state.activeStation) {
      renderStationMenu();
    }

    if (state.activeShipRepair) {
      renderShipRepairPanel();
    }

    if (state.settingsTab === "objectives") {
      renderObjectiveGuide();
    }
  }

  function drawRoundedRect(pathCtx, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(r, Math.min(w, h) * 0.5));
    pathCtx.beginPath();
    pathCtx.moveTo(x + radius, y);
    pathCtx.arcTo(x + w, y, x + w, y + h, radius);
    pathCtx.arcTo(x + w, y + h, x, y + h, radius);
    pathCtx.arcTo(x, y + h, x, y, radius);
    pathCtx.arcTo(x, y, x + w, y, radius);
    pathCtx.closePath();
  }

  function drawItemTexture(iconCtx, itemId, size) {
    if (!iconCtx) return;
    iconCtx.clearRect(0, 0, size, size);
    const visual = ITEM_VISUALS[itemId] || ITEM_VISUALS.wood;
    const border = visual.border || "#9dbbd9";
    const bg = visual.bg || "#355372";
    const gradient = iconCtx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, tintColor(bg, 0.2));
    gradient.addColorStop(1, tintColor(bg, -0.18));
    drawRoundedRect(iconCtx, 1.5, 1.5, size - 3, size - 3, 6);
    iconCtx.fillStyle = gradient;
    iconCtx.fill();
    iconCtx.strokeStyle = border;
    iconCtx.lineWidth = 1.4;
    iconCtx.stroke();

    const cx = size * 0.5;
    const cy = size * 0.5;
    const s = size;
    iconCtx.lineCap = "round";
    iconCtx.lineJoin = "round";

    switch (itemId) {
      case "tree_resource":
        iconCtx.fillStyle = "#7a532f";
        iconCtx.fillRect(cx - s * 0.07, cy - s * 0.04, s * 0.14, s * 0.3);
        iconCtx.fillStyle = "#2ba061";
        iconCtx.beginPath();
        iconCtx.arc(cx - s * 0.13, cy - s * 0.12, s * 0.14, 0, Math.PI * 2);
        iconCtx.arc(cx + s * 0.13, cy - s * 0.12, s * 0.14, 0, Math.PI * 2);
        iconCtx.arc(cx, cy - s * 0.23, s * 0.15, 0, Math.PI * 2);
        iconCtx.fill();
        iconCtx.fillStyle = "rgba(225, 255, 236, 0.24)";
        iconCtx.beginPath();
        iconCtx.arc(cx - s * 0.04, cy - s * 0.19, s * 0.07, 0, Math.PI * 2);
        iconCtx.fill();
        break;
      case "stop_icon":
        iconCtx.fillStyle = "#f5d4d4";
        drawRoundedRect(iconCtx, cx - s * 0.22, cy - s * 0.22, s * 0.44, s * 0.44, 4);
        iconCtx.fill();
        iconCtx.strokeStyle = "#cc5f5f";
        iconCtx.lineWidth = 1.8;
        iconCtx.beginPath();
        iconCtx.moveTo(cx - s * 0.12, cy);
        iconCtx.lineTo(cx + s * 0.12, cy);
        iconCtx.stroke();
        break;
      case "wood":
      case "plank":
      case "stick":
        iconCtx.fillStyle = "#8f6238";
        iconCtx.fillRect(cx - s * 0.26, cy - s * 0.18, s * 0.52, s * 0.36);
        iconCtx.strokeStyle = "#c69461";
        iconCtx.lineWidth = 1.2;
        iconCtx.strokeRect(cx - s * 0.26, cy - s * 0.18, s * 0.52, s * 0.36);
        if (itemId === "stick") {
          iconCtx.strokeStyle = "#e3c08d";
          iconCtx.lineWidth = 2;
          iconCtx.beginPath();
          iconCtx.moveTo(cx - s * 0.18, cy + s * 0.13);
          iconCtx.lineTo(cx + s * 0.17, cy - s * 0.12);
          iconCtx.moveTo(cx - s * 0.18, cy - s * 0.12);
          iconCtx.lineTo(cx + s * 0.16, cy + s * 0.13);
          iconCtx.stroke();
        } else {
          iconCtx.strokeStyle = "rgba(54,35,20,0.4)";
          iconCtx.beginPath();
          iconCtx.moveTo(cx - s * 0.18, cy - s * 0.11);
          iconCtx.lineTo(cx + s * 0.18, cy - s * 0.11);
          iconCtx.moveTo(cx - s * 0.18, cy);
          iconCtx.lineTo(cx + s * 0.18, cy);
          iconCtx.stroke();
        }
        break;
      case "grass":
        iconCtx.strokeStyle = "#7bd494";
        iconCtx.lineWidth = 1.8;
        iconCtx.beginPath();
        iconCtx.moveTo(cx - s * 0.2, cy + s * 0.24);
        iconCtx.lineTo(cx - s * 0.08, cy - s * 0.04);
        iconCtx.moveTo(cx - s * 0.04, cy + s * 0.22);
        iconCtx.lineTo(cx, cy - s * 0.18);
        iconCtx.moveTo(cx + s * 0.06, cy + s * 0.22);
        iconCtx.lineTo(cx + s * 0.18, cy - s * 0.06);
        iconCtx.stroke();
        iconCtx.fillStyle = "rgba(220,255,232,0.3)";
        iconCtx.beginPath();
        iconCtx.arc(cx + s * 0.1, cy - s * 0.05, s * 0.06, 0, Math.PI * 2);
        iconCtx.fill();
        break;
      case "paper":
        iconCtx.fillStyle = "#f2e8c3";
        drawRoundedRect(iconCtx, cx - s * 0.2, cy - s * 0.22, s * 0.4, s * 0.44, 4);
        iconCtx.fill();
        iconCtx.strokeStyle = "rgba(126,100,61,0.45)";
        iconCtx.lineWidth = 1;
        iconCtx.stroke();
        iconCtx.strokeStyle = "rgba(126,100,61,0.4)";
        iconCtx.beginPath();
        iconCtx.moveTo(cx - s * 0.14, cy - s * 0.06);
        iconCtx.lineTo(cx + s * 0.14, cy - s * 0.06);
        iconCtx.moveTo(cx - s * 0.14, cy + s * 0.01);
        iconCtx.lineTo(cx + s * 0.1, cy + s * 0.01);
        iconCtx.stroke();
        break;
      case "village_map":
      case "cave_map":
        iconCtx.fillStyle = itemId === "village_map" ? "#e6dab0" : "#c9d6f1";
        drawRoundedRect(iconCtx, cx - s * 0.24, cy - s * 0.2, s * 0.48, s * 0.4, 5);
        iconCtx.fill();
        iconCtx.strokeStyle = "rgba(76,65,45,0.45)";
        iconCtx.lineWidth = 1;
        iconCtx.stroke();
        iconCtx.strokeStyle = itemId === "village_map" ? "#3d8f5c" : "#6f8ac8";
        iconCtx.lineWidth = 1.8;
        iconCtx.beginPath();
        iconCtx.moveTo(cx - s * 0.18, cy + s * 0.05);
        iconCtx.lineTo(cx - s * 0.03, cy - s * 0.1);
        iconCtx.lineTo(cx + s * 0.1, cy - s * 0.02);
        iconCtx.lineTo(cx + s * 0.2, cy - s * 0.12);
        iconCtx.stroke();
        iconCtx.strokeStyle = itemId === "village_map" ? "#b64d4d" : "#f2c66a";
        iconCtx.lineWidth = 1.5;
        iconCtx.beginPath();
        iconCtx.moveTo(cx + s * 0.12, cy + s * 0.02);
        iconCtx.lineTo(cx + s * 0.2, cy + s * 0.1);
        iconCtx.moveTo(cx + s * 0.2, cy + s * 0.02);
        iconCtx.lineTo(cx + s * 0.12, cy + s * 0.1);
        iconCtx.stroke();
        break;
      case "stone":
      case "ore":
      case "ingot":
      case "coal":
      case "iron_ore":
      case "gold_ore":
      case "emerald":
      case "diamond":
      case "iron_ingot":
      case "gold_ingot":
      case "brick":
      case "temperate_stone":
      case "jungle_stone":
      case "snow_stone":
      case "volcanic_stone":
        iconCtx.fillStyle = ITEMS[itemId]?.color || "#9ea8b8";
        iconCtx.beginPath();
        iconCtx.moveTo(cx - s * 0.24, cy + s * 0.18);
        iconCtx.lineTo(cx - s * 0.28, cy - s * 0.02);
        iconCtx.lineTo(cx - s * 0.1, cy - s * 0.24);
        iconCtx.lineTo(cx + s * 0.16, cy - s * 0.2);
        iconCtx.lineTo(cx + s * 0.28, cy + s * 0.04);
        iconCtx.lineTo(cx + s * 0.1, cy + s * 0.22);
        iconCtx.closePath();
        iconCtx.fill();
        iconCtx.fillStyle = "rgba(255,255,255,0.25)";
        iconCtx.beginPath();
        iconCtx.arc(cx - s * 0.05, cy - s * 0.1, s * 0.08, 0, Math.PI * 2);
        iconCtx.fill();
        if (itemId === "coal") {
          iconCtx.fillStyle = "rgba(255,255,255,0.08)";
          iconCtx.beginPath();
          iconCtx.arc(cx + s * 0.08, cy + s * 0.03, s * 0.06, 0, Math.PI * 2);
          iconCtx.fill();
        }
        if (itemId === "gold_ore" || itemId === "gold_ingot") {
          iconCtx.fillStyle = "rgba(255, 236, 175, 0.35)";
          iconCtx.fillRect(cx - s * 0.04, cy - s * 0.05, s * 0.18, s * 0.06);
        }
        if (itemId === "emerald" || itemId === "diamond") {
          iconCtx.strokeStyle = "rgba(235, 255, 255, 0.55)";
          iconCtx.lineWidth = 1;
          iconCtx.beginPath();
          iconCtx.moveTo(cx - s * 0.11, cy + s * 0.01);
          iconCtx.lineTo(cx + s * 0.08, cy - s * 0.12);
          iconCtx.stroke();
        }
        break;
      case "raw_meat":
      case "cooked_meat":
        iconCtx.fillStyle = itemId === "raw_meat" ? "#c56662" : "#cf8d5e";
        iconCtx.beginPath();
        iconCtx.ellipse(cx, cy, s * 0.23, s * 0.16, 0.3, 0, Math.PI * 2);
        iconCtx.fill();
        iconCtx.fillStyle = "rgba(255,240,220,0.45)";
        iconCtx.beginPath();
        iconCtx.arc(cx - s * 0.06, cy - s * 0.03, s * 0.05, 0, Math.PI * 2);
        iconCtx.fill();
        break;
      case "hide":
        iconCtx.fillStyle = "#8f6d49";
        iconCtx.beginPath();
        iconCtx.moveTo(cx - s * 0.24, cy - s * 0.06);
        iconCtx.lineTo(cx - s * 0.08, cy - s * 0.22);
        iconCtx.lineTo(cx + s * 0.18, cy - s * 0.16);
        iconCtx.lineTo(cx + s * 0.23, cy + s * 0.08);
        iconCtx.lineTo(cx + s * 0.02, cy + s * 0.22);
        iconCtx.lineTo(cx - s * 0.2, cy + s * 0.14);
        iconCtx.closePath();
        iconCtx.fill();
        break;
      case "bridge":
      case "dock":
        iconCtx.fillStyle = "#886b43";
        iconCtx.fillRect(cx - s * 0.26, cy - s * 0.16, s * 0.52, s * 0.32);
        iconCtx.strokeStyle = "#d2b883";
        iconCtx.lineWidth = 1;
        for (let i = -2; i <= 2; i += 1) {
          iconCtx.beginPath();
          iconCtx.moveTo(cx - s * 0.22, cy + i * s * 0.06);
          iconCtx.lineTo(cx + s * 0.22, cy + i * s * 0.06);
          iconCtx.stroke();
        }
        break;
      case "small_house":
      case "medium_house":
      case "large_house":
        iconCtx.fillStyle = "#8d6946";
        iconCtx.fillRect(cx - s * 0.2, cy - s * 0.02, s * 0.4, s * 0.24);
        iconCtx.fillStyle = "#6d4d31";
        iconCtx.beginPath();
        iconCtx.moveTo(cx - s * 0.25, cy);
        iconCtx.lineTo(cx, cy - s * 0.22);
        iconCtx.lineTo(cx + s * 0.25, cy);
        iconCtx.closePath();
        iconCtx.fill();
        iconCtx.fillStyle = "#3a2a1b";
        iconCtx.fillRect(cx - s * 0.05, cy + s * 0.06, s * 0.1, s * 0.14);
        break;
      case "bed":
        iconCtx.fillStyle = "#d8c7ad";
        iconCtx.fillRect(cx - s * 0.24, cy - s * 0.12, s * 0.48, s * 0.28);
        iconCtx.fillStyle = "#7ea0c3";
        iconCtx.fillRect(cx - s * 0.24, cy - s * 0.12, s * 0.48, s * 0.1);
        break;
      case "campfire":
        iconCtx.fillStyle = "#a86b3e";
        iconCtx.beginPath();
        iconCtx.arc(cx, cy, s * 0.14, 0, Math.PI * 2);
        iconCtx.fill();
        iconCtx.fillStyle = "#f7d074";
        iconCtx.beginPath();
        iconCtx.moveTo(cx, cy - s * 0.18);
        iconCtx.lineTo(cx - s * 0.09, cy + s * 0.02);
        iconCtx.lineTo(cx + s * 0.09, cy + s * 0.02);
        iconCtx.closePath();
        iconCtx.fill();
        break;
      case "smelter":
      case "sawmill":
      case "kiln":
      case "chest":
        iconCtx.fillStyle = itemId === "smelter" ? "#95534b" : (itemId === "sawmill" ? "#7c6842" : (itemId === "kiln" ? "#b4765a" : "#8e633a"));
        iconCtx.fillRect(cx - s * 0.2, cy - s * 0.2, s * 0.4, s * 0.4);
        iconCtx.fillStyle = itemId === "chest" ? "#d2bb7a" : "#2a201b";
        iconCtx.fillRect(cx - s * 0.08, cy - s * 0.03, s * 0.16, s * 0.14);
        break;
      case "robot":
        iconCtx.fillStyle = "#456484";
        iconCtx.fillRect(cx - s * 0.2, cy - s * 0.02, s * 0.4, s * 0.24);
        iconCtx.fillStyle = "#658ab3";
        iconCtx.fillRect(cx - s * 0.14, cy - s * 0.18, s * 0.28, s * 0.18);
        iconCtx.fillStyle = "#d8eeff";
        iconCtx.fillRect(cx - s * 0.09, cy - s * 0.12, s * 0.08, s * 0.06);
        iconCtx.fillRect(cx + s * 0.01, cy - s * 0.12, s * 0.08, s * 0.06);
        iconCtx.strokeStyle = "rgba(220, 245, 255, 0.55)";
        iconCtx.lineWidth = 1;
        iconCtx.beginPath();
        iconCtx.moveTo(cx - s * 0.2, cy + s * 0.03);
        iconCtx.lineTo(cx - s * 0.27, cy + s * 0.11);
        iconCtx.moveTo(cx + s * 0.2, cy + s * 0.03);
        iconCtx.lineTo(cx + s * 0.27, cy + s * 0.11);
        iconCtx.stroke();
        break;
      case "beacon_core":
      case "beacon":
        iconCtx.fillStyle = itemId === "beacon" ? "#d0b46a" : "#89bedf";
        iconCtx.fillRect(cx - s * 0.05, cy - s * 0.2, s * 0.1, s * 0.38);
        iconCtx.fillStyle = "#f5d975";
        iconCtx.beginPath();
        iconCtx.arc(cx, cy - s * 0.2, s * 0.08, 0, Math.PI * 2);
        iconCtx.fill();
        break;
      case "medicine":
        iconCtx.fillStyle = "#71bc84";
        iconCtx.fillRect(cx - s * 0.18, cy - s * 0.18, s * 0.36, s * 0.36);
        iconCtx.fillStyle = "#f2fff4";
        iconCtx.fillRect(cx - s * 0.03, cy - s * 0.12, s * 0.06, s * 0.24);
        iconCtx.fillRect(cx - s * 0.12, cy - s * 0.03, s * 0.24, s * 0.06);
        break;
      default:
        iconCtx.fillStyle = visual.fg || "#f2f8ff";
        iconCtx.font = `bold ${Math.floor(size * 0.24)}px Trebuchet MS`;
        iconCtx.textAlign = "center";
        iconCtx.textBaseline = "middle";
        iconCtx.fillText((visual.symbol || "?").slice(0, 3), cx, cy + 1);
        break;
    }
  }

  function getItemTextureUrl(itemId, size = 30) {
    const key = `${itemId}:${size}`;
    if (itemTextureCache.has(key)) return itemTextureCache.get(key);
    const texCanvas = document.createElement("canvas");
    texCanvas.width = size;
    texCanvas.height = size;
    const texCtx = texCanvas.getContext("2d");
    drawItemTexture(texCtx, itemId, size);
    const url = texCanvas.toDataURL("image/png");
    itemTextureCache.set(key, url);
    return url;
  }

  function formatItemLabel(itemId) {
    const raw = ITEMS[itemId]?.name || itemId || "";
    return String(raw)
      .replace(/\s*\(Legacy\)\s*$/i, "")
      .trim();
  }

  function applyItemVisual(element, itemId, compact = false) {
    element.innerHTML = "";
    const icon = document.createElement("span");
    icon.className = compact ? "slot-icon slot-icon-compact" : "slot-icon";
    const img = document.createElement("img");
    img.className = compact ? "slot-icon-img slot-icon-img-compact" : "slot-icon-img";
    img.alt = ITEMS[itemId]?.name || itemId || "item";
    img.src = getItemTextureUrl(itemId, compact ? 30 : 34);
    icon.appendChild(img);
    element.appendChild(icon);
    if (!compact) {
      const label = document.createElement("span");
      label.className = "slot-label";
      label.textContent = formatItemLabel(itemId);
      element.appendChild(label);
    }
  }

  function applySlotView(view, slotData, selected, active) {
    if (!view) return;
    if (selected) {
      view.el.classList.add("selected");
    } else {
      view.el.classList.remove("selected");
    }

    if (active) {
      view.el.classList.add("active");
    } else {
      view.el.classList.remove("active");
    }

    if (!slotData || !slotData.id) {
      view.item.innerHTML = "";
      view.count.textContent = "";
      return;
    }

    applyItemVisual(view.item, slotData.id);
    view.count.textContent = slotData.qty > 1 ? String(slotData.qty) : "";
  }

  function handleSlotClick(scope, index) {
    if (inventoryOpen || state.activeChest) {
      const chestStorage = state.activeChest?.storage || null;
      const sourceList = scope === "inventory" ? state.inventory : chestStorage;
      if (!sourceList || !sourceList[index]) return;

      if (!selectedSlot && chestStorage && sourceList[index]?.id) {
        const quickMoved = scope === "inventory"
          ? moveSlotToFirstAvailable(state.inventory, index, chestStorage)
          : moveSlotToFirstAvailable(chestStorage, index, state.inventory);
        if (quickMoved) {
          markDirty();
          sendChestUpdate(state.activeChest);
          updateAllSlotUI();
          return;
        }
      }

      if (!selectedSlot) {
        if (sourceList[index]?.id) {
          selectedSlot = { scope, index };
        }
      } else if (selectedSlot.scope === scope && selectedSlot.index === index) {
        selectedSlot = null;
      } else {
        const fromList = selectedSlot.scope === "inventory" ? state.inventory : state.activeChest?.storage;
        const toList = scope === "inventory" ? state.inventory : state.activeChest?.storage;
        if (fromList && toList) {
          moveSlotBetween(fromList, selectedSlot.index, toList, index);
          markDirty();
          if (state.activeChest) {
            sendChestUpdate(state.activeChest);
          }
        }
        selectedSlot = null;
      }
      updateAllSlotUI();
      return;
    }

    if (scope === "inventory" && index < HOTBAR_SIZE) {
      setActiveSlot(index);
    }
  }

  function setupSlots() {
    for (let i = 0; i < HOTBAR_SIZE; i += 1) {
      const el = document.createElement("div");
      el.className = "slot";
      const item = document.createElement("div");
      item.className = "slot-item";
      const count = document.createElement("div");
      count.className = "slot-count";
      el.appendChild(item);
      el.appendChild(count);
      el.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        ensureAudioContext();
        handleSlotClick("inventory", i);
      });
      hotbarEl.appendChild(el);
      hotbarSlots.push({ el, item, count });
    }

    for (let i = 0; i < INVENTORY_SIZE; i += 1) {
      const el = document.createElement("div");
      el.className = "slot";
      const item = document.createElement("div");
      item.className = "slot-item";
      const count = document.createElement("div");
      count.className = "slot-count";
      el.appendChild(item);
      el.appendChild(count);
      el.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        ensureAudioContext();
        handleSlotClick("inventory", i);
      });
      inventorySlotsEl.appendChild(el);
      inventorySlots.push({ el, item, count });
    }

    for (let i = 0; i < CHEST_SIZE; i += 1) {
      const el = document.createElement("div");
      el.className = "slot";
      const item = document.createElement("div");
      item.className = "slot-item";
      const count = document.createElement("div");
      count.className = "slot-count";
      el.appendChild(item);
      el.appendChild(count);
      el.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        ensureAudioContext();
        handleSlotClick("chest", i);
      });
      chestSlotsEl.appendChild(el);
      chestSlots.push({ el, item, count });
    }
  }

  function buildMenuOpen() {
    return state.nearBench && !state.inCave && !state.player.inHut && !state.gameWon;
  }

  function openInventory() {
    inventoryOpen = true;
    inventoryPanel.classList.remove("hidden");
  }

  function closeInventory() {
    inventoryOpen = false;
    inventoryPanel.classList.add("hidden");
    selectedSlot = null;
  }

  function toggleInventory() {
    if (inventoryOpen) {
      closeInventory();
      if (state.activeChest) closeChest();
    } else {
      openInventory();
    }
    updateAllSlotUI();
  }

  function openStationMenu(structure) {
    if (!structure) return;
    if (structure.type === "robot") {
      ensureRobotMeta(structure);
      if (structure.meta?.wildSpawn) {
        if (netIsClientReady()) {
          setPrompt("Abandoned robot surveyed", 1.1);
        } else {
          const discovered = setRobotDiscovered(structure, true);
          if (discovered) {
            setPrompt("Abandoned robot surveyed", 1.1);
            markDirty();
          }
        }
      }
      if (netIsClientReady()) {
        sendRobotCommand(structure, "ping");
      } else {
        setRobotInteractionPause(structure, ROBOT_CONFIG.interactionPause);
      }
    }
    state.activeStation = structure;
    stationMenu.classList.remove("hidden");
    renderStationMenu();
  }

  function closeStationMenu() {
    if (state.activeStation?.type === "robot" && netIsClientReady()) {
      sendRobotCommand(state.activeStation, "ping");
    }
    state.activeStation = null;
    stationMenu.classList.add("hidden");
  }

  function isSurfaceStorageStructure(structure) {
    return !!structure
      && !structure.removed
      && (structure.type === "chest" || structure.type === "robot" || structure.type === "shipwreck");
  }

  function isDirectChestStructure(structure) {
    return !!structure
      && !structure.removed
      && (structure.type === "chest" || structure.type === "shipwreck");
  }

  function openChest(structure) {
    if (!structure) return;
    if (!structure.storage) {
      structure.storage = createEmptyInventory(
        structure.type === "robot" ? ROBOT_STORAGE_SIZE : SHIPWRECK_STORAGE_SIZE
      );
    }
    state.activeChest = structure;
    if (chestPanelTitle) {
      chestPanelTitle.textContent = structure.type === "robot"
        ? "Robot Cargo"
        : (structure.type === "shipwreck" ? "Shipwreck Chest" : "Chest");
    }
    if (chestPanelHint) {
      chestPanelHint.textContent = structure.type === "robot"
        ? "Click once to quick-transfer between robot storage and inventory."
        : "Click items to quick-transfer between chest and inventory.";
    }
    if (destroyChestBtn) {
      destroyChestBtn.classList.toggle("hidden", structure.type !== "chest");
    }
    openInventory();
    chestPanel.classList.remove("hidden");
    updateAllSlotUI();
  }

  function closeChest() {
    state.activeChest = null;
    chestPanel.classList.add("hidden");
    if (destroyChestBtn) destroyChestBtn.classList.remove("hidden");
    if (chestPanelTitle) chestPanelTitle.textContent = "Chest";
    if (chestPanelHint) chestPanelHint.textContent = "Click items to quick-transfer between chest and inventory.";
    closeInventory();
    selectedSlot = null;
    updateAllSlotUI();
  }

  function closeShipRepairPanel() {
    state.activeShipRepair = null;
    state.shipActionPending = false;
    if (shipRepairPanel) shipRepairPanel.classList.add("hidden");
  }

  function renderShipRepairPanel() {
    if (!shipRepairPanel) return;
    const structure = state.activeShipRepair;
    if (!structure || structure.removed || structure.type !== "abandoned_ship") {
      closeShipRepairPanel();
      return;
    }
    const ship = ensureAbandonedShipMeta(structure);
    if (!ship) {
      closeShipRepairPanel();
      return;
    }
    if (shipRepairTitle) shipRepairTitle.textContent = STRUCTURE_DEFS.abandoned_ship.name;
    if (shipRepairCost) {
      shipRepairCost.innerHTML = "";
      renderRecipeCostWithHighlights(shipRepairCost, ABANDONED_SHIP_CONFIG.repairCost, state.inventory);
    }
    const hasMaterials = hasCost(state.inventory, ABANDONED_SHIP_CONFIG.repairCost);
    if (shipRepairStatus) {
      shipRepairStatus.textContent = ship.repaired
        ? "The ship is repaired and ready to sail."
        : "Restore this vessel with materials to unlock travel.";
    }
    if (shipRepairBtn) {
      shipRepairBtn.disabled = ship.repaired || state.shipActionPending || !hasMaterials;
      if (ship.repaired) {
        shipRepairBtn.textContent = "Ship Repaired";
      } else if (state.shipActionPending) {
        shipRepairBtn.textContent = "Waiting for Host...";
      } else {
        shipRepairBtn.textContent = "Repair Ship";
      }
    }
  }

  function openShipRepairPanel(structure) {
    if (!structure || structure.removed || structure.type !== "abandoned_ship") return;
    closeStationMenu();
    closeChest();
    closeInventory();
    state.activeShipRepair = structure;
    state.shipActionPending = false;
    if (shipRepairPanel) shipRepairPanel.classList.remove("hidden");
    renderShipRepairPanel();
  }

  function moveEntityNearShipAfterDisembark(entity, structure) {
    const world = state.surfaceWorld || state.world;
    if (!entity || !structure || !world) return;
    const shipCenter = getStructureCenterWorld(structure);
    const tx = Math.floor(shipCenter.x / CONFIG.tileSize);
    const ty = Math.floor(shipCenter.y / CONFIG.tileSize);
    const tile = findNearestWalkableTileInWorld(world, tx, ty, 12);
    if (!tile) return;
    entity.x = (tile.tx + 0.5) * CONFIG.tileSize;
    entity.y = (tile.ty + 0.5) * CONFIG.tileSize;
    if (Number.isFinite(entity.renderX)) entity.renderX = entity.x;
    if (Number.isFinite(entity.renderY)) entity.renderY = entity.y;
  }

  function movePlayerNearShipAfterDisembark(structure) {
    if (!state.player) return;
    moveEntityNearShipAfterDisembark(state.player, structure);
  }

  function repairAbandonedShipLocally(structure) {
    if (!structure || structure.type !== "abandoned_ship") return false;
    const ship = ensureAbandonedShipMeta(structure);
    if (!ship || ship.repaired) return false;
    if (!hasCost(state.inventory, ABANDONED_SHIP_CONFIG.repairCost)) {
      setPrompt("Missing repair materials", 1);
      return false;
    }
    applyCost(state.inventory, ABANDONED_SHIP_CONFIG.repairCost);
    ship.repaired = true;
    ship.vx = 0;
    ship.vy = 0;
    updateAllSlotUI();
    markDirty();
    setPrompt("Abandoned ship repaired", 1.2);
    closeShipRepairPanel();
    return true;
  }

  function boardLocalPlayerOnShip(structure) {
    if (!structure || structure.type !== "abandoned_ship") return false;
    const ship = ensureAbandonedShipMeta(structure);
    if (!ship) return false;
    if (!ship.repaired) {
      openShipRepairPanel(structure);
      return false;
    }
    const localId = getLocalShipPlayerId();
    removePlayerFromAllShips(localId);
    const seatIndex = assignPlayerToShip(structure, localId);
    if (seatIndex == null) {
      setPrompt("Ship is full", 0.9);
      return false;
    }
    closeShipRepairPanel();
    closeStationMenu();
    closeChest();
    syncShipOccupantPositions();
    markDirty();
    if (ship.driverId === localId) {
      setPrompt("Driving ship", 0.9);
    } else {
      setPrompt("Boarded as passenger", 0.9);
    }
    return true;
  }

  function leaveLocalShip() {
    const localId = getLocalShipPlayerId();
    const seatInfo = getShipSeatInfoForPlayer(localId);
    if (!seatInfo) return false;
    if (!removePlayerFromShipStructure(seatInfo.structure, localId)) return false;
    movePlayerNearShipAfterDisembark(seatInfo.structure);
    markDirty();
    setPrompt("Left ship", 0.8);
    return true;
  }

  function requestBoardAbandonedShip(structure) {
    if (!structure || structure.type !== "abandoned_ship") return false;
    if (netIsClientReady()) {
      sendToHost({
        type: "shipAction",
        action: "board",
        tx: structure.tx,
        ty: structure.ty,
      });
      return true;
    }
    return boardLocalPlayerOnShip(structure);
  }

  function requestLeaveAbandonedShip() {
    const seatInfo = getShipSeatInfoForPlayer(getLocalShipPlayerId());
    if (!seatInfo) return false;
    if (netIsClientReady()) {
      sendToHost({
        type: "shipAction",
        action: "leave",
        tx: seatInfo.structure.tx,
        ty: seatInfo.structure.ty,
      });
      return true;
    }
    return leaveLocalShip();
  }

  function requestRepairAbandonedShip(structure) {
    if (!structure || structure.type !== "abandoned_ship") return false;
    if (netIsClientReady()) {
      if (state.shipActionPending) return false;
      const ship = ensureAbandonedShipMeta(structure);
      if (!ship || ship.repaired) return false;
      if (!hasCost(state.inventory, ABANDONED_SHIP_CONFIG.repairCost)) {
        setPrompt("Missing repair materials", 1);
        return false;
      }
      state.shipActionPending = true;
      sendToHost({
        type: "shipAction",
        action: "repair",
        tx: structure.tx,
        ty: structure.ty,
      });
      renderShipRepairPanel();
      return true;
    }
    return repairAbandonedShipLocally(structure);
  }

  function sendRobotCommand(structure, action, extras = null) {
    if (!structure || structure.type !== "robot") return;
    if (!netIsClientReady()) return;
    const payload = {
      type: "robotCommand",
      tx: structure.tx,
      ty: structure.ty,
      action,
    };
    if (extras && typeof extras === "object") {
      Object.assign(payload, extras);
    }
    sendToHost(payload);
  }

  function sendChestUpdate(structure) {
    if (!structure || !net.enabled) return;
    if (structure.interior) {
      netSend({
        type: "houseChestUpdate",
        houseTx: structure.houseRef?.tx,
        houseTy: structure.houseRef?.ty,
        tx: structure.tx,
        ty: structure.ty,
        storage: structure.storage
          ? structure.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
          : createEmptyInventory(CHEST_SIZE),
      });
      return;
    }
    netSend({
      type: "chestUpdate",
      tx: structure.tx,
      ty: structure.ty,
      storage: structure.storage
        ? structure.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
        : createEmptyInventory(structure.type === "robot" ? ROBOT_STORAGE_SIZE : CHEST_SIZE),
    });
  }

  function getActiveRobotStructures() {
    if (!Array.isArray(state.structures)) return [];
    return state.structures.filter((structure) => (
      structure && !structure.removed && structure.type === "robot"
    ));
  }

  function getRobotRecallStatus() {
    let activeCount = 0;
    let benchTx = null;
    let benchTy = null;
    for (const structure of getActiveRobotStructures()) {
      const robot = ensureRobotMeta(structure);
      if (!robot || !robot.recallActive) continue;
      activeCount += 1;
      if (benchTx === null && Number.isInteger(robot.recallBenchTx) && Number.isInteger(robot.recallBenchTy)) {
        benchTx = robot.recallBenchTx;
        benchTy = robot.recallBenchTy;
      }
    }
    return {
      active: activeCount > 0,
      count: activeCount,
      benchTx,
      benchTy,
    };
  }

  function getNearbyCraftingBench() {
    if (state.nearBenchStructure && !state.nearBenchStructure.removed && state.nearBenchStructure.type === "bench") {
      return state.nearBenchStructure;
    }
    if (!state.player || state.inCave || state.player.inHut) return null;
    return findNearestStructure(state.player, (structure) => structure.type === "bench");
  }

  function applyCallAllRobotsToBench(bench) {
    if (!bench || bench.type !== "bench") return 0;
    let changed = false;
    let robotCount = 0;
    for (const structure of getActiveRobotStructures()) {
      const robot = ensureRobotMeta(structure);
      if (!robot) continue;
      robotCount += 1;
      if (
        !robot.recallActive
        || robot.recallBenchTx !== bench.tx
        || robot.recallBenchTy !== bench.ty
      ) {
        changed = true;
      }
      robot.recallActive = true;
      robot.recallBenchTx = bench.tx;
      robot.recallBenchTy = bench.ty;
      robot.pauseTimer = 0;
      if (robot.state !== "recalling" && robot.state !== "recalled") {
        robot.state = "recalling";
      }
      clearRobotNavigation(robot);
    }
    if (changed) {
      markDirty();
    }
    return robotCount;
  }

  function releaseAllRecalledRobots() {
    let changed = false;
    let released = 0;
    for (const structure of getActiveRobotStructures()) {
      const robot = ensureRobotMeta(structure);
      if (!robot || !robot.recallActive) continue;
      changed = true;
      released += 1;
      robot.recallActive = false;
      robot.recallBenchTx = null;
      robot.recallBenchTy = null;
      robot.retargetTimer = 0;
      if (robot.state === "recalling" || robot.state === "recalled") {
        robot.state = robot.manualStop ? "returning" : "idle";
      }
      clearRobotNavigation(robot);
    }
    if (changed) {
      markDirty();
    }
    return released;
  }

  function sendBenchRobotControl(action, bench) {
    if (!netIsClientReady() || !bench || bench.type !== "bench") return;
    if (action !== "call" && action !== "release") return;
    sendToHost({
      type: "benchRobotControl",
      action,
      tx: bench.tx,
      ty: bench.ty,
    });
  }

  function toggleBenchRobotRecall() {
    const bench = getNearbyCraftingBench();
    if (!bench) {
      setPrompt("Stand near a crafting bench", 1);
      return;
    }
    const robots = getActiveRobotStructures();
    if (robots.length === 0) {
      setPrompt("No robots deployed", 1.1);
      renderBuildMenu();
      return;
    }
    const recall = getRobotRecallStatus();
    if (recall.active) {
      if (netIsClientReady()) {
        sendBenchRobotControl("release", bench);
        setPrompt("Releasing robots...", 0.9);
      } else {
        const released = releaseAllRecalledRobots();
        setPrompt(`Released ${released} robot${released === 1 ? "" : "s"}`, 1.1);
      }
    } else if (netIsClientReady()) {
      sendBenchRobotControl("call", bench);
      setPrompt("Calling robots...", 0.9);
    } else {
      const called = applyCallAllRobotsToBench(bench);
      setPrompt(`Calling ${called} robot${called === 1 ? "" : "s"} to bench`, 1.1);
    }
    renderBuildMenu();
  }

  function renderBuildRobotControls() {
    if (!buildRobotControls || !toggleRobotRecallBtn || !buildRobotControlsHint) return;
    const robotCount = getActiveRobotStructures().length;
    const bench = getNearbyCraftingBench();
    if (robotCount <= 0 || !bench) {
      buildRobotControls.classList.add("hidden");
      buildRobotControlsHint.textContent = "";
      toggleRobotRecallBtn.disabled = true;
      toggleRobotRecallBtn.textContent = "Call All Robots";
      return;
    }
    buildRobotControls.classList.remove("hidden");
    const recall = getRobotRecallStatus();
    const recallBench = recall.active ? getBenchAtTile(recall.benchTx, recall.benchTy) : null;
    const sameBench = !!(
      recall.active
      && recallBench
      && recallBench.tx === bench.tx
      && recallBench.ty === bench.ty
    );
    toggleRobotRecallBtn.disabled = false;
    toggleRobotRecallBtn.textContent = recall.active ? "Release Robots" : "Call All Robots";
    if (recall.active) {
      const locationText = sameBench ? "at this bench" : "at another bench";
      buildRobotControlsHint.textContent = `${recall.count} robot${recall.count === 1 ? "" : "s"} waiting ${locationText}.`;
    } else {
      buildRobotControlsHint.textContent = `${robotCount} robot${robotCount === 1 ? "" : "s"} ready for recall.`;
    }
  }

  function getBuildCategoryDefinition(categoryId) {
    return BUILD_CATEGORY_DEFS.find((entry) => entry.id === categoryId) || BUILD_CATEGORY_DEFS[0];
  }

  function getBuildRecipeCategory(recipeId) {
    return BUILD_RECIPE_CATEGORIES[recipeId] || "survival";
  }

  function getBuildRecipesForCategory(categoryId) {
    if (categoryId === "upgrades") {
      return getVisibleUpgradeRecipes(state.player);
    }
    return BUILD_RECIPES.filter((recipe) => getBuildRecipeCategory(recipe.id) === categoryId);
  }

  function setBuildCategoryHint(categoryId) {
    if (!buildCategoryHint) return;
    const def = getBuildCategoryDefinition(categoryId);
    buildCategoryHint.textContent = def?.description || "";
  }

  function setBuildCategory(categoryId, shouldRender = true) {
    const def = getBuildCategoryDefinition(categoryId);
    buildCategory = def.id;
    for (const tab of buildCategoryTabs) {
      const active = tab.dataset.category === buildCategory;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", active ? "true" : "false");
    }
    setBuildCategoryHint(buildCategory);
    if (shouldRender) renderBuildMenu();
  }

  function isUpgradeRecipe(recipe) {
    return !!recipe && UPGRADE_RECIPE_IDS.has(recipe.id);
  }

  function getRecipeOutput(recipe) {
    if (!recipe) return {};
    if (recipe.output && typeof recipe.output === "object") {
      return recipe.output;
    }
    const qty = Math.max(1, Number.isFinite(recipe.outputQty) ? Math.floor(recipe.outputQty) : 1);
    return recipe.id ? { [recipe.id]: qty } : {};
  }

  function renderRecipeCostWithHighlights(container, cost, inventory = state.inventory) {
    if (!container || !cost || typeof cost !== "object") return;
    const inv = Array.isArray(inventory) ? inventory : [];
    const entries = Object.entries(cost);
    for (let i = 0; i < entries.length; i += 1) {
      const [itemId, qty] = entries[i];
      if (i > 0) container.appendChild(document.createTextNode(", "));
      const item = document.createElement("span");
      item.className = "recipe-cost-item";
      const itemName = ITEMS[itemId]?.name ?? itemId;
      item.textContent = `${itemName} x${qty}`;
      if (countItem(inv, itemId) >= qty) {
        item.classList.add("met");
      }
      container.appendChild(item);
    }
  }

  function renderBuildMenu() {
    renderBuildRobotControls();
    buildList.innerHTML = "";
    const recipes = getBuildRecipesForCategory(buildCategory);
    if (!recipes.length) {
      const empty = document.createElement("div");
      empty.className = "recipe-desc";
      empty.textContent = "No recipes available in this category yet.";
      buildList.appendChild(empty);
      return;
    }
    for (const recipe of recipes) {
      const upgradeRecipe = isUpgradeRecipe(recipe);
      const card = document.createElement("div");
      card.className = "recipe-card";
      const icon = document.createElement("div");
      icon.className = "recipe-icon";
      applyItemVisual(icon, recipe.icon || recipe.id, true);
      const title = document.createElement("div");
      title.className = "recipe-title";
      title.textContent = recipe.name;
      const desc = document.createElement("div");
      desc.className = "recipe-desc";
      desc.textContent = recipe.description || "Details unavailable.";
      const cost = document.createElement("div");
      cost.className = "recipe-cost";
      if (recipe.cost && isInfiniteResourcesEnabled()) {
        cost.textContent = "Free (Infinite Resources)";
      } else {
        if (recipe.cost) {
          renderRecipeCostWithHighlights(cost, recipe.cost, state.inventory);
        } else {
          cost.textContent = "";
        }
      }
      const button = document.createElement("button");

      let disabled = false;
      let lockReason = "";
      if (upgradeRecipe) {
        const unlockKey = recipe.unlock;
        if (unlockKey && hasPlayerUnlock(state.player, unlockKey)) {
          button.textContent = "Owned";
          disabled = true;
          lockReason = "Already unlocked";
        } else if (!hasUpgradePrereqs(state.player, recipe)) {
          button.textContent = "Locked";
          disabled = true;
          const prereqLabels = (recipe.requires || [])
            .map((key) => UPGRADE_RECIPES.find((entry) => entry.unlock === key)?.name || key)
            .join(", ");
          lockReason = `Requires: ${prereqLabels}`;
        } else {
          button.textContent = "Unlock";
        }
      } else {
        button.textContent = "Craft";
        if (recipe.id === "medium_house" && !state.structures.some((s) => !s.removed && (s.type === "small_house" || s.type === "hut"))) {
          disabled = true;
          lockReason = "Requires a placed small house.";
        }
        if (recipe.id === "large_house" && !state.structures.some((s) => !s.removed && (s.type === "medium_house" || s.type === "large_house"))) {
          disabled = true;
          lockReason = "Requires a placed medium house.";
        }
      }

      if (!disabled && recipe.cost && !hasCost(state.inventory, recipe.cost)) {
        disabled = true;
        lockReason = "Missing resources.";
      }

      button.disabled = disabled;
      if (disabled && lockReason && button.textContent !== "Owned") {
        button.textContent = "Locked";
      }
      button.addEventListener("click", () => craftRecipe(recipe));

      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(desc);
      if (recipe.cost) card.appendChild(cost);
      if (!upgradeRecipe) {
        const outputLabel = document.createElement("div");
        outputLabel.className = "recipe-cost";
        const output = getRecipeOutput(recipe);
        outputLabel.textContent = `Produces: ${Object.entries(output)
          .map(([itemId, qty]) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`)
          .join(", ")}`;
        card.appendChild(outputLabel);
      }
      if (disabled && lockReason) {
        const lock = document.createElement("div");
        lock.className = "recipe-lock";
        lock.textContent = lockReason;
        card.appendChild(lock);
      }
      card.appendChild(button);
      buildList.appendChild(card);
    }
  }

  function craftRecipe(recipe) {
    if (!recipe.cost || !hasCost(state.inventory, recipe.cost)) {
      setPrompt("Not enough resources", 1.2);
      return;
    }

    if (isUpgradeRecipe(recipe)) {
      const unlockKey = recipe.unlock;
      if (!unlockKey) return;
      if (hasPlayerUnlock(state.player, unlockKey)) return;
      if (!hasUpgradePrereqs(state.player, recipe)) {
        setPrompt("Missing required upgrade", 1.1);
        return;
      }
      applyCost(state.inventory, recipe.cost);
      ensurePlayerProgress(state.player);
      state.player.unlocks[unlockKey] = true;
      updateToolDisplay();
      updateAllSlotUI();
      if (net.enabled) sendPlayerUpdate();
      markDirty();
      playSfx("ui");
      setPrompt(`${recipe.name} unlocked`, 1.2);
      return;
    }

    if (recipe.id === "medium_house" && !state.structures.some((s) => !s.removed && (s.type === "small_house" || s.type === "hut"))) {
      setPrompt("Build a small house first", 1.1);
      return;
    }
    if (recipe.id === "large_house" && !state.structures.some((s) => !s.removed && s.type === "medium_house")) {
      setPrompt("Upgrade to medium house first", 1.1);
      return;
    }

    const output = getRecipeOutput(recipe);
    if (!canAddItems(state.inventory, output)) {
      setPrompt("Inventory full", 1.2);
      return;
    }

    applyCost(state.inventory, recipe.cost);
    for (const [itemId, qty] of Object.entries(output)) {
      addItem(state.inventory, itemId, qty);
    }
    updateAllSlotUI();
    markDirty();
    playSfx("ui");
    setPrompt(`${recipe.name} crafted`, 1.2);
  }

  function mergeCostObjects(...costs) {
    const merged = {};
    for (const cost of costs) {
      if (!cost || typeof cost !== "object") continue;
      for (const [itemId, qty] of Object.entries(cost)) {
        const amount = Number.isFinite(qty) ? qty : Number(qty);
        if (!Number.isFinite(amount) || amount <= 0) continue;
        merged[itemId] = (merged[itemId] || 0) + amount;
      }
    }
    return merged;
  }

  function formatCostItems(cost) {
    if (!cost || typeof cost !== "object") return "";
    return Object.entries(cost)
      .map(([itemId, qty]) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`)
      .join(", ");
  }

  function getStationRecipeInputVariants(recipe) {
    const baseInput = recipe?.input && typeof recipe.input === "object" ? recipe.input : {};
    if (!Array.isArray(recipe?.inputAny) || recipe.inputAny.length === 0) {
      return [baseInput];
    }
    return recipe.inputAny.map((inputExtra) => mergeCostObjects(baseInput, inputExtra));
  }

  function getAvailableStationRecipeInput(recipe, inventory = state.inventory) {
    const variants = getStationRecipeInputVariants(recipe);
    for (const cost of variants) {
      if (hasCost(inventory, cost)) return cost;
    }
    return null;
  }

  function formatStationRecipeInputText(recipe) {
    const variants = getStationRecipeInputVariants(recipe)
      .map((cost) => formatCostItems(cost))
      .filter((text) => text.length > 0);
    if (variants.length === 0) return "";
    if (variants.length === 1) return variants[0];
    return variants.map((text) => `(${text})`).join(" or ");
  }

  function renderStationMenu() {
    if (!state.activeStation) return;
    const type = state.activeStation.type;
    if (type === "robot") {
      renderRobotStationMenu();
      return;
    }
    const recipes = STATION_RECIPES[type] || [];
    stationTitle.textContent = STRUCTURE_DEFS[type]?.name ?? "Station";
    stationOptions.innerHTML = "";

    for (const recipe of recipes) {
      const card = document.createElement("div");
      card.className = "recipe-card";
      const icon = document.createElement("div");
      icon.className = "recipe-icon";
      const firstOutput = Object.keys(recipe.output || {})[0];
      applyItemVisual(icon, firstOutput || "stone", true);
      const title = document.createElement("div");
      title.className = "recipe-title";
      title.textContent = recipe.name;
      const desc = document.createElement("div");
      desc.className = "recipe-desc";
      desc.textContent = recipe.description || "Refine resources into useful components.";
      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(desc);

      if (recipe.locked) {
        const cost = document.createElement("div");
        cost.className = "recipe-cost";
        cost.textContent = "Unlock later";
        card.appendChild(cost);
        const btn = document.createElement("button");
        btn.textContent = "Locked";
        btn.disabled = true;
        card.appendChild(btn);
      } else {
        const cost = document.createElement("div");
        cost.className = "recipe-cost";
        const outputText = formatCostItems(recipe.output);
        if (isInfiniteResourcesEnabled()) {
          cost.textContent = `Free (Infinite Resources) → ${outputText}`;
        } else {
          const inputText = formatStationRecipeInputText(recipe);
          cost.textContent = `${inputText} → ${outputText}`;
        }
        card.appendChild(cost);
        const btn = document.createElement("button");
        const hasInput = !!getAvailableStationRecipeInput(recipe, state.inventory);
        const hasSpace = canAddItems(state.inventory, recipe.output);
        const canAfford = hasInput && hasSpace;
        btn.textContent = canAfford ? "Refine" : "Locked";
        btn.disabled = !canAfford;
        if (!canAfford) {
          const lock = document.createElement("div");
          lock.className = "recipe-lock";
          lock.textContent = hasInput ? "Inventory full." : "Missing resources.";
          card.appendChild(lock);
        }
        btn.addEventListener("click", () => craftStationRecipe(recipe));
        card.appendChild(btn);
      }
      stationOptions.appendChild(card);
    }
  }

  function setRobotMode(structure, mode) {
    if (!structure || structure.type !== "robot") return;
    const normalizedMode = normalizeRobotMode(mode);
    if (!normalizedMode) return;
    const robot = ensureRobotMeta(structure);
    if (!robot) return;
    robot.mode = normalizedMode;
    robot.manualStop = false;
    robot.recallActive = false;
    robot.recallBenchTx = null;
    robot.recallBenchTy = null;
    robot.targetResourceId = null;
    robot.retargetTimer = 0;
    robot.mineTimer = 0;
    robot.state = "idle";
    clearRobotNavigation(robot);
    setRobotInteractionPause(structure, ROBOT_CONFIG.interactionPause);
    if (netIsClientReady()) {
      sendRobotCommand(structure, "setMode", { mode: normalizedMode });
    } else {
      markDirty();
    }
  }

  function stopRobotMovement(structure) {
    if (!structure || structure.type !== "robot") return;
    const robot = ensureRobotMeta(structure);
    if (!robot) return;
    robot.manualStop = true;
    robot.recallActive = false;
    robot.recallBenchTx = null;
    robot.recallBenchTy = null;
    robot.targetResourceId = null;
    robot.retargetTimer = 0;
    robot.mineTimer = 0;
    robot.state = "returning";
    clearRobotNavigation(robot);
    setRobotInteractionPause(structure, ROBOT_CONFIG.interactionPause);
    if (netIsClientReady()) {
      sendRobotCommand(structure, "stop");
    } else {
      markDirty();
    }
  }

  const ROBOT_MODE_MENU_OPTIONS = Object.freeze([
    {
      mode: ROBOT_MODE.trees,
      label: "Trees",
      icon: "tree_resource",
      description: "Hunt and chop nearby trees.",
      hint: "Robot will mine for trees.",
    },
    {
      mode: ROBOT_MODE.stone,
      label: "Stone",
      icon: "stone",
      description: "Hunt and break rock nodes.",
      hint: "Robot will mine for stone.",
    },
    {
      mode: ROBOT_MODE.grass,
      label: "Grass",
      icon: "grass",
      description: "Hunt and harvest grass nodes.",
      hint: "Robot will mine for grass.",
    },
  ]);

  function getRobotModeHint(mode, manualStop = false) {
    if (manualStop) return "Robot movement is stopped. Select a resource icon to resume.";
    const selected = ROBOT_MODE_MENU_OPTIONS.find((entry) => entry.mode === mode);
    return selected?.hint || "Select a target resource for this robot.";
  }

  function renderRobotStationMenu() {
    const structure = state.activeStation;
    if (!structure || structure.type !== "robot") return;
    const robot = ensureRobotMeta(structure);
    if (!robot) return;
    stationTitle.textContent = STRUCTURE_DEFS.robot?.name ?? "Robot";
    stationOptions.innerHTML = "";

    const status = document.createElement("div");
    status.className = "recipe-card";
    const statusTitle = document.createElement("div");
    statusTitle.className = "recipe-title";
    statusTitle.textContent = "Automation Control";
    const statusDesc = document.createElement("div");
    statusDesc.className = "recipe-desc";
    statusDesc.textContent = "Robot mines selected resources and returns to spawn crafting bench when full.";
    const statusLine = document.createElement("div");
    statusLine.className = "recipe-cost";
    statusLine.textContent = `Status: ${getRobotStatusLabel(structure)}`;
    const modeLine = document.createElement("div");
    modeLine.className = "recipe-cost";
    modeLine.textContent = `Mode: ${getRobotModeLabel(robot.mode)}`;
    status.appendChild(statusTitle);
    status.appendChild(statusDesc);
    status.appendChild(statusLine);
    status.appendChild(modeLine);
    stationOptions.appendChild(status);

    const modeCard = document.createElement("div");
    modeCard.className = "recipe-card";
    const modeTitle = document.createElement("div");
    modeTitle.className = "recipe-title";
    modeTitle.textContent = "Target Resource";
    const modeDesc = document.createElement("div");
    modeDesc.className = "recipe-desc";
    modeDesc.textContent = "Select what this robot should hunt and mine.";
    const modeGrid = document.createElement("div");
    modeGrid.className = "robot-mode-grid";
    for (const option of ROBOT_MODE_MENU_OPTIONS) {
      const modeBtn = document.createElement("button");
      modeBtn.type = "button";
      modeBtn.className = "robot-mode-btn";
      const active = robot.mode === option.mode;
      if (active) modeBtn.classList.add("active");
      modeBtn.title = option.description;

      const iconWrap = document.createElement("span");
      iconWrap.className = "robot-mode-icon";
      applyItemVisual(iconWrap, option.icon, true);
      const label = document.createElement("span");
      label.className = "robot-mode-label";
      label.textContent = option.label;

      modeBtn.appendChild(iconWrap);
      modeBtn.appendChild(label);
      modeBtn.addEventListener("click", () => {
        setRobotMode(structure, option.mode);
        renderRobotStationMenu();
      });
      modeGrid.appendChild(modeBtn);
    }
    modeCard.appendChild(modeTitle);
    modeCard.appendChild(modeDesc);
    modeCard.appendChild(modeGrid);
    stationOptions.appendChild(modeCard);

    const actionCard = document.createElement("div");
    actionCard.className = "recipe-card";
    const actionTitle = document.createElement("div");
    actionTitle.className = "recipe-title";
    actionTitle.textContent = "Robot Commands";
    const actionDesc = document.createElement("div");
    actionDesc.className = "recipe-desc";
    actionDesc.textContent = "Open cargo or force the robot to return to the spawn crafting bench.";
    const actionRow = document.createElement("div");
    actionRow.className = "robot-action-row";

    const invBtn = document.createElement("button");
    invBtn.type = "button";
    invBtn.className = "robot-action-btn";
    const invIcon = document.createElement("span");
    invIcon.className = "robot-action-icon";
    applyItemVisual(invIcon, "robot", true);
    const invLabel = document.createElement("span");
    invLabel.className = "robot-action-label";
    invLabel.textContent = "Inventory";
    invBtn.appendChild(invIcon);
    invBtn.appendChild(invLabel);
    invBtn.addEventListener("click", () => {
      closeStationMenu();
      openChest(structure);
    });

    const stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.className = "robot-action-btn danger";
    const stopIcon = document.createElement("span");
    stopIcon.className = "robot-action-icon";
    applyItemVisual(stopIcon, "stop_icon", true);
    const stopLabel = document.createElement("span");
    stopLabel.className = "robot-action-label";
    stopLabel.textContent = robot.manualStop ? "Stopped" : "Stop Movement";
    stopBtn.appendChild(stopIcon);
    stopBtn.appendChild(stopLabel);
    stopBtn.disabled = !!robot.manualStop && robot.state !== "returning";
    stopBtn.addEventListener("click", () => {
      stopRobotMovement(structure);
      renderRobotStationMenu();
    });

    actionRow.appendChild(invBtn);
    actionRow.appendChild(stopBtn);
    actionCard.appendChild(actionTitle);
    actionCard.appendChild(actionDesc);
    actionCard.appendChild(actionRow);
    stationOptions.appendChild(actionCard);

    const bubble = document.createElement("div");
    bubble.className = "robot-menu-bubble";
    bubble.textContent = getRobotModeHint(robot.mode, robot.manualStop);
    stationOptions.appendChild(bubble);
  }

  function craftStationRecipe(recipe) {
    if (recipe.locked) return;
    const selectedInput = getAvailableStationRecipeInput(recipe, state.inventory);
    if (!selectedInput) {
      setPrompt("Not enough resources", 1.2);
      return;
    }
    if (!canAddItems(state.inventory, recipe.output)) {
      setPrompt("Inventory full", 1.2);
      return;
    }
    applyCost(state.inventory, selectedInput);
    for (const [itemId, qty] of Object.entries(recipe.output)) {
      addItem(state.inventory, itemId, qty);
    }
    updateAllSlotUI();
    markDirty();
    playSfx("ui");
    setPrompt(`${recipe.name} complete`, 1.2);
  }

  function destroyChest(chest) {
    if (!chest) return;
    const worldX = (chest.tx + 0.5) * CONFIG.tileSize;
    const worldY = (chest.ty + 0.5) * CONFIG.tileSize;
    const dropWorld = state.surfaceWorld || state.world;

    if (chest.storage) {
      chest.storage.forEach((slot, index) => {
        if (!slot.id) return;
        const angle = (index / CHEST_SIZE) * Math.PI * 2;
        const offsetX = Math.cos(angle) * 10;
        const offsetY = Math.sin(angle) * 10;
        spawnDrop(slot.id, slot.qty, worldX + offsetX, worldY + offsetY, dropWorld);
      });
    }

    removeStructure(chest);
    if (state.activeChest === chest) {
      closeChest();
    }
    markDirty();
  }

  function destroyActiveChest() {
    const chest = state.activeChest;
    if (!chest) return;
    if (chest.type !== "chest") return;
    if (chest.interior) {
      if (netIsClient()) {
        sendToHost({
          type: "houseDestroyChest",
          houseTx: chest.houseRef?.tx,
          houseTy: chest.houseRef?.ty,
          tx: chest.tx,
          ty: chest.ty,
        });
      }
      removeInteriorStructure(chest.houseRef, chest);
      closeChest();
      markDirty();
      return;
    }
    if (netIsClient()) {
      sendToHost({ type: "destroyChest", tx: chest.tx, ty: chest.ty });
      closeChest();
      return;
    }
    destroyChest(chest);
  }

  function setSettingsTab(tab) {
    const nextTab = tab === "objectives" ? "objectives" : "settings";
    state.settingsTab = nextTab;
    if (settingsTabBtn) settingsTabBtn.classList.toggle("active", nextTab === "settings");
    if (objectivesTabBtn) objectivesTabBtn.classList.toggle("active", nextTab === "objectives");
    if (settingsContent) settingsContent.classList.toggle("hidden", nextTab !== "settings");
    if (objectivesContent) objectivesContent.classList.toggle("hidden", nextTab !== "objectives");
    if (nextTab === "objectives") {
      renderObjectiveGuide();
    }
  }

  function closeSettingsPanel() {
    if (!settingsPanel) return;
    settingsPanel.classList.add("hidden");
  }

  function toggleSettingsPanel() {
    if (!settingsPanel) return;
    const opening = settingsPanel.classList.contains("hidden");
    if (opening) {
      settingsPanel.classList.remove("hidden");
      setSettingsTab(state.settingsTab || "settings");
      if (debugPanel) debugPanel.classList.add("hidden");
    } else {
      settingsPanel.classList.add("hidden");
    }
  }

  function toggleDebugMenu() {
    if (!debugPanel) return;
    if (!state.debugUnlocked) {
      setPrompt("Debug is locked. Open Settings to unlock.", 1.4);
      return;
    }
    closeSettingsPanel();
    debugPanel.classList.toggle("hidden");
  }

  function unlockDebugFromSettings() {
    if (state.debugUnlocked) {
      setPrompt("Debug already unlocked", 1);
      return;
    }
    const attempt = window.prompt("Enter debug passcode:", "");
    if (attempt === null) return;
    if (attempt.trim() !== DEBUG_PASSCODE) {
      setPrompt("Incorrect passcode", 1.2);
      return;
    }
    setDebugUnlocked(true);
    setPrompt("Debug unlocked", 1.2);
    playSfx("ui");
  }

  function resetWorldFromSettings() {
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    const seed = normalizeSeedValue(state.surfaceWorld?.seed || "island-1");
    const confirmed = window.confirm(`Reset world "${seed}" and clear all progress?`);
    if (!confirmed) return;
    try {
      localStorage.removeItem(getSeedSaveKey(seed));
    } catch (err) {
      // ignore delete failures
    }
    setDebugUnlocked(false);
    startNewGame(seed);
    saveGame();
    closeSettingsPanel();
    setPrompt(`World reset (${seed})`, 1.4);
    if (net.isHost && net.connections.size > 0) {
      broadcastNet(buildSnapshot());
    }
  }

  function giveDebugBeacon() {
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    if (!state.inventory) return;
    const left = addItem(state.inventory, "beacon", 1);
    if (left > 0) {
      setPrompt("Inventory full", 0.9);
      return;
    }
    updateAllSlotUI();
    setPrompt("Rescue Beacon added", 1.2);
    markDirty();
  }

  function giveDebugRobot() {
    if (!state.debugUnlocked) {
      setPrompt("Debug is locked. Open Settings to unlock.", 1.2);
      return;
    }
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    if (!state.inventory) return;
    const left = addItem(state.inventory, "robot", 1);
    if (left > 0) {
      setPrompt("Inventory full", 1.2);
      return;
    }
    const hotbarIndex = state.inventory.findIndex((slot, idx) => idx < HOTBAR_SIZE && slot?.id === "robot");
    if (hotbarIndex >= 0) activeSlot = hotbarIndex;
    updateAllSlotUI();
    setPrompt("Robot added to inventory", 1.2);
    markDirty();
  }

  function spawnDebugCaveAtPlayer() {
    if (!state.player) return;
    if (state.inCave) {
      setPrompt("Leave cave first", 1);
      return;
    }
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    const world = state.surfaceWorld || state.world;
    if (!world) return;
    const startTx = Math.floor(state.player.x / CONFIG.tileSize);
    const startTy = Math.floor(state.player.y / CONFIG.tileSize);
    const tile = findOpenSurfaceTileNear(world, startTx, startTy, 10);
    if (!tile) {
      setPrompt("No spot for cave nearby", 1.2);
      return;
    }
    const cave = addSurfaceCave(world, tile.tx, tile.ty, null, { spawnedByPlayer: true });
    if (!cave) {
      setPrompt("Cave spawn failed", 1.2);
      return;
    }
    setPrompt("Debug cave spawned", 1.2);
    markDirty();
    if (net.isHost && net.connections.size > 0) {
      broadcastNet(buildSnapshot());
    }
  }

  function spawnDebugVillageAtPlayer() {
    if (!state.player) return;
    if (state.inCave) {
      setPrompt("Leave cave first", 1);
      return;
    }
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    const world = state.surfaceWorld || state.world;
    if (!world) return;
    const centerTx = Math.floor(state.player.x / CONFIG.tileSize);
    const centerTy = Math.floor(state.player.y / CONFIG.tileSize);
    const result = spawnVillageAt(world, centerTx, centerTy, Math.random, { spawnedByPlayer: true });
    if (!result.ok) {
      setPrompt(result.reason || "Village spawn failed", 1.2);
      return;
    }
    const villagerCount = Number.isFinite(result.villagers) ? result.villagers : 0;
    setPrompt(`Village spawned (${result.houses} houses, ${villagerCount} villagers)`, 1.4);
    markDirty();
    if (net.isHost && net.connections.size > 0) {
      broadcastNet(buildSnapshot());
    }
  }

  function forceDebugDay() {
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    state.timeOfDay = 0;
    state.isNight = false;
    state.surfaceSpawnTimer = MONSTER.spawnInterval;
    if (state.surfaceWorld) {
      igniteSurfaceMonstersForDay(state.surfaceWorld);
    }
    updateTimeUI();
    setPrompt("Time set to day", 1);
    markDirty();
    if (net.isHost && net.connections.size > 0) {
      broadcastNet(buildSnapshot());
    }
  }

  function forceDebugNight() {
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    state.timeOfDay = CONFIG.dayLength + 0.05;
    state.isNight = true;
    state.surfaceSpawnTimer = 0.01;
    updateTimeUI();
    setPrompt("Time set to night", 1);
    markDirty();
    if (net.isHost && net.connections.size > 0) {
      broadcastNet(buildSnapshot());
    }
  }

  function toggleDebugMoses() {
    if (!state.debugUnlocked) {
      setPrompt("Debug is locked. Open Settings to unlock.", 1.2);
      return;
    }
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    state.debugMoses = !state.debugMoses;
    updateMosesButton();
    setPrompt(state.debugMoses ? "Moses bridge enabled" : "Moses bridge disabled", 1.2);
  }

  function toggleInfiniteResources() {
    if (!state.debugUnlocked) {
      setPrompt("Debug is locked. Open Settings to unlock.", 1.2);
      return;
    }
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    state.debugInfiniteResources = !state.debugInfiniteResources;
    updateInfiniteResourcesButton();
    saveUserSettings();
    if (buildMenu && !buildMenu.classList.contains("hidden")) {
      renderBuildMenu();
    }
    if (stationMenu && !stationMenu.classList.contains("hidden")) {
      renderStationMenu();
    }
    setPrompt(
      state.debugInfiniteResources
        ? "Infinite resources enabled"
        : "Infinite resources disabled",
      1.2
    );
  }

  function toggleDebugWorldMap() {
    if (!state.debugUnlocked) {
      setPrompt("Debug is locked. Open Settings to unlock.", 1.2);
      return;
    }
    state.debugWorldMapVisible = !state.debugWorldMapVisible;
    updateDebugWorldMapButton();
    setPrompt(
      state.debugWorldMapVisible
        ? "World mini-map enabled"
        : "World mini-map disabled",
      1.2
    );
    if (!state.debugWorldMapVisible) {
      state.debugIslandDrag = null;
    }
  }

  function toggleContinentalShift() {
    if (!state.debugUnlocked) {
      setPrompt("Debug is locked. Open Settings to unlock.", 1.2);
      return;
    }
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    state.debugContinentalShift = !state.debugContinentalShift;
    if (!state.debugContinentalShift) {
      state.debugIslandDrag = null;
    }
    updateContinentalShiftButton();
    setPrompt(
      state.debugContinentalShift
        ? "Continental Shift enabled"
        : "Continental Shift disabled",
      1.2
    );
  }

  function toggleDebugPlaceRepairedBoat() {
    if (!state.debugUnlocked) {
      setPrompt("Debug is locked. Open Settings to unlock.", 1.2);
      return;
    }
    state.debugPlaceRepairedBoat = !state.debugPlaceRepairedBoat;
    state.debugBoatPlacePending = false;
    updateDebugPlaceBoatButton();
    setPrompt(
      state.debugPlaceRepairedBoat
        ? "Repaired boat placement enabled"
        : "Repaired boat placement disabled",
      1.2
    );
  }

  function toggleDebugAbandonedRobotMarker() {
    if (!state.debugUnlocked) {
      setPrompt("Debug is locked. Open Settings to unlock.", 1.2);
      return;
    }
    if (!hasWildSpawnRobot()) {
      state.debugShowAbandonedRobot = false;
      setPrompt("No abandoned robot in this world.", 1.4);
      return;
    }
    state.debugShowAbandonedRobot = !state.debugShowAbandonedRobot;
    setPrompt(
      state.debugShowAbandonedRobot
        ? "Abandoned robot marker enabled"
        : "Abandoned robot marker disabled",
      1.2
    );
  }

  function switchToSeed(seedInput) {
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    const nextSeed = normalizeSeedValue(seedInput);
    if (!nextSeed) return;
    closeSettingsPanel();
    if (debugPanel) debugPanel.classList.add("hidden");
    if (state.world && state.player && !netIsClientReady()) {
      saveGame();
    }
    setDebugUnlocked(false);
    closeStationMenu();
    closeChest();
    closeInventory();
    loadOrCreateGame(nextSeed);
    saveGame();
    setPrompt(`Loaded seed: ${nextSeed}`, 1.3);
    if (net.isHost && net.connections.size > 0) {
      broadcastNet(buildSnapshot());
    }
  }

  function promptNewSeed() {
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    const currentSeed = normalizeSeedValue(state.surfaceWorld?.seed || getStoredActiveSeed() || "island-1");
    const seed = window.prompt(
      "Enter seed to load. Each seed keeps its own saved progress:",
      currentSeed
    );
    if (seed === null) return;
    switchToSeed(seed);
  }

  function handleKeyDown(event) {
    if (event.repeat) return;
    ensureAudioContext();

    if (event.code === "Escape") {
      closeSettingsPanel();
      if (debugPanel) debugPanel.classList.add("hidden");
      return;
    }

    if (event.code === "Backquote") {
      if (state.debugUnlocked) {
        toggleDebugMenu();
      } else {
        setPrompt("Debug locked. Use Settings to unlock.", 1.2);
      }
      return;
    }

    if (event.code === "KeyI") {
      toggleInventory();
      return;
    }

    if (event.code === "KeyN") {
      promptNewSeed();
      return;
    }

    if (event.code === "KeyQ") {
      event.preventDefault();
      dropSelectedItem();
      return;
    }

    if (event.code.startsWith("Digit")) {
      const num = Number(event.code.replace("Digit", ""));
      if (num >= 1 && num <= HOTBAR_SIZE) {
        setActiveSlot(num - 1);
      }
    }

    if (event.code === "KeyE") {
      interactPressed = true;
    }

    if (event.code === "Space") {
      attackPressed = true;
    }

    if (
      event.code === "ArrowUp" ||
      event.code === "ArrowDown" ||
      event.code === "ArrowLeft" ||
      event.code === "ArrowRight" ||
      event.code === "Space"
    ) {
      event.preventDefault();
    }

    keyState.set(event.code, true);
  }

  function handleKeyUp(event) {
    if (
      event.code === "ArrowUp" ||
      event.code === "ArrowDown" ||
      event.code === "ArrowLeft" ||
      event.code === "ArrowRight" ||
      event.code === "Space"
    ) {
      event.preventDefault();
    }

    keyState.set(event.code, false);
  }

  function getMoveVector() {
    let x = 0;
    let y = 0;

    if (keyState.get("KeyW") || keyState.get("ArrowUp")) y -= 1;
    if (keyState.get("KeyS") || keyState.get("ArrowDown")) y += 1;
    if (keyState.get("KeyA") || keyState.get("ArrowLeft")) x -= 1;
    if (keyState.get("KeyD") || keyState.get("ArrowRight")) x += 1;

    if (touch.active) {
      x += touch.dx;
      y += touch.dy;
    }

    const length = Math.hypot(x, y);
    if (length > 1) {
      x /= length;
      y /= length;
    }

    return { x, y };
  }

  function updatePlayer(dt) {
    if (!state.world || !state.player) return;
    const speedMult = getDebugSpeedMultiplier();
    const shipSeat = (!state.inCave && !state.player.inHut)
      ? getShipSeatInfoForPlayer(getLocalShipPlayerId())
      : null;
    if (shipSeat) {
      const seatPos = getShipSeatWorldPosition(shipSeat.structure, shipSeat.seatIndex, !net.isHost);
      if (seatPos) {
        state.player.x = seatPos.x;
        state.player.y = seatPos.y;
        state.player.facing.x = Math.cos(seatPos.angle);
        state.player.facing.y = Math.sin(seatPos.angle);
      }
      return;
    }

    if (state.player.inHut && state.activeHouse && state.housePlayer) {
      const uiLock = inventoryOpen || !!state.activeStation || !!state.activeChest || !!state.activeShipRepair || state.gameWon;
      const move = uiLock ? { x: 0, y: 0 } : getMoveVector();
      const step = 3.8 * dt * speedMult;
      if (move.x !== 0 || move.y !== 0) {
        state.player.facing.x = move.x;
        state.player.facing.y = move.y;
      }
      const interior = getHouseInterior(state.activeHouse);
      const wallPad = 0.35;
      state.housePlayer.x = clamp(state.housePlayer.x + move.x * step, wallPad, interior.width - wallPad);
      state.housePlayer.y = clamp(state.housePlayer.y + move.y * step, wallPad, interior.height - wallPad);
      return;
    }

    const uiLock = inventoryOpen || !!state.activeStation || !!state.activeChest || !!state.activeShipRepair || state.gameWon;
    const move = uiLock ? { x: 0, y: 0 } : getMoveVector();
    const surface = state.surfaceWorld || state.world;
    const biomeSpeedScale = (!state.inCave && !state.player.inHut && surface)
      ? getSurfaceMoveSpeedScale(surface, state.player.x, state.player.y)
      : 1;
    const step = CONFIG.moveSpeed * dt * speedMult * biomeSpeedScale;

    if (move.x !== 0 || move.y !== 0) {
      state.player.facing.x = move.x;
      state.player.facing.y = move.y;
    }

    if (
      state.debugMoses
      && !netIsClientReady()
      && !state.inCave
      && !state.player.inHut
      && state.world === state.surfaceWorld
      && (move.x !== 0 || move.y !== 0)
    ) {
      const frontX = state.player.x + move.x * (CONFIG.tileSize * 0.8);
      const frontY = state.player.y + move.y * (CONFIG.tileSize * 0.8);
      const frontTx = Math.floor(frontX / CONFIG.tileSize);
      const frontTy = Math.floor(frontY / CONFIG.tileSize);
      const surface = state.surfaceWorld || state.world;
      if (inBounds(frontTx, frontTy, surface.size)) {
        const idx = tileIndex(frontTx, frontTy, surface.size);
        if (surface.tiles[idx] === 0 && !getStructureAt(frontTx, frontTy)) {
          const place = canPlaceItemAt(surface, false, "bridge", frontTx, frontTy);
          if (place.ok) {
            addStructure("bridge", frontTx, frontTy);
            markDirty();
          }
        }
      }
    }

    const nextX = state.player.x + move.x * step;
    const nextY = state.player.y + move.y * step;

    if (isWalkableAt(nextX, state.player.y)) {
      state.player.x = nextX;
    }
    if (isWalkableAt(state.player.x, nextY)) {
      state.player.y = nextY;
    }
  }

  function updateStructureEffects(dt) {
    if (!state.player || !state.surfaceWorld || state.inCave || state.player.inHut) return;
    void dt;
  }

  function updateCheckpoint(dt) {
    void dt;
    // Respawn points are intentional: spawn island by default, dock when explicitly set.
    if (!state.player || !state.surfaceWorld) return;
    if (normalizeCheckpoint(state.player.checkpoint)) return;
    const spawn = getSafeRespawnPosition(state.surfaceWorld);
    state.player.checkpoint = spawn;
    markDirty();
    if (net.enabled) sendPlayerUpdate();
  }

  function updatePlayerEffects(dt) {
    if (!state.player) return;
    ensurePlayerStatusEffects(state.player);
    if (state.player.poisonTimer <= 0) {
      if (state.player.poisonDps !== 0) {
        state.player.poisonDps = 0;
        updateHealthUI();
      }
      return;
    }

    const prevTimer = state.player.poisonTimer;
    const dps = clamp(
      Number(state.player.poisonDps) || POISON_STATUS.defaultDps,
      POISON_STATUS.minDps,
      POISON_STATUS.maxDps
    );
    state.player.poisonTimer = Math.max(0, state.player.poisonTimer - dt);
    if (state.player.hp > POISON_STATUS.minHp) {
      const tickDamage = dps * dt;
      if (tickDamage > 0) {
        state.player.hp = Math.max(POISON_STATUS.minHp, state.player.hp - tickDamage);
      }
    }
    if (state.player.poisonTimer <= 0) {
      state.player.poisonDps = 0;
    }
    if (
      state.player.poisonTimer !== prevTimer
      || state.player.poisonTimer <= 0
      || state.player.hp <= POISON_STATUS.minHp
    ) {
      updateHealthUI();
    }
  }

  function updatePlayerCombatTimers(dt) {
    if (!state.player) return;
    if (state.player.invincible > 0) state.player.invincible = Math.max(0, state.player.invincible - dt);
    if (state.player.attackTimer > 0) state.player.attackTimer = Math.max(0, state.player.attackTimer - dt);
  }

  function updateWorldResources(world, dt) {
    if (!world) return;
    if (!Array.isArray(world.resources)) return;
    if (!Array.isArray(world.resourceGrid)) world.resourceGrid = createResourceGrid(world.size);
    if (!Array.isArray(world.respawnTasks)) world.respawnTasks = [];
    for (const res of world.resources) {
      if (res.hitTimer > 0) res.hitTimer -= dt;
      if (res.type === "tree" && res.stage && res.stage !== "alive") {
        if (res.removed) {
          res.removed = false;
          const idx = tileIndex(res.tx, res.ty, world.size);
          world.resourceGrid[idx] = res.id;
        }
        res.respawnTimer -= dt;
        if (res.respawnTimer <= 0) {
          if (res.stage === "stump") {
            res.stage = "sapling";
            res.respawnTimer = RESPAWN.treeSapling;
          } else if (res.stage === "sapling") {
            res.stage = "alive";
            res.hp = res.maxHp;
            res.respawnTimer = 0;
          }
          markDirty();
        }
      }
      if (res.removed && res.type === "ore") {
        const hasTask = world.respawnTasks.some((task) => task?.type === "ore" && task.id === res.id);
        if (!hasTask) {
          world.respawnTasks.push({
            type: "ore",
            id: res.id,
            tx: res.tx,
            ty: res.ty,
            timer: RESPAWN.ore,
          });
          markDirty();
        }
      }
      if (res.removed) continue;
    }

    if (world.respawnTasks.length === 0) return;
    for (let i = world.respawnTasks.length - 1; i >= 0; i -= 1) {
      const task = world.respawnTasks[i];
      if (!task || typeof task !== "object") {
        world.respawnTasks.splice(i, 1);
        continue;
      }
      task.tx = Math.floor(Number(task.tx) || 0);
      task.ty = Math.floor(Number(task.ty) || 0);
      if (!Number.isFinite(task.timer)) {
        task.timer = getRespawnDelayForTaskType(task.type);
      }
      if (!inBounds(task.tx, task.ty, world.size)) {
        world.respawnTasks.splice(i, 1);
        continue;
      }
      task.timer -= dt;
      if (task.timer > 0) continue;

      if (task.type === "biomeStone") {
        const res = typeof task.id === "number" ? world.resources[task.id] : null;
        if (res && res.type !== "biomeStone") {
          world.respawnTasks.splice(i, 1);
          continue;
        }
        const tileBiome = Array.isArray(world.biomeGrid)
          ? world.biomeGrid[tileIndex(task.tx, task.ty, world.size)]
          : 0;
        let biomeId = Number.isInteger(res?.biomeId) ? res.biomeId : tileBiome;
        if (!Number.isInteger(biomeId) || biomeId < 0 || biomeId >= getBiomeStoneBiomeCount()) {
          biomeId = 0;
        }
        const spot = findBiomeStoneSpawnTile(
          world,
          biomeId,
          task.tx,
          task.ty,
          typeof task.id === "number" ? task.id : null
        );
        if (!spot) {
          task.timer = BIOME_STONE_RESPAWN.retryDelay;
          continue;
        }

        if (res) {
          if (inBounds(res.tx, res.ty, world.size)) {
            const prevIdx = tileIndex(res.tx, res.ty, world.size);
            if (world.resourceGrid[prevIdx] === res.id) {
              world.resourceGrid[prevIdx] = -1;
            }
          }
          res.tx = spot.tx;
          res.ty = spot.ty;
          res.x = (spot.tx + 0.5) * CONFIG.tileSize;
          res.y = (spot.ty + 0.5) * CONFIG.tileSize;
          res.biomeId = biomeId;
          res.maxHp = getResourceBaseHp(res);
          res.hp = res.maxHp;
          res.stage = "alive";
          res.respawnTimer = 0;
          res.hitTimer = 0;
          res.removed = false;
          const nextIdx = tileIndex(spot.tx, spot.ty, world.size);
          world.resourceGrid[nextIdx] = res.id;
        } else if (!spawnBiomeStoneResource(world, spot.tx, spot.ty, biomeId)) {
          task.timer = BIOME_STONE_RESPAWN.retryDelay;
          continue;
        }
        world.respawnTasks.splice(i, 1);
        markDirty();
        continue;
      }

      const idx = tileIndex(task.tx, task.ty, world.size);
      const tileIsLand = world.tiles[idx] === 1;
      const resAt = getResourceAt(world, task.tx, task.ty);
      const hasStructure = world === state.surfaceWorld ? !!getStructureAt(task.tx, task.ty) : false;
      const hasCave = world === state.surfaceWorld ? !!getCaveAt(world, task.tx, task.ty) : false;

      if (tileIsLand && !resAt && !hasStructure && !hasCave) {
        const res = typeof task.id === "number" ? world.resources[task.id] : null;
        if (res) {
          res.removed = false;
          res.hp = res.maxHp;
          res.stage = "alive";
          world.resourceGrid[idx] = res.id;
          world.respawnTasks.splice(i, 1);
          markDirty();
        } else {
          world.respawnTasks.splice(i, 1);
        }
      } else {
        task.timer = 10;
      }
    }
  }

  function updateResourceHitTimers(world, dt) {
    if (!world) return;
    if (!Array.isArray(world.resources)) return;
    for (const res of world.resources) {
      if (res.hitTimer > 0) {
        res.hitTimer -= dt;
        if (res.hitTimer < 0) res.hitTimer = 0;
      }
    }
  }

  function updateResources(dt) {
    if (netIsClient()) {
      updateResourceHitTimers(state.world, dt);
      if (state.inCave && state.surfaceWorld && state.surfaceWorld !== state.world) {
        updateResourceHitTimers(state.surfaceWorld, dt);
      }
      return;
    }
    updateWorldResources(state.world, dt);
    if (state.inCave && state.surfaceWorld && state.surfaceWorld !== state.world) {
      updateWorldResources(state.surfaceWorld, dt);
    }
  }

  function updateDayNight(dt) {
    if (netIsClient()) return;
    if (state.gameWon) return;
    const cycle = CONFIG.dayLength + CONFIG.nightLength;
    const prevNight = state.isNight;
    state.timeOfDay = (state.timeOfDay + dt) % cycle;
    state.isNight = state.timeOfDay >= CONFIG.dayLength;
    if (state.isNight !== prevNight) {
      updateTimeUI();
      state.surfaceSpawnTimer = MONSTER.spawnInterval;
      if (!state.isNight && state.surfaceWorld) {
        igniteSurfaceMonstersForDay(state.surfaceWorld);
      }
    }
  }

  function damagePlayer(amount, source = null) {
    if (!state.player) return;
    if (state.player.invincible > 0) return;
    state.player.hp = Math.max(0, state.player.hp - amount);
    state.player.invincible = 0.6;
    if (source?.monsterType) {
      playSfx("monsterAttackHit", {
        monsterType: source.monsterType,
        inCave: !!state.inCave,
        intensity: 0.45 + Math.min(1, Number(amount) / 14) * 0.55,
      });
    }
    playSfx("damage", {
      intensity: 0.7 + Math.min(1, Number(amount) / 16) * 0.6,
    });
    updateHealthUI();
    if (state.player.hp <= 0) {
      handlePlayerDeath();
    }
  }

  function dropInventoryOnDeath(world, x, y) {
    if (!world || !state.inventory) return;
    const filled = state.inventory.filter((slot) => slot.id && slot.qty > 0);
    if (filled.length === 0) return;
    if (netIsClientReady()) {
      sendToHost({
        type: "deathDrop",
        world: state.inCave ? "cave" : "surface",
        caveId: state.activeCave?.id ?? null,
        x,
        y,
        items: filled.map((slot) => ({ id: slot.id, qty: slot.qty })),
      });
    } else {
      const cols = Math.ceil(Math.sqrt(filled.length));
      const spacing = 14;
      let index = 0;
      for (const slot of filled) {
        const gx = index % cols;
        const gy = Math.floor(index / cols);
        const ox = (gx - (cols - 1) / 2) * spacing;
        const oy = gy * spacing - spacing;
        spawnDrop(slot.id, slot.qty, x + ox, y + oy, world);
        index += 1;
      }
    }
    for (const slot of state.inventory) {
      slot.id = null;
      slot.qty = 0;
    }
    updateAllSlotUI();
  }

  function resetInputStateAfterRespawn() {
    closeStationMenu();
    closeChest();
    closeShipRepairPanel();
    closeInventory();
    interactPressed = false;
    attackPressed = false;
    keyState.clear();
    resetTouchInput();
  }

  function handlePlayerDeath() {
    if (!state.player || state.respawnLock) return;
    state.respawnLock = true;
    removePlayerFromAllShips(getLocalShipPlayerId());
    const deathWorld = state.world;
    const deathX = state.player.x;
    const deathY = state.player.y;
    try {
      dropInventoryOnDeath(deathWorld, deathX, deathY);
      const surface = state.surfaceWorld || state.world;
      if (state.inCave) {
        leaveCave();
      }
      state.inCave = false;
      state.activeCave = null;
      state.world = surface;
      state.player.hp = state.player.maxHp;
      state.player.invincible = 1;
      clearPoisonStatus(state.player);
      state.player.inHut = false;
      state.player.attackTimer = 0;
      state.activeHouse = null;
      state.housePlayer = null;
      const respawnPos = getPlayerRespawnPosition(state.player, surface);
      state.player.x = respawnPos.x;
      state.player.y = respawnPos.y;
      setPlayerCheckpoint(state.player, surface, state.player.x, state.player.y, true);
      resetInputStateAfterRespawn();
      updateHealthUI();
      setPrompt("You dropped your inventory!", 2);
      if (net.enabled && !netIsClientReady()) sendPlayerUpdate();
      markDirty();
    } catch (err) {
      console.warn("Death recovery failed", err);
      state.player.hp = state.player.maxHp;
      state.player.inHut = false;
      state.player.invincible = 1;
      clearPoisonStatus(state.player);
      state.activeHouse = null;
      state.housePlayer = null;
      state.inCave = false;
      state.activeCave = null;
      state.world = state.surfaceWorld || state.world;
      const surface = state.surfaceWorld || state.world;
      const respawnPos = getSafeRespawnPosition(surface);
      state.player.x = respawnPos.x;
      state.player.y = respawnPos.y;
      setPlayerCheckpoint(state.player, surface, state.player.x, state.player.y, true);
      resetInputStateAfterRespawn();
      updateHealthUI();
      if (net.enabled && !netIsClientReady()) sendPlayerUpdate();
      markDirty();
    } finally {
      state.respawnLock = false;
    }
  }

  function handleDeathDropRequest(conn, message) {
    if (!conn || !message) return;
    const player = net.players.get(conn.peer);
    if (!player) return;
    const items = Array.isArray(message?.items) ? message.items : [];
    if (items.length === 0) return;
    const wantsCave = message.world === "cave";
    const world = wantsCave
      ? (
        player.inCave
          && Number.isInteger(player.caveId)
          && Number(message.caveId) === player.caveId
          ? getCaveWorld(player.caveId)
          : null
      )
      : (player.inCave ? null : state.surfaceWorld);
    if (!world) return;
    const x = Number.isFinite(message.x) ? message.x : (player.x ?? 0);
    const y = Number.isFinite(message.y) ? message.y : (player.y ?? 0);
    const offset = Math.hypot(x - (player.x ?? 0), y - (player.y ?? 0));
    if (offset > CONFIG.tileSize * 2.6) return;
    const normalized = items
      .map((entry) => ({
        id: typeof entry?.id === "string" && ITEMS[entry.id] ? entry.id : null,
        qty: Math.max(0, Math.floor(Number(entry?.qty) || 0)),
      }))
      .filter((entry) => entry.id && entry.qty > 0);
    if (normalized.length === 0) return;
    const cols = Math.ceil(Math.sqrt(normalized.length));
    const spacing = 14;
    for (let i = 0; i < normalized.length; i += 1) {
      const item = normalized[i];
      const gx = i % cols;
      const gy = Math.floor(i / cols);
      const ox = (gx - (cols - 1) / 2) * spacing;
      const oy = gy * spacing - spacing;
      spawnDrop(item.id, item.qty, x + ox, y + oy, world);
    }
    markDirty();
  }

  function spawnMonster(world, tx, ty, options = {}) {
    if (!world.monsters) world.monsters = [];
    if (!world.nextMonsterId) world.nextMonsterId = 1;
    const type = options.type ?? "crawler";
    const variant = getMonsterVariant(type);
    const monster = {
      id: world.nextMonsterId++,
      type,
      color: options.color ?? variant.color,
      x: (tx + 0.5) * CONFIG.tileSize,
      y: (ty + 0.5) * CONFIG.tileSize,
      hp: options.hp ?? variant.hp,
      maxHp: options.hp ?? variant.hp,
      speed: options.speed ?? variant.speed,
      damage: options.damage ?? variant.damage,
      attackRange: options.attackRange ?? variant.attackRange,
      attackCooldown: options.attackCooldown ?? variant.attackCooldown,
      aggroRange: options.aggroRange ?? variant.aggroRange,
      rangedRange: options.rangedRange ?? variant.rangedRange,
      drop: options.drop ?? variant.drop ?? null,
      dropLootOnDeath: false,
      attackTimer: 0,
      hitTimer: 0,
      wanderTimer: 0,
      dayBurning: !!options.dayBurning,
      burnTimer: Math.max(0, Number(options.burnTimer) || 0),
      burnDuration: Math.max(0, Number(options.burnDuration) || 0),
      poisonDuration: Math.max(0, Number(options.poisonDuration ?? variant.poisonDuration) || 0),
      poisonDps: Math.max(0, Number(options.poisonDps ?? variant.poisonDps) || 0),
      dir: { x: 0, y: 0 },
    };
    world.monsters.push(monster);
  }

  function rollDropQty(spec) {
    if (typeof spec === "number") {
      return Math.max(0, Math.floor(spec));
    }
    if (Array.isArray(spec) && spec.length >= 2) {
      const min = Math.floor(Number(spec[0]) || 0);
      const max = Math.floor(Number(spec[1]) || min);
      if (max <= min) return Math.max(0, min);
      return Math.max(0, min + Math.floor(Math.random() * (max - min + 1)));
    }
    if (spec && typeof spec === "object") {
      const chance = clamp(Number(spec.chance) || 1, 0, 1);
      if (Math.random() > chance) return 0;
      const min = Math.floor(Number(spec.min) || 0);
      const max = Math.floor(Number(spec.max) || min);
      if (max <= min) return Math.max(0, min);
      return Math.max(0, min + Math.floor(Math.random() * (max - min + 1)));
    }
    return 0;
  }

  function spawnMonsterDrops(world, monster) {
    if (!world || !monster || !monster.drop || typeof monster.drop !== "object") return;
    for (const [itemId, spec] of Object.entries(monster.drop)) {
      if (!ITEMS[itemId]) continue;
      const qty = clamp(rollDropQty(spec), 0, MAX_STACK);
      if (qty <= 0) continue;
      const jitterX = (Math.random() - 0.5) * 12;
      const jitterY = (Math.random() - 0.5) * 12;
      spawnDrop(itemId, qty, monster.x + jitterX, monster.y + jitterY, world);
    }
  }

  function normalizeAnimalType(type) {
    if (type === "goat" || type === "boar" || type === "green_cow") return type;
    return "boar";
  }

  function getAnimalTypeConfig(type) {
    const normalizedType = normalizeAnimalType(type);
    if (normalizedType === "goat") {
      return {
        type: normalizedType,
        hp: 4,
        speed: 48,
        color: "#d2cab8",
        drop: { raw_meat: 1, hide: 1 },
      };
    }
    if (normalizedType === "green_cow") {
      return {
        type: normalizedType,
        hp: 7,
        speed: 40,
        color: "#6db56f",
        drop: { medicine: 1 },
      };
    }
    return {
      type: "boar",
      hp: 5,
      speed: 42,
      color: "#9f8160",
      drop: { raw_meat: 2, hide: 1 },
    };
  }

  function getAnimalIdleSfx(type) {
    const normalizedType = normalizeAnimalType(type);
    if (normalizedType === "goat") return "animalGoatIdle";
    if (normalizedType === "boar") return "animalBoarIdle";
    return "animalCowIdle";
  }

  function getAnimalHurtSfx(type) {
    const normalizedType = normalizeAnimalType(type);
    if (normalizedType === "goat") return "animalGoatHurt";
    if (normalizedType === "boar") return "animalBoarHurt";
    return "animalCowHurt";
  }

  function getAnimalDeathSfx(type) {
    const normalizedType = normalizeAnimalType(type);
    if (normalizedType === "goat") return "animalGoatDeath";
    if (normalizedType === "boar") return "animalBoarDeath";
    return "animalCowDeath";
  }

  function getAnimalDrops(animal) {
    const normalizedType = normalizeAnimalType(animal?.type);
    if (normalizedType === "green_cow") {
      return { medicine: 1 };
    }
    if (animal?.drop && typeof animal.drop === "object" && Object.keys(animal.drop).length > 0) {
      return animal.drop;
    }
    const cfg = getAnimalTypeConfig(normalizedType);
    return cfg.drop || { raw_meat: 1 };
  }

  function isHarvestAnimalType(type) {
    const normalizedType = normalizeAnimalType(type);
    return normalizedType === "goat" || normalizedType === "boar";
  }

  function pickHarvestAnimalType(rng = Math.random) {
    return rng() < 0.42 ? "goat" : "boar";
  }

  function playAnimalReactionSfx(world, animal, event = "hurt") {
    if (!animal) return;
    const kind = event === "death"
      ? getAnimalDeathSfx(animal.type)
      : getAnimalHurtSfx(animal.type);
    if (!kind) return;
    if (world && Number.isFinite(animal.x) && Number.isFinite(animal.y)) {
      if (!shouldPlayWorldSfx(world, animal.x, animal.y)) return;
      const dist = Math.hypot((animal.x ?? 0) - (state.player?.x ?? 0), (animal.y ?? 0) - (state.player?.y ?? 0));
      playSfx(kind, { intensity: event === "death" ? 0.9 : 0.72, distance: dist });
      return;
    }
    playSfx(kind, { intensity: event === "death" ? 0.9 : 0.72 });
  }

  function spawnAnimal(world, tx, ty, type = "boar") {
    if (!world.animals) world.animals = [];
    if (!world.nextAnimalId) world.nextAnimalId = 1;
    const cfg = getAnimalTypeConfig(type);
    world.animals.push({
      id: world.nextAnimalId++,
      type: cfg.type,
      x: (tx + 0.5) * CONFIG.tileSize,
      y: (ty + 0.5) * CONFIG.tileSize,
      hp: cfg.hp,
      maxHp: cfg.hp,
      speed: cfg.speed,
      color: cfg.color,
      drop: cfg.drop,
      hitTimer: 0,
      fleeTimer: 0,
      wanderTimer: 0,
      dir: { x: 0, y: 0 },
    });
  }

  function canSpawnAnimalAt(world, tx, ty) {
    if (!inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    if (!world.tiles[idx]) return false;
    if (world.beachGrid?.[idx]) return false;
    if (Array.isArray(world.resourceGrid) && world.resourceGrid[idx] !== -1) return false;
    if (world === (state.surfaceWorld || state.world) && getStructureAt(tx, ty)) return false;
    const walkableNeighbors =
      Number(isWalkableTileInWorld(world, tx + 1, ty))
      + Number(isWalkableTileInWorld(world, tx - 1, ty))
      + Number(isWalkableTileInWorld(world, tx, ty + 1))
      + Number(isWalkableTileInWorld(world, tx, ty - 1));
    return walkableNeighbors >= 3;
  }

  function canMoveAnimalTo(world, tx, ty) {
    if (!inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    if (!world.tiles[idx]) return false;
    if (world.beachGrid?.[idx]) return false;
    if (world === (state.surfaceWorld || state.world)) {
      if (getStructureAt(tx, ty)) return false;
      if (getCaveAt(world, tx, ty)) return false;
    }
    return true;
  }

  function canMoveVillagerTo(world, tx, ty) {
    if (!inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    if (world.tiles[idx] !== 1) return false;
    if (world.beachGrid?.[idx]) return false;
    if (world === (state.surfaceWorld || state.world)) {
      if (getCaveAt(world, tx, ty)) return false;
      const structure = getStructureAt(tx, ty);
      if (structure && !structure.removed) {
        const def = STRUCTURE_DEFS[structure.type];
        if (def?.blocking) return false;
      }
    }
    return true;
  }

  function pickSurfaceAnimalType(world, tx, ty, rng = Math.random) {
    const biomeId = getSurfaceBiomeIdAtTile(world, tx, ty);
    if (isMushroomBiomeId(biomeId)) return "green_cow";
    return rng() < 0.4 ? "goat" : "boar";
  }

  function pickAnimalSpawnTileOnIsland(world, island, options = {}) {
    if (!world || !island) return null;
    const attempts = Math.max(1, Math.floor(Number(options.attempts) || 20));
    const radiusScale = clamp(Number(options.radiusScale) || 0.82, 0.15, 1);
    const minRadiusScale = clamp(Number(options.minRadiusScale) || 0.12, 0, 0.95);
    const minSpacing = Math.max(0, Number(options.minSpacingTiles) || 0);
    const requireMushroomTile = !!options.requireMushroomTile;
    const enforceIslandOwnership = !!options.enforceIslandOwnership;
    const maxRadius = Math.max(2, Math.floor((Number(island.radius) || 6) * radiusScale));
    const minRadius = Math.max(0, Math.floor(maxRadius * minRadiusScale));
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const dist = minRadius + Math.random() * Math.max(1, maxRadius - minRadius);
      const tx = Math.floor(island.x + Math.cos(angle) * dist);
      const ty = Math.floor(island.y + Math.sin(angle) * dist);
      if (!inBounds(tx, ty, world.size)) continue;
      if (!canSpawnAnimalAt(world, tx, ty)) continue;
      if (requireMushroomTile && !isMushroomBiomeAtTile(world, tx, ty)) continue;
      if (enforceIslandOwnership && getIslandForTile(world, tx, ty) !== island) continue;
      if (minSpacing > 0) {
        const tooClose = world.animals.some((animal) => {
          if (!animal || animal.hp <= 0) return false;
          const ax = Math.floor(animal.x / CONFIG.tileSize);
          const ay = Math.floor(animal.y / CONFIG.tileSize);
          return Math.hypot(ax - tx, ay - ty) < minSpacing;
        });
        if (tooClose) continue;
      }
      return { tx, ty };
    }
    return null;
  }

  function spawnSurfaceAnimalFromIslands(world, minSpacingTiles = 5, options = null) {
    if (!world || !Array.isArray(world.islands) || world.islands.length === 0) return false;
    const preferredIslands = Array.isArray(options?.islands) && options.islands.length > 0
      ? options.islands.filter(Boolean)
      : world.islands;
    if (!preferredIslands.length) return false;
    const islandAttempts = Math.max(8, Math.min(36, preferredIslands.length * 3));
    for (let attempt = 0; attempt < islandAttempts; attempt += 1) {
      const island = preferredIslands[Math.floor(Math.random() * preferredIslands.length)];
      if (!island) continue;
      const strictTile = pickAnimalSpawnTileOnIsland(world, island, {
        attempts: 10,
        radiusScale: 0.84,
        minRadiusScale: 0.08,
        minSpacingTiles,
        enforceIslandOwnership: true,
      });
      // Fallback lets passive animals continue to spawn even when debug island merges
      // make strict island ownership ambiguous.
      const tile = strictTile || pickAnimalSpawnTileOnIsland(world, island, {
        attempts: 8,
        radiusScale: 0.86,
        minRadiusScale: 0.06,
        minSpacingTiles,
        enforceIslandOwnership: false,
      });
      if (!tile) continue;
      const spawnScale = getSurfaceAnimalSpawnScale(world, tile.tx, tile.ty);
      if (spawnScale <= 0 || Math.random() > spawnScale) continue;
      const forcedType = typeof options?.forceType === "string" ? normalizeAnimalType(options.forceType) : null;
      const animalType = forcedType || pickSurfaceAnimalType(world, tile.tx, tile.ty);
      spawnAnimal(world, tile.tx, tile.ty, animalType);
      return true;
    }
    return false;
  }

  function isAnimalOnIsland(world, animal, island) {
    if (!world || !animal || !island) return false;
    if (!Number.isFinite(animal.x) || !Number.isFinite(animal.y)) return false;
    const tx = Math.floor(animal.x / CONFIG.tileSize);
    const ty = Math.floor(animal.y / CONFIG.tileSize);
    if (!inBounds(tx, ty, world.size)) return false;
    if (getIslandForTile(world, tx, ty) === island) return true;
    const px = animal.x / CONFIG.tileSize;
    const py = animal.y / CONFIG.tileSize;
    const radiusPad = Math.max(2, (Number(island.radius) || 0) * 0.9);
    return Math.hypot(px - island.x, py - island.y) <= radiusPad;
  }

  function countHarvestAnimalsOnIsland(world, island) {
    if (!world || !island || !Array.isArray(world.animals)) return 0;
    let count = 0;
    for (const animal of world.animals) {
      if (!animal || animal.hp <= 0) continue;
      if (!isHarvestAnimalType(animal.type)) continue;
      if (isAnimalOnIsland(world, animal, island)) count += 1;
    }
    return count;
  }

  function spawnHarvestAnimalOnIsland(world, island, minSpacingTiles = 2.75) {
    if (!world || !island) return false;
    const strictTile = pickAnimalSpawnTileOnIsland(world, island, {
      attempts: 20,
      radiusScale: 0.86,
      minRadiusScale: 0.1,
      minSpacingTiles,
      enforceIslandOwnership: true,
    });
    const relaxedTile = strictTile || pickAnimalSpawnTileOnIsland(world, island, {
      attempts: 16,
      radiusScale: 0.9,
      minRadiusScale: 0.08,
      minSpacingTiles,
      enforceIslandOwnership: false,
    });
    if (!relaxedTile) return false;
    spawnAnimal(world, relaxedTile.tx, relaxedTile.ty, pickHarvestAnimalType());
    return true;
  }

  function ensureSpawnIslandHarvestAnimals(world, spawnTile, minCount = 4, maxAnimals = Infinity) {
    if (!world || !Array.isArray(world.animals) || !Array.isArray(world.islands)) return 0;
    const spawnTx = Number.isFinite(spawnTile?.x) ? Math.floor(spawnTile.x) : null;
    const spawnTy = Number.isFinite(spawnTile?.y) ? Math.floor(spawnTile.y) : null;
    const spawnIsland = (spawnTx != null && spawnTy != null)
      ? getIslandForTile(world, spawnTx, spawnTy)
      : (world.islands.find((island) => island?.starter) || null);
    if (!spawnIsland) return 0;
    const hardCap = Number.isFinite(maxAnimals) ? maxAnimals : Infinity;
    const target = Math.max(0, Math.floor(minCount) || 0);
    const existing = countHarvestAnimalsOnIsland(world, spawnIsland);
    const missing = Math.max(0, target - existing);
    let added = 0;
    for (let i = 0; i < missing; i += 1) {
      if (world.animals.length >= hardCap) break;
      if (!spawnHarvestAnimalOnIsland(world, spawnIsland, 2.75)) break;
      added += 1;
    }
    return added;
  }

  function countGreenCowsOnIsland(world, island) {
    if (!world || !island || !Array.isArray(world.animals)) return 0;
    let count = 0;
    for (const animal of world.animals) {
      if (!animal || animal.hp <= 0 || animal.type !== "green_cow") continue;
      if (isAnimalOnIsland(world, animal, island)) count += 1;
    }
    return count;
  }

  function spawnGreenCowOnMushroomIsland(world, island) {
    if (!world || !island) return false;
    const strictTile = pickAnimalSpawnTileOnIsland(world, island, {
      attempts: MUSHROOM_GREEN_COW_CONFIG.ensureAttemptsPerCow,
      radiusScale: 0.84,
      minRadiusScale: 0.12,
      minSpacingTiles: MUSHROOM_GREEN_COW_CONFIG.minSpacingTiles,
      requireMushroomTile: true,
      enforceIslandOwnership: true,
    });
    const relaxedTile = strictTile || pickAnimalSpawnTileOnIsland(world, island, {
      attempts: Math.max(12, Math.floor(MUSHROOM_GREEN_COW_CONFIG.ensureAttemptsPerCow * 0.7)),
      radiusScale: 0.84,
      minRadiusScale: 0.1,
      minSpacingTiles: MUSHROOM_GREEN_COW_CONFIG.minSpacingTiles,
      requireMushroomTile: false,
      enforceIslandOwnership: false,
    });
    if (!relaxedTile) return false;
    spawnAnimal(world, relaxedTile.tx, relaxedTile.ty, "green_cow");
    return true;
  }

  function ensureMushroomIslandGreenCows(world, maxAnimals = Infinity) {
    if (!world || !Array.isArray(world.islands) || !Array.isArray(world.animals)) return 0;
    const minPerIsland = Math.max(1, Math.floor(MUSHROOM_GREEN_COW_CONFIG.minPerIsland) || 1);
    const hardCap = Number.isFinite(maxAnimals) ? maxAnimals : Infinity;
    let added = 0;

    for (const island of world.islands) {
      if (!island) continue;
      if (!isMushroomBiomeId(getIslandBiomeId(world, island))) continue;
      const existing = countGreenCowsOnIsland(world, island);
      const missing = Math.max(0, minPerIsland - existing);
      for (let i = 0; i < missing; i += 1) {
        if (world.animals.length >= hardCap) return added;
        if (!spawnGreenCowOnMushroomIsland(world, island)) break;
        added += 1;
      }
    }
    return added;
  }

  function seedSurfaceAnimals(world, desired = 20) {
    if (!world) return;
    if (!world.animals) world.animals = [];
    let attempts = 0;
    while (world.animals.length < desired && attempts < desired * 50) {
      attempts += 1;
      if (!spawnSurfaceAnimalFromIslands(world, 5)) continue;
    }
  }

  function buildSurfaceMonsterSpawnOptions(world, tx, ty, island = null, forcePoison = false) {
    const biomeId = Number.isInteger(island?.biomeId)
      ? island.biomeId
      : getSurfaceBiomeIdAtTile(world, tx, ty);
    if (isMushroomBiomeId(biomeId)) return null;
    const biome = BIOMES[biomeId] || BIOMES[0];
    let type = pickMonsterTypeForBiome(biome, Math.random, state.isNight);
    if (forcePoison && state.isNight && biome.key === "marsh") type = "marsh_stalker";

    const variant = getMonsterVariant(type);
    const options = { type };
    if (biome.key === "redwood" && state.isNight) {
      const strength = Number(biome.nightMonsterStrength) || 1.25;
      options.hp = Math.max(2, Math.round(variant.hp * strength));
      options.damage = Math.max(1, Math.round(variant.damage * Math.min(1.45, strength * 0.95)));
      options.speed = variant.speed * 1.08;
      options.aggroRange = Math.round(variant.aggroRange * 1.12);
      options.attackCooldown = Math.max(0.72, variant.attackCooldown * 0.9);
    }
    return options;
  }

  function shouldBlockSurfaceHostilesAtTile(world, tx, ty) {
    return isMushroomBiomeAtTile(world, tx, ty);
  }

  function canSpawnMonsterAt(world, tx, ty, isCave, options = null) {
    if (!inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    if (!world.tiles[idx]) return false;
    if (!isCave) {
      if (!options?.allowMushroom && shouldBlockSurfaceHostilesAtTile(world, tx, ty)) return false;
      if (getStructureAt(tx, ty)) return false;
      if (getCaveAt(world, tx, ty)) return false;
    }
    return true;
  }

  function spawnSurfaceMonster(origin) {
    if (!state.surfaceWorld) return;
    const world = state.surfaceWorld;
    if (world.monsters.length >= MONSTER.surfaceMax) return;
    const baseX = origin?.x ?? state.player.x;
    const baseY = origin?.y ?? state.player.y;
    for (let attempt = 0; attempt < 20; attempt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const dist = (MONSTER.spawnMinTiles + Math.random() * (MONSTER.spawnMaxTiles - MONSTER.spawnMinTiles)) * CONFIG.tileSize;
      const tx = Math.floor((baseX + Math.cos(angle) * dist) / CONFIG.tileSize);
      const ty = Math.floor((baseY + Math.sin(angle) * dist) / CONFIG.tileSize);
      if (!canSpawnMonsterAt(world, tx, ty, false)) continue;
      const spawnOptions = buildSurfaceMonsterSpawnOptions(world, tx, ty, null);
      if (!spawnOptions) continue;
      spawnMonster(world, tx, ty, spawnOptions);
      break;
    }
  }

  function getSurfaceActiveIslands(world, players) {
    if (!world || !Array.isArray(world.islands) || !Array.isArray(players) || players.length === 0) return [];
    const activationPad = Math.max(viewWidth, viewHeight) * 0.8 + CONFIG.tileSize * 8;
    const active = [];
    for (const island of world.islands) {
      const ix = (island.x + 0.5) * CONFIG.tileSize;
      const iy = (island.y + 0.5) * CONFIG.tileSize;
      const islandRadius = island.radius * CONFIG.tileSize;
      const inRange = players.some(
        (player) => Math.hypot(player.x - ix, player.y - iy) <= islandRadius + activationPad
      );
      if (inRange) active.push(island);
    }
    return active;
  }

  function hasMarshStalkerOnIsland(world, island) {
    if (!world || !island || !Array.isArray(world.monsters)) return false;
    const islandCx = (island.x + 0.5) * CONFIG.tileSize;
    const islandCy = (island.y + 0.5) * CONFIG.tileSize;
    const searchRadius = Math.max(CONFIG.tileSize * 3, island.radius * CONFIG.tileSize * 1.08);
    return world.monsters.some(
      (monster) => monster
        && monster.hp > 0
        && monster.type === "marsh_stalker"
        && Math.hypot(monster.x - islandCx, monster.y - islandCy) <= searchRadius
    );
  }

  function spawnSurfaceMonsterOnIsland(world, island, players) {
    if (!world || !island) return false;
    if (isMushroomBiomeId(getIslandBiomeId(world, island))) return false;
    const cx = island.x;
    const cy = island.y;
    const maxRadius = Math.max(4, Math.floor(island.radius * 0.82));
    const biomeId = Number.isInteger(island.biomeId) ? island.biomeId : 0;
    const biome = BIOMES[biomeId] || BIOMES[0];
    const forcePoison = state.isNight
      && biome.key === "marsh"
      && !hasMarshStalkerOnIsland(world, island);
    for (let attempt = 0; attempt < 28; attempt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * maxRadius;
      const tx = Math.floor(cx + Math.cos(angle) * dist);
      const ty = Math.floor(cy + Math.sin(angle) * dist);
      if (!canSpawnMonsterAt(world, tx, ty, false)) continue;
      const wx = (tx + 0.5) * CONFIG.tileSize;
      const wy = (ty + 0.5) * CONFIG.tileSize;
      const tooClose = players.some(
        (player) => Math.hypot(player.x - wx, player.y - wy) < (MONSTER.spawnMinTiles * CONFIG.tileSize * 0.55)
      );
      if (tooClose) continue;
      const spawnOptions = buildSurfaceMonsterSpawnOptions(world, tx, ty, island, forcePoison);
      if (!spawnOptions) continue;
      spawnMonster(world, tx, ty, spawnOptions);
      return true;
    }
    return false;
  }

  function countSurfaceGuardians(world) {
    if (!world || !Array.isArray(world.monsters)) return 0;
    return world.monsters.reduce((count, monster) => (
      count + Number(monster && monster.hp > 0 && isGuardianMonsterType(monster.type))
    ), 0);
  }

  function countGuardiansOnIsland(world, island) {
    if (!world || !island || !Array.isArray(world.monsters)) return 0;
    const centerX = (island.x + 0.5) * CONFIG.tileSize;
    const centerY = (island.y + 0.5) * CONFIG.tileSize;
    const searchRadius = Math.max(CONFIG.tileSize * 3.5, island.radius * CONFIG.tileSize * 1.12);
    return world.monsters.reduce((count, monster) => (
      count + Number(
        monster
          && monster.hp > 0
          && isGuardianMonsterType(monster.type)
          && Math.hypot(monster.x - centerX, monster.y - centerY) <= searchRadius
      )
    ), 0);
  }

  function pickGuardianSpawnTileOnIsland(world, island, players) {
    if (!world || !island) return null;
    const cx = island.x;
    const cy = island.y;
    const maxRadius = Math.max(4, Math.floor(island.radius * 0.82));
    for (let attempt = 0; attempt < 30; attempt += 1) {
      const angle = Math.random() * Math.PI * 2;
      const dist = (0.15 + Math.random() * 0.8) * maxRadius;
      const tx = Math.floor(cx + Math.cos(angle) * dist);
      const ty = Math.floor(cy + Math.sin(angle) * dist);
      if (!canSpawnMonsterAt(world, tx, ty, false)) continue;
      const wx = (tx + 0.5) * CONFIG.tileSize;
      const wy = (ty + 0.5) * CONFIG.tileSize;
      const tooCloseToPlayer = players.some(
        (player) => Math.hypot(player.x - wx, player.y - wy) < (SURFACE_GUARDIAN_CONFIG.minPlayerDistanceTiles * CONFIG.tileSize)
      );
      if (tooCloseToPlayer) continue;
      return { tx, ty };
    }
    return null;
  }

  function spawnSurfaceGuardianOnIsland(world, island, players) {
    if (!world || !island) return false;
    const biomeId = getIslandBiomeId(world, island);
    const guardianType = getGuardianTypeForBiomeId(biomeId, island);
    if (!guardianType) return false;
    // Explicit design rule: plains wolves never spawn on the player spawn island.
    if (guardianType === "wolf" && isSpawnIsland(world, island)) return false;
    if (countGuardiansOnIsland(world, island) >= SURFACE_GUARDIAN_CONFIG.maxPerIsland) return false;
    const tile = pickGuardianSpawnTileOnIsland(world, island, players);
    if (!tile) return false;
    spawnMonster(world, tile.tx, tile.ty, { type: guardianType });
    return true;
  }

  function despawnSurfaceHostilesOnMushroom(world) {
    if (!world || !Array.isArray(world.monsters)) return 0;
    let removed = 0;
    for (let i = world.monsters.length - 1; i >= 0; i -= 1) {
      const monster = world.monsters[i];
      if (!monster || monster.hp <= 0) continue;
      const tx = Math.floor(monster.x / CONFIG.tileSize);
      const ty = Math.floor(monster.y / CONFIG.tileSize);
      if (!shouldBlockSurfaceHostilesAtTile(world, tx, ty)) continue;
      world.monsters.splice(i, 1);
      removed += 1;
    }
    return removed;
  }

  function spawnSurfaceGuardiansForActiveIslands(world, players) {
    if (!world || !Array.isArray(players) || players.length === 0) return;
    const activeIslands = getSurfaceActiveIslands(world, players);
    if (activeIslands.length === 0) return;
    if (countSurfaceGuardians(world) >= SURFACE_GUARDIAN_CONFIG.maxTotal) return;

    const targetIslands = activeIslands.filter((island) => {
      if (!island || isSpawnIsland(world, island)) return false;
      const biomeId = getIslandBiomeId(world, island);
      const guardianType = getGuardianTypeForBiomeId(biomeId, island);
      if (!guardianType) return false;
      if (guardianType === "wolf" && isSpawnIsland(world, island)) return false;
      return true;
    });
    if (targetIslands.length === 0) return;

    const budget = Math.max(1, Math.min(3, Math.ceil(targetIslands.length * 0.3)));
    const startIndex = Math.floor(Math.random() * targetIslands.length);
    let spawned = 0;

    for (let i = 0; i < targetIslands.length; i += 1) {
      if (spawned >= budget) break;
      if (countSurfaceGuardians(world) >= SURFACE_GUARDIAN_CONFIG.maxTotal) break;
      const island = targetIslands[(startIndex + i) % targetIslands.length];
      if (spawnSurfaceGuardianOnIsland(world, island, players)) {
        spawned += 1;
      }
    }
  }

  function spawnSurfaceMonstersForActiveIslands(world, players) {
    if (!world || !Array.isArray(players) || players.length === 0) return;
    const activeIslands = getSurfaceActiveIslands(world, players);
    if (activeIslands.length === 0) {
      const origin = players[Math.floor(Math.random() * players.length)];
      spawnSurfaceMonster(origin);
      return;
    }

    const dynamicMax = Math.max(MONSTER.surfaceMax, activeIslands.length * 5);
    const nonGuardianCount = (world.monsters || []).reduce((count, monster) => (
      count + Number(monster && monster.hp > 0 && !isGuardianMonsterType(monster.type))
    ), 0);
    if (nonGuardianCount >= dynamicMax) return;
    const spawnBudget = Math.max(2, Math.min(8, Math.ceil(activeIslands.length * 0.75)));
    const startIndex = Math.floor(Math.random() * activeIslands.length);
    let spawned = 0;

    for (let i = 0; i < activeIslands.length; i += 1) {
      if (spawned >= spawnBudget) break;
      const currentNonGuardianCount = (world.monsters || []).reduce((count, monster) => (
        count + Number(monster && monster.hp > 0 && !isGuardianMonsterType(monster.type))
      ), 0);
      if (currentNonGuardianCount >= dynamicMax) break;
      const island = activeIslands[(startIndex + i) % activeIslands.length];
      const shouldTry = activeIslands.length === 1 || Math.random() < 0.7;
      if (!shouldTry) continue;
      if (spawnSurfaceMonsterOnIsland(world, island, players)) {
        spawned += 1;
      }
    }

    if (spawned === 0) {
      const origin = players[Math.floor(Math.random() * players.length)];
      spawnSurfaceMonster(origin);
    }
  }

  function getEntityWorldPosition(entity, preferRender = false) {
    if (!entity) return null;
    const hasRender = Number.isFinite(entity.renderX) && Number.isFinite(entity.renderY);
    if (preferRender && hasRender) {
      return { x: entity.renderX, y: entity.renderY };
    }
    if (Number.isFinite(entity.x) && Number.isFinite(entity.y)) {
      return { x: entity.x, y: entity.y };
    }
    if (hasRender) {
      return { x: entity.renderX, y: entity.renderY };
    }
    return null;
  }

  function findNearestMonsterAt(world, position, range = CONFIG.interactRange, preferRender = false) {
    if (!world?.monsters) return null;
    let closest = null;
    let closestDist = Infinity;
    for (const monster of world.monsters) {
      if (!monster || monster.hp <= 0) continue;
      const monsterPos = getEntityWorldPosition(monster, preferRender);
      if (!monsterPos) continue;
      const dist = Math.hypot(monsterPos.x - position.x, monsterPos.y - position.y);
      if (dist < range && dist < closestDist) {
        closest = monster;
        closestDist = dist;
      }
    }
    return closest;
  }

  function findNearestMonster(world, player, range = CONFIG.interactRange, preferRender = false) {
    return findNearestMonsterAt(world, player, range, preferRender);
  }

  function findNearestAnimalAt(world, position, range = CONFIG.interactRange, preferRender = false) {
    if (!world?.animals) return null;
    let closest = null;
    let closestDist = Infinity;
    for (const animal of world.animals) {
      if (!animal || animal.hp <= 0) continue;
      const animalPos = getEntityWorldPosition(animal, preferRender);
      if (!animalPos) continue;
      const dist = Math.hypot(animalPos.x - position.x, animalPos.y - position.y);
      if (dist < range && dist < closestDist) {
        closest = animal;
        closestDist = dist;
      }
    }
    return closest;
  }

  function getCombatWorld() {
    if (state.inCave) return state.world;
    return state.surfaceWorld || state.world;
  }

  function performAttack(preferredTargetPos = null) {
    if (state.player.attackTimer > 0) return;
    const combatWorld = getCombatWorld();
    if (!combatWorld) return;
    const preferRenderTargets = netIsClient();
    const hasPreferredPos = preferredTargetPos
      && Number.isFinite(preferredTargetPos.x)
      && Number.isFinite(preferredTargetPos.y);
    const searchOrigin = hasPreferredPos ? preferredTargetPos : state.player;
    const canFightMonsters = canDamageMonsters(state.player);
    let targetMonster = findNearestMonsterAt(
      combatWorld,
      searchOrigin,
      MONSTER.attackRange + 12,
      preferRenderTargets
    );
    let targetAnimal = targetMonster
      ? null
      : findNearestAnimalAt(combatWorld, searchOrigin, MONSTER.attackRange + 12, preferRenderTargets);
    if (targetMonster) {
      const targetPos = getEntityWorldPosition(targetMonster, preferRenderTargets);
      const distToPlayer = targetPos
        ? Math.hypot(targetPos.x - state.player.x, targetPos.y - state.player.y)
        : Infinity;
      if (distToPlayer > MONSTER.attackRange + 12) {
        targetMonster = findNearestMonsterAt(
          combatWorld,
          state.player,
          MONSTER.attackRange + 8,
          preferRenderTargets
        );
      }
    }
    if (!targetMonster && targetAnimal) {
      const targetPos = getEntityWorldPosition(targetAnimal, preferRenderTargets);
      const distToPlayer = targetPos
        ? Math.hypot(targetPos.x - state.player.x, targetPos.y - state.player.y)
        : Infinity;
      if (distToPlayer > MONSTER.attackRange + 12) {
        targetAnimal = findNearestAnimalAt(
          combatWorld,
          state.player,
          MONSTER.attackRange + 8,
          preferRenderTargets
        );
      }
    }
    if (targetMonster && !canFightMonsters) {
      setPrompt("Craft a sword first", 0.9);
      return;
    }
    state.player.attackTimer = 0.35;
    playSfx("swing");
    if (netIsClient()) {
      if (targetMonster || targetAnimal) {
        playSfx("hit");
      }
      const selectedTarget = targetMonster || targetAnimal;
      const selectedTargetPos = selectedTarget
        ? getEntityWorldPosition(selectedTarget, true)
        : null;
      const aimX = hasPreferredPos
        ? preferredTargetPos.x
        : (selectedTargetPos?.x ?? state.player.x);
      const aimY = hasPreferredPos
        ? preferredTargetPos.y
        : (selectedTargetPos?.y ?? state.player.y);
      const message = {
        type: "attack",
        world: state.inCave ? "cave" : "surface",
        caveId: state.activeCave?.id ?? null,
        damage: getAttackDamage(state.player),
        unlocks: normalizeUnlocks(state.player.unlocks),
        x: state.player.x,
        y: state.player.y,
        aimX,
        aimY,
      };
      if (targetMonster) {
        message.targetKind = "monster";
        message.targetId = targetMonster.id;
      } else if (targetAnimal) {
        message.targetKind = "animal";
        message.targetId = targetAnimal.id;
      }
      sendToHost({
        ...message,
      });
      return;
    }
    if (targetMonster) {
      const damage = getAppliedAttackDamage(state.player, targetMonster);
      targetMonster.hp -= damage;
      targetMonster.hitTimer = 0.2;
      playSfx("hit");
      if (targetMonster.hp <= 0) {
        targetMonster.hp = 0;
        targetMonster.dropLootOnDeath = true;
      }
      markDirty();
      return;
    }
    if (!targetAnimal) return;
    const damage = getAppliedAttackDamage(state.player, targetAnimal);
    targetAnimal.hp -= damage;
    targetAnimal.hitTimer = 0.2;
    targetAnimal.fleeTimer = 2.4;
    playSfx("hit");
    playAnimalReactionSfx(state.surfaceWorld || combatWorld, targetAnimal, "hurt");
    if (targetAnimal.hp <= 0) {
      targetAnimal.hp = 0;
      playAnimalReactionSfx(state.surfaceWorld || combatWorld, targetAnimal, "death");
      const drop = getAnimalDrops(targetAnimal);
      for (const [itemId, qty] of Object.entries(drop)) {
        spawnDrop(itemId, qty, targetAnimal.x, targetAnimal.y, state.surfaceWorld || combatWorld);
      }
    }
    markDirty();
  }

  function getPlayersForWorld(world) {
    const players = [];
    if (state.player) {
      const hostInWorld = (!state.inCave && world === state.surfaceWorld)
        || (state.inCave && state.activeCave?.world === world);
      if (hostInWorld) {
        players.push({
          id: net.playerId || "local",
          x: state.player.x,
          y: state.player.y,
          inHut: state.player.inHut,
          inCave: state.inCave,
          caveId: state.activeCave?.id ?? null,
        });
      }
    }
    if (net.isHost) {
      for (const player of net.players.values()) {
        const playerWorld = player.inCave ? getCaveWorld(player.caveId) : state.surfaceWorld;
        if (playerWorld === world) {
          players.push(player);
        }
      }
    }
    return players;
  }

  function respawnRemotePlayer(player) {
    if (!player) return;
    const removedFromShip = removePlayerFromAllShips(player.id);
    const surface = state.surfaceWorld || state.world;
    const spawnPos = getPlayerRespawnPosition(player, surface);
    player.hp = player.maxHp;
    player.x = spawnPos.x;
    player.y = spawnPos.y;
    setPlayerCheckpoint(player, surface, player.x, player.y, true);
    player.inHut = false;
    player.houseKey = null;
    player.houseX = null;
    player.houseY = null;
    player.inCave = false;
    player.caveId = null;
    broadcastNet({
      type: "playerUpdate",
      id: player.id,
      name: player.name,
      color: player.color,
      x: player.x,
      y: player.y,
      facing: player.facing,
      hp: player.hp,
      maxHp: player.maxHp,
      toolTier: player.toolTier,
      unlocks: normalizeUnlocks(player.unlocks),
      checkpoint: normalizeCheckpoint(player.checkpoint),
      inHut: false,
      houseKey: null,
      houseX: null,
      houseY: null,
      inCave: false,
      caveId: null,
    }, player.id);
    const conn = net.connections.get(player.id);
    if (conn?.open) {
      conn.send({
        type: "respawn",
        hp: player.hp,
        maxHp: player.maxHp,
        x: player.x,
        y: player.y,
        checkpoint: normalizeCheckpoint(player.checkpoint),
      });
    }
    if (removedFromShip) {
      markDirty();
      const motion = buildMotionUpdate();
      if (motion) broadcastNet(motion);
    }
  }

  function damageRemotePlayer(player, amount, poison = null, meta = null) {
    if (!player) return;
    player.hp = Math.max(0, player.hp - amount);
    const conn = net.connections.get(player.id);
    const poisonDuration = Math.max(0, Number(poison?.duration) || 0);
    const poisonDps = Math.max(0, Number(poison?.dps) || 0);
    const monsterType = typeof meta?.monsterType === "string" ? meta.monsterType : null;
    const attackKind = meta?.attackKind === "projectile" ? "projectile" : (meta?.attackKind === "melee" ? "melee" : null);
    if (player.hp <= 0) {
      if (conn?.open) {
        const message = {
          type: "damage",
          hp: 0,
          maxHp: player.maxHp,
          damageAmount: Math.max(0, Number(amount) || 0),
        };
        if (poisonDuration > 0) {
          message.poisonDuration = poisonDuration;
          message.poisonDps = poisonDps;
        }
        if (monsterType) message.monsterType = monsterType;
        if (attackKind) message.attackKind = attackKind;
        conn.send(message);
      }
      respawnRemotePlayer(player);
    } else if (conn?.open) {
      const message = {
        type: "damage",
        hp: player.hp,
        maxHp: player.maxHp,
        damageAmount: Math.max(0, Number(amount) || 0),
      };
      if (poisonDuration > 0) {
        message.poisonDuration = poisonDuration;
        message.poisonDps = poisonDps;
      }
      if (monsterType) message.monsterType = monsterType;
      if (attackKind) message.attackKind = attackKind;
      conn.send(message);
    }
  }

  function spawnMonsterArrow(world, monster, target, baseDamage, poison = null) {
    if (!world || !monster || !target) return;
    world.projectiles = world.projectiles || [];
    world.nextProjectileId = world.nextProjectileId || 1;
    const dx = target.x - monster.x;
    const dy = target.y - monster.y;
    const dist = Math.max(1, Math.hypot(dx, dy));
    const baseAngle = Math.atan2(dy, dx);
    const miss = Math.random() < SKELETON_ARROW.missChance;
    const spread = (Math.random() - 0.5) * SKELETON_ARROW.spread;
    const missBias = miss
      ? (Math.random() < 0.5 ? -1 : 1) * (SKELETON_ARROW.missSpread * (0.8 + Math.random() * 0.6))
      : 0;
    const theta = baseAngle + spread + missBias;
    const vx = Math.cos(theta) * SKELETON_ARROW.speed;
    const vy = Math.sin(theta) * SKELETON_ARROW.speed;
    const travelTime = clamp((dist + 24) / SKELETON_ARROW.speed, 0.35, SKELETON_ARROW.maxLife);
    world.projectiles.push({
      id: world.nextProjectileId++,
      type: "arrow",
      monsterType: monster.type || "crawler",
      x: monster.x + Math.cos(theta) * 14,
      y: monster.y + Math.sin(theta) * 14,
      vx,
      vy,
      damage: baseDamage,
      radius: SKELETON_ARROW.radius,
      life: 0,
      maxLife: travelTime + 0.3,
      poisonDuration: Math.max(0, Number(poison?.duration) || 0),
      poisonDps: Math.max(0, Number(poison?.dps) || 0),
    });
  }

  function ensureMonsterBurnFx(world) {
    if (!world) return [];
    if (!Array.isArray(world.monsterBurnFx)) world.monsterBurnFx = [];
    return world.monsterBurnFx;
  }

  function spawnMonsterBurnBurst(world, x, y, burstCount = null) {
    if (!world || !Number.isFinite(x) || !Number.isFinite(y)) return;
    const fx = ensureMonsterBurnFx(world);
    const minBurst = MONSTER_BURN_FX.burstMin;
    const maxBurst = MONSTER_BURN_FX.burstMax;
    const count = Number.isFinite(burstCount)
      ? Math.max(1, Math.floor(burstCount))
      : (minBurst + Math.floor(Math.random() * (maxBurst - minBurst + 1)));
    for (let i = 0; i < count; i += 1) {
      const maxLife = MONSTER_BURN_FX.lifeMin + Math.random() * (MONSTER_BURN_FX.lifeMax - MONSTER_BURN_FX.lifeMin);
      fx.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * MONSTER_BURN_FX.spread,
        vy: -(MONSTER_BURN_FX.riseMin + Math.random() * (MONSTER_BURN_FX.riseMax - MONSTER_BURN_FX.riseMin)),
        life: maxLife,
        maxLife,
        size: MONSTER_BURN_FX.sizeMin + Math.random() * (MONSTER_BURN_FX.sizeMax - MONSTER_BURN_FX.sizeMin),
        ash: Math.random() < 0.58,
      });
    }
  }

  function updateMonsterBurnEffects(world, dt) {
    const fx = ensureMonsterBurnFx(world);
    if (!Array.isArray(fx) || fx.length === 0) return;
    for (let i = fx.length - 1; i >= 0; i -= 1) {
      const p = fx[i];
      if (!p) {
        fx.splice(i, 1);
        continue;
      }
      p.life -= dt;
      if (p.life <= 0) {
        fx.splice(i, 1);
        continue;
      }
      p.x += (p.vx || 0) * dt;
      p.y += (p.vy || 0) * dt;
      p.vx *= Math.max(0, 1 - dt * 2.3);
      p.vy -= dt * 8;
      p.size *= Math.max(0.96, 1 - dt * 0.35);
    }
  }

  function updateAllMonsterBurnEffects(dt) {
    const surface = state.surfaceWorld || state.world;
    if (!surface) return;
    updateMonsterBurnEffects(surface, dt);
    if (Array.isArray(surface.caves)) {
      for (const cave of surface.caves) {
        if (!cave?.world) continue;
        updateMonsterBurnEffects(cave.world, dt);
      }
    }
  }

  function igniteMonsterForDay(monster) {
    if (!monster) return;
    if (isDayImmuneMonster(monster)) {
      monster.dayBurning = false;
      monster.burnTimer = 0;
      monster.burnDuration = 0;
      return;
    }
    if (monster.dayBurning && (monster.burnTimer ?? 0) > 0) return;
    const duration = MONSTER_DAY_BURN.durationMin
      + Math.random() * (MONSTER_DAY_BURN.durationMax - MONSTER_DAY_BURN.durationMin);
    monster.dayBurning = true;
    monster.burnDuration = duration;
    monster.burnTimer = duration;
    monster.wanderTimer = 0;
    monster.attackTimer = Math.max(monster.attackTimer || 0, 0.2);
  }

  function igniteSurfaceMonstersForDay(world) {
    if (!world || !Array.isArray(world.monsters)) return;
    for (const monster of world.monsters) {
      if (!monster || monster.hp <= 0) continue;
      igniteMonsterForDay(monster);
    }
  }

  function getNearestMonsterTarget(monster, players, isSurface) {
    let target = null;
    let targetDist = Infinity;
    if (!monster || !Array.isArray(players)) {
      return { target, targetDist };
    }
    for (const player of players) {
      if (!player) continue;
      if (isSurface && player.inHut && !player.inCave) continue;
      const dx = player.x - monster.x;
      const dy = player.y - monster.y;
      const dist = Math.hypot(dx, dy);
      if (dist < targetDist) {
        target = player;
        targetDist = dist;
      }
    }
    return { target, targetDist };
  }

  function getMonsterPoisonPayload(monster) {
    if (!monster) return null;
    const variant = getMonsterVariant(monster.type);
    const duration = Math.max(
      0,
      Number(monster.poisonDuration ?? variant.poisonDuration) || 0
    );
    if (duration <= 0) return null;
    const dps = clamp(
      Number(monster.poisonDps ?? variant.poisonDps ?? POISON_STATUS.defaultDps) || POISON_STATUS.defaultDps,
      POISON_STATUS.minDps,
      POISON_STATUS.maxDps
    );
    return { duration, dps };
  }

  function updateMonsterProjectiles(world, dt, players, isSurface) {
    if (!world) return;
    if (!Array.isArray(world.projectiles) || world.projectiles.length === 0) return;
    const playerRadius = CONFIG.playerRadius * 0.72;
    for (let i = world.projectiles.length - 1; i >= 0; i -= 1) {
      const projectile = world.projectiles[i];
      if (!projectile) {
        world.projectiles.splice(i, 1);
        continue;
      }
      const prevX = projectile.x;
      const prevY = projectile.y;
      const canHearProjectile = shouldPlayWorldSfx(world, prevX, prevY, CONFIG.tileSize * 12);
      projectile.life = (projectile.life || 0) + dt;
      if (projectile.life > (projectile.maxLife || SKELETON_ARROW.maxLife)) {
        if (canHearProjectile) {
          playSfx("monsterAttackMiss", {
            monsterType: projectile.monsterType || "skeleton",
            inCave: !isSurface,
            intensity: 0.28,
            distance: Math.hypot(prevX - state.player.x, prevY - state.player.y),
          });
        }
        world.projectiles.splice(i, 1);
        continue;
      }

      const nextX = prevX + (projectile.vx || 0) * dt;
      const nextY = prevY + (projectile.vy || 0) * dt;
      if (
        isSurface
        && shouldBlockSurfaceHostilesAtTile(world, Math.floor(nextX / CONFIG.tileSize), Math.floor(nextY / CONFIG.tileSize))
      ) {
        world.projectiles.splice(i, 1);
        continue;
      }
      if (!isWalkableAtWorld(world, nextX, nextY)) {
        if (canHearProjectile) {
          playSfx("monsterAttackMiss", {
            monsterType: projectile.monsterType || "skeleton",
            inCave: !isSurface,
            intensity: 0.34,
            distance: Math.hypot(nextX - state.player.x, nextY - state.player.y),
          });
        }
        world.projectiles.splice(i, 1);
        continue;
      }
      projectile.x = nextX;
      projectile.y = nextY;

      let hit = false;
      for (const target of players) {
        if (isSurface && target.inHut && !target.inCave) continue;
        const d = pointSegmentDistance(target.x, target.y, prevX, prevY, nextX, nextY);
        if (d > playerRadius + (projectile.radius || SKELETON_ARROW.radius)) continue;
        const amount = Math.max(1, Math.floor(projectile.damage || MONSTER.damage));
        const poisonPayload = Number(projectile.poisonDuration) > 0
          ? {
              duration: Math.max(0, Number(projectile.poisonDuration) || 0),
              dps: Math.max(0, Number(projectile.poisonDps) || 0),
            }
          : null;
        if (target.id === (net.playerId || "local")) {
          if (poisonPayload) {
            applyPoisonStatus(poisonPayload.duration, poisonPayload.dps);
          }
          damagePlayer(amount, {
            monsterType: projectile.monsterType || "skeleton",
            attackKind: "projectile",
          });
        } else if (net.isHost) {
          damageRemotePlayer(target, amount, poisonPayload, {
            monsterType: projectile.monsterType || "skeleton",
            attackKind: "projectile",
          });
        }
        world.projectiles.splice(i, 1);
        hit = true;
        break;
      }
      if (hit) continue;
    }
  }

  function getSurfaceCampfireFearZones(world) {
    const surface = state.surfaceWorld || state.world;
    if (!world || world !== surface) return [];
    if (!Array.isArray(state.structures)) return [];
    const zones = [];
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.type !== "campfire") continue;
      const def = STRUCTURE_DEFS[structure.type];
      const baseRadius = Number(def?.lightRadius) || 0;
      if (baseRadius <= 0) continue;
      const avoidRadius = baseRadius + MONSTER_CAMPFIRE_FEAR.radiusPadding;
      zones.push({
        x: (structure.tx + 0.5) * CONFIG.tileSize,
        y: (structure.ty + 0.5) * CONFIG.tileSize,
        avoidRadius,
        steerRadius: avoidRadius + MONSTER_CAMPFIRE_FEAR.steerBuffer,
      });
    }
    return zones;
  }

  function getNearestCampfireFear(zones, x, y) {
    if (!Array.isArray(zones) || zones.length === 0) return null;
    let nearest = null;
    for (const zone of zones) {
      if (!zone) continue;
      const dx = x - zone.x;
      const dy = y - zone.y;
      const dist = Math.hypot(dx, dy);
      if (dist > zone.steerRadius) continue;
      if (!nearest || dist < nearest.dist) {
        nearest = {
          x: zone.x,
          y: zone.y,
          avoidRadius: zone.avoidRadius,
          steerRadius: zone.steerRadius,
          dx,
          dy,
          dist,
        };
      }
    }
    return nearest;
  }

  function applyCampfireFearToDirection(dirX, dirY, fear) {
    const baseX = Number(dirX) || 0;
    const baseY = Number(dirY) || 0;
    if (!fear) return { x: baseX, y: baseY };

    const dist = Math.max(0.0001, fear.dist);
    const awayX = fear.dx / dist;
    const awayY = fear.dy / dist;

    let weight = MONSTER_CAMPFIRE_FEAR.steerWeight;
    if (fear.dist < fear.avoidRadius) {
      weight = MONSTER_CAMPFIRE_FEAR.panicWeight;
    } else {
      const span = Math.max(1, fear.steerRadius - fear.avoidRadius);
      const closeness = 1 - clamp((fear.dist - fear.avoidRadius) / span, 0, 1);
      weight *= (0.35 + closeness * 0.95);
    }

    const blendedX = baseX + awayX * weight;
    const blendedY = baseY + awayY * weight;
    const blendedLen = Math.hypot(blendedX, blendedY);
    if (blendedLen <= 0.0001) return { x: awayX, y: awayY };
    return { x: blendedX / blendedLen, y: blendedY / blendedLen };
  }

  function moveMonsterWithCampfireFear(world, monster, dirX, dirY, step, campfireZones) {
    if (!monster || !Number.isFinite(step) || step <= 0) return;

    let moveX = Number(dirX) || 0;
    let moveY = Number(dirY) || 0;
    const startFear = getNearestCampfireFear(campfireZones, monster.x, monster.y);
    if (startFear) {
      const steered = applyCampfireFearToDirection(moveX, moveY, startFear);
      moveX = steered.x;
      moveY = steered.y;
    }

    const len = Math.hypot(moveX, moveY);
    if (len <= 0.0001) return;
    moveX /= len;
    moveY /= len;

    let nextX = monster.x + moveX * step;
    let nextY = monster.y + moveY * step;
    const nextFear = getNearestCampfireFear(campfireZones, nextX, nextY);
    const enteringLight = !!nextFear
      && nextFear.dist < nextFear.avoidRadius
      && (!startFear || startFear.dist >= startFear.avoidRadius - 0.1);
    if (enteringLight) {
      const panic = applyCampfireFearToDirection(0, 0, nextFear);
      nextX = monster.x + panic.x * step;
      nextY = monster.y + panic.y * step;
    }

    if (isWalkableAtWorld(world, nextX, monster.y)) monster.x = nextX;
    if (isWalkableAtWorld(world, monster.x, nextY)) monster.y = nextY;
  }

  function updateMonstersInWorld(world, dt, players, isSurface) {
    if (!world) return;
    if (!world.monsters) world.monsters = [];
    if (!world.projectiles) world.projectiles = [];
    if (!world.nextProjectileId) world.nextProjectileId = 1;

    if (isSurface) {
      despawnSurfaceHostilesOnMushroom(world);
      if (players.length === 0) {
        // No surface players active: clear transient arrows so they do not freeze mid-flight.
        world.projectiles = [];
        if (state.isNight) return;
      }
      if (state.isNight) {
        state.surfaceSpawnTimer -= dt;
        if (state.surfaceSpawnTimer <= 0) {
          spawnSurfaceMonstersForActiveIslands(world, players);
          state.surfaceSpawnTimer = MONSTER.spawnInterval;
        }
      } else if (Array.isArray(world.monsters) && world.monsters.length > 0) {
        igniteSurfaceMonstersForDay(world);
      }
      state.surfaceGuardianSpawnTimer -= dt;
      if (state.surfaceGuardianSpawnTimer <= 0) {
        spawnSurfaceGuardiansForActiveIslands(world, players);
        state.surfaceGuardianSpawnTimer = SURFACE_GUARDIAN_CONFIG.spawnInterval;
      }
    }

    updateMonsterProjectiles(world, dt, players, isSurface);
    const campfireFearZones = isSurface ? getSurfaceCampfireFearZones(world) : [];

    for (let i = world.monsters.length - 1; i >= 0; i -= 1) {
      const monster = world.monsters[i];
      if (monster.hitTimer > 0) monster.hitTimer -= dt;
      if (monster.attackTimer > 0) monster.attackTimer -= dt;

      if (monster.hp <= 0) {
        if (monster.dropLootOnDeath) {
          spawnMonsterDrops(world, monster);
        }
        world.monsters.splice(i, 1);
        continue;
      }

      const { target, targetDist } = getNearestMonsterTarget(monster, players, isSurface);
      const poisonPayload = getMonsterPoisonPayload(monster);
      const dayImmune = isDayImmuneMonster(monster);

      if (isSurface && !state.isNight && !dayImmune) {
        igniteMonsterForDay(monster);
        monster.burnTimer = Math.max(0, (monster.burnTimer ?? 0) - dt);
        const aggroRange = monster.aggroRange ?? MONSTER.aggroRange;
        const meleeRange = monster.attackRange ?? MONSTER.attackRange;
        const hitDamage = monster.damage ?? MONSTER.damage;
        const hitCooldown = monster.attackCooldown ?? MONSTER.attackCooldown;
        const rangedRange = monster.rangedRange ?? 0;
        const campfireFear = getNearestCampfireFear(campfireFearZones, monster.x, monster.y);
        const burnSpeedScale = MONSTER_DAY_BURN.moveSpeedScale;

        if (campfireFear && campfireFear.dist < campfireFear.avoidRadius) {
          monster.wanderTimer = 0;
          const panicStep = monster.speed * dt * Math.max(0.4, burnSpeedScale * 1.05);
          moveMonsterWithCampfireFear(world, monster, 0, 0, panicStep, campfireFearZones);
        } else if (target && targetDist < aggroRange) {
          const dx = target.x - monster.x;
          const dy = target.y - monster.y;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const vx = dx / dist;
          const vy = dy / dist;
          const isRanged = rangedRange > meleeRange + 10;

          if (isRanged && dist > meleeRange * 1.05 && dist < rangedRange) {
            if (monster.attackTimer <= 0) {
              spawnMonsterArrow(world, monster, target, hitDamage, poisonPayload);
              monster.attackTimer = hitCooldown;
            }

            const desired = rangedRange * 0.62;
            let moveDir = 0;
            if (dist < desired * 0.88) moveDir = -1;
            else if (dist > desired * 1.18) moveDir = 1;
            if (moveDir !== 0) {
              const step = monster.speed * 0.7 * burnSpeedScale * dt;
              moveMonsterWithCampfireFear(world, monster, vx * moveDir, vy * moveDir, step, campfireFearZones);
            }
          } else {
            const step = monster.speed * burnSpeedScale * dt;
            moveMonsterWithCampfireFear(world, monster, vx, vy, step, campfireFearZones);

            if (dist < meleeRange && monster.attackTimer <= 0) {
              if (target.id === (net.playerId || "local")) {
                if (poisonPayload) {
                  applyPoisonStatus(poisonPayload.duration, poisonPayload.dps);
                }
                damagePlayer(hitDamage, {
                  monsterType: monster.type,
                  attackKind: "melee",
                });
              } else if (net.isHost) {
                damageRemotePlayer(target, hitDamage, poisonPayload, {
                  monsterType: monster.type,
                  attackKind: "melee",
                });
              }
              monster.attackTimer = hitCooldown;
            }
          }
        } else {
          monster.wanderTimer = Number.isFinite(monster.wanderTimer) ? (monster.wanderTimer - dt) : 0;
          if (monster.wanderTimer <= 0) {
            const angle = Math.random() * Math.PI * 2;
            monster.dir.x = Math.cos(angle);
            monster.dir.y = Math.sin(angle);
            monster.wanderTimer = MONSTER_DAY_BURN.staggerResetMin
              + Math.random() * (MONSTER_DAY_BURN.staggerResetMax - MONSTER_DAY_BURN.staggerResetMin);
          }

          const burnStep = monster.speed * burnSpeedScale * dt;
          moveMonsterWithCampfireFear(world, monster, monster.dir.x, monster.dir.y, burnStep, campfireFearZones);
        }

        if (monster.burnTimer <= 0) {
          spawnMonsterBurnBurst(world, monster.x, monster.y);
          world.monsters.splice(i, 1);
        }
        continue;
      }

      if (isSurface && !state.isNight && dayImmune) {
        monster.dayBurning = false;
        monster.burnTimer = 0;
        monster.burnDuration = 0;
      }

      if (isSurface && targetDist > Math.max(viewWidth, viewHeight) + MONSTER.aggroRange) {
        continue;
      }

      const aggroRange = monster.aggroRange ?? MONSTER.aggroRange;
      const meleeRange = monster.attackRange ?? MONSTER.attackRange;
      const hitDamage = monster.damage ?? MONSTER.damage;
      const hitCooldown = monster.attackCooldown ?? MONSTER.attackCooldown;
      const rangedRange = monster.rangedRange ?? 0;
      const campfireFear = getNearestCampfireFear(campfireFearZones, monster.x, monster.y);

      if (campfireFear && campfireFear.dist < campfireFear.avoidRadius) {
        monster.wanderTimer = 0;
        const panicStep = monster.speed * dt * 0.95;
        moveMonsterWithCampfireFear(world, monster, 0, 0, panicStep, campfireFearZones);
        continue;
      }

      if (target && targetDist < aggroRange) {
        const dx = target.x - monster.x;
        const dy = target.y - monster.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const vx = dx / dist;
        const vy = dy / dist;
        const isRanged = rangedRange > meleeRange + 10;

        if (isRanged && dist > meleeRange * 1.05 && dist < rangedRange) {
          if (monster.attackTimer <= 0) {
            spawnMonsterArrow(world, monster, target, hitDamage, poisonPayload);
            monster.attackTimer = hitCooldown;
          }

          const desired = rangedRange * 0.62;
          let moveDir = 0;
          if (dist < desired * 0.88) moveDir = -1;
          else if (dist > desired * 1.18) moveDir = 1;
          if (moveDir !== 0) {
            const step = monster.speed * 0.7 * dt;
            moveMonsterWithCampfireFear(world, monster, vx * moveDir, vy * moveDir, step, campfireFearZones);
          }
        } else {
          const step = monster.speed * dt;
          moveMonsterWithCampfireFear(world, monster, vx, vy, step, campfireFearZones);

          if (dist < meleeRange && monster.attackTimer <= 0) {
            if (target.id === (net.playerId || "local")) {
              if (poisonPayload) {
                applyPoisonStatus(poisonPayload.duration, poisonPayload.dps);
              }
              damagePlayer(hitDamage, {
                monsterType: monster.type,
                attackKind: "melee",
              });
            } else if (net.isHost) {
              damageRemotePlayer(target, hitDamage, poisonPayload, {
                monsterType: monster.type,
                attackKind: "melee",
              });
            }
            monster.attackTimer = hitCooldown;
          }
        }
      } else {
        monster.wanderTimer -= dt;
        if (monster.wanderTimer <= 0) {
          const angle = Math.random() * Math.PI * 2;
          monster.dir.x = Math.cos(angle);
          monster.dir.y = Math.sin(angle);
          monster.wanderTimer = 1.5 + Math.random() * 1.5;
        }
        const step = monster.speed * 0.4 * dt;
        moveMonsterWithCampfireFear(world, monster, monster.dir.x, monster.dir.y, step, campfireFearZones);
      }
    }
  }

  function updateMonsters(dt) {
    if (!state.player) return;
    if (netIsClient()) return;
    if (state.gameWon) {
      if (state.surfaceWorld) {
        state.surfaceWorld.monsters = [];
        state.surfaceWorld.projectiles = [];
        if (Array.isArray(state.surfaceWorld.caves)) {
          for (const cave of state.surfaceWorld.caves) {
            if (!cave?.world) continue;
            cave.world.monsters = [];
            cave.world.projectiles = [];
          }
        }
      }
      return;
    }

    const surface = state.surfaceWorld || state.world;
    const surfacePlayers = getPlayersForWorld(surface);
    updateMonstersInWorld(surface, dt, surfacePlayers, true);

    if (Array.isArray(surface.caves)) {
      for (const cave of surface.caves) {
        if (isCaveHostilesBlocked(surface, cave)) {
          if (Array.isArray(cave.world?.monsters) && cave.world.monsters.length > 0) {
            cave.world.monsters = [];
          }
          if (Array.isArray(cave.world?.projectiles) && cave.world.projectiles.length > 0) {
            cave.world.projectiles = [];
          }
          continue;
        }
        const cavePlayers = getPlayersForWorld(cave.world);
        if (cavePlayers.length > 0) {
          updateMonstersInWorld(cave.world, dt, cavePlayers, false);
        }
      }
    }
  }

  function updateAnimals(dt) {
    if (netIsClient()) return;
    const world = state.surfaceWorld || state.world;
    if (!world || !Array.isArray(world.animals)) return;
    const maxAnimals = 32;
    const players = getPlayersForWorld(world);
    world.animalSpawnTimer -= dt;
    if (world.animalSpawnTimer <= 0) {
      world.animalSpawnTimer = 5 + Math.random() * 4;
      const spawnIslandHarvestAdded = ensureSpawnIslandHarvestAnimals(world, state.spawnTile, 4, maxAnimals);
      const greenCowAdded = ensureMushroomIslandGreenCows(world, maxAnimals);
      let passiveSpawned = false;
      if (world.animals.length < maxAnimals) {
        const activeIslands = getSurfaceActiveIslands(world, players);
        const spawnedNearPlayers = activeIslands.length > 0
          && spawnSurfaceAnimalFromIslands(world, 4.6, { islands: activeIslands });
        passiveSpawned = !!spawnedNearPlayers;
        if (!spawnedNearPlayers) {
          passiveSpawned = spawnSurfaceAnimalFromIslands(world, 5);
        }
      }
      if (greenCowAdded > 0 || spawnIslandHarvestAdded > 0 || passiveSpawned) {
        markDirty();
      }
    }

    let correctedAnimalPlacement = false;
    for (let i = world.animals.length - 1; i >= 0; i -= 1) {
      const animal = world.animals[i];
      if (!animal || !Number.isFinite(animal.x) || !Number.isFinite(animal.y)) {
        world.animals.splice(i, 1);
        continue;
      }
      if (animal.hitTimer > 0) animal.hitTimer -= dt;
      if (animal.hp <= 0) {
        world.animals.splice(i, 1);
        continue;
      }
      const currentTx = Math.floor(animal.x / CONFIG.tileSize);
      const currentTy = Math.floor(animal.y / CONFIG.tileSize);
      const onLandTile = inBounds(currentTx, currentTy, world.size)
        && world.tiles[tileIndex(currentTx, currentTy, world.size)] === 1
        && !world.beachGrid?.[tileIndex(currentTx, currentTy, world.size)];
      if (!onLandTile) {
        const clamped = clampEntityPositionToLand(world, animal.x, animal.y, 30);
        if (!clamped) {
          world.animals.splice(i, 1);
          correctedAnimalPlacement = true;
          continue;
        }
        animal.x = clamped.x;
        animal.y = clamped.y;
        correctedAnimalPlacement = true;
      }
      if (animal.fleeTimer > 0) animal.fleeTimer -= dt;

      let dirX = animal.dir.x || 0;
      let dirY = animal.dir.y || 0;
      if (animal.fleeTimer > 0 && state.player) {
        const dx = animal.x - state.player.x;
        const dy = animal.y - state.player.y;
        const len = Math.hypot(dx, dy) || 1;
        dirX = dx / len;
        dirY = dy / len;
      } else {
        animal.wanderTimer -= dt;
        if (animal.wanderTimer <= 0) {
          const angle = Math.random() * Math.PI * 2;
          dirX = Math.cos(angle);
          dirY = Math.sin(angle);
          animal.wanderTimer = 1.2 + Math.random() * 2.2;
        }
      }
      animal.dir.x = dirX;
      animal.dir.y = dirY;

      const step = animal.speed * dt * (animal.fleeTimer > 0 ? 1.3 : 0.8);
      const nextX = animal.x + dirX * step;
      const nextY = animal.y + dirY * step;
      const tx = Math.floor(nextX / CONFIG.tileSize);
      const ty = Math.floor(nextY / CONFIG.tileSize);
      if (canMoveAnimalTo(world, tx, ty)) {
        animal.x = nextX;
        animal.y = nextY;
      } else {
        animal.wanderTimer = 0;
        animal.dir.x = -dirY;
        animal.dir.y = dirX;
      }
      animal.renderX = animal.x;
      animal.renderY = animal.y;
    }
    if (correctedAnimalPlacement) {
      markDirty();
    }
  }

  function getAmbientFishSpawnDelay() {
    return AMBIENT_FISH_CONFIG.spawnIntervalMin
      + Math.random() * (AMBIENT_FISH_CONFIG.spawnIntervalMax - AMBIENT_FISH_CONFIG.spawnIntervalMin);
  }

  function canSpawnAmbientFishAt(world, x, y) {
    if (!world || !Number.isFinite(x) || !Number.isFinite(y)) return false;
    const tx = Math.floor(x / CONFIG.tileSize);
    const ty = Math.floor(y / CONFIG.tileSize);
    if (!inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    return world.tiles[idx] === 0;
  }

  function spawnAmbientFishNearCamera(world) {
    if (!world || state.ambientFish.length >= AMBIENT_FISH_CONFIG.maxFish) return;
    const camera = getCamera();
    const minX = camera.x - CONFIG.tileSize * 2;
    const minY = camera.y - CONFIG.tileSize * 2;
    const maxX = camera.x + viewWidth + CONFIG.tileSize * 2;
    const maxY = camera.y + viewHeight + CONFIG.tileSize * 2;

    for (let attempt = 0; attempt < 14; attempt += 1) {
      const x = minX + Math.random() * (maxX - minX);
      const y = minY + Math.random() * (maxY - minY);
      if (!canSpawnAmbientFishAt(world, x, y)) continue;

      const speed = AMBIENT_FISH_CONFIG.speedMin
        + Math.random() * (AMBIENT_FISH_CONFIG.speedMax - AMBIENT_FISH_CONFIG.speedMin);
      const angle = Math.random() * Math.PI * 2;
      const life = AMBIENT_FISH_CONFIG.lifeMin
        + Math.random() * (AMBIENT_FISH_CONFIG.lifeMax - AMBIENT_FISH_CONFIG.lifeMin);
      state.ambientFish.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        turnSpeed: (Math.random() < 0.5 ? -1 : 1) * (0.6 + Math.random() * 1.4),
        life,
        maxLife: life,
        size: AMBIENT_FISH_CONFIG.sizeMin
          + Math.random() * (AMBIENT_FISH_CONFIG.sizeMax - AMBIENT_FISH_CONFIG.sizeMin),
        phase: Math.random() * Math.PI * 2,
      });
      break;
    }
  }

  function updateAmbientFish(dt) {
    if (state.inCave || state.player?.inHut) {
      if (state.ambientFish.length > 0) state.ambientFish = [];
      state.ambientFishSpawnTimer = 0;
      return;
    }
    const world = state.surfaceWorld || state.world;
    if (!world || world !== state.surfaceWorld) {
      state.ambientFish = [];
      state.ambientFishSpawnTimer = 0;
      return;
    }

    state.ambientFishSpawnTimer -= dt;
    if (state.ambientFishSpawnTimer <= 0) {
      state.ambientFishSpawnTimer = getAmbientFishSpawnDelay();
      if (Math.random() < 0.45) {
        spawnAmbientFishNearCamera(world);
      }
    }

    const camera = getCamera();
    const minX = camera.x - CONFIG.tileSize * 5;
    const minY = camera.y - CONFIG.tileSize * 5;
    const maxX = camera.x + viewWidth + CONFIG.tileSize * 5;
    const maxY = camera.y + viewHeight + CONFIG.tileSize * 5;

    for (let i = state.ambientFish.length - 1; i >= 0; i -= 1) {
      const fish = state.ambientFish[i];
      if (!fish) {
        state.ambientFish.splice(i, 1);
        continue;
      }
      fish.life -= dt;
      if (fish.life <= 0) {
        state.ambientFish.splice(i, 1);
        continue;
      }
      fish.phase += dt * fish.turnSpeed;
      const speed = Math.hypot(fish.vx, fish.vy) || AMBIENT_FISH_CONFIG.speedMin;
      const dir = Math.atan2(fish.vy, fish.vx) + Math.sin(fish.phase) * 0.12 * dt * 60;
      fish.vx = Math.cos(dir) * speed;
      fish.vy = Math.sin(dir) * speed;
      fish.x += fish.vx * dt;
      fish.y += fish.vy * dt;

      if (!canSpawnAmbientFishAt(world, fish.x, fish.y)) {
        state.ambientFish.splice(i, 1);
        continue;
      }
      if (fish.x < minX || fish.y < minY || fish.x > maxX || fish.y > maxY) {
        state.ambientFish.splice(i, 1);
      }
    }

    if (state.ambientFish.length > AMBIENT_FISH_CONFIG.maxFish) {
      state.ambientFish.length = AMBIENT_FISH_CONFIG.maxFish;
    }
  }

  function updateVillagers(dt) {
    if (netIsClient()) return;
    const world = state.surfaceWorld || state.world;
    if (!world || !Array.isArray(world.villagers) || world.villagers.length === 0) return;

    for (const villager of world.villagers) {
      if (!villager) continue;
      if (!Number.isFinite(villager.x) || !Number.isFinite(villager.y)) continue;

      if (!villager.dir || typeof villager.dir !== "object") {
        villager.dir = { x: 0, y: 0 };
      }
      const homeX = Number.isFinite(villager.homeX) ? villager.homeX : villager.x;
      const homeY = Number.isFinite(villager.homeY) ? villager.homeY : villager.y;
      villager.homeX = homeX;
      villager.homeY = homeY;
      const speed = clamp(
        Number(villager.speed) || ((VILLAGER_CONFIG.speedMin + VILLAGER_CONFIG.speedMax) * 0.5),
        VILLAGER_CONFIG.speedMin,
        VILLAGER_CONFIG.speedMax
      );
      villager.speed = speed;
      const wanderRadius = clamp(
        Number(villager.wanderRadius) || (VILLAGER_CONFIG.wanderRadiusTiles * CONFIG.tileSize),
        CONFIG.tileSize * 4,
        CONFIG.tileSize * 12
      );
      villager.wanderRadius = wanderRadius;

      const toHomeX = homeX - villager.x;
      const toHomeY = homeY - villager.y;
      const homeDist = Math.hypot(toHomeX, toHomeY);
      let dirX = Number(villager.dir.x) || 0;
      let dirY = Number(villager.dir.y) || 0;

      villager.wanderTimer = Number.isFinite(villager.wanderTimer) ? villager.wanderTimer - dt : 0;
      if (homeDist > wanderRadius * 1.08) {
        const len = homeDist || 1;
        dirX = (toHomeX / len) + (Math.random() - 0.5) * 0.24;
        dirY = (toHomeY / len) + (Math.random() - 0.5) * 0.24;
        villager.wanderTimer = VILLAGER_CONFIG.wanderResetMin;
      } else if (villager.wanderTimer <= 0) {
        const angle = Math.random() * Math.PI * 2;
        dirX = Math.cos(angle);
        dirY = Math.sin(angle);
        villager.wanderTimer = VILLAGER_CONFIG.wanderResetMin
          + Math.random() * (VILLAGER_CONFIG.wanderResetMax - VILLAGER_CONFIG.wanderResetMin);
      }

      const dirLen = Math.hypot(dirX, dirY) || 1;
      dirX /= dirLen;
      dirY /= dirLen;
      villager.dir.x = dirX;
      villager.dir.y = dirY;

      const step = speed * dt * (homeDist > wanderRadius ? 1.08 : 0.78);
      const nextX = villager.x + dirX * step;
      const nextY = villager.y + dirY * step;
      const nextTx = Math.floor(nextX / CONFIG.tileSize);
      const nextTy = Math.floor(nextY / CONFIG.tileSize);
      const moveXOk = canMoveVillagerTo(world, nextTx, Math.floor(villager.y / CONFIG.tileSize));
      const moveYOk = canMoveVillagerTo(world, Math.floor(villager.x / CONFIG.tileSize), nextTy);

      if (moveXOk) villager.x = nextX;
      if (moveYOk) villager.y = nextY;

      if (!moveXOk && !moveYOk) {
        villager.wanderTimer = 0;
        villager.dir.x = -dirY;
        villager.dir.y = dirX;
      }

      const postHomeDist = Math.hypot(villager.x - homeX, villager.y - homeY);
      if (postHomeDist > wanderRadius * 1.35) {
        const pullX = homeX - villager.x;
        const pullY = homeY - villager.y;
        const pullLen = Math.hypot(pullX, pullY) || 1;
        const pullStep = Math.min(step * 1.4, postHomeDist - wanderRadius);
        const pullTargetX = villager.x + (pullX / pullLen) * pullStep;
        const pullTargetY = villager.y + (pullY / pullLen) * pullStep;
        const pullTx = Math.floor(pullTargetX / CONFIG.tileSize);
        const pullTy = Math.floor(pullTargetY / CONFIG.tileSize);
        if (canMoveVillagerTo(world, pullTx, pullTy)) {
          villager.x = pullTargetX;
          villager.y = pullTargetY;
        }
      }

      villager.renderX = villager.x;
      villager.renderY = villager.y;
    }
  }

  function getSpawnCraftingBench(world) {
    if (!world || !Array.isArray(state.structures)) return null;
    const spawn = state.spawnTile || findSpawnTile(world);
    let nearestSpawnBench = null;
    let nearestSpawnDist = Infinity;
    let nearestBench = null;
    let nearestBenchDist = Infinity;
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.type !== "bench") continue;
      const dist = Math.hypot((structure.tx ?? 0) - spawn.x, (structure.ty ?? 0) - spawn.y);
      if (dist < nearestBenchDist) {
        nearestBench = structure;
        nearestBenchDist = dist;
      }
      if (structure.meta?.village) continue;
      if (dist < nearestSpawnDist) {
        nearestSpawnBench = structure;
        nearestSpawnDist = dist;
      }
    }
    return nearestSpawnBench || nearestBench || null;
  }

  function getBenchAtTile(tx, ty) {
    if (!Number.isInteger(tx) || !Number.isInteger(ty)) return null;
    const atTile = getStructureAt(tx, ty);
    if (atTile && !atTile.removed && atTile.type === "bench") return atTile;
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.type !== "bench") continue;
      if (structure.tx === tx && structure.ty === ty) return structure;
    }
    return null;
  }

  function getBenchStandCandidates(bench) {
    if (!bench) return [];
    return [
      { tx: bench.tx + 1, ty: bench.ty },
      { tx: bench.tx - 1, ty: bench.ty },
      { tx: bench.tx, ty: bench.ty + 1 },
      { tx: bench.tx, ty: bench.ty - 1 },
      { tx: bench.tx + 1, ty: bench.ty + 1 },
      { tx: bench.tx - 1, ty: bench.ty + 1 },
      { tx: bench.tx + 1, ty: bench.ty - 1 },
      { tx: bench.tx - 1, ty: bench.ty - 1 },
    ];
  }

  function getRobotRecallTargetPosition(world, structure, robot, bench) {
    if (!world || !structure || !bench) return null;
    const candidates = getBenchStandCandidates(bench).filter((candidate) => (
      isRobotWalkableTile(world, structure, candidate.tx, candidate.ty)
    ));
    if (candidates.length === 0) return null;
    const seed = Math.abs(
      ((structure.id || 0) * 37)
      + ((bench.tx || 0) * 17)
      + ((bench.ty || 0) * 29)
    );
    const pick = candidates[seed % candidates.length];
    return {
      x: (pick.tx + 0.5) * CONFIG.tileSize,
      y: (pick.ty + 0.5) * CONFIG.tileSize,
    };
  }

  function getSpawnCraftingReturnTile(world, structure, robot) {
    if (!world) return null;
    const bench = getSpawnCraftingBench(world);
    if (bench) {
      const candidates = getBenchStandCandidates(bench);
      let best = null;
      let bestDist = Infinity;
      for (const candidate of candidates) {
        if (!isRobotWalkableTile(world, structure, candidate.tx, candidate.ty)) continue;
        const cx = (candidate.tx + 0.5) * CONFIG.tileSize;
        const cy = (candidate.ty + 0.5) * CONFIG.tileSize;
        const dist = robot ? Math.hypot(cx - robot.x, cy - robot.y) : 0;
        if (dist < bestDist) {
          best = candidate;
          bestDist = dist;
        }
      }
      if (best) return best;
    }

    const spawn = state.spawnTile || findSpawnTile(world);
    const nearSpawn = findOpenSurfaceTileNear(world, spawn.x, spawn.y, 10);
    if (nearSpawn && isRobotWalkableTile(world, structure, nearSpawn.tx, nearSpawn.ty)) {
      return { tx: nearSpawn.tx, ty: nearSpawn.ty };
    }
    if (isRobotWalkableTile(world, structure, spawn.x, spawn.y)) {
      return { tx: spawn.x, ty: spawn.y };
    }
    if (robot && isRobotWalkableTile(world, structure, robot.homeTx, robot.homeTy)) {
      return { tx: robot.homeTx, ty: robot.homeTy };
    }
    return null;
  }

  function getRobotHomeWorldPosition(world, structure, robot) {
    const homeTile = getSpawnCraftingReturnTile(world, structure, robot);
    if (homeTile) {
      return {
        x: (homeTile.tx + 0.5) * CONFIG.tileSize,
        y: (homeTile.ty + 0.5) * CONFIG.tileSize,
      };
    }
    return {
      x: (robot.homeTx + 0.5) * CONFIG.tileSize,
      y: (robot.homeTy + 0.5) * CONFIG.tileSize,
    };
  }

  function ensureRobotNavigationState(robot) {
    if (!robot || typeof robot !== "object") return null;
    if (!robot.navigation || typeof robot.navigation !== "object") {
      robot.navigation = {
        path: null,
        pathIndex: 0,
        goalTx: null,
        goalTy: null,
        stuckTimer: 0,
        lastX: robot.x,
        lastY: robot.y,
      };
      return robot.navigation;
    }
    const nav = robot.navigation;
    if (!Array.isArray(nav.path)) nav.path = null;
    if (!Number.isInteger(nav.pathIndex) || nav.pathIndex < 0) nav.pathIndex = 0;
    if (!Number.isInteger(nav.goalTx)) nav.goalTx = null;
    if (!Number.isInteger(nav.goalTy)) nav.goalTy = null;
    if (!Number.isFinite(nav.stuckTimer)) nav.stuckTimer = 0;
    if (!Number.isFinite(nav.lastX)) nav.lastX = robot.x;
    if (!Number.isFinite(nav.lastY)) nav.lastY = robot.y;
    return nav;
  }

  function clearRobotNavigation(robot) {
    const nav = ensureRobotNavigationState(robot);
    if (!nav) return;
    nav.path = null;
    nav.pathIndex = 0;
    nav.goalTx = null;
    nav.goalTy = null;
    nav.stuckTimer = 0;
    nav.lastX = robot.x;
    nav.lastY = robot.y;
  }

  function isRobotWalkableTile(world, structure, tx, ty) {
    if (!world || !inBounds(tx, ty, world.size)) return false;

    if (world === (state.surfaceWorld || state.world)) {
      if (getCaveAt(world, tx, ty)) return false;
      const occupant = getStructureAt(tx, ty);
      if (occupant && occupant !== structure) {
        const def = STRUCTURE_DEFS[occupant.type];
        return !!def?.walkable;
      }
      if (occupant && occupant === structure) {
        const def = STRUCTURE_DEFS[occupant.type];
        if (def?.walkable) return true;
      }
    }

    const idx = tileIndex(tx, ty, world.size);
    return world.tiles[idx] === 1;
  }

  function isRobotOnBeachTile(world, robot) {
    if (!world || !robot) return false;
    const tx = Math.floor(robot.x / CONFIG.tileSize);
    const ty = Math.floor(robot.y / CONFIG.tileSize);
    if (!inBounds(tx, ty, world.size)) return false;
    return !!world.beachGrid?.[tileIndex(tx, ty, world.size)];
  }

  function tryRouteRobotTowardNearestBridge(world, structure, robot, target = null) {
    if (!world || !robot || !Array.isArray(state.structures)) return false;
    const startTx = Math.floor(robot.x / CONFIG.tileSize);
    const startTy = Math.floor(robot.y / CONFIG.tileSize);
    if (!inBounds(startTx, startTy, world.size)) return false;
    const bridgeCandidates = state.structures
      .filter((entry) => entry && !entry.removed && (entry.type === "bridge" || entry.type === "dock"))
      .map((entry) => {
        const centerX = (entry.tx + 0.5) * CONFIG.tileSize;
        const centerY = (entry.ty + 0.5) * CONFIG.tileSize;
        return {
          entry,
          dist: Math.hypot(centerX - robot.x, centerY - robot.y),
        };
      })
      .sort((a, b) => a.dist - b.dist)
      .slice(0, ROBOT_CONFIG.bridgePathChecks)
      .map((item) => item.entry);
    if (bridgeCandidates.length === 0) return false;

    let best = null;
    let bestScore = Infinity;
    for (const bridge of bridgeCandidates) {
      const path = findRobotTilePath(world, structure, startTx, startTy, bridge.tx, bridge.ty);
      if (!path || path.length === 0) continue;
      const bridgeX = (bridge.tx + 0.5) * CONFIG.tileSize;
      const bridgeY = (bridge.ty + 0.5) * CONFIG.tileSize;
      const towardTarget = target
        ? Math.hypot(target.x - bridgeX, target.y - bridgeY) / CONFIG.tileSize
        : 0;
      const score = path.length + towardTarget * 0.33;
      if (score < bestScore) {
        bestScore = score;
        best = {
          tx: bridge.tx,
          ty: bridge.ty,
          path,
        };
      }
    }
    if (!best) return false;

    const nav = ensureRobotNavigationState(robot);
    if (!nav) return false;
    nav.path = best.path;
    nav.pathIndex = 0;
    nav.goalTx = best.tx;
    nav.goalTy = best.ty;
    nav.stuckTimer = 0;
    nav.lastX = robot.x;
    nav.lastY = robot.y;
    return true;
  }

  function findRobotTilePath(world, structure, startTx, startTy, goalTx, goalTy, maxNodes = ROBOT_CONFIG.maxPathNodes) {
    if (!world) return null;
    if (!inBounds(startTx, startTy, world.size) || !inBounds(goalTx, goalTy, world.size)) return null;
    if (startTx === goalTx && startTy === goalTy) return [];
    if (!isRobotWalkableTile(world, structure, goalTx, goalTy)) return null;

    const size = world.size;
    const total = size * size;
    const visited = new Uint8Array(total);
    const cameFrom = new Int32Array(total);
    cameFrom.fill(-1);
    const queue = new Int32Array(total);

    const startIdx = tileIndex(startTx, startTy, size);
    const goalIdx = tileIndex(goalTx, goalTy, size);

    visited[startIdx] = 1;
    queue[0] = startIdx;
    let head = 0;
    let tail = 1;
    let explored = 0;

    while (head < tail && explored < maxNodes) {
      const current = queue[head++];
      explored += 1;
      if (current === goalIdx) break;

      const cx = current % size;
      const cy = (current - cx) / size;
      let nx = cx + 1;
      let ny = cy;
      if (inBounds(nx, ny, size)) {
        let nextIdx = tileIndex(nx, ny, size);
        if (!visited[nextIdx] && isRobotWalkableTile(world, structure, nx, ny)) {
          visited[nextIdx] = 1;
          cameFrom[nextIdx] = current;
          queue[tail++] = nextIdx;
        }
      }

      nx = cx - 1;
      ny = cy;
      if (inBounds(nx, ny, size)) {
        let nextIdx = tileIndex(nx, ny, size);
        if (!visited[nextIdx] && isRobotWalkableTile(world, structure, nx, ny)) {
          visited[nextIdx] = 1;
          cameFrom[nextIdx] = current;
          queue[tail++] = nextIdx;
        }
      }

      nx = cx;
      ny = cy + 1;
      if (inBounds(nx, ny, size)) {
        let nextIdx = tileIndex(nx, ny, size);
        if (!visited[nextIdx] && isRobotWalkableTile(world, structure, nx, ny)) {
          visited[nextIdx] = 1;
          cameFrom[nextIdx] = current;
          queue[tail++] = nextIdx;
        }
      }

      nx = cx;
      ny = cy - 1;
      if (inBounds(nx, ny, size)) {
        let nextIdx = tileIndex(nx, ny, size);
        if (!visited[nextIdx] && isRobotWalkableTile(world, structure, nx, ny)) {
          visited[nextIdx] = 1;
          cameFrom[nextIdx] = current;
          queue[tail++] = nextIdx;
        }
      }
    }

    if (!visited[goalIdx]) return null;

    const path = [];
    let cursor = goalIdx;
    while (cursor !== startIdx) {
      const tx = cursor % size;
      const ty = (cursor - tx) / size;
      path.push({ tx, ty });
      cursor = cameFrom[cursor];
      if (cursor === -1) return null;
    }
    path.reverse();
    return path;
  }

  function tryMoveRobotTo(world, structure, robot, x, y) {
    const tx = Math.floor(x / CONFIG.tileSize);
    const ty = Math.floor(y / CONFIG.tileSize);
    if (!isRobotWalkableTile(world, structure, tx, ty)) return false;
    robot.x = x;
    robot.y = y;
    return true;
  }

  function moveRobotStepToward(world, structure, robot, targetX, targetY, dt) {
    if (!robot || !world || !structure) return false;
    const dx = targetX - robot.x;
    const dy = targetY - robot.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= 0.001) return false;

    const nx = dx / dist;
    const ny = dy / dist;
    const step = Math.min(ROBOT_CONFIG.speed * dt, dist);
    const moveX = robot.x + nx * step;
    const moveY = robot.y + ny * step;
    if (tryMoveRobotTo(world, structure, robot, moveX, moveY)) return true;
    if (tryMoveRobotTo(world, structure, robot, moveX, robot.y)) return true;
    if (tryMoveRobotTo(world, structure, robot, robot.x, moveY)) return true;

    const sidestep = step * 0.7;
    const sx = -ny;
    const sy = nx;
    if (tryMoveRobotTo(world, structure, robot, robot.x + sx * sidestep, robot.y + sy * sidestep)) return true;
    return tryMoveRobotTo(world, structure, robot, robot.x - sx * sidestep, robot.y - sy * sidestep);
  }

  function moveRobotToward(world, structure, robot, targetX, targetY, dt) {
    if (!robot || !world || !structure) return false;
    const nav = ensureRobotNavigationState(robot);
    if (!nav) return false;

    const startTx = Math.floor(robot.x / CONFIG.tileSize);
    const startTy = Math.floor(robot.y / CONFIG.tileSize);
    const targetTx = Math.floor(targetX / CONFIG.tileSize);
    const targetTy = Math.floor(targetY / CONFIG.tileSize);
    if (!inBounds(startTx, startTy, world.size) || !inBounds(targetTx, targetTy, world.size)) {
      nav.stuckTimer += dt;
      return false;
    }

    const goalChanged = nav.goalTx !== targetTx || nav.goalTy !== targetTy;
    if (goalChanged || !Array.isArray(nav.path)) {
      nav.path = findRobotTilePath(world, structure, startTx, startTy, targetTx, targetTy);
      nav.pathIndex = 0;
      nav.goalTx = targetTx;
      nav.goalTy = targetTy;
      if (!nav.path) {
        nav.stuckTimer += dt;
        return false;
      }
    }

    while (Array.isArray(nav.path) && nav.pathIndex < nav.path.length) {
      const node = nav.path[nav.pathIndex];
      if (!node || !isRobotWalkableTile(world, structure, node.tx, node.ty)) {
        nav.path = findRobotTilePath(world, structure, startTx, startTy, targetTx, targetTy);
        nav.pathIndex = 0;
        if (!nav.path) {
          nav.stuckTimer += dt;
          return false;
        }
        continue;
      }
      const nodeX = (node.tx + 0.5) * CONFIG.tileSize;
      const nodeY = (node.ty + 0.5) * CONFIG.tileSize;
      if (Math.hypot(nodeX - robot.x, nodeY - robot.y) <= ROBOT_CONFIG.pathNodeSnapDistance) {
        nav.pathIndex += 1;
        continue;
      }
      break;
    }

    let waypointX = targetX;
    let waypointY = targetY;
    if (Array.isArray(nav.path) && nav.pathIndex < nav.path.length) {
      const node = nav.path[nav.pathIndex];
      waypointX = (node.tx + 0.5) * CONFIG.tileSize;
      waypointY = (node.ty + 0.5) * CONFIG.tileSize;
    }

    const moved = moveRobotStepToward(world, structure, robot, waypointX, waypointY, dt);
    const movedDist = Math.hypot(robot.x - nav.lastX, robot.y - nav.lastY);
    nav.lastX = robot.x;
    nav.lastY = robot.y;

    if (moved && movedDist > ROBOT_CONFIG.stuckMoveEpsilon) {
      nav.stuckTimer = 0;
      return true;
    }

    nav.stuckTimer += dt;
    if (!moved) {
      nav.path = null;
      nav.pathIndex = 0;
    }
    return moved;
  }

  function findRobotTargetResource(world, structure, robot, reservedResourceIds = null) {
    if (!world || !robot || !Array.isArray(world.resources)) return null;
    const candidates = [];
    for (const resource of world.resources) {
      if (!robotCanMineResource(robot, resource)) continue;
      if (reservedResourceIds && Number.isInteger(resource.id) && reservedResourceIds.has(resource.id)) {
        continue;
      }
      const dist = Math.hypot(resource.x - robot.x, resource.y - robot.y);
      candidates.push({ resource, dist });
    }

    if (candidates.length === 0) return null;
    candidates.sort((a, b) => a.dist - b.dist);

    const startTx = Math.floor(robot.x / CONFIG.tileSize);
    const startTy = Math.floor(robot.y / CONFIG.tileSize);
    const checks = Math.min(candidates.length, ROBOT_CONFIG.retargetPathChecks);
    for (let i = 0; i < checks; i += 1) {
      const candidate = candidates[i].resource;
      const rawTargetTx = Number.isFinite(candidate.tx) ? candidate.tx : (candidate.x / CONFIG.tileSize);
      const rawTargetTy = Number.isFinite(candidate.ty) ? candidate.ty : (candidate.y / CONFIG.tileSize);
      const targetTx = Math.floor(rawTargetTx);
      const targetTy = Math.floor(rawTargetTy);
      const path = findRobotTilePath(world, structure, startTx, startTy, targetTx, targetTy);
      if (path) return candidate;
    }
    const fallbackChecks = Math.min(
      candidates.length,
      Math.max(checks, ROBOT_CONFIG.retargetPathFallbackChecks)
    );
    for (let i = checks; i < fallbackChecks; i += 1) {
      const candidate = candidates[i].resource;
      const rawTargetTx = Number.isFinite(candidate.tx) ? candidate.tx : (candidate.x / CONFIG.tileSize);
      const rawTargetTy = Number.isFinite(candidate.ty) ? candidate.ty : (candidate.y / CONFIG.tileSize);
      const targetTx = Math.floor(rawTargetTx);
      const targetTy = Math.floor(rawTargetTy);
      const path = findRobotTilePath(world, structure, startTx, startTy, targetTx, targetTy);
      if (path) return candidate;
    }
    return null;
  }

  function updateRobot(structure, world, dt, reservedResourceIds = null) {
    const robot = ensureRobotMeta(structure);
    if (!robot || !world) return;
    const nav = ensureRobotNavigationState(robot);

    robot.mineTimer = Math.max(0, (robot.mineTimer || 0) - dt);
    robot.retargetTimer = Math.max(0, (robot.retargetTimer || 0) - dt);
    robot.pauseTimer = Math.max(0, (robot.pauseTimer || 0) - dt);
    if (!Array.isArray(structure.storage)) {
      structure.storage = createEmptyInventory(ROBOT_STORAGE_SIZE);
    }

    if (robot.pauseTimer > 0) {
      robot.state = "paused";
      if (nav) {
        nav.stuckTimer = 0;
        nav.lastX = robot.x;
        nav.lastY = robot.y;
      }
      return;
    }

    const home = getRobotHomeWorldPosition(world, structure, robot);
    let claimedResourceId = null;
    const claimResourceTarget = (resourceId) => {
      if (!Number.isInteger(resourceId)) return false;
      if (reservedResourceIds) {
        if (reservedResourceIds.has(resourceId)) return false;
        reservedResourceIds.add(resourceId);
      }
      claimedResourceId = resourceId;
      return true;
    };
    const clearRobotTarget = (resetRetarget = false) => {
      if (
        reservedResourceIds
        && Number.isInteger(claimedResourceId)
        && Number.isInteger(robot.targetResourceId)
        && robot.targetResourceId === claimedResourceId
      ) {
        reservedResourceIds.delete(claimedResourceId);
      }
      claimedResourceId = null;
      robot.targetResourceId = null;
      if (resetRetarget) {
        robot.retargetTimer = 0;
      }
    };

    if (robot.recallActive) {
      const recallBench = getBenchAtTile(robot.recallBenchTx, robot.recallBenchTy);
      if (!recallBench) {
        robot.recallActive = false;
        robot.recallBenchTx = null;
        robot.recallBenchTy = null;
      } else {
        const recallPos = getRobotRecallTargetPosition(world, structure, robot, recallBench);
        if (recallPos) {
          const recallDist = Math.hypot(recallPos.x - robot.x, recallPos.y - robot.y);
          if (recallDist > CONFIG.tileSize * 0.45) {
            robot.state = "recalling";
            moveRobotToward(world, structure, robot, recallPos.x, recallPos.y, dt);
          } else {
            robot.state = "recalled";
            clearRobotNavigation(robot);
          }
        } else {
          robot.state = "recalled";
          clearRobotNavigation(robot);
        }
        return;
      }
    }

    if (robot.manualStop) {
      clearRobotTarget(true);
      const stopDist = Math.hypot(home.x - robot.x, home.y - robot.y);
      if (stopDist > CONFIG.tileSize * 0.5) {
        robot.state = "returning";
        moveRobotToward(world, structure, robot, home.x, home.y, dt);
      } else {
        robot.state = "stopped";
        clearRobotNavigation(robot);
      }
      return;
    }

    if (!isRobotMode(robot.mode)) {
      clearRobotTarget(true);
      robot.state = "idle";
      clearRobotNavigation(robot);
      return;
    }

    const storageFull = isInventoryFull(structure.storage);
    if (storageFull) {
      const homeDist = Math.hypot(home.x - robot.x, home.y - robot.y);
      if (homeDist > CONFIG.tileSize * 0.4) {
        robot.state = "returning";
        moveRobotToward(world, structure, robot, home.x, home.y, dt);
      } else {
        robot.state = "waiting";
        clearRobotNavigation(robot);
      }
      clearRobotTarget(false);
      return;
    }

    let target = Number.isInteger(robot.targetResourceId)
      ? world.resources?.[robot.targetResourceId] ?? null
      : null;
    if (!robotCanMineResource(robot, target)) {
      target = null;
      clearRobotTarget(false);
      clearRobotNavigation(robot);
    } else if (target && !claimResourceTarget(target.id)) {
      target = null;
      clearRobotTarget(true);
      clearRobotNavigation(robot);
    }

    if (!target && robot.retargetTimer <= 0) {
      target = findRobotTargetResource(world, structure, robot, reservedResourceIds);
      if (target && claimResourceTarget(target.id)) {
        robot.targetResourceId = target.id;
      } else {
        target = null;
        robot.targetResourceId = null;
      }
      robot.retargetTimer = target
        ? ROBOT_CONFIG.retargetInterval
        : ROBOT_CONFIG.retargetIdleInterval;
      if (!target) clearRobotNavigation(robot);
    }

    if (!target) {
      const bridgeRouted = tryRouteRobotTowardNearestBridge(world, structure, robot, null);
      if (bridgeRouted && nav && Number.isInteger(nav.goalTx) && Number.isInteger(nav.goalTy)) {
        const bridgeX = (nav.goalTx + 0.5) * CONFIG.tileSize;
        const bridgeY = (nav.goalTy + 0.5) * CONFIG.tileSize;
        robot.state = "moving";
        moveRobotToward(world, structure, robot, bridgeX, bridgeY, dt);
        robot.retargetTimer = Math.min(
          robot.retargetTimer || ROBOT_CONFIG.retargetIdleInterval,
          ROBOT_CONFIG.retargetIdleInterval
        );
        return;
      }
      const homeDist = Math.hypot(home.x - robot.x, home.y - robot.y);
      if (homeDist > CONFIG.tileSize * 0.5) {
        robot.state = "returning";
        moveRobotToward(world, structure, robot, home.x, home.y, dt);
      } else {
        robot.state = "idle";
        clearRobotNavigation(robot);
      }
      return;
    }

    const distToTarget = Math.hypot(target.x - robot.x, target.y - robot.y);
    if (distToTarget > ROBOT_CONFIG.mineRange) {
      robot.state = "moving";
      const moved = moveRobotToward(world, structure, robot, target.x, target.y, dt);
      if (!moved && nav) {
        const onBeach = isRobotOnBeachTile(world, robot);
        const stuckLimit = onBeach
          ? ROBOT_CONFIG.sandStuckRetargetTime
          : ROBOT_CONFIG.stuckRetargetTime;
        if (nav.stuckTimer >= stuckLimit) {
          if (tryRouteRobotTowardNearestBridge(world, structure, robot, target)) {
            robot.state = "moving";
            return;
          }
          clearRobotTarget(true);
          robot.state = "idle";
          clearRobotNavigation(robot);
        }
      }
      return;
    }
    clearRobotNavigation(robot);

    if (robot.mineTimer > 0) {
      robot.state = "mining";
      return;
    }

    const dropId = getResourceDropId(target);
    if (!dropId) {
      clearRobotTarget(true);
      robot.state = "idle";
      clearRobotNavigation(robot);
      return;
    }
    const dropQty = getResourceDropQty(target);

    stabilizeResourceHp(target);
    const nextDamage = Math.max(1, Math.floor(ROBOT_CONFIG.mineDamage));
    const willBreak = target.hp <= nextDamage;
    if (willBreak && !canAddItem(structure.storage, dropId, dropQty)) {
      clearRobotTarget(false);
      robot.state = "returning";
      clearRobotNavigation(robot);
      return;
    }

    const canHear = shouldPlayWorldSfx(world, robot.x, robot.y);
    applyHarvestToResource(world, target, nextDamage, false, canHear);
    if (willBreak) {
      addItem(structure.storage, dropId, dropQty);
      clearRobotTarget(true);
      clearRobotNavigation(robot);
    }
    robot.mineTimer = ROBOT_CONFIG.mineCooldown;
    robot.state = "mining";
    markDirty();
  }

  function updateRobots(dt) {
    if (netIsClient()) return;
    const world = state.surfaceWorld || state.world;
    if (!world) return;
    if (state.gameWon) return;
    let changed = false;
    const reservedResourceIds = new Set();
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.type !== "robot") continue;
      const before = getRobotPosition(structure);
      updateRobot(structure, world, dt, reservedResourceIds);
      const after = getRobotPosition(structure);
      if (!before || !after) continue;
      if (Math.hypot(after.x - before.x, after.y - before.y) > 0.01) {
        changed = true;
      }
    }
    if (changed) {
      markDirty();
    }
  }

  function getActiveRobotInteractionTarget() {
    const activeStationRobot = state.activeStation?.type === "robot" ? state.activeStation : null;
    if (activeStationRobot && !activeStationRobot.removed && !activeStationRobot.interior) return activeStationRobot;
    const activeChestRobot = state.activeChest?.type === "robot" ? state.activeChest : null;
    if (activeChestRobot && !activeChestRobot.removed && !activeChestRobot.interior) return activeChestRobot;
    const nearRobot = state.nearStation?.type === "robot" ? state.nearStation : null;
    if (nearRobot && !nearRobot.removed && !nearRobot.interior) return nearRobot;
    return null;
  }

  function drawRobotInteractionHighlight(camera) {
    if (state.inCave || state.player?.inHut) return;
    const target = getActiveRobotInteractionTarget();
    if (!target) return;
    const center = getStructureCenterWorld(target);
    const screen = worldToScreen(center.x, center.y, camera);
    if (
      screen.x < -36
      || screen.y < -36
      || screen.x > viewWidth + 36
      || screen.y > viewHeight + 36
    ) {
      return;
    }
    const pulse = 0.5 + 0.5 * Math.sin(performance.now() * 0.012);
    const innerRadius = 18 + pulse * 2.4;
    const outerRadius = innerRadius + 5.2;
    ctx.save();
    ctx.strokeStyle = `rgba(96, 246, 134, ${0.74 - pulse * 0.2})`;
    ctx.lineWidth = 2.35;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, innerRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(96, 246, 134, ${0.32 + pulse * 0.26})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, outerRadius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  function getPlacementItem() {
    if (state.gameWon) return null;
    if (state.inCave || inventoryOpen || state.activeStation || state.activeChest || state.activeShipRepair) return null;
    if (getShipSeatInfoForPlayer(getLocalShipPlayerId())) return null;
    if (!state.player.inHut && isDebugBoatPlacementActive()) {
      return {
        slotIndex: null,
        itemId: DEBUG_REPAIRED_BOAT_ITEM_ID,
        itemDef: ITEMS[DEBUG_REPAIRED_BOAT_ITEM_ID],
        debugPlacement: "repairedBoat",
      };
    }
    const slot = state.inventory[activeSlot];
    if (!slot || !slot.id) return null;
    const itemDef = ITEMS[slot.id];
    if (!itemDef || !itemDef.placeable) return null;
    if (state.player.inHut) {
      if (!isInteriorPlaceType(itemDef.placeType)) return null;
    }
    return { slotIndex: activeSlot, itemId: slot.id, itemDef };
  }

  function getCamera() {
    return {
      x: state.player.x - viewWidth / 2,
      y: state.player.y - viewHeight / 2,
    };
  }

  function screenToWorld(screenX, screenY) {
    const camera = getCamera();
    return {
      x: screenX + camera.x,
      y: screenY + camera.y,
    };
  }

  function getPlacementTile() {
    let worldX = state.player.x + state.player.facing.x * CONFIG.tileSize;
    let worldY = state.player.y + state.player.facing.y * CONFIG.tileSize;

    if (pointer.active) {
      const world = screenToWorld(pointer.x, pointer.y);
      worldX = world.x;
      worldY = world.y;
    }

    const tx = Math.floor(worldX / CONFIG.tileSize);
    const ty = Math.floor(worldY / CONFIG.tileSize);
    return { tx, ty };
  }

  function canPlaceItemAt(world, inCave, itemId, tx, ty) {
    if (inCave) return { ok: false, reason: "No build here" };
    if (!world || !inBounds(tx, ty, world.size)) return { ok: false, reason: "Out of bounds" };
    const idx = tileIndex(tx, ty, world.size);
    const baseLand = world.tiles[idx] === 1;
    const structure = getStructureAt(tx, ty);
    const itemDef = ITEMS[itemId];
    if (!itemDef) return { ok: false, reason: "Invalid" };
    if (itemDef.debugOnly && !state.debugUnlocked) return { ok: false, reason: "Debug only" };

    if (itemDef.placeType === "abandoned_ship") {
      const centerTileX = tx + 0.5;
      const centerTileY = ty + 0.5;
      const anchor = getStructureAnchorForCenterTile("abandoned_ship", centerTileX, centerTileY);
      const footprint = getStructureFootprint("abandoned_ship");
      let touchesLand = false;
      let occupied = false;
      for (let oy = 0; oy < footprint.h; oy += 1) {
        for (let ox = 0; ox < footprint.w; ox += 1) {
          const fx = anchor.tx + ox;
          const fy = anchor.ty + oy;
          if (!inBounds(fx, fy, world.size)) {
            touchesLand = true;
            continue;
          }
          const tile = world.tiles[tileIndex(fx, fy, world.size)];
          if (tile !== 0) {
            touchesLand = true;
          }
          const occupiedStructure = getStructureAt(fx, fy);
          if (occupiedStructure && !occupiedStructure.removed) {
            occupied = true;
          }
        }
      }
      if (touchesLand) return { ok: false, reason: "Must place on water." };
      if (occupied) return { ok: false, reason: "Occupied" };
      if (!canUseWaterStructureFootprint(world, "abandoned_ship", anchor.tx, anchor.ty)) {
        return { ok: false, reason: "Must place on water." };
      }
      return {
        ok: true,
        anchorTx: anchor.tx,
        anchorTy: anchor.ty,
        shipSpawnX: (tx + 0.5) * CONFIG.tileSize,
        shipSpawnY: (ty + 0.5) * CONFIG.tileSize,
      };
    }

    if (structure) {
      if (isHouseType(structure.type) && isHouseType(itemDef.placeType)) {
        if ((structure.type === "small_house" || structure.type === "hut") && itemDef.placeType === "medium_house") {
          const footprint = canUseStructureFootprint(world, itemDef.placeType, structure.tx, structure.ty, {
            ignoreStructureId: structure.id,
            allowResourceClear: true,
          });
          if (!footprint.ok) return { ok: false, reason: footprint.reason || "Blocked" };
          return {
            ok: true,
            upgradeHouse: true,
            targetHouse: structure,
            clearResourceTiles: footprint.clearResourceTiles,
          };
        }
        if (structure.type === "medium_house" && itemDef.placeType === "large_house") {
          const footprint = canUseStructureFootprint(world, itemDef.placeType, structure.tx, structure.ty, {
            ignoreStructureId: structure.id,
            allowResourceClear: true,
          });
          if (!footprint.ok) return { ok: false, reason: footprint.reason || "Blocked" };
          return {
            ok: true,
            upgradeHouse: true,
            targetHouse: structure,
            clearResourceTiles: footprint.clearResourceTiles,
          };
        }
        return { ok: false, reason: "Upgrade order: Small -> Medium -> Large" };
      }
      return { ok: false, reason: "Occupied" };
    }
    if (itemDef.placeType === "medium_house" || itemDef.placeType === "large_house") {
      return { ok: false, reason: "Place on smaller house to upgrade" };
    }
    if (itemDef.placeType === "bridge") {
      if (baseLand) return { ok: false, reason: "Needs water" };
      const left = isWalkableTileInWorld(world, tx - 1, ty);
      const right = isWalkableTileInWorld(world, tx + 1, ty);
      const up = isWalkableTileInWorld(world, tx, ty - 1);
      const down = isWalkableTileInWorld(world, tx, ty + 1);
      if (!(left || right || up || down)) return { ok: false, reason: "No edge" };
      return { ok: true };
    }

    if (itemDef.placeType === "dock") {
      if (baseLand) return { ok: false, reason: "Needs water" };
      const left = isWalkableTileInWorld(world, tx - 1, ty);
      const right = isWalkableTileInWorld(world, tx + 1, ty);
      const up = isWalkableTileInWorld(world, tx, ty - 1);
      const down = isWalkableTileInWorld(world, tx, ty + 1);
      if (!(left || right || up || down)) return { ok: false, reason: "No edge" };
      return { ok: true };
    }

    if (itemDef.placeType === "beacon") {
      if (state.structures.some((s) => s.type === "beacon" && !s.removed)) {
        return { ok: false, reason: "Beacon already built" };
      }
      const isBeach = !!world.beachGrid?.[idx];
      if (!isBeach) return { ok: false, reason: "Needs beach" };
      return { ok: true };
    }

    if (isHouseType(itemDef.placeType)) {
      const footprint = canUseStructureFootprint(world, itemDef.placeType, tx, ty, {
        allowResourceClear: true,
      });
      if (!footprint.ok) return { ok: false, reason: footprint.reason || "Blocked" };
      return { ok: true, clearResourceTiles: footprint.clearResourceTiles };
    }

    const resource = getResourceAt(world, tx, ty);
    if (resource) {
      if (resource.stage && resource.stage !== "alive") {
        return { ok: true, clearResourceTiles: [{ tx, ty }] };
      }
      return { ok: false, reason: "Blocked" };
    }
    if (world === state.surfaceWorld && getCaveAt(world, tx, ty)) return { ok: false, reason: "Cave" };

    if (!baseLand) return { ok: false, reason: "Needs land" };
    return { ok: true };
  }

  function canPlaceItem(itemId, tx, ty) {
    return canPlaceItemAt(state.world, state.inCave, itemId, tx, ty);
  }

  function placeDebugRepairedBoatAt(world, tx, ty, placementResult = null) {
    if (!world) return { ok: false, reason: "No world" };
    const result = (placementResult && placementResult.ok)
      ? placementResult
      : canPlaceItemAt(world, false, DEBUG_REPAIRED_BOAT_ITEM_ID, tx, ty);
    if (!result.ok) return result;
    const anchorTx = Number.isInteger(result.anchorTx) ? result.anchorTx : tx;
    const anchorTy = Number.isInteger(result.anchorTy) ? result.anchorTy : ty;
    if (!canUseWaterStructureFootprint(world, "abandoned_ship", anchorTx, anchorTy)) {
      return { ok: false, reason: "Must place on water." };
    }
    const structure = addStructure("abandoned_ship", anchorTx, anchorTy, {
      meta: { debugPlaced: true },
    });
    const ship = ensureAbandonedShipMeta(structure);
    if (ship) {
      ship.repaired = true;
      ship.damage = 0;
      ship.vx = 0;
      ship.vy = 0;
      ship.driverId = null;
      ship.driverInputX = 0;
      ship.driverInputY = 0;
      ship.controlAge = 0;
      ship.seats = Array.from({ length: ABANDONED_SHIP_CONFIG.maxPassengers }, () => null);
      if (Number.isFinite(result.shipSpawnX)) ship.x = result.shipSpawnX;
      if (Number.isFinite(result.shipSpawnY)) ship.y = result.shipSpawnY;
      ship.renderX = ship.x;
      ship.renderY = ship.y;
      ship.renderAngle = ship.angle;
    }
    return { ok: true, structure };
  }

  function upgradeHouseStructure(structure, nextType) {
    if (!structure || !isHouseType(nextType)) return false;
    const surface = state.surfaceWorld || state.world;
    const footprintCheck = canUseStructureFootprint(surface, nextType, structure.tx, structure.ty, {
      ignoreStructureId: structure.id,
      allowResourceClear: true,
    });
    if (!footprintCheck.ok) return false;
    clearResourceTiles(surface, footprintCheck.clearResourceTiles);

    setStructureFootprintInGrid(structure, false);
    const previousInterior = getHouseInterior(structure);
    structure.type = nextType;
    ensureHouseMeta(structure);
    const interior = getHouseInterior(structure);
    if (previousInterior?.items) {
      interior.items = previousInterior.items;
    }
    const tier = getHouseTier(nextType);
    const prevWidth = interior.width;
    const prevHeight = interior.height;
    interior.tier = tier.key;
    interior.width = tier.width;
    interior.height = tier.height;
    const shiftX = Math.floor((interior.width - prevWidth) * 0.5);
    const shiftY = Math.floor((interior.height - prevHeight) * 0.5);
    for (const item of interior.items) {
      item.tx = clamp(item.tx + shiftX, 0, interior.width - 1);
      item.ty = clamp(item.ty + shiftY, 0, interior.height - 1);
    }
    if (state.activeHouse === structure && state.housePlayer) {
      state.housePlayer.x += shiftX;
      state.housePlayer.y += shiftY;
      state.housePlayer.x = clamp(state.housePlayer.x, 0.35, interior.width - 0.35);
      state.housePlayer.y = clamp(state.housePlayer.y, 0.35, interior.height - 0.35);
    }
    setStructureFootprintInGrid(structure, true);
    return true;
  }

  function attemptPlace() {
    const placement = getPlacementItem();
    if (!placement) return false;

    if (state.player.inHut && state.activeHouse) {
      const tile = getInteriorPlacementTile();
      if (!tile) return false;
      const result = canPlaceInteriorItem(state.activeHouse, placement.itemId, tile.tx, tile.ty);
      if (!result.ok) {
        setPrompt(result.reason, 0.9);
        return false;
      }
      if (!netIsClient()) {
        addInteriorStructure(state.activeHouse, placement.itemDef.placeType, tile.tx, tile.ty);
      }
      const slot = state.inventory[placement.slotIndex];
      slot.qty -= 1;
      if (slot.qty <= 0) {
        slot.id = null;
        slot.qty = 0;
      }
      if (netIsClient()) {
        const requestId = `${net.playerId}-house-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        net.pendingHousePlaces.set(requestId, { itemId: placement.itemId });
        sendToHost({
          type: "housePlace",
          requestId,
          houseTx: state.activeHouse.tx,
          houseTy: state.activeHouse.ty,
          itemId: placement.itemId,
          tx: tile.tx,
          ty: tile.ty,
        });
      }
      updateAllSlotUI();
      markDirty();
      setPrompt(`${ITEMS[placement.itemId].name} placed`, 0.9);
      return true;
    }

    const { tx, ty } = getPlacementTile();
    const result = canPlaceItem(placement.itemId, tx, ty);
    if (!result.ok) {
      setPrompt(result.reason, 0.9);
      return false;
    }

    if (placement.debugPlacement === "repairedBoat") {
      if (netIsClient()) {
        if (state.debugBoatPlacePending) {
          setPrompt("Waiting for host...", 0.8);
          return false;
        }
        const requestId = `${net.playerId}-debug-boat-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        state.debugBoatPlacePending = true;
        sendToHost({
          type: "debugBoatPlace",
          requestId,
          tx,
          ty,
        });
        setPrompt("Requesting boat placement...", 0.9);
        return true;
      }
      const placed = placeDebugRepairedBoatAt(state.world, tx, ty, result);
      if (!placed.ok) {
        setPrompt(placed.reason || "Must place on water.", 0.9);
        return false;
      }
      markDirty();
      setPrompt("Repaired boat placed", 1.1);
      if (net.isHost && net.connections.size > 0) {
        broadcastNet(buildSnapshot());
        const motion = buildMotionUpdate();
        if (motion) broadcastNet(motion);
      }
      return true;
    }

    if (result.clearResourceTiles?.length) {
      clearResourceTiles(state.world, result.clearResourceTiles);
    }

    if (result.upgradeHouse && result.targetHouse) {
      if (!upgradeHouseStructure(result.targetHouse, placement.itemDef.placeType)) {
        setPrompt("Upgrade failed", 0.8);
        return false;
      }
    } else {
      addStructure(placement.itemDef.placeType, tx, ty, {
        storage: placement.itemDef.placeType === "chest"
          ? createEmptyInventory(CHEST_SIZE)
          : placement.itemDef.placeType === "robot"
            ? createEmptyInventory(ROBOT_STORAGE_SIZE)
            : null,
        pending: netIsClient(),
      });
    }

    const slot = state.inventory[placement.slotIndex];
    slot.qty -= 1;
    if (slot.qty <= 0) {
      slot.id = null;
      slot.qty = 0;
    }

    updateAllSlotUI();
    markDirty();
    if (netIsClient()) {
      const requestId = `${net.playerId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      net.pendingPlaces.set(requestId, {
        itemId: placement.itemId,
        tx,
        ty,
        type: placement.itemDef.placeType,
      });
      sendToHost({
        type: "place",
        requestId,
        itemId: placement.itemId,
        tx,
        ty,
      });
      return true;
    }

    if (placement.itemDef.placeType === "beacon") {
      triggerGameWin();
    }

    return true;
  }

  function enterCave(cave) {
    if (!cave || state.inCave) return;
    state.returnPosition = { x: state.player.x, y: state.player.y };
    state.inCave = true;
    state.activeCave = cave;
    state.world = cave.world;
    state.player.inHut = false;
    closeStationMenu();
    closeChest();
    closeShipRepairPanel();
    closeInventory();
    buildMenu.classList.add("hidden");
    const entrance = cave.world.entrance;
    state.player.x = (entrance.tx + 0.5) * CONFIG.tileSize;
    state.player.y = (entrance.ty + 0.5) * CONFIG.tileSize;
    markDirty();
    if (net.enabled) sendPlayerUpdate();
  }

  function leaveCave() {
    if (!state.inCave) return;
    const returnPos = state.returnPosition;
    state.inCave = false;
    state.activeCave = null;
    state.world = state.surfaceWorld;
    state.player.inHut = false;
    if (returnPos) {
      state.player.x = returnPos.x;
      state.player.y = returnPos.y;
    }
    state.returnPosition = null;
    closeShipRepairPanel();
    closeInventory();
    markDirty();
    if (net.enabled) sendPlayerUpdate();
  }

  function useActiveConsumable() {
    const slot = state.inventory[activeSlot];
    if (!slot?.id) return false;
    const consumedId = slot.id;
    if (consumedId !== "medicine" && consumedId !== "cooked_meat") return false;
    const healAmount = consumedId === "cooked_meat" ? 18 : 24;
    if (state.player.hp >= state.player.maxHp) {
      setPrompt("Already healthy", 0.9);
      return false;
    }
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmount);
    slot.qty -= 1;
    if (slot.qty <= 0) {
      slot.id = null;
      slot.qty = 0;
    }
    updateHealthUI();
    updateAllSlotUI();
    markDirty();
    setPrompt(consumedId === "cooked_meat" ? "Ate cooked meat" : "Poultice used", 0.9);
    return true;
  }

  function skipNightBySleep() {
    if (!state.isNight) {
      setPrompt("Can only sleep at night", 0.9);
      return;
    }
    if (netIsClient()) {
      sendToHost({ type: "sleep" });
      setPrompt("Trying to sleep...", 1.1);
      return;
    }
    state.timeOfDay = 0;
    state.isNight = false;
    state.surfaceSpawnTimer = MONSTER.spawnInterval;
    updateTimeUI();
    if (state.surfaceWorld) {
      igniteSurfaceMonstersForDay(state.surfaceWorld);
    }
    setPrompt("You slept until dawn", 1.2);
    markDirty();
  }

  function updateInteraction() {
    if (state.gameWon) {
      interactPressed = false;
      attackPressed = false;
      return;
    }

    const inHouse = !!(state.player.inHut && state.activeHouse);
    const combatWorld = getCombatWorld();
    const preferRenderTargets = netIsClient();
    state.targetResource = inHouse ? null : findNearestResource(combatWorld, state.player);
    state.targetMonster = inHouse
      ? null
      : findNearestMonster(combatWorld, state.player, MONSTER.attackRange + 12, preferRenderTargets);
    state.targetAnimal = inHouse
      ? null
      : findNearestAnimalAt(combatWorld, state.player, MONSTER.attackRange + 12, preferRenderTargets);
    const resourceGate = state.targetResource ? canHarvestResource(state.targetResource) : { ok: true, reason: "" };
    const swordUnlocked = canDamageMonsters(state.player);
    const localShipSeat = getShipSeatInfoForPlayer(getLocalShipPlayerId());

    if (inHouse) {
      state.nearBench = false;
      state.nearBenchStructure = null;
      state.nearCave = null;
      state.nearDock = null;
      state.nearShip = null;
      state.nearHouse = state.activeHouse;
      const chest = findNearestInteriorStructure(state.player, state.activeHouse, (entry) => entry.type === "chest");
      const station = findNearestInteriorStructure(state.player, state.activeHouse, (entry) => STRUCTURE_DEFS[entry.type]?.station);
      const bed = findNearestInteriorStructure(state.player, state.activeHouse, (entry) => entry.type === "bed");
      if (chest) {
        chest.interior = true;
        chest.houseRef = state.activeHouse;
      }
      if (station) {
        station.interior = true;
        station.houseRef = state.activeHouse;
      }
      if (bed) {
        bed.interior = true;
        bed.houseRef = state.activeHouse;
      }
      state.nearChest = chest;
      state.nearStation = station;
      state.nearBed = bed;
    } else if (!state.inCave) {
      const nearbyBench = findNearestStructure(state.player, (structure) => structure.type === "bench");
      state.nearBench = !!nearbyBench;
      state.nearBenchStructure = nearbyBench;
      state.nearStation = findNearestStructure(state.player, (structure) => STRUCTURE_DEFS[structure.type]?.station);
      state.nearChest = findNearestStructure(state.player, (structure) => isDirectChestStructure(structure));
      state.nearDock = findNearestStructure(state.player, (structure) => structure.type === "dock");
      state.nearShip = findNearestStructure(state.player, (structure) => structure.type === "abandoned_ship");
      state.nearCave = findNearestCave(state.surfaceWorld, state.player);
      state.nearHouse = findNearestStructure(state.player, (structure) => isHouseType(structure.type));
      state.nearBed = findNearestStructure(state.player, (structure) => structure.type === "bed");
    } else {
      state.nearBench = false;
      state.nearBenchStructure = null;
      state.nearStation = null;
      state.nearChest = null;
      state.nearDock = null;
      state.nearShip = null;
      state.nearCave = null;
      state.nearHouse = null;
      state.nearBed = null;
    }

    if (state.activeStation) {
      if (state.activeStation.type === "robot" && !netIsClientReady()) {
        setRobotInteractionPause(state.activeStation, 0.35);
      }
      let dist = Infinity;
      if (state.activeStation.interior && state.housePlayer) {
        dist = Math.hypot((state.activeStation.tx + 0.5) - state.housePlayer.x, (state.activeStation.ty + 0.5) - state.housePlayer.y) * CONFIG.tileSize;
      } else {
        const center = getStructureCenterWorld(state.activeStation);
        dist = Math.hypot(
          center.x - state.player.x,
          center.y - state.player.y
        );
      }
      if (dist > CONFIG.interactRange * 1.3) closeStationMenu();
    }

    if (state.activeChest) {
      if (state.activeChest.type === "robot" && !netIsClientReady()) {
        setRobotInteractionPause(state.activeChest, 0.35);
      }
      let dist = Infinity;
      if (state.activeChest.interior && state.housePlayer) {
        dist = Math.hypot((state.activeChest.tx + 0.5) - state.housePlayer.x, (state.activeChest.ty + 0.5) - state.housePlayer.y) * CONFIG.tileSize;
      } else {
        const center = getStructureCenterWorld(state.activeChest);
        dist = Math.hypot(
          center.x - state.player.x,
          center.y - state.player.y
        );
      }
      if (dist > CONFIG.interactRange * 1.3) closeChest();
    }

    if (state.activeShipRepair) {
      const shipCenter = getStructureCenterWorld(state.activeShipRepair);
      const dist = Math.hypot(shipCenter.x - state.player.x, shipCenter.y - state.player.y);
      if (
        state.activeShipRepair.removed
        || state.activeShipRepair.type !== "abandoned_ship"
        || dist > CONFIG.interactRange * 1.45
      ) {
        closeShipRepairPanel();
      } else {
        renderShipRepairPanel();
      }
    }

    if (state.promptTimer <= 0) {
      const placement = getPlacementItem();
      if (placement) {
        setPrompt(`Place ${ITEMS[placement.itemId].name}`);
      } else if (inHouse) {
        const interior = getHouseInterior(state.activeHouse);
        const doorX = Math.floor(interior.width / 2) + 0.5;
        const doorY = interior.height - 0.7;
        const nearDoor = Math.hypot(state.housePlayer.x - doorX, state.housePlayer.y - doorY) < 1.0;
        if (state.activeChest) setPrompt("Chest open");
        else if (state.activeStation) setPrompt("Station open");
        else if (nearDoor) setPrompt("Press E to leave house");
        else if (state.nearBed && state.isNight) setPrompt("Press E to sleep");
        else if (state.nearChest) setPrompt("Press E to open chest");
        else if (state.nearStation) setPrompt(`Press E to use ${STRUCTURE_DEFS[state.nearStation.type]?.name}`);
        else setPrompt("Inside house");
      } else if (state.inCave) {
        const entrance = state.activeCave?.world?.entrance;
        if (entrance) {
          const ex = (entrance.tx + 0.5) * CONFIG.tileSize;
          const ey = (entrance.ty + 0.5) * CONFIG.tileSize;
          const dist = Math.hypot(ex - state.player.x, ey - state.player.y);
          if (dist < CONFIG.interactRange) setPrompt("Press E to leave cave");
          else if (state.targetMonster && !swordUnlocked) setPrompt("Craft a sword first");
          else if (state.targetMonster || state.targetAnimal) setPrompt("Press Space / Tap Attack");
          else if (state.targetResource && !resourceGate.ok) setPrompt(resourceGate.reason);
          else if (state.targetResource) setPrompt(`Press Space / Tap Attack to ${getResourceActionName(state.targetResource)}`);
          else setPrompt("Wind echoes through the cave");
        }
      } else if (state.activeShipRepair) {
        setPrompt("Repairing abandoned ship");
      } else if (localShipSeat) {
        setPrompt(localShipSeat.isDriver ? "WASD/Stick to steer, E to disembark" : "Passenger, press E to disembark");
      } else if (state.nearShip) {
        const ship = ensureAbandonedShipMeta(state.nearShip);
        if (ship?.repaired) setPrompt("Press E to board abandoned ship");
        else setPrompt("Press E to repair abandoned ship");
      } else if (state.activeChest) {
        setPrompt("Chest open");
      } else if (state.nearChest) {
        setPrompt("Press E to open chest");
      } else if (state.activeStation) {
        setPrompt("Station open");
      } else if (state.nearStation) {
        if (state.nearStation.type === "robot" && state.nearStation.meta?.wildSpawn) {
          setPrompt("Press E to inspect abandoned robot");
        } else {
          setPrompt(`Press E to use ${STRUCTURE_DEFS[state.nearStation.type]?.name}`);
        }
      } else if (state.nearDock) {
        setPrompt("Press E to set dock checkpoint");
      } else if (state.nearBed && state.isNight) {
        setPrompt("Press E to sleep");
      } else if (state.nearCave) {
        setPrompt("Press E to enter cave");
      } else if (state.nearHouse) {
        setPrompt("Press E to enter house");
      } else if (state.targetMonster && !swordUnlocked) {
        setPrompt("Craft a sword first");
      } else if (state.targetMonster || state.targetAnimal) {
        setPrompt("Press Space / Tap Attack");
      } else if (state.targetResource && !resourceGate.ok) {
        setPrompt(resourceGate.reason);
      } else if (state.targetResource) {
        setPrompt(`Press Space / Tap Attack to ${getResourceActionName(state.targetResource)}`);
      } else if (state.nearBench) {
        setPrompt("Crafting Bench");
      } else {
        state.promptText = "";
      }
    }

    if (interactPressed) {
      const placement = getPlacementItem();
      if (placement) {
        attemptPlace();
      } else if (inHouse) {
        const interior = getHouseInterior(state.activeHouse);
        const doorX = Math.floor(interior.width / 2) + 0.5;
        const doorY = interior.height - 0.7;
        const nearDoor = Math.hypot(state.housePlayer.x - doorX, state.housePlayer.y - doorY) < 1.0;
        if (state.activeChest) closeChest();
        else if (state.activeStation) closeStationMenu();
        else if (nearDoor) leaveHouse();
        else if (state.nearChest) openChest(state.nearChest);
        else if (state.nearStation) openStationMenu(state.nearStation);
        else if (state.nearBed) skipNightBySleep();
      } else if (state.inCave) {
        const entrance = state.activeCave?.world?.entrance;
        if (entrance) {
          const ex = (entrance.tx + 0.5) * CONFIG.tileSize;
          const ey = (entrance.ty + 0.5) * CONFIG.tileSize;
          const dist = Math.hypot(ex - state.player.x, ey - state.player.y);
          if (dist < CONFIG.interactRange) leaveCave();
        }
      } else if (state.activeShipRepair) {
        closeShipRepairPanel();
      } else if (localShipSeat) {
        requestLeaveAbandonedShip();
      } else if (state.activeChest) {
        closeChest();
      } else if (state.activeStation) {
        closeStationMenu();
      } else if (state.nearShip) {
        const ship = ensureAbandonedShipMeta(state.nearShip);
        if (ship?.repaired) requestBoardAbandonedShip(state.nearShip);
        else openShipRepairPanel(state.nearShip);
      } else if (state.nearChest) {
        openChest(state.nearChest);
      } else if (state.nearStation) {
        openStationMenu(state.nearStation);
      } else if (state.nearDock) {
        const dockX = (state.nearDock.tx + 0.5) * CONFIG.tileSize;
        const dockY = (state.nearDock.ty + 0.5) * CONFIG.tileSize;
        const updated = setPlayerCheckpoint(state.player, state.surfaceWorld, dockX, dockY, true);
        if (updated) {
          markDirty();
          if (net.enabled) sendPlayerUpdate();
          setPrompt("Checkpoint set at dock", 1.1);
        } else {
          setPrompt("Checkpoint unchanged", 0.8);
        }
      } else if (state.nearCave) {
        enterCave(state.nearCave);
      } else if (state.nearHouse) {
        enterHouse(state.nearHouse);
      } else if (state.nearBed) {
        skipNightBySleep();
      }
      interactPressed = false;
    }

    if (attackPressed) {
      if (localShipSeat || state.activeShipRepair) {
        // Ship occupants and repair flow disable combat/harvest actions.
      } else if (state.inCave) {
        if (state.targetMonster || state.targetAnimal) performAttack();
        else attemptHarvest(state.targetResource);
      } else if (!state.player.inHut) {
        if (state.targetMonster || state.targetAnimal) performAttack();
        else if (!useActiveConsumable()) attemptHarvest(state.targetResource);
      }
      attackPressed = false;
    }

    if (!state.inCave && !state.player.inHut && state.nearBench && !state.activeShipRepair && !localShipSeat) {
      if (!wasNearBench) {
        buildMenu.classList.remove("hidden");
        renderBuildMenu();
      }
    } else if (wasNearBench) {
      buildMenu.classList.add("hidden");
    }

    wasNearBench = state.nearBench;
  }

  function updateSave(dt) {
    if (netIsClientReady()) return;
    if (!state.dirty) return;
    state.saveTimer -= dt;
    if (state.saveTimer <= 0) {
      saveGame();
    }
  }

  function update(dt) {
    if (!state.world || !state.player) {
      updatePrompt(dt);
      return;
    }
    if (net.enabled && !net.isHost && !net.ready) {
      setPrompt("Connecting...", 0.5);
    }
    updatePlayer(dt);
    updateStructureEffects(dt);
    updateCheckpoint(dt);
    updateWinSequence(dt);
    updatePlayerCombatTimers(dt);
    maintainRobotInteractionPause(dt);
    const worldSpeed = getDebugWorldSpeedMultiplier();
    let worldDtRemaining = Math.max(0, dt * worldSpeed);
    while (worldDtRemaining > 0.0001) {
      const worldStep = Math.min(worldDtRemaining, 0.05);
      updateDayNight(worldStep);
      updateAmbientFish(worldStep);
      updateResources(worldStep);
      updateMonsters(worldStep);
      updateAnimals(worldStep);
      updateVillagers(worldStep);
      updateRobots(worldStep);
      updateAbandonedShips(worldStep);
      updateAllMonsterBurnEffects(worldStep);
      worldDtRemaining -= worldStep;
    }
    updatePlayerEffects(dt);
    updateDrops(dt);
    updateInteraction();
    updateRemoteRender(dt);
    updateAudio(dt);
    netTick(dt);
    updatePrompt(dt);
    updateSave(dt);
    if (state.player.hp <= 0 && !state.respawnLock) {
      handlePlayerDeath();
    }
  }

  function worldToScreen(x, y, camera) {
    return {
      x: x - camera.x,
      y: y - camera.y,
    };
  }

  function drawLandTile(x, y, shade, biomeId, isBeach, tx, ty) {
    const biome = BIOMES[biomeId] || BIOMES[0];
    const base = isBeach ? biome.sand : biome.land;
    const r = Math.floor(base[0] * shade);
    const g = Math.floor(base[1] * shade);
    const b = Math.floor(base[2] * shade);
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctx.fillRect(x, y, CONFIG.tileSize, CONFIG.tileSize);
    ctx.fillStyle = isBeach ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)";
    ctx.fillRect(x, y, CONFIG.tileSize, 2);
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(x, y + CONFIG.tileSize - 2, CONFIG.tileSize, 2);

    if (isBeach) return;
    const seed = state.surfaceWorld?.seed ? seedToInt(String(state.surfaceWorld.seed)) : 0;
    const detail = rand2d(tx, ty, seed + 913);
    if (biome.key === "jungle") {
      if (detail < 0.26) {
        ctx.fillStyle = "rgba(17, 95, 55, 0.28)";
        ctx.beginPath();
        ctx.arc(x + 8, y + 11, 4, 0, Math.PI * 2);
        ctx.arc(x + 13, y + 8, 3, 0, Math.PI * 2);
        ctx.arc(x + 6, y + 17, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (detail > 0.72) {
        ctx.fillStyle = "rgba(154, 208, 99, 0.18)";
        ctx.fillRect(x + 3, y + 4, 2, 7);
        ctx.fillRect(x + 9, y + 6, 2, 8);
      }
    } else if (biome.key === "snow") {
      if (detail < 0.3) {
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.fillRect(x + 4, y + 5, 3, 3);
        ctx.fillRect(x + 12, y + 10, 2, 2);
      }
    } else if (biome.key === "volcanic") {
      if (detail < 0.24) {
        ctx.strokeStyle = "rgba(34, 26, 23, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 4, y + 6);
        ctx.lineTo(x + 11, y + 14);
        ctx.lineTo(x + 16, y + 11);
        ctx.stroke();
      }
      if (detail > 0.8) {
        ctx.fillStyle = "rgba(186, 111, 73, 0.18)";
        ctx.fillRect(x + 10, y + 6, 3, 3);
      }
    } else if (biome.key === "mangrove") {
      if (detail < 0.34) {
        ctx.strokeStyle = "rgba(46, 75, 58, 0.34)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 4, y + 19);
        ctx.lineTo(x + 8, y + 12);
        ctx.lineTo(x + 12, y + 20);
        ctx.stroke();
      }
      if (detail > 0.74) {
        ctx.fillStyle = "rgba(136, 171, 130, 0.14)";
        ctx.fillRect(x + 3, y + 5, 11, 3);
      }
    } else if (biome.key === "redwood") {
      if (detail < 0.28) {
        ctx.fillStyle = "rgba(20, 58, 32, 0.24)";
        ctx.fillRect(x + 6, y + 4, 3, 14);
      }
      if (detail > 0.72) {
        ctx.strokeStyle = "rgba(112, 156, 97, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 4, y + 10);
        ctx.lineTo(x + 14, y + 9);
        ctx.stroke();
      }
    } else if (biome.key === "ashlands") {
      if (detail < 0.3) {
        ctx.strokeStyle = "rgba(36, 36, 43, 0.36)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 5, y + 6);
        ctx.lineTo(x + 10, y + 15);
        ctx.lineTo(x + 14, y + 12);
        ctx.stroke();
      }
      if (detail > 0.84) {
        ctx.fillStyle = "rgba(212, 146, 103, 0.15)";
        ctx.fillRect(x + 11, y + 6, 2, 2);
      }
    } else if (biome.key === "marsh") {
      if (detail < 0.26) {
        ctx.fillStyle = "rgba(28, 78, 63, 0.26)";
        ctx.beginPath();
        ctx.ellipse(x + 9, y + 13, 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      if (detail > 0.73) {
        ctx.fillStyle = "rgba(127, 182, 154, 0.16)";
        ctx.fillRect(x + 5, y + 6, 2, 9);
        ctx.fillRect(x + 9, y + 5, 2, 10);
      }
    } else if (biome.key === "mushroom") {
      if (detail < 0.36) {
        ctx.fillStyle = "rgba(228, 186, 244, 0.18)";
        ctx.beginPath();
        ctx.arc(x + 7, y + 8, 3, 0, Math.PI * 2);
        ctx.arc(x + 12, y + 13, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (detail > 0.72) {
        ctx.fillStyle = "rgba(114, 58, 132, 0.2)";
        ctx.fillRect(x + 4, y + 6, 2, 7);
        ctx.fillRect(x + 10, y + 5, 2, 8);
      }
    } else if (detail < 0.2) {
      ctx.fillStyle = "rgba(182, 215, 146, 0.15)";
      ctx.fillRect(x + 6, y + 8, 2, 8);
      ctx.fillRect(x + 9, y + 7, 2, 8);
    }
  }

  function drawPlanks(x, y, size, baseColor, vertical = false) {
    ctx.fillStyle = baseColor;
    ctx.fillRect(x, y, size, size);
    const line = tintColor(baseColor, -0.35);
    ctx.strokeStyle = line;
    ctx.lineWidth = 1;
    const count = 4;
    const step = size / count;
    for (let i = 1; i < count; i += 1) {
      ctx.beginPath();
      if (vertical) {
        ctx.moveTo(x + i * step, y + 2);
        ctx.lineTo(x + i * step, y + size - 2);
      } else {
        ctx.moveTo(x + 2, y + i * step);
        ctx.lineTo(x + size - 2, y + i * step);
      }
      ctx.stroke();
    }
    ctx.fillStyle = tintColor(baseColor, 0.1);
    ctx.fillRect(x + 2, y + 2, size - 4, 2);
  }

  function drawBrick(x, y, size, baseColor) {
    ctx.fillStyle = baseColor;
    ctx.fillRect(x, y, size, size);
    ctx.strokeStyle = tintColor(baseColor, -0.35);
    ctx.lineWidth = 1;
    const rowHeight = 6;
    for (let row = 1; row < size / rowHeight; row += 1) {
      const yPos = y + row * rowHeight;
      ctx.beginPath();
      ctx.moveTo(x + 1, yPos);
      ctx.lineTo(x + size - 1, yPos);
      ctx.stroke();
      const offset = row % 2 === 0 ? 0 : 6;
      for (let col = offset; col < size; col += 12) {
        ctx.beginPath();
        ctx.moveTo(x + col, yPos - rowHeight + 1);
        ctx.lineTo(x + col, yPos - 1);
        ctx.stroke();
      }
    }
  }

  function drawPlayerAvatar(player, camera, color, name) {
    const px = player.renderX ?? player.x;
    const py = player.renderY ?? player.y;
    const screen = worldToScreen(px, py, camera);
    const bodyColor = color || "#2f4b6c";
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(screen.x, screen.y + 10, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f2c38b";
    ctx.beginPath();
    ctx.arc(screen.x, screen.y - 6, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#3b2a1a";
    ctx.beginPath();
    ctx.arc(screen.x, screen.y - 9, 5, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.stroke();

    ctx.fillStyle = bodyColor;
    ctx.fillRect(screen.x - 7, screen.y, 14, 12);
    ctx.fillStyle = tintColor(bodyColor, -0.25);
    ctx.fillRect(screen.x - 7, screen.y + 10, 14, 3);
    ctx.fillStyle = tintColor(bodyColor, 0.2);
    ctx.fillRect(screen.x - 6, screen.y + 2, 12, 4);
    ctx.strokeStyle = "rgba(0,0,0,0.25)";
    ctx.strokeRect(screen.x - 7, screen.y, 14, 12);

    ctx.fillStyle = "#4a3a28";
    ctx.fillRect(screen.x - 6, screen.y + 12, 5, 6);
    ctx.fillRect(screen.x + 1, screen.y + 12, 5, 6);

    ctx.fillStyle = "#6b8b4c";
    ctx.fillRect(screen.x + 6, screen.y + 3, 4, 7);

    if (name) {
      ctx.font = "12px Trebuchet MS";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.textAlign = "center";
      ctx.fillText(name, screen.x, screen.y - 18);
    }
  }

  function drawPlayer(camera) {
    if (state.gameWon) {
      const t = state.winTimer;
      if (t >= WIN_SEQUENCE.ladderDropEnd && t < WIN_SEQUENCE.textDelay) {
        return;
      }
    }
    drawPlayerAvatar(state.player, camera, "#2f4b6c", net.localName);
  }

  function drawRemotePlayers(camera) {
    for (const player of net.players.values()) {
      if (state.inCave) {
        if (!player.inCave || player.caveId !== state.activeCave?.id) continue;
      } else if (player.inCave || player.inHut) {
        continue;
      }
      drawPlayerAvatar(player, camera, player.color, player.name);
    }
  }

  function drawMonsterBurning(monster, screen) {
    if (!monster || !monster.dayBurning || (monster.burnTimer ?? 0) <= 0) return;
    const duration = Math.max(0.01, Number(monster.burnDuration) || MONSTER_DAY_BURN.durationMax);
    const ratio = clamp((monster.burnTimer ?? 0) / duration, 0, 1);
    const intensity = 1 - ratio;
    const t = (performance.now() * 0.01) + ((monster.id ?? 0) * 1.37);

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const glowRadius = 12 + intensity * 8 + Math.sin(t * 0.7) * 1.5;
    const glow = ctx.createRadialGradient(screen.x, screen.y + 2, 3, screen.x, screen.y + 2, glowRadius);
    glow.addColorStop(0, `rgba(255, 226, 132, ${0.3 + intensity * 0.2})`);
    glow.addColorStop(0.52, `rgba(255, 140, 62, ${0.2 + intensity * 0.22})`);
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(screen.x, screen.y + 2, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    const flameCount = 3;
    for (let i = 0; i < flameCount; i += 1) {
      const phase = t + i * 1.9;
      const fx = screen.x + Math.sin(phase) * (3.6 + intensity * 2.2);
      const fy = screen.y + 7 - i * 2 - (Math.cos(phase * 1.4) * 1.7);
      const flameH = 6 + intensity * 4 + (Math.sin(phase * 2.2) + 1) * 1.2;
      const flameW = 3 + (i * 0.5);

      ctx.fillStyle = `rgba(255, 130, 40, ${0.55 + intensity * 0.28})`;
      ctx.beginPath();
      ctx.moveTo(fx, fy - flameH);
      ctx.lineTo(fx - flameW, fy + 1);
      ctx.lineTo(fx + flameW, fy + 1);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = `rgba(255, 216, 128, ${0.42 + intensity * 0.26})`;
      ctx.beginPath();
      ctx.moveTo(fx, fy - flameH * 0.62);
      ctx.lineTo(fx - flameW * 0.55, fy - 1);
      ctx.lineTo(fx + flameW * 0.55, fy - 1);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function drawMonster(monster, camera) {
    const mx = monster.renderX ?? monster.x;
    const my = monster.renderY ?? monster.y;
    const screen = worldToScreen(mx, my, camera);
    if (
      screen.x < -40 ||
      screen.y < -40 ||
      screen.x > viewWidth + 40 ||
      screen.y > viewHeight + 40
    ) {
      return;
    }

    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath();
    ctx.ellipse(screen.x, screen.y + 10, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    const type = monster.type || "crawler";
    const baseColor = monster.color || "#2b2d3a";
    if (type === "marsh_stalker") {
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.ellipse(screen.x, screen.y + 1, 11, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = tintColor(baseColor, -0.4);
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = tintColor(baseColor, 0.18);
      ctx.beginPath();
      ctx.arc(screen.x, screen.y - 6, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#b8ff8e";
      ctx.beginPath();
      ctx.arc(screen.x - 3, screen.y - 2, 1.7, 0, Math.PI * 2);
      ctx.arc(screen.x + 3, screen.y - 2, 1.7, 0, Math.PI * 2);
      ctx.fill();
    } else if (type === "polar_bear") {
      ctx.fillStyle = tintColor(baseColor, -0.08);
      ctx.beginPath();
      ctx.ellipse(screen.x - 1, screen.y + 1, 13, 9.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(screen.x + 9, screen.y - 2, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f7fcff";
      ctx.beginPath();
      ctx.arc(screen.x - 4, screen.y - 4, 5, 0, Math.PI * 2);
      ctx.arc(screen.x + 2, screen.y - 5, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2a313b";
      ctx.beginPath();
      ctx.arc(screen.x + 11, screen.y - 3, 1.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#dce6f1";
      ctx.fillRect(screen.x - 7, screen.y + 6, 3, 6);
      ctx.fillRect(screen.x + 1, screen.y + 6, 3, 6);
      ctx.strokeStyle = "rgba(27, 32, 40, 0.48)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(screen.x + 13, screen.y + 1);
      ctx.lineTo(screen.x + 16, screen.y + 3);
      ctx.stroke();
    } else if (type === "lion") {
      ctx.fillStyle = tintColor(baseColor, -0.16);
      ctx.beginPath();
      ctx.ellipse(screen.x - 2, screen.y + 1, 12.5, 8.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#8f5f2f";
      ctx.beginPath();
      ctx.arc(screen.x + 8, screen.y - 2, 7.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(screen.x + 8.5, screen.y - 2, 4.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#ffe0aa";
      ctx.beginPath();
      ctx.arc(screen.x + 11, screen.y - 2.5, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2e2216";
      ctx.beginPath();
      ctx.arc(screen.x + 10.2, screen.y - 3.6, 1.1, 0, Math.PI * 2);
      ctx.arc(screen.x + 12.2, screen.y - 2.9, 1.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#6f4321";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(screen.x - 12, screen.y + 1);
      ctx.quadraticCurveTo(screen.x - 17, screen.y + 0, screen.x - 17, screen.y + 6);
      ctx.stroke();
      ctx.fillStyle = tintColor(baseColor, -0.24);
      ctx.fillRect(screen.x - 8, screen.y + 6, 3, 5);
      ctx.fillRect(screen.x + 0, screen.y + 6, 3, 5);
    } else if (type === "wolf") {
      ctx.fillStyle = tintColor(baseColor, -0.14);
      ctx.beginPath();
      ctx.ellipse(screen.x - 1, screen.y + 2, 11.5, 7.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(screen.x + 8.5, screen.y - 1.6, 5.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tintColor(baseColor, -0.34);
      ctx.beginPath();
      ctx.moveTo(screen.x + 6, screen.y - 6);
      ctx.lineTo(screen.x + 7.5, screen.y - 10);
      ctx.lineTo(screen.x + 9.2, screen.y - 6);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(screen.x + 10, screen.y - 5.7);
      ctx.lineTo(screen.x + 11.2, screen.y - 10);
      ctx.lineTo(screen.x + 13.2, screen.y - 5.9);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#d84f4f";
      ctx.beginPath();
      ctx.arc(screen.x + 9, screen.y - 2.4, 1.2, 0, Math.PI * 2);
      ctx.arc(screen.x + 11.6, screen.y - 2.1, 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = tintColor(baseColor, -0.42);
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(screen.x - 10, screen.y + 1);
      ctx.lineTo(screen.x - 15, screen.y - 1);
      ctx.stroke();
    } else if (type === "brute") {
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = tintColor(baseColor, -0.35);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = tintColor(baseColor, -0.45);
      ctx.fillRect(screen.x - 10, screen.y - 3, 20, 7);
      ctx.fillStyle = "#f18a77";
      ctx.beginPath();
      ctx.arc(screen.x - 4, screen.y - 2, 2.2, 0, Math.PI * 2);
      ctx.arc(screen.x + 4, screen.y - 2, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff3d9";
      ctx.fillRect(screen.x - 8, screen.y + 3, 16, 2.2);
    } else if (type === "skeleton") {
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#495363";
      ctx.stroke();
      ctx.fillStyle = "#f2f5fb";
      ctx.beginPath();
      ctx.arc(screen.x, screen.y - 2, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1f2329";
      ctx.beginPath();
      ctx.arc(screen.x - 2, screen.y - 3, 1.3, 0, Math.PI * 2);
      ctx.arc(screen.x + 2, screen.y - 3, 1.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#cda872";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(screen.x + 8, screen.y - 6);
      ctx.lineTo(screen.x + 11, screen.y + 6);
      ctx.stroke();
    } else {
      ctx.fillStyle = baseColor;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#1b1c24";
      ctx.stroke();
      ctx.fillStyle = tintColor(baseColor, -0.45);
      ctx.beginPath();
      ctx.moveTo(screen.x - 6, screen.y - 8);
      ctx.lineTo(screen.x - 2, screen.y - 12);
      ctx.lineTo(screen.x - 1, screen.y - 7);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(screen.x + 6, screen.y - 8);
      ctx.lineTo(screen.x + 2, screen.y - 12);
      ctx.lineTo(screen.x + 1, screen.y - 7);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#e25b4f";
      ctx.beginPath();
      ctx.arc(screen.x - 3, screen.y - 2, 2, 0, Math.PI * 2);
      ctx.arc(screen.x + 3, screen.y - 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    drawMonsterBurning(monster, screen);

    if (monster.hitTimer > 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 13, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawMonsterBurnEffects(world, camera) {
    if (!world) return;
    const fx = ensureMonsterBurnFx(world);
    if (!Array.isArray(fx) || fx.length === 0) return;
    for (const p of fx) {
      if (!p || p.life <= 0 || p.maxLife <= 0) continue;
      const alpha = clamp(p.life / p.maxLife, 0, 1);
      const screen = worldToScreen(p.x, p.y, camera);
      if (
        screen.x < -24
        || screen.y < -24
        || screen.x > viewWidth + 24
        || screen.y > viewHeight + 24
      ) {
        continue;
      }
      const radius = Math.max(0.6, p.size * (0.45 + alpha * 0.9));
      if (p.ash) {
        ctx.fillStyle = `rgba(84, 84, 84, ${alpha * 0.34})`;
      } else {
        ctx.fillStyle = `rgba(236, 138, 64, ${alpha * 0.52})`;
      }
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawProjectile(projectile, camera) {
    if (!projectile || projectile.type !== "arrow") return;
    const px = projectile.renderX ?? projectile.x;
    const py = projectile.renderY ?? projectile.y;
    const screen = worldToScreen(px, py, camera);
    if (
      screen.x < -30 ||
      screen.y < -30 ||
      screen.x > viewWidth + 30 ||
      screen.y > viewHeight + 30
    ) {
      return;
    }
    const vx = projectile.vx || 0;
    const vy = projectile.vy || 0;
    const len = 12;
    const speed = Math.hypot(vx, vy);
    const nx = speed > 0 ? vx / speed : 1;
    const ny = speed > 0 ? vy / speed : 0;
    const tx = -ny;
    const ty = nx;
    const tailX = screen.x - nx * len * 0.7;
    const tailY = screen.y - ny * len * 0.7;
    const tipX = screen.x + nx * len * 0.35;
    const tipY = screen.y + ny * len * 0.35;

    ctx.save();
    ctx.strokeStyle = "rgba(188, 150, 97, 0.95)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();

    ctx.strokeStyle = "rgba(234, 229, 218, 0.95)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - nx * 5 + tx * 2.5, tipY - ny * 5 + ty * 2.5);
    ctx.moveTo(tipX, tipY);
    ctx.lineTo(tipX - nx * 5 - tx * 2.5, tipY - ny * 5 - ty * 2.5);
    ctx.stroke();
    ctx.restore();
  }

  function drawAmbientFish(camera) {
    if (!Array.isArray(state.ambientFish) || state.ambientFish.length === 0) return;
    for (const fish of state.ambientFish) {
      if (!fish || fish.life <= 0 || fish.maxLife <= 0) continue;
      const alphaLife = clamp(fish.life / fish.maxLife, 0, 1);
      const alpha = alphaLife * 0.38;
      if (alpha <= 0.01) continue;
      const screen = worldToScreen(fish.x, fish.y, camera);
      if (
        screen.x < -20
        || screen.y < -20
        || screen.x > viewWidth + 20
        || screen.y > viewHeight + 20
      ) {
        continue;
      }
      const dir = Math.atan2(fish.vy || 0, fish.vx || 1);
      const size = fish.size || 6;
      const bodyLen = size;
      const bodyWidth = size * 0.38;

      ctx.save();
      ctx.translate(screen.x, screen.y);
      ctx.rotate(dir);
      ctx.fillStyle = `rgba(186, 223, 244, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, bodyLen, bodyWidth, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(138, 186, 216, ${alpha * 0.92})`;
      ctx.beginPath();
      ctx.moveTo(-bodyLen, 0);
      ctx.lineTo(-bodyLen - bodyWidth * 1.6, bodyWidth * 0.9);
      ctx.lineTo(-bodyLen - bodyWidth * 1.6, -bodyWidth * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function drawAnimal(animal, camera) {
    const drawX = animal.renderX ?? animal.x;
    const drawY = animal.renderY ?? animal.y;
    const screen = worldToScreen(drawX, drawY, camera);
    if (
      screen.x < -40 ||
      screen.y < -40 ||
      screen.x > viewWidth + 40 ||
      screen.y > viewHeight + 40
    ) {
      return;
    }
    const type = normalizeAnimalType(animal.type);
    const bodyColor = animal.color || "#9f8160";
    const isGreenCow = type === "green_cow";
    const bodyW = isGreenCow ? 13 : 11;
    const bodyH = isGreenCow ? 9 : 8;
    const headR = isGreenCow ? 5.6 : 5;
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(screen.x, screen.y + 9, isGreenCow ? 12 : 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(screen.x, screen.y, bodyW, bodyH, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = tintColor(bodyColor, -0.2);
    ctx.beginPath();
    ctx.arc(screen.x + 8, screen.y - 2, headR, 0, Math.PI * 2);
    ctx.fill();

    if (type === "boar") {
      ctx.fillStyle = tintColor(bodyColor, -0.32);
      ctx.fillRect(screen.x - 7, screen.y + 4, 2, 6);
      ctx.fillRect(screen.x + 2, screen.y + 4, 2, 6);
      ctx.fillStyle = "#e9d8bf";
      ctx.beginPath();
      ctx.moveTo(screen.x + 11, screen.y - 1);
      ctx.lineTo(screen.x + 14, screen.y + 0.5);
      ctx.lineTo(screen.x + 11, screen.y + 2);
      ctx.closePath();
      ctx.fill();
    } else if (type === "goat") {
      ctx.fillStyle = "#c8bca5";
      ctx.beginPath();
      ctx.moveTo(screen.x + 8, screen.y - 6);
      ctx.lineTo(screen.x + 10, screen.y - 10);
      ctx.lineTo(screen.x + 11, screen.y - 5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(screen.x + 4, screen.y - 6);
      ctx.lineTo(screen.x + 5, screen.y - 10);
      ctx.lineTo(screen.x + 7, screen.y - 5);
      ctx.closePath();
      ctx.fill();
    } else if (isGreenCow) {
      ctx.fillStyle = "rgba(95, 52, 116, 0.34)";
      ctx.beginPath();
      ctx.ellipse(screen.x - 3, screen.y - 1, 4, 2.6, 0.2, 0, Math.PI * 2);
      ctx.ellipse(screen.x + 4, screen.y + 2, 3, 2.1, -0.25, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e4f4dd";
      ctx.beginPath();
      ctx.arc(screen.x + 9, screen.y - 3, 1.3, 0, Math.PI * 2);
      ctx.arc(screen.x + 7, screen.y - 1, 1.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#cf5fa9";
      ctx.beginPath();
      ctx.ellipse(screen.x + 2, screen.y - 10, 6.2, 2.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(252, 239, 255, 0.8)";
      ctx.beginPath();
      ctx.arc(screen.x + 0.5, screen.y - 10, 0.9, 0, Math.PI * 2);
      ctx.arc(screen.x + 3.4, screen.y - 9.5, 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#2b2118";
    ctx.beginPath();
    ctx.arc(screen.x + 10, screen.y - 3, isGreenCow ? 1.7 : 1.5, 0, Math.PI * 2);
    ctx.fill();
    if (animal.hitTimer > 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 15, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawVillager(villager, camera) {
    const drawX = villager.renderX ?? villager.x;
    const drawY = villager.renderY ?? villager.y;
    const screen = worldToScreen(drawX, drawY, camera);
    if (
      screen.x < -40
      || screen.y < -40
      || screen.x > viewWidth + 40
      || screen.y > viewHeight + 40
    ) {
      return;
    }

    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(screen.x, screen.y + 10, 8, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    const bodyColor = villager.color || VILLAGER_COLORS[(villager.id || 0) % VILLAGER_COLORS.length];
    const dirX = Number(villager?.dir?.x) || 0;
    ctx.fillStyle = "#f0c18c";
    ctx.beginPath();
    ctx.arc(screen.x, screen.y - 3, 5.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = bodyColor;
    ctx.fillRect(screen.x - 6, screen.y + 1, 12, 12);
    ctx.fillStyle = tintColor(bodyColor, -0.2);
    ctx.fillRect(screen.x - 6, screen.y + 11, 5, 6);
    ctx.fillRect(screen.x + 1, screen.y + 11, 5, 6);
    ctx.fillStyle = tintColor(bodyColor, 0.28);
    ctx.fillRect(screen.x - 4, screen.y + 3, 8, 3);

    const eyeShift = clamp(dirX * 0.9, -0.9, 0.9);
    ctx.fillStyle = "#2e241c";
    ctx.beginPath();
    ctx.arc(screen.x - 1.6 + eyeShift, screen.y - 3, 0.8, 0, Math.PI * 2);
    ctx.arc(screen.x + 1.6 + eyeShift, screen.y - 3, 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawStructure(structure, camera) {
    if (structure.removed) return;
    const def = STRUCTURE_DEFS[structure.type];
    if (!def) return;
    const footprint = getStructureFootprint(structure.type);
    const structureWidthPx = footprint.w * CONFIG.tileSize;
    const structureHeightPx = footprint.h * CONFIG.tileSize;
    let worldX = structure.tx * CONFIG.tileSize;
    let worldY = structure.ty * CONFIG.tileSize;
    if (structure.type === "robot") {
      const drawPos = getRobotDisplayPosition(structure, !net.isHost);
      if (drawPos) {
        worldX = drawPos.x - CONFIG.tileSize * 0.5;
        worldY = drawPos.y - CONFIG.tileSize * 0.5;
      }
    } else if (structure.type === "abandoned_ship") {
      const drawPos = getAbandonedShipDisplayPosition(structure, !net.isHost);
      if (drawPos) {
        worldX = drawPos.x - structureWidthPx * 0.5;
        worldY = drawPos.y - structureHeightPx * 0.5;
      }
    }
    const screenX = worldX - camera.x;
    const screenY = worldY - camera.y;
    if (
      screenX < -structureWidthPx ||
      screenY < -structureHeightPx ||
      screenX > viewWidth + structureWidthPx ||
      screenY > viewHeight + structureHeightPx
    ) {
      return;
    }

    const size = CONFIG.tileSize;
    const inset = 2;
    const baseX = screenX + inset;
    const baseY = screenY + inset;
    const baseSize = size - inset * 2;
    const baseWidth = structureWidthPx - inset * 2;
    const baseHeight = structureHeightPx - inset * 2;

    if (def.blocking) {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.ellipse(
        screenX + structureWidthPx / 2,
        screenY + structureHeightPx - 4,
        Math.max(baseSize / 2.2, baseWidth / 2.6),
        4,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    switch (structure.type) {
      case "floor": {
        drawPlanks(baseX, baseY, baseSize, def.color, true);
        break;
      }
      case "village_path": {
        const sand = "#b9a372";
        ctx.fillStyle = sand;
        ctx.fillRect(baseX, baseY, baseSize, baseSize);
        ctx.strokeStyle = "rgba(94, 77, 49, 0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(baseX + 3, baseY + 6);
        ctx.lineTo(baseX + 13, baseY + 12);
        ctx.lineTo(baseX + 25, baseY + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(baseX + 6, baseY + 20);
        ctx.lineTo(baseX + 17, baseY + 16);
        ctx.lineTo(baseX + 28, baseY + 22);
        ctx.stroke();
        break;
      }
      case "brick_floor": {
        drawBrick(baseX, baseY, baseSize, def.color);
        break;
      }
      case "bridge": {
        drawPlanks(baseX, baseY, baseSize, def.color, false);
        ctx.strokeStyle = tintColor(def.color, -0.45);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(baseX + 2, baseY + 4);
        ctx.lineTo(baseX + baseSize - 2, baseY + 4);
        ctx.moveTo(baseX + 2, baseY + baseSize - 4);
        ctx.lineTo(baseX + baseSize - 2, baseY + baseSize - 4);
        ctx.stroke();
        break;
      }
      case "dock": {
        drawPlanks(baseX, baseY, baseSize, def.color, false);
        ctx.fillStyle = tintColor(def.color, -0.3);
        ctx.fillRect(baseX + 2, baseY + 2, 3, baseSize - 4);
        ctx.fillRect(baseX + baseSize - 5, baseY + 2, 3, baseSize - 4);
        break;
      }
      case "shipwreck": {
        const seed = (((structure.tx + 11) * 92821) ^ ((structure.ty + 17) * 68917)) >>> 0;
        const tilt = (((seed % 19) - 9) / 180) * Math.PI;
        const cx = baseX + baseWidth * 0.5;
        const cy = baseY + baseHeight * 0.5;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(tilt);
        ctx.translate(-cx, -cy);

        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.beginPath();
        ctx.ellipse(cx, baseY + baseHeight - 1, Math.max(16, baseWidth * 0.44), 5, 0, 0, Math.PI * 2);
        ctx.fill();

        const deckX = baseX + 2;
        const deckY = baseY + 4;
        const deckW = baseWidth - 4;
        const deckH = baseHeight - 8;
        ctx.fillStyle = tintColor(def.color, -0.02);
        ctx.fillRect(deckX, deckY, deckW, deckH);
        ctx.strokeStyle = tintColor(def.color, -0.32);
        ctx.lineWidth = 1.3;
        const plankStep = 7;
        for (let x = deckX + 4; x < deckX + deckW - 2; x += plankStep) {
          ctx.beginPath();
          ctx.moveTo(x, deckY + 1);
          ctx.lineTo(x, deckY + deckH - 1);
          ctx.stroke();
        }

        ctx.fillStyle = "rgba(28, 20, 14, 0.38)";
        ctx.fillRect(deckX + deckW * 0.52, deckY + 3, 5, Math.max(9, deckH * 0.5));
        ctx.fillRect(deckX + 5, deckY + deckH - 8, Math.max(10, deckW * 0.28), 4);

        ctx.strokeStyle = tintColor(def.color, -0.46);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(deckX + 3, deckY + deckH - 2);
        ctx.lineTo(deckX + deckW * 0.27, deckY + deckH - 7);
        ctx.lineTo(deckX + deckW * 0.45, deckY + deckH - 2);
        ctx.stroke();

        const chestW = 20;
        const chestH = 12;
        const chestX = cx - chestW * 0.5 + 3;
        const chestY = deckY + Math.max(7, deckH * 0.36);
        ctx.fillStyle = "#7c532f";
        ctx.fillRect(chestX, chestY, chestW, chestH);
        ctx.fillStyle = "#5b3a1f";
        ctx.fillRect(chestX, chestY, chestW, 5);
        ctx.fillStyle = "#d6b971";
        ctx.fillRect(chestX + chestW * 0.5 - 2, chestY + 5, 4, 4);
        ctx.restore();
        break;
      }
      case "abandoned_ship": {
        const shipPos = getAbandonedShipDisplayPosition(structure, !net.isHost);
        const ship = ensureAbandonedShipMeta(structure);
        const centerX = (shipPos ? shipPos.x : (structure.tx + footprint.w * 0.5) * CONFIG.tileSize) - camera.x;
        const centerY = (shipPos ? shipPos.y : (structure.ty + footprint.h * 0.5) * CONFIG.tileSize) - camera.y;
        const angle = shipPos?.angle ?? 0;
        const halfW = structureWidthPx * 0.48;
        const halfH = structureHeightPx * 0.42;
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(angle);

        ctx.fillStyle = "rgba(0,0,0,0.28)";
        ctx.beginPath();
        ctx.ellipse(0, halfH * 0.74, halfW * 0.86, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = tintColor(def.color, -0.14);
        ctx.beginPath();
        ctx.moveTo(-halfW, -halfH * 0.2);
        ctx.lineTo(-halfW * 0.78, halfH * 0.55);
        ctx.lineTo(halfW * 0.74, halfH * 0.55);
        ctx.lineTo(halfW, -halfH * 0.12);
        ctx.lineTo(halfW * 0.55, -halfH * 0.58);
        ctx.lineTo(-halfW * 0.62, -halfH * 0.58);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = tintColor(def.color, 0.07);
        ctx.fillRect(-halfW * 0.66, -halfH * 0.38, halfW * 1.32, halfH * 0.72);
        ctx.strokeStyle = tintColor(def.color, -0.4);
        ctx.lineWidth = 1.4;
        for (let x = -halfW * 0.58; x <= halfW * 0.58; x += 11) {
          ctx.beginPath();
          ctx.moveTo(x, -halfH * 0.34);
          ctx.lineTo(x, halfH * 0.3);
          ctx.stroke();
        }

        ctx.fillStyle = tintColor(def.color, -0.05);
        ctx.fillRect(-halfW * 0.12, -halfH * 0.62, halfW * 0.52, halfH * 0.32);
        ctx.fillStyle = "rgba(235, 218, 188, 0.64)";
        ctx.fillRect(halfW * 0.02, -halfH * 0.57, 12, 7);
        ctx.fillRect(halfW * 0.02, -halfH * 0.44, 12, 7);

        ctx.strokeStyle = tintColor(def.color, -0.46);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-halfW * 0.72, -halfH * 0.1);
        ctx.lineTo(-halfW * 0.72, -halfH * 0.8);
        ctx.lineTo(-halfW * 0.36, -halfH * 0.86);
        ctx.stroke();

        if (ship?.repaired) {
          ctx.fillStyle = "rgba(132, 224, 176, 0.9)";
          ctx.beginPath();
          ctx.moveTo(-halfW * 0.36, -halfH * 0.86);
          ctx.lineTo(-halfW * 0.08, -halfH * 0.73);
          ctx.lineTo(-halfW * 0.36, -halfH * 0.62);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = "rgba(220, 133, 108, 0.9)";
          ctx.beginPath();
          ctx.moveTo(-halfW * 0.36, -halfH * 0.86);
          ctx.lineTo(-halfW * 0.1, -halfH * 0.74);
          ctx.lineTo(-halfW * 0.36, -halfH * 0.66);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "rgba(39, 19, 16, 0.55)";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-halfW * 0.02, -halfH * 0.24);
          ctx.lineTo(halfW * 0.34, halfH * 0.16);
          ctx.stroke();
        }

        if (ship?.driverId) {
          ctx.fillStyle = "rgba(255, 244, 206, 0.85)";
          ctx.beginPath();
          ctx.arc(-halfW * 0.2, -halfH * 0.08, 3.2, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        break;
      }
      case "wall": {
        drawBrick(baseX, baseY, baseSize, def.color);
        break;
      }
      case "brick_wall": {
        drawBrick(baseX, baseY, baseSize, def.color);
        ctx.strokeStyle = "rgba(0,0,0,0.25)";
        ctx.strokeRect(baseX + 1, baseY + 1, baseSize - 2, baseSize - 2);
        break;
      }
      case "fence": {
        ctx.fillStyle = tintColor(def.color, -0.15);
        ctx.fillRect(baseX + 4, baseY + 2, 3, baseSize - 4);
        ctx.fillRect(baseX + baseSize - 7, baseY + 2, 3, baseSize - 4);
        ctx.fillStyle = tintColor(def.color, 0.1);
        ctx.fillRect(baseX + 4, baseY + 8, baseSize - 8, 3);
        ctx.fillRect(baseX + 4, baseY + baseSize - 11, baseSize - 8, 3);
        break;
      }
      case "hut":
      case "small_house":
      case "medium_house":
      case "large_house": {
        const isVillageHouse = !!structure.meta?.village;
        const wallColor = isVillageHouse ? tintColor(def.color, 0.12) : tintColor(def.color, 0.05);
        const roofColor = isVillageHouse ? "#8f6f41" : tintColor(def.color, -0.25);
        const wallTop = baseY + Math.max(10, Math.floor(baseHeight * 0.28));
        const wallHeight = Math.max(8, baseHeight - (wallTop - baseY) - 2);

        ctx.fillStyle = wallColor;
        ctx.fillRect(baseX + 2, wallTop, baseWidth - 4, wallHeight);
        ctx.fillStyle = roofColor;
        ctx.beginPath();
        ctx.moveTo(baseX + 2, wallTop + 2);
        ctx.lineTo(baseX + baseWidth / 2, baseY - 4);
        ctx.lineTo(baseX + baseWidth - 2, wallTop + 2);
        ctx.closePath();
        ctx.fill();
        if (isVillageHouse) {
          ctx.strokeStyle = "rgba(235, 214, 152, 0.45)";
          ctx.lineWidth = 1;
          const stripeCount = Math.max(4, Math.floor(baseWidth / 18));
          const stripeStep = (baseWidth - 12) / stripeCount;
          for (let stripe = 0; stripe < stripeCount; stripe += 1) {
            const sx = baseX + 6 + stripe * stripeStep;
            ctx.beginPath();
            ctx.moveTo(sx, wallTop);
            ctx.lineTo(sx + 6, wallTop - 7);
            ctx.stroke();
          }
        }
        const doorWidth = clamp(Math.floor(baseWidth * 0.14), 8, 14);
        const doorHeight = clamp(Math.floor(baseHeight * 0.22), 8, 12);
        ctx.fillStyle = "#3a2a1b";
        ctx.fillRect(baseX + baseWidth / 2 - doorWidth / 2, baseY + baseHeight - doorHeight - 1, doorWidth, doorHeight);
        if (baseWidth >= CONFIG.tileSize * 1.9) {
          const windowY = wallTop + Math.max(3, Math.floor((baseHeight - wallTop + baseY) * 0.2));
          ctx.fillStyle = "rgba(238, 215, 158, 0.85)";
          ctx.fillRect(baseX + 8, windowY, 7, 5);
          ctx.fillRect(baseX + baseWidth - 15, windowY, 7, 5);
        }
        const tierLabel = structure.type === "small_house" ? "S" : structure.type === "medium_house" ? "M" : "L";
        ctx.fillStyle = "rgba(255, 240, 210, 0.8)";
        ctx.font = "bold 10px Trebuchet MS";
        ctx.textAlign = "center";
        ctx.fillText(tierLabel, baseX + baseWidth / 2, baseY + 9);
        break;
      }
      case "bed": {
        ctx.fillStyle = "#d9c7ad";
        ctx.fillRect(baseX + 3, baseY + 6, baseSize - 6, baseSize - 8);
        ctx.fillStyle = "#8ea9c6";
        ctx.fillRect(baseX + 3, baseY + 6, baseSize - 6, 7);
        break;
      }
      case "campfire": {
        ctx.fillStyle = "#4b2a1b";
        ctx.beginPath();
        ctx.ellipse(baseX + baseSize / 2, baseY + baseSize - 8, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#e56b2c";
        ctx.beginPath();
        ctx.moveTo(baseX + baseSize / 2, baseY + 6);
        ctx.lineTo(baseX + baseSize / 2 - 6, baseY + baseSize - 6);
        ctx.lineTo(baseX + baseSize / 2 + 6, baseY + baseSize - 6);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#ffd36b";
        ctx.beginPath();
        ctx.moveTo(baseX + baseSize / 2, baseY + 10);
        ctx.lineTo(baseX + baseSize / 2 - 3, baseY + baseSize - 8);
        ctx.lineTo(baseX + baseSize / 2 + 3, baseY + baseSize - 8);
        ctx.closePath();
        ctx.fill();
        break;
      }
      case "beacon": {
        ctx.fillStyle = tintColor(def.color, -0.15);
        ctx.fillRect(baseX + baseSize / 2 - 3, baseY + 4, 6, baseSize - 8);
        ctx.fillStyle = "#d95a4a";
        ctx.fillRect(baseX + baseSize / 2 + 3, baseY + 6, 8, 6);
        ctx.fillStyle = "#f6d56d";
        ctx.beginPath();
        ctx.arc(baseX + baseSize / 2, baseY + 6, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,220,150,0.7)";
        ctx.stroke();
        break;
      }
      case "bench": {
        ctx.fillStyle = tintColor(def.color, 0.1);
        ctx.fillRect(baseX + 4, baseY + 4, baseSize - 8, 6);
        ctx.fillStyle = tintColor(def.color, -0.2);
        ctx.fillRect(baseX + 6, baseY + 12, 4, baseSize - 12);
        ctx.fillRect(baseX + baseSize - 10, baseY + 12, 4, baseSize - 12);
        break;
      }
      case "smelter": {
        drawBrick(baseX + 2, baseY + 2, baseSize - 4, "#96504a");
        ctx.fillStyle = "#2a1f1c";
        ctx.beginPath();
        ctx.arc(baseX + baseSize / 2, baseY + baseSize - 9, 6, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "rgba(235, 128, 71, 0.8)";
        ctx.fillRect(baseX + baseSize / 2 - 4, baseY + baseSize - 13, 8, 3);
        ctx.fillStyle = "#6f757d";
        ctx.fillRect(baseX + baseSize - 9, baseY + 5, 4, 8);
        break;
      }
      case "sawmill": {
        drawPlanks(baseX, baseY, baseSize, "#8b6a43", true);
        ctx.beginPath();
        ctx.fillStyle = "#cfd6e2";
        ctx.arc(baseX + baseSize / 2, baseY + baseSize / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#6b6f78";
        ctx.stroke();
        ctx.fillStyle = "#6f5134";
        ctx.fillRect(baseX + 4, baseY + baseSize - 7, baseSize - 8, 3);
        break;
      }
      case "kiln": {
        drawBrick(baseX, baseY, baseSize, "#b37258");
        ctx.fillStyle = "#2a1c14";
        ctx.beginPath();
        ctx.arc(baseX + baseSize / 2, baseY + baseSize - 8, 6, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = "#5b4b3d";
        ctx.fillRect(baseX + baseSize - 9, baseY + 5, 4, 7);
        break;
      }
      case "chest": {
        ctx.fillStyle = tintColor(def.color, 0.05);
        ctx.fillRect(baseX + 4, baseY + 8, baseSize - 8, baseSize - 12);
        ctx.fillStyle = tintColor(def.color, -0.2);
        ctx.fillRect(baseX + 4, baseY + 4, baseSize - 8, 8);
        ctx.fillStyle = "#d8c07a";
        ctx.fillRect(baseX + baseSize / 2 - 3, baseY + baseSize / 2, 6, 6);
        break;
      }
      case "robot": {
        const robot = ensureRobotMeta(structure);
        ctx.fillStyle = "rgba(0,0,0,0.24)";
        ctx.beginPath();
        ctx.ellipse(baseX + baseSize / 2, baseY + baseSize - 4, 11, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#456484";
        ctx.fillRect(baseX + 5, baseY + 13, baseSize - 10, baseSize - 17);
        ctx.fillStyle = "#658ab3";
        ctx.fillRect(baseX + 8, baseY + 6, baseSize - 16, 10);
        ctx.fillStyle = "#d8eeff";
        ctx.fillRect(baseX + 10, baseY + 8, 4, 3);
        ctx.fillRect(baseX + baseSize - 14, baseY + 8, 4, 3);
        ctx.strokeStyle = "rgba(191, 228, 255, 0.7)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(baseX + 6, baseY + 20);
        ctx.lineTo(baseX + 2, baseY + 24);
        ctx.moveTo(baseX + baseSize - 6, baseY + 20);
        ctx.lineTo(baseX + baseSize - 2, baseY + 24);
        ctx.stroke();
        if (robot?.state === "mining" || robot?.state === "moving") {
          ctx.fillStyle = "rgba(124, 230, 169, 0.8)";
          ctx.beginPath();
          ctx.arc(baseX + baseSize / 2, baseY + 4, 2.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (robot?.state === "waiting") {
          ctx.fillStyle = "rgba(255, 192, 120, 0.85)";
          ctx.beginPath();
          ctx.arc(baseX + baseSize / 2, baseY + 4, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        break;
      }
      default: {
        ctx.fillStyle = def.color;
        ctx.fillRect(baseX, baseY, baseSize, baseSize);
      }
    }
  }

  function drawNightLighting(camera) {
    if (state.inCave || !state.isNight) return;
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (const structure of state.structures) {
      if (structure.removed) continue;
      const def = STRUCTURE_DEFS[structure.type];
      if (!def?.lightRadius) continue;
      const cx = structure.tx * CONFIG.tileSize + CONFIG.tileSize / 2 - camera.x;
      const cy = structure.ty * CONFIG.tileSize + CONFIG.tileSize / 2 - camera.y;
      const radius = def.lightRadius;
      const warmInner = structure.type === "campfire"
        ? "rgba(255, 178, 98, 0.44)"
        : "rgba(255, 232, 188, 0.3)";
      const warmMid = structure.type === "campfire"
        ? "rgba(255, 122, 64, 0.2)"
        : "rgba(216, 188, 140, 0.14)";
      const gradient = ctx.createRadialGradient(cx, cy, radius * 0.1, cx, cy, radius);
      gradient.addColorStop(0, warmInner);
      gradient.addColorStop(0.55, warmMid);
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawCaveDarkness(camera) {
    void camera;
  }

  function drawBeaconBeam(camera) {
    if (!state.gameWon || state.inCave) return;
    if (state.winTimer > WIN_SEQUENCE.beamDuration) return;
    const beacon = state.structures.find((structure) => structure.type === "beacon" && !structure.removed);
    if (!beacon) return;
    const centerX = (beacon.tx + 0.5) * CONFIG.tileSize - camera.x;
    const baseY = (beacon.ty + 0.5) * CONFIG.tileSize - camera.y;
    const grow = clamp(state.winTimer / 2.6, 0, 1);
    const height = viewHeight * (0.3 + 0.7 * grow);
    const beamWidth = 16 + Math.sin(state.winTimer * 6) * 2;
    const alpha = 0.7 * (1 - Math.max(0, (state.winTimer - 7) / 3));
    const topY = baseY - height;
    const gradient = ctx.createLinearGradient(centerX, topY, centerX, baseY);
    gradient.addColorStop(0, `rgba(255, 247, 210, ${0.0 * alpha})`);
    gradient.addColorStop(0.3, `rgba(255, 235, 170, ${0.45 * alpha})`);
    gradient.addColorStop(1, `rgba(255, 220, 140, ${0.8 * alpha})`);
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(centerX - beamWidth / 2, baseY);
    ctx.lineTo(centerX - beamWidth * 0.15, topY);
    ctx.lineTo(centerX + beamWidth * 0.15, topY);
    ctx.lineTo(centerX + beamWidth / 2, baseY);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawClimbingPlayer(screenX, screenY) {
    ctx.save();
    ctx.fillStyle = "#f2c38b";
    ctx.beginPath();
    ctx.arc(screenX, screenY - 6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2f4b6c";
    ctx.fillRect(screenX - 4, screenY, 8, 10);
    ctx.fillStyle = "#4a3a28";
    ctx.fillRect(screenX - 4, screenY + 10, 3, 6);
    ctx.fillRect(screenX + 1, screenY + 10, 3, 6);
    ctx.restore();
  }

  function drawRescueSequence(camera) {
    if (!state.gameWon || !state.winPlayerPos || state.inCave) return;
    const t = state.winTimer;
    if (t < WIN_SEQUENCE.heliStart || t > WIN_SEQUENCE.heliExitEnd) return;

    const targetX = state.winPlayerPos.x;
    const targetY = state.winPlayerPos.y;
    const offsetY = CONFIG.tileSize * 6;
    // Use camera-relative offscreen anchors so helicopter clearly flies in/out on any screen size.
    const offscreenPad = 140;
    const startX = camera.x - offscreenPad;
    const endX = camera.x + viewWidth + offscreenPad;

    let heliX = targetX;
    let heliY = targetY - offsetY;

    if (t <= WIN_SEQUENCE.approachEnd) {
      const progress = clamp((t - WIN_SEQUENCE.heliStart) / (WIN_SEQUENCE.approachEnd - WIN_SEQUENCE.heliStart), 0, 1);
      const eased = smoothstep(progress);
      heliX = lerp(startX, targetX, eased);
    } else if (t <= WIN_SEQUENCE.ladderRetractEnd) {
      heliX = targetX;
    } else {
      const progress = clamp((t - WIN_SEQUENCE.ladderRetractEnd) / (WIN_SEQUENCE.heliExitEnd - WIN_SEQUENCE.ladderRetractEnd), 0, 1);
      const eased = smoothstep(progress);
      heliX = lerp(targetX, endX, eased);
    }

    const bob = Math.sin(t * 4) * 2;
    const heliScreen = worldToScreen(heliX, heliY + bob, camera);

    // Ladder
    const ladderTopY = heliY + 6;
    let ladderLen = 0;
    if (t <= WIN_SEQUENCE.ladderDropEnd) {
      const progress = clamp((t - WIN_SEQUENCE.approachEnd) / (WIN_SEQUENCE.ladderDropEnd - WIN_SEQUENCE.approachEnd), 0, 1);
      ladderLen = (targetY - ladderTopY) * smoothstep(progress);
    } else if (t <= WIN_SEQUENCE.climbEnd) {
      ladderLen = targetY - ladderTopY;
    } else if (t <= WIN_SEQUENCE.ladderRetractEnd) {
      const progress = clamp((t - WIN_SEQUENCE.climbEnd) / (WIN_SEQUENCE.ladderRetractEnd - WIN_SEQUENCE.climbEnd), 0, 1);
      ladderLen = (targetY - ladderTopY) * (1 - smoothstep(progress));
    }

    if (ladderLen > 2) {
      const ladderTopScreen = worldToScreen(heliX, ladderTopY, camera);
      ctx.save();
      ctx.strokeStyle = "rgba(210, 200, 170, 0.9)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ladderTopScreen.x - 4, ladderTopScreen.y);
      ctx.lineTo(ladderTopScreen.x - 4, ladderTopScreen.y + ladderLen);
      ctx.moveTo(ladderTopScreen.x + 4, ladderTopScreen.y);
      ctx.lineTo(ladderTopScreen.x + 4, ladderTopScreen.y + ladderLen);
      ctx.stroke();
      ctx.strokeStyle = "rgba(230, 220, 190, 0.7)";
      for (let y = 6; y < ladderLen; y += 8) {
        ctx.beginPath();
        ctx.moveTo(ladderTopScreen.x - 5, ladderTopScreen.y + y);
        ctx.lineTo(ladderTopScreen.x + 5, ladderTopScreen.y + y);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Climbing player
    if (t >= WIN_SEQUENCE.ladderDropEnd && t <= WIN_SEQUENCE.climbEnd) {
      const climbProgress = clamp((t - WIN_SEQUENCE.ladderDropEnd) / (WIN_SEQUENCE.climbEnd - WIN_SEQUENCE.ladderDropEnd), 0, 1);
      const climbY = lerp(targetY, ladderTopY + 6, smoothstep(climbProgress));
      const climbScreen = worldToScreen(heliX, climbY, camera);
      drawClimbingPlayer(climbScreen.x, climbScreen.y);
    }

    // Helicopter body
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = "#344255";
    ctx.fillRect(heliScreen.x - 18, heliScreen.y - 6, 36, 12);
    ctx.fillStyle = "#202a36";
    ctx.fillRect(heliScreen.x - 8, heliScreen.y - 12, 16, 8);
    ctx.strokeStyle = "rgba(220,240,255,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(heliScreen.x - 20, heliScreen.y - 14);
    ctx.lineTo(heliScreen.x + 20, heliScreen.y - 14);
    ctx.stroke();
    ctx.fillStyle = "#253042";
    ctx.fillRect(heliScreen.x + 18, heliScreen.y - 2, 10, 4);
    ctx.restore();
  }

  function drawHouseInteriorItem(item, layout) {
    const x = layout.originX + item.tx * layout.tileSize;
    const y = layout.originY + item.ty * layout.tileSize;
    const size = layout.tileSize;
    const def = STRUCTURE_DEFS[item.type];
    const color = def?.color || "#999";
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.fillRect(x + 4, y + size - 8, size - 8, 5);
    if (item.type === "bed") {
      ctx.fillStyle = "#d2c4ac";
      ctx.fillRect(x + 6, y + 6, size - 12, size - 10);
      ctx.fillStyle = "#8ba8c7";
      ctx.fillRect(x + 6, y + 6, size - 12, 7);
    } else if (item.type === "chest") {
      ctx.fillStyle = tintColor(color, 0.06);
      ctx.fillRect(x + 7, y + 10, size - 14, size - 16);
      ctx.fillStyle = tintColor(color, -0.18);
      ctx.fillRect(x + 7, y + 6, size - 14, 8);
      ctx.fillStyle = "#e2cb85";
      ctx.fillRect(x + size / 2 - 2, y + size / 2, 4, 5);
    } else if (item.type === "campfire") {
      ctx.fillStyle = "#3e2a1d";
      ctx.beginPath();
      ctx.ellipse(x + size / 2, y + size / 2 + 4, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#e67a35";
      ctx.beginPath();
      ctx.moveTo(x + size / 2, y + 9);
      ctx.lineTo(x + size / 2 - 6, y + size / 2 + 8);
      ctx.lineTo(x + size / 2 + 6, y + size / 2 + 8);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(x + 6, y + 6, size - 12, size - 12);
    }
  }

  function renderHouseInterior() {
    const house = state.activeHouse;
    const interior = getHouseInterior(house);
    if (!interior || !state.housePlayer) return;
    const layout = getInteriorLayout(interior);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const bg = ctx.createLinearGradient(0, 0, 0, viewHeight);
    bg.addColorStop(0, "#101a29");
    bg.addColorStop(1, "#0b121c");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, viewWidth, viewHeight);

    ctx.fillStyle = "rgba(216, 190, 146, 0.9)";
    ctx.fillRect(layout.originX, layout.originY, layout.widthPx, layout.heightPx);
    ctx.strokeStyle = "rgba(90, 62, 38, 0.9)";
    ctx.lineWidth = 3;
    ctx.strokeRect(layout.originX, layout.originY, layout.widthPx, layout.heightPx);

    for (let y = 0; y < interior.height; y += 1) {
      for (let x = 0; x < interior.width; x += 1) {
        ctx.strokeStyle = "rgba(100, 70, 42, 0.12)";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          layout.originX + x * layout.tileSize,
          layout.originY + y * layout.tileSize,
          layout.tileSize,
          layout.tileSize
        );
      }
    }

    const doorX = Math.floor(interior.width / 2);
    const doorY = interior.height - 1;
    const doorPx = layout.originX + doorX * layout.tileSize;
    const doorPy = layout.originY + doorY * layout.tileSize;
    ctx.fillStyle = "#4a311c";
    ctx.fillRect(doorPx + 6, doorPy + 6, layout.tileSize - 12, layout.tileSize - 8);
    ctx.fillStyle = "rgba(255, 242, 210, 0.6)";
    ctx.fillRect(doorPx + 6, doorPy + 6, layout.tileSize - 12, 3);

    for (const item of interior.items) {
      drawHouseInteriorItem(item, layout);
    }

    const placement = getPlacementItem();
    if (placement) {
      const tile = getInteriorPlacementTile();
      if (tile) {
        const valid = canPlaceInteriorItem(house, placement.itemId, tile.tx, tile.ty).ok;
        const px = layout.originX + tile.tx * layout.tileSize;
        const py = layout.originY + tile.ty * layout.tileSize;
        ctx.fillStyle = valid ? "rgba(120, 210, 255, 0.28)" : "rgba(240, 80, 80, 0.3)";
        ctx.fillRect(px, py, layout.tileSize, layout.tileSize);
        ctx.strokeStyle = valid ? "rgba(120, 210, 255, 0.9)" : "rgba(240, 80, 80, 0.9)";
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 2, py + 2, layout.tileSize - 4, layout.tileSize - 4);
      }
    }

    const playerPx = layout.originX + state.housePlayer.x * layout.tileSize;
    const playerPy = layout.originY + state.housePlayer.y * layout.tileSize;
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(playerPx, playerPy + 12, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#f2c38b";
    ctx.beginPath();
    ctx.arc(playerPx, playerPy - 4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2f4b6c";
    ctx.fillRect(playerPx - 7, playerPy + 2, 14, 12);
    ctx.fillStyle = "#4a3a28";
    ctx.fillRect(playerPx - 6, playerPy + 14, 5, 6);
    ctx.fillRect(playerPx + 1, playerPy + 14, 5, 6);

    const currentHouseKey = getHouseKey(state.activeHouse);
    for (const remote of net.players.values()) {
      if (!remote.inHut || remote.houseKey !== currentHouseKey) continue;
      if (typeof remote.houseX !== "number" || typeof remote.houseY !== "number") continue;
      const houseX = typeof remote.renderHouseX === "number" ? remote.renderHouseX : remote.houseX;
      const houseY = typeof remote.renderHouseY === "number" ? remote.renderHouseY : remote.houseY;
      const rx = layout.originX + houseX * layout.tileSize;
      const ry = layout.originY + houseY * layout.tileSize;
      const body = remote.color || "#6fa8ff";
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.beginPath();
      ctx.ellipse(rx, ry + 12, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f2c38b";
      ctx.beginPath();
      ctx.arc(rx, ry - 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = body;
      ctx.fillRect(rx - 7, ry + 2, 14, 12);
      ctx.fillStyle = "#4a3a28";
      ctx.fillRect(rx - 6, ry + 14, 5, 6);
      ctx.fillRect(rx + 1, ry + 14, 5, 6);
      ctx.font = "12px Trebuchet MS";
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.textAlign = "center";
      ctx.fillText(remote.name ?? "Survivor", rx, ry - 14);
    }
    drawGuidanceMapOverlay();
    drawDebugWorldMiniMapOverlay();
  }

  function drawGuidanceMapOverlay() {
    const mapItemId = getActiveMapItemId();
    if (!mapItemId) return;
    const world = state.surfaceWorld || state.world;
    if (!world || !Array.isArray(world.tiles)) return;
    const localPos = getLocalSurfaceMapPosition();
    if (!localPos) return;
    const marker = getMapTargetForItem(world, mapItemId, localPos.x, localPos.y);
    const panelW = clamp(
      Math.floor(Math.min(viewWidth, viewHeight) * (MAP_PANEL.screenScale + 0.08)),
      MAP_PANEL.minSize + 52,
      MAP_PANEL.maxSize + 96
    );
    const panelH = clamp(Math.floor(panelW * 0.6), 136, 182);
    const panelX = 16;
    const panelY = 70;
    const compassCX = panelX + 62;
    const compassCY = panelY + 88;
    const compassR = 34;
    const accent = mapItemId === "village_map" ? "#6a4a23" : "#4b5669";
    const ink = "#3e2a18";

    ctx.save();
    drawRoundedRect(ctx, panelX + 2, panelY + 3, panelW, panelH, 11);
    ctx.fillStyle = "rgba(0,0,0,0.24)";
    ctx.fill();

    drawRoundedRect(ctx, panelX, panelY, panelW, panelH, 11);
    const paper = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
    paper.addColorStop(0, "rgba(218, 196, 152, 0.96)");
    paper.addColorStop(0.55, "rgba(196, 167, 112, 0.95)");
    paper.addColorStop(1, "rgba(173, 139, 89, 0.94)");
    ctx.fillStyle = paper;
    ctx.fill();
    ctx.strokeStyle = "rgba(89, 61, 34, 0.85)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = "rgba(82, 55, 30, 0.35)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 8; i += 1) {
      const notchX = panelX + 16 + i * ((panelW - 32) / 7);
      ctx.beginPath();
      ctx.moveTo(notchX - 4, panelY + 30);
      ctx.lineTo(notchX, panelY + 26);
      ctx.lineTo(notchX + 4, panelY + 30);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(notchX - 4, panelY + panelH - 20);
      ctx.lineTo(notchX, panelY + panelH - 16);
      ctx.lineTo(notchX + 4, panelY + panelH - 20);
      ctx.stroke();
    }

    ctx.font = "bold 14px Georgia";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = ink;
    ctx.fillText(getMapItemTitle(mapItemId), panelX + 12, panelY + 15);
    ctx.font = "11px Georgia";
    ctx.fillStyle = "rgba(62, 42, 24, 0.78)";
    ctx.fillText("etched reed compass", panelX + 12, panelY + 31);

    ctx.strokeStyle = "rgba(85, 61, 38, 0.62)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(compassCX, compassCY, compassR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(compassCX, compassCY, compassR - 8, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(74, 52, 31, 0.5)";
    ctx.beginPath();
    ctx.moveTo(compassCX - compassR, compassCY);
    ctx.lineTo(compassCX + compassR, compassCY);
    ctx.moveTo(compassCX, compassCY - compassR);
    ctx.lineTo(compassCX, compassCY + compassR);
    ctx.stroke();

    ctx.font = "bold 10px Georgia";
    ctx.fillStyle = "rgba(64, 43, 24, 0.9)";
    ctx.textAlign = "center";
    ctx.fillText("N", compassCX, compassCY - compassR - 8);
    ctx.fillText("S", compassCX, compassCY + compassR + 10);
    ctx.fillText("W", compassCX - compassR - 10, compassCY);
    ctx.fillText("E", compassCX + compassR + 10, compassCY);

    if (marker) {
      const dx = marker.x - localPos.x;
      const dy = marker.y - localPos.y;
      const dist = Math.hypot(dx, dy);
      const distTiles = Math.max(0, Math.round(dist / CONFIG.tileSize));
      const dirLabel = getCompassDirectionLabel(dx, dy);
      const ux = dist > 0.0001 ? dx / dist : 0;
      const uy = dist > 0.0001 ? dy / dist : -1;
      const tipX = compassCX + ux * (compassR - 7);
      const tipY = compassCY + uy * (compassR - 7);
      const tailX = compassCX - ux * 9;
      const tailY = compassCY - uy * 9;
      const sideX = -uy;
      const sideY = ux;

      ctx.strokeStyle = accent;
      ctx.fillStyle = accent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(tipX, tipY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX - ux * 11 + sideX * 5.5, tipY - uy * 11 + sideY * 5.5);
      ctx.lineTo(tipX - ux * 11 - sideX * 5.5, tipY - uy * 11 - sideY * 5.5);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(62, 42, 24, 0.85)";
      ctx.beginPath();
      ctx.arc(compassCX, compassCY, 3.6, 0, Math.PI * 2);
      ctx.fill();

      const textX = panelX + 112;
      ctx.textAlign = "left";
      ctx.font = "bold 12px Georgia";
      ctx.fillStyle = ink;
      ctx.fillText(`${marker.label}: ${dirLabel}`, textX, panelY + 64);
      ctx.font = "11px Georgia";
      ctx.fillStyle = "rgba(62, 42, 24, 0.9)";
      if (dirLabel === "here" || distTiles <= 1) {
        ctx.fillText("You are at the marked place.", textX, panelY + 84);
      } else {
        ctx.fillText(`Walk ${dirLabel}.`, textX, panelY + 84);
        ctx.fillText(`About ${distTiles} paces away.`, textX, panelY + 101);
      }
      ctx.font = "10px Georgia";
      ctx.fillStyle = "rgba(62, 42, 24, 0.72)";
      ctx.fillText("Follow the reed arrow.", textX, panelY + 124);
    } else {
      ctx.fillStyle = "rgba(62, 42, 24, 0.85)";
      ctx.beginPath();
      ctx.arc(compassCX, compassCY, 3.6, 0, Math.PI * 2);
      ctx.fill();
      const textX = panelX + 112;
      ctx.textAlign = "left";
      ctx.font = "bold 12px Georgia";
      ctx.fillStyle = ink;
      ctx.fillText("No sign found yet.", textX, panelY + 72);
      ctx.font = "11px Georgia";
      ctx.fillStyle = "rgba(62, 42, 24, 0.85)";
      ctx.fillText("Explore further islands", textX, panelY + 92);
      ctx.fillText("to reveal this trail.", textX, panelY + 108);
    }
    ctx.restore();
  }

  function getDebugWorldMiniMapLayout() {
    const world = state.surfaceWorld || state.world;
    if (!world || !Array.isArray(world.tiles)) return null;
    const worldPixelSize = world.size * CONFIG.tileSize;
    if (!Number.isFinite(worldPixelSize) || worldPixelSize <= 0) return null;

    const panelW = clamp(
      Math.floor(Math.min(viewWidth, viewHeight) * 0.38),
      186,
      320
    );
    const panelH = panelW + 36 + DEBUG_WILD_ROBOT_TOGGLE_HEIGHT;
    const panelX = viewWidth - panelW - 16;
    const panelY = 70;
    const mapX = panelX + 10;
    const mapY = panelY + 24;
    const mapW = panelW - 20;
    const mapH = panelH - 34 - DEBUG_WILD_ROBOT_TOGGLE_HEIGHT;
    const toggleX = panelX + 10;
    const toggleY = panelY + panelH - DEBUG_WILD_ROBOT_TOGGLE_HEIGHT - 6;
    const toggleW = panelW - 20;
    const toggleH = DEBUG_WILD_ROBOT_TOGGLE_HEIGHT;

    return {
      world,
      worldPixelSize,
      panelX,
      panelY,
      panelW,
      panelH,
      mapX,
      mapY,
      mapW,
      mapH,
      toggleX,
      toggleY,
      toggleW,
      toggleH,
    };
  }

  function isPointInRect(x, y, rx, ry, rw, rh) {
    return x >= rx && x <= rx + rw && y >= ry && y <= ry + rh;
  }

  function getDebugWorldMiniMapPointerPosition(layout, screenX, screenY, clampToMap = false) {
    if (!layout) return null;
    const {
      mapX,
      mapY,
      mapW,
      mapH,
      worldPixelSize,
      world,
    } = layout;
    let px = screenX;
    let py = screenY;
    if (clampToMap) {
      px = clamp(px, mapX, mapX + mapW);
      py = clamp(py, mapY, mapY + mapH);
    }
    if (!isPointInRect(px, py, mapX, mapY, mapW, mapH)) return null;
    const ratioX = clamp((px - mapX) / mapW, 0, 1);
    const ratioY = clamp((py - mapY) / mapH, 0, 1);
    const worldPixelX = ratioX * worldPixelSize;
    const worldPixelY = ratioY * worldPixelSize;
    const worldTx = (worldPixelX / CONFIG.tileSize) - 0.5;
    const worldTy = (worldPixelY / CONFIG.tileSize) - 0.5;
    return {
      screenX: px,
      screenY: py,
      ratioX,
      ratioY,
      worldPixelX,
      worldPixelY,
      worldTx,
      worldTy,
      tileX: clamp(Math.floor(worldPixelX / CONFIG.tileSize), 0, world.size - 1),
      tileY: clamp(Math.floor(worldPixelY / CONFIG.tileSize), 0, world.size - 1),
    };
  }

  function getDebugWorldMiniMapIslandAtPointer(layout, screenX, screenY) {
    if (!layout || !Array.isArray(layout.world?.islands)) return null;
    const pointerPos = getDebugWorldMiniMapPointerPosition(layout, screenX, screenY, false);
    if (!pointerPos) return null;
    const { world, worldPixelSize, mapX, mapY, mapW, mapH } = layout;
    let best = null;
    let bestScore = Infinity;
    for (let islandIndex = 0; islandIndex < world.islands.length; islandIndex += 1) {
      const island = world.islands[islandIndex];
      if (!island) continue;
      const ix = mapX + (((island.x + 0.5) * CONFIG.tileSize) / worldPixelSize) * mapW;
      const iy = mapY + (((island.y + 0.5) * CONFIG.tileSize) / worldPixelSize) * mapH;
      const radius = Math.max(1.4, ((island.radius * CONFIG.tileSize) / worldPixelSize) * mapW);
      const dist = Math.hypot(pointerPos.screenX - ix, pointerPos.screenY - iy);
      const score = dist - radius;
      if (score <= 9 && score < bestScore) {
        bestScore = score;
        best = { islandIndex, island };
      }
    }
    if (!best) return null;
    return {
      islandIndex: best.islandIndex,
      island: best.island,
      pointerPos,
    };
  }

  function updateDebugIslandDragPreview(screenX, screenY) {
    const drag = state.debugIslandDrag;
    if (!drag) return false;
    const layout = getDebugWorldMiniMapLayout();
    if (!layout || layout.world.seed !== drag.seed) return false;
    const pointerPos = getDebugWorldMiniMapPointerPosition(layout, screenX, screenY, true);
    if (!pointerPos) return false;
    const targetX = pointerPos.worldTx - drag.offsetX;
    const targetY = pointerPos.worldTy - drag.offsetY;
    const clampedTarget = clampIslandCenterForDebugDrag(layout.world, drag.islandIndex, targetX, targetY);
    drag.previewX = Math.round(clampedTarget.x);
    drag.previewY = Math.round(clampedTarget.y);
    return true;
  }

  function startDebugIslandDrag(event, layout) {
    if (!state.debugUnlocked || !state.debugWorldMapVisible || !state.debugContinentalShift) return false;
    if (!layout) return false;
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return true;
    }
    const target = getDebugWorldMiniMapIslandAtPointer(layout, event.clientX, event.clientY);
    if (!target) {
      setPrompt("Select an island to drag", 1);
      return true;
    }
    state.debugIslandDrag = {
      seed: layout.world.seed,
      islandIndex: target.islandIndex,
      pointerId: Number.isFinite(event.pointerId) ? event.pointerId : null,
      offsetX: target.pointerPos.worldTx - target.island.x,
      offsetY: target.pointerPos.worldTy - target.island.y,
      previewX: target.island.x,
      previewY: target.island.y,
    };
    updateDebugIslandDragPreview(event.clientX, event.clientY);
    if (event.currentTarget && typeof event.currentTarget.setPointerCapture === "function") {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch (err) {
        // ignore pointer capture failures
      }
    }
    setPrompt("Dragging island...", 0.9);
    return true;
  }

  function commitDebugIslandDrag(event = null) {
    const drag = state.debugIslandDrag;
    if (!drag) return false;
    if (
      event
      && drag.pointerId !== null
      && Number.isFinite(event.pointerId)
      && event.pointerId !== drag.pointerId
    ) {
      return false;
    }
    if (event) {
      updateDebugIslandDragPreview(event.clientX, event.clientY);
    }
    state.debugIslandDrag = null;
    if (netIsClientReady()) return true;
    const world = state.surfaceWorld || state.world;
    if (!world || world.seed !== drag.seed) return true;
    const changed = moveSurfaceIslandForContinentalShift(
      world,
      drag.islandIndex,
      drag.previewX,
      drag.previewY
    );
    if (!changed) {
      setPrompt("Island unchanged", 0.9);
      return true;
    }
    if (!state.inCave) {
      state.world = world;
    }
    markDirty();
    setPrompt("Island shifted", 1.2);
    if (net.isHost && net.connections.size > 0) {
      broadcastNet(buildSnapshot());
    }
    return true;
  }

  function drawDebugWorldMiniMapOverlay() {
    if (!state.debugUnlocked || !state.debugWorldMapVisible) return;
    const layout = getDebugWorldMiniMapLayout();
    if (!layout) return;
    const {
      world,
      worldPixelSize,
      panelX,
      panelY,
      panelW,
      panelH,
      mapX,
      mapY,
      mapW,
      mapH,
      toggleX,
      toggleY,
      toggleW,
      toggleH,
    } = layout;
    const players = getDebugSurfacePlayerMarkers();

    let wildRobotStructure = null;
    if (Array.isArray(state.structures)) {
      for (const structure of state.structures) {
        if (!structure || structure.removed || structure.type !== "robot") continue;
        if (structure.meta?.wildSpawn) {
          wildRobotStructure = structure;
          break;
        }
      }
    }
    const hasWildRobot = !!wildRobotStructure;

    ctx.save();

    drawRoundedRect(ctx, panelX + 2, panelY + 2, panelW, panelH, 11);
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fill();

    drawRoundedRect(ctx, panelX, panelY, panelW, panelH, 11);
    const panelGradient = ctx.createLinearGradient(panelX, panelY, panelX, panelY + panelH);
    panelGradient.addColorStop(0, "rgba(12, 20, 30, 0.9)");
    panelGradient.addColorStop(1, "rgba(9, 16, 24, 0.86)");
    ctx.fillStyle = panelGradient;
    ctx.fill();
    ctx.strokeStyle = "rgba(150, 210, 245, 0.45)";
    ctx.lineWidth = 1.2;
    ctx.stroke();

    drawRoundedRect(ctx, mapX, mapY, mapW, mapH, 7);
    const waterGradient = ctx.createLinearGradient(mapX, mapY, mapX, mapY + mapH);
    waterGradient.addColorStop(0, "rgba(33, 95, 141, 0.9)");
    waterGradient.addColorStop(1, "rgba(23, 72, 116, 0.92)");
    ctx.fillStyle = waterGradient;
    ctx.fill();
    ctx.strokeStyle = "rgba(142, 206, 240, 0.38)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const activeIslandDrag = state.debugIslandDrag && state.debugIslandDrag.seed === world.seed
      ? state.debugIslandDrag
      : null;

    if (Array.isArray(world.islands)) {
      for (let islandIndex = 0; islandIndex < world.islands.length; islandIndex += 1) {
        const island = world.islands[islandIndex];
        if (!island) continue;
        const drawIslandX = (activeIslandDrag && activeIslandDrag.islandIndex === islandIndex)
          ? activeIslandDrag.previewX
          : island.x;
        const drawIslandY = (activeIslandDrag && activeIslandDrag.islandIndex === islandIndex)
          ? activeIslandDrag.previewY
          : island.y;
        const ix = mapX + (((drawIslandX + 0.5) * CONFIG.tileSize) / worldPixelSize) * mapW;
        const iy = mapY + (((drawIslandY + 0.5) * CONFIG.tileSize) / worldPixelSize) * mapH;
        const radius = Math.max(1.4, ((island.radius * CONFIG.tileSize) / worldPixelSize) * mapW);
        const biomeLand = BIOMES[island.biomeId]?.land;
        const mushroom = isMushroomBiomeId(island.biomeId);
        const draggingThisIsland = activeIslandDrag && activeIslandDrag.islandIndex === islandIndex;
        let landColor = "rgba(92, 156, 96, 0.92)";
        if (Array.isArray(biomeLand) && biomeLand.length >= 3) {
          landColor = `rgba(${biomeLand[0]}, ${biomeLand[1]}, ${biomeLand[2]}, 0.92)`;
        }
        if (mushroom) {
          landColor = "rgba(162, 97, 176, 0.96)";
        }
        ctx.fillStyle = landColor;
        ctx.beginPath();
        ctx.arc(ix, iy, radius, 0, Math.PI * 2);
        ctx.fill();
        if (mushroom) {
          ctx.strokeStyle = "rgba(244, 193, 255, 0.98)";
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.arc(ix, iy, radius + 1.8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = "rgba(244, 229, 255, 0.95)";
          ctx.beginPath();
          ctx.arc(ix, iy, Math.max(1.2, radius * 0.2), 0, Math.PI * 2);
          ctx.fill();
        }
        if (island.starter) {
          ctx.strokeStyle = "rgba(246, 232, 153, 0.95)";
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.arc(ix, iy, radius + 1.4, 0, Math.PI * 2);
          ctx.stroke();
        }
        if (draggingThisIsland) {
          ctx.strokeStyle = "rgba(255, 246, 180, 0.95)";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(ix, iy, radius + 2.8, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    for (const marker of players) {
      const mx = mapX + (marker.x / worldPixelSize) * mapW;
      const my = mapY + (marker.y / worldPixelSize) * mapH;
      if (!Number.isFinite(mx) || !Number.isFinite(my)) continue;
      if (mx < mapX || mx > mapX + mapW || my < mapY || my > mapY + mapH) continue;

      ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
      ctx.beginPath();
      ctx.arc(mx, my + 1, 4.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = marker.color || "#6fa8ff";
      ctx.beginPath();
      ctx.arc(mx, my, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(240, 248, 255, 0.9)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      if (marker.inCave) {
        ctx.strokeStyle = "rgba(255, 214, 129, 0.95)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mx, my, 5.6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (state.debugShowAbandonedRobot && wildRobotStructure) {
      const robotCenter = getStructureCenterWorld(wildRobotStructure);
      const rx = mapX + (robotCenter.x / worldPixelSize) * mapW;
      const ry = mapY + (robotCenter.y / worldPixelSize) * mapH;
      if (
        Number.isFinite(rx)
        && Number.isFinite(ry)
        && rx >= mapX
        && rx <= mapX + mapW
        && ry >= mapY
        && ry <= mapY + mapH
      ) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
        ctx.beginPath();
        ctx.arc(rx, ry + 1.4, 5.0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#f2e37a";
        ctx.beginPath();
        ctx.arc(rx, ry, 3.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 248, 210, 0.96)";
        ctx.lineWidth = 1.6;
        ctx.stroke();

        ctx.strokeStyle = "rgba(120, 90, 40, 0.85)";
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.arc(rx, ry, 6.2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.font = "bold 12px Trebuchet MS";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(226, 243, 255, 0.95)";
    ctx.fillText("Debug World Mini-Map", panelX + 10, panelY + 13);
    ctx.font = "10px Trebuchet MS";
    ctx.fillStyle = "rgba(189, 216, 235, 0.88)";
    ctx.fillText(`Players: ${players.length}`, panelX + panelW - 82, panelY + 13);
    if (world.seed) {
      const bottomTextY = panelY + panelH - toggleH - 10;
      ctx.fillText(`Seed: ${world.seed}`, panelX + 10, bottomTextY);
    }

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    drawRoundedRect(ctx, toggleX, toggleY, toggleW, toggleH, 6);
    const toggleGradient = ctx.createLinearGradient(toggleX, toggleY, toggleX, toggleY + toggleH);
    toggleGradient.addColorStop(0, "rgba(12, 24, 36, 0.95)");
    toggleGradient.addColorStop(1, "rgba(8, 16, 26, 0.96)");
    ctx.fillStyle = toggleGradient;
    ctx.fill();
    ctx.strokeStyle = "rgba(140, 190, 230, 0.7)";
    ctx.lineWidth = 1;
    ctx.stroke();

    const boxSize = 14;
    const boxX = toggleX + 9;
    const boxY = toggleY + (toggleH - boxSize) / 2;
    const enabled = state.debugShowAbandonedRobot && hasWildRobot;

    drawRoundedRect(ctx, boxX, boxY, boxSize, boxSize, 3);
    ctx.fillStyle = enabled ? "rgba(118, 189, 250, 0.55)" : "rgba(10, 18, 28, 0.9)";
    ctx.fill();
    ctx.strokeStyle = enabled ? "rgba(188, 232, 255, 0.95)" : "rgba(120, 170, 210, 0.9)";
    ctx.lineWidth = 1;
    ctx.stroke();

    if (enabled) {
      ctx.strokeStyle = "rgba(12, 28, 44, 0.9)";
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(boxX + 3, boxY + boxSize * 0.55);
      ctx.lineTo(boxX + boxSize * 0.45, boxY + boxSize - 3.2);
      ctx.lineTo(boxX + boxSize - 3, boxY + 3.4);
      ctx.stroke();
    }

    const labelX = boxX + boxSize + 6;
    const labelY = toggleY + toggleH * 0.5;
    ctx.font = "10px Trebuchet MS";
    ctx.fillStyle = hasWildRobot
      ? "rgba(214, 236, 255, 0.96)"
      : "rgba(150, 170, 190, 0.72)";
    ctx.fillText("Show abandoned robot", labelX, labelY);

    if (!hasWildRobot) {
      ctx.font = "9px Trebuchet MS";
      ctx.textAlign = "right";
      ctx.fillStyle = "rgba(200, 160, 130, 0.86)";
      ctx.fillText("No wild robot this seed", toggleX + toggleW - 6, labelY);
    }

    ctx.restore();
  }

  function render() {
    if (!state.world || !state.player) return;

    if (state.player.inHut && state.activeHouse) {
      renderHouseInterior();
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, viewWidth, viewHeight);

    const camera = getCamera();

    if (state.inCave) {
      ctx.fillStyle = COLORS.caveWall;
      ctx.fillRect(0, 0, viewWidth, viewHeight);
    } else {
      const waterGradient = ctx.createLinearGradient(0, 0, 0, viewHeight);
      waterGradient.addColorStop(0, "#245f8e");
      waterGradient.addColorStop(0.5, COLORS.water);
      waterGradient.addColorStop(1, "#1c4f7a");
      ctx.fillStyle = waterGradient;
      ctx.fillRect(0, 0, viewWidth, viewHeight);
      drawAmbientFish(camera);
    }

    const startX = Math.max(0, Math.floor(camera.x / CONFIG.tileSize) - 1);
    const startY = Math.max(0, Math.floor(camera.y / CONFIG.tileSize) - 1);
    const endX = Math.min(state.world.size, Math.ceil((camera.x + viewWidth) / CONFIG.tileSize) + 1);
    const endY = Math.min(state.world.size, Math.ceil((camera.y + viewHeight) / CONFIG.tileSize) + 1);

    for (let y = startY; y < endY; y += 1) {
      for (let x = startX; x < endX; x += 1) {
        const idx = tileIndex(x, y, state.world.size);
        if (!state.world.tiles[idx]) continue;
        const screenX = x * CONFIG.tileSize - camera.x;
        const screenY = y * CONFIG.tileSize - camera.y;
        if (state.inCave) {
          const shade = state.world.shades[idx] ?? 0.6;
          const base = [60, 48, 42];
          const r = Math.floor(base[0] * shade + 10);
          const g = Math.floor(base[1] * shade + 10);
          const b = Math.floor(base[2] * shade + 10);
          ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          ctx.fillRect(screenX, screenY, CONFIG.tileSize, CONFIG.tileSize);
        } else {
          const biomeId = state.world.biomeGrid?.[idx] ?? 0;
          const isBeach = !!state.world.beachGrid?.[idx];
          drawLandTile(screenX, screenY, state.world.shades[idx], biomeId, isBeach, x, y);
        }
      }
    }

    if (!state.inCave) {
      for (const structure of state.structures) {
        if (structure.removed) continue;
        if (
          structure.type === "floor"
          || structure.type === "village_path"
          || structure.type === "brick_floor"
          || structure.type === "bridge"
          || structure.type === "dock"
        ) {
          drawStructure(structure, camera);
        }
      }
    }

    if (!state.inCave && state.surfaceWorld?.caves) {
      for (const cave of state.surfaceWorld.caves) {
        const screenX = cave.tx * CONFIG.tileSize - camera.x;
        const screenY = cave.ty * CONFIG.tileSize - camera.y;
        if (
          screenX < -CONFIG.tileSize ||
          screenY < -CONFIG.tileSize ||
          screenX > viewWidth + CONFIG.tileSize ||
          screenY > viewHeight + CONFIG.tileSize
        ) {
          continue;
        }
        const cx = screenX + CONFIG.tileSize / 2;
        const cy = screenY + CONFIG.tileSize / 2;
        ctx.fillStyle = COLORS.caveEntrance;
        ctx.beginPath();
        ctx.arc(cx, cy, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "rgba(0,0,0,0.6)";
        ctx.beginPath();
        ctx.arc(cx, cy + 1, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (state.inCave && state.world.landmarks) {
      for (const landmark of state.world.landmarks) {
        const lx = landmark.x - camera.x;
        const ly = landmark.y - camera.y;
        if (lx < -24 || ly < -24 || lx > viewWidth + 24 || ly > viewHeight + 24) continue;
        ctx.fillStyle = landmark.color || "#86b9d7";
        ctx.beginPath();
        ctx.arc(lx, ly, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.35)";
        ctx.beginPath();
        ctx.arc(lx - 2, ly - 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const res of state.world.resources) {
      if (res.removed) continue;
      const screen = worldToScreen(res.x, res.y, camera);
      if (
        screen.x < -50 ||
        screen.y < -50 ||
        screen.x > viewWidth + 50 ||
        screen.y > viewHeight + 50
      ) {
        continue;
      }

      const idx = tileIndex(res.tx, res.ty, state.world.size);
      const biomeId = state.world.biomeGrid?.[idx] ?? 0;
      const biome = BIOMES[biomeId] || BIOMES[0];

      if (res.type === "tree") {
        const treeScale = getBiomeTreeVisualScale(biome);
        const useScaledTree = treeScale > 1.001 && res.stage !== "stump";
        if (useScaledTree) {
          const anchorY = res.stage === "sapling" ? screen.y + 14 : screen.y + 21;
          ctx.save();
          ctx.translate(screen.x, anchorY);
          ctx.scale(treeScale, treeScale);
          ctx.translate(-screen.x, -anchorY);
        }
        if (res.stage === "stump") {
          ctx.fillStyle = tintColor(TREE_TRUNK, -0.1);
          ctx.fillRect(screen.x - 6, screen.y + 8, 12, 8);
          ctx.fillStyle = tintColor(TREE_TRUNK, 0.25);
          ctx.fillRect(screen.x - 6, screen.y + 8, 12, 2);
          ctx.strokeStyle = "rgba(0,0,0,0.2)";
          ctx.beginPath();
          ctx.ellipse(screen.x, screen.y + 12, 5, 2, 0, 0, Math.PI * 2);
          ctx.stroke();
        } else if (res.stage === "sapling") {
          ctx.fillStyle = tintColor(TREE_TRUNK, -0.1);
          ctx.fillRect(screen.x - 1, screen.y + 8, 2, 6);
          ctx.beginPath();
          ctx.fillStyle = tintColor(biome.tree, 0.25);
          ctx.arc(screen.x, screen.y + 4, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = tintColor(biome.tree, -0.4);
          ctx.stroke();
        } else {
          ctx.fillStyle = tintColor(TREE_TRUNK, -0.1);
          ctx.fillRect(screen.x - 5, screen.y + 8, 10, 13);
          ctx.fillStyle = tintColor(TREE_TRUNK, 0.2);
          ctx.fillRect(screen.x - 4, screen.y + 8, 8, 3);
          ctx.fillStyle = tintColor(TREE_TRUNK, -0.25);
          ctx.fillRect(screen.x - 6, screen.y + 18, 12, 3);

          const leafBase = biome.tree;
          const leafDark = tintColor(leafBase, -0.35);
          const leafMid = tintColor(leafBase, 0.05);
          const leafLight = tintColor(leafBase, 0.45);
          if (biome.key === "jungle") {
            ctx.fillStyle = leafDark;
            ctx.beginPath();
            ctx.ellipse(screen.x - 8, screen.y - 4, 11, 8, -0.35, 0, Math.PI * 2);
            ctx.ellipse(screen.x + 8, screen.y - 4, 11, 8, 0.35, 0, Math.PI * 2);
            ctx.ellipse(screen.x, screen.y - 11, 10, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = tintColor(leafBase, 0.28);
            ctx.beginPath();
            ctx.ellipse(screen.x, screen.y - 2, 14, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = tintColor(leafBase, -0.4);
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.strokeStyle = "rgba(58, 113, 74, 0.6)";
            ctx.beginPath();
            ctx.moveTo(screen.x - 10, screen.y - 2);
            ctx.lineTo(screen.x - 12, screen.y + 4);
            ctx.moveTo(screen.x + 11, screen.y - 1);
            ctx.lineTo(screen.x + 13, screen.y + 5);
            ctx.stroke();
          } else if (biome.key === "snow") {
            ctx.fillStyle = tintColor(leafBase, -0.15);
            ctx.beginPath();
            ctx.arc(screen.x - 7, screen.y - 2, 9, 0, Math.PI * 2);
            ctx.arc(screen.x + 7, screen.y - 2, 9, 0, Math.PI * 2);
            ctx.arc(screen.x, screen.y - 10, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = tintColor(leafBase, 0.2);
            ctx.beginPath();
            ctx.arc(screen.x, screen.y - 3, 13, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(255,255,255,0.6)";
            ctx.beginPath();
            ctx.arc(screen.x - 4, screen.y - 7, 5, 0, Math.PI * 2);
            ctx.arc(screen.x + 3, screen.y - 5, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(190, 215, 235, 0.7)";
            ctx.lineWidth = 1.2;
            ctx.stroke();
          } else if (biome.key === "volcanic") {
            ctx.fillStyle = tintColor(leafBase, -0.25);
            ctx.beginPath();
            ctx.arc(screen.x - 7, screen.y - 2, 9, 0, Math.PI * 2);
            ctx.arc(screen.x + 7, screen.y - 2, 8, 0, Math.PI * 2);
            ctx.arc(screen.x, screen.y - 9, 7, 0, Math.PI * 2);
            ctx.fill();
            const lavaGlow = ctx.createRadialGradient(screen.x, screen.y - 4, 2, screen.x, screen.y - 3, 14);
            lavaGlow.addColorStop(0, "rgba(205, 104, 74, 0.28)");
            lavaGlow.addColorStop(1, "rgba(120, 66, 50, 0)");
            ctx.fillStyle = lavaGlow;
            ctx.beginPath();
            ctx.arc(screen.x, screen.y - 3, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = tintColor(leafBase, -0.45);
            ctx.lineWidth = 1.2;
            ctx.stroke();
          } else if (biome.key === "redwood") {
            ctx.fillStyle = tintColor(TREE_TRUNK, -0.2);
            ctx.fillRect(screen.x - 6, screen.y + 3, 12, 18);
            ctx.fillStyle = tintColor(TREE_TRUNK, 0.12);
            ctx.fillRect(screen.x - 5, screen.y + 3, 3, 18);
            ctx.fillStyle = tintColor(leafBase, -0.25);
            ctx.beginPath();
            ctx.ellipse(screen.x, screen.y - 11, 9, 6, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = tintColor(leafBase, 0.2);
            ctx.beginPath();
            ctx.ellipse(screen.x, screen.y - 6, 13, 7.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = tintColor(leafBase, -0.45);
            ctx.lineWidth = 1.4;
            ctx.stroke();
          } else if (biome.key === "mangrove") {
            ctx.fillStyle = tintColor(TREE_TRUNK, -0.12);
            ctx.fillRect(screen.x - 4, screen.y + 7, 8, 14);
            ctx.strokeStyle = tintColor(TREE_TRUNK, -0.3);
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(screen.x - 4, screen.y + 17);
            ctx.lineTo(screen.x - 8, screen.y + 20);
            ctx.moveTo(screen.x + 4, screen.y + 17);
            ctx.lineTo(screen.x + 8, screen.y + 20);
            ctx.stroke();
            ctx.fillStyle = tintColor(leafBase, -0.2);
            ctx.beginPath();
            ctx.arc(screen.x - 6, screen.y - 3, 8, 0, Math.PI * 2);
            ctx.arc(screen.x + 6, screen.y - 3, 8, 0, Math.PI * 2);
            ctx.arc(screen.x, screen.y - 9, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = tintColor(leafBase, 0.22);
            ctx.beginPath();
            ctx.arc(screen.x, screen.y - 2, 11, 0, Math.PI * 2);
            ctx.fill();
          } else if (biome.key === "temperate") {
            ctx.fillStyle = leafDark;
            ctx.beginPath();
            ctx.arc(screen.x - 8, screen.y - 2, 10, 0, Math.PI * 2);
            ctx.arc(screen.x + 9, screen.y - 1, 9, 0, Math.PI * 2);
            ctx.arc(screen.x, screen.y - 10, 9, 0, Math.PI * 2);
            ctx.fill();

            const temperateGradient = ctx.createRadialGradient(
              screen.x - 4,
              screen.y - 6,
              4,
              screen.x,
              screen.y - 2,
              17
            );
            temperateGradient.addColorStop(0, leafLight);
            temperateGradient.addColorStop(1, leafMid);
            ctx.beginPath();
            ctx.fillStyle = temperateGradient;
            ctx.arc(screen.x, screen.y - 2, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = tintColor(leafBase, -0.45);
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.beginPath();
            ctx.arc(screen.x - 4, screen.y - 7, 5, 0, Math.PI * 2);
            ctx.fill();
          } else if (biome.key === "ashlands") {
            ctx.fillStyle = tintColor(TREE_TRUNK, -0.34);
            ctx.fillRect(screen.x - 4, screen.y + 6, 8, 15);
            ctx.strokeStyle = tintColor(TREE_TRUNK, -0.5);
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(screen.x - 3, screen.y + 10);
            ctx.lineTo(screen.x - 8, screen.y + 5);
            ctx.moveTo(screen.x + 2, screen.y + 9);
            ctx.lineTo(screen.x + 7, screen.y + 3);
            ctx.stroke();
            ctx.fillStyle = tintColor(leafBase, -0.35);
            ctx.beginPath();
            ctx.arc(screen.x - 5, screen.y - 3, 6, 0, Math.PI * 2);
            ctx.arc(screen.x + 5, screen.y - 4, 5, 0, Math.PI * 2);
            ctx.arc(screen.x, screen.y - 8, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "rgba(222, 154, 110, 0.2)";
            ctx.beginPath();
            ctx.arc(screen.x + 2, screen.y - 6, 3, 0, Math.PI * 2);
            ctx.fill();
          } else if (biome.key === "marsh") {
            ctx.fillStyle = tintColor(TREE_TRUNK, -0.06);
            ctx.fillRect(screen.x - 5, screen.y + 7, 10, 14);
            ctx.fillStyle = tintColor(TREE_TRUNK, -0.28);
            ctx.fillRect(screen.x - 7, screen.y + 17, 14, 3);
            ctx.strokeStyle = "rgba(54, 95, 72, 0.75)";
            ctx.lineWidth = 1.1;
            ctx.beginPath();
            ctx.moveTo(screen.x - 8, screen.y - 6);
            ctx.quadraticCurveTo(screen.x - 12, screen.y + 1, screen.x - 9, screen.y + 7);
            ctx.moveTo(screen.x + 7, screen.y - 5);
            ctx.quadraticCurveTo(screen.x + 12, screen.y + 2, screen.x + 9, screen.y + 8);
            ctx.stroke();
            ctx.fillStyle = tintColor(leafBase, -0.2);
            ctx.beginPath();
            ctx.ellipse(screen.x - 7, screen.y - 4, 8, 6, 0, 0, Math.PI * 2);
            ctx.ellipse(screen.x + 7, screen.y - 4, 8, 6, 0, 0, Math.PI * 2);
            ctx.ellipse(screen.x, screen.y - 10, 9, 7, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = tintColor(leafBase, 0.18);
            ctx.beginPath();
            ctx.ellipse(screen.x, screen.y - 2, 12, 8, 0, 0, Math.PI * 2);
            ctx.fill();
          } else if (biome.key === "mushroom") {
            ctx.fillStyle = tintColor(TREE_TRUNK, -0.06);
            ctx.fillRect(screen.x - 3, screen.y + 6, 6, 15);
            ctx.fillStyle = tintColor(TREE_TRUNK, 0.22);
            ctx.fillRect(screen.x - 2, screen.y + 6, 2, 15);
            ctx.fillStyle = "#d861a6";
            ctx.beginPath();
            ctx.ellipse(screen.x - 6, screen.y - 5, 8, 6, -0.22, Math.PI, 0, false);
            ctx.ellipse(screen.x + 6, screen.y - 6, 8, 6, 0.22, Math.PI, 0, false);
            ctx.fill();
            ctx.fillStyle = "#b44cc8";
            ctx.beginPath();
            ctx.ellipse(screen.x, screen.y - 9, 10, 7, 0, Math.PI, 0, false);
            ctx.fill();
            ctx.fillStyle = "rgba(255, 235, 247, 0.78)";
            ctx.beginPath();
            ctx.arc(screen.x - 4, screen.y - 7, 1.6, 0, Math.PI * 2);
            ctx.arc(screen.x + 1, screen.y - 10, 1.4, 0, Math.PI * 2);
            ctx.arc(screen.x + 6, screen.y - 7, 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(88, 45, 98, 0.72)";
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.ellipse(screen.x, screen.y - 2, 13, 9, 0, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.fillStyle = leafDark;
            ctx.beginPath();
            ctx.arc(screen.x - 8, screen.y - 2, 10, 0, Math.PI * 2);
            ctx.arc(screen.x + 9, screen.y - 1, 9, 0, Math.PI * 2);
            ctx.arc(screen.x, screen.y - 10, 9, 0, Math.PI * 2);
            ctx.fill();

            const gradient = ctx.createRadialGradient(
              screen.x - 4,
              screen.y - 6,
              4,
              screen.x,
              screen.y - 2,
              17
            );
            gradient.addColorStop(0, leafLight);
            gradient.addColorStop(1, leafMid);
            ctx.beginPath();
            ctx.fillStyle = gradient;
            ctx.arc(screen.x, screen.y - 2, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = tintColor(leafBase, -0.45);
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = "rgba(255,255,255,0.15)";
            ctx.beginPath();
            ctx.arc(screen.x - 4, screen.y - 7, 5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        if (useScaledTree) ctx.restore();
      } else if (res.type === "grass") {
        const grassColor = biome.grassColor || tintColor(biome.tree, 0.25);
        if (biome.key === "temperate") {
          ctx.strokeStyle = tintColor(grassColor, -0.12);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(screen.x - 6, screen.y + 10);
          ctx.lineTo(screen.x - 2, screen.y - 2);
          ctx.moveTo(screen.x, screen.y + 11);
          ctx.lineTo(screen.x + 1, screen.y - 6);
          ctx.moveTo(screen.x + 6, screen.y + 10);
          ctx.lineTo(screen.x + 3, screen.y - 3);
          ctx.stroke();
          ctx.fillStyle = "rgba(220,255,232,0.2)";
          ctx.beginPath();
          ctx.arc(screen.x + 1, screen.y + 2, 4, 0, Math.PI * 2);
          ctx.fill();
        } else if (biome.key === "jungle") {
          ctx.strokeStyle = tintColor(grassColor, -0.2);
          ctx.lineWidth = 2.4;
          ctx.beginPath();
          ctx.moveTo(screen.x - 7, screen.y + 10);
          ctx.quadraticCurveTo(screen.x - 5, screen.y + 2, screen.x - 1, screen.y - 6);
          ctx.moveTo(screen.x + 7, screen.y + 10);
          ctx.quadraticCurveTo(screen.x + 5, screen.y + 2, screen.x + 1, screen.y - 7);
          ctx.moveTo(screen.x - 1, screen.y + 11);
          ctx.lineTo(screen.x + 1, screen.y - 8);
          ctx.stroke();
          ctx.fillStyle = tintColor(grassColor, 0.28);
          ctx.beginPath();
          ctx.ellipse(screen.x - 4, screen.y + 2, 4, 7, -0.3, 0, Math.PI * 2);
          ctx.ellipse(screen.x + 4, screen.y + 2, 4, 7, 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (biome.key === "snow") {
          ctx.strokeStyle = tintColor(grassColor, -0.05);
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(screen.x - 5, screen.y + 10);
          ctx.lineTo(screen.x - 3, screen.y + 1);
          ctx.moveTo(screen.x, screen.y + 10);
          ctx.lineTo(screen.x, screen.y - 1);
          ctx.moveTo(screen.x + 5, screen.y + 10);
          ctx.lineTo(screen.x + 3, screen.y + 1);
          ctx.stroke();
          ctx.fillStyle = "rgba(240, 250, 255, 0.5)";
          ctx.beginPath();
          ctx.arc(screen.x - 1, screen.y + 2, 3, 0, Math.PI * 2);
          ctx.fill();
        } else if (biome.key === "volcanic") {
          ctx.strokeStyle = tintColor(grassColor, -0.28);
          ctx.lineWidth = 1.9;
          ctx.beginPath();
          ctx.moveTo(screen.x - 5, screen.y + 10);
          ctx.lineTo(screen.x - 3, screen.y + 2);
          ctx.moveTo(screen.x + 1, screen.y + 10);
          ctx.lineTo(screen.x + 1, screen.y + 1);
          ctx.moveTo(screen.x + 6, screen.y + 10);
          ctx.lineTo(screen.x + 4, screen.y + 3);
          ctx.stroke();
          ctx.fillStyle = "rgba(220, 120, 86, 0.16)";
          ctx.fillRect(screen.x - 2, screen.y + 5, 2, 2);
          ctx.fillRect(screen.x + 3, screen.y + 4, 2, 2);
        } else if (biome.key === "mangrove") {
          ctx.strokeStyle = tintColor(grassColor, -0.18);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(screen.x - 7, screen.y + 10);
          ctx.quadraticCurveTo(screen.x - 8, screen.y + 2, screen.x - 4, screen.y - 3);
          ctx.moveTo(screen.x - 1, screen.y + 11);
          ctx.quadraticCurveTo(screen.x - 1, screen.y + 2, screen.x + 1, screen.y - 4);
          ctx.moveTo(screen.x + 6, screen.y + 10);
          ctx.quadraticCurveTo(screen.x + 8, screen.y + 1, screen.x + 4, screen.y - 3);
          ctx.stroke();
          ctx.fillStyle = "rgba(176, 146, 102, 0.24)";
          ctx.beginPath();
          ctx.ellipse(screen.x, screen.y + 9, 7, 2.2, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (biome.key === "redwood") {
          ctx.strokeStyle = tintColor(grassColor, -0.2);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(screen.x - 6, screen.y + 10);
          ctx.lineTo(screen.x - 4, screen.y + 2);
          ctx.moveTo(screen.x - 2, screen.y + 10);
          ctx.lineTo(screen.x - 1, screen.y - 1);
          ctx.moveTo(screen.x + 2, screen.y + 10);
          ctx.lineTo(screen.x + 3, screen.y - 2);
          ctx.moveTo(screen.x + 6, screen.y + 10);
          ctx.lineTo(screen.x + 5, screen.y + 2);
          ctx.stroke();
          ctx.fillStyle = tintColor(grassColor, 0.22);
          ctx.beginPath();
          ctx.moveTo(screen.x - 6, screen.y + 8);
          ctx.lineTo(screen.x, screen.y + 3);
          ctx.lineTo(screen.x + 6, screen.y + 8);
          ctx.closePath();
          ctx.fill();
        } else if (biome.key === "ashlands") {
          ctx.strokeStyle = tintColor(grassColor, -0.35);
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(screen.x - 4, screen.y + 10);
          ctx.lineTo(screen.x - 3, screen.y + 3);
          ctx.moveTo(screen.x, screen.y + 10);
          ctx.lineTo(screen.x + 1, screen.y + 1);
          ctx.moveTo(screen.x + 4, screen.y + 10);
          ctx.lineTo(screen.x + 3, screen.y + 4);
          ctx.stroke();
          ctx.fillStyle = "rgba(208, 206, 202, 0.2)";
          ctx.fillRect(screen.x - 5, screen.y + 8, 10, 2);
        } else if (biome.key === "marsh") {
          ctx.strokeStyle = tintColor(grassColor, -0.2);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(screen.x - 6, screen.y + 10);
          ctx.quadraticCurveTo(screen.x - 5, screen.y + 2, screen.x - 2, screen.y - 6);
          ctx.moveTo(screen.x - 1, screen.y + 11);
          ctx.quadraticCurveTo(screen.x, screen.y + 2, screen.x + 1, screen.y - 7);
          ctx.moveTo(screen.x + 5, screen.y + 10);
          ctx.quadraticCurveTo(screen.x + 5, screen.y + 2, screen.x + 3, screen.y - 5);
          ctx.stroke();
          ctx.fillStyle = "rgba(143, 211, 174, 0.2)";
          ctx.beginPath();
          ctx.ellipse(screen.x + 1, screen.y + 5, 5, 2.5, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (biome.key === "mushroom") {
          ctx.fillStyle = "rgba(226, 151, 232, 0.22)";
          ctx.beginPath();
          ctx.ellipse(screen.x, screen.y + 8, 7, 2.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = "rgba(106, 56, 124, 0.76)";
          ctx.lineWidth = 1.7;
          ctx.beginPath();
          ctx.moveTo(screen.x - 5, screen.y + 10);
          ctx.quadraticCurveTo(screen.x - 5, screen.y + 2, screen.x - 1, screen.y - 4);
          ctx.moveTo(screen.x + 1, screen.y + 10);
          ctx.quadraticCurveTo(screen.x + 1, screen.y + 1, screen.x + 2, screen.y - 5);
          ctx.moveTo(screen.x + 5, screen.y + 10);
          ctx.quadraticCurveTo(screen.x + 6, screen.y + 2, screen.x + 4, screen.y - 2);
          ctx.stroke();
          ctx.fillStyle = "rgba(246, 228, 255, 0.55)";
          ctx.beginPath();
          ctx.arc(screen.x - 1, screen.y + 2, 1.5, 0, Math.PI * 2);
          ctx.arc(screen.x + 3, screen.y + 4, 1.1, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = tintColor(grassColor, -0.15);
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(screen.x - 6, screen.y + 10);
          ctx.lineTo(screen.x - 2, screen.y - 2);
          ctx.moveTo(screen.x, screen.y + 11);
          ctx.lineTo(screen.x + 1, screen.y - 6);
          ctx.moveTo(screen.x + 6, screen.y + 10);
          ctx.lineTo(screen.x + 3, screen.y - 3);
          ctx.stroke();
        }
      } else if (res.type === "biomeStone") {
        const color = biome.stoneColor ?? "#c9c3b0";
        ctx.fillStyle = tintColor(color, 0.05);
        ctx.beginPath();
        ctx.moveTo(screen.x, screen.y - 12);
        ctx.lineTo(screen.x + 10, screen.y - 2);
        ctx.lineTo(screen.x + 6, screen.y + 10);
        ctx.lineTo(screen.x - 6, screen.y + 10);
        ctx.lineTo(screen.x - 10, screen.y - 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = tintColor(color, -0.35);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,0.25)";
        ctx.beginPath();
        ctx.moveTo(screen.x - 2, screen.y - 8);
        ctx.lineTo(screen.x + 4, screen.y - 2);
        ctx.lineTo(screen.x, screen.y + 4);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        const oreKind = res.oreKind || "iron_ore";
        const oreColor = ORE_COLORS[oreKind] || "#8d5aa3";
        const color = state.inCave
          ? res.type === "ore"
            ? oreColor
            : "#6f6f78"
          : res.type === "ore"
            ? oreColor
            : (res.dropOverride === "coal" ? "#3b4049" : biome.rock);
        ctx.fillStyle = color;
        ctx.arc(screen.x, screen.y, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = tintColor(color, 0.25);
        ctx.beginPath();
        ctx.arc(screen.x - 4, screen.y - 4, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = tintColor(color, -0.2);
        ctx.beginPath();
        ctx.arc(screen.x + 4, screen.y + 5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = tintColor(color, -0.35);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        if (res.type === "ore") {
          ctx.fillStyle = tintColor(color, 0.35);
          ctx.beginPath();
          ctx.arc(screen.x - 4, screen.y - 2, 3, 0, Math.PI * 2);
          ctx.arc(screen.x + 3, screen.y + 1, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,0.25)";
          ctx.beginPath();
          ctx.arc(screen.x + 1, screen.y - 5, 2, 0, Math.PI * 2);
          ctx.fill();
          if (oreKind === "diamond" || oreKind === "emerald") {
            ctx.strokeStyle = "rgba(230, 255, 255, 0.55)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(screen.x - 5, screen.y + 1);
            ctx.lineTo(screen.x + 5, screen.y - 4);
            ctx.stroke();
          }
        } else {
          ctx.strokeStyle = tintColor(color, 0.2);
          ctx.beginPath();
          ctx.moveTo(screen.x - 6, screen.y);
          ctx.lineTo(screen.x - 1, screen.y - 4);
          ctx.lineTo(screen.x + 5, screen.y - 1);
          ctx.stroke();
        }
      }

      if (res.hitTimer > 0) {
        ctx.strokeStyle = COLORS.highlight;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (!state.inCave) {
      for (const animal of state.world.animals || []) {
        drawAnimal(animal, camera);
      }
      for (const villager of state.world.villagers || []) {
        drawVillager(villager, camera);
      }
    }

    for (const monster of state.world.monsters || []) {
      drawMonster(monster, camera);
    }

    drawMonsterBurnEffects(state.world, camera);

    for (const projectile of state.world.projectiles || []) {
      drawProjectile(projectile, camera);
    }

    if (!state.inCave) {
      for (const structure of state.structures) {
        if (structure.removed) continue;
        if (
          structure.type !== "floor"
          && structure.type !== "village_path"
          && structure.type !== "brick_floor"
          && structure.type !== "bridge"
          && structure.type !== "dock"
        ) {
          drawStructure(structure, camera);
        }
      }
    } else if (state.activeCave?.world?.entrance) {
      const entrance = state.activeCave.world.entrance;
      const screenX = entrance.tx * CONFIG.tileSize - camera.x;
      const screenY = entrance.ty * CONFIG.tileSize - camera.y;
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screenX + CONFIG.tileSize / 2, screenY + CONFIG.tileSize / 2, 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (const drop of state.world.drops || []) {
      const screen = worldToScreen(drop.x, drop.y, camera);
      if (
        screen.x < -20 ||
        screen.y < -20 ||
        screen.x > viewWidth + 20 ||
        screen.y > viewHeight + 20
      ) {
        continue;
      }
      const color = ITEMS[drop.itemId]?.color ?? "#fff";
      const ttl = Number.isFinite(drop.ttl) ? drop.ttl : DROP_DESPAWN.lifetime;
      const warningAmount = clamp(
        (DROP_DESPAWN.warningStart - ttl) / DROP_DESPAWN.warningStart,
        0,
        1
      );
      const criticalAmount = clamp(
        (DROP_DESPAWN.criticalStart - ttl) / DROP_DESPAWN.criticalStart,
        0,
        1
      );
      const pulse = 0.5 + (0.5 * Math.sin((performance.now() * 0.02) + ((drop.id ?? 0) * 0.73)));
      const baseAlpha = 1 - (warningAmount * 0.3) - (criticalAmount * 0.2);
      const flickerAlpha = criticalAmount > 0 ? (0.45 + (pulse * 0.55)) : 1;
      const drawAlpha = clamp(baseAlpha * flickerAlpha, 0.18, 1);
      const sizeScale = 1 - (warningAmount * 0.08) - (criticalAmount * (0.08 + ((1 - pulse) * 0.06)));
      const itemRadius = 6 * sizeScale;
      const shadowRadiusX = 7 * sizeScale;
      const shadowRadiusY = 3 * sizeScale;

      ctx.save();
      ctx.globalAlpha = drawAlpha;
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.beginPath();
      ctx.ellipse(screen.x, screen.y + 6, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, itemRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(screen.x - (2 * sizeScale), screen.y - (2 * sizeScale), Math.max(1.4, 2 * sizeScale), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (warningAmount > 0) {
        const ringAlpha = clamp(0.08 + (warningAmount * 0.2) + (criticalAmount * 0.26), 0, 0.66);
        const ringRadius = (9 + (warningAmount * 2)) * (1 + (criticalAmount * pulse * 0.25));
        ctx.strokeStyle = `rgba(255, 241, 188, ${ringAlpha})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (
      state.targetResource
      && !state.targetResource.removed
      && (!state.targetResource.stage || state.targetResource.stage === "alive")
    ) {
      const screen = worldToScreen(state.targetResource.x, state.targetResource.y, camera);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (state.targetMonster) {
      const targetPos = getEntityWorldPosition(state.targetMonster, netIsClient());
      if (targetPos) {
        const screen = worldToScreen(targetPos.x, targetPos.y, camera);
        ctx.strokeStyle = "rgba(255, 80, 80, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, 18, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    if (state.targetAnimal) {
      const targetPos = getEntityWorldPosition(state.targetAnimal, netIsClient());
      if (targetPos) {
        const screen = worldToScreen(targetPos.x, targetPos.y, camera);
        ctx.strokeStyle = "rgba(255, 180, 100, 0.8)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(screen.x, screen.y, 16, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    drawRobotInteractionHighlight(camera);

    const placement = getPlacementItem();
    if (placement) {
      const { tx, ty } = getPlacementTile();
      if (inBounds(tx, ty, state.world.size)) {
        const placeResult = canPlaceItem(placement.itemId, tx, ty);
        const valid = placeResult.ok;

        const previewType = (
          isHouseType(placement.itemDef.placeType)
          || placement.itemDef.placeType === "abandoned_ship"
        )
          ? placement.itemDef.placeType
          : null;
        const anchorTx = (placeResult.upgradeHouse && placeResult.targetHouse)
          ? placeResult.targetHouse.tx
          : (Number.isInteger(placeResult.anchorTx) ? placeResult.anchorTx : tx);
        const anchorTy = (placeResult.upgradeHouse && placeResult.targetHouse)
          ? placeResult.targetHouse.ty
          : (Number.isInteger(placeResult.anchorTy) ? placeResult.anchorTy : ty);
        const footprint = previewType ? getStructureFootprint(previewType) : { w: 1, h: 1 };

        forEachStructureFootprintTile(previewType || "single", anchorTx, anchorTy, (fx, fy) => {
          const screenX = fx * CONFIG.tileSize - camera.x;
          const screenY = fy * CONFIG.tileSize - camera.y;
          ctx.fillStyle = valid ? "rgba(120, 210, 255, 0.25)" : "rgba(240, 80, 80, 0.25)";
          ctx.fillRect(screenX, screenY, CONFIG.tileSize, CONFIG.tileSize);
          ctx.strokeStyle = valid ? "rgba(120, 210, 255, 0.8)" : "rgba(240, 80, 80, 0.8)";
          ctx.lineWidth = 2;
          ctx.strokeRect(screenX + 2, screenY + 2, CONFIG.tileSize - 4, CONFIG.tileSize - 4);
        });

        if (placeResult.upgradeHouse && placeResult.targetHouse && isHouseType(placement.itemDef.placeType)) {
          const tier = getHouseTier(placement.itemDef.placeType);
          const screenX = anchorTx * CONFIG.tileSize - camera.x;
          const screenY = anchorTy * CONFIG.tileSize - camera.y;
          const previewW = tier.width * 8;
          const previewH = tier.height * 8;
          ctx.fillStyle = "rgba(255, 230, 160, 0.2)";
          ctx.fillRect(
            screenX + (CONFIG.tileSize * footprint.w) / 2 - previewW / 2,
            screenY + (CONFIG.tileSize * footprint.h) / 2 - previewH / 2,
            previewW,
            previewH
          );
          ctx.strokeStyle = "rgba(255, 230, 160, 0.8)";
          ctx.strokeRect(
            screenX + (CONFIG.tileSize * footprint.w) / 2 - previewW / 2,
            screenY + (CONFIG.tileSize * footprint.h) / 2 - previewH / 2,
            previewW,
            previewH
          );
          ctx.font = "12px Trebuchet MS";
          ctx.fillStyle = "rgba(255,245,220,0.9)";
          ctx.textAlign = "center";
          ctx.fillText(
            `Interior ${tier.width}x${tier.height}`,
            screenX + (CONFIG.tileSize * footprint.w) / 2,
            screenY - 10
          );
        }
      }
    }

    drawPlayer(camera);
    drawRemotePlayers(camera);

    if (state.inCave) {
      drawCaveDarkness(camera);
    } else if (state.isNight && !state.gameWon) {
      ctx.fillStyle = "rgba(8, 14, 24, 0.4)";
      ctx.fillRect(0, 0, viewWidth, viewHeight);
      drawNightLighting(camera);
    }

    drawBeaconBeam(camera);
    drawRescueSequence(camera);
    drawGuidanceMapOverlay();
    drawDebugWorldMiniMapOverlay();
  }

  function gameLoop() {
    let lastTime = performance.now();

    function frame(time) {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      try {
        update(dt);
        render();
      } catch (err) {
        console.error("Frame runtime error", err);
        state.respawnLock = false;
        if (state.player && state.player.hp <= 0) {
          const surface = state.surfaceWorld || state.world;
          if (surface) {
            removePlayerFromAllShips(getLocalShipPlayerId());
            state.inCave = false;
            state.activeCave = null;
            state.world = surface;
            const respawnPos = getPlayerRespawnPosition(state.player, surface);
            state.player.x = respawnPos.x;
            state.player.y = respawnPos.y;
            state.player.hp = state.player.maxHp;
            state.player.invincible = 1;
            setPlayerCheckpoint(state.player, surface, state.player.x, state.player.y, true);
            resetInputStateAfterRespawn();
            updateHealthUI();
          }
        }
      }
      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    viewWidth = window.innerWidth;
    viewHeight = window.innerHeight;
    canvas.width = viewWidth * dpr;
    canvas.height = viewHeight * dpr;
    canvas.style.width = `${viewWidth}px`;
    canvas.style.height = `${viewHeight}px`;
  }

  function isTouchPointerType(pointerType) {
    return pointerType === "touch" || pointerType === "pen";
  }

  function setStickVisualCenter(centerX, centerY) {
    if (!stickEl) return;
    const rect = stickEl.getBoundingClientRect();
    const size = rect.width || 120;
    stickEl.style.left = `${centerX - size * 0.5}px`;
    stickEl.style.top = `${centerY - size * 0.5}px`;
    stickEl.style.bottom = "auto";
  }

  function resetStickVisualPosition() {
    if (!stickEl) return;
    stickEl.style.left = "";
    stickEl.style.top = "";
    stickEl.style.bottom = "";
  }

  function resetTouchInput() {
    touch.active = false;
    touch.pointerId = null;
    touch.dx = 0;
    touch.dy = 0;
    if (stickKnobEl) {
      stickKnobEl.style.transform = "translate(0px, 0px)";
    }
    resetStickVisualPosition();
  }

  function handleStickDown(event) {
    if (touch.active && event.pointerId !== touch.pointerId) return;
    ensureAudioContext();
    touch.active = true;
    touch.pointerId = event.pointerId;
    if (movePadEl && event.currentTarget === movePadEl) {
      touch.centerX = event.clientX;
      touch.centerY = event.clientY;
      setStickVisualCenter(touch.centerX, touch.centerY);
    } else {
      const rect = stickEl.getBoundingClientRect();
      touch.centerX = rect.left + rect.width / 2;
      touch.centerY = rect.top + rect.height / 2;
    }
    updateStick(event.clientX, event.clientY);
    if (event.currentTarget && typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
  }

  function updateStick(x, y) {
    const dx = x - touch.centerX;
    const dy = y - touch.centerY;
    const dist = Math.hypot(dx, dy);
    const clamped = dist > TOUCH_STICK_MAX_DIST ? TOUCH_STICK_MAX_DIST / dist : 1;
    const nx = dx * clamped;
    const ny = dy * clamped;
    stickKnobEl.style.transform = `translate(${nx}px, ${ny}px)`;
    touch.dx = nx / TOUCH_STICK_MAX_DIST;
    touch.dy = ny / TOUCH_STICK_MAX_DIST;
  }

  function handleStickMove(event) {
    if (!touch.active || event.pointerId !== touch.pointerId) return;
    updateStick(event.clientX, event.clientY);
    event.preventDefault();
  }

  function handleStickUp(event) {
    if (touch.pointerId === null || event.pointerId !== touch.pointerId) return;
    if (
      event.currentTarget
      && typeof event.currentTarget.hasPointerCapture === "function"
      && event.currentTarget.hasPointerCapture(event.pointerId)
      && typeof event.currentTarget.releasePointerCapture === "function"
    ) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    resetTouchInput();
    event.preventDefault();
  }

  function handleCanvasMove(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    if (
      state.debugIslandDrag
      && (state.debugIslandDrag.pointerId === null || state.debugIslandDrag.pointerId === event.pointerId)
    ) {
      updateDebugIslandDragPreview(event.clientX, event.clientY);
      event.preventDefault();
    }
  }

  function handleCanvasLeave() {
    pointer.active = false;
  }

  function handleCanvasUp(event) {
    if (
      event.currentTarget
      && typeof event.currentTarget.hasPointerCapture === "function"
      && event.currentTarget.hasPointerCapture(event.pointerId)
      && typeof event.currentTarget.releasePointerCapture === "function"
    ) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch (err) {
        // ignore pointer capture release failures
      }
    }
    if (commitDebugIslandDrag(event)) {
      event.preventDefault();
    }
  }

  function handleCanvasCancel(event) {
    if (
      event.currentTarget
      && typeof event.currentTarget.hasPointerCapture === "function"
      && event.currentTarget.hasPointerCapture(event.pointerId)
      && typeof event.currentTarget.releasePointerCapture === "function"
    ) {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch (err) {
        // ignore pointer capture release failures
      }
    }
    if (state.debugIslandDrag) {
      state.debugIslandDrag = null;
      event.preventDefault();
    }
  }

  function shouldProcessMobileTapAction(event) {
    if (!event || !isTouchPointerType(event.pointerType)) return false;
    if (!state.player || !state.world || state.gameWon) return false;
    if (inventoryOpen || state.activeStation || state.activeChest) return false;
    if (state.player.inHut) return false;
    return true;
  }

  function setPlayerFacingToward(targetX, targetY) {
    const dx = targetX - state.player.x;
    const dy = targetY - state.player.y;
    const len = Math.hypot(dx, dy);
    if (len <= 0.0001) return;
    state.player.facing.x = dx / len;
    state.player.facing.y = dy / len;
  }

  function tryMobileTapAction(screenX, screenY) {
    const combatWorld = getCombatWorld();
    if (!combatWorld || !state.player) return false;
    const preferRenderTargets = netIsClient();

    const worldPos = screenToWorld(screenX, screenY);
    const tapRange = CONFIG.tileSize * 0.92;
    const candidates = [];

    const monster = findNearestMonsterAt(combatWorld, worldPos, tapRange, preferRenderTargets);
    if (monster) {
      const monsterPos = getEntityWorldPosition(monster, preferRenderTargets);
      if (monsterPos) {
        candidates.push({
          kind: "monster",
          target: monster,
          targetX: monsterPos.x,
          targetY: monsterPos.y,
          dist: Math.hypot(monsterPos.x - worldPos.x, monsterPos.y - worldPos.y),
          priority: 0,
        });
      }
    }

    const animal = findNearestAnimalAt(combatWorld, worldPos, tapRange, preferRenderTargets);
    if (animal) {
      const animalPos = getEntityWorldPosition(animal, preferRenderTargets);
      if (animalPos) {
        candidates.push({
          kind: "animal",
          target: animal,
          targetX: animalPos.x,
          targetY: animalPos.y,
          dist: Math.hypot(animalPos.x - worldPos.x, animalPos.y - worldPos.y),
          priority: 1,
        });
      }
    }

    const resource = findNearestResourceAt(combatWorld, worldPos, tapRange);
    if (resource) {
      candidates.push({
        kind: "resource",
        target: resource,
        dist: Math.hypot(resource.x - worldPos.x, resource.y - worldPos.y),
        priority: 2,
      });
    }

    if (candidates.length === 0) return false;
    candidates.sort((a, b) => {
      if (a.dist !== b.dist) return a.dist - b.dist;
      return a.priority - b.priority;
    });
    const selected = candidates[0];
    const target = selected.target;
    if (!target) return false;
    const targetX = Number.isFinite(selected.targetX) ? selected.targetX : target.x;
    const targetY = Number.isFinite(selected.targetY) ? selected.targetY : target.y;

    setPlayerFacingToward(targetX, targetY);
    const maxRange = selected.kind === "resource" ? CONFIG.interactRange : MONSTER.attackRange + 8;
    const distToPlayer = Math.hypot(targetX - state.player.x, targetY - state.player.y);
    if (distToPlayer > maxRange) {
      setPrompt("Move closer", 0.65);
      return true;
    }

    if (selected.kind === "resource") {
      attemptHarvest(target);
      return true;
    }

    performAttack({ x: targetX, y: targetY });
    return true;
  }

  function handleDebugWorldMiniMapClick(event) {
    if (!state.debugUnlocked || !state.debugWorldMapVisible) return false;
    const layout = getDebugWorldMiniMapLayout();
    if (!layout) return false;
    const {
      panelX,
      panelY,
      panelW,
      panelH,
      mapX,
      mapY,
      mapW,
      mapH,
      toggleX,
      toggleY,
      toggleW,
      toggleH,
    } = layout;
    const x = event.clientX;
    const y = event.clientY;
    if (!isPointInRect(x, y, panelX, panelY, panelW, panelH)) {
      return false;
    }
    if (isPointInRect(x, y, toggleX, toggleY, toggleW, toggleH)) {
      toggleDebugAbandonedRobotMarker();
      return true;
    }
    if (isPointInRect(x, y, mapX, mapY, mapW, mapH) && state.debugContinentalShift) {
      return startDebugIslandDrag(event, layout);
    }
    return true;
  }

  function handleCanvasDown(event) {
    ensureAudioContext();
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
    if (handleDebugWorldMiniMapClick(event)) {
      event.preventDefault();
      return;
    }
    const placement = getPlacementItem();
    if (placement) {
      attemptPlace();
      return;
    }
    if (shouldProcessMobileTapAction(event) && tryMobileTapAction(event.clientX, event.clientY)) {
      event.preventDefault();
    }
  }

  function setupMobileZoomLock() {
    const hasTouch = "ontouchstart" in window || (navigator.maxTouchPoints || 0) > 0;
    if (!hasTouch) return;

    let lastTouchEndMs = 0;
    document.addEventListener(
      "touchend",
      (event) => {
        const now = performance.now();
        if (now - lastTouchEndMs < 320) {
          event.preventDefault();
        }
        lastTouchEndMs = now;
      },
      { passive: false }
    );

    document.addEventListener(
      "touchmove",
      (event) => {
        if ((event.touches?.length || 0) > 1) {
          event.preventDefault();
        }
      },
      { passive: false }
    );

    const blockGesture = (event) => {
      event.preventDefault();
    };
    document.addEventListener("gesturestart", blockGesture, { passive: false });
    document.addEventListener("gesturechange", blockGesture, { passive: false });
    document.addEventListener("gestureend", blockGesture, { passive: false });
  }

  function init() {
    loadUserSettings();
    setupSlots();
    setupMobileZoomLock();
    resize();
    if (startScreen) startScreen.classList.remove("hidden");
    setSettingsTab("settings");
    updateVolumeUI();
    setDebugUnlocked(state.debugUnlocked, false);
    updateDebugSpeedUI();
    updateDebugWorldSpeedUI();
    updateMosesButton();
    updateInfiniteResourcesButton();
    if (settingsPanel) settingsPanel.classList.add("hidden");

    window.addEventListener("resize", resize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("beforeunload", saveGame);

    const stickInputTarget = movePadEl || stickEl;
    if (stickInputTarget) {
      stickInputTarget.addEventListener("pointerdown", handleStickDown);
      stickInputTarget.addEventListener("pointermove", handleStickMove);
      stickInputTarget.addEventListener("pointerup", handleStickUp);
      stickInputTarget.addEventListener("pointercancel", handleStickUp);
    }

    actionBtn.addEventListener("pointerdown", () => {
      ensureAudioContext();
      interactPressed = true;
    });
    if (attackBtn) {
      attackBtn.addEventListener("pointerdown", () => {
        ensureAudioContext();
        attackPressed = true;
      });
    }
    if (inventoryBtn) {
      inventoryBtn.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        ensureAudioContext();
        toggleInventory();
      });
    }
    if (dropBtn) {
      dropBtn.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        ensureAudioContext();
        dropSelectedItem();
      });
    }

    canvas.addEventListener("pointermove", handleCanvasMove);
    canvas.addEventListener("pointerleave", handleCanvasLeave);
    canvas.addEventListener("pointerdown", handleCanvasDown);
    canvas.addEventListener("pointerup", handleCanvasUp);
    canvas.addEventListener("pointercancel", handleCanvasCancel);

    buildCategoryIcons.forEach((icon) => {
      applyItemVisual(icon, icon.dataset.icon, true);
    });
    buildCategoryTabs.forEach((tab) => {
      const categoryId = tab.dataset.category;
      const preview = () => setBuildCategoryHint(categoryId);
      const restore = () => setBuildCategoryHint(buildCategory);
      tab.addEventListener("click", () => setBuildCategory(categoryId, true));
      tab.addEventListener("mouseenter", preview);
      tab.addEventListener("focus", preview);
      tab.addEventListener("mouseleave", restore);
      tab.addEventListener("blur", restore);
    });
    setBuildCategory(buildCategory, false);

    destroyChestBtn.addEventListener("click", destroyActiveChest);
    if (shipRepairBtn) {
      shipRepairBtn.addEventListener("click", () => {
        ensureAudioContext();
        if (state.activeShipRepair) {
          requestRepairAbandonedShip(state.activeShipRepair);
        }
      });
    }
    if (shipRepairCloseBtn) {
      shipRepairCloseBtn.addEventListener("click", () => {
        closeShipRepairPanel();
      });
    }
    if (newRunBtn) {
      newRunBtn.addEventListener("click", () => {
        promptNewSeed();
      });
    }
    if (startScreen) {
      startScreen.addEventListener("pointerdown", () => {
        ensureAudioContext();
      });
    }
    if (soloBtn) soloBtn.addEventListener("click", () => {
      ensureAudioContext();
      startSolo();
    });
    if (hostBtn) hostBtn.addEventListener("click", () => {
      ensureAudioContext();
      startHost();
    });
    if (joinBtn) joinBtn.addEventListener("click", () => {
      ensureAudioContext();
      startJoin();
    });
    if (seedDisplay) {
      seedDisplay.addEventListener("click", () => {
        ensureAudioContext();
        promptNewSeed();
      });
      seedDisplay.title = "Click to switch seed";
    }
    if (settingsToggle) {
      settingsToggle.addEventListener("click", () => {
        ensureAudioContext();
        toggleSettingsPanel();
      });
    }
    if (settingsTabBtn) settingsTabBtn.addEventListener("click", () => setSettingsTab("settings"));
    if (objectivesTabBtn) objectivesTabBtn.addEventListener("click", () => setSettingsTab("objectives"));
    if (musicVolumeInput) {
      musicVolumeInput.addEventListener("input", () => {
        ensureAudioContext();
        setMusicVolumeFromPercent(musicVolumeInput.value);
      });
    }
    if (sfxVolumeInput) {
      sfxVolumeInput.addEventListener("input", () => {
        ensureAudioContext();
        setSfxVolumeFromPercent(sfxVolumeInput.value);
      });
    }
    if (debugSpeedInput) {
      debugSpeedInput.addEventListener("input", () => {
        setDebugSpeedFromPercent(debugSpeedInput.value);
      });
    }
    if (debugWorldSpeedInput) {
      debugWorldSpeedInput.addEventListener("input", () => {
        setDebugWorldSpeedFromPercent(debugWorldSpeedInput.value);
      });
    }
    if (resetWorldBtn) resetWorldBtn.addEventListener("click", resetWorldFromSettings);
    if (unlockDebugBtn) unlockDebugBtn.addEventListener("click", unlockDebugFromSettings);
    if (debugToggle) debugToggle.addEventListener("click", toggleDebugMenu);
    if (giveBeaconBtn) giveBeaconBtn.addEventListener("click", giveDebugBeacon);
    if (giveRobotBtn) giveRobotBtn.addEventListener("click", giveDebugRobot);
    if (spawnCaveBtn) spawnCaveBtn.addEventListener("click", spawnDebugCaveAtPlayer);
    if (spawnVillageBtn) spawnVillageBtn.addEventListener("click", spawnDebugVillageAtPlayer);
    if (forceDayBtn) forceDayBtn.addEventListener("click", forceDebugDay);
    if (forceNightBtn) forceNightBtn.addEventListener("click", forceDebugNight);
    if (mosesBtn) mosesBtn.addEventListener("click", toggleDebugMoses);
    if (infiniteResourcesBtn) infiniteResourcesBtn.addEventListener("click", toggleInfiniteResources);
    if (debugWorldMapBtn) debugWorldMapBtn.addEventListener("click", toggleDebugWorldMap);
    if (continentalShiftBtn) continentalShiftBtn.addEventListener("click", toggleContinentalShift);
    if (debugPlaceBoatBtn) debugPlaceBoatBtn.addEventListener("click", toggleDebugPlaceRepairedBoat);
    if (toggleRobotRecallBtn) {
      toggleRobotRecallBtn.addEventListener("click", () => {
        ensureAudioContext();
        toggleBenchRobotRecall();
      });
    }
    gameLoop();
  }

  init();
})();
