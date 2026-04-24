import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../utils/auth/AuthContext";
import CoachDashBoard from "./DashBoard";
import Settings from "../Settings/Settings";
import Chat from "../Chat/Chat";
import { useState, useEffect } from "react";
import { toast } from "@heroui/react";
import { getNotifications } from "../../services/notifications/getNotifications";
import { useRef } from "react";
import CreateWorkoutPlan from "../CreateWorkoutPlan/CreateWorkoutPlan";
import ManageClients from "./ManageClient";

const CoachLayout = () => {
  const { user, activeMode } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  const count = notifications.length;

  const fetchedModeRef = useRef<string | null>(null);

  useEffect(() => {
    console.log("EFFECT RUNNING:", activeMode);

    if (!activeMode) return;
    if (fetchedModeRef.current === activeMode) {
      console.log("SKIPPED (same mode):", activeMode);
      return;
    }

    fetchedModeRef.current = activeMode;

    console.log("FETCHING NOTIFS FOR:", activeMode);

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(activeMode);

        console.log("NOTIFICATIONS RECEIVED:", data.notifications);

        setNotifications(data.notifications || []);

        data.notifications.forEach((notif: any) => {
          console.log("TOAST:", notif.title);
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
  }, [activeMode]);

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
          <Route
            path="settings"
            element={<Settings role="coach" tab="settings" />}
          />
          <Route
            path="profile"
            element={<Settings role="coach" tab="info" />}
          />
          <Route path="chat" element={<Chat />} />
          <Route path="clients" element={<ManageClients />} />
          <Route path="exercises" element={<CreateWorkoutPlan />} />
        </Routes>
      </div>
    </section>
  );
};

export default CoachLayout;
