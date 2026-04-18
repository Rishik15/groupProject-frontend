import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../utils/auth/AuthContext";
import CoachDashBoard from "./DashBoard";
import Chat from "../Chat/Chat";
import { useState, useEffect } from "react";
import { toast } from "@heroui/react";
import { getNotifications } from "../../services/notifications/getNotifications";
import { useRef } from "react";

const CoachLayout = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const hasFetched = useRef(false);

  const count = notifications.length;
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();

        setNotifications(data.notifications || []);

        data.notifications.forEach((notif: any) => {
          toast(notif.title, {
            description: notif.body,
            timeout: 5000,
          });
        });
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, []);
  return (
    <section className="min-h-screen">
      <Navbar
        parent="/coach"
        name={user ? `${user.first_name} ${user.last_name}` : ""}
        email={user?.email || ""}
        notifications={notifications}
        count={count}
        setNotifications={setNotifications}
      />

      <div className="pt-14">
        <Routes>
          <Route index element={<CoachDashBoard />} />
          <Route path="chat" element={<Chat />} />
        </Routes>
      </div>
    </section>
  );
};

export default CoachLayout;
