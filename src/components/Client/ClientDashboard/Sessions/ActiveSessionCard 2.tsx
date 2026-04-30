import { Button, Card, Chip } from "@heroui/react";
import { Play } from "lucide-react";

import type { ActiveWorkoutSession } from "@/utils/Interfaces/Sessions/sessions";

interface ActiveSessionCardProps {
  activeSession: ActiveWorkoutSession | null;
  onContinue: (sessionId: number) => void;
}

const ActiveSessionCard = ({
  activeSession,
  onContinue,
}: ActiveSessionCardProps) => {
  if (!activeSession) {
    return (
      <div className="flex min-h-28 flex-col items-center justify-center rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/40 p-4 text-center">
        <p className="text-base font-semibold text-zinc-950">
          No active workout
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          Start one from your scheduled sessions.
        </p>
      </div>
    );
  }

  const workoutDayTitle = activeSession.workoutDayLabel || "Workout Day";

  const workoutSubtitle = activeSession.workoutPlanName || "Workout Plan";

  return (
    <Card className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
      <Card.Content className="px-4 py-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Chip color="success" size="sm" variant="soft">
              Active
            </Chip>

            <div>
              <h3 className="text-base font-semibold text-zinc-950">
                {workoutDayTitle}
              </h3>
              <div className="flex gap-2 items-center">
                <p className="text-sm text-zinc-500">{workoutSubtitle}</p>
                <p className="text-xs text-zinc-400">
                  Started at {activeSession.startedAt}
                </p>
              </div>
            </div>
          </div>

          <Button
            className="h-9 bg-indigo-500 px-4 text-sm text-white shadow-sm hover:bg-indigo-600"
            onPress={() => onContinue(activeSession.sessionId)}
          >
            <Play size={14} />
            Log Workout
          </Button>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ActiveSessionCard;
