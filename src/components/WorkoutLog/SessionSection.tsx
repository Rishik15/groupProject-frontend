import { Button, TextArea } from "@heroui/react";

import WorkoutLogField from "./Field";
import WorkoutLogSectionCard from "./SectionCard";

interface WorkoutSessionSectionProps {
  workoutPlanId: string;
  notes: string;
  hasActiveSession: boolean;
  onWorkoutPlanIdChange: (value: string) => void;
  onNotesChange: (value: string) => void;
  onStartWorkout: () => Promise<void>;
}

export default function WorkoutSessionSection({
  workoutPlanId,
  notes,
  hasActiveSession,
  onWorkoutPlanIdChange,
  onNotesChange,
  onStartWorkout,
}: WorkoutSessionSectionProps) {
  return (
    <WorkoutLogSectionCard
      title="Workout Session"
      description="Start the workout first, then log either strength work or cardio."
    >
      <div className="space-y-4">
        {!hasActiveSession ? (
          <>
            <WorkoutLogField
              label="Workout Plan ID"
              placeholder="Optional"
              value={workoutPlanId}
              onValueChange={onWorkoutPlanIdChange}
            />

            <div className="space-y-2">
              <label className="text-[11.25px] font-semibold text-[#0F0F14]">
                Notes
              </label>

              <TextArea
                placeholder="Optional notes for this workout session..."
                value={notes}
                onChange={(event) => onNotesChange(event.currentTarget.value)}
                className="w-full"
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                onPress={onStartWorkout}
                className="bg-blue-600 text-[11.25px] font-semibold text-white"
              >
                Start Workout Session
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-blue-600/30 bg-blue-50 px-4 py-3 text-[11.25px] text-[#72728A]">
            A workout session is already active. You can log strength or cardio
            activity below.
          </div>
        )}
      </div>
    </WorkoutLogSectionCard>
  );
}