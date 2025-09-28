  import { create } from "zustand";
import { api } from "../lib/apiClient";
import type {
  FeedItem,
  RequestIncoming,
  RequestOutgoing,
  Connection,
} from "../types/api";

type DCState = {
  feed: FeedItem[];
  incoming: RequestIncoming[];
  outgoing: RequestOutgoing[];
  connections: Connection[];
  loading: boolean;
  error: string | null;
};

type DCActions = {
  loadAll: () => Promise<void>;
  swipeLeft: (userId: string) => void;
  swipeRight: (userId: string) => Promise<void>;
  acceptRequest: (requestId: string) => Promise<void>;
  rejectRequest: (requestId: string) => Promise<void>;
  cancelRequest: (requestId: string) => Promise<void>;
  removeConnection: (connectionId: string) => Promise<void>;
};

export const useDevConnectStore = create<DCState & DCActions>((set, get) => ({
  feed: [],
  incoming: [],
  outgoing: [],
  connections: [],
  loading: false,
  error: null,

  loadAll: async () => {
    set({ loading: true, error: null });
    try {
      const feed = await api<{ success: true; items: FeedItem[]; page: number; limit: number }>("/user/feed");
      const reqs = await api<{ success: true; incoming: RequestIncoming[]; outgoing: RequestOutgoing[] }>("/user/requests");
      const cons = await api<{ success: true; items: Connection[]; nextCursor: string | null }>("/user/connections");
      set({
        feed: feed.items ?? [],
        incoming: reqs.incoming ?? [],
        outgoing: reqs.outgoing ?? [],
        connections: cons.items ?? [],
      });
    } catch (e) {
      set({ error: (e as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  swipeLeft: (userId) => {
    const next = get().feed.filter((u) => u.id !== userId);
    set({ feed: next });
  },

  swipeRight: async (userId) => {
    const prevFeed = get().feed;
    const tempId = `temp-${userId}`;
    set({
      feed: prevFeed.filter((u) => u.id !== userId),
      outgoing: [
        {
          id: tempId,
          toUser: { id: userId, name: "", email: "" },
          status: "pending",
          createdAt: new Date().toISOString(),
        },
        ...get().outgoing,
      ],
    });
    try {
      const res = await api<{ success: true; request: RequestOutgoing }>(`/requests/send/interested/${userId}`, {
        method: "POST",
      });
      set({
        outgoing: get().outgoing.map((r) => (r.id === tempId ? res.request : r)),
      });
    } catch (e) {
      set({
        feed: prevFeed,
        outgoing: get().outgoing.filter((r) => r.id !== tempId),
        error: (e as Error).message,
      });
    }
  },

  acceptRequest: async (requestId) => {
    const prev = get().incoming;
    set({ incoming: prev.filter((r) => r.id !== requestId) });
    try {
      const res = await api<{ success: true; connection: Connection }>(`/requests/review/accepted/${requestId}`, {
        method: "POST",
      });
      set({ connections: [res.connection, ...get().connections] });
    } catch (e) {
      set({ incoming: prev, error: (e as Error).message });
    }
  },

  rejectRequest: async (requestId) => {
    const prev = get().incoming;
    set({ incoming: prev.filter((r) => r.id !== requestId) });
    try {
      await api<{ success: true }>(`/requests/review/rejected/${requestId}`, { method: "POST" });
    } catch (e) {
      set({ incoming: prev, error: (e as Error).message });
    }
  },

  cancelRequest: async (requestId) => {
    const prev = get().outgoing;
    set({ outgoing: prev.filter((r) => r.id !== requestId) });
    try {
      await api<{ success: true }>(`/requests/${requestId}/cancel`, { method: "POST" });
    } catch (e) {
      set({ outgoing: prev, error: (e as Error).message });
    }
  },

  removeConnection: async (connectionId) => {
    const prev = get().connections;
    set({ connections: prev.filter((c) => c.id !== connectionId) });
    try {
      await api<{ success: true }>(`/connections/${connectionId}/remove`, { method: "POST" });
    } catch (e) {
      set({ connections: prev, error: (e as Error).message });
    }
  },
}));
