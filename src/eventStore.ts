import { create } from "zustand";
import type { BaseEvent } from "./types";

type EventListener = (e: BaseEvent) => void;

interface EventStore {
  listeners: EventListener[];
  addListener: (fn: EventListener) => void;
  removeListener: (fn: EventListener) => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  listeners: [],

  addListener(fn) {
    set((s) => ({ listeners: [...s.listeners, fn] }));
  },

  removeListener(fn) {
    set((s) => ({ listeners: s.listeners.filter((f) => f !== fn) }));
  },
}));
