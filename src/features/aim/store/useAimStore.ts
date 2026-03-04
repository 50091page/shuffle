import { create } from "zustand";

export type AimGameState = "idle" | "playing" | "paused" | "finished";
export type TargetStyleKey = "ember" | "mint" | "violet" | "sunset" | "frost";
export type TargetSizeMultiplier = 0.5 | 1 | 1.5 | 2;
export type TargetLifetimeMs = number;

const DEFAULT_TIME_LEFT_MS = 30_000;
const DEFAULT_TARGET_DURATION_MS: TargetLifetimeMs = 1_000;
const MIN_TARGET_DURATION_MS = 500;
const MAX_TARGET_DURATION_MS = 1_000;

type AimState = {
  score: number;
  misses: number;
  totalClicks: number;
  offTargetClicks: number;
  timeLeft: number;
  gameState: AimGameState;
  targetDuration: TargetLifetimeMs;
  targetStyle: TargetStyleKey;
  targetSizeMultiplier: TargetSizeMultiplier;
};

type AimActions = {
  startGame: (timeLeftMs?: number) => void;
  pauseGame: () => void;
  resumeGame: () => void;
  finishGame: () => void;
  tick: (elapsedMs: number) => void;
  registerHit: () => void;
  registerMiss: () => void;
  registerOffTargetClick: () => void;
  setTargetStyle: (style: TargetStyleKey) => void;
  setTargetSizeMultiplier: (sizeMultiplier: TargetSizeMultiplier) => void;
  setTargetLifetimeMs: (duration: TargetLifetimeMs) => void;
  resetGame: () => void;
};

const initialState: AimState = {
  score: 0,
  misses: 0,
  totalClicks: 0,
  offTargetClicks: 0,
  timeLeft: DEFAULT_TIME_LEFT_MS,
  gameState: "idle",
  targetDuration: DEFAULT_TARGET_DURATION_MS,
  targetStyle: "ember",
  targetSizeMultiplier: 1,
};

export const useAimStore = create<AimState & AimActions>((set) => ({
  ...initialState,
  startGame: (timeLeftMs = DEFAULT_TIME_LEFT_MS) =>
    set((state) => ({
      score: 0,
      misses: 0,
      totalClicks: 0,
      offTargetClicks: 0,
      timeLeft: Math.max(0, timeLeftMs),
      gameState: "playing",
      targetDuration: state.targetDuration,
      targetStyle: state.targetStyle,
      targetSizeMultiplier: state.targetSizeMultiplier,
    })),
  pauseGame: () =>
    set((state) => ({
      gameState: state.gameState === "playing" ? "paused" : state.gameState,
    })),
  resumeGame: () =>
    set((state) => ({
      gameState: state.gameState === "paused" ? "playing" : state.gameState,
    })),
  finishGame: () => set({ gameState: "finished" }),
  tick: (elapsedMs) =>
    set((state) => {
      if (state.gameState !== "playing") {
        return state;
      }

      const nextTimeLeft = Math.max(0, state.timeLeft - Math.max(0, elapsedMs));
      return {
        timeLeft: nextTimeLeft,
        gameState: nextTimeLeft === 0 ? "finished" : state.gameState,
      };
    }),
  registerHit: () =>
    set((state) => ({
      totalClicks: state.totalClicks + 1,
      score: state.score + 1,
    })),
  registerMiss: () =>
    set((state) => ({
      misses: state.misses + 1,
    })),
  registerOffTargetClick: () =>
    set((state) => ({
      totalClicks: state.totalClicks + 1,
      offTargetClicks: state.offTargetClicks + 1,
    })),
  setTargetStyle: (style) => set({ targetStyle: style }),
  setTargetSizeMultiplier: (sizeMultiplier) => set({ targetSizeMultiplier: sizeMultiplier }),
  setTargetLifetimeMs: (duration) =>
    set({
      targetDuration: Math.max(MIN_TARGET_DURATION_MS, Math.min(MAX_TARGET_DURATION_MS, duration)),
    }),
  resetGame: () =>
    set((state) => ({
      ...initialState,
      targetStyle: state.targetStyle,
      targetDuration: state.targetDuration,
      targetSizeMultiplier: state.targetSizeMultiplier,
    })),
}));
