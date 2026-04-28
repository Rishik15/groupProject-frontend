import { Button, Card, Spinner } from "@heroui/react";
import { Clock, Play } from "lucide-react";

import type { ScheduledWorkoutSession } from "@/utils/Interfaces/Sessions/sessions";
import SessionStatusChip from "./SessionStatusChip";

interface ScheduledSessionCardProps {
  session: ScheduledWorkoutSession;
  startingEventId: number | null;
  onStart: (eventId: number) => void;
  onContinue: (sessionId: number) => void;
}

const formatTime = (time: string | null) => {
  if (!time) return "No time";

  const [hours, minutes] = time.split(":");
  const date = new Date();

  date.setHours(Number(hours));
  date.setMinutes(Number(minutes));
  date.setSeconds(0);

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

const ScheduledSessionCard = ({
  session,
  startingEventId,
  onStart,
  onContinue,
}: ScheduledSessionCardProps) => {
  const isStarting = startingEventId === session.eventId;

  return (
    <Card className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
      <Card.Content className="px-4 py-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <SessionStatusChip status={session.sessionStatus} />

              <div className="flex items-center gap-1 rounded-full bg-zinc-100 px-3 text-xs font-medium text-zinc-500">
                <Clock size={12} />
                <span>
                  {formatTime(session.startTime)} -{" "}
                  {formatTime(session.endTime)}
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-semibold text-zinc-950">
                {session.workoutDayLabel ||
                  (session.workoutDayOrder
                    ? `Day ${session.workoutDayOrder}`
                    : session.title)}
              </h3>

              <p className="text-sm text-zinc-500">
                {session.workoutPlanName || "Workout Plan"}
                {session.title ? ` • ${session.title}` : ""}
              </p>
            </div>
          </div>

          {session.sessionStatus === "completed" ? (
            <Button isDisabled className="h-9 px-4 text-sm bg-blue" variant="primary">
              Done
            </Button>
          ) : session.sessionStatus === "active" && session.sessionId ? (
            <Button
              className="h-9 bg-indigo-500 px-4 text-sm text-white shadow-sm hover:bg-indigo-600"
              onPress={() => onContinue(session.sessionId as number)}
            >
              Log Workout
            </Button>
          ) : (
            <Button
              className="h-9 bg-indigo-500 px-4 text-sm text-white shadow-sm hover:bg-indigo-600"
              isPending={isStarting}
              onPress={() => onStart(session.eventId)}
            >
              {isStarting ? (
                <Spinner color="current" size="sm" />
              ) : (
                <Play size={14} />
              )}
              Start
            </Button>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default ScheduledSessionCard;
