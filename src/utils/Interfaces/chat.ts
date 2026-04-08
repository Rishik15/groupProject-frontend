export type ChatUser = {
  id: number;
  fullName: string;
  initial: string;
  lastMessage?: string;
  unreadCount?: number;
};
