import { useState, useRef, useEffect } from "react";
import { Avatar, toast } from "@heroui/react";
import type { NavbarInterface } from "../../utils/Interfaces/navbar";
import NavLink from "./Navlink";
import Dropdownaction from "./Dropdown";
import type { Notification } from "../../utils/Interfaces/navbar";
import NotificationDropdown from "./NotificationDropdown";
import { Link } from "react-router-dom";
import { socket } from "../../services/sockets/socket";
import { getNavItems } from "../../utils/Navbar/navitems";
import { useAuth } from "../../utils/auth/AuthContext";
import { useNavigate } from "react-router-dom";

const truncate = (text: string, max = 40) => {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "..." : text;
};

export default function Navbar({
  parent,
  name,
  email,
  notifications,
  count,
  setNotifications,
}: NavbarInterface) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const isListenerAttached = useRef(false);

  const { activeMode, roles, setActiveMode } = useAuth();

  const navItems = getNavItems(activeMode, parent);

  const navigate = useNavigate();

  const handleSwitchRole = () => {
    const newMode = activeMode === "coach" ? "client" : "coach";

    setActiveMode(newMode);

    const newParent = newMode === "coach" ? "/coach" : "/client";
    navigate(newParent);
  };

  useEffect(() => {
    if (isListenerAttached.current) return;

    const handleNotification = (notif: Notification) => {
      console.log("RECEIVED:", notif.id);

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notif.id);

        if (!exists) {
          return [notif, ...prev];
        }

        return prev.map((n) => (n.id === notif.id ? notif : n));
      });

      toast(notif.title, {
        description: truncate(notif.body, 50),
        timeout: 5000,
      });
    };

    const handleNotificationsCleared = (data: { conversationId: number }) => {
      console.log("CLEARING NOTIFS FOR:", data.conversationId);

      setNotifications((prev) =>
        prev.filter((n) => n.conversationId !== data.conversationId),
      );
    };

    socket.on("new_notification", handleNotification);
    socket.on("update_notification", handleNotification);
    socket.on("chat_notifications_cleared", handleNotificationsCleared);

    isListenerAttached.current = true;

    return () => {
      socket.off("new_notification", handleNotification);
      socket.off("update_notification", handleNotification);
      socket.off("chat_notifications_cleared", handleNotificationsCleared);
      isListenerAttached.current = false;
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b bg-white">
      <div className="h-14 max-w-7xl mx-auto px-16 flex items-center justify-between">
        <Link to={parent} className="flex items-center gap-2">
          <div className="text-[12px] text-white font-bold w-7 h-7 flex items-center justify-center bg-[#5B5EF4] rounded-lg p-0">
            βF
          </div>
          <span className="text-[15px] font-semibold">βFit</span>
        </Link>

        <div className="flex items-center gap-3 text-sm font-medium">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              label={item.label}
              icon={item.icon}
              route={item.route}
            />
          ))}
        </div>

        <div className="flex items-center gap-5">
          <NotificationDropdown
            count={count}
            notifications={notifications}
            parent={parent}
            setNotifications={setNotifications}
          />

          <div ref={dropdownRef} className="relative">
            <button className="mt-0.5" onClick={() => setOpen(!open)}>
              <Avatar className="w-8 h-8">
                <Avatar.Image src="https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg" />
                <Avatar.Fallback className="bg-[#a9aaff] font-semibold text-[#444566]">
                  {name.charAt(0)}
                </Avatar.Fallback>
              </Avatar>
            </button>

            {open && (
              <div className="absolute right-0 mt-2.25 w-48 bg-white border border-neutral-400 rounded-xl shadow-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-neutral-400">
                  <p className="text-sm font-medium text-indigo-500 truncate w-full">
                    {name}
                  </p>
                  <p className="text-xs text-gray-500 truncate w-full">
                    {email}
                  </p>
                  <span className="inline-block mt-2 text-[12px] font-medium px-1.5 py-0.5 rounded-xl bg-indigo-100 text-indigo-600">
                    {activeMode}
                  </span>
                </div>

                <div className="p-2 text-sm flex flex-col items-center">
                  {roles.includes("coach") && roles.includes("client") && (
                    <Dropdownaction
                      label={"Switch Role"}
                      type="action"
                      onClick={() => {
                        handleSwitchRole();
                        setOpen(false);
                      }}
                    />
                  )}

                  <Dropdownaction
                    label="My Profile"
                    route={`${parent}/profile`}
                    onClick={() => setOpen(false)}
                  />

                  <Dropdownaction
                    label="Settings"
                    route={`${parent}/settings`}
                    onClick={() => setOpen(false)}
                  />

                  <Dropdownaction
                    label="Sign out"
                    danger
                    type="logout"
                    onClick={() => setOpen(false)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
