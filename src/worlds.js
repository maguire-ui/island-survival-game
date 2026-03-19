(() => {
  "use strict";

  const config = window.ISGConfig || Object.create(null);
  const ACTIVE_WORLD_ID_KEY = config.ACTIVE_WORLD_ID_KEY || "island_survival_active_world_id_v1";
  const LEGACY_SEED_ROUTING_ENABLED = config.LEGACY_SEED_ROUTING_ENABLED !== false;
  const LOCAL_WORLD_LIMIT = Math.max(1, Number(config.LOCAL_WORLD_LIMIT) || 3);
  const SAVE_KEY_PREFIX = typeof config.SAVE_KEY_PREFIX === "string"
    ? config.SAVE_KEY_PREFIX
    : "island_survival_seed_save_v1:";
  const SAVE_VERSION = Number(config.SAVE_VERSION) || 1;
  const WORLD_DB_NAME = typeof config.WORLD_DB_NAME === "string"
    ? config.WORLD_DB_NAME
    : "island_survival_worlds_v1";
  const WORLD_DB_VERSION = Math.max(1, Number(config.WORLD_DB_VERSION) || 1);
  const WORLD_DB_STORES = config.WORLD_DB_STORES || Object.freeze({
    meta: "worldMeta",
    save: "worldSave",
    thumb: "worldThumb",
    legacy: "legacyImportState",
  });
  const WORLD_LAYOUT_VERSION = typeof config.WORLD_LAYOUT_VERSION === "string"
    ? config.WORLD_LAYOUT_VERSION
    : "legacy";
  const WORLD_METADATA_VERSION = Math.max(1, Number(config.WORLD_METADATA_VERSION) || 1);
  const WORLD_PAYLOAD_VERSION = Math.max(1, Number(config.WORLD_PAYLOAD_VERSION) || 1);
  const WORLD_SCHEMA_VERSION = Math.max(1, Number(config.WORLD_SCHEMA_VERSION) || 1);

  const WORLD_META_CACHE_KEY = "island_survival_world_meta_cache_v1";
  const WORLD_SAVE_FALLBACK_PREFIX = "island_survival_world_record_save_v1:";
  const WORLD_THUMB_FALLBACK_PREFIX = "island_survival_world_thumb_v1:";
  const WORLD_LEGACY_IMPORT_MAP_KEY = "island_survival_world_legacy_import_map_v1";
  const DEFAULT_WORLD_NAME = "World";

  let dbPromise = null;

  function safeParseJson(raw, fallback = null) {
    if (typeof raw !== "string" || !raw) return fallback;
    try {
      return JSON.parse(raw);
    } catch (err) {
      return fallback;
    }
  }

  function readLocalJson(key, fallback) {
    try {
      return safeParseJson(window.localStorage.getItem(key), fallback);
    } catch (err) {
      return fallback;
    }
  }

  function writeLocalJson(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      return false;
    }
  }

  function removeLocalKey(key) {
    try {
      window.localStorage.removeItem(key);
      return true;
    } catch (err) {
      return false;
    }
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

  function normalizeWorldMode(mode) {
    return mode === "multiplayer" ? "multiplayer" : "solo";
  }

  function sanitizeWorldName(value, fallback = DEFAULT_WORLD_NAME) {
    const raw = String(value ?? "").trim().replace(/\s+/g, " ");
    const clipped = raw.slice(0, 32).trim();
    if (clipped) return clipped;
    const fallbackText = String(fallback ?? DEFAULT_WORLD_NAME).trim();
    return (fallbackText || DEFAULT_WORLD_NAME).slice(0, 32);
  }

  function humanizeSeed(seed) {
    const normalized = normalizeSeedValue(seed);
    return normalized
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ") || DEFAULT_WORLD_NAME;
  }

  function buildWorldId(seed) {
    const normalizedSeed = normalizeSeedValue(seed);
    const now = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    const seedTag = normalizedSeed.slice(0, 12).replace(/[^a-z0-9]+/g, "");
    return `world-${seedTag || "seed"}-${now}-${rand}`;
  }

  function normalizeWorldRecord(record) {
    if (!record || typeof record !== "object") return null;
    const seed = normalizeSeedValue(record.seed);
    const id = String(record.id || buildWorldId(seed));
    const createdAt = Number.isFinite(Number(record.createdAt))
      ? Number(record.createdAt)
      : Date.now();
    const lastPlayedAt = Number.isFinite(Number(record.lastPlayedAt))
      ? Number(record.lastPlayedAt)
      : createdAt;
    const thumbnailId = typeof record.thumbnailId === "string" && record.thumbnailId
      ? record.thumbnailId
      : `thumb-${id}`;
    return {
      id,
      name: sanitizeWorldName(record.name, humanizeSeed(seed)),
      mode: normalizeWorldMode(record.mode),
      seed,
      createdAt,
      lastPlayedAt,
      lastPlayerName: typeof record.lastPlayerName === "string" ? record.lastPlayerName.slice(0, 20) : "",
      saveVersion: Number.isFinite(Number(record.saveVersion)) ? Number(record.saveVersion) : SAVE_VERSION,
      worldLayoutVersion: typeof record.worldLayoutVersion === "string" && record.worldLayoutVersion
        ? record.worldLayoutVersion
        : WORLD_LAYOUT_VERSION,
      thumbnailId,
      lastLocationLabel: typeof record.lastLocationLabel === "string" ? record.lastLocationLabel.slice(0, 40) : "",
      lastBiomeLabel: typeof record.lastBiomeLabel === "string" ? record.lastBiomeLabel.slice(0, 40) : "",
      legacySourceKey: typeof record.legacySourceKey === "string" ? record.legacySourceKey : null,
      schemaVersion: Number.isFinite(Number(record.schemaVersion))
        ? Number(record.schemaVersion)
        : WORLD_SCHEMA_VERSION,
      pendingDelete: !!record.pendingDelete,
    };
  }

  function sortWorldRecords(records) {
    return [...records].sort((a, b) => {
      const lastDiff = (Number(b.lastPlayedAt) || 0) - (Number(a.lastPlayedAt) || 0);
      if (lastDiff) return lastDiff;
      const createdDiff = (Number(b.createdAt) || 0) - (Number(a.createdAt) || 0);
      if (createdDiff) return createdDiff;
      return String(a.name).localeCompare(String(b.name));
    });
  }

  function readMetaCache() {
    const raw = readLocalJson(WORLD_META_CACHE_KEY, []);
    if (!Array.isArray(raw)) return [];
    return sortWorldRecords(
      raw
        .map((record) => normalizeWorldRecord(record))
        .filter(Boolean)
        .filter((record) => !record.pendingDelete)
    );
  }

  function writeMetaCache(records) {
    return writeLocalJson(WORLD_META_CACHE_KEY, sortWorldRecords(records));
  }

  function upsertMetaCache(record) {
    const normalized = normalizeWorldRecord(record);
    if (!normalized) return null;
    const next = readMetaCache().filter((entry) => entry.id !== normalized.id);
    next.push(normalized);
    writeMetaCache(next);
    return normalized;
  }

  function removeMetaCache(worldId) {
    const next = readMetaCache().filter((entry) => entry.id !== worldId);
    writeMetaCache(next);
  }

  function getWorldSync(worldId) {
    const id = String(worldId || "");
    if (!id) return null;
    return readMetaCache().find((record) => record.id === id) || null;
  }

  function listWorldsSync() {
    return readMetaCache();
  }

  function getCapacityStatusSync() {
    const worlds = readMetaCache();
    const used = worlds.length;
    return {
      used,
      limit: LOCAL_WORLD_LIMIT,
      remaining: Math.max(0, LOCAL_WORLD_LIMIT - used),
      full: used >= LOCAL_WORLD_LIMIT,
    };
  }

  function readLegacyImportMap() {
    const raw = readLocalJson(WORLD_LEGACY_IMPORT_MAP_KEY, Object.create(null));
    return raw && typeof raw === "object" ? raw : Object.create(null);
  }

  function writeLegacyImportMap(map) {
    return writeLocalJson(WORLD_LEGACY_IMPORT_MAP_KEY, map && typeof map === "object" ? map : Object.create(null));
  }

  function getImportedWorldIdForLegacyKey(seedKey) {
    const key = String(seedKey || "");
    if (!key) return null;
    const map = readLegacyImportMap();
    const value = map[key];
    return typeof value === "string" && value ? value : null;
  }

  function markLegacyImported(seedKey, worldId) {
    const key = String(seedKey || "");
    const id = String(worldId || "");
    if (!key || !id) return false;
    const map = readLegacyImportMap();
    map[key] = id;
    return writeLegacyImportMap(map);
  }

  function getSaveFallbackKey(worldId) {
    return `${WORLD_SAVE_FALLBACK_PREFIX}${String(worldId || "")}`;
  }

  function getThumbFallbackKey(thumbId) {
    return `${WORLD_THUMB_FALLBACK_PREFIX}${String(thumbId || "")}`;
  }

  function loadWorldPayloadSync(worldId) {
    const key = getSaveFallbackKey(worldId);
    const envelope = readLocalJson(key, null);
    if (!envelope || typeof envelope !== "object") return null;
    if (typeof envelope.worldId !== "string" || envelope.worldId !== String(worldId)) return null;
    return envelope;
  }

  function saveWorldPayloadFallback(worldId, envelope) {
    return writeLocalJson(getSaveFallbackKey(worldId), envelope);
  }

  function removeWorldPayloadFallback(worldId) {
    return removeLocalKey(getSaveFallbackKey(worldId));
  }

  function loadThumbnailDataUrlSync(thumbnailId) {
    try {
      const raw = window.localStorage.getItem(getThumbFallbackKey(thumbnailId));
      return typeof raw === "string" && raw ? raw : "";
    } catch (err) {
      return "";
    }
  }

  function saveThumbnailFallback(thumbnailId, dataUrl) {
    try {
      window.localStorage.setItem(getThumbFallbackKey(thumbnailId), String(dataUrl || ""));
      return true;
    } catch (err) {
      return false;
    }
  }

  function removeThumbnailFallback(thumbnailId) {
    return removeLocalKey(getThumbFallbackKey(thumbnailId));
  }

  function openWorldDb() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve) => {
      if (typeof indexedDB === "undefined") {
        resolve(null);
        return;
      }
      let request = null;
      try {
        request = indexedDB.open(WORLD_DB_NAME, WORLD_DB_VERSION);
      } catch (err) {
        resolve(null);
        return;
      }
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(WORLD_DB_STORES.meta)) {
          db.createObjectStore(WORLD_DB_STORES.meta, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(WORLD_DB_STORES.save)) {
          db.createObjectStore(WORLD_DB_STORES.save, { keyPath: "worldId" });
        }
        if (!db.objectStoreNames.contains(WORLD_DB_STORES.thumb)) {
          db.createObjectStore(WORLD_DB_STORES.thumb, { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains(WORLD_DB_STORES.legacy)) {
          db.createObjectStore(WORLD_DB_STORES.legacy, { keyPath: "key" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
      request.onblocked = () => resolve(null);
    });
    return dbPromise;
  }

  function withStore(storeName, mode, executor) {
    return openWorldDb().then((db) => {
      if (!db) return null;
      return new Promise((resolve, reject) => {
        let transaction = null;
        try {
          transaction = db.transaction(storeName, mode);
        } catch (err) {
          resolve(null);
          return;
        }
        const store = transaction.objectStore(storeName);
        let settled = false;
        transaction.oncomplete = () => {
          if (!settled) {
            settled = true;
            resolve(null);
          }
        };
        transaction.onerror = () => {
          if (!settled) {
            settled = true;
            reject(transaction.error || new Error(`IndexedDB transaction failed for ${storeName}`));
          }
        };
        transaction.onabort = () => {
          if (!settled) {
            settled = true;
            reject(transaction.error || new Error(`IndexedDB transaction aborted for ${storeName}`));
          }
        };
        executor(store, resolve, reject, () => {
          settled = true;
        });
      });
    }).catch(() => null);
  }

  function idbPut(storeName, value) {
    return withStore(storeName, "readwrite", (store, resolve, reject, settle) => {
      const request = store.put(value);
      request.onsuccess = () => {
        settle();
        resolve(value);
      };
      request.onerror = () => {
        settle();
        reject(request.error || new Error(`Failed to put ${storeName}`));
      };
    });
  }

  function idbGet(storeName, key) {
    return withStore(storeName, "readonly", (store, resolve, reject, settle) => {
      const request = store.get(key);
      request.onsuccess = () => {
        settle();
        resolve(request.result || null);
      };
      request.onerror = () => {
        settle();
        reject(request.error || new Error(`Failed to get ${storeName}`));
      };
    });
  }

  function idbGetAll(storeName) {
    return withStore(storeName, "readonly", (store, resolve, reject, settle) => {
      const request = store.getAll();
      request.onsuccess = () => {
        settle();
        resolve(Array.isArray(request.result) ? request.result : []);
      };
      request.onerror = () => {
        settle();
        reject(request.error || new Error(`Failed to list ${storeName}`));
      };
    });
  }

  function idbDelete(storeName, key) {
    return withStore(storeName, "readwrite", (store, resolve, reject, settle) => {
      const request = store.delete(key);
      request.onsuccess = () => {
        settle();
        resolve(true);
      };
      request.onerror = () => {
        settle();
        reject(request.error || new Error(`Failed to delete ${storeName}`));
      };
    });
  }

  function queueDbWrite(promise) {
    if (!promise || typeof promise.then !== "function") return;
    promise.catch(() => {
      // Local mirrors remain authoritative for live bootstrap if IndexedDB fails.
    });
  }

  function getStoredActiveWorldId() {
    try {
      const value = window.localStorage.getItem(ACTIVE_WORLD_ID_KEY);
      return value ? String(value) : null;
    } catch (err) {
      return null;
    }
  }

  function setStoredActiveWorldId(worldId) {
    const next = String(worldId || "").trim();
    if (!next) {
      clearStoredActiveWorldId();
      return null;
    }
    try {
      window.localStorage.setItem(ACTIVE_WORLD_ID_KEY, next);
    } catch (err) {
      // ignore pointer persistence failures
    }
    return next;
  }

  function clearStoredActiveWorldId() {
    try {
      window.localStorage.removeItem(ACTIVE_WORLD_ID_KEY);
    } catch (err) {
      // ignore pointer removal failures
    }
  }

  function buildWorldRecord(input) {
    const seed = normalizeSeedValue(input?.seed);
    const now = Date.now();
    return normalizeWorldRecord({
      id: input?.id || buildWorldId(seed),
      name: sanitizeWorldName(input?.name, humanizeSeed(seed)),
      mode: normalizeWorldMode(input?.mode),
      seed,
      createdAt: Number.isFinite(Number(input?.createdAt)) ? Number(input.createdAt) : now,
      lastPlayedAt: Number.isFinite(Number(input?.lastPlayedAt)) ? Number(input.lastPlayedAt) : now,
      lastPlayerName: typeof input?.lastPlayerName === "string" ? input.lastPlayerName : "",
      saveVersion: Number.isFinite(Number(input?.saveVersion)) ? Number(input.saveVersion) : SAVE_VERSION,
      worldLayoutVersion: typeof input?.worldLayoutVersion === "string"
        ? input.worldLayoutVersion
        : WORLD_LAYOUT_VERSION,
      thumbnailId: typeof input?.thumbnailId === "string" ? input.thumbnailId : null,
      lastLocationLabel: typeof input?.lastLocationLabel === "string" ? input.lastLocationLabel : "",
      lastBiomeLabel: typeof input?.lastBiomeLabel === "string" ? input.lastBiomeLabel : "",
      legacySourceKey: typeof input?.legacySourceKey === "string" ? input.legacySourceKey : null,
      schemaVersion: WORLD_SCHEMA_VERSION,
    });
  }

  function createWorld(options = null) {
    const opts = options && typeof options === "object" ? options : Object.create(null);
    const capacity = getCapacityStatusSync();
    if (capacity.full) {
      throw new Error(`World capacity reached (${capacity.limit}).`);
    }
    const record = buildWorldRecord(opts);
    upsertMetaCache(record);
    setStoredActiveWorldId(record.id);
    queueDbWrite(idbPut(WORLD_DB_STORES.meta, record));
    return record;
  }

  function updateWorldMetadata(worldId, patch = null) {
    const record = getWorldSync(worldId);
    if (!record) return null;
    const next = normalizeWorldRecord({
      ...record,
      ...(patch && typeof patch === "object" ? patch : Object.create(null)),
      id: record.id,
    });
    upsertMetaCache(next);
    queueDbWrite(idbPut(WORLD_DB_STORES.meta, next));
    return next;
  }

  function saveWorld(worldId, payload, metadataPatch = null) {
    const record = getWorldSync(worldId);
    if (!record) {
      throw new Error(`World "${worldId}" does not exist.`);
    }
    const envelope = {
      worldId: record.id,
      metadataVersion: WORLD_METADATA_VERSION,
      payloadVersion: WORLD_PAYLOAD_VERSION,
      savePayload: payload,
    };
    saveWorldPayloadFallback(record.id, envelope);
    const nextRecord = updateWorldMetadata(record.id, {
      ...(metadataPatch && typeof metadataPatch === "object" ? metadataPatch : Object.create(null)),
      seed: normalizeSeedValue(metadataPatch?.seed ?? record.seed),
      mode: normalizeWorldMode(metadataPatch?.mode ?? record.mode),
      lastPlayedAt: Number.isFinite(Number(metadataPatch?.lastPlayedAt))
        ? Number(metadataPatch.lastPlayedAt)
        : Date.now(),
    });
    const savePromise = idbPut(WORLD_DB_STORES.save, envelope);
    if (nextRecord) {
      queueDbWrite(idbPut(WORLD_DB_STORES.meta, nextRecord));
    }
    return savePromise.then(() => nextRecord || record).catch(() => nextRecord || record);
  }

  function loadWorldPayload(worldId) {
    const id = String(worldId || "");
    if (!id) return Promise.resolve(null);
    return idbGet(WORLD_DB_STORES.save, id).then((result) => {
      if (result && typeof result === "object") {
        saveWorldPayloadFallback(id, result);
        return result;
      }
      return loadWorldPayloadSync(id);
    });
  }

  function listWorlds() {
    return idbGetAll(WORLD_DB_STORES.meta).then((records) => {
      if (Array.isArray(records) && records.length > 0) {
        const normalized = sortWorldRecords(records.map((record) => normalizeWorldRecord(record)).filter(Boolean));
        writeMetaCache(normalized);
        return normalized;
      }
      return listWorldsSync();
    });
  }

  function getWorld(worldId) {
    const id = String(worldId || "");
    if (!id) return Promise.resolve(null);
    return idbGet(WORLD_DB_STORES.meta, id).then((record) => {
      if (record && typeof record === "object") {
        const normalized = normalizeWorldRecord(record);
        if (normalized) upsertMetaCache(normalized);
        return normalized;
      }
      return getWorldSync(id);
    });
  }

  function deleteWorld(worldId) {
    const record = getWorldSync(worldId);
    if (!record) return false;
    removeMetaCache(record.id);
    removeWorldPayloadFallback(record.id);
    removeThumbnailFallback(record.thumbnailId);
    const importMap = readLegacyImportMap();
    for (const [legacyKey, mappedWorldId] of Object.entries(importMap)) {
      if (mappedWorldId === record.id) {
        delete importMap[legacyKey];
      }
    }
    writeLegacyImportMap(importMap);
    queueDbWrite(idbDelete(WORLD_DB_STORES.save, record.id));
    queueDbWrite(idbDelete(WORLD_DB_STORES.thumb, record.thumbnailId));
    queueDbWrite(idbDelete(WORLD_DB_STORES.meta, record.id));
    return true;
  }

  function captureThumbnail(worldId, dataUrl) {
    const record = getWorldSync(worldId);
    if (!record) return Promise.resolve(false);
    const thumbnailId = record.thumbnailId || `thumb-${record.id}`;
    saveThumbnailFallback(thumbnailId, dataUrl);
    const nextRecord = updateWorldMetadata(record.id, { thumbnailId });
    const payload = { id: thumbnailId, dataUrl: String(dataUrl || "") };
    return idbPut(WORLD_DB_STORES.thumb, payload)
      .then(() => {
        if (nextRecord) {
          queueDbWrite(idbPut(WORLD_DB_STORES.meta, nextRecord));
        }
        return true;
      })
      .catch(() => true);
  }

  function loadThumbnailDataUrl(thumbnailId) {
    const id = String(thumbnailId || "");
    if (!id) return Promise.resolve("");
    return idbGet(WORLD_DB_STORES.thumb, id).then((thumb) => {
      if (thumb && typeof thumb.dataUrl === "string") {
        saveThumbnailFallback(id, thumb.dataUrl);
        return thumb.dataUrl;
      }
      return loadThumbnailDataUrlSync(id);
    });
  }

  function getCapacityStatus() {
    return Promise.resolve(getCapacityStatusSync());
  }

  function scanLegacySeedSaves() {
    const importMap = readLegacyImportMap();
    const keys = [];
    try {
      for (let index = 0; index < window.localStorage.length; index += 1) {
        const key = window.localStorage.key(index);
        if (typeof key === "string" && key.startsWith(SAVE_KEY_PREFIX)) {
          keys.push(key);
        }
      }
    } catch (err) {
      return [];
    }
    return keys.map((key) => {
      const payload = readLocalJson(key, null);
      const seed = normalizeSeedValue(payload?.seed ?? key.slice(SAVE_KEY_PREFIX.length));
      const importedWorldId = importMap[key] || null;
      return {
        key,
        seed,
        importedWorldId,
        importable: !!payload && typeof payload === "object",
        corrupted: !payload || typeof payload !== "object",
        saveVersion: Number.isFinite(Number(payload?.version)) ? Number(payload.version) : null,
        worldLayoutVersion: typeof payload?.worldLayoutVersion === "string" ? payload.worldLayoutVersion : "",
      };
    }).sort((a, b) => String(a.seed).localeCompare(String(b.seed)));
  }

  function importLegacySeedSave(seedKey, options = null) {
    const key = String(seedKey || "");
    if (!key) {
      throw new Error("Missing legacy save key.");
    }
    const existingWorldId = getImportedWorldIdForLegacyKey(key);
    if (existingWorldId) {
      return getWorldSync(existingWorldId);
    }
    const payload = readLocalJson(key, null);
    if (!payload || typeof payload !== "object") {
      throw new Error("Legacy save payload is missing or corrupted.");
    }
    const opts = options && typeof options === "object" ? options : Object.create(null);
    const seed = normalizeSeedValue(payload.seed ?? key.slice(SAVE_KEY_PREFIX.length));
    const fallbackName = humanizeSeed(seed);
    const record = createWorld({
      name: sanitizeWorldName(opts.name, fallbackName),
      mode: normalizeWorldMode(opts.mode),
      seed,
      lastPlayerName: typeof opts.lastPlayerName === "string" ? opts.lastPlayerName : "",
      legacySourceKey: key,
      saveVersion: Number.isFinite(Number(payload.version)) ? Number(payload.version) : SAVE_VERSION,
      worldLayoutVersion: typeof payload.worldLayoutVersion === "string"
        ? payload.worldLayoutVersion
        : WORLD_LAYOUT_VERSION,
    });
    saveWorld(record.id, payload, {
      legacySourceKey: key,
      lastPlayedAt: Date.now(),
      saveVersion: Number.isFinite(Number(payload.version)) ? Number(payload.version) : SAVE_VERSION,
      worldLayoutVersion: typeof payload.worldLayoutVersion === "string"
        ? payload.worldLayoutVersion
        : WORLD_LAYOUT_VERSION,
    });
    markLegacyImported(key, record.id);
    queueDbWrite(idbPut(WORLD_DB_STORES.legacy, {
      key,
      worldId: record.id,
      importedAt: Date.now(),
    }));
    return record;
  }

  function warmOpenDatabase() {
    return openWorldDb().then(() => true).catch(() => false);
  }

  function getWorldSystemDiagnosticSnapshot() {
    return {
      activeWorldId: getStoredActiveWorldId(),
      capacity: getCapacityStatusSync(),
      worlds: listWorldsSync().map((world) => ({
        id: world.id,
        name: world.name,
        mode: world.mode,
        seed: world.seed,
        lastPlayedAt: world.lastPlayedAt,
      })),
      legacy: scanLegacySeedSaves(),
      legacySeedRouting: LEGACY_SEED_ROUTING_ENABLED,
    };
  }

  window.ISGWorlds = Object.freeze({
    buildWorldId,
    captureThumbnail,
    clearStoredActiveWorldId,
    createWorld,
    deleteWorld,
    getCapacityStatus,
    getCapacityStatusSync,
    getImportedWorldIdForLegacyKey,
    getStoredActiveWorldId,
    getWorld,
    getWorldSync,
    getWorldSystemDiagnosticSnapshot,
    importLegacySeedSave,
    listWorlds,
    listWorldsSync,
    loadThumbnailDataUrl,
    loadThumbnailDataUrlSync,
    loadWorldPayload,
    loadWorldPayloadSync,
    normalizeSeedValue,
    normalizeWorldRecord,
    sanitizeWorldName,
    scanLegacySeedSaves,
    saveWorld,
    setStoredActiveWorldId,
    updateWorldMetadata,
    warmOpenDatabase,
  });
})();
