export interface NavbarInterface {
  parent: string;
  name: string;
  email: string;
  notification: number;
}

export type Notification = {
  id: number;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
};
