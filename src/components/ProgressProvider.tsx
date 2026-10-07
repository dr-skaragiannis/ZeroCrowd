"use client";

import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import type { ProgressSnapshot } from "@/lib/progress";

type ProgressStore = {
  getSnapshot: () => ProgressSnapshot;
  subscribe: (listener: () => void) => () => void;
  refresh: () => Promise<ProgressSnapshot>;
  ensureSession: () => Promise<void>;
};

const ProgressContext = createContext<ProgressStore | null>(null);

function createProgressStore(initial: ProgressSnapshot): ProgressStore {
  let snapshot = initial;
  let serialized = JSON.stringify(initial);
  let requestNumber = 0;
  let sessionPromise: Promise<void> | null = null;
  const listeners = new Set<() => void>();

  const getSnapshot = () => snapshot;
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  };
  const refresh = async () => {
    const requestId = ++requestNumber;
    const response = await fetch("/api/progress", { cache: "no-store" });
    if (!response.ok) throw new Error("Could not load your progress.");
    const updated = await response.json() as ProgressSnapshot;
    // An older request must never replace newer progress, and unchanged data
    // should not cause even the subscribed widgets to re-render.
    if (requestId === requestNumber) {
      const nextSerialized = JSON.stringify(updated);
      if (nextSerialized !== serialized) {
        snapshot = updated;
        serialized = nextSerialized;
        listeners.forEach(listener => listener());
      }
    }
    return updated;
  };
  const ensureSession = () => {
    if (!snapshot.isPreview) return Promise.resolve();
    if (!sessionPromise) {
      sessionPromise = (async () => {
        const response = await fetch("/api/session", { method: "POST", cache: "no-store" });
        if (!response.ok) throw new Error("Could not start your guest session.");
        await refresh();
      })().finally(() => { sessionPromise = null; });
    }
    return sessionPromise;
  };

  return { getSnapshot, subscribe, refresh, ensureSession };
}

export function ProgressProvider({ initial, children }: { initial: ProgressSnapshot; children: ReactNode }) {
  const [store] = useState(() => createProgressStore(initial));

  useEffect(() => {
    // Guest setup is a one-time background request, never a route refresh.
    if (store.getSnapshot().isPreview) void store.ensureSession().catch(() => {});
  }, [store]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const onReturn = () => {
      if (document.visibilityState !== "visible" || store.getSnapshot().isPreview) return;
      clearTimeout(timeout);
      timeout = setTimeout(() => { void store.refresh().catch(() => {}); }, 200);
    };
    window.addEventListener("focus", onReturn);
    document.addEventListener("visibilitychange", onReturn);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("focus", onReturn);
      document.removeEventListener("visibilitychange", onReturn);
    };
  }, [store]);

  return <ProgressContext.Provider value={store}>{children}</ProgressContext.Provider>;
}

function useProgressStore() {
  const store = useContext(ProgressContext);
  if (!store) throw new Error("ProgressProvider is required for progress tracking.");
  return store;
}

export function useProgress() {
  const store = useProgressStore();
  return useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot);
}

// Actions can update progress without subscribing to every XP change themselves.
export function useProgressActions() {
  const { refresh, ensureSession } = useProgressStore();
  return { refresh, ensureSession };
}
