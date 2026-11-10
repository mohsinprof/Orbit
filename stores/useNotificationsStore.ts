"use client";

import { create } from "zustand";
import { mockNotifications } from "@/lib/mock/data";

interface NotifState {
  notifications: typeof mockNotifications;
  unreadCount: number;
  panelOpen: boolean;
  markRead: (id: string) => void;
  markAllRead: () => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

function computeUnread(list: typeof mockNotifications) {
  return list.filter((n) => !n.read_at).length;
}

export const useNotificationsStore = create<NotifState>((set, get) => ({
  notifications: mockNotifications,
  unreadCount: computeUnread(mockNotifications),
  panelOpen: false,

  markRead: (id) => {
    set((s) => {
      const updated = s.notifications.map((n) =>
        n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
      );
      return { notifications: updated, unreadCount: computeUnread(updated) };
    });
  },

  markAllRead: () => {
    set((s) => {
      const now = new Date().toISOString();
      const updated = s.notifications.map((n) => ({ ...n, read_at: now }));
      return { notifications: updated, unreadCount: 0 };
    });
  },

  openPanel: () => set({ panelOpen: true }),
  closePanel: () => set({ panelOpen: false }),
  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),
}));