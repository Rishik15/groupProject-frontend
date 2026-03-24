import { Button } from "@heroui/react";

import type { CardioLogFormValues } from "../../utils/Interfaces/WorkoutLog/workoutLog";
import WorkoutLogField from "./Field";
import WorkoutLogSectionCard from "./SectionCard";

interface CardioLogSectionProps {
  values: CardioLogFormValues;
  hasActiveSession: boolean;
  onFieldChange: (field: keyof CardioLogFormValues, value: string) => void;
  onLogCardio: () => Promise<void>;
}

export default function CardioLogSection({
  values,
  hasActiveSession,
  onFieldChange,
  onLogCardio,
}: CardioLogSectionProps) {
  return (
    <WorkoutLogSectionCard
      title="Cardio Log"
      description="The backend accepts optional session_id and performed_at, but at least one cardio metric must be provided."
    >
      <div className="space-y-4">
        {!hasActiveSession ? (
          <div className="rounded-xl border border-blue-600/30 bg-blue-50 px-4 py-3 text-[11.25px] text-[#72728A]">
            Start a workout session first so the modal can attach a session_id
            to the cardio payload.
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 xl:grid-cols-2">
          <WorkoutLogField
            label="Performed At"
            placeholder="Optional ISO time"
            value={values.performed_at}
            onValueChange={(value) => onFieldChange("performed_at", value)}
          />

          <WorkoutLogField
            label="Steps"
            placeholder="Optional"
            value={values.steps}
            onValueChange={(value) => onFieldChange("steps", value)}
          />

          <WorkoutLogField
            label="Distance (km)"
            placeholder="Optional"
            value={values.distance_km}
            onValueChange={(value) => onFieldChange("distance_km", value)}
          />

          <WorkoutLogField
            label="Duration (minutes)"
            placeholder="Optional"
            value={values.duration_min}
            onValueChange={(value) => onFieldChange("duration_min", value)}
          />

          <WorkoutLogField
            label="Calories"
            placeholder="Optional"
            value={values.calories}
            onValueChange={(value) => onFieldChange("calories", value)}
          />

          <WorkoutLogField
            label="Average Heart Rate"
            placeholder="Optional"
            value={values.avg_hr}
            onValueChange={(value) => onFieldChange("avg_hr", value)}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            onPress={onLogCardio}
            isDisabled={!hasActiveSession}
            className="bg-blue-600 text-[11.25px] font-semibold text-white"
          >
            Log Cardio Activity
          </Button>
        </div>
      </div>
    </WorkoutLogSectionCard>
  );
}
