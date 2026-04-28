import { useEffect, useRef } from "react";
import WorkoutScheduleSection from "../../components/WorkoutSchedule/WorkoutScheduleSection";
import { markAsRead } from "../../services/notifications/mark_as_read";

interface WorkoutsProps {
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}

const shouldMarkAsWorkoutNotification = (notif: any) => {
  const route = notif?.metadata?.route;

  return (
    notif.type === "coach_session" ||
    notif.type === "workout" ||
    route === "/client/workouts" ||
    route === "client/workouts"
  );
};

export default function Workouts({
  notifications,
  setNotifications,
}: WorkoutsProps) {
  const markingReadRef = useRef(false);

  useEffect(() => {
    if (markingReadRef.current || notifications.length === 0) {
      return;
    }

    const workoutNotifications = notifications.filter(
      shouldMarkAsWorkoutNotification,
    );

    if (workoutNotifications.length === 0) {
      return;
    }

    async function markRead() {
      try {
        markingReadRef.current = true;

        await Promise.all(
          workoutNotifications.map((notif) =>
            markAsRead(Number(notif.id), "client"),
          ),
        );

        setNotifications((previous) =>
          previous.filter((notif) => !shouldMarkAsWorkoutNotification(notif)),
        );
      } catch (error) {
        console.error("Failed to mark workout notifications as read", error);
      } finally {
        markingReadRef.current = false;
      }
    }

    markRead();
  }, [notifications, setNotifications]);

  return (
    <main className="flex w-full justify-center px-6 py-9">
      <div className="w-full max-w-310">
        <WorkoutScheduleSection />
      </div>
    </main>
  );
}
