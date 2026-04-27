import { Routes, Route } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Nutrition from "./Nutrition";
import BrowseCoaches from "./BrowseCoaches";
import Workouts from "../Workouts/Workouts";
import ClientDashBoard from "./Dashboard";
import Settings from "../Settings/Settings";
import Chat from "../Chat/Chat";
import { useEffect, useRef, useState } from "react";
import { getNotifications } from "../../services/notifications/getNotifications";
import { toast } from "@heroui/react";
import CreateWorkoutPlan from "../CreateWorkoutPlan/CreateWorkoutPlan";
import { useAuth } from "../../utils/auth/AuthContext";
import Recommendation from "./Recommendation";
import ExerciseLibrary from "../ExerciseLibrary/ExerciseLibrary";
import Billing from "../Billing/Billing";

const ClientLayout = () => {
  const { user } = useAuth();

  const mode = "client" as const;

  const [notifications, setNotifications] = useState<any[]>([]);
  const count = notifications.length;

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

  return (
    <section className="min-h-screen">
      <Navbar
        parent="/client"
        mode={mode}
        name={user ? `${user.first_name} ${user.last_name}` : ""}
        email={user?.email || ""}
        notifications={notifications}
        count={count}
        setNotifications={setNotifications}
      />

      <div className="pt-14">
        <Routes>
          <Route index element={<ClientDashBoard />} />
          <Route path="chat" element={<Chat />} />
          <Route path="nutrition" element={<Nutrition />} />
          <Route path="coaches" element={<BrowseCoaches />} />
          <Route path="workouts" element={<Workouts />} />
          <Route path="createWorkout" element={<CreateWorkoutPlan />} />
          <Route path="exercises" element={<ExerciseLibrary />} />
          <Route
            path="settings"
            element={<Settings role="client" tab="settings" />}
          />
          <Route
            path="profile"
            element={<Settings role="client" tab="info" />}
          />
          <Route path="recommendation" element={<Recommendation />} />
          <Route path="billing" element={<Billing />} />

        </Routes>
      </div>
    </section>
  );
};

export default ClientLayout;