"use client";

import { create } from "zustand";

export type AppMode = "ai" | "manual";

interface ModeState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  toggleMode: () => void;
}

const STORAGE_KEY = "done.mode";

function readInitialMode(): AppMode {
  if (typeof window === "undefined") return "ai";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "manual" || stored === "ai") return stored;
  } catch {
    // ignore
  }
  return "ai";
}

export const useModeStore = create<ModeState>((set, get) => ({
  mode: "ai", // SSR-safe default; client effect below syncs from localStorage
  setMode: (mode) => {
    set({ mode });
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, mode);
      } catch {
        // ignore
      }
    }
  },
  toggleMode: () => {
    const next = get().mode === "ai" ? "manual" : "ai";
    get().setMode(next);
  },
}));

// Client-side hydration hook
export function useHydrateMode() {
  if (typeof window !== "undefined") {
    const stored = readInitialMode();
    const current = useModeStore.getState().mode;
    if (stored !== current) {
      useModeStore.setState({ mode: stored });
    }
  }
}