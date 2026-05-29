/**
 * Simple localStorage wrapper for FASKA flow persistence
 */

const STORAGE_KEY = "montessori_progress";

export const saveProgress = (data) => {
  try {
    const current = loadProgress() || {};
    const updated = { ...current, ...data, lastUpdate: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Failed to save progress", e);
    return null;
  }
};

export const loadProgress = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error("Failed to load progress", e);
    return null;
  }
};

export const getDailySeed = () => {
  const today = new Date().toISOString().split("T")[0];
  // Simple hash for seed
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = (hash << 5) - hash + today.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};
