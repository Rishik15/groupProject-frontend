import { Button, Input, Label, Spinner } from "@heroui/react";

interface CardioLogTabProps {
  steps: string;
  setSteps: (value: string) => void;
  distanceKm: string;
  setDistanceKm: (value: string) => void;
  durationMin: string;
  setDurationMin: (value: string) => void;
  calories: string;
  setCalories: (value: string) => void;
  avgHr: string;
  setAvgHr: (value: string) => void;
  isLoggingCardio: boolean;
  onLogCardio: () => void;
}

const CARDIO_LIMITS = {
  steps: {
    min: 0,
    max: 100000,
    error: "0-100k",
  },
  distanceKm: {
    min: 0,
    max: 500,
    error: "0-500 km",
  },
  durationMin: {
    min: 1,
    max: 1440,
    error: "1-1440 min",
  },
  calories: {
    min: 0,
    max: 10000,
    error: "0-10k",
  },
  avgHr: {
    min: 30,
    max: 240,
    error: "30-240 bpm",
  },
};

const CardioLogTab = ({
  steps,
  setSteps,
  distanceKm,
  setDistanceKm,
  durationMin,
  setDurationMin,
  calories,
  setCalories,
  avgHr,
  setAvgHr,
  isLoggingCardio,
  onLogCardio,
}: CardioLogTabProps) => {
  const isValidIntegerInput = (value: string) => {
    return /^\d*$/.test(value);
  };

  const isValidDecimalInput = (value: string) => {
    return /^\d{0,4}(\.\d{0,2})?$/.test(value);
  };

  const getRangeError = (
    value: string,
    min: number,
    max: number,
    error: string,
  ) => {
    if (value.trim() === "") {
      return "";
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

  const stepsError = getRangeError(
    steps,
    CARDIO_LIMITS.steps.min,
    CARDIO_LIMITS.steps.max,
    CARDIO_LIMITS.steps.error,
  );

  const distanceError = getRangeError(
    distanceKm,
    CARDIO_LIMITS.distanceKm.min,
    CARDIO_LIMITS.distanceKm.max,
    CARDIO_LIMITS.distanceKm.error,
  );

  const durationError = getRangeError(
    durationMin,
    CARDIO_LIMITS.durationMin.min,
    CARDIO_LIMITS.durationMin.max,
    CARDIO_LIMITS.durationMin.error,
  );

  const caloriesError = getRangeError(
    calories,
    CARDIO_LIMITS.calories.min,
    CARDIO_LIMITS.calories.max,
    CARDIO_LIMITS.calories.error,
  );

  const avgHrError = getRangeError(
    avgHr,
    CARDIO_LIMITS.avgHr.min,
    CARDIO_LIMITS.avgHr.max,
    CARDIO_LIMITS.avgHr.error,
  );

  const inputClass = (error: string) =>
    [
      "w-full outline outline-2 -outline-offset-1",
      error ? "outline-red-400" : "outline-transparent",
    ].join(" ");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="steps">Steps</Label>
          <Input
            id="steps"
            type="number"
            min={CARDIO_LIMITS.steps.min}
            max={CARDIO_LIMITS.steps.max}
            value={steps}
            aria-invalid={Boolean(stepsError)}
            onChange={(event) =>
              handleIntegerChange(event.target.value, setSteps)
            }
            variant="secondary"
            className={inputClass(stepsError)}
          />
          <p className="h-2 text-[11px] leading-4 text-red-500">{stepsError}</p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="distance-km">Distance km</Label>
          <Input
            id="distance-km"
            type="number"
            min={CARDIO_LIMITS.distanceKm.min}
            max={CARDIO_LIMITS.distanceKm.max}
            step="0.01"
            value={distanceKm}
            aria-invalid={Boolean(distanceError)}
            onChange={(event) =>
              handleDecimalChange(event.target.value, setDistanceKm)
            }
            variant="secondary"
            className={inputClass(distanceError)}
          />
          <p className="h-2 text-[11px] leading-4 text-red-500">
            {distanceError}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="duration-min">Duration min</Label>
          <Input
            id="duration-min"
            type="number"
            min={CARDIO_LIMITS.durationMin.min}
            max={CARDIO_LIMITS.durationMin.max}
            value={durationMin}
            aria-invalid={Boolean(durationError)}
            onChange={(event) =>
              handleIntegerChange(event.target.value, setDurationMin)
            }
            variant="secondary"
            className={inputClass(durationError)}
          />
          <p className="h-2 text-[11px] leading-4 text-red-500">
            {durationError}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            type="number"
            min={CARDIO_LIMITS.calories.min}
            max={CARDIO_LIMITS.calories.max}
            value={calories}
            aria-invalid={Boolean(caloriesError)}
            onChange={(event) =>
              handleIntegerChange(event.target.value, setCalories)
            }
            variant="secondary"
            className={inputClass(caloriesError)}
          />
          <p className="h-2 text-[11px] leading-4 text-red-500">
            {caloriesError}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="avg-hr">Avg Heart Rate</Label>
          <Input
            id="avg-hr"
            type="number"
            min={CARDIO_LIMITS.avgHr.min}
            max={CARDIO_LIMITS.avgHr.max}
            value={avgHr}
            aria-invalid={Boolean(avgHrError)}
            onChange={(event) =>
              handleIntegerChange(event.target.value, setAvgHr)
            }
            variant="secondary"
            className={inputClass(avgHrError)}
          />
          <p className="h-2 text-[11px] leading-4 text-red-500">{avgHrError}</p>
        </div>
      </div>

      <Button
        className="h-9 bg-indigo-600 px-4 text-sm text-white hover:bg-indigo-700"
        isPending={isLoggingCardio}
        onPress={onLogCardio}
      >
        {isLoggingCardio ? <Spinner color="current" size="sm" /> : null}
        Log Cardio
      </Button>
    </div>
  );
};

export default CardioLogTab;
