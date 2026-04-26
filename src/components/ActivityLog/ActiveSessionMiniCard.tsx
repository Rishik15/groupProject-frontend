import { Card, Chip } from "@heroui/react";

import type { ActiveSession } from "@/utils/Interfaces/ActivityLog/activityLog";

interface ActiveSessionMiniCardProps {
  activeSession: ActiveSession | null;
}

const ActiveSessionMiniCard = ({
  activeSession,
}: ActiveSessionMiniCardProps) => {
  if (!activeSession) return null;

  return (
    <Card className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
      <Card.Content className="px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-zinc-950">
              {activeSession.workoutDayLabel || "Workout Day"}
            </p>

            <p className="text-sm text-zinc-500">
              {activeSession.workoutPlanName || "Workout Plan"}
            </p>
          </div>

          <Chip color="success" size="sm" variant="soft">
            Active
          </Chip>
        </div>
      </Card.Content>
    </Card>
  );
};

export default ActiveSessionMiniCard;
