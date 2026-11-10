"use client";

import { create } from "zustand";

interface UiState {
    addTaskModalOpen: boolean;
    newFolderModalOpen: boolean;
    newFolderParentId: string | null;
    activeTaskId: string | null; // currently running timer item id
    expandedFolders: Record<string, boolean>;
    openAddTaskModal: () => void;
    closeAddTaskModal: () => void;
    setActiveTaskId: (id: string | null) => void;
    openNewFolderModal: (parentId?: string | null) => void;
    closeNewFolderModal: () => void;
    toggleFolder: (id: string) => void;
    setFolderExpanded: (id: string, expanded: boolean) => void;
}

export const useUiStore = create<UiState>((set) => ({
    addTaskModalOpen: false,
    newFolderModalOpen: false,
    newFolderParentId: null,
    activeTaskId: "item-1", // mock: Database Systems has a running session
    expandedFolders: { "folder-1": true },
    openAddTaskModal: () => set({ addTaskModalOpen: true }),
    closeAddTaskModal: () => set({ addTaskModalOpen: false }),
    setActiveTaskId: (id) => set({ activeTaskId: id }),
    openNewFolderModal: (parentId = null) => set({ newFolderModalOpen: true, newFolderParentId: parentId }),
    closeNewFolderModal: () => set({ newFolderModalOpen: false, newFolderParentId: null }),
    toggleFolder: (id) =>
        set((s) => ({ expandedFolders: { ...s.expandedFolders, [id]: !s.expandedFolders[id] } })),
    setFolderExpanded: (id, expanded) =>
        set((s) => ({ expandedFolders: { ...s.expandedFolders, [id]: expanded } })),
}));