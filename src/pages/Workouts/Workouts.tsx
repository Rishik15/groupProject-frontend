import WorkoutScheduleSection from "../../components/WorkoutSchedule/WorkoutScheduleSection";
import WorkoutHeader from "./WorkoutHeader";

export default function Workouts() {
  return (
    <main className="flex flex-col">
      <WorkoutHeader />
      <div className="px-38 pt-8 pb-8">
        <WorkoutScheduleSection />
      </div>
    </main>
  );
}

