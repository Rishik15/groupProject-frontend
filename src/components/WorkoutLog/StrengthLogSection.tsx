import { Button } from "@heroui/react";

import type { StrengthLogFormValues } from "../../utils/Interfaces/WorkoutLog/workoutLog";
import WorkoutLogField from "./Field";
import WorkoutLogSectionCard from "./SectionCard";

interface StrengthLogSectionProps {
  values: StrengthLogFormValues;
  hasActiveSession: boolean;
  onFieldChange: (
    field: keyof StrengthLogFormValues,
    value: string,
  ) => void;
  onLogStrength: () => Promise<void>;
}

export default function StrengthLogSection({
  values,
  hasActiveSession,
  onFieldChange,
  onLogStrength,
}: StrengthLogSectionProps) {
  return (
    <WorkoutLogSectionCard
      title="Strength Log"
      description="The backend needs exercise_id and set_number. Reps, weight, RPE, and finished time are optional."
    >
      <div className="space-y-4">
        {!hasActiveSession ? (
          <div className="rounded-xl border border-blue-600/30 bg-blue-50 px-4 py-3 text-[11.25px] text-[#72728A]">
            Start a workout session first so the modal can attach a session_id
            to the strength payload.
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-x-4 gap-y-4 xl:grid-cols-2">
          <WorkoutLogField
            label="Exercise ID"
            placeholder="e.g. 12"
            value={values.exercise_id}
            onValueChange={(value) => onFieldChange("exercise_id", value)}
          />

          <WorkoutLogField
            label="Set Number"
            placeholder="e.g. 1"
            value={values.set_number}
            onValueChange={(value) => onFieldChange("set_number", value)}
          />

          <WorkoutLogField
            label="Reps"
            placeholder="Optional"
            value={values.reps}
            onValueChange={(value) => onFieldChange("reps", value)}
          />

          <WorkoutLogField
            label="Weight"
            placeholder="Optional"
            value={values.weight}
            onValueChange={(value) => onFieldChange("weight", value)}
          />

          <WorkoutLogField
            label="RPE"
            placeholder="Optional"
            value={values.rpe}
            onValueChange={(value) => onFieldChange("rpe", value)}
          />

          <WorkoutLogField
            label="Finished At"
            placeholder="Optional ISO time"
            value={values.datetimeFinished}
            onValueChange={(value) =>
              onFieldChange("datetimeFinished", value)
            }
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="primary"
            onPress={onLogStrength}
            isDisabled={!hasActiveSession}
            className="bg-blue-600 text-[11.25px] font-semibold text-white"
          >
            Log Strength Set
          </Button>
        </div>
      </div>
    </WorkoutLogSectionCard>
  );
}
