import type { HistoryEntry } from "./types";

const KEY = "tone-shifter-history";
const MAX = 20;

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addHistoryEntry(entry: HistoryEntry): void {
  const entries = loadHistory();
  localStorage.setItem(KEY, JSON.stringify([entry, ...entries].slice(0, MAX)));
}

export function removeHistoryEntry(id: string): void {
  localStorage.setItem(
    KEY,
    JSON.stringify(loadHistory().filter((e) => e.id !== id))
  );
}

export function clearHistory(): void {
  localStorage.removeItem(KEY);
}
