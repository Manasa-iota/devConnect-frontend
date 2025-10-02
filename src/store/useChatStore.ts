import { create } from "zustand";
import { api } from "../lib/apiClient";
import { getSocket } from "../lib/socket";
import type { Conversation, ChatMessage } from "../types/messages";
import { useAuthStore } from "./useAuthStore";

type State = {
  conversations: Conversation[];
  messages: Record<string, ChatMessage[]>;
  typing: Record<string, boolean>;
  activeId: string | null;
  loading: boolean;
  error: string | null;
};

type Actions = {
  init: () => void;
  loadConversations: () => Promise<void>;
  openConversation: (conversationId: string) => Promise<void>;
  openByPeer: (peerId: string) => Promise<void>;
  sendMessage: (conversationId: string | null, to: string, text: string) => Promise<void>;
  setActive: (id: string | null) => void;
  markTyping: (conversationId: string, to: string, typing: boolean) => void;
};

export const useChatStore = create<State & Actions>((set, get) => ({
  conversations: [],
  messages: {},
  typing: {},
  activeId: null,
  loading: false,
  error: null,

  init: () => {
    const socket = getSocket();
    const me = useAuthStore.getState().user?.id;

    socket.off("message:new").on("message:new", (m: ChatMessage) => {
      set((s) => ({
        messages: { ...s.messages, [m.conversationId]: [...(s.messages[m.conversationId] || []), m] },
        conversations: s.conversations.map((c) =>
          c.id === m.conversationId ? { ...c, lastMessage: m.text, unread: c.unread + 1, updatedAt: new Date().toISOString() } : c
        )
      }));
    });

    socket.off("message:echo").on("message:echo", (m: ChatMessage) => {
      set((s) => ({
        messages: { ...s.messages, [m.conversationId]: [...(s.messages[m.conversationId] || []), m] },
        conversations: s.conversations.map((c) =>
          c.id === m.conversationId ? { ...c, lastMessage: m.text, updatedAt: new Date().toISOString() } : c
        )
      }));
    });

    socket.off("message:typing").on("message:typing", (d: { conversationId: string; from: string; typing: boolean }) => {
      if (d.from === me) return;
      set((s) => ({ typing: { ...s.typing, [d.conversationId]: d.typing } }));
    });
  },

  loadConversations: async () => {
    set({ loading: true, error: null });
    try {
      const res = await api<{ success: true; items: Conversation[] }>("/messages/conversations");
      set({ conversations: res.items });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  openConversation: async (conversationId) => {
    set({ activeId: conversationId });
    const res = await api<{ success: true; items: ChatMessage[]; nextCursor: string | null }>(
      `/messages/conversations/${conversationId}/messages?limit=50`
    );
    set((s) => ({ messages: { ...s.messages, [conversationId]: res.items } }));
    await api<{ success: true }>(`/messages/conversations/${conversationId}/read`, { method: "POST" });
    set((s) => ({ conversations: s.conversations.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)) }));
  },

  openByPeer: async (peerId) => {
    const existing = get().conversations.find((c) => c.participants.some((p) => p.id === peerId));
    if (existing) {
      await get().openConversation(existing.id);
      return;
    }
    const res = await api<{ success: true; conversationId: string }>("/messages/conversations", { method: "POST", body: { peerId } });
    await get().loadConversations();
    await get().openConversation(res.conversationId);
  },

  sendMessage: async (conversationId, to, text) => {
    const socket = getSocket();
    await new Promise<void>((resolve, reject) => {
      socket.emit("message:send", { conversationId, to, text }, (ack: any) => (ack?.ok ? resolve() : reject(new Error(ack?.error || "send_failed"))));
    });
  },

  setActive: (id) => set({ activeId: id }),

  markTyping: (conversationId, to, typing) => {
    const socket = getSocket();
    socket.emit("message:typing", { conversationId, to, typing });
  }
}));
