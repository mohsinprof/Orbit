"use client";

import { create } from "zustand";
import type { ChatMessage } from "@/lib/types";
import { mockItemChat } from "@/lib/mock/detail";
import type { OrbitProposal } from "@/lib/mock/orbitResponses";

export interface PendingMention {
  id: string;       // item or folder id
  type: "item" | "folder";
  label: string;    // item.title or folder.title
}

interface ChatState {
  messages: ChatMessage[];
  panelOpen: boolean;
  input: string;
  mentions: PendingMention[];
  pickerOpen: boolean;
  processing: boolean;
  proposals: Record<string, OrbitProposal>; // keyed by message id

  setPanelOpen: (open: boolean) => void;
  togglePanel: () => void;
  setInput: (text: string) => void;
  setPickerOpen: (open: boolean) => void;
  addMention: (m: PendingMention) => void;
  removeMention: (id: string) => void;
  clearMentions: () => void;
  addUserMessage: (content: string, mentionIds: string[]) => string;
  addAssistantMessage: (content: string, proposal: OrbitProposal | null) => string;
  setProcessing: (p: boolean) => void;
  applyProposal: (proposalId: string, messageId: string) => void;
  cancelProposal: (proposalId: string, messageId: string) => void;
}

let idCounter = 100;
const nextId = () => `msg-${++idCounter}`;

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [...mockItemChat],
  panelOpen: false,
  input: "",
  mentions: [],
  pickerOpen: false,
  processing: false,
  proposals: {},

  setPanelOpen: (open) => set({ panelOpen: open }),
  togglePanel: () => set((s) => ({ panelOpen: !s.panelOpen })),

  setInput: (text) => set({ input: text }),

  setPickerOpen: (open) => set({ pickerOpen: open }),

  addMention: (m) =>
    set((s) =>
      s.mentions.find((x) => x.id === m.id)
        ? s
        : { mentions: [...s.mentions, m] },
    ),

  removeMention: (id) =>
    set((s) => ({ mentions: s.mentions.filter((m) => m.id !== id) })),

  clearMentions: () => set({ mentions: [] }),

  addUserMessage: (content, mentionIds) => {
    const id = nextId();
    const msg: ChatMessage = {
      id,
      role: "user",
      content,
      mentions: mentionIds,
      proposal: null,
      proposal_status: null,
      created_at: new Date().toISOString(),
    };
    set((s) => ({ messages: [...s.messages, msg] }));
    return id;
  },

  addAssistantMessage: (content, proposal) => {
    const id = nextId();
    const msg: ChatMessage = {
      id,
      role: "assistant",
      content,
      mentions: [],
      proposal: proposal ? { id: proposal.id, actions: proposal.actions } : null,
      proposal_status: proposal ? "pending" : null,
      created_at: new Date().toISOString(),
    };
    set((s) => ({
      messages: [...s.messages, msg],
      proposals: proposal
        ? { ...s.proposals, [id]: proposal }
        : s.proposals,
    }));
    return id;
  },

  setProcessing: (p) => set({ processing: p }),

  applyProposal: (proposalId, messageId) => {
    set((s) => {
      const proposal = s.proposals[messageId];
      if (!proposal) return s;
      const updated = { ...proposal, status: "applied" as const };
      return {
        proposals: { ...s.proposals, [messageId]: updated },
        messages: s.messages.map((m) =>
          m.id === messageId
            ? { ...m, proposal_status: "applied" }
            : m,
        ),
      };
    });
  },

  cancelProposal: (proposalId, messageId) => {
    set((s) => {
      const proposal = s.proposals[messageId];
      if (!proposal) return s;
      const updated = { ...proposal, status: "cancelled" as const };
      return {
        proposals: { ...s.proposals, [messageId]: updated },
        messages: s.messages.map((m) =>
          m.id === messageId
            ? { ...m, proposal_status: "cancelled" }
            : m,
        ),
      };
    });
  },
}));