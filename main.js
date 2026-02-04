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
  const chestSlotsEl = document.getElementById("chestSlots");
  const destroyChestBtn = document.getElementById("destroyChest");
  const objectiveDisplay = document.getElementById("objectiveDisplay");
  const endScreen = document.getElementById("endScreen");
  const newRunBtn = document.getElementById("newRunBtn");
  const stickEl = document.getElementById("stick");
  const stickKnobEl = document.getElementById("stickKnob");
  const actionBtn = document.getElementById("actionBtn");
  const mpStatus = document.getElementById("mpStatus");
  const roomDisplay = document.getElementById("roomDisplay");
  const mpCopy = document.getElementById("mpCopy");
  const mpJoin = document.getElementById("mpJoin");

  const buildTabs = Array.from(buildMenu.querySelectorAll(".tab-btn"));

  const CONFIG = {
    tileSize: 32,
    worldSize: 160,
    playerRadius: 12,
    moveSpeed: 150,
    interactRange: 55,
    saveInterval: 5,
    dayLength: 180,
    nightLength: 120,
  };

  const MONSTER = {
    surfaceMax: 6,
    caveMax: 4,
    spawnInterval: 6,
    spawnMinTiles: 6,
    spawnMaxTiles: 10,
    speed: 55,
    hp: 6,
    damage: 8,
    attackRange: 26,
    attackCooldown: 1.1,
    aggroRange: 180,
  };

  const NET_CONFIG = {
    snapshotInterval: 0.18,
    playerSendInterval: 0.07,
    renderSmooth: 12,
    monsterSmooth: 10,
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
  };

  const CAVE_SIZE = 28;

  const SAVE_KEY = "island_survival_save_v1";
  const SAVE_VERSION = 4;
  const HOTBAR_SIZE = 4;
  const INVENTORY_SIZE = 8;
  const CHEST_SIZE = 8;
  const MAX_STACK = 99;

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
    ore: { name: "Ore", color: "#8d5aa3" },
    ingot: { name: "Ingot", color: "#c9b36c" },
    plank: { name: "Plank", color: "#b58752" },
    ...BIOME_STONE_ITEMS,
    bridge: { name: "Bridge", color: "#c7b37a", placeable: true, placeType: "bridge" },
    floor: { name: "Floor", color: "#b58a4f", placeable: true, placeType: "floor" },
    wall: { name: "Wall", color: "#7e5f3a", placeable: true, placeType: "wall" },
    brick: { name: "Brick", color: "#b46a4d" },
    brick_floor: { name: "Brick Floor", color: "#b46a4d", placeable: true, placeType: "brick_floor" },
    brick_wall: { name: "Brick Wall", color: "#a95f45", placeable: true, placeType: "brick_wall" },
    fence: { name: "Fence", color: "#8e6a3f", placeable: true, placeType: "fence" },
    dock: { name: "Dock", color: "#c3a76b", placeable: true, placeType: "dock" },
    hut: { name: "Hut", color: "#a57a4a", placeable: true, placeType: "hut" },
    campfire: { name: "Campfire", color: "#d37a3a", placeable: true, placeType: "campfire" },
    lantern: { name: "Lantern", color: "#cfae5d", placeable: true, placeType: "lantern" },
    beacon: { name: "Rescue Beacon", color: "#d9c27a", placeable: true, placeType: "beacon" },
    smelter: { name: "Smelter", color: "#b05b5b", placeable: true, placeType: "smelter" },
    sawmill: { name: "Sawmill", color: "#7d6a46", placeable: true, placeType: "sawmill" },
    kiln: { name: "Kiln", color: "#b37d5c", placeable: true, placeType: "kiln" },
    chest: { name: "Chest", color: "#a8794a", placeable: true, placeType: "chest" },
  };

  const TOOL_TIERS = [
    { name: "Basic", damage: 1 },
    { name: "Hardened", damage: 2 },
    { name: "Metal", damage: 3 },
  ];

  const STRUCTURE_DEFS = {
    bench: { name: "Crafting Bench", color: "#6d4d2c", blocking: true, walkable: false },
    floor: { name: "Floor", color: "#b58a4f", blocking: false, walkable: true },
    bridge: { name: "Bridge", color: "#c7b37a", blocking: false, walkable: true },
    dock: { name: "Dock", color: "#c3a76b", blocking: false, walkable: true },
    wall: { name: "Wall", color: "#6b4b2c", blocking: true, walkable: false },
    brick_floor: { name: "Brick Floor", color: "#b46a4d", blocking: false, walkable: true },
    brick_wall: { name: "Brick Wall", color: "#a95f45", blocking: true, walkable: false },
    fence: { name: "Fence", color: "#8b6a3f", blocking: true, walkable: false },
    hut: { name: "Hut", color: "#8b5d3c", blocking: true, walkable: false },
    campfire: { name: "Campfire", color: "#d37a3a", blocking: true, walkable: false, lightRadius: 90 },
    lantern: { name: "Lantern", color: "#cfae5d", blocking: true, walkable: false, lightRadius: 70 },
    beacon: { name: "Rescue Beacon", color: "#d9c27a", blocking: true, walkable: false, lightRadius: 120, beacon: true },
    smelter: { name: "Smelter", color: "#b05b5b", blocking: true, walkable: false, station: true },
    sawmill: { name: "Sawmill", color: "#7d6a46", blocking: true, walkable: false, station: true },
    kiln: { name: "Kiln", color: "#b37d5c", blocking: true, walkable: false, station: true },
    chest: { name: "Chest", color: "#a8794a", blocking: true, walkable: false, storage: true },
  };

  const BUILD_RECIPES = [
    { id: "bridge", name: "Bridge", cost: { wood: 4 } },
    { id: "floor", name: "Floor", cost: { wood: 2 } },
    { id: "wall", name: "Wall", cost: { wood: 3 } },
    { id: "brick_floor", name: "Brick Floor", cost: { brick: 2 } },
    { id: "brick_wall", name: "Brick Wall", cost: { brick: 3 } },
    { id: "fence", name: "Fence", cost: { wood: 2 } },
    { id: "dock", name: "Dock", cost: { wood: 3, plank: 1 } },
    { id: "hut", name: "Hut", cost: { wood: 10, stone: 4 } },
    { id: "campfire", name: "Campfire", cost: { wood: 4, stone: 2 } },
    { id: "lantern", name: "Lantern", cost: { plank: 2, ingot: 1 } },
    { id: "chest", name: "Chest", cost: { wood: 6, plank: 2 } },
    { id: "smelter", name: "Smelter", cost: { stone: 8, wood: 4 } },
    { id: "sawmill", name: "Sawmill", cost: { wood: 8, stone: 2 } },
    { id: "kiln", name: "Kiln", cost: { stone: 6, wood: 2 } },
    {
      id: "beacon",
      name: "Rescue Beacon",
      cost: {
        plank: 12,
        ingot: 6,
        stone: 10,
        ...BEACON_BIOME_COST,
      },
    },
  ];

  const UPGRADE_RECIPES = [
    { id: "tool_tier_2", name: "Hardened Tools", cost: { wood: 12, stone: 8 }, tier: 2 },
    { id: "tool_tier_3", name: "Metal Tools", cost: { ingot: 6, plank: 4 }, tier: 3 },
  ];

  const STATION_RECIPES = {
    smelter: [
      { name: "Smelt Ingot", input: { ore: 1, wood: 1 }, output: { ingot: 1 } },
    ],
    sawmill: [
      { name: "Saw Planks", input: { wood: 2 }, output: { plank: 1 } },
    ],
    kiln: [
      { name: "Bake Bricks", input: { stone: 2, wood: 1 }, output: { brick: 1 } },
    ],
  };

  const BIOMES = [
    {
      key: "temperate",
      land: [43, 122, 61],
      tree: "#1f6f3b",
      rock: "#8b8f9c",
      ore: "#8d5aa3",
      stoneColor: BIOME_STONES[0].color,
      sand: [214, 195, 141],
      treeRate: 0.075,
      rockRate: 0.035,
      oreRate: 0.012,
      stoneRate: 0.004,
    },
    {
      key: "jungle",
      land: [28, 110, 70],
      tree: "#20a15a",
      rock: "#7c8a90",
      ore: "#7a4c8b",
      stoneColor: BIOME_STONES[1].color,
      sand: [207, 184, 124],
      treeRate: 0.11,
      rockRate: 0.03,
      oreRate: 0.01,
      stoneRate: 0.004,
    },
    {
      key: "snow",
      land: [190, 206, 220],
      tree: "#2f7a69",
      rock: "#9fa7b5",
      ore: "#7f6a9f",
      stoneColor: BIOME_STONES[2].color,
      sand: [226, 217, 184],
      treeRate: 0.045,
      rockRate: 0.045,
      oreRate: 0.015,
      stoneRate: 0.004,
    },
    {
      key: "volcanic",
      land: [90, 72, 64],
      tree: "#6b5a42",
      rock: "#6d6f7a",
      ore: "#c0724c",
      stoneColor: BIOME_STONES[3].color,
      sand: [201, 160, 113],
      treeRate: 0.02,
      rockRate: 0.04,
      oreRate: 0.03,
      stoneRate: 0.004,
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

  let dpr = window.devicePixelRatio || 1;
  let viewWidth = window.innerWidth;
  let viewHeight = window.innerHeight;

  const keyState = new Map();
  let actionPressed = false;
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

  const state = {
    world: null,
    surfaceWorld: null,
    player: null,
    inventory: null,
    structures: [],
    structureGrid: null,
    targetResource: null,
    targetMonster: null,
    nearBench: false,
    nearStation: null,
    nearChest: null,
    nearCave: null,
    nearHut: null,
    activeStation: null,
    activeChest: null,
    activeCave: null,
    inCave: false,
    returnPosition: null,
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
    snapshotTimer: NET_CONFIG.snapshotInterval,
    playerTimer: NET_CONFIG.playerSendInterval,
    localName: "",
    localColor: "",
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

  function smoothstep(t) {
    return t * t * (3 - 2 * t);
  }

  function smoothValue(current, target, dt, speed = NET_CONFIG.renderSmooth) {
    const factor = 1 - Math.exp(-dt * speed);
    return current + (target - current) * factor;
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
      case "harvest":
        if (net.isHost) handleHarvestRequest(message);
        break;
      case "attack":
        if (net.isHost) handleAttackRequest(message);
        break;
      case "chestUpdate":
        if (net.isHost) handleChestUpdate(message);
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
        inHut: state.player.inHut,
        inCave: state.inCave,
        caveId: state.activeCave?.id ?? null,
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
        inHut: player.inHut,
        inCave: player.inCave,
        caveId: player.caveId,
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
        x: monster.x,
        y: monster.y,
        hp: monster.hp,
        maxHp: monster.maxHp,
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
      }));
  }

  function buildMonstersFromSnapshot(previous, snapshotMonsters) {
    const prevMap = new Map(
      Array.isArray(previous) ? previous.map((monster) => [monster.id, monster]) : []
    );
    if (!Array.isArray(snapshotMonsters)) return [];
    return snapshotMonsters.map((monster) => {
      const prev = prevMap.get(monster.id);
      return {
        id: monster.id,
        x: monster.x,
        y: monster.y,
        hp: monster.hp,
        maxHp: monster.maxHp,
        speed: MONSTER.speed,
        attackTimer: 0,
        hitTimer: 0,
        wanderTimer: 0,
        dir: { x: 0, y: 0 },
        renderX: prev?.renderX ?? monster.x,
        renderY: prev?.renderY ?? monster.y,
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
        world: serializeWorldState(cave.world),
      })) ?? [],
      structures: serializeStructuresList(),
      players: getPlayersSnapshot(),
    };
  }

  function applySnapshotStructures(structures) {
    const world = state.surfaceWorld;
    if (!world) return;
    const activeChestPos = state.activeChest ? { tx: state.activeChest.tx, ty: state.activeChest.ty } : null;
    const activeStationPos = state.activeStation ? { tx: state.activeStation.tx, ty: state.activeStation.ty } : null;
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
      if (!isStructureValidOnLoad(world, entry, bridgeSet)) continue;
      clearResourceForStructure(world, entry.tx, entry.ty);
      const structure = addStructure(entry.type, entry.tx, entry.ty, {
        storage: entry.storage
          ? entry.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
          : null,
      });
      if (structure.type === "chest" && !structure.storage) {
        structure.storage = createEmptyInventory(CHEST_SIZE);
      }
    }

    if (activeChestPos) {
      const chest = getStructureAt(activeChestPos.tx, activeChestPos.ty);
      if (chest && chest.type === "chest") {
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
        inHut: !!entry.inHut,
        inCave: !!entry.inCave,
        caveId: entry.caveId ?? null,
        renderX: prev?.renderX ?? entry.x ?? 0,
        renderY: prev?.renderY ?? entry.y ?? 0,
      });
    }
    net.players = next;
  }

  function applyNetworkSnapshot(snapshot) {
    if (!snapshot || !snapshot.seed) return;
    if (!state.surfaceWorld || state.surfaceWorld.seed !== snapshot.seed) {
      const world = generateWorld(snapshot.seed);
      state.surfaceWorld = world;
      state.world = world;
      state.inCave = false;
      state.activeCave = null;
      state.returnPosition = null;
      state.structures = [];
      state.structureGrid = new Array(world.size * world.size).fill(null);
      state.spawnTile = findSpawnTile(world);
      if (!state.player) {
        state.player = {
          x: (state.spawnTile.x + 0.5) * CONFIG.tileSize,
          y: (state.spawnTile.y + 0.5) * CONFIG.tileSize,
          toolTier: 1,
          facing: { x: 1, y: 0 },
          maxHp: 100,
          hp: 100,
          inHut: false,
          invincible: 0,
          attackTimer: 0,
        };
      }
      if (!state.inventory) {
        state.inventory = createEmptyInventory(INVENTORY_SIZE);
      }
    }

    const world = state.surfaceWorld;
    applyResourceStates(world, snapshot.world?.resourceStates ?? []);
    applyRespawnTasks(world, snapshot.world?.respawnTasks ?? []);
    applyDrops(world, snapshot.world?.drops ?? []);
    world.monsters = buildMonstersFromSnapshot(world.monsters, snapshot.world?.monsters);

    if (Array.isArray(world.caves) && Array.isArray(snapshot.caves)) {
      for (const cave of world.caves) {
        const caveSnapshot = snapshot.caves.find((entry) => entry.id === cave.id);
        if (!caveSnapshot) continue;
        applyResourceStates(cave.world, caveSnapshot.world?.resourceStates ?? []);
        applyRespawnTasks(cave.world, caveSnapshot.world?.respawnTasks ?? []);
        applyDrops(cave.world, caveSnapshot.world?.drops ?? []);
        cave.world.monsters = buildMonstersFromSnapshot(cave.world.monsters, caveSnapshot.world?.monsters);
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
      inHut: false,
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
      inHut: player.inHut,
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
    state.world = state.surfaceWorld || state.world;
    if (state.player) state.player.inHut = false;
    if (message.playerState && state.player) {
      state.player.x = message.playerState.x ?? state.player.x;
      state.player.y = message.playerState.y ?? state.player.y;
      state.player.hp = message.playerState.hp ?? state.player.hp;
      state.player.maxHp = message.playerState.maxHp ?? state.player.maxHp;
      state.player.toolTier = message.playerState.toolTier ?? state.player.toolTier;
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
    player.inHut = !!message.inHut;
    player.inCave = !!message.inCave;
    player.caveId = message.caveId ?? null;
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
      inHut: player.inHut,
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
      inHut: !!message.inHut,
      inCave: !!message.inCave,
      caveId: message.caveId ?? null,
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
      if (result.clearResource) {
        clearResourceForStructure(world, tx, ty);
      }
      const itemDef = ITEMS[message.itemId];
      addStructure(itemDef.placeType, tx, ty, {
        storage: itemDef.placeType === "chest" ? createEmptyInventory(CHEST_SIZE) : null,
      });
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

  function handleHarvestRequest(message) {
    const world = message.world === "cave"
      ? getCaveWorld(message.caveId)
      : state.surfaceWorld;
    if (!world) return;
    const resource = world.resources?.[message.resId];
    if (!resource || resource.removed) return;
    const toolTier = typeof message.toolTier === "number" ? message.toolTier : 1;
    const damage = TOOL_TIERS[toolTier - 1]?.damage ?? 1;
    applyHarvestToResource(world, resource, damage, false);
  }

  function handleAttackRequest(message) {
    const world = message.world === "cave"
      ? getCaveWorld(message.caveId)
      : state.surfaceWorld;
    if (!world) return;
    const toolTier = typeof message.toolTier === "number" ? message.toolTier : 1;
    const damage = TOOL_TIERS[toolTier - 1]?.damage ?? 1;
    const target = findNearestMonsterAt(world, { x: message.x, y: message.y }, MONSTER.attackRange + 8);
    if (!target) return;
    target.hp -= damage;
    target.hitTimer = 0.2;
    if (target.hp < 0) target.hp = 0;
    markDirty();
  }

  function handleChestUpdate(message) {
    if (typeof message.tx !== "number" || typeof message.ty !== "number") return;
    const structure = getStructureAt(message.tx, message.ty);
    if (!structure || structure.type !== "chest") return;
    structure.storage = Array.isArray(message.storage)
      ? message.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
      : createEmptyInventory(CHEST_SIZE);
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
    state.timeOfDay = 0;
    state.isNight = false;
    state.surfaceSpawnTimer = MONSTER.spawnInterval;
    state.gameWon = false;
    if (state.surfaceWorld) state.surfaceWorld.monsters = [];
    updateTimeUI();

    if (conn) {
      const player = net.players.get(conn.peer);
      if (player) {
        player.hp = player.maxHp;
        player.inHut = false;
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
    if (bestIndex >= 0) {
      world.drops.splice(bestIndex, 1);
      markDirty();
    }
  }

  function handleDamageMessage(message) {
    if (typeof message.hp === "number") {
      state.player.hp = message.hp;
      updateHealthUI();
    }
  }

  function handleRespawnMessage(message) {
    if (!state.player) return;
    if (typeof message.hp === "number") state.player.hp = message.hp;
    if (typeof message.maxHp === "number") state.player.maxHp = message.maxHp;
    if (typeof message.x === "number") state.player.x = message.x;
    if (typeof message.y === "number") state.player.y = message.y;
    state.player.inHut = false;
    state.player.invincible = 1;
    state.inCave = false;
    state.activeCave = null;
    state.world = state.surfaceWorld;
    updateHealthUI();
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
      inHut: state.player.inHut,
      inCave: state.inCave,
      caveId: state.activeCave?.id ?? null,
    };
    if (net.isHost) {
      broadcastNet(payload);
    } else {
      sendToHost(payload);
    }
  }

  function netTick(dt) {
    if (!net.enabled) return;
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
      if (player.renderX == null || player.renderY == null) {
        player.renderX = player.x;
        player.renderY = player.y;
      } else {
        player.renderX = smoothValue(player.renderX, player.x, dt, NET_CONFIG.renderSmooth);
        player.renderY = smoothValue(player.renderY, player.y, dt, NET_CONFIG.renderSmooth);
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

  function generateCaveWorld(seed, caveId) {
    const size = CAVE_SIZE;
    const caveSeed = seed + caveId * 7919;
    const tiles = new Array(size * size).fill(0);
    const shades = new Array(size * size).fill(1);
    const resources = [];
    const occupancy = new Array(size * size).fill(false);
    const resourceGrid = createResourceGrid(size);

    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const idx = tileIndex(x, y, size);
        if (x === 0 || y === 0 || x === size - 1 || y === size - 1) {
          tiles[idx] = 0;
          continue;
        }
        const n = fbm(x * 0.12, y * 0.12, caveSeed);
        tiles[idx] = n > 0.15 ? 1 : 0;
        shades[idx] = 0.5 + fbm(x * 0.25, y * 0.25, caveSeed + 300) * 0.2;
      }
    }

    const entrance = { tx: Math.floor(size / 2), ty: size - 3 };
    for (let dy = -2; dy <= 2; dy += 1) {
      for (let dx = -2; dx <= 2; dx += 1) {
        const tx = entrance.tx + dx;
        const ty = entrance.ty + dy;
        if (!inBounds(tx, ty, size)) continue;
        tiles[tileIndex(tx, ty, size)] = 1;
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
        if (r < 0.04) {
          addResource("ore", x, y, 5);
        } else if (r < 0.06) {
          addResource("rock", x, y, 4);
        }
      }
    }

    const monsters = [];
    let nextMonsterId = 1;
    const monsterCount = 2 + Math.floor(rand2d(1, 1, caveSeed) * 3);

    function spawnCaveMonster() {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const tx = 2 + Math.floor(rand2d(attempt, caveSeed, caveSeed + 90) * (size - 4));
        const ty = 2 + Math.floor(rand2d(attempt + 10, caveSeed, caveSeed + 120) * (size - 4));
        const idx = tileIndex(tx, ty, size);
        if (!tiles[idx]) continue;
        const dist = Math.hypot(tx - entrance.tx, ty - entrance.ty);
        if (dist < 8) continue;
        if (resourceGrid[idx] !== -1) continue;
        monsters.push({
          id: nextMonsterId++,
          x: (tx + 0.5) * CONFIG.tileSize,
          y: (ty + 0.5) * CONFIG.tileSize,
          hp: MONSTER.hp,
          maxHp: MONSTER.hp,
          speed: MONSTER.speed * 0.9,
          attackTimer: 0,
          hitTimer: 0,
          wanderTimer: 0,
          dir: { x: 0, y: 0 },
        });
        break;
      }
    }

    for (let i = 0; i < monsterCount; i += 1) {
      spawnCaveMonster();
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
    const baseCount = Math.floor(20 + rng() * 12);
    const requiredBiomes = BIOMES.map((_, index) => index).filter((id) => id !== 0);
    const islandCount = Math.max(baseCount, requiredBiomes.length + 1);

    function placeIsland(radius) {
      for (let attempt = 0; attempt < 20; attempt += 1) {
        const x = rng() * size;
        const y = rng() * size;
        const ok = islands.every(
          (island) => Math.hypot(island.x - x, island.y - y) > (radius + island.radius) * 0.6
        );
        if (ok) return { x, y };
      }
      return { x: rng() * size, y: rng() * size };
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
      const radius = 8 + rng() * 10;
      const pos = placeIsland(radius);
      islands.push({
        x: pos.x,
        y: pos.y,
        radius,
        biomeId,
        starter: false,
      });
    }

    for (let i = islands.length; i < islandCount; i += 1) {
      const radius = 6 + rng() * 12;
      const pos = placeIsland(radius);
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
          addResource("tree", x, y, 3);
        } else if (r < biome.treeRate + biome.rockRate && isClear(x, y, 2)) {
          addResource("rock", x, y, 4);
        }

        if (!occupancy[idx]) {
          const rOre = rand2d(x, y, seed + 88);
          if (rOre < biome.oreRate && isClear(x, y, 2)) {
            addResource("ore", x, y, 5);
          }
        }

        if (!occupancy[idx]) {
          const rStone = rand2d(x, y, seed + 132);
          if (rStone < biome.stoneRate && isClear(x, y, 2)) {
            addResource("biomeStone", x, y, 6, { biomeId });
          }
        }
      }
    }

    function hasBiomeStone(biomeId) {
      return resources.some((res) => res.type === "biomeStone" && res.biomeId === biomeId);
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
      if (!hasBiomeStone(biomeId)) {
        placeBiomeStone(biomeId);
      }
    }

    const caves = [];
    const maxCaves = Math.max(1, Math.floor(islandCount * 0.08));
    for (const island of islands) {
      if (caves.length >= maxCaves) break;
      if (island.starter) continue;
      if (island.radius < 8) continue;
      if (rng() > 0.2) continue;
      let placed = false;
      for (let attempt = 0; attempt < 30; attempt += 1) {
        const tx = Math.floor(island.x + (rng() - 0.5) * island.radius * 0.8);
        const ty = Math.floor(island.y + (rng() - 0.5) * island.radius * 0.8);
        if (!inBounds(tx, ty, size)) continue;
        const idx = tileIndex(tx, ty, size);
        if (!tiles[idx]) continue;
        if (resourceGrid[idx] !== -1) continue;
        if (beachGrid[idx]) continue;
        if (caves.some((cave) => cave.tx === tx && cave.ty === ty)) continue;
        caves.push({
          id: caves.length,
          tx,
          ty,
          world: generateCaveWorld(seed, caves.length),
        });
        placed = true;
        break;
      }
      if (!placed) {
        continue;
      }
    }

    if (caves.length === 0) {
      const fallbackIsland = islands
        .filter((island) => !island.starter && island.radius >= 8)
        .sort((a, b) => b.radius - a.radius)[0];
      if (fallbackIsland) {
        for (let attempt = 0; attempt < 30; attempt += 1) {
          const tx = Math.floor(fallbackIsland.x + (rng() - 0.5) * fallbackIsland.radius * 0.8);
          const ty = Math.floor(fallbackIsland.y + (rng() - 0.5) * fallbackIsland.radius * 0.8);
          if (!inBounds(tx, ty, size)) continue;
          const idx = tileIndex(tx, ty, size);
          if (!tiles[idx]) continue;
          if (resourceGrid[idx] !== -1) continue;
          if (beachGrid[idx]) continue;
          caves.push({
            id: caves.length,
            tx,
            ty,
            world: generateCaveWorld(seed, caves.length),
          });
          break;
        }
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
    return Object.entries(cost).every(([itemId, qty]) => countItem(inventory, itemId) >= qty);
  }

  function applyCost(inventory, cost) {
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

  function updateObjectiveUI() {
    if (objectiveDisplay) {
      objectiveDisplay.textContent = state.gameWon
        ? "Objective: Rescue Beacon built"
        : "Objective: Gather all biome stones and build a Rescue Beacon (place on a beach)";
    }
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
    state.winPlayerPos = { x: state.player?.x ?? 0, y: state.player?.y ?? 0 };
    state.timeOfDay = 0;
    state.isNight = false;
    if (state.surfaceWorld) {
      state.surfaceWorld.monsters = [];
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

  function saveGame() {
    if (netIsClientReady()) return;
    if (!state.world || !state.player) return;
    const surface = state.surfaceWorld || state.world;
    if (!surface) return;

    const data = {
      version: SAVE_VERSION,
      seed: surface.seed,
      player: {
        x: state.player.x,
        y: state.player.y,
        toolTier: state.player.toolTier,
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
        })),
      drops: (surface.drops ?? []).map((drop) => ({
        itemId: drop.itemId,
        qty: drop.qty,
        x: drop.x,
        y: drop.y,
      })),
      caves: surface.caves?.map((cave) => ({
        id: cave.id,
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
      localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      saveStatus.textContent = "Saved";
    } catch (err) {
      saveStatus.textContent = "Save failed";
      console.warn("Save failed", err);
    }

    state.dirty = false;
    state.saveTimer = CONFIG.saveInterval;
  }

  function loadGame() {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw);
      if (!data.version) return null;
      return data;
    } catch (err) {
      console.warn("Save parse failed", err);
      return null;
    }
  }

  function migrateSave(data) {
    if (!data || data.version === SAVE_VERSION) return data;
    if (data.version === 1) {
      return {
        version: SAVE_VERSION,
        seed: data.seed,
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
        caves: [],
      };
    }
    if (data.version === 2) {
      return {
        version: SAVE_VERSION,
        seed: data.seed,
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
        caves: [],
      };
    }
    if (data.version === 3) {
      return {
        version: SAVE_VERSION,
        seed: data.seed,
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
        caves: Array.isArray(data.caves) ? data.caves : [],
      };
    }
    return null;
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
          timer: typeof task.timer === "number" ? task.timer : RESPAWN.rock,
        }))
      : [];
  }

  function isStructureValidOnLoad(world, entry, bridgeSet) {
    if (!entry || !inBounds(entry.tx, entry.ty, world.size)) return false;
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
    if (entry.type === "beacon") {
      const idxBeach = tileIndex(entry.tx, entry.ty, world.size);
      if (!world.beachGrid?.[idxBeach]) return false;
    }
    if (getCaveAt(world, entry.tx, entry.ty)) return false;
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

  function setActiveSlot(index) {
    activeSlot = clamp(index, 0, HOTBAR_SIZE - 1);
    updateAllSlotUI();
  }

  function updateToolDisplay() {
    const tier = TOOL_TIERS[state.player.toolTier - 1] || TOOL_TIERS[0];
    toolDisplay.textContent = `Tool: ${tier.name}`;
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

  function addStructure(type, tx, ty, options = {}) {
    const size = state.surfaceWorld?.size ?? state.world.size;
    const idx = tileIndex(tx, ty, size);
    const structure = {
      id: state.structures.length,
      type,
      tx,
      ty,
      removed: false,
      pending: !!options.pending,
      storage: options.storage || null,
    };
    state.structures.push(structure);
    if (state.structureGrid) {
      state.structureGrid[idx] = structure.id;
    }
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
    const size = state.surfaceWorld?.size ?? state.world.size;
    const idx = tileIndex(structure.tx, structure.ty, size);
    structure.removed = true;
    if (state.structureGrid) {
      state.structureGrid[idx] = null;
    }
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

  function startNewGame(seedStr) {
    const world = generateWorld(seedStr);
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
    const spawn = findSpawnTile(world);
    state.spawnTile = spawn;
    state.timeOfDay = 0;
    state.isNight = false;
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
      facing: { x: 1, y: 0 },
      maxHp: 100,
      hp: 100,
      inHut: false,
      invincible: 0,
      attackTimer: 0,
    };
    state.inventory = createEmptyInventory(INVENTORY_SIZE);
    state.targetResource = null;
    state.activeStation = null;
    state.activeChest = null;

    const benchSpot = findBenchSpot(world, spawn);
    addStructure("bench", benchSpot.tx, benchSpot.ty);

    state.dirty = true;
    saveStatus.textContent = "Saving...";
    state.saveTimer = CONFIG.saveInterval;

    seedDisplay.textContent = `Seed: ${world.seed}`;
    updateToolDisplay();
    updateHealthUI();
    updateTimeUI();
    updateObjectiveUI();
    updateAllSlotUI();
  }

  function loadOrCreateGame() {
    const savedRaw = loadGame();
    const saved = migrateSave(savedRaw);
    if (saved) {
      const world = generateWorld(saved.seed);
      state.nextDropId = 1;
      applyResourceStates(world, saved.resourceStates);
      applyRespawnTasks(world, saved.respawnTasks);
      applyDrops(world, saved.drops);
      world.monsters = world.monsters || [];
      world.nextMonsterId = world.nextMonsterId || 1;

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
          if (!isStructureValidOnLoad(world, entry, bridgeSet)) continue;
          clearResourceForStructure(world, entry.tx, entry.ty);
          const structure = addStructure(entry.type, entry.tx, entry.ty, {
            storage: entry.storage
              ? entry.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
              : null,
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
        facing: { x: 1, y: 0 },
        maxHp: saved.player?.maxHp ?? 100,
        hp: saved.player?.hp ?? 100,
        inHut: false,
        invincible: 0,
        attackTimer: 0,
      };
      state.spawnTile = spawnTile;
      state.timeOfDay = typeof saved.timeOfDay === "number" ? saved.timeOfDay : 0;
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

      state.targetResource = null;
      state.activeStation = null;
      state.activeChest = null;
      state.dirty = false;

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

    startNewGame("island-1");
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
    if (resource.type === "ore") return "ore";
    if (resource.type === "biomeStone") {
      return BIOME_STONES[resource.biomeId]?.id ?? "stone";
    }
    return null;
  }

  function getResourceActionName(resource) {
    if (!resource) return "";
    if (resource.type === "tree") return "Chop tree";
    if (resource.type === "rock") return "Mine rock";
    if (resource.type === "ore") return "Mine ore";
    if (resource.type === "biomeStone") return "Mine stone";
    return "Harvest";
  }

  function findNearestStructure(player, predicate) {
    let closest = null;
    let closestDist = Infinity;
    for (const structure of state.structures) {
      if (structure.removed) continue;
      if (!predicate(structure)) continue;
      const sx = (structure.tx + 0.5) * CONFIG.tileSize;
      const sy = (structure.ty + 0.5) * CONFIG.tileSize;
      const dist = Math.hypot(sx - player.x, sy - player.y);
      if (dist < CONFIG.interactRange && dist < closestDist) {
        closest = structure;
        closestDist = dist;
      }
    }
    return closest;
  }

  function getCaveAt(world, tx, ty) {
    if (!world?.caves) return null;
    return world.caves.find((cave) => cave.tx === tx && cave.ty === ty) ?? null;
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

  function updateDrops() {
    if (!state.player) return;
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

  function applyHarvestToResource(world, resource, damage, awardItems) {
    if (!resource || resource.removed) return;
    const dropId = getResourceDropId(resource);
    if (!dropId) return;

    resource.hp -= damage;
    resource.hitTimer = 0.18;

    if (resource.hp <= 0) {
      if (resource.type === "tree") {
        resource.hp = 0;
        resource.stage = "stump";
        resource.respawnTimer = RESPAWN.treeStump;
      } else {
        resource.removed = true;
        const idx = tileIndex(resource.tx, resource.ty, world.size);
        world.resourceGrid[idx] = -1;
        if (resource.type === "rock") {
          world.respawnTasks.push({
            type: "rock",
            id: resource.id,
            tx: resource.tx,
            ty: resource.ty,
            timer: RESPAWN.rock,
          });
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

    if (!canAddItem(state.inventory, dropId, 1)) {
      setPrompt("Inventory full", 1.2);
      return;
    }

    const damage = TOOL_TIERS[state.player.toolTier - 1]?.damage ?? 1;
    applyHarvestToResource(state.world, resource, damage, true);

    if (netIsClient()) {
      sendToHost({
        type: "harvest",
        world: state.inCave ? "cave" : "surface",
        caveId: state.activeCave?.id ?? null,
        resId: resource.id,
        toolTier: state.player.toolTier,
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
      view.item.textContent = "";
      view.count.textContent = "";
      view.item.style.color = "";
      return;
    }

    const itemDef = ITEMS[slotData.id];
    view.item.textContent = itemDef ? itemDef.name : slotData.id;
    view.item.style.color = itemDef ? itemDef.color : "#fff";
    view.count.textContent = slotData.qty > 1 ? String(slotData.qty) : "";
  }

  function handleSlotClick(scope, index) {
    if (inventoryOpen || state.activeChest) {
      if (!selectedSlot) {
        const list = scope === "inventory" ? state.inventory : state.activeChest?.storage;
        if (list && list[index]?.id) {
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
      el.addEventListener("click", () => handleSlotClick("inventory", i));
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
      el.addEventListener("click", () => handleSlotClick("inventory", i));
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
      el.addEventListener("click", () => handleSlotClick("chest", i));
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
    state.activeStation = structure;
    stationMenu.classList.remove("hidden");
    renderStationMenu();
  }

  function closeStationMenu() {
    state.activeStation = null;
    stationMenu.classList.add("hidden");
  }

  function openChest(structure) {
    if (!structure) return;
    if (!structure.storage) {
      structure.storage = createEmptyInventory(CHEST_SIZE);
    }
    state.activeChest = structure;
    openInventory();
    chestPanel.classList.remove("hidden");
    updateAllSlotUI();
  }

  function closeChest() {
    state.activeChest = null;
    chestPanel.classList.add("hidden");
    closeInventory();
    selectedSlot = null;
    updateAllSlotUI();
  }

  function sendChestUpdate(structure) {
    if (!structure || !net.enabled) return;
    netSend({
      type: "chestUpdate",
      tx: structure.tx,
      ty: structure.ty,
      storage: structure.storage
        ? structure.storage.map((slot) => ({ id: slot.id, qty: slot.qty }))
        : createEmptyInventory(CHEST_SIZE),
    });
  }

  function renderBuildMenu() {
    buildList.innerHTML = "";
    const recipes = buildTab === "buildings" ? BUILD_RECIPES : UPGRADE_RECIPES;
    for (const recipe of recipes) {
      const card = document.createElement("div");
      card.className = "recipe-card";
      const title = document.createElement("div");
      title.className = "recipe-title";
      title.textContent = recipe.name;
      const cost = document.createElement("div");
      cost.className = "recipe-cost";
      cost.textContent = recipe.cost
        ? Object.entries(recipe.cost)
            .map(([itemId, qty]) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`)
            .join(", ")
        : "";
      const button = document.createElement("button");

      let disabled = false;
      if (buildTab === "upgrades") {
        if (state.player.toolTier >= recipe.tier) {
          button.textContent = "Owned";
          disabled = true;
        } else {
          button.textContent = "Upgrade";
        }
      } else {
        button.textContent = "Craft";
      }

      if (recipe.cost && !hasCost(state.inventory, recipe.cost)) {
        disabled = true;
      }

      button.disabled = disabled;
      button.addEventListener("click", () => craftRecipe(recipe));

      card.appendChild(title);
      if (recipe.cost) card.appendChild(cost);
      card.appendChild(button);
      buildList.appendChild(card);
    }
  }

  function craftRecipe(recipe) {
    if (!recipe.cost || !hasCost(state.inventory, recipe.cost)) {
      setPrompt("Not enough resources", 1.2);
      return;
    }

    if (buildTab === "upgrades") {
      if (state.player.toolTier >= recipe.tier) return;
      applyCost(state.inventory, recipe.cost);
      state.player.toolTier = recipe.tier;
      updateToolDisplay();
      updateAllSlotUI();
      markDirty();
      setPrompt("Tool upgraded!", 1.2);
      return;
    }

    if (!canAddItem(state.inventory, recipe.id, 1)) {
      setPrompt("Inventory full", 1.2);
      return;
    }

    applyCost(state.inventory, recipe.cost);
    addItem(state.inventory, recipe.id, 1);
    updateAllSlotUI();
    markDirty();
    setPrompt(`${recipe.name} crafted`, 1.2);
  }

  function renderStationMenu() {
    if (!state.activeStation) return;
    const type = state.activeStation.type;
    const recipes = STATION_RECIPES[type] || [];
    stationTitle.textContent = STRUCTURE_DEFS[type]?.name ?? "Station";
    stationOptions.innerHTML = "";

    for (const recipe of recipes) {
      const card = document.createElement("div");
      card.className = "recipe-card";
      const title = document.createElement("div");
      title.className = "recipe-title";
      title.textContent = recipe.name;
      card.appendChild(title);

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
        cost.textContent = `${Object.entries(recipe.input)
          .map(([itemId, qty]) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`)
          .join(", ")} → ${Object.entries(recipe.output)
          .map(([itemId, qty]) => `${ITEMS[itemId]?.name ?? itemId} x${qty}`)
          .join(", ")}`;
        card.appendChild(cost);
        const btn = document.createElement("button");
        const canAfford = hasCost(state.inventory, recipe.input) && canAddItems(state.inventory, recipe.output);
        btn.textContent = canAfford ? "Refine" : "Need resources";
        btn.disabled = !canAfford;
        btn.addEventListener("click", () => craftStationRecipe(recipe));
        card.appendChild(btn);
      }
      stationOptions.appendChild(card);
    }
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
    if (netIsClient()) {
      sendToHost({ type: "destroyChest", tx: chest.tx, ty: chest.ty });
      closeChest();
      return;
    }
    destroyChest(chest);
  }

  function promptNewSeed() {
    if (netIsClientReady()) {
      setPrompt("Host only", 1);
      return;
    }
    const seed = window.prompt("Enter new world seed (this resets progress):", "island-1");
    if (!seed) return;
    localStorage.removeItem(SAVE_KEY);
    startNewGame(seed);
    saveGame();
  }

  function handleKeyDown(event) {
    if (event.repeat) return;

    if (event.code === "Backquote") {
      toggleDebugMenu();
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

    if (event.code.startsWith("Digit")) {
      const num = Number(event.code.replace("Digit", ""));
      if (num >= 1 && num <= HOTBAR_SIZE) {
        setActiveSlot(num - 1);
      }
    }

    if (event.code === "KeyE" || event.code === "Space") {
      actionPressed = true;
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

    const uiLock = inventoryOpen || !!state.activeStation || !!state.activeChest || state.player.inHut || state.gameWon;
    const move = uiLock ? { x: 0, y: 0 } : getMoveVector();
    const step = CONFIG.moveSpeed * dt;

    if (move.x !== 0 || move.y !== 0) {
      state.player.facing.x = move.x;
      state.player.facing.y = move.y;
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
    if (!state.player || !state.surfaceWorld || state.inCave) return;
    const campfire = findNearestStructure(state.player, (structure) => structure.type === "campfire");
    if (!campfire) return;
    const cx = (campfire.tx + 0.5) * CONFIG.tileSize;
    const cy = (campfire.ty + 0.5) * CONFIG.tileSize;
    const dist = Math.hypot(cx - state.player.x, cy - state.player.y);
    if (dist < CONFIG.interactRange * 0.9) {
      const before = state.player.hp;
      state.player.hp = Math.min(state.player.maxHp, state.player.hp + 5 * dt);
      if (state.player.hp !== before) updateHealthUI();
    }
  }

  function updateWorldResources(world, dt) {
    if (!world) return;
    for (const res of world.resources) {
      if (res.hitTimer > 0) res.hitTimer -= dt;
      if (res.removed) continue;
      if (res.type === "tree" && res.stage && res.stage !== "alive") {
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
      }
      if (state.player.inHut && !state.isNight) {
        state.player.inHut = false;
      }
    }
  }

  function damagePlayer(amount) {
    if (!state.player) return;
    if (state.player.invincible > 0) return;
    state.player.hp = Math.max(0, state.player.hp - amount);
    state.player.invincible = 0.6;
    updateHealthUI();
    if (state.player.hp <= 0) {
      handlePlayerDeath();
    }
  }

  function handlePlayerDeath() {
    state.player.hp = state.player.maxHp;
    state.player.invincible = 1;
    state.player.inHut = false;
    updateHealthUI();
    setPrompt("You passed out...", 2);
    if (state.inCave) {
      leaveCave();
    }
    const spawn = state.spawnTile ?? findSpawnTile(state.surfaceWorld ?? state.world);
    state.player.x = (spawn.x + 0.5) * CONFIG.tileSize;
    state.player.y = (spawn.y + 0.5) * CONFIG.tileSize;
    if (state.surfaceWorld) {
      state.surfaceWorld.monsters = [];
    }
    if (state.activeCave?.world) {
      state.activeCave.world.monsters = [];
    }
    markDirty();
  }

  function spawnMonster(world, tx, ty, options = {}) {
    if (!world.monsters) world.monsters = [];
    if (!world.nextMonsterId) world.nextMonsterId = 1;
    const monster = {
      id: world.nextMonsterId++,
      x: (tx + 0.5) * CONFIG.tileSize,
      y: (ty + 0.5) * CONFIG.tileSize,
      hp: options.hp ?? MONSTER.hp,
      maxHp: options.hp ?? MONSTER.hp,
      speed: options.speed ?? MONSTER.speed,
      attackTimer: 0,
      hitTimer: 0,
      wanderTimer: 0,
      dir: { x: 0, y: 0 },
    };
    world.monsters.push(monster);
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
      spawnMonster(world, tx, ty);
      break;
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

  function performAttack() {
    if (state.player.attackTimer > 0) return;
    state.player.attackTimer = 0.35;
    if (netIsClient()) {
      sendToHost({
        type: "attack",
        world: state.inCave ? "cave" : "surface",
        caveId: state.activeCave?.id ?? null,
        toolTier: state.player.toolTier,
        x: state.player.x,
        y: state.player.y,
      });
      return;
    }
    const damage = TOOL_TIERS[state.player.toolTier - 1]?.damage ?? 1;
    const target = findNearestMonsterAt(state.world, state.player, MONSTER.attackRange + 8);
    if (!target) return;
    target.hp -= damage;
    target.hitTimer = 0.2;
    if (target.hp <= 0) {
      target.hp = 0;
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
    const spawn = state.spawnTile ?? findSpawnTile(state.surfaceWorld ?? state.world);
    player.hp = player.maxHp;
    player.x = (spawn.x + 0.5) * CONFIG.tileSize;
    player.y = (spawn.y + 0.5) * CONFIG.tileSize;
    player.inHut = false;
    player.inCave = false;
    player.caveId = null;
    const conn = net.connections.get(player.id);
    if (conn?.open) {
      conn.send({
        type: "respawn",
        hp: player.hp,
        maxHp: player.maxHp,
        x: player.x,
        y: player.y,
      });
    }
  }

  function damageRemotePlayer(player, amount) {
    if (!player) return;
    player.hp = Math.max(0, player.hp - amount);
    const conn = net.connections.get(player.id);
    if (player.hp <= 0) {
      respawnRemotePlayer(player);
    } else if (conn?.open) {
      conn.send({
        type: "damage",
        hp: player.hp,
        maxHp: player.maxHp,
      });
    }
  }

  function updateMonstersInWorld(world, dt, players, isSurface) {
    if (!world) return;
    if (!world.monsters) world.monsters = [];

    if (isSurface) {
      if (players.length === 0) {
        world.monsters = [];
        return;
      }
      if (state.isNight) {
        state.surfaceSpawnTimer -= dt;
        if (state.surfaceSpawnTimer <= 0) {
          const spawnOrigin = players.length > 0
            ? players[Math.floor(Math.random() * players.length)]
            : null;
          spawnSurfaceMonster(spawnOrigin);
          state.surfaceSpawnTimer = MONSTER.spawnInterval;
        }
      } else {
        world.monsters = [];
      }
    }

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

      if (target && targetDist < MONSTER.aggroRange) {
        const dx = target.x - monster.x;
        const dy = target.y - monster.y;
        const dist = Math.max(1, Math.hypot(dx, dy));
        const vx = dx / dist;
        const vy = dy / dist;
        const step = monster.speed * dt;
        const nextX = monster.x + vx * step;
        const nextY = monster.y + vy * step;
        if (isWalkableAtWorld(world, nextX, monster.y)) monster.x = nextX;
        if (isWalkableAtWorld(world, monster.x, nextY)) monster.y = nextY;

        if (dist < MONSTER.attackRange && monster.attackTimer <= 0) {
          if (target.id === (net.playerId || "local")) {
            damagePlayer(MONSTER.damage);
          } else if (net.isHost) {
            damageRemotePlayer(target, MONSTER.damage);
          }
          monster.attackTimer = MONSTER.attackCooldown;
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
    if (state.player.invincible > 0) state.player.invincible -= dt;
    if (state.player.attackTimer > 0) state.player.attackTimer -= dt;
    if (netIsClient()) return;
    if (state.gameWon) {
      if (state.surfaceWorld) state.surfaceWorld.monsters = [];
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

  function getPlacementItem() {
    if (state.gameWon) return null;
    if (state.inCave || inventoryOpen || state.activeStation || state.activeChest) return null;
    const slot = state.inventory[activeSlot];
    if (!slot || !slot.id) return null;
    const itemDef = ITEMS[slot.id];
    if (!itemDef || !itemDef.placeable) return null;
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
    if (structure) return { ok: false, reason: "Occupied" };
    const resource = getResourceAt(world, tx, ty);
    if (resource) {
      if (resource.stage && resource.stage !== "alive") {
        return { ok: true, clearResource: true };
      }
      return { ok: false, reason: "Blocked" };
    }
    if (world === state.surfaceWorld && getCaveAt(world, tx, ty)) return { ok: false, reason: "Cave" };

    const itemDef = ITEMS[itemId];
    if (!itemDef) return { ok: false, reason: "Invalid" };

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

    if (!baseLand) return { ok: false, reason: "Needs land" };
    return { ok: true };
  }

  function canPlaceItem(itemId, tx, ty) {
    return canPlaceItemAt(state.world, state.inCave, itemId, tx, ty);
  }

  function attemptPlace() {
    const placement = getPlacementItem();
    if (!placement) return false;

    const { tx, ty } = getPlacementTile();
    const result = canPlaceItem(placement.itemId, tx, ty);
    if (!result.ok) {
      setPrompt(result.reason, 0.9);
      return false;
    }

    if (result.clearResource) {
      const res = getResourceAt(state.world, tx, ty);
      if (res) {
        res.removed = true;
        const idx = tileIndex(tx, ty, state.world.size);
        state.world.resourceGrid[idx] = -1;
      }
    }

    addStructure(placement.itemDef.placeType, tx, ty, {
      storage: placement.itemDef.placeType === "chest" ? createEmptyInventory(CHEST_SIZE) : null,
      pending: netIsClient(),
    });

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

  function updateInteraction() {
    if (state.gameWon) {
      actionPressed = false;
      return;
    }
    state.targetResource = findNearestResource(state.world, state.player);
    state.targetMonster = findNearestMonster(state.world, state.player, MONSTER.attackRange + 12);
    if (!state.inCave) {
      state.nearBench = !!findNearestStructure(state.player, (structure) => structure.type === "bench");
      state.nearStation = findNearestStructure(state.player, (structure) => STRUCTURE_DEFS[structure.type]?.station);
      state.nearChest = findNearestStructure(state.player, (structure) => structure.type === "chest");
      state.nearCave = findNearestCave(state.surfaceWorld, state.player);
      state.nearHut = findNearestStructure(state.player, (structure) => structure.type === "hut");
    } else {
      state.nearBench = false;
      state.nearStation = null;
      state.nearChest = null;
      state.nearCave = null;
      state.nearHut = null;
    }

    if (state.activeStation) {
      const dist = Math.hypot(
        (state.activeStation.tx + 0.5) * CONFIG.tileSize - state.player.x,
        (state.activeStation.ty + 0.5) * CONFIG.tileSize - state.player.y
      );
      if (dist > CONFIG.interactRange * 1.3) {
        closeStationMenu();
      }
    }

    if (state.activeChest) {
      const dist = Math.hypot(
        (state.activeChest.tx + 0.5) * CONFIG.tileSize - state.player.x,
        (state.activeChest.ty + 0.5) * CONFIG.tileSize - state.player.y
      );
      if (dist > CONFIG.interactRange * 1.3) {
        closeChest();
      }
    }

    if (state.promptTimer <= 0) {
      const placement = getPlacementItem();
      if (placement) {
        setPrompt(`Tap to place ${ITEMS[placement.itemId].name}`);
      } else if (state.inCave) {
        const entrance = state.activeCave?.world?.entrance;
        if (entrance) {
          const ex = (entrance.tx + 0.5) * CONFIG.tileSize;
          const ey = (entrance.ty + 0.5) * CONFIG.tileSize;
          const dist = Math.hypot(ex - state.player.x, ey - state.player.y);
          if (dist < CONFIG.interactRange) {
            setPrompt("Press E to leave cave");
          } else if (state.targetMonster) {
            setPrompt("Press E to attack");
          } else if (state.targetResource) {
            setPrompt(`Press E / Tap Action to ${getResourceActionName(state.targetResource)}`);
          } else {
            setPrompt("Cave depths");
          }
        }
      } else if (state.activeChest) {
        setPrompt("Chest open");
      } else if (state.player.inHut) {
        setPrompt(state.isNight ? "Press E to sleep" : "Press E to exit hut");
      } else if (state.nearChest) {
        setPrompt("Press E to open chest");
      } else if (state.activeStation) {
        setPrompt("Station open");
      } else if (state.nearStation) {
        setPrompt(`Press E to use ${STRUCTURE_DEFS[state.nearStation.type]?.name}`);
      } else if (state.nearCave) {
        setPrompt("Press E to enter cave");
      } else if (state.nearHut) {
        setPrompt("Press E to enter hut");
      } else if (state.targetMonster) {
        setPrompt("Press E to attack");
      } else if (state.targetResource) {
        setPrompt(`Press E / Tap Action to ${getResourceActionName(state.targetResource)}`);
      } else if (state.nearBench) {
        setPrompt("Crafting Bench");
      } else {
        state.promptText = "";
      }
    }

    if (actionPressed) {
      const placement = getPlacementItem();
      if (placement) {
        attemptPlace();
      } else if (state.inCave) {
        const entrance = state.activeCave?.world?.entrance;
        if (entrance) {
          const ex = (entrance.tx + 0.5) * CONFIG.tileSize;
          const ey = (entrance.ty + 0.5) * CONFIG.tileSize;
          const dist = Math.hypot(ex - state.player.x, ey - state.player.y);
          if (dist < CONFIG.interactRange) {
            leaveCave();
          } else if (state.targetMonster) {
            performAttack();
          } else {
            attemptHarvest(state.targetResource);
          }
        } else {
          if (state.targetMonster) {
            performAttack();
          } else {
            attemptHarvest(state.targetResource);
          }
        }
      } else if (state.player.inHut) {
        if (state.isNight) {
          if (netIsClient()) {
            sendToHost({ type: "sleep" });
            setPrompt("Trying to sleep...", 1.2);
          } else {
            state.timeOfDay = 0;
            state.isNight = false;
            state.surfaceSpawnTimer = MONSTER.spawnInterval;
            updateTimeUI();
            state.player.hp = state.player.maxHp;
            updateHealthUI();
            state.player.inHut = false;
            if (state.surfaceWorld) state.surfaceWorld.monsters = [];
            setPrompt("You feel rested.", 1.2);
            markDirty();
          }
        } else {
          state.player.inHut = false;
        }
      } else if (state.activeChest) {
        closeChest();
      } else if (state.activeStation) {
        closeStationMenu();
      } else if (state.nearChest) {
        openChest(state.nearChest);
      } else if (state.nearStation) {
        openStationMenu(state.nearStation);
      } else if (state.nearCave) {
        enterCave(state.nearCave);
      } else if (state.nearHut) {
        state.player.inHut = true;
        closeChest();
        closeStationMenu();
        closeInventory();
      } else {
        if (state.targetMonster) {
          performAttack();
        } else {
          attemptHarvest(state.targetResource);
        }
      }
      actionPressed = false;
    }

    if (!state.inCave && !state.player.inHut && state.nearBench) {
      if (!wasNearBench) {
        buildMenu.classList.remove("hidden");
        renderBuildMenu();
      }
    } else {
      if (wasNearBench) buildMenu.classList.add("hidden");
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
    if (net.enabled && !net.isHost && !net.ready) {
      setPrompt("Connecting...", 0.5);
    }
    updatePlayer(dt);
    updateStructureEffects(dt);
    updateWinSequence(dt);
    updateDayNight(dt);
    updateResources(dt);
    updateMonsters(dt);
    updateDrops();
    updateInteraction();
    updateRemoteRender(dt);
    netTick(dt);
    updatePrompt(dt);
    updateSave(dt);
  }

  function worldToScreen(x, y, camera) {
    return {
      x: x - camera.x,
      y: y - camera.y,
    };
  }

  function drawLandTile(x, y, shade, biomeId, isBeach) {
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
      } else if (player.inCave) {
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

    ctx.fillStyle = "#2b2d3a";
    ctx.beginPath();
    ctx.arc(screen.x, screen.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#1b1c24";
    ctx.stroke();

    ctx.fillStyle = "#1b1c24";
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

    if (monster.hitTimer > 0) {
      ctx.strokeStyle = "rgba(255,255,255,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(screen.x, screen.y, 13, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawStructure(structure, camera) {
    if (structure.removed) return;
    const def = STRUCTURE_DEFS[structure.type];
    if (!def) return;
    const screenX = structure.tx * CONFIG.tileSize - camera.x;
    const screenY = structure.ty * CONFIG.tileSize - camera.y;
    if (
      screenX < -CONFIG.tileSize ||
      screenY < -CONFIG.tileSize ||
      screenX > viewWidth + CONFIG.tileSize ||
      screenY > viewHeight + CONFIG.tileSize
    ) {
      return;
    }

    const size = CONFIG.tileSize;
    const inset = 2;
    const baseX = screenX + inset;
    const baseY = screenY + inset;
    const baseSize = size - inset * 2;

    if (def.blocking) {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.ellipse(
        screenX + size / 2,
        screenY + size - 4,
        baseSize / 2.2,
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
      case "hut": {
        ctx.fillStyle = tintColor(def.color, 0.05);
        ctx.fillRect(baseX + 2, baseY + 10, baseSize - 4, baseSize - 12);
        ctx.fillStyle = tintColor(def.color, -0.25);
        ctx.beginPath();
        ctx.moveTo(baseX + 2, baseY + 12);
        ctx.lineTo(baseX + baseSize / 2, baseY - 2);
        ctx.lineTo(baseX + baseSize - 2, baseY + 12);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#3a2a1b";
        ctx.fillRect(baseX + baseSize / 2 - 4, baseY + baseSize - 10, 8, 8);
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
        ctx.fillStyle = "#4a2b2b";
        ctx.fillRect(baseX + 4, baseY + 4, baseSize - 8, baseSize - 8);
        ctx.fillStyle = "#c86b3c";
        ctx.fillRect(baseX + 8, baseY + baseSize - 12, baseSize - 16, 6);
        ctx.strokeStyle = "rgba(255,200,120,0.5)";
        ctx.strokeRect(baseX + 8, baseY + baseSize - 12, baseSize - 16, 6);
        break;
      }
      case "sawmill": {
        drawPlanks(baseX, baseY, baseSize, def.color, true);
        ctx.beginPath();
        ctx.fillStyle = "#cfd6e2";
        ctx.arc(baseX + baseSize / 2, baseY + baseSize / 2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#6b6f78";
        ctx.stroke();
        break;
      }
      case "kiln": {
        drawBrick(baseX, baseY, baseSize, def.color);
        ctx.fillStyle = "#2a1c14";
        ctx.beginPath();
        ctx.arc(baseX + baseSize / 2, baseY + baseSize - 8, 6, Math.PI, 0);
        ctx.fill();
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
      default: {
        ctx.fillStyle = def.color;
        ctx.fillRect(baseX, baseY, baseSize, baseSize);
      }
    }
  }

  function drawNightLighting(camera) {
    if (state.inCave || !state.isNight) return;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    for (const structure of state.structures) {
      if (structure.removed) continue;
      const def = STRUCTURE_DEFS[structure.type];
      if (!def?.lightRadius) continue;
      const cx = structure.tx * CONFIG.tileSize + CONFIG.tileSize / 2 - camera.x;
      const cy = structure.ty * CONFIG.tileSize + CONFIG.tileSize / 2 - camera.y;
      const radius = def.lightRadius;
      const gradient = ctx.createRadialGradient(cx, cy, 10, cx, cy, radius);
      gradient.addColorStop(0, "rgba(0,0,0,0.9)");
      gradient.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
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
    const startX = targetX - CONFIG.tileSize * 14;
    const endX = targetX + CONFIG.tileSize * 14;

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

  function render() {
    if (!state.world || !state.player) return;

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
          drawLandTile(screenX, screenY, state.world.shades[idx], biomeId, isBeach);
        }
      }
    }

    if (!state.inCave) {
      for (const structure of state.structures) {
        if (structure.removed) continue;
        if (
          structure.type === "floor"
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
        const color = state.inCave
          ? res.type === "ore"
            ? "#c0724c"
            : "#6f6f78"
          : res.type === "ore"
            ? biome.ore
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

    for (const monster of state.world.monsters || []) {
      drawMonster(monster, camera);
    }

    if (!state.inCave) {
      for (const structure of state.structures) {
        if (structure.removed) continue;
        if (
          structure.type !== "floor"
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
      ctx.fillStyle = ITEMS[drop.itemId]?.color ?? "#fff";
      ctx.fillRect(screen.x - 4, screen.y - 4, 8, 8);
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

    const placement = getPlacementItem();
    if (placement) {
      const { tx, ty } = getPlacementTile();
      if (inBounds(tx, ty, state.world.size)) {
        const screenX = tx * CONFIG.tileSize - camera.x;
        const screenY = ty * CONFIG.tileSize - camera.y;
        const valid = canPlaceItem(placement.itemId, tx, ty).ok;
        ctx.fillStyle = valid ? "rgba(120, 210, 255, 0.25)" : "rgba(240, 80, 80, 0.25)";
        ctx.fillRect(screenX, screenY, CONFIG.tileSize, CONFIG.tileSize);
        ctx.strokeStyle = valid ? "rgba(120, 210, 255, 0.8)" : "rgba(240, 80, 80, 0.8)";
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX + 2, screenY + 2, CONFIG.tileSize - 4, CONFIG.tileSize - 4);
      }
    }

    drawPlayer(camera);
    drawRemotePlayers(camera);

    if (!state.inCave && state.isNight && !state.gameWon) {
      ctx.fillStyle = "rgba(10, 16, 28, 0.35)";
      ctx.fillRect(0, 0, viewWidth, viewHeight);
      drawNightLighting(camera);
    }

    drawBeaconBeam(camera);
    drawRescueSequence(camera);
  }

  function gameLoop() {
    let lastTime = performance.now();

    function frame(time) {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      update(dt);
      render();
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
    const placement = getPlacementItem();
    if (placement) {
      attemptPlace();
    }
  }

  function init() {
    setupSlots();
    resize();
    initMultiplayer();
    loadOrCreateGame();
    updateAllSlotUI();

    window.addEventListener("resize", resize);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("beforeunload", saveGame);

    stickEl.addEventListener("pointerdown", handleStickDown);
    stickEl.addEventListener("pointermove", handleStickMove);
    stickEl.addEventListener("pointerup", handleStickUp);
    stickEl.addEventListener("pointercancel", handleStickUp);

    actionBtn.addEventListener("pointerdown", () => {
      actionPressed = true;
    });

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
    gameLoop();
  }

  init();
})();
