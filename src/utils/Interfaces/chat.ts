export type ChatUser = {
  id: number;
  fullName: string;
  initial: string;
  lastMessage?: string;
  unreadCount?: number;
  status: "offline" | "online";
};

export type Message = {
  id: number;
  text: string;
  timestamp: string;
  type: "sent" | "received";
};


