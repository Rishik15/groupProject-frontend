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
      <div className="inline-flex rounded-2xl border border-blue-600/30 bg-white p-1">
        <button
          type="button"
          className={`rounded-xl px-4 py-2 text-[11.25px] font-semibold transition ${activeActivity === "strength"
            ? "bg-blue-600 text-white"
            : "text-[#72728A] hover:bg-blue-50"
            }`}
          onClick={() => onActivityChange("strength")}
        >
          Strength
        </button>

        <button
          type="button"
          className={`rounded-xl px-4 py-2 text-[11.25px] font-semibold transition ${activeActivity === "cardio"
            ? "bg-blue-600 text-white"
            : "text-[#72728A] hover:bg-blue-50"
            }`}
          onClick={() => onActivityChange("cardio")}
        >
          Cardio
        </button>
      </div>
    </WorkoutLogSectionCard>
  );
}
