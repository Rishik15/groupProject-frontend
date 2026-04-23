import WorkoutScheduleSection from "../../components/WorkoutSchedule/WorkoutScheduleSection";
import WorkoutHeader from "./WorkoutHeader";

export default function Workouts() {
  return (
    <main className="min-h-screen flex flex-col">
      <WorkoutHeader />
      <div className="px-38 pt-8 pb-12">
        <WorkoutScheduleSection />
      </div>
    </main>
  );
}

