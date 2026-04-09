import type { WorkoutActivityType } from "../../utils/Interfaces/WorkoutLog/workoutLog";

import WorkoutLogSectionCard from "./SectionCard";

interface ActivityTypeSectionProps {
  activeActivity: WorkoutActivityType;
  onActivityChange: (value: WorkoutActivityType) => void;
}

export default function ActivityTypeSection({
  activeActivity,
  onActivityChange,
}: ActivityTypeSectionProps) {
  return (
    <WorkoutLogSectionCard
      title="Activity Type"
      description="Switch between the strength logger and the cardio logger."
    >
      <div
        className="inline-flex rounded-2xl bg-white p-1"
        style={{ border: "1px solid rgba(94, 94, 244, 0.3)" }}
      >
        <button
          type="button"
          className="rounded-xl px-4 py-2 text-[11.25px] font-semibold transition"
          style={{
            backgroundColor:
              activeActivity === "strength" ? "#5E5EF4" : "transparent",
            color: activeActivity === "strength" ? "#FFFFFF" : "#72728A",
          }}
          onClick={() => onActivityChange("strength")}
        >
          Strength
        </button>

        <button
          type="button"
          className="rounded-xl px-4 py-2 text-[11.25px] font-semibold transition"
          style={{
            backgroundColor:
              activeActivity === "cardio" ? "#5E5EF4" : "transparent",
            color: activeActivity === "cardio" ? "#FFFFFF" : "#72728A",
          }}
          onClick={() => onActivityChange("cardio")}
        >
          Cardio
        </button>
      </div>
    </WorkoutLogSectionCard>
  );
}
