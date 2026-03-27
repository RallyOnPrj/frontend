"use client";

const RECENT_GAME_IDS_KEY = "rallyon_recent_game_ids";
const MAX_RECENT_GAMES = 8;

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
}

export function getRecentGameIds(): string[] {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const raw = storage.getItem(RECENT_GAME_IDS_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter((value): value is string => typeof value === "string");
  } catch {
    return [];
  }
}

export function pushRecentGameId(gameId: string): void {
  const storage = getStorage();
  if (!storage || !gameId.trim()) {
    return;
  }

  const nextIds = [gameId, ...getRecentGameIds().filter((id) => id !== gameId)].slice(
    0,
    MAX_RECENT_GAMES
  );
  storage.setItem(RECENT_GAME_IDS_KEY, JSON.stringify(nextIds));
}

export function replaceRecentGameIds(gameIds: string[]): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(
    RECENT_GAME_IDS_KEY,
    JSON.stringify(gameIds.filter(Boolean).slice(0, MAX_RECENT_GAMES))
  );
}
