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

function hasAtLeastOneCardioMetric(values: CardioLogFormValues) {
  return [
    values.steps,
    values.distance_km,
    values.duration_min,
    values.calories,
    values.avg_hr,
  ].some((value) => value.trim() !== "");
}

export default function CardioLogSection({
  values,
  hasActiveSession,
  onFieldChange,
  onLogCardio,
}: CardioLogSectionProps) {
  const hasCardioMetric = hasAtLeastOneCardioMetric(values);

  return (
    <WorkoutLogSectionCard
      title="Cardio Log"
      description="Performed At is optional, but you must enter at least one cardio metric before logging."
    >
      <div className="space-y-4">
        {!hasActiveSession ? (
          <div
            className="rounded-xl px-4 py-3 text-[11.25px] text-[#72728A]"
            style={{
              border: "1px solid #5E5EF44D",
              backgroundColor: "#5E5EF414",
            }}
          >
            Start a workout session first so the modal can attach a session_id
            to the cardio payload.
          </div>
        ) : null}

        {hasActiveSession && !hasCardioMetric ? (
          <div
            className="rounded-xl px-4 py-3 text-[11.25px] text-[#72728A]"
            style={{
              border: "1px solid #5E5EF44D",
              backgroundColor: "#5E5EF414",
            }}
          >
            Enter at least one of these before logging: steps, distance, duration,
            calories, or average heart rate.
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 xl:grid-cols-2">
          <WorkoutLogField
            label="Performed At"
            placeholder=""
            value={values.performed_at}
            onValueChange={(value) => onFieldChange("performed_at", value)}
            type="datetime-local"
          />

          <WorkoutLogField
            label="Steps"
            placeholder="Optional"
            value={values.steps}
            onValueChange={(value) => onFieldChange("steps", value)}
            type="number"
            min={0}
          />

          <WorkoutLogField
            label="Distance (km)"
            placeholder="Optional"
            value={values.distance_km}
            onValueChange={(value) => onFieldChange("distance_km", value)}
            type="number"
            min={0}
            step="0.01"
          />

          <WorkoutLogField
            label="Duration (minutes)"
            placeholder="Optional"
            value={values.duration_min}
            onValueChange={(value) => onFieldChange("duration_min", value)}
            type="number"
            min={0}
          />

          <WorkoutLogField
            label="Calories"
            placeholder="Optional"
            value={values.calories}
            onValueChange={(value) => onFieldChange("calories", value)}
            type="number"
            min={0}
          />

          <WorkoutLogField
            label="Average Heart Rate"
            placeholder="Optional"
            value={values.avg_hr}
            onValueChange={(value) => onFieldChange("avg_hr", value)}
            type="number"
            min={0}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            onPress={onLogCardio}
            isDisabled={!hasActiveSession || !hasCardioMetric}
            className="text-[11.25px] font-semibold text-white"
            style={{ backgroundColor: "#5E5EF4" }}
          >
            Log Cardio Activity
          </Button>
        </div>
      </div>
    </WorkoutLogSectionCard>
  );
}
