export type NavbarInterface = {
  parent: string;
  name: string;
  email: string;
  mode: "client" | "coach" | "admin";
  notifications: Notification[];
  count: number;

  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export interface Notification {
  id: number;
  type: string;
  title: string;
  body: string;
  conversationId?: number | null;
  referenceId?: number | null;
  metadata?: {
    route?: string;
    event_id?: number;
    action?: string;
    [key: string]: any;
  };
  isRead?: boolean;
}