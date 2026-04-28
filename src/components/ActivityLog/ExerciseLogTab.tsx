import type { Key } from "@heroui/react";
import { Button, Input, Label, ListBox, Select, Spinner } from "@heroui/react";

import type {
  ActiveSession,
  SessionExercise,
} from "@/utils/Interfaces/ActivityLog/activityLog";

import ActiveSessionMiniCard from "./ActiveSessionMiniCard";

interface ExerciseLogTabProps {
  activeSessionId: number | null;
  activeSession: ActiveSession | null;
  exercises: SessionExercise[];
  selectedExercise: SessionExercise | null;
  selectedExerciseId: Key | null;
  setSelectedExerciseId: (value: Key | null) => void;

  setNumber: string;
  setSetNumber: (value: string) => void;
  reps: string;
  setReps: (value: string) => void;
  weight: string;
  setWeight: (value: string) => void;
  rpe: string;
  setRpe: (value: string) => void;

  isLoggingStrength: boolean;
  isFinishing: boolean;
  onLogStrength: () => void;
  onFinishSession: () => void;
}

const ExerciseLogTab = ({
  activeSessionId,
  activeSession,
  exercises,
  selectedExercise,
  selectedExerciseId,
  setSelectedExerciseId,
  setNumber,
  setSetNumber,
  reps,
  setReps,
  weight,
  setWeight,
  rpe,
  setRpe,
  isLoggingStrength,
  isFinishing,
  onLogStrength,
  onFinishSession,
}: ExerciseLogTabProps) => {
  if (!activeSessionId) {
    return (
      <div className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-center">
        <p className="text-base font-semibold text-zinc-950">
          Start a workout session first
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Exercise logs need an active workout session.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ActiveSessionMiniCard activeSession={activeSession} />

      <Select
        fullWidth
        value={selectedExerciseId}
        onChange={(value) => setSelectedExerciseId(value)}
        placeholder="Select exercise"
        variant="secondary"
      >
        <Label>Exercise</Label>
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>

        <Select.Popover>
          <ListBox>
            {exercises.map((exercise) => (
              <ListBox.Item
                key={exercise.exerciseId}
                id={String(exercise.exerciseId)}
                textValue={exercise.exerciseName}
              >
                {exercise.exerciseName}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {selectedExercise ? (
        <p className="text-xs text-zinc-400">
          Goal: {selectedExercise.setsGoal || "-"} sets{" • "}
          {selectedExercise.repsGoal || "-"} reps{" • "}
          {selectedExercise.weightGoal || "-"} lbs
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="set-number">Set</Label>
          <Input
            id="set-number"
            type="number"
            value={setNumber}
            onChange={(event) => setSetNumber(event.target.value)}
            variant="secondary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="reps">Reps</Label>
          <Input
            id="reps"
            type="number"
            value={reps}
            onChange={(event) => setReps(event.target.value)}
            variant="secondary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            type="number"
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
            variant="secondary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="rpe">RPE</Label>
          <Input
            id="rpe"
            type="number"
            step="0.5"
            value={rpe}
            onChange={(event) => setRpe(event.target.value)}
            variant="secondary"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          className="h-9 bg-indigo-600 px-4 text-sm text-white hover:bg-indigo-700"
          isPending={isLoggingStrength}
          onPress={onLogStrength}
        >
          {isLoggingStrength ? <Spinner color="current" size="sm" /> : null}
          Log Set
        </Button>

        <Button
          className="h-9 bg-zinc-900 px-4 text-sm text-white hover:bg-zinc-800"
          isPending={isFinishing}
          onPress={onFinishSession}
        >
          {isFinishing ? <Spinner color="current" size="sm" /> : null}
          Finish Workout
        </Button>
      </div>
    </div>
  );
};

export default ExerciseLogTab;
