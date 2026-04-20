import { Dropdown, Badge } from "@heroui/react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { markAsRead } from "../../services/notifications/mark_as_read";
import type { Notification } from "../../utils/Interfaces/navbar";
type Props = {
  count: number;
  notifications: Notification[];
  parent: string;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
};

export default function NotificationDropdown({
  count,
  notifications,
  parent,
  setNotifications,
}: Props) {
  const navigate = useNavigate();

  const getRoute = (notif: Notification) => {
    switch (notif.type) {
      case "chat":
        return `${parent}/chat`;
      case "workout":
        return `${parent}/workouts`;
      case "nutrition":
        return `${parent}/nutrition`;
      case "contract":
        return `${parent}/contracts`;
      default:
        return parent;
    }
  };

  const handleClick = async (notif: Notification) => {
    try {
      await markAsRead(notif.id);

      setNotifications((prev) => prev.filter((n) => n.id !== notif.id));

      navigate(getRoute(notif));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <div className="hover:bg-gray-200 rounded-3xl w-10 h-10 p-2 mb-0.5 cursor-pointer">
          <Badge.Anchor className="mt-px">
            <Bell className="w-5.5 h-5.5" />

            {count > 0 && (
              <Badge color="danger" size="sm" className="-translate-y-0.5">
                {count}
              </Badge>
            )}
          </Badge.Anchor>
        </div>
      </Dropdown.Trigger>

      <Dropdown.Popover
        className="w-65 p-0 rounded-xl border shadow-lg"
        placement="bottom end"
      >
        <div className="px-3 py-2 border-b font-medium text-[14px]">
          Notifications
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-[12px] text-gray-500">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleClick(notif)}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
              >
                <p className="text-sm font-medium">{notif.title}</p>
                <p className="text-xs text-gray-500">{notif.body}</p>
              </div>
            ))
          )}
        </div>
      </Dropdown.Popover>
    </Dropdown>
  );
}
