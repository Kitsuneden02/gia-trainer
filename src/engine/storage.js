/**
 * GIA Trainer Local Storage & Metrics Persistence Engine
 * Manages training history, personal bests, and benchmark tracking using localStorage.
 */

const STORAGE_KEYS = {
  HISTORY: 'gia_training_history',
  PERSONAL_BESTS: 'gia_personal_bests',
  SETTINGS: 'gia_user_settings'
};

const MAX_HISTORY_ITEMS = 50;

/**
 * Safely accesses localStorage to handle private browsing / disabled storage modes.
 */
function getStorage() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
  } catch (e) {
    // Storage restricted or inaccessible
  }
  return null;
}

/**
 * Retrieves all stored training session records.
 * @returns {Array<Object>}
 */
export function getSessionHistory() {
  const storage = getStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Retrieves personal best records grouped by battery.
 * @returns {Object}
 */
export function getPersonalBests() {
  const storage = getStorage();
  if (!storage) return {};

  try {
    const raw = storage.getItem(STORAGE_KEYS.PERSONAL_BESTS);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

/**
 * Saves a completed session result, updating history and personal bests.
 * @param {Object} sessionResult
 * @returns {{ isNewPb: boolean, previousPb: number|null }}
 */
export function saveSessionResult(sessionResult) {
  const storage = getStorage();
  const battery = sessionResult.battery;
  const netScore = Math.round((sessionResult.netScore || 0) * 10) / 10;
  const qpm = sessionResult.throughputQpm || 0;
  const accuracy = sessionResult.accuracy || 0;

  const record = {
    id: `sess-${Date.now()}`,
    timestamp: new Date().toISOString(),
    battery,
    durationSec: sessionResult.durationSec || 0,
    elapsedSec: sessionResult.elapsedSec || 0,
    netScore,
    correct: sessionResult.correct || 0,
    total: sessionResult.total || 0,
    accuracy,
    throughputQpm: qpm,
    avgRtMs: sessionResult.avgRtMs || 0,
    bestStreak: sessionResult.bestStreak || 0,
    targetTier: sessionResult.targetTier || 'none',
    targetMet: Boolean(sessionResult.targetMet)
  };

  let isNewPb = false;
  let previousPb = null;

  if (!storage) {
    return { isNewPb: false, previousPb: null, record };
  }

  try {
    // 1. Update Personal Bests
    const pbs = getPersonalBests();
    const currentPb = pbs[battery];

    if (currentPb) {
      previousPb = currentPb.netScore;
      if (netScore > currentPb.netScore) {
        isNewPb = true;
        pbs[battery] = {
          netScore,
          throughputQpm: qpm,
          accuracy,
          bestStreak: sessionResult.bestStreak || 0,
          timestamp: record.timestamp,
          durationSec: sessionResult.durationSec
        };
      }
    } else {
      isNewPb = netScore > 0;
      pbs[battery] = {
        netScore,
        throughputQpm: qpm,
        accuracy,
        bestStreak: sessionResult.bestStreak || 0,
        timestamp: record.timestamp,
        durationSec: sessionResult.durationSec
      };
    }

    storage.setItem(STORAGE_KEYS.PERSONAL_BESTS, JSON.stringify(pbs));

    // 2. Append to History (capped at MAX_HISTORY_ITEMS)
    const history = getSessionHistory();
    history.unshift(record);
    if (history.length > MAX_HISTORY_ITEMS) {
      history.length = MAX_HISTORY_ITEMS;
    }
    storage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  } catch (e) {
    console.warn('Unable to persist session to localStorage:', e);
  }

  return { isNewPb, previousPb, record };
}

/**
 * Clears all stored sessions and personal best records.
 */
export function clearAllStorage() {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEYS.HISTORY);
    storage.removeItem(STORAGE_KEYS.PERSONAL_BESTS);
  } catch (e) {
    console.warn('Unable to clear storage:', e);
  }
}
