import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../utils/auth/AuthContext";
import CoachDashBoard from "./DashBoard";
import Settings from "../Settings/Settings";
import Chat from "../Chat/Chat";
import { useEffect, useRef, useState } from "react";
import { toast } from "@heroui/react";
import { getNotifications } from "../../services/notifications/getNotifications";
import CreateWorkoutPlan from "../CreateWorkoutPlan/CreateWorkoutPlan";
import ManageClients from "./ManageClient";
import CoachModeIntroModal from "../../components/Coach/CoachModeIntroModal";
import CoachSession from "./CoachSession";

const CoachLayout = () => {
  const { user } = useAuth();

  const mode = "coach" as const;

  const [notifications, setNotifications] = useState<any[]>([]);
  const count = notifications.length;
  const [showCoachModeIntro, setShowCoachModeIntro] = useState(false);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;

    const fetchNotifications = async () => {
      try {
        const data = await getNotifications(mode);

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

  useEffect(() => {
    const shouldShow = sessionStorage.getItem("showCoachModeIntro") === "true";

    if (shouldShow) {
      setShowCoachModeIntro(true);
    }
  }, []);

  return (
    <section className="min-h-screen">
      <Navbar
        parent="/coach"
        mode={mode}
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
          <Route path="session" element={<CoachSession />} />
          <Route path="exercises" element={<CreateWorkoutPlan />} />
        </Routes>
      </div>

      <CoachModeIntroModal
        isOpen={showCoachModeIntro}
        setIsOpen={setShowCoachModeIntro}
      />
    </section>
  );
};

export default CoachLayout;
