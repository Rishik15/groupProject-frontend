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

const STRENGTH_LIMITS = {
  setNumber: {
    min: 1,
    max: 99,
    error: "1-99",
  },
  reps: {
    min: 0,
    max: 999,
    error: "0-999",
  },
  weight: {
    min: 0,
    max: 1500,
    error: "0-1500 lb",
  },
  rpe: {
    min: 1,
    max: 10,
    error: "1-10",
  },
};

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
  const isValidIntegerInput = (value: string) => {
    return /^\d*$/.test(value);
  };

  const isValidDecimalInput = (value: string) => {
    return /^\d{0,4}(\.\d{0,2})?$/.test(value);
  };

  const isValidRpeInput = (value: string) => {
    return /^\d{0,2}(\.5)?$/.test(value);
  };

  const getRangeError = (
    value: string,
    min: number,
    max: number,
    error: string,
    allowEmpty = true,
  ) => {
    if (value.trim() === "") {
      return allowEmpty ? "" : error;
    }

    const numberValue = Number(value);

    if (!Number.isFinite(numberValue)) {
      return "Invalid";
    }

    if (numberValue < min || numberValue > max) {
      return error;
    }

    return "";
  };

  const handleIntegerChange = (
    value: string,
    setter: (nextValue: string) => void,
  ) => {
    if (value === "" || isValidIntegerInput(value)) {
      setter(value);
    }
  };

  const handleDecimalChange = (
    value: string,
    setter: (nextValue: string) => void,
  ) => {
    if (value === "" || isValidDecimalInput(value)) {
      setter(value);
    }
  };

  const handleRpeChange = (value: string) => {
    if (value === "" || isValidRpeInput(value)) {
      setRpe(value);
    }
  };

  const setNumberError = getRangeError(
    setNumber,
    STRENGTH_LIMITS.setNumber.min,
    STRENGTH_LIMITS.setNumber.max,
    STRENGTH_LIMITS.setNumber.error,
    false,
  );

  const repsError = getRangeError(
    reps,
    STRENGTH_LIMITS.reps.min,
    STRENGTH_LIMITS.reps.max,
    STRENGTH_LIMITS.reps.error,
  );

  const weightError = getRangeError(
    weight,
    STRENGTH_LIMITS.weight.min,
    STRENGTH_LIMITS.weight.max,
    STRENGTH_LIMITS.weight.error,
  );

  const rpeError = getRangeError(
    rpe,
    STRENGTH_LIMITS.rpe.min,
    STRENGTH_LIMITS.rpe.max,
    STRENGTH_LIMITS.rpe.error,
  );

const inputClass = (error: string) =>
  [
    "w-full outline outline-2 -outline-offset-1",
    error ? "outline-red-400" : "outline-transparent",
  ].join(" ");

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
        <p className="text-sm text-zinc-600">
          Goal: {selectedExercise.setsGoal || "-"} sets{" • "}
          {selectedExercise.repsGoal || "-"} reps
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="set-number">Set</Label>
          <Input
            id="set-number"
            type="number"
            min={STRENGTH_LIMITS.setNumber.min}
            max={STRENGTH_LIMITS.setNumber.max}
            value={setNumber}
            aria-invalid={Boolean(setNumberError)}
            onChange={(event) =>
              handleIntegerChange(event.target.value, setSetNumber)
            }
            variant="secondary"
            className={inputClass(setNumberError)}
          />
          <p className="h-2 text-[11px] leading-4 text-red-500">
            {setNumberError}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="reps">Reps</Label>
          <Input
            id="reps"
            type="number"
            min={STRENGTH_LIMITS.reps.min}
            max={STRENGTH_LIMITS.reps.max}
            value={reps}
            aria-invalid={Boolean(repsError)}
            onChange={(event) =>
              handleIntegerChange(event.target.value, setReps)
            }
            variant="secondary"
            className={inputClass(repsError)}
          />
          <p className="h-2 text-[11px] leading-4 text-red-500">{repsError}</p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="weight">Weight (lbs)</Label>
          <Input
            id="weight"
            type="number"
            min={STRENGTH_LIMITS.weight.min}
            max={STRENGTH_LIMITS.weight.max}
            step="0.01"
            value={weight}
            aria-invalid={Boolean(weightError)}
            onChange={(event) =>
              handleDecimalChange(event.target.value, setWeight)
            }
            variant="secondary"
            className={inputClass(weightError)}
          />
          <p className="h-2 text-[11px] leading-4 text-red-500">
            {weightError}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="rpe">Rate of Perceived Exertion (1-10)</Label>
          <Input
            id="rpe"
            type="number"
            min={STRENGTH_LIMITS.rpe.min}
            max={STRENGTH_LIMITS.rpe.max}
            step="0.5"
            value={rpe}
            aria-invalid={Boolean(rpeError)}
            onChange={(event) => handleRpeChange(event.target.value)}
            variant="secondary"
            className={inputClass(rpeError)}
          />
          <p className="h-2 text-[11px] leading-4 text-red-500">{rpeError}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
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
