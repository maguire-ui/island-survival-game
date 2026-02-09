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
  const stationMenu = document.getElementById("stationMenu");
  const stationTitle = document.getElementById("stationTitle");
  const stationOptions = document.getElementById("stationOptions");
  const chestPanel = document.getElementById("chestPanel");
  const chestPanelTitle = document.getElementById("chestPanelTitle");
  const chestPanelHint = document.getElementById("chestPanelHint");
  const chestSlotsEl = document.getElementById("chestSlots");
  const destroyChestBtn = document.getElementById("destroyChest");
  const endScreen = document.getElementById("endScreen");
  const newRunBtn = document.getElementById("newRunBtn");
  const startScreen = document.getElementById("startScreen");
  const soloBtn = document.getElementById("soloBtn");
  const hostBtn = document.getElementById("hostBtn");
  const joinBtn = document.getElementById("joinBtn");
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
  const giveBeaconBtn = document.getElementById("giveBeaconBtn");
  const giveRobotBtn = document.getElementById("giveRobotBtn");
  const spawnCaveBtn = document.getElementById("spawnCaveBtn");
  const spawnVillageBtn = document.getElementById("spawnVillageBtn");
  const forceDayBtn = document.getElementById("forceDayBtn");
  const forceNightBtn = document.getElementById("forceNightBtn");
  const mosesBtn = document.getElementById("mosesBtn");
  const infiniteResourcesBtn = document.getElementById("infiniteResourcesBtn");

  const buildTabs = Array.from(buildMenu.querySelectorAll(".tab-btn"));

  const CONFIG = {
    tileSize: 32,
    worldSize: 400,
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
    },
  };

  const NET_CONFIG = {
    snapshotInterval: 0.18,
    playerSendInterval: 0.05,
    renderSmooth: 12,
    houseSmooth: 18,
    monsterSmooth: 10,
    animalSmooth: 10,
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
    grass: 45,
  };

  const CAVE_SIZE = 28;

  const SAVE_KEY = "island_survival_save_v1";
  const SAVE_KEY_PREFIX = "island_survival_seed_save_v1:";
  const ACTIVE_SEED_KEY = "island_survival_active_seed_v1";
  const SAVE_VERSION = 5;
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
  ];

  const BIOME_STONE_ITEMS = BIOME_STONES.reduce((acc, stone) => {
    acc[stone.id] = { name: stone.name, color: stone.color };
    return acc;
  }, {});

  const BEACON_BIOME_COST = BIOME_STONES.reduce((acc, stone) => {
    acc[stone.id] = 1;
    return acc;
  }, {});

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
    grass: { name: "Grass", color: "#6ec27c" },
    paper: { name: "Paper", color: "#ebe2bf" },
    raw_meat: { name: "Raw Meat", color: "#c96a64" },
    cooked_meat: { name: "Cooked Meat", color: "#d7a172" },
    hide: { name: "Hide", color: "#9f7d57" },
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
    lantern: { name: "Lantern", color: "#cfae5d", placeable: true, placeType: "lantern" },
    torch: { name: "Torch", color: "#d99a4e" },
    medicine: { name: "Poultice", color: "#7ec98a" },
    village_map: { name: "Village Map", color: "#d0c394" },
    cave_map: { name: "Cave Map", color: "#a5b4d8" },
    beacon_core: { name: "Beacon Core", color: "#9cd0ff" },
    beacon: { name: "Rescue Beacon", color: "#d9c27a", placeable: true, placeType: "beacon" },
    smelter: { name: "Smelter", color: "#b05b5b", placeable: true, placeType: "smelter" },
    sawmill: { name: "Sawmill", color: "#7d6a46", placeable: true, placeType: "sawmill" },
    kiln: { name: "Kiln", color: "#b37d5c", placeable: true, placeType: "kiln" },
    chest: { name: "Chest", color: "#a8794a", placeable: true, placeType: "chest" },
    robot: { name: "Robot", color: "#7aa1c6", placeable: true, placeType: "robot" },
  };

  const ITEM_VISUALS = {
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
    grass: { symbol: "GRS", bg: "#2b7f4a", border: "#78cf94", fg: "#ebffef" },
    paper: { symbol: "PPR", bg: "#8e8463", border: "#d8d0b0", fg: "#fffbe9" },
    raw_meat: { symbol: "RAW", bg: "#8f403d", border: "#d47a75", fg: "#ffe1dd" },
    cooked_meat: { symbol: "FOOD", bg: "#9e5d3a", border: "#e0a77f", fg: "#fff0e2" },
    hide: { symbol: "HID", bg: "#7d603f", border: "#bc9a73", fg: "#f9e5c9" },
    bridge: { symbol: "BRG", bg: "#8a7548", border: "#d2bb82", fg: "#fff3d8" },
    village_path: { symbol: "PTH", bg: "#726243", border: "#c6ab72", fg: "#fff3d7" },
    dock: { symbol: "DCK", bg: "#7c6a43", border: "#c3aa72", fg: "#fff2d2" },
    small_house: { symbol: "HS-S", bg: "#7a4f2f", border: "#bf8e63", fg: "#ffe6cf" },
    medium_house: { symbol: "HS-M", bg: "#694327", border: "#b17f56", fg: "#ffe1c4" },
    large_house: { symbol: "HS-L", bg: "#5e3b24", border: "#a7734d", fg: "#ffdcc0" },
    bed: { symbol: "BED", bg: "#6f89a7", border: "#b7cee7", fg: "#eff7ff" },
    campfire: { symbol: "FIR", bg: "#8a3f26", border: "#d88956", fg: "#ffe5ce" },
    lantern: { symbol: "LGT", bg: "#8b7638", border: "#d6bd62", fg: "#fff8dc" },
    torch: { symbol: "TOR", bg: "#8a4d2f", border: "#d59363", fg: "#ffeada" },
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
  };

  const VILLAGE_LOOT_TABLE = [
    { id: "plank", min: 3, max: 8, weight: 22 },
    { id: "wood", min: 5, max: 12, weight: 20 },
    { id: "stone", min: 4, max: 10, weight: 18 },
    { id: "raw_meat", min: 1, max: 3, weight: 10 },
    { id: "cooked_meat", min: 1, max: 3, weight: 12 },
    { id: "medicine", min: 1, max: 2, weight: 9 },
    { id: "coal", min: 1, max: 3, weight: 8 },
    { id: "iron_ore", min: 1, max: 2, weight: 7 },
    { id: "gold_ore", min: 1, max: 1, weight: 4 },
    { id: "lantern", min: 1, max: 1, weight: 5 },
    { id: "torch", min: 1, max: 2, weight: 7 },
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
    { tier: 1, name: "Wood Sword", damage: 1 },
    { tier: 2, name: "Stone Sword", damage: 1 },
    { tier: 3, name: "Iron Sword", damage: 2 },
    { tier: 4, name: "Gold Sword", damage: 3 },
    { tier: 5, name: "Diamond Sword", damage: 5 },
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
    lantern: { name: "Lantern", color: "#cfae5d", blocking: true, walkable: false, lightRadius: 70 },
    beacon: { name: "Rescue Beacon", color: "#d9c27a", blocking: true, walkable: false, lightRadius: 120, beacon: true },
    smelter: { name: "Smelter", color: "#b05b5b", blocking: true, walkable: false, station: true },
    sawmill: { name: "Sawmill", color: "#7d6a46", blocking: true, walkable: false, station: true },
    kiln: { name: "Kiln", color: "#b37d5c", blocking: true, walkable: false, station: true },
    chest: { name: "Chest", color: "#a8794a", blocking: true, walkable: false, storage: true },
    robot: { name: "Robot", color: "#7aa1c6", blocking: false, walkable: true, station: true, storage: true },
  };

  const BUILD_RECIPES = [
    {
      id: "bridge",
      name: "Bridge",
      description: "Cross water to reach other islands.",
      cost: { wood: 4 },
    },
    {
      id: "bridge_bundle",
      icon: "bridge",
      name: "Bridge Bundle",
      description: "Craft multiple bridges at once for rapid expansion.",
      cost: { wood: 10, plank: 2 },
      output: { bridge: 3 },
    },
    {
      id: "village_path",
      name: "Path Block",
      description: "Build walkable roads to make player-made villages.",
      cost: { wood: 2, stone: 2 },
      outputQty: 6,
    },
    {
      id: "dock",
      name: "Dock",
      description: "Shoreline checkpoint anchor; bind your respawn point here.",
      cost: { wood: 3, plank: 1 },
    },
    {
      id: "small_house",
      name: "Small House",
      description: "Safe prep space with compact interior.",
      cost: { wood: 18, plank: 6, stone: 6 },
    },
    {
      id: "medium_house",
      name: "Medium House Upgrade",
      description: "Upgrade a small house to expand interior space.",
      cost: { wood: 28, plank: 12, stone: 12, hide: 4 },
    },
    {
      id: "large_house",
      name: "Large House Upgrade",
      description: "Upgrade a medium house to max interior capacity.",
      cost: { wood: 44, plank: 20, iron_ingot: 6, hide: 8 },
    },
    {
      id: "bed",
      name: "Bed",
      description: "Sleep at night to skip to dawn. No healing.",
      cost: { plank: 6, hide: 4 },
    },
    {
      id: "campfire",
      name: "Campfire",
      description: "Permanent light source for nighttime safety.",
      cost: { wood: 4, stone: 2 },
    },
    {
      id: "lantern",
      name: "Lantern",
      description: "Compact high-visibility light source.",
      cost: { plank: 2, iron_ingot: 1 },
    },
    {
      id: "torch",
      name: "Torch",
      description: "Consume to light a timed torch buff for night vision and +1 attack.",
      cost: { wood: 2, plank: 1 },
    },
    {
      id: "medicine",
      name: "Poultice",
      description: "Fast emergency healing during fights.",
      cost: { raw_meat: 1, hide: 1, wood: 1 },
    },
    {
      id: "paper_bundle",
      icon: "paper",
      name: "Hand-Pressed Paper",
      description: "Craft map paper without a sawmill (resource-inefficient).",
      cost: { grass: 6, wood: 1 },
      output: { paper: 1 },
    },
    {
      id: "chest",
      name: "Chest",
      description: "Extra storage for resources and crafted gear.",
      cost: { wood: 6, plank: 2 },
    },
    {
      id: "smelter",
      name: "Smelter",
      description: "Smelt iron/gold with coal and cook healing food.",
      cost: { stone: 8, wood: 4 },
    },
    {
      id: "sawmill",
      name: "Sawmill",
      description: "Convert logs into planks for advanced builds.",
      cost: { wood: 8, stone: 2 },
    },
    {
      id: "kiln",
      name: "Kiln",
      description: "Bake bricks used to assemble the rescue beacon.",
      cost: { stone: 6, wood: 2 },
    },
    {
      id: "village_map",
      name: "Village Map",
      description: "Shows a tracked village zone and all active players.",
      cost: { paper: 8, plank: 12, grass: 10, hide: 5, stone: 14 },
    },
    {
      id: "cave_map",
      name: "Cave Map",
      description: "Shows a tracked cave zone and all active players.",
      cost: { paper: 10, plank: 14, stone: 24, hide: 7, torch: 4, medicine: 2 },
    },
    {
      id: "beacon",
      name: "Rescue Beacon",
      description: "Ends the game for this seed. Starting this same seed again resets its progress.",
      cost: {
        beacon_core: 1,
        plank: 12,
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
      cost: { wood: 10 },
      icon: "wood",
      unlock: "pickaxe",
      track: "pickaxe",
      tier: 1,
    },
    {
      id: "unlock_stone_pickaxe",
      name: "Stone Pickaxe",
      description: "Lets you mine coal and iron ore.",
      cost: { wood: 8, stone: 8 },
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
      cost: { wood: 6, iron_ingot: 4, stone: 4 },
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
      cost: { iron_ingot: 3, gold_ingot: 4, plank: 6 },
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
      cost: { emerald: 4, gold_ingot: 5, plank: 8 },
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
      cost: { diamond: 4, emerald: 3, gold_ingot: 4, plank: 10 },
      icon: "diamond",
      unlock: "apexPickaxe",
      track: "pickaxe",
      tier: 6,
      requires: ["primalPickaxe"],
    },
    {
      id: "unlock_wood_sword",
      name: "Wood Sword",
      description: "Unlocks basic melee damage versus monsters.",
      cost: { wood: 8, plank: 2 },
      icon: "wood",
      unlock: "sword",
      track: "sword",
      tier: 1,
    },
    {
      id: "unlock_stone_sword",
      name: "Stone Sword",
      description: "Upgrades melee damage.",
      cost: { stone: 8, plank: 2 },
      icon: "stone",
      unlock: "sword2",
      track: "sword",
      tier: 2,
      requires: ["sword"],
    },
    {
      id: "unlock_iron_sword",
      name: "Iron Sword",
      description: "Strong all-purpose combat weapon.",
      cost: { iron_ingot: 4, plank: 4 },
      icon: "iron_ingot",
      unlock: "sword3",
      track: "sword",
      tier: 3,
      requires: ["sword2"],
    },
    {
      id: "unlock_gold_sword",
      name: "Gold Sword",
      description: "High burst damage for tougher nights.",
      cost: { gold_ingot: 4, iron_ingot: 2, plank: 4 },
      icon: "gold_ingot",
      unlock: "sword4",
      track: "sword",
      tier: 4,
      requires: ["sword3"],
    },
    {
      id: "unlock_diamond_sword",
      name: "Diamond Sword",
      description: "Maximum melee damage tier.",
      cost: { diamond: 4, gold_ingot: 3, plank: 5 },
      icon: "diamond",
      unlock: "sword5",
      track: "sword",
      tier: 5,
      requires: ["sword4"],
    },
  ];

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
        description: "Cooked meat restores health when consumed.",
        input: { raw_meat: 1, wood: 1 },
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
    ],
  };

  const BIOMES = [
    {
      key: "temperate",
      land: [43, 122, 61],
      tree: "#2d8a4c",
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
      rock: "#7c8a90",
      ore: "#7a4c8b",
      stoneColor: BIOME_STONES[1].color,
      sand: [207, 184, 124],
      treeRate: 0.11,
      rockRate: 0.03,
      grassRate: 0.028,
      oreRate: 0.01,
      stoneRate: 0.00055,
    },
    {
      key: "snow",
      land: [198, 214, 230],
      tree: "#e8f3ff",
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
  ];

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

  const AMBIENT_CHORDS = [
    [261.63, 329.63, 392.0],
    [293.66, 369.99, 440.0],
    [329.63, 415.3, 493.88],
    [246.94, 329.63, 392.0],
  ];
  const AMBIENT_NOTE_PATTERN = [0, 1, 2, 1, 2, 1, 0, 2];
  const SETTINGS_KEY = "island_survival_settings_v1";
  const DEBUG_PASSCODE = "123";
  const SETTINGS_DEFAULTS = Object.freeze({
    musicVolume: 0.32,
    sfxVolume: 0.62,
    debugUnlocked: false,
    debugInfiniteResources: false,
    debugSpeedMultiplier: 1,
  });
  const MAP_ITEM_SET = new Set(["village_map", "cave_map"]);
  const MAP_PANEL = Object.freeze({
    minSize: 164,
    maxSize: 238,
    screenScale: 0.23,
  });
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
    maxPathNodes: 14000,
    retargetPathChecks: 6,
    pathNodeSnapDistance: 5,
    stuckMoveEpsilon: 0.1,
    stuckRetargetTime: 1.1,
    sandStuckRetargetTime: 0.7,
  });

  let dpr = window.devicePixelRatio || 1;
  let viewWidth = window.innerWidth;
  let viewHeight = window.innerHeight;

  const keyState = new Map();
  let interactPressed = false;
  let attackPressed = false;
  let inventoryOpen = false;
  let buildTab = "buildings";
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
    torchTimer: 0,
    animalVocalTimer: 2.6,
    settingsTab: "settings",
    musicVolume: SETTINGS_DEFAULTS.musicVolume,
    sfxVolume: SETTINGS_DEFAULTS.sfxVolume,
    debugUnlocked: SETTINGS_DEFAULTS.debugUnlocked,
    debugMoses: false,
    debugInfiniteResources: SETTINGS_DEFAULTS.debugInfiniteResources,
    debugSpeedMultiplier: SETTINGS_DEFAULTS.debugSpeedMultiplier,
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
    playerTimer: NET_CONFIG.playerSendInterval,
    robotPausePingTimer: 0.2,
    localName: "",
    localColor: "",
  };

  const audio = {
    ctx: null,
    master: null,
    sfxBus: null,
    musicBus: null,
    musicGain: null,
    filter: null,
    oscA: null,
    oscB: null,
    oscC: null,
    lfo: null,
    lfoGain: null,
    noiseBuffer: null,
    chordIndex: 0,
    chordTimer: 0,
    noteTimer: 0,
    noteIndex: 0,
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

  function saveUserSettings() {
    const payload = {
      musicVolume: clampVolume(state.musicVolume, SETTINGS_DEFAULTS.musicVolume),
      sfxVolume: clampVolume(state.sfxVolume, SETTINGS_DEFAULTS.sfxVolume),
      debugUnlocked: !!state.debugUnlocked,
      debugInfiniteResources: !!state.debugInfiniteResources,
      debugSpeedMultiplier: clampDebugSpeedMultiplier(state.debugSpeedMultiplier),
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
      state.debugUnlocked = !!data.debugUnlocked;
      state.debugInfiniteResources = !!data.debugInfiniteResources;
      state.debugSpeedMultiplier = clampDebugSpeedMultiplier(data.debugSpeedMultiplier);
    } catch (err) {
      state.musicVolume = SETTINGS_DEFAULTS.musicVolume;
      state.sfxVolume = SETTINGS_DEFAULTS.sfxVolume;
      state.debugUnlocked = SETTINGS_DEFAULTS.debugUnlocked;
      state.debugInfiniteResources = SETTINGS_DEFAULTS.debugInfiniteResources;
      state.debugSpeedMultiplier = SETTINGS_DEFAULTS.debugSpeedMultiplier;
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

  function setDebugSpeedFromPercent(percent, persist = true) {
    const mult = clampDebugSpeedMultiplier((Number(percent) || 100) / 100);
    state.debugSpeedMultiplier = mult;
    updateDebugSpeedUI();
    if (persist) saveUserSettings();
  }

  function applyAudioLevels() {
    const music = clampVolume(state.musicVolume, SETTINGS_DEFAULTS.musicVolume);
    const sfx = clampVolume(state.sfxVolume, SETTINGS_DEFAULTS.sfxVolume);
    if (audio.musicBus) {
      audio.musicBus.gain.setTargetAtTime(music, audio.ctx?.currentTime || 0, 0.04);
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
      state.debugSpeedMultiplier = 1;
      if (buildMenu && !buildMenu.classList.contains("hidden")) {
        renderBuildMenu();
      }
      if (stationMenu && !stationMenu.classList.contains("hidden")) {
        renderStationMenu();
      }
    }
    updateMosesButton();
    updateInfiniteResourcesButton();
    updateDebugSpeedUI();
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

  function ensureAudioContext() {
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return null;
    if (!audio.ctx) {
      const ctx = new AudioCtor();
      const master = ctx.createGain();
      master.gain.value = 0.95;
      master.connect(ctx.destination);
      const musicBus = ctx.createGain();
      const sfxBus = ctx.createGain();
      musicBus.connect(master);
      sfxBus.connect(master);
      audio.ctx = ctx;
      audio.master = master;
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

  function stopAmbientAudio() {
    for (const key of ["oscA", "oscB", "oscC", "lfo"]) {
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
    if (audio.lfoGain) {
      try {
        audio.lfoGain.disconnect();
      } catch (err) {
        // ignore disconnect errors
      }
      audio.lfoGain = null;
    }
    if (audio.filter) {
      try {
        audio.filter.disconnect();
      } catch (err) {
        // ignore disconnect errors
      }
      audio.filter = null;
    }
    if (audio.musicGain) {
      try {
        audio.musicGain.disconnect();
      } catch (err) {
        // ignore disconnect errors
      }
      audio.musicGain = null;
    }
    audio.chordTimer = 0;
    audio.noteTimer = 0;
    audio.noteIndex = 0;
  }

  function setAmbientChord(index, glideSeconds = 2.0) {
    if (!audio.ctx || !audio.oscA || !audio.oscB || !audio.oscC) return;
    const chord = AMBIENT_CHORDS[(index % AMBIENT_CHORDS.length + AMBIENT_CHORDS.length) % AMBIENT_CHORDS.length];
    const now = audio.ctx.currentTime;
    const glide = Math.max(0.01, glideSeconds);
    audio.oscA.frequency.setTargetAtTime(chord[0], now, glide);
    audio.oscB.frequency.setTargetAtTime(chord[1], now, glide);
    audio.oscC.frequency.setTargetAtTime(chord[2] * 0.5, now, glide);
    if (audio.filter) {
      const target = clamp(1650 + chord[1] * 0.8, 1650, 3600);
      audio.filter.frequency.setTargetAtTime(target, now, glide * 0.7);
    }
  }

  function startAmbientAudio() {
    if (!audio.ctx || !audio.musicBus) return;
    stopAmbientAudio();
    const ctx = audio.ctx;
    const now = ctx.currentTime;
    const musicGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2500;
    filter.Q.value = 0.55;
    musicGain.gain.setValueAtTime(0.0001, now);
    musicGain.gain.exponentialRampToValueAtTime(0.028, now + 1.8);
    filter.connect(musicGain);
    musicGain.connect(audio.musicBus);

    const oscA = ctx.createOscillator();
    const oscB = ctx.createOscillator();
    const oscC = ctx.createOscillator();
    oscA.type = "triangle";
    oscB.type = "sine";
    oscC.type = "triangle";
    oscA.detune.value = 3;
    oscB.detune.value = -2;
    oscC.detune.value = -5;

    const voiceA = ctx.createGain();
    const voiceB = ctx.createGain();
    const voiceC = ctx.createGain();
    voiceA.gain.value = 0.2;
    voiceB.gain.value = 0.16;
    voiceC.gain.value = 0.14;

    oscA.connect(voiceA);
    oscB.connect(voiceB);
    oscC.connect(voiceC);
    voiceA.connect(filter);
    voiceB.connect(filter);
    voiceC.connect(filter);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.type = "sine";
    lfo.frequency.value = 0.2;
    lfoGain.gain.value = 0.0038;
    lfo.connect(lfoGain);
    lfoGain.connect(musicGain.gain);

    audio.musicGain = musicGain;
    audio.filter = filter;
    audio.oscA = oscA;
    audio.oscB = oscB;
    audio.oscC = oscC;
    audio.lfo = lfo;
    audio.lfoGain = lfoGain;
    audio.chordIndex = Math.floor(Math.random() * AMBIENT_CHORDS.length);
    audio.chordTimer = 5 + Math.random() * 3;
    audio.noteTimer = 0.2;
    audio.noteIndex = 0;
    setAmbientChord(audio.chordIndex, 0.03);

    oscA.start(now);
    oscB.start(now);
    oscC.start(now);
    lfo.start(now);
  }

  function triggerAmbientNote() {
    if (!audio.ctx || !audio.musicBus) return;
    const chord = AMBIENT_CHORDS[audio.chordIndex % AMBIENT_CHORDS.length];
    const notePick = AMBIENT_NOTE_PATTERN[audio.noteIndex % AMBIENT_NOTE_PATTERN.length];
    const freq = chord[notePick] * 2;
    const now = audio.ctx.currentTime;
    const osc = audio.ctx.createOscillator();
    const gain = audio.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.985, now + 0.2);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28);
    osc.connect(gain);
    gain.connect(audio.musicBus);
    osc.start(now);
    osc.stop(now + 0.32);
    audio.noteIndex += 1;
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
    playSfx(animal.type === "goat" ? "animalBaa" : "animalMoo");
    state.animalVocalTimer = 3.6 + Math.random() * 4.8;
  }

  function updateAudio(dt) {
    if (!audio.ctx || !audio.enabled) return;
    if (!state.player || state.gameWon) {
      stopAmbientAudio();
      return;
    }
    if (startScreen && !startScreen.classList.contains("hidden")) {
      stopAmbientAudio();
      return;
    }
    if (!audio.oscA || !audio.oscB || !audio.oscC || !audio.musicGain) {
      startAmbientAudio();
      if (!audio.oscA || !audio.oscB || !audio.oscC) return;
    }
    audio.chordTimer -= dt;
    if (audio.chordTimer <= 0) {
      const step = 1 + Math.floor(Math.random() * (AMBIENT_CHORDS.length - 1));
      audio.chordIndex = (audio.chordIndex + step) % AMBIENT_CHORDS.length;
      setAmbientChord(audio.chordIndex, 1.8);
      audio.chordTimer = 5 + Math.random() * 4;
    }
    audio.noteTimer -= dt;
    if (audio.noteTimer <= 0) {
      triggerAmbientNote();
      audio.noteTimer = 0.52 + Math.random() * 0.2;
    }
    updateAnimalAmbience(dt);
  }

  function playSfx(kind) {
    if (!audio.ctx || !audio.enabled || !audio.sfxBus) return;
    const ctx = audio.ctx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(audio.sfxBus);

    if (kind === "chop") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.022, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.11);
      return;
    }

    if (kind === "mine") {
      osc.type = "square";
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(90, now + 0.12);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.024, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
      osc.start(now);
      osc.stop(now + 0.14);
      return;
    }

    if (kind === "swing") {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.06);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.016, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.08);
      return;
    }

    if (kind === "hit") {
      osc.type = "square";
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.1);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.025, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
      osc.start(now);
      osc.stop(now + 0.12);
      return;
    }

    if (kind === "damage" || kind === "hurt") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(172, now);
      osc.frequency.exponentialRampToValueAtTime(82, now + 0.16);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.03, now + 0.013);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.17);
      osc.start(now);
      osc.stop(now + 0.18);
      return;
    }

    if (kind === "animalBaa") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(330 + Math.random() * 70, now);
      osc.frequency.exponentialRampToValueAtTime(230 + Math.random() * 45, now + 0.16);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.012, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
      osc.start(now);
      osc.stop(now + 0.25);
      return;
    }

    if (kind === "animalMoo") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(170 + Math.random() * 35, now);
      osc.frequency.exponentialRampToValueAtTime(118 + Math.random() * 20, now + 0.2);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.013, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.29);
      osc.start(now);
      osc.stop(now + 0.3);
      return;
    }

    osc.type = "sine";
    osc.frequency.setValueAtTime(360, now);
    osc.frequency.exponentialRampToValueAtTime(260, now + 0.08);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
    osc.start(now);
    osc.stop(now + 0.1);
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
      case "houseChestUpdate":
        if (net.isHost) handleHouseChestUpdate(message);
        break;
      case "houseDestroyChest":
        if (net.isHost) handleHouseDestroyChest(message);
        break;
      case "destroyChest":
        if (net.isHost) handleDestroyChest(message);
        break;
      case "sleep":
        if (net.isHost) handleSleepRequest(conn);
        break;
      case "dropPickup":
        if (net.isHost) handleDropPickup(message);
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
        torchTimer: state.torchTimer,
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
        torchTimer: player.torchTimer ?? 0,
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
        itemId: drop.itemId,
        qty: drop.qty,
        x: drop.x,
        y: drop.y,
      })),
      monsters: (world.monsters ?? []).map((monster) => ({
        id: monster.id,
        type: monster.type ?? "crawler",
        x: monster.x,
        y: monster.y,
        hp: monster.hp,
        maxHp: monster.maxHp,
      })),
      projectiles: (world.projectiles ?? []).map((projectile) => ({
        id: projectile.id,
        type: projectile.type || "arrow",
        x: projectile.x,
        y: projectile.y,
        vx: projectile.vx,
        vy: projectile.vy,
        life: projectile.life,
        maxLife: projectile.maxLife,
        damage: projectile.damage,
        radius: projectile.radius,
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
      return {
        robot: {
          homeTx: robot.homeTx,
          homeTy: robot.homeTy,
          x: robot.x,
          y: robot.y,
          mode: robot.mode,
          state: robot.state,
          targetResourceId: Number.isInteger(robot.targetResourceId) ? robot.targetResourceId : null,
          mineTimer: robot.mineTimer,
          retargetTimer: robot.retargetTimer,
          pauseTimer: robot.pauseTimer,
        },
      };
    }
    if (!structure.meta) return null;
    const meta = structure.meta;
    if (meta.house) {
      return {
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
    return null;
  }

  function buildMonstersFromSnapshot(previous, snapshotMonsters) {
    const prevMap = new Map(
      Array.isArray(previous) ? previous.map((monster) => [monster.id, monster]) : []
    );
    if (!Array.isArray(snapshotMonsters)) return [];
    return snapshotMonsters.map((monster) => {
      const prev = prevMap.get(monster.id);
      const type = monster.type ?? "crawler";
      const variant = getMonsterVariant(type);
      return {
        id: monster.id,
        type,
        color: variant.color,
        x: monster.x,
        y: monster.y,
        hp: monster.hp,
        maxHp: monster.maxHp,
        speed: variant.speed,
        damage: variant.damage,
        attackRange: variant.attackRange,
        attackCooldown: variant.attackCooldown,
        aggroRange: variant.aggroRange,
        rangedRange: variant.rangedRange,
        attackTimer: 0,
        hitTimer: 0,
        wanderTimer: 0,
        dir: { x: 0, y: 0 },
        renderX: prev?.renderX ?? monster.x,
        renderY: prev?.renderY ?? monster.y,
      };
    });
  }

  function buildProjectilesFromSnapshot(previous, snapshotProjectiles) {
    const prevMap = new Map(
      Array.isArray(previous) ? previous.map((projectile) => [projectile.id, projectile]) : []
    );
    if (!Array.isArray(snapshotProjectiles)) return [];
    return snapshotProjectiles.map((projectile) => {
      const prev = prevMap.get(projectile.id);
      return {
        id: projectile.id,
        type: projectile.type || "arrow",
        x: projectile.x,
        y: projectile.y,
        vx: projectile.vx,
        vy: projectile.vy,
        life: projectile.life,
        maxLife: projectile.maxLife,
        damage: projectile.damage,
        radius: projectile.radius,
        renderX: prev?.renderX ?? projectile.x,
        renderY: prev?.renderY ?? projectile.y,
      };
    });
  }

  function buildSnapshot() {
    const surface = state.surfaceWorld || state.world;
    return {
      type: "snapshot",
      seed: surface.seed,
      timeOfDay: state.timeOfDay,
      isNight: state.isNight,
      gameWon: state.gameWon,
      world: serializeWorldState(surface),
      caves: surface.caves?.map((cave) => ({
        id: cave.id,
        tx: cave.tx,
        ty: cave.ty,
        world: serializeWorldState(cave.world),
      })) ?? [],
      structures: serializeStructuresList(),
      players: getPlayersSnapshot(),
    };
  }

  function applySnapshotStructures(structures) {
    const world = state.surfaceWorld;
    if (!world) return;
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
    for (const entry of structures) {
      if (!entry) continue;
      const normalized = { ...entry, type: entry.type === "hut" ? "small_house" : entry.type };
      if (!isStructureValidOnLoad(world, normalized, bridgeSet)) continue;
      clearResourcesForFootprint(world, normalized.type, normalized.tx, normalized.ty);
      const structure = addStructure(normalized.type, normalized.tx, normalized.ty, {
        storage: entry.storage
          ? entry.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
          : null,
        meta: entry.meta ? JSON.parse(JSON.stringify(entry.meta)) : null,
      });
      if (structure.type === "chest" && !structure.storage) {
        structure.storage = createEmptyInventory(CHEST_SIZE);
      }
    }

    if (activeChestPos) {
      const chest = getStructureAt(activeChestPos.tx, activeChestPos.ty);
      if (chest && (chest.type === "chest" || chest.type === "robot")) {
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
        if (typeof entry.torchTimer === "number") {
          state.torchTimer = Math.max(0, entry.torchTimer);
        }
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
        torchTimer: typeof entry.torchTimer === "number"
          ? Math.max(0, entry.torchTimer)
          : Math.max(0, prev?.torchTimer ?? 0),
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
      if (world.caves.some((cave) => cave.id === entry.id)) continue;
      if (typeof entry.tx !== "number" || typeof entry.ty !== "number") continue;
      const tx = Math.floor(entry.tx);
      const ty = Math.floor(entry.ty);
      if (!inBounds(tx, ty, world.size)) continue;
      const idx = tileIndex(tx, ty, world.size);
      if (!world.tiles[idx]) continue;
      if (world.caves.some((cave) => cave.tx === tx && cave.ty === ty)) continue;
      addSurfaceCave(world, tx, ty, entry.id);
    }
  }

  function applyNetworkSnapshot(snapshot) {
    if (!snapshot || !snapshot.seed) return;
    if (!state.surfaceWorld || state.surfaceWorld.seed !== snapshot.seed) {
      const world = generateWorld(snapshot.seed);
      state.surfaceWorld = world;
      state.world = world;
      state.inCave = false;
      state.activeCave = null;
      state.activeHouse = null;
      state.housePlayer = null;
      state.returnPosition = null;
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
    ensurePlayerProgress(state.player);
    ensureSurfaceCaves(world, snapshot.caves);
    applyResourceStates(world, snapshot.world?.resourceStates ?? []);
    applyRespawnTasks(world, snapshot.world?.respawnTasks ?? []);
    normalizeSurfaceResources(world);
    applyDrops(world, snapshot.world?.drops ?? []);
    applyAnimals(world, snapshot.world?.animals ?? []);
    world.monsters = buildMonstersFromSnapshot(world.monsters, snapshot.world?.monsters);
    world.projectiles = buildProjectilesFromSnapshot(world.projectiles, snapshot.world?.projectiles);

    if (Array.isArray(world.caves) && Array.isArray(snapshot.caves)) {
      for (const cave of world.caves) {
        const caveSnapshot = snapshot.caves.find((entry) => entry.id === cave.id);
        if (!caveSnapshot) continue;
        applyResourceStates(cave.world, caveSnapshot.world?.resourceStates ?? []);
        applyRespawnTasks(cave.world, caveSnapshot.world?.respawnTasks ?? []);
        applyDrops(cave.world, caveSnapshot.world?.drops ?? []);
        applyAnimals(cave.world, caveSnapshot.world?.animals ?? []);
        cave.world.monsters = buildMonstersFromSnapshot(cave.world.monsters, caveSnapshot.world?.monsters);
        cave.world.projectiles = buildProjectilesFromSnapshot(cave.world.projectiles, caveSnapshot.world?.projectiles);
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
      torchTimer: 0,
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
      torchTimer: player.torchTimer ?? 0,
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
      if (typeof message.playerState.torchTimer === "number") {
        state.torchTimer = Math.max(0, message.playerState.torchTimer);
      }
      updateHealthUI();
      updateToolDisplay();
    }
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
    if (typeof message.torchTimer === "number") {
      player.torchTimer = Math.max(0, message.torchTimer);
    }
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
      torchTimer: player.torchTimer ?? 0,
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
      if (typeof message.torchTimer === "number") {
        state.torchTimer = Math.max(0, message.torchTimer);
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
      torchTimer: typeof message.torchTimer === "number"
        ? Math.max(0, message.torchTimer)
        : Math.max(0, current.torchTimer ?? 0),
      renderX: current.renderX ?? (typeof message.x === "number" ? message.x : current.x ?? 0),
      renderY: current.renderY ?? (typeof message.y === "number" ? message.y : current.y ?? 0),
    });
  }

  function handlePlaceRequest(conn, message) {
    if (!message || !message.itemId) return;
    const world = state.surfaceWorld || state.world;
    const { tx, ty } = message;
    const result = canPlaceItemAt(world, false, message.itemId, tx, ty);
    if (result.ok) {
      if (result.clearResourceTiles?.length) {
        clearResourceTiles(world, result.clearResourceTiles);
      }
      const itemDef = ITEMS[message.itemId];
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
    conn.send({
      type: "placeResult",
      requestId: message.requestId,
      ok: result.ok,
    });
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
    const house = getStructureAt(message.houseTx, message.houseTy);
    let ok = false;
    if (house && isHouseType(house.type)) {
      const result = canPlaceInteriorItem(house, message.itemId, message.tx, message.ty);
      if (result.ok) {
        const itemDef = ITEMS[message.itemId];
        addInteriorStructure(house, itemDef.placeType, message.tx, message.ty);
        markDirty();
        ok = true;
      }
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

  function handleHarvestRequest(conn, message) {
    const world = message.world === "cave"
      ? getCaveWorld(message.caveId)
      : state.surfaceWorld;
    if (!world) return;
    const resource = world.resources?.[message.resId];
    if (!resource || resource.removed) return;
    const sourcePlayer = conn
      ? { ...(net.players.get(conn.peer) || {}), unlocks: normalizeUnlocks(message.unlocks ?? net.players.get(conn.peer)?.unlocks) }
      : state.player;
    if (!canHarvestResource(resource, sourcePlayer).ok) return;
    const damage = clamp(getAppliedHarvestDamage(sourcePlayer, resource), 1, 4);
    const playAudio = shouldPlayWorldSfx(world, resource.x, resource.y);
    applyHarvestToResource(world, resource, damage, false, playAudio);
  }

  function handleAttackRequest(conn, message) {
    const world = message.world === "cave"
      ? getCaveWorld(message.caveId)
      : (state.surfaceWorld || state.world);
    if (!world) return;
    const sourcePlayer = conn
      ? { ...(net.players.get(conn.peer) || {}), unlocks: normalizeUnlocks(message.unlocks ?? net.players.get(conn.peer)?.unlocks) }
      : state.player;
    const target = findNearestMonsterAt(world, { x: message.x, y: message.y }, MONSTER.attackRange + 8);
    if (target) {
      if (!canDamageMonsters(sourcePlayer)) return;
      const damage = clamp(getAppliedAttackDamage(sourcePlayer, target), 1, 12);
      target.hp -= damage;
      target.hitTimer = 0.2;
      if (shouldPlayWorldSfx(world, target.x, target.y)) {
        playSfx("hit");
      }
      if (target.hp < 0) target.hp = 0;
      markDirty();
      return;
    }
    const surface = state.surfaceWorld || state.world;
    if (world !== surface) return;
    const animal = findNearestAnimalAt(world, { x: message.x, y: message.y }, MONSTER.attackRange + 8);
    if (!animal) return;
    const damage = clamp(getAppliedAttackDamage(sourcePlayer, animal), 1, 12);
    animal.hp -= damage;
    animal.hitTimer = 0.2;
    animal.fleeTimer = 2.4;
    if (shouldPlayWorldSfx(world, animal.x, animal.y)) {
      playSfx("hit");
    }
    if (animal.hp <= 0) {
      animal.hp = 0;
      const drop = animal.drop || { raw_meat: 1 };
      for (const [itemId, qty] of Object.entries(drop)) {
        spawnDrop(itemId, qty, animal.x, animal.y, state.surfaceWorld || state.world);
      }
    }
    markDirty();
  }

  function handleChestUpdate(conn, message) {
    void conn;
    if (typeof message.tx !== "number" || typeof message.ty !== "number") return;
    const structure = getStructureAt(message.tx, message.ty);
    if (!structure || (structure.type !== "chest" && structure.type !== "robot")) return;
    if (structure.type === "robot") {
      ensureRobotMeta(structure);
    }
    structure.storage = Array.isArray(message.storage)
      ? message.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
      : createEmptyInventory(structure.type === "robot" ? ROBOT_STORAGE_SIZE : CHEST_SIZE);
    markDirty();
  }

  function canRemotePlayerControlRobot(player, structure) {
    if (!player || !structure || structure.type !== "robot") return false;
    if (player.inCave || player.inHut) return false;
    const robotPos = getStructureCenterWorld(structure);
    const dist = Math.hypot((player.x ?? 0) - robotPos.x, (player.y ?? 0) - robotPos.y);
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
      robot.targetResourceId = null;
      robot.retargetTimer = 0;
      robot.state = "idle";
      clearRobotNavigation(robot);
      setRobotInteractionPause(structure, ROBOT_CONFIG.interactionPause);
      markDirty();
      return;
    }

    if (message.action === "ping") {
      setRobotInteractionPause(structure, ROBOT_CONFIG.interactionPause);
    }
  }

  function handleHouseChestUpdate(message) {
    const house = getStructureAt(message.houseTx, message.houseTy);
    if (!house || !isHouseType(house.type)) return;
    const chest = getInteriorStructureAt(house, message.tx, message.ty);
    if (!chest || chest.type !== "chest") return;
    chest.storage = Array.isArray(message.storage)
      ? message.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
      : createEmptyInventory(CHEST_SIZE);
    markDirty();
  }

  function handleHouseDestroyChest(message) {
    const house = getStructureAt(message.houseTx, message.houseTy);
    if (!house || !isHouseType(house.type)) return;
    const chest = getInteriorStructureAt(house, message.tx, message.ty);
    if (!chest || chest.type !== "chest") return;
    removeInteriorStructure(house, chest);
    markDirty();
  }

  function handleDestroyChest(message) {
    if (typeof message.tx !== "number" || typeof message.ty !== "number") return;
    const structure = getStructureAt(message.tx, message.ty);
    if (!structure || structure.type !== "chest") return;
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
    state.torchTimer = 0;
    state.animalVocalTimer = 2.4 + Math.random() * 1.8;
    state.surfaceSpawnTimer = MONSTER.spawnInterval;
    state.gameWon = false;
    if (state.surfaceWorld) {
      state.surfaceWorld.monsters = [];
      state.surfaceWorld.projectiles = [];
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

  function handleDropPickup(message) {
    const world = message.world === "cave"
      ? getCaveWorld(message.caveId)
      : state.surfaceWorld;
    if (!world || !Array.isArray(world.drops)) return;
    const requestedId = Number.isInteger(message.dropId) ? message.dropId : null;
    if (requestedId != null) {
      const byIdIndex = world.drops.findIndex((drop) => drop.id === requestedId);
      if (byIdIndex >= 0) {
        world.drops.splice(byIdIndex, 1);
        markDirty();
      }
      return;
    }
    let bestIndex = -1;
    let bestDist = Infinity;
    for (let i = 0; i < world.drops.length; i += 1) {
      const drop = world.drops[i];
      if (drop.itemId !== message.itemId) continue;
      const dist = Math.hypot(drop.x - message.x, drop.y - message.y);
      if (dist < bestDist) {
        bestDist = dist;
        bestIndex = i;
      }
    }
    if (bestIndex >= 0 && bestDist <= CONFIG.tileSize * 2) {
      world.drops.splice(bestIndex, 1);
      markDirty();
    }
  }

  function handleDropItemRequest(conn, message) {
    if (!conn || !message) return;
    const world = message.world === "cave"
      ? getCaveWorld(message.caveId)
      : state.surfaceWorld;
    if (!world) return;
    const itemId = typeof message.itemId === "string" ? message.itemId : null;
    if (!itemId || !ITEMS[itemId]) return;
    const qty = clamp(Math.floor(Number(message.qty) || 0), 1, MAX_STACK);
    const x = Number.isFinite(message.x) ? message.x : null;
    const y = Number.isFinite(message.y) ? message.y : null;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return;
    const player = net.players.get(conn.peer);
    if (player) {
      const distFromPlayer = Math.hypot(x - (player.x ?? 0), y - (player.y ?? 0));
      if (distFromPlayer > CONFIG.tileSize * 6) return;
    }
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
    if (typeof message.hp === "number") {
      state.player.hp = message.hp;
      playSfx("damage");
      updateHealthUI();
      if (state.player.hp <= 0) {
        handlePlayerDeath();
      }
    }
  }

  function handleRespawnMessage(message) {
    if (!state.player) return;
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
    interactPressed = false;
    attackPressed = false;
    keyState.clear();
    touch.active = false;
    touch.pointerId = null;
    touch.dx = 0;
    touch.dy = 0;
    if (stickKnobEl) stickKnobEl.style.transform = "translate(0px, 0px)";
    closeStationMenu();
    closeChest();
    closeInventory();
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
      torchTimer: state.torchTimer,
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
      net.snapshotTimer -= dt;
      if (net.snapshotTimer <= 0) {
        broadcastNet(buildSnapshot());
        net.snapshotTimer = NET_CONFIG.snapshotInterval;
      }
    }
  }

  function updateRemoteRender(dt) {
    for (const player of net.players.values()) {
      if (player.torchTimer > 0) {
        player.torchTimer = Math.max(0, player.torchTimer - dt);
      }
      if (player.renderX == null || player.renderY == null) {
        player.renderX = player.x;
        player.renderY = player.y;
      } else {
        player.renderX = smoothValue(player.renderX, player.x, dt, NET_CONFIG.renderSmooth);
        player.renderY = smoothValue(player.renderY, player.y, dt, NET_CONFIG.renderSmooth);
      }

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
        if (monster.renderX == null || monster.renderY == null) {
          monster.renderX = monster.x;
          monster.renderY = monster.y;
        } else {
          monster.renderX = smoothValue(monster.renderX, monster.x, dt, NET_CONFIG.monsterSmooth);
          monster.renderY = smoothValue(monster.renderY, monster.y, dt, NET_CONFIG.monsterSmooth);
        }
      }
    }

    if (!net.isHost && state.world?.animals) {
      for (const animal of state.world.animals) {
        if (animal.renderX == null || animal.renderY == null) {
          animal.renderX = animal.x;
          animal.renderY = animal.y;
        } else {
          animal.renderX = smoothValue(animal.renderX, animal.x, dt, NET_CONFIG.animalSmooth);
          animal.renderY = smoothValue(animal.renderY, animal.y, dt, NET_CONFIG.animalSmooth);
        }
      }
    }

    if (!net.isHost && state.world?.projectiles) {
      for (const projectile of state.world.projectiles) {
        if (projectile.renderX == null || projectile.renderY == null) {
          projectile.renderX = projectile.x;
          projectile.renderY = projectile.y;
        } else {
          projectile.renderX = smoothValue(projectile.renderX, projectile.x, dt, NET_CONFIG.monsterSmooth + 2);
          projectile.renderY = smoothValue(projectile.renderY, projectile.y, dt, NET_CONFIG.monsterSmooth + 2);
        }
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
    const roll = rng();
    if (roll < 0.45) return 0;
    if (roll < 0.7) return 1;
    if (roll < 0.85) return 2;
    return 3;
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

  function generateCaveWorld(seed, caveId) {
    const size = CAVE_SIZE;
    const caveSeed = seed + caveId * 7919;
    const rng = makeRng(caveSeed);
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

    for (const chamber of chambers.slice(0, 4)) {
      landmarks.push({
        x: (chamber.x + 0.5) * CONFIG.tileSize,
        y: (chamber.y + 0.5) * CONFIG.tileSize,
        color: rng() < 0.5 ? "#86b9d7" : "#9ad0a1",
      });
    }

    const monsters = [];
    let nextMonsterId = 1;
    const monsterCount = 2 + Math.floor(rng() * 3);
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
      projectiles: [],
      nextProjectileId: 1,
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

    function placeIsland(radius) {
      const edgePad = 12;
      const minCoord = radius + edgePad;
      const maxCoord = size - radius - edgePad;
      if (maxCoord <= minCoord) return null;
      for (let attempt = 0; attempt < 48; attempt += 1) {
        const x = minCoord + rng() * (maxCoord - minCoord);
        const y = minCoord + rng() * (maxCoord - minCoord);
        const ok = islands.every(
          (island) => Math.hypot(island.x - x, island.y - y) > (radius + island.radius) * 0.67
        );
        if (ok) return { x, y };
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
        const ok = islands.every(
          (island) => Math.hypot(island.x - x, island.y - y) > (radius + island.radius) * 0.67
        );
        if (!ok) continue;
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
          addResource("tree", x, y, 4);
        } else if (r < biome.treeRate + biome.rockRate && isClear(x, y, 2)) {
          addResource("rock", x, y, 4);
        } else if (r < biome.treeRate + biome.rockRate + (biome.grassRate || 0) && isClear(x, y, 1)) {
          addResource("grass", x, y, 1);
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
      return false;
    }

    for (let biomeId = 0; biomeId < BIOMES.length; biomeId += 1) {
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
    const caveCandidateIslands = islands
      .filter((island) => !island.starter && island.radius >= 8)
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
      caves.push({
        id: caves.length,
        tx,
        ty,
        world: generateCaveWorld(seed, caves.length),
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
      projectiles: [],
      nextProjectileId: 1,
      animals: [],
      nextAnimalId: 1,
      animalSpawnTimer: 3,
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
      if (save) return { key, save };
    }

    const canonicalKey = getSeedSaveKey(canonicalSeed);
    if (!checkedKeys.has(canonicalKey)) {
      checkedKeys.add(canonicalKey);
      const save = readSaveFromKey(canonicalKey);
      if (save) return { key: canonicalKey, save };
    }

    try {
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (!key || !key.startsWith(SAVE_KEY_PREFIX) || checkedKeys.has(key)) continue;
        const save = readSaveFromKey(key);
        if (!save) continue;
        const saveSeed = normalizeSeedValue(save.seed ?? key.slice(SAVE_KEY_PREFIX.length));
        if (saveSeed === canonicalSeed) {
          return { key, save };
        }
      }
    } catch (err) {
      // ignore localStorage enumeration issues
    }

    return null;
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
        itemId: drop.itemId,
        qty: drop.qty,
        x: drop.x,
        y: drop.y,
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
      caves: surface.caves?.map((cave) => ({
        id: cave.id,
        tx: cave.tx,
        ty: cave.ty,
        resourceStates: cave.world.resources.map((res) => serializeResource(res)),
        respawnTasks: cave.world.respawnTasks ?? [],
        drops: (cave.world.drops ?? []).map((drop) => ({
          itemId: drop.itemId,
          qty: drop.qty,
          x: drop.x,
          y: drop.y,
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
      const saveSeed = normalizeSeedValue(seededSave.seed ?? requestedSeed);
      if (match.key !== canonicalKey || saveSeed !== requestedSeed) {
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
    if (data.version === SAVE_VERSION) {
      return {
        ...data,
        version: SAVE_VERSION,
        seed: normalizeSeedValue(data.seed),
      };
    }
    if (data.version === 1) {
      return {
        version: SAVE_VERSION,
        seed: normalizeSeedValue(data.seed),
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
        animals: Array.isArray(data.animals) ? data.animals : [],
        caves: [],
      };
    }
    if (data.version === 2) {
      return {
        version: SAVE_VERSION,
        seed: normalizeSeedValue(data.seed),
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
        animals: Array.isArray(data.animals) ? data.animals : [],
        caves: [],
      };
    }
    if (data.version === 3) {
      return {
        version: SAVE_VERSION,
        seed: normalizeSeedValue(data.seed),
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
        animals: Array.isArray(data.animals) ? data.animals : [],
        caves: Array.isArray(data.caves) ? data.caves : [],
      };
    }
    if (data.version === 4) {
      return {
        version: SAVE_VERSION,
        seed: normalizeSeedValue(data.seed),
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
        animals: Array.isArray(data.animals) ? data.animals : [],
        caves: Array.isArray(data.caves) ? data.caves : [],
      };
    }
    return {
      version: SAVE_VERSION,
      seed: normalizeSeedValue(data.seed),
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
      animals: Array.isArray(data.animals) ? data.animals : [],
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
    world.drops = Array.isArray(drops)
      ? drops.map((drop) => ({
          id: state.nextDropId++,
          itemId: drop.itemId,
          qty: drop.qty,
          x: drop.x,
          y: drop.y,
        }))
      : [];
  }

  function applyRespawnTasks(world, tasks) {
    world.respawnTasks = Array.isArray(tasks)
      ? tasks.map((task) => ({
          type: task.type,
          id: typeof task.id === "number" ? task.id : null,
          tx: task.tx,
          ty: task.ty,
          timer: typeof task.timer === "number"
            ? task.timer
            : (task.type === "grass" ? RESPAWN.grass : RESPAWN.rock),
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
        if (!Number.isFinite(res.maxHp) || res.maxHp < 4) {
          const prevMax = Number.isFinite(res.maxHp) && res.maxHp > 0 ? res.maxHp : 3;
          const prevHp = Number.isFinite(res.hp) ? res.hp : prevMax;
          const ratio = clamp(prevHp / prevMax, 0, 1);
          res.maxHp = 4;
          res.hp = Math.max(1, Math.round(res.maxHp * ratio));
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
    }
  }

  function applyAnimals(world, animals) {
    const prevAnimals = new Map(
      Array.isArray(world.animals) ? world.animals.map((animal) => [animal.id, animal]) : []
    );
    world.animals = Array.isArray(animals)
      ? animals.map((animal) => ({
          id: typeof animal.id === "number" ? animal.id : state.nextAnimalId++,
          type: animal.type === "goat" ? "goat" : "boar",
          x: animal.x,
          y: animal.y,
          hp: typeof animal.hp === "number" ? animal.hp : (animal.type === "goat" ? 4 : 5),
          maxHp: typeof animal.maxHp === "number" ? animal.maxHp : (animal.type === "goat" ? 4 : 5),
          speed: typeof animal.speed === "number" ? animal.speed : (animal.type === "goat" ? 48 : 42),
          color: animal.color || (animal.type === "goat" ? "#d2cab8" : "#9f8160"),
          drop: animal.type === "goat" ? { raw_meat: 1, hide: 1 } : { raw_meat: 2, hide: 1 },
          hitTimer: 0,
          fleeTimer: 0,
          wanderTimer: 0,
          dir: { x: 0, y: 0 },
          renderX: prevAnimals.get(animal.id)?.renderX ?? animal.x,
          renderY: prevAnimals.get(animal.id)?.renderY ?? animal.y,
        }))
      : [];
    world.nextAnimalId = world.animals.reduce((max, animal) => Math.max(max, animal.id + 1), 1);
  }

  function isStructureValidOnLoad(world, entry, bridgeSet) {
    if (!entry || !inBounds(entry.tx, entry.ty, world.size)) return false;
    if (REMOVED_STRUCTURE_TYPES.has(entry.type)) return false;
    const idx = tileIndex(entry.tx, entry.ty, world.size);
    const baseLand = world.tiles[idx] === 1;

    if (entry.type === "bridge" || entry.type === "dock") {
      if (baseLand) return false;
      const key = (tx, ty) => `${tx},${ty}`;
      const left = inBounds(entry.tx - 1, entry.ty, world.size)
        && (world.tiles[tileIndex(entry.tx - 1, entry.ty, world.size)] === 1
          || bridgeSet?.has(key(entry.tx - 1, entry.ty)));
      const right = inBounds(entry.tx + 1, entry.ty, world.size)
        && (world.tiles[tileIndex(entry.tx + 1, entry.ty, world.size)] === 1
          || bridgeSet?.has(key(entry.tx + 1, entry.ty)));
      const up = inBounds(entry.tx, entry.ty - 1, world.size)
        && (world.tiles[tileIndex(entry.tx, entry.ty - 1, world.size)] === 1
          || bridgeSet?.has(key(entry.tx, entry.ty - 1)));
      const down = inBounds(entry.tx, entry.ty + 1, world.size)
        && (world.tiles[tileIndex(entry.tx, entry.ty + 1, world.size)] === 1
          || bridgeSet?.has(key(entry.tx, entry.ty + 1)));
      return left || right || up || down;
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
    const pct = clamp(state.player.hp / state.player.maxHp, 0, 1);
    healthFill.style.width = `${Math.round(pct * 100)}%`;
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

  function getStructureFootprint(type) {
    if (type === "medium_house") return { w: 2, h: 1 };
    if (type === "large_house") return { w: 2, h: 2 };
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
      const robotPos = getRobotPosition(structure);
      if (robotPos) return robotPos;
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
        mode: ROBOT_MODE.trees,
        state: "idle",
        targetResourceId: null,
        mineTimer: 0,
        retargetTimer: 0,
        pauseTimer: 0,
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
    robot.mode = normalizeRobotMode(robot.mode) ?? ROBOT_MODE.trees;
    if (typeof robot.state !== "string") robot.state = "idle";
    if (!Number.isFinite(robot.mineTimer)) robot.mineTimer = 0;
    if (!Number.isFinite(robot.retargetTimer)) robot.retargetTimer = 0;
    if (!Number.isFinite(robot.pauseTimer)) robot.pauseTimer = 0;
    if (!Number.isInteger(robot.targetResourceId)) robot.targetResourceId = null;
    if (!Array.isArray(structure.storage)) {
      structure.storage = createEmptyInventory(ROBOT_STORAGE_SIZE);
    }
    return robot;
  }

  function getRobotPosition(structure) {
    const robot = ensureRobotMeta(structure);
    if (!robot) return null;
    return { x: robot.x, y: robot.y };
  }

  function setRobotInteractionPause(structure, duration = ROBOT_CONFIG.interactionPause) {
    const robot = ensureRobotMeta(structure);
    if (!robot) return;
    robot.pauseTimer = Math.max(robot.pauseTimer || 0, duration);
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
    if (mode === ROBOT_MODE.stone) return "Mine Stone";
    if (mode === ROBOT_MODE.grass) return "Mine Grass";
    return "Mine Trees";
  }

  function getRobotStatusLabel(structure) {
    const robot = ensureRobotMeta(structure);
    if (!robot) return "Idle";
    if (robot.pauseTimer > 0) return "Paused (interacting)";
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

  function addVillageHouse(world, tx, ty, type, rng, withChest, withBed) {
    const footprintCheck = canUseStructureFootprint(world, type, tx, ty, { allowResourceClear: true });
    if (!footprintCheck.ok) return null;
    let villageTilesValid = true;
    forEachStructureFootprintTile(type, tx, ty, (fx, fy) => {
      if (!villageTilesValid) return;
      if (!canPlaceVillageTile(world, fx, fy)) villageTilesValid = false;
    });
    if (!villageTilesValid) return null;
    clearResourceTiles(world, footprintCheck.clearResourceTiles);
    const house = addStructure(type, tx, ty, { meta: { village: true } });
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
        rng() < 0.55 ? "lantern" : "campfire",
        Math.max(0, Math.floor(interior.width / 2)),
        Math.max(0, Math.floor(interior.height / 2) - 1)
      );
    }
    return house;
  }

  function placeVillagePath(world, tx, ty) {
    if (!canPlaceVillageTile(world, tx, ty)) return false;
    if (getStructureAt(tx, ty)) return false;
    clearResourceForStructure(world, tx, ty);
    addStructure("village_path", tx, ty, { meta: { village: true } });
    return true;
  }

  function carveVillagePathLine(world, x0, y0, x1, y1) {
    let x = x0;
    let y = y0;
    const stepX = x1 > x0 ? 1 : -1;
    const stepY = y1 > y0 ? 1 : -1;
    while (x !== x1) {
      placeVillagePath(world, x, y);
      x += stepX;
    }
    while (y !== y1) {
      placeVillagePath(world, x, y);
      y += stepY;
    }
    placeVillagePath(world, x1, y1);
  }

  function spawnVillageAt(world, centerTx, centerTy, rng = Math.random) {
    if (!world) return { ok: false, reason: "No world" };
    if (!canPlaceVillageTile(world, centerTx, centerTy)) return { ok: false, reason: "Bad center" };
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
      const house = addVillageHouse(world, tx, ty, type, rng, withChest, withBed);
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
      carveVillagePathLine(world, centerTx, centerTy, pathTx, pathTy);
    }
    placeVillagePath(world, centerTx, centerTy);

    const decorOffsets = [
      { dx: 0, dy: 0 }, { dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 },
    ];
    for (const spot of decorOffsets) {
      placeVillagePath(world, centerTx + spot.dx, centerTy + spot.dy);
    }
    if (canPlaceVillageTile(world, centerTx + 1, centerTy + 1) && !getStructureAt(centerTx + 1, centerTy + 1)) {
      clearResourceForStructure(world, centerTx + 1, centerTy + 1);
      addStructure("campfire", centerTx + 1, centerTy + 1, { meta: { village: true } });
    }
    if (canPlaceVillageTile(world, centerTx - 1, centerTy + 1) && !getStructureAt(centerTx - 1, centerTy + 1)) {
      clearResourceForStructure(world, centerTx - 1, centerTy + 1);
      addStructure("bench", centerTx - 1, centerTy + 1, { meta: { village: true } });
    }

    return { ok: true, houses: houses.length };
  }

  function seedSurfaceVillages(world) {
    if (!world || !Array.isArray(world.islands)) return;
    const rng = makeRng((world.seedInt ?? seedToInt(world.seed || "island")) + 170341);
    const candidates = world.islands
      .filter((island) => !island.starter && island.radius >= 8)
      .sort((a, b) => b.radius - a.radius);
    const fallbackCandidates = (
      candidates.length > 0
        ? candidates
        : world.islands.filter((island) => island.radius >= 8)
    ).sort((a, b) => b.radius - a.radius);

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
    seedSurfaceAnimals(world, 24);
    const spawn = findSpawnTile(world);
    state.spawnTile = spawn;
    state.timeOfDay = 0;
    state.isNight = false;
    state.checkpointTimer = 0;
    state.torchTimer = 0;
    state.surfaceSpawnTimer = MONSTER.spawnInterval;
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

    const benchSpot = findBenchSpot(world, spawn);
    addStructure("bench", benchSpot.tx, benchSpot.ty);
    seedSurfaceVillages(world);

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
      const world = generateWorld(saved.seed);
      normalizeSurfaceResources(world);
      state.nextDropId = 1;
      applyResourceStates(world, saved.resourceStates);
      applyRespawnTasks(world, saved.respawnTasks);
      applyDrops(world, saved.drops);
      applyAnimals(world, saved.animals);
      world.monsters = world.monsters || [];
      world.nextMonsterId = world.nextMonsterId || 1;
      world.projectiles = [];
      world.nextProjectileId = 1;
      world.animals = world.animals || [];
      world.nextAnimalId = world.nextAnimalId || 1;
      world.animalSpawnTimer = 3;
      if (world.animals.length === 0) {
        seedSurfaceAnimals(world, 24);
      }
      ensureSurfaceCaves(world, saved.caves);

      if (Array.isArray(world.caves)) {
        for (const cave of world.caves) {
          const savedCave = saved.caves?.find((entry) => entry.id === cave.id);
          if (savedCave) {
            applyResourceStates(cave.world, savedCave.resourceStates);
            applyRespawnTasks(cave.world, savedCave.respawnTasks);
            applyDrops(cave.world, savedCave.drops);
          } else {
            cave.world.drops = cave.world.drops || [];
            cave.world.respawnTasks = cave.world.respawnTasks || [];
          }
          cave.world.monsters = cave.world.monsters || [];
          cave.world.nextMonsterId = cave.world.nextMonsterId || 1;
          cave.world.projectiles = [];
          cave.world.nextProjectileId = 1;
        }
      }

      state.surfaceWorld = world;
      state.world = world;
      state.inventory = Array.isArray(saved.inventory) && saved.inventory.length === INVENTORY_SIZE
        ? saved.inventory
        : createEmptyInventory(INVENTORY_SIZE);
      state.structures = [];
      state.structureGrid = new Array(world.size * world.size).fill(null);

      if (Array.isArray(saved.structures)) {
        const bridgeSet = new Set(
          saved.structures
            .filter((entry) => entry && (entry.type === "bridge" || entry.type === "dock"))
            .map((entry) => `${entry.tx},${entry.ty}`)
        );
        for (const entry of saved.structures) {
          if (!entry) continue;
          const normalized = { ...entry, type: entry.type === "hut" ? "small_house" : entry.type };
          if (!isStructureValidOnLoad(world, normalized, bridgeSet)) continue;
          clearResourcesForFootprint(world, normalized.type, normalized.tx, normalized.ty);
          const structure = addStructure(normalized.type, normalized.tx, normalized.ty, {
            storage: entry.storage
              ? entry.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
              : null,
            meta: entry.meta ? JSON.parse(JSON.stringify(entry.meta)) : null,
          });
          if (structure.type === "chest" && !structure.storage) {
            structure.storage = createEmptyInventory(CHEST_SIZE);
          }
        }
      }

      const spawnTile = findSpawnTile(world);
      state.player = {
        x: saved.player?.x ?? (spawnTile.x + 0.5) * CONFIG.tileSize,
        y: saved.player?.y ?? (spawnTile.y + 0.5) * CONFIG.tileSize,
        toolTier: saved.player?.toolTier ?? 1,
        unlocks: normalizeUnlocks(saved.player?.unlocks),
        checkpoint: normalizeCheckpoint(saved.player?.checkpoint) ?? {
          x: (spawnTile.x + 0.5) * CONFIG.tileSize,
          y: (spawnTile.y + 0.5) * CONFIG.tileSize,
        },
        facing: { x: 1, y: 0 },
        maxHp: saved.player?.maxHp ?? 100,
        hp: saved.player?.hp ?? 100,
        inHut: false,
        invincible: 0,
        attackTimer: 0,
      };
      ensurePlayerProgress(state.player);
      setPlayerCheckpoint(state.player, world, state.player.checkpoint?.x ?? state.player.x, state.player.checkpoint?.y ?? state.player.y, true);
      state.activeHouse = null;
      state.housePlayer = null;
      state.spawnTile = spawnTile;
      state.timeOfDay = typeof saved.timeOfDay === "number" ? saved.timeOfDay : 0;
      state.checkpointTimer = 0;
      state.torchTimer = 0;
      state.animalVocalTimer = 2.4 + Math.random() * 1.8;
      state.gameWon = !!saved.gameWon;
      state.winSequencePlayed = false;
      state.winTimer = 0;
      state.winPlayerPos = state.player ? { x: state.player.x, y: state.player.y } : null;
      state.isNight = state.timeOfDay >= CONFIG.dayLength;
      state.surfaceSpawnTimer = MONSTER.spawnInterval;
      state.inCave = !!saved.player?.inCave;
      state.activeCave = null;
      state.returnPosition = saved.player?.returnPosition ?? null;

      if (state.inCave && world.caves) {
        const cave = world.caves.find((entry) => entry.id === saved.player?.caveId);
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

      let bench = state.structures.find((s) => s.type === "bench" && !s.removed);
      const benchIdx = bench ? tileIndex(bench.tx, bench.ty, world.size) : -1;
      if (!bench || !world.tiles[benchIdx]) {
        if (bench) removeStructure(bench);
        const benchSpot = findBenchSpot(world, spawnTile);
        addStructure("bench", benchSpot.tx, benchSpot.ty);
      }

      ensureSurfaceVillagePresence(world);

      state.targetResource = null;
      state.activeStation = null;
      state.activeChest = null;
      state.dirty = false;

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

  function getResourceDropId(resource) {
    if (!resource) return null;
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
    const torchBonus = player === state.player && state.torchTimer > 0 ? 1 : 0;
    return Math.max(1, base + torchBonus);
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
    if (resource.type === "rock") return "Mine rock";
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
      if (dist < CONFIG.interactRange && dist < closestDist) {
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
      || placeType === "lantern"
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

  function addSurfaceCave(world, tx, ty, preferredId = null) {
    if (!world) return null;
    if (!Array.isArray(world.caves)) world.caves = [];
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
      world: generateCaveWorld(seedInt, id),
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

  function getVillageCenters(world) {
    if (!world) return [];
    const villageNodes = state.structures
      .filter((structure) => (
        structure
        && !structure.removed
        && !!structure.meta?.village
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

  function createMapHintTarget(world, mapItemId, baseTarget) {
    if (!world || !baseTarget) return null;
    const markerSeed = seedToInt(`${world.seed}:${mapItemId}:${baseTarget.key || "target"}`);
    const rng = makeRng(markerSeed);
    const angle = rng() * Math.PI * 2;
    const radiusTiles = 3 + rng() * 4.5;
    const radius = radiusTiles * CONFIG.tileSize;
    const limit = world.size * CONFIG.tileSize;
    return {
      x: clamp(baseTarget.x + Math.cos(angle) * radius, CONFIG.tileSize * 0.5, limit - CONFIG.tileSize * 0.5),
      y: clamp(baseTarget.y + Math.sin(angle) * radius, CONFIG.tileSize * 0.5, limit - CONFIG.tileSize * 0.5),
      label: mapItemId === "village_map" ? "Village zone" : "Cave zone",
    };
  }

  function getMapTargetForItem(world, mapItemId, fromX, fromY) {
    if (!world || !mapItemId) return null;
    if (mapItemId === "village_map") {
      if (!netIsClient()) {
        ensureSurfaceVillagePresence(world);
      }
      const villages = getVillageCenters(world);
      const nearestVillage = findNearestTarget(villages, fromX, fromY);
      return createMapHintTarget(world, mapItemId, nearestVillage);
    }
    if (mapItemId === "cave_map") {
      const caves = (world.caves || []).map((cave) => ({
        key: `cave-${cave.id}`,
        x: (cave.tx + 0.5) * CONFIG.tileSize,
        y: (cave.ty + 0.5) * CONFIG.tileSize,
      }));
      const nearestCave = findNearestTarget(caves, fromX, fromY);
      return createMapHintTarget(world, mapItemId, nearestCave);
    }
    return null;
  }

  function ensureSurfaceMapTexture(world, size) {
    if (!world) return null;
    const texSize = Math.max(64, Math.floor(size));
    if (world.mapTexture && world.mapTextureSize === texSize) {
      return world.mapTexture;
    }
    const texture = document.createElement("canvas");
    texture.width = texSize;
    texture.height = texSize;
    const textureCtx = texture.getContext("2d");
    textureCtx.fillStyle = "#1f537b";
    textureCtx.fillRect(0, 0, texSize, texSize);
    const pxStep = Math.max(1, Math.ceil(texSize / world.size));
    for (let y = 0; y < world.size; y += 1) {
      for (let x = 0; x < world.size; x += 1) {
        const idx = tileIndex(x, y, world.size);
        if (!world.tiles[idx]) continue;
        const biomeId = world.biomeGrid?.[idx] ?? 0;
        const biome = BIOMES[biomeId] || BIOMES[0];
        const isBeach = !!world.beachGrid?.[idx];
        const base = isBeach ? biome.sand : biome.land;
        const shade = clamp(world.shades?.[idx] ?? 1, 0.75, 1.2);
        const r = Math.floor(clamp(base[0] * shade, 0, 255));
        const g = Math.floor(clamp(base[1] * shade, 0, 255));
        const b = Math.floor(clamp(base[2] * shade, 0, 255));
        const px = Math.floor((x / world.size) * texSize);
        const py = Math.floor((y / world.size) * texSize);
        textureCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        textureCtx.fillRect(px, py, pxStep, pxStep);
      }
    }
    world.mapTexture = texture;
    world.mapTextureSize = texSize;
    return texture;
  }

  function spawnDrop(itemId, qty, x, y, world = state.world) {
    if (qty <= 0 || !world) return;
    world.drops.push({
      id: state.nextDropId++,
      itemId,
      qty,
      x,
      y,
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

  function updateDrops() {
    if (!state.player) return;
    if (state.player.inHut) return;
    if (!state.world.drops) state.world.drops = [];
    let changed = false;
    for (const drop of state.world.drops) {
      if (drop.qty <= 0) continue;
      const dist = Math.hypot(drop.x - state.player.x, drop.y - state.player.y);
      if (dist < CONFIG.interactRange * 0.8) {
        const remaining = addItem(state.inventory, drop.itemId, drop.qty);
        if (remaining === 0) {
          drop.qty = 0;
          changed = true;
          markDirty();
          if (netIsClient()) {
            sendToHost({
              type: "dropPickup",
              world: state.inCave ? "cave" : "surface",
              caveId: state.activeCave?.id ?? null,
              dropId: drop.id,
              itemId: drop.itemId,
              x: drop.x,
              y: drop.y,
            });
          }
        } else if (remaining < drop.qty) {
          drop.qty = remaining;
          changed = true;
          markDirty();
        }
      }
    }
    state.world.drops = state.world.drops.filter((drop) => drop.qty > 0);
    if (changed) updateAllSlotUI();
  }

  function applyHarvestToResource(world, resource, damage, awardItems, emitSfx = true) {
    if (!resource || resource.removed) return;
    const dropId = getResourceDropId(resource);
    if (!dropId) return;
    stabilizeResourceHp(resource);

    if (emitSfx) {
      playSfx(resource.type === "tree" || resource.type === "grass" ? "chop" : "mine");
    }
    let nextDamage = Math.max(1, Math.floor(Number(damage) || 1));
    // Keep full nodes from being one-tapped due bad legacy HP data or malformed messages.
    if (resource.type !== "grass" && resource.hp === resource.maxHp) {
      nextDamage = Math.min(nextDamage, Math.max(1, resource.maxHp - 1));
    }
    resource.hp -= nextDamage;
    resource.hitTimer = 0.18;
    if (emitSfx) {
      playSfx("hit");
    }

    if (resource.hp <= 0) {
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
        if (resource.type === "rock" || resource.type === "grass") {
          const respawnType = resource.type;
          const respawnDelay = resource.type === "grass" ? RESPAWN.grass : RESPAWN.rock;
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
        addItem(state.inventory, dropId, 1);
        updateAllSlotUI();
        setPrompt(`Collected ${ITEMS[dropId].name}`, 1);
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

    const gate = canHarvestResource(resource);
    if (!gate.ok) {
      setPrompt(gate.reason, 1.1);
      return;
    }

    if (!canAddItem(state.inventory, dropId, 1)) {
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
      case "wood":
      case "plank":
        iconCtx.fillStyle = "#8f6238";
        iconCtx.fillRect(cx - s * 0.26, cy - s * 0.18, s * 0.52, s * 0.36);
        iconCtx.strokeStyle = "#c69461";
        iconCtx.lineWidth = 1.2;
        iconCtx.strokeRect(cx - s * 0.26, cy - s * 0.18, s * 0.52, s * 0.36);
        iconCtx.strokeStyle = "rgba(54,35,20,0.4)";
        iconCtx.beginPath();
        iconCtx.moveTo(cx - s * 0.18, cy - s * 0.11);
        iconCtx.lineTo(cx + s * 0.18, cy - s * 0.11);
        iconCtx.moveTo(cx - s * 0.18, cy);
        iconCtx.lineTo(cx + s * 0.18, cy);
        iconCtx.stroke();
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
      case "torch":
      case "lantern":
        iconCtx.fillStyle = itemId === "lantern" ? "#d8bb67" : "#a86b3e";
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

  function openChest(structure) {
    if (!structure) return;
    if (!structure.storage) {
      structure.storage = createEmptyInventory(structure.type === "robot" ? ROBOT_STORAGE_SIZE : CHEST_SIZE);
    }
    state.activeChest = structure;
    if (chestPanelTitle) {
      chestPanelTitle.textContent = structure.type === "robot" ? "Robot Cargo" : "Chest";
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

  function getRecipeOutput(recipe) {
    if (!recipe) return {};
    if (recipe.output && typeof recipe.output === "object") {
      return recipe.output;
    }
    const qty = Math.max(1, Number.isFinite(recipe.outputQty) ? Math.floor(recipe.outputQty) : 1);
    return recipe.id ? { [recipe.id]: qty } : {};
  }

  function renderBuildMenu() {
    buildList.innerHTML = "";
    const recipes = buildTab === "buildings"
      ? BUILD_RECIPES
      : getVisibleUpgradeRecipes(state.player);
    for (const recipe of recipes) {
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
        cost.textContent = recipe.cost
          ? Object.entries(recipe.cost)
              .map(([itemId, qty]) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`)
              .join(", ")
          : "";
      }
      const button = document.createElement("button");

      let disabled = false;
      let lockReason = "";
      if (buildTab === "upgrades") {
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
      if (buildTab !== "upgrades") {
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

    if (recipe.id === "medium_house" && !state.structures.some((s) => !s.removed && (s.type === "small_house" || s.type === "hut"))) {
      setPrompt("Build a small house first", 1.1);
      return;
    }
    if (recipe.id === "large_house" && !state.structures.some((s) => !s.removed && s.type === "medium_house")) {
      setPrompt("Upgrade to medium house first", 1.1);
      return;
    }

    if (buildTab === "upgrades") {
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
        if (isInfiniteResourcesEnabled()) {
          cost.textContent = `Free (Infinite Resources) → ${Object.entries(recipe.output)
            .map(([itemId, qty]) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`)
            .join(", ")}`;
        } else {
          cost.textContent = `${Object.entries(recipe.input)
            .map(([itemId, qty]) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`)
            .join(", ")} → ${Object.entries(recipe.output)
            .map(([itemId, qty]) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`)
            .join(", ")}`;
        }
        card.appendChild(cost);
        const btn = document.createElement("button");
        const hasInput = hasCost(state.inventory, recipe.input);
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
    robot.targetResourceId = null;
    robot.retargetTimer = 0;
    robot.state = "idle";
    clearRobotNavigation(robot);
    setRobotInteractionPause(structure, ROBOT_CONFIG.interactionPause);
    if (netIsClientReady()) {
      sendRobotCommand(structure, "setMode", { mode: normalizedMode });
    } else {
      markDirty();
    }
  }

  function renderRobotStationMenu() {
    const structure = state.activeStation;
    if (!structure || structure.type !== "robot") return;
    const robot = ensureRobotMeta(structure);
    stationTitle.textContent = STRUCTURE_DEFS.robot?.name ?? "Robot";
    stationOptions.innerHTML = "";

    const status = document.createElement("div");
    status.className = "recipe-card";
    const statusTitle = document.createElement("div");
    statusTitle.className = "recipe-title";
    statusTitle.textContent = "Automation Control";
    const statusDesc = document.createElement("div");
    statusDesc.className = "recipe-desc";
    statusDesc.textContent = "Robot mines selected resources automatically and returns home when full.";
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

    const treesCard = document.createElement("div");
    treesCard.className = "recipe-card";
    const treesTitle = document.createElement("div");
    treesTitle.className = "recipe-title";
    treesTitle.textContent = "Mine Trees";
    const treesDesc = document.createElement("div");
    treesDesc.className = "recipe-desc";
    treesDesc.textContent = "Harvests wood from trees in the surrounding islands.";
    const treesBtn = document.createElement("button");
    const treesActive = robot.mode === ROBOT_MODE.trees;
    treesBtn.textContent = treesActive ? "Selected" : "Select";
    treesBtn.disabled = treesActive;
    treesBtn.addEventListener("click", () => {
      setRobotMode(structure, ROBOT_MODE.trees);
      renderRobotStationMenu();
    });
    treesCard.appendChild(treesTitle);
    treesCard.appendChild(treesDesc);
    treesCard.appendChild(treesBtn);
    stationOptions.appendChild(treesCard);

    const stoneCard = document.createElement("div");
    stoneCard.className = "recipe-card";
    const stoneTitle = document.createElement("div");
    stoneTitle.className = "recipe-title";
    stoneTitle.textContent = "Mine Stone";
    const stoneDesc = document.createElement("div");
    stoneDesc.className = "recipe-desc";
    stoneDesc.textContent = "Harvests rock nodes for building and refining.";
    const stoneBtn = document.createElement("button");
    const stoneActive = robot.mode === ROBOT_MODE.stone;
    stoneBtn.textContent = stoneActive ? "Selected" : "Select";
    stoneBtn.disabled = stoneActive;
    stoneBtn.addEventListener("click", () => {
      setRobotMode(structure, ROBOT_MODE.stone);
      renderRobotStationMenu();
    });
    stoneCard.appendChild(stoneTitle);
    stoneCard.appendChild(stoneDesc);
    stoneCard.appendChild(stoneBtn);
    stationOptions.appendChild(stoneCard);

    const grassCard = document.createElement("div");
    grassCard.className = "recipe-card";
    const grassTitle = document.createElement("div");
    grassTitle.className = "recipe-title";
    grassTitle.textContent = "Mine Grass";
    const grassDesc = document.createElement("div");
    grassDesc.className = "recipe-desc";
    grassDesc.textContent = "Harvests grass nodes for paper and utility recipes.";
    const grassBtn = document.createElement("button");
    const grassActive = robot.mode === ROBOT_MODE.grass;
    grassBtn.textContent = grassActive ? "Selected" : "Select";
    grassBtn.disabled = grassActive;
    grassBtn.addEventListener("click", () => {
      setRobotMode(structure, ROBOT_MODE.grass);
      renderRobotStationMenu();
    });
    grassCard.appendChild(grassTitle);
    grassCard.appendChild(grassDesc);
    grassCard.appendChild(grassBtn);
    stationOptions.appendChild(grassCard);

    const invCard = document.createElement("div");
    invCard.className = "recipe-card";
    const invTitle = document.createElement("div");
    invTitle.className = "recipe-title";
    invTitle.textContent = "Robot Inventory";
    const invDesc = document.createElement("div");
    invDesc.className = "recipe-desc";
    invDesc.textContent = "Collect resources gathered by the robot.";
    const invBtn = document.createElement("button");
    invBtn.textContent = "Open Inventory";
    invBtn.addEventListener("click", () => openChest(structure));
    invCard.appendChild(invTitle);
    invCard.appendChild(invDesc);
    invCard.appendChild(invBtn);
    stationOptions.appendChild(invCard);
  }

  function craftStationRecipe(recipe) {
    if (recipe.locked) return;
    if (!hasCost(state.inventory, recipe.input)) {
      setPrompt("Not enough resources", 1.2);
      return;
    }
    if (!canAddItems(state.inventory, recipe.output)) {
      setPrompt("Inventory full", 1.2);
      return;
    }
    applyCost(state.inventory, recipe.input);
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
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    if (!state.inventory) return;
    const left = addItem(state.inventory, "robot", 1);
    if (left > 0) {
      setPrompt("Inventory full", 0.9);
      return;
    }
    updateAllSlotUI();
    setPrompt("Robot added", 1.2);
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
    const cave = addSurfaceCave(world, tile.tx, tile.ty);
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
    const result = spawnVillageAt(world, centerTx, centerTy, Math.random);
    if (!result.ok) {
      setPrompt(result.reason || "Village spawn failed", 1.2);
      return;
    }
    setPrompt(`Village spawned (${result.houses} houses)`, 1.4);
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
      state.surfaceWorld.monsters = [];
      state.surfaceWorld.projectiles = [];
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

    if (state.player.inHut && state.activeHouse && state.housePlayer) {
      const uiLock = inventoryOpen || !!state.activeStation || !!state.activeChest || state.gameWon;
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

    const uiLock = inventoryOpen || !!state.activeStation || !!state.activeChest || state.gameWon;
    const move = uiLock ? { x: 0, y: 0 } : getMoveVector();
    const step = CONFIG.moveSpeed * dt * speedMult;

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
    if (state.torchTimer > 0) {
      state.torchTimer = Math.max(0, state.torchTimer - dt);
    }
  }

  function updateWorldResources(world, dt) {
    if (!world) return;
    if (!Array.isArray(world.resources)) return;
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
      if (res.removed) continue;
    }

    if (!Array.isArray(world.respawnTasks) || world.respawnTasks.length === 0) return;
    for (let i = world.respawnTasks.length - 1; i >= 0; i -= 1) {
      const task = world.respawnTasks[i];
      task.timer -= dt;
      if (task.timer > 0) continue;
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
        state.surfaceWorld.monsters = [];
        state.surfaceWorld.projectiles = [];
      }
    }
  }

  function damagePlayer(amount) {
    if (!state.player) return;
    if (state.player.invincible > 0) return;
    state.player.hp = Math.max(0, state.player.hp - amount);
    state.player.invincible = 0.6;
    playSfx("damage");
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
    closeInventory();
    interactPressed = false;
    attackPressed = false;
    keyState.clear();
    touch.active = false;
    touch.pointerId = null;
    touch.dx = 0;
    touch.dy = 0;
    if (stickKnobEl) stickKnobEl.style.transform = "translate(0px, 0px)";
  }

  function handlePlayerDeath() {
    if (!state.player || state.respawnLock) return;
    state.respawnLock = true;
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
    const items = Array.isArray(message?.items) ? message.items : [];
    if (items.length === 0) return;
    const world = message.world === "cave"
      ? getCaveWorld(message.caveId)
      : state.surfaceWorld;
    if (!world) return;
    const player = net.players.get(conn.peer);
    const x = Number.isFinite(message.x) ? message.x : (player?.x ?? 0);
    const y = Number.isFinite(message.y) ? message.y : (player?.y ?? 0);
    const normalized = items
      .map((entry) => ({
        id: typeof entry?.id === "string" ? entry.id : null,
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
      attackTimer: 0,
      hitTimer: 0,
      wanderTimer: 0,
      dir: { x: 0, y: 0 },
    };
    world.monsters.push(monster);
  }

  function spawnAnimal(world, tx, ty, type = "boar") {
    if (!world.animals) world.animals = [];
    if (!world.nextAnimalId) world.nextAnimalId = 1;
    const cfg = type === "goat"
      ? { hp: 4, speed: 48, color: "#d2cab8", drop: { raw_meat: 1, hide: 1 } }
      : { hp: 5, speed: 42, color: "#9f8160", drop: { raw_meat: 2, hide: 1 } };
    world.animals.push({
      id: world.nextAnimalId++,
      type,
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

  function seedSurfaceAnimals(world, desired = 20) {
    if (!world) return;
    if (!world.animals) world.animals = [];
    let attempts = 0;
    while (world.animals.length < desired && attempts < desired * 50) {
      attempts += 1;
      const tx = Math.floor(Math.random() * world.size);
      const ty = Math.floor(Math.random() * world.size);
      if (!canSpawnAnimalAt(world, tx, ty)) continue;
      const tooClose = world.animals.some((animal) => {
        const ax = Math.floor(animal.x / CONFIG.tileSize);
        const ay = Math.floor(animal.y / CONFIG.tileSize);
        return Math.hypot(ax - tx, ay - ty) < 5;
      });
      if (tooClose) continue;
      spawnAnimal(world, tx, ty, Math.random() < 0.4 ? "goat" : "boar");
    }
  }

  function canSpawnMonsterAt(world, tx, ty, isCave) {
    if (!inBounds(tx, ty, world.size)) return false;
    const idx = tileIndex(tx, ty, world.size);
    if (!world.tiles[idx]) return false;
    if (!isCave) {
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
      spawnMonster(world, tx, ty, { type: pickMonsterType() });
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

  function spawnSurfaceMonsterOnIsland(world, island, players) {
    if (!world || !island) return false;
    const cx = island.x;
    const cy = island.y;
    const maxRadius = Math.max(4, Math.floor(island.radius * 0.82));
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
      spawnMonster(world, tx, ty, { type: pickMonsterType() });
      return true;
    }
    return false;
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
    if (world.monsters.length >= dynamicMax) return;
    const spawnBudget = Math.max(2, Math.min(8, Math.ceil(activeIslands.length * 0.75)));
    const startIndex = Math.floor(Math.random() * activeIslands.length);
    let spawned = 0;

    for (let i = 0; i < activeIslands.length; i += 1) {
      if (spawned >= spawnBudget) break;
      if (world.monsters.length >= dynamicMax) break;
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

  function findNearestMonsterAt(world, position, range = CONFIG.interactRange) {
    if (!world?.monsters) return null;
    let closest = null;
    let closestDist = Infinity;
    for (const monster of world.monsters) {
      const dist = Math.hypot(monster.x - position.x, monster.y - position.y);
      if (dist < range && dist < closestDist) {
        closest = monster;
        closestDist = dist;
      }
    }
    return closest;
  }

  function findNearestMonster(world, player, range = CONFIG.interactRange) {
    return findNearestMonsterAt(world, player, range);
  }

  function findNearestAnimalAt(world, position, range = CONFIG.interactRange) {
    if (!world?.animals) return null;
    let closest = null;
    let closestDist = Infinity;
    for (const animal of world.animals) {
      if (!animal || animal.hp <= 0) continue;
      const dist = Math.hypot(animal.x - position.x, animal.y - position.y);
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

  function performAttack() {
    if (state.player.attackTimer > 0) return;
    const combatWorld = getCombatWorld();
    if (!combatWorld) return;
    const canFightMonsters = canDamageMonsters(state.player);
    const targetMonster = findNearestMonsterAt(combatWorld, state.player, MONSTER.attackRange + 8);
    const targetAnimal = targetMonster
      ? null
      : findNearestAnimalAt(combatWorld, state.player, MONSTER.attackRange + 8);
    if (targetMonster && !canFightMonsters) {
      setPrompt("Need a sword upgrade", 0.9);
      return;
    }
    state.player.attackTimer = 0.35;
    playSfx("swing");
    if (netIsClient()) {
      if (targetMonster || targetAnimal) {
        playSfx("hit");
      }
      sendToHost({
        type: "attack",
        world: state.inCave ? "cave" : "surface",
        caveId: state.activeCave?.id ?? null,
        damage: getAttackDamage(state.player),
        unlocks: normalizeUnlocks(state.player.unlocks),
        x: state.player.x,
        y: state.player.y,
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
    if (targetAnimal.hp <= 0) {
      targetAnimal.hp = 0;
      const drop = targetAnimal.drop || { raw_meat: 1 };
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
  }

  function damageRemotePlayer(player, amount) {
    if (!player) return;
    player.hp = Math.max(0, player.hp - amount);
    const conn = net.connections.get(player.id);
    if (player.hp <= 0) {
      if (conn?.open) {
        conn.send({
          type: "damage",
          hp: 0,
          maxHp: player.maxHp,
        });
      }
      respawnRemotePlayer(player);
    } else if (conn?.open) {
      conn.send({
        type: "damage",
        hp: player.hp,
        maxHp: player.maxHp,
      });
    }
  }

  function spawnMonsterArrow(world, monster, target, baseDamage) {
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
      x: monster.x + Math.cos(theta) * 14,
      y: monster.y + Math.sin(theta) * 14,
      vx,
      vy,
      damage: baseDamage,
      radius: SKELETON_ARROW.radius,
      life: 0,
      maxLife: travelTime + 0.3,
    });
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
      projectile.life = (projectile.life || 0) + dt;
      if (projectile.life > (projectile.maxLife || SKELETON_ARROW.maxLife)) {
        world.projectiles.splice(i, 1);
        continue;
      }

      const nextX = prevX + (projectile.vx || 0) * dt;
      const nextY = prevY + (projectile.vy || 0) * dt;
      if (!isWalkableAtWorld(world, nextX, nextY)) {
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
        if (target.id === (net.playerId || "local")) {
          damagePlayer(amount);
        } else if (net.isHost) {
          damageRemotePlayer(target, amount);
        }
        world.projectiles.splice(i, 1);
        hit = true;
        break;
      }
      if (hit) continue;
    }
  }

  function updateMonstersInWorld(world, dt, players, isSurface) {
    if (!world) return;
    if (!world.monsters) world.monsters = [];
    if (!world.projectiles) world.projectiles = [];
    if (!world.nextProjectileId) world.nextProjectileId = 1;

    if (isSurface) {
      if (players.length === 0) {
        // No surface players active: clear transient arrows so they do not freeze mid-flight.
        world.projectiles = [];
        return;
      }
      if (state.isNight) {
        state.surfaceSpawnTimer -= dt;
        if (state.surfaceSpawnTimer <= 0) {
          spawnSurfaceMonstersForActiveIslands(world, players);
          state.surfaceSpawnTimer = MONSTER.spawnInterval;
        }
      } else {
        world.monsters = [];
        world.projectiles = [];
      }
    }

    updateMonsterProjectiles(world, dt, players, isSurface);

    for (let i = world.monsters.length - 1; i >= 0; i -= 1) {
      const monster = world.monsters[i];
      if (monster.hitTimer > 0) monster.hitTimer -= dt;
      if (monster.attackTimer > 0) monster.attackTimer -= dt;

      if (monster.hp <= 0) {
        world.monsters.splice(i, 1);
        continue;
      }

      let target = null;
      let targetDist = Infinity;
      for (const player of players) {
        if (isSurface && player.inHut && !player.inCave) continue;
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const dist = Math.hypot(dx, dy);
        if (dist < targetDist) {
          target = player;
          targetDist = dist;
        }
      }

      if (isSurface && targetDist > Math.max(viewWidth, viewHeight) + MONSTER.aggroRange) {
        continue;
      }

      const aggroRange = monster.aggroRange ?? MONSTER.aggroRange;
      const meleeRange = monster.attackRange ?? MONSTER.attackRange;
      const hitDamage = monster.damage ?? MONSTER.damage;
      const hitCooldown = monster.attackCooldown ?? MONSTER.attackCooldown;
      const rangedRange = monster.rangedRange ?? 0;

      if (target && targetDist < aggroRange) {
        const dx = target.x - monster.x;
        const dy = target.y - monster.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const vx = dx / dist;
        const vy = dy / dist;
        const isRanged = rangedRange > meleeRange + 10;

        if (isRanged && dist > meleeRange * 1.05 && dist < rangedRange) {
          if (monster.attackTimer <= 0) {
            spawnMonsterArrow(world, monster, target, hitDamage);
            monster.attackTimer = hitCooldown;
          }

          const desired = rangedRange * 0.62;
          let moveDir = 0;
          if (dist < desired * 0.88) moveDir = -1;
          else if (dist > desired * 1.18) moveDir = 1;
          if (moveDir !== 0) {
            const step = monster.speed * 0.7 * dt;
            const nextX = monster.x + vx * step * moveDir;
            const nextY = monster.y + vy * step * moveDir;
            if (isWalkableAtWorld(world, nextX, monster.y)) monster.x = nextX;
            if (isWalkableAtWorld(world, monster.x, nextY)) monster.y = nextY;
          }
        } else {
          const step = monster.speed * dt;
          const nextX = monster.x + vx * step;
          const nextY = monster.y + vy * step;
          if (isWalkableAtWorld(world, nextX, monster.y)) monster.x = nextX;
          if (isWalkableAtWorld(world, monster.x, nextY)) monster.y = nextY;

          if (dist < meleeRange && monster.attackTimer <= 0) {
            if (target.id === (net.playerId || "local")) {
              damagePlayer(hitDamage);
            } else if (net.isHost) {
              damageRemotePlayer(target, hitDamage);
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
        const nextX = monster.x + monster.dir.x * step;
        const nextY = monster.y + monster.dir.y * step;
        if (isWalkableAtWorld(world, nextX, monster.y)) monster.x = nextX;
        if (isWalkableAtWorld(world, monster.x, nextY)) monster.y = nextY;
      }
    }
  }

  function updateMonsters(dt) {
    if (!state.player) return;
    if (state.player.invincible > 0) state.player.invincible -= dt;
    if (state.player.attackTimer > 0) state.player.attackTimer -= dt;
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
    world.animalSpawnTimer -= dt;
    if (world.animalSpawnTimer <= 0) {
      world.animalSpawnTimer = 5 + Math.random() * 4;
      if (world.animals.length < maxAnimals) {
        for (let attempt = 0; attempt < 16; attempt += 1) {
          const tx = Math.floor(Math.random() * world.size);
          const ty = Math.floor(Math.random() * world.size);
          if (!canSpawnAnimalAt(world, tx, ty)) continue;
          spawnAnimal(world, tx, ty, Math.random() < 0.4 ? "goat" : "boar");
          break;
        }
      }
    }

    for (let i = world.animals.length - 1; i >= 0; i -= 1) {
      const animal = world.animals[i];
      if (animal.hitTimer > 0) animal.hitTimer -= dt;
      if (animal.hp <= 0) {
        world.animals.splice(i, 1);
        continue;
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
  }

  function getRobotHomeWorldPosition(robot) {
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

  function findRobotTargetResource(world, structure, robot) {
    if (!world || !robot || !Array.isArray(world.resources)) return null;
    const home = getRobotHomeWorldPosition(robot);
    const maxHomeDist = CONFIG.tileSize * 36;
    const candidates = [];
    for (const resource of world.resources) {
      if (!robotCanMineResource(robot, resource)) continue;
      const homeDist = Math.hypot(resource.x - home.x, resource.y - home.y);
      if (homeDist > maxHomeDist) continue;
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
    return null;
  }

  function updateRobot(structure, world, dt) {
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

    const home = getRobotHomeWorldPosition(robot);
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
      robot.targetResourceId = null;
      return;
    }

    let target = Number.isInteger(robot.targetResourceId)
      ? world.resources?.[robot.targetResourceId] ?? null
      : null;
    if (!robotCanMineResource(robot, target)) {
      target = null;
      robot.targetResourceId = null;
      clearRobotNavigation(robot);
    }

    if (!target && robot.retargetTimer <= 0) {
      target = findRobotTargetResource(world, structure, robot);
      robot.targetResourceId = target ? target.id : null;
      robot.retargetTimer = ROBOT_CONFIG.retargetInterval;
      if (!target) clearRobotNavigation(robot);
    }

    if (!target) {
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
        const stuckLimit = isRobotOnBeachTile(world, robot)
          ? ROBOT_CONFIG.sandStuckRetargetTime
          : ROBOT_CONFIG.stuckRetargetTime;
        if (nav.stuckTimer >= stuckLimit) {
          robot.targetResourceId = null;
          robot.retargetTimer = 0;
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
      robot.targetResourceId = null;
      robot.retargetTimer = 0;
      robot.state = "idle";
      clearRobotNavigation(robot);
      return;
    }

    stabilizeResourceHp(target);
    const nextDamage = Math.max(1, Math.floor(ROBOT_CONFIG.mineDamage));
    const willBreak = target.hp <= nextDamage;
    if (willBreak && !canAddItem(structure.storage, dropId, 1)) {
      robot.targetResourceId = null;
      robot.state = "returning";
      clearRobotNavigation(robot);
      return;
    }

    const canHear = shouldPlayWorldSfx(world, robot.x, robot.y);
    applyHarvestToResource(world, target, nextDamage, false, canHear);
    if (willBreak) {
      addItem(structure.storage, dropId, 1);
      robot.targetResourceId = null;
      robot.retargetTimer = 0;
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
    for (const structure of state.structures) {
      if (!structure || structure.removed || structure.type !== "robot") continue;
      const before = getRobotPosition(structure);
      updateRobot(structure, world, dt);
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

  function getPlacementItem() {
    if (state.gameWon) return null;
    if (state.inCave || inventoryOpen || state.activeStation || state.activeChest) return null;
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
    markDirty();
    if (net.enabled) sendPlayerUpdate();
  }

  function useActiveConsumable() {
    const slot = state.inventory[activeSlot];
    if (!slot?.id) return false;
    const consumedId = slot.id;
    if (consumedId !== "medicine" && consumedId !== "cooked_meat" && consumedId !== "torch") return false;
    if (consumedId === "torch") {
      state.torchTimer = Math.max(state.torchTimer, 90);
      slot.qty -= 1;
      if (slot.qty <= 0) {
        slot.id = null;
        slot.qty = 0;
      }
      updateAllSlotUI();
      markDirty();
      setPrompt("Torch lit: brighter nights and stronger attacks", 1.1);
      return true;
    }
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
      state.surfaceWorld.monsters = [];
      state.surfaceWorld.projectiles = [];
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
    state.targetResource = inHouse ? null : findNearestResource(combatWorld, state.player);
    state.targetMonster = inHouse ? null : findNearestMonster(combatWorld, state.player, MONSTER.attackRange + 12);
    state.targetAnimal = inHouse ? null : findNearestAnimalAt(combatWorld, state.player, MONSTER.attackRange + 12);
    const resourceGate = state.targetResource ? canHarvestResource(state.targetResource) : { ok: true, reason: "" };
    const swordUnlocked = canDamageMonsters(state.player);

    if (inHouse) {
      state.nearBench = false;
      state.nearCave = null;
      state.nearDock = null;
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
      state.nearBench = !!findNearestStructure(state.player, (structure) => structure.type === "bench");
      state.nearStation = findNearestStructure(state.player, (structure) => STRUCTURE_DEFS[structure.type]?.station);
      state.nearChest = findNearestStructure(state.player, (structure) => structure.type === "chest");
      state.nearDock = findNearestStructure(state.player, (structure) => structure.type === "dock");
      state.nearCave = findNearestCave(state.surfaceWorld, state.player);
      state.nearHouse = findNearestStructure(state.player, (structure) => isHouseType(structure.type));
      state.nearBed = findNearestStructure(state.player, (structure) => structure.type === "bed");
    } else {
      state.nearBench = false;
      state.nearStation = null;
      state.nearChest = null;
      state.nearDock = null;
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
          else if (state.targetMonster && !swordUnlocked) setPrompt("Need a sword upgrade");
          else if (state.targetMonster || state.targetAnimal) setPrompt("Press Space / Tap Attack");
          else if (state.targetResource && !resourceGate.ok) setPrompt(resourceGate.reason);
          else if (state.targetResource) setPrompt(`Press Space / Tap Attack to ${getResourceActionName(state.targetResource)}`);
          else setPrompt("Wind echoes through the cave");
        }
      } else if (state.activeChest) {
        setPrompt("Chest open");
      } else if (state.nearChest) {
        setPrompt("Press E to open chest");
      } else if (state.activeStation) {
        setPrompt("Station open");
      } else if (state.nearStation) {
        setPrompt(`Press E to use ${STRUCTURE_DEFS[state.nearStation.type]?.name}`);
      } else if (state.nearDock) {
        setPrompt("Press E to set dock checkpoint");
      } else if (state.nearBed && state.isNight) {
        setPrompt("Press E to sleep");
      } else if (state.nearCave) {
        setPrompt("Press E to enter cave");
      } else if (state.nearHouse) {
        setPrompt("Press E to enter house");
      } else if (state.targetMonster && !swordUnlocked) {
        setPrompt("Need a sword upgrade");
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
      } else if (state.activeChest) {
        closeChest();
      } else if (state.activeStation) {
        closeStationMenu();
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
      if (state.inCave) {
        if (state.targetMonster || state.targetAnimal) performAttack();
        else attemptHarvest(state.targetResource);
      } else if (!state.player.inHut) {
        if (state.targetMonster || state.targetAnimal) performAttack();
        else if (!useActiveConsumable()) attemptHarvest(state.targetResource);
      }
      attackPressed = false;
    }

    if (!state.inCave && !state.player.inHut && state.nearBench) {
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
    updateDayNight(dt);
    updateResources(dt);
    updateMonsters(dt);
    updateAnimals(dt);
    maintainRobotInteractionPause(dt);
    updateRobots(dt);
    updatePlayerEffects(dt);
    updateDrops();
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
    if (type === "brute") {
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

    if (monster.hitTimer > 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 13, 0, Math.PI * 2);
      ctx.stroke();
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
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(screen.x, screen.y + 9, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = animal.color || "#9f8160";
    ctx.beginPath();
    ctx.ellipse(screen.x, screen.y, 11, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = tintColor(animal.color || "#9f8160", -0.2);
    ctx.beginPath();
    ctx.arc(screen.x + 8, screen.y - 2, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#2b2118";
    ctx.beginPath();
    ctx.arc(screen.x + 10, screen.y - 3, 1.5, 0, Math.PI * 2);
    ctx.fill();
    if (animal.hitTimer > 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.65)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 15, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawStructure(structure, camera) {
    if (structure.removed) return;
    const def = STRUCTURE_DEFS[structure.type];
    if (!def) return;
    const footprint = getStructureFootprint(structure.type);
    let worldX = structure.tx * CONFIG.tileSize;
    let worldY = structure.ty * CONFIG.tileSize;
    if (structure.type === "robot") {
      const robot = ensureRobotMeta(structure);
      if (robot) {
        worldX = robot.x - CONFIG.tileSize * 0.5;
        worldY = robot.y - CONFIG.tileSize * 0.5;
      }
    }
    const screenX = worldX - camera.x;
    const screenY = worldY - camera.y;
    const structureWidthPx = footprint.w * CONFIG.tileSize;
    const structureHeightPx = footprint.h * CONFIG.tileSize;
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
      case "lantern": {
        ctx.fillStyle = tintColor(def.color, -0.2);
        ctx.fillRect(baseX + baseSize / 2 - 2, baseY + 6, 4, baseSize - 10);
        ctx.fillStyle = "#f7d77a";
        ctx.fillRect(baseX + baseSize / 2 - 6, baseY + 8, 12, 10);
        ctx.strokeStyle = "rgba(255,215,140,0.6)";
        ctx.strokeRect(baseX + baseSize / 2 - 6, baseY + 8, 12, 10);
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
        : structure.type === "lantern"
          ? "rgba(255, 221, 154, 0.36)"
          : "rgba(255, 232, 188, 0.3)";
      const warmMid = structure.type === "campfire"
        ? "rgba(255, 122, 64, 0.2)"
        : structure.type === "lantern"
          ? "rgba(248, 189, 95, 0.16)"
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
    if (state.player && state.torchTimer > 0) {
      const cx = state.player.x - camera.x;
      const cy = state.player.y - camera.y;
      const radius = 130;
      const gradient = ctx.createRadialGradient(cx, cy, 18, cx, cy, radius);
      gradient.addColorStop(0, "rgba(255, 214, 145, 0.35)");
      gradient.addColorStop(0.52, "rgba(250, 176, 90, 0.16)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const remote of net.players.values()) {
      if (!remote || remote.inCave || remote.inHut) continue;
      if ((remote.torchTimer ?? 0) <= 0) continue;
      const px = typeof remote.renderX === "number" ? remote.renderX : remote.x;
      const py = typeof remote.renderY === "number" ? remote.renderY : remote.y;
      if (typeof px !== "number" || typeof py !== "number") continue;
      const cx = px - camera.x;
      const cy = py - camera.y;
      const radius = 130;
      const gradient = ctx.createRadialGradient(cx, cy, 18, cx, cy, radius);
      gradient.addColorStop(0, "rgba(255, 214, 145, 0.35)");
      gradient.addColorStop(0.52, "rgba(250, 176, 90, 0.16)");
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
    } else if (item.type === "lantern") {
      ctx.fillStyle = tintColor(color, -0.2);
      ctx.fillRect(x + size / 2 - 2, y + 8, 4, size - 14);
      ctx.fillStyle = "#f7d77a";
      ctx.fillRect(x + size / 2 - 6, y + 10, 12, 10);
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
  }

  function drawGuidanceMapOverlay() {
    const mapItemId = getActiveMapItemId();
    if (!mapItemId) return;
    const world = state.surfaceWorld || state.world;
    if (!world || !Array.isArray(world.tiles)) return;
    const localPos = getLocalSurfaceMapPosition();
    if (!localPos) return;

    const panelSize = clamp(
      Math.floor(Math.min(viewWidth, viewHeight) * MAP_PANEL.screenScale),
      MAP_PANEL.minSize,
      MAP_PANEL.maxSize
    );
    const panelX = 16;
    const panelY = 70;
    const titleH = 22;
    const pad = 10;
    const mapSize = panelSize - pad * 2;
    const mapX = panelX + pad;
    const mapY = panelY + titleH + 4;
    const mapBottom = mapY + mapSize;

    const mapTexture = ensureSurfaceMapTexture(world, mapSize);
    if (!mapTexture) return;

    const worldPxSize = world.size * CONFIG.tileSize;
    const toMap = (wx, wy) => ({
      x: mapX + clamp(wx / worldPxSize, 0, 1) * mapSize,
      y: mapY + clamp(wy / worldPxSize, 0, 1) * mapSize,
    });

    const marker = getMapTargetForItem(world, mapItemId, localPos.x, localPos.y);

    ctx.save();
    drawRoundedRect(ctx, panelX, panelY, panelSize, panelSize + titleH + 12, 12);
    ctx.fillStyle = "rgba(8, 20, 34, 0.86)";
    ctx.fill();
    ctx.strokeStyle = "rgba(130, 185, 228, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = "bold 12px Trebuchet MS";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#e9f4ff";
    ctx.fillText(mapItemId === "village_map" ? "Village Map" : "Cave Map", panelX + 10, panelY + 13);

    ctx.drawImage(mapTexture, mapX, mapY, mapSize, mapSize);
    ctx.strokeStyle = "rgba(225, 245, 255, 0.45)";
    ctx.lineWidth = 1;
    ctx.strokeRect(mapX + 0.5, mapY + 0.5, mapSize - 1, mapSize - 1);

    if (marker) {
      const hint = toMap(marker.x, marker.y);
      ctx.strokeStyle = mapItemId === "village_map" ? "rgba(255, 213, 124, 0.92)" : "rgba(164, 201, 255, 0.92)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hint.x - 6, hint.y - 6);
      ctx.lineTo(hint.x + 6, hint.y + 6);
      ctx.moveTo(hint.x + 6, hint.y - 6);
      ctx.lineTo(hint.x - 6, hint.y + 6);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.32)";
      ctx.beginPath();
      ctx.arc(hint.x, hint.y, 13, 0, Math.PI * 2);
      ctx.stroke();
    }

    const localDot = toMap(localPos.x, localPos.y);
    ctx.fillStyle = "#7ec4ff";
    ctx.beginPath();
    ctx.arc(localDot.x, localDot.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    if (net.enabled) {
      for (const player of net.players.values()) {
        if (!player) continue;
        let px = player.x;
        let py = player.y;
        if (player.inCave) {
          const cp = normalizeCheckpoint(player.checkpoint);
          if (!cp) continue;
          px = cp.x;
          py = cp.y;
        }
        if (!Number.isFinite(px) || !Number.isFinite(py)) continue;
        const dot = toMap(px, py);
        ctx.fillStyle = player.color || "#f4f7ff";
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.font = "10px Trebuchet MS";
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(230, 244, 255, 0.82)";
    if (marker) {
      ctx.fillText(`X: ${marker.label}`, mapX, mapBottom + 11);
    } else {
      ctx.fillText("No target found in this world yet", mapX, mapBottom + 11);
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
      } else if (res.type === "grass") {
        ctx.strokeStyle = tintColor(biome.tree, 0.3);
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
            : biome.rock;
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
    }

    for (const monster of state.world.monsters || []) {
      drawMonster(monster, camera);
    }

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
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.beginPath();
      ctx.ellipse(screen.x, screen.y + 6, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(screen.x - 2, screen.y - 2, 2, 0, Math.PI * 2);
      ctx.fill();
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
      const screen = worldToScreen(state.targetMonster.x, state.targetMonster.y, camera);
      ctx.strokeStyle = "rgba(255, 80, 80, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 18, 0, Math.PI * 2);
      ctx.stroke();
    }

    if (state.targetAnimal) {
      const screen = worldToScreen(state.targetAnimal.x, state.targetAnimal.y, camera);
      ctx.strokeStyle = "rgba(255, 180, 100, 0.8)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 16, 0, Math.PI * 2);
      ctx.stroke();
    }

    const placement = getPlacementItem();
    if (placement) {
      const { tx, ty } = getPlacementTile();
      if (inBounds(tx, ty, state.world.size)) {
        const placeResult = canPlaceItem(placement.itemId, tx, ty);
        const valid = placeResult.ok;

        const previewType = isHouseType(placement.itemDef.placeType) ? placement.itemDef.placeType : null;
        const anchorTx = (placeResult.upgradeHouse && placeResult.targetHouse)
          ? placeResult.targetHouse.tx
          : tx;
        const anchorTy = (placeResult.upgradeHouse && placeResult.targetHouse)
          ? placeResult.targetHouse.ty
          : ty;
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

  function handleStickDown(event) {
    ensureAudioContext();
    touch.active = true;
    touch.pointerId = event.pointerId;
    const rect = stickEl.getBoundingClientRect();
    touch.centerX = rect.left + rect.width / 2;
    touch.centerY = rect.top + rect.height / 2;
    updateStick(event.clientX, event.clientY);
    stickEl.setPointerCapture(event.pointerId);
  }

  function updateStick(x, y) {
    const maxDist = 40;
    const dx = x - touch.centerX;
    const dy = y - touch.centerY;
    const dist = Math.hypot(dx, dy);
    const clamped = dist > maxDist ? maxDist / dist : 1;
    const nx = dx * clamped;
    const ny = dy * clamped;
    stickKnobEl.style.transform = `translate(${nx}px, ${ny}px)`;
    touch.dx = nx / maxDist;
    touch.dy = ny / maxDist;
  }

  function handleStickMove(event) {
    if (!touch.active || event.pointerId !== touch.pointerId) return;
    updateStick(event.clientX, event.clientY);
  }

  function handleStickUp(event) {
    if (event.pointerId !== touch.pointerId) return;
    touch.active = false;
    touch.pointerId = null;
    touch.dx = 0;
    touch.dy = 0;
    stickKnobEl.style.transform = "translate(0px, 0px)";
  }

  function handleCanvasMove(event) {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }

  function handleCanvasLeave() {
    pointer.active = false;
  }

  function handleCanvasDown() {
    ensureAudioContext();
    const placement = getPlacementItem();
    if (placement) {
      attemptPlace();
    }
  }

  function init() {
    loadUserSettings();
    setupSlots();
    resize();
    if (startScreen) startScreen.classList.remove("hidden");
    setSettingsTab("settings");
    updateVolumeUI();
    setDebugUnlocked(state.debugUnlocked, false);
    updateDebugSpeedUI();
    updateMosesButton();
    updateInfiniteResourcesButton();
    if (settingsPanel) settingsPanel.classList.add("hidden");

    window.addEventListener("resize", resize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("beforeunload", saveGame);

    stickEl.addEventListener("pointerdown", handleStickDown);
    stickEl.addEventListener("pointermove", handleStickMove);
    stickEl.addEventListener("pointerup", handleStickUp);
    stickEl.addEventListener("pointercancel", handleStickUp);

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

    buildTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        buildTabs.forEach((btn) => btn.classList.remove("active"));
        tab.classList.add("active");
        buildTab = tab.dataset.tab;
        renderBuildMenu();
      });
    });

    destroyChestBtn.addEventListener("click", destroyActiveChest);
    if (newRunBtn) {
      newRunBtn.addEventListener("click", () => {
        promptNewSeed();
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
    gameLoop();
  }

  init();
})();
