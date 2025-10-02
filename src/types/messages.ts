export type Conversation = {
  id: string;
  participants: { id: string; name: string; avatar: string | null }[];
  lastMessage: string;
  lastSender: string | null;
  unread: number;
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  from: string;
  to: string;
  text: string;
  readAt: string | null;
  createdAt: string;
};

