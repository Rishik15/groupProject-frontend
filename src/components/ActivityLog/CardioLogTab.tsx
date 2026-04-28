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
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <Label htmlFor="steps">Steps</Label>
          <Input
            id="steps"
            type="number"
            value={steps}
            onChange={(event) => setSteps(event.target.value)}
            variant="secondary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="distance-km">Distance km</Label>
          <Input
            id="distance-km"
            type="number"
            value={distanceKm}
            onChange={(event) => setDistanceKm(event.target.value)}
            variant="secondary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="duration-min">Duration min</Label>
          <Input
            id="duration-min"
            type="number"
            value={durationMin}
            onChange={(event) => setDurationMin(event.target.value)}
            variant="secondary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            type="number"
            value={calories}
            onChange={(event) => setCalories(event.target.value)}
            variant="secondary"
          />
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="avg-hr">Avg Heart Rate</Label>
          <Input
            id="avg-hr"
            type="number"
            value={avgHr}
            onChange={(event) => setAvgHr(event.target.value)}
            variant="secondary"
          />
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
