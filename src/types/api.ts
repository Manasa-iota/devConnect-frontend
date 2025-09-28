export type Id = string;

export interface User {
  id: Id;
  name: string;
  email: string;
  title?: string;
  avatar?: string;
  bio?: string;
}

export interface FeedItem {
  id: Id;
  name: string;
  title?: string;
  avatar?: string;
  bio?: string;
}

export interface Connection {
  id: Id;
  peer: User;
  createdAt: string;
}

export interface RequestIncoming {
  id: Id;
  from: User;
  status: "pending";
  createdAt: string;
}

export interface RequestOutgoing {
  id: Id;
  toUser: User;
  status: "pending";
  createdAt: string;
}

export interface ApiErrorShape {
  success?: false;
  message?: string;
  errors?: string | string[];
}
