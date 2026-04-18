export type NavbarInterface = {
  parent: string;
  name: string;
  email: string;

  notifications: Notification[];
  count: number;

  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export type Notification = {
  id: number;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  conversationId?: number;
};
