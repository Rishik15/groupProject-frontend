import { Button } from "@heroui/react";
import {
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Plus,
  Sparkles,
} from "lucide-react";

import type { WorkoutCalendarEvent } from "../../utils/Interfaces/WorkoutLog/workoutLog";
import { formatWeekRange } from "./calendarUtils";
import { useNavigate } from "react-router-dom";

interface ScheduleHeaderProps {
  weekStart: Date;
  weekEnd: Date;
  activeEvent: WorkoutCalendarEvent | null;
  onAddSession: () => void;
  onLogWorkout: () => void;
  onPreviousWeek: () => void;
  onNextWeek: () => void;
  onJumpToNow: () => void;
  onCreateWorkout: () => void;
}

export default function ScheduleHeader({
  weekStart,
  weekEnd,
  activeEvent,
  onAddSession,
  onLogWorkout,
  onPreviousWeek,
  onNextWeek,
  onJumpToNow,
  onCreateWorkout,
}: ScheduleHeaderProps) {
  const navigate = useNavigate();

  const handleRecommendations = () => {
    navigate("/client/recommendation");
  };

  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[18.75px] font-semibold text-[#0F0F14]">
            Weekly Schedule
          </h2>
          <p className="mt-1 text-[11.25px] text-[#72728A]">
            Drag local sessions by day and hour, edit blocks in place, and log a
            workout directly from any session card.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant={activeEvent ? "ghost" : "primary"}
            onPress={onAddSession}
            className="text-[11.25px] font-semibold"
            style={
              activeEvent
                ? { border: "1px solid #5E5EF466", color: "#0F0F14" }
                : { backgroundColor: "#5E5EF4", color: "#FFFFFF" }
            }
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Add Session</span>
            </span>
          </Button>
          <Button
            variant="ghost"
            onPress={onCreateWorkout}
            className="text-[11.25px] font-semibold text-[#0F0F14]"
            style={{ border: "1px solid #5E5EF466" }}
          >
            <span className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Workout</span>
            </span>
          </Button>

          <Button
            variant="ghost"
            onPress={handleRecommendations}
            className="text-[11.25px] font-semibold text-[#0F0F14]"
            style={{ border: "1px solid #5E5EF466" }}
          >
            <span className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Get Recommnedations</span>
            </span>
          </Button>

          {activeEvent ? (
            <Button
              variant="primary"
              onPress={onLogWorkout}
              className="text-[11.25px] font-semibold text-white"
              style={{ backgroundColor: "#5E5EF4" }}
            >
              <span className="inline-flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                <span>Log Active Session</span>
              </span>
            </Button>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onPreviousWeek}
          className="rounded-2xl p-3 transition"
          style={{ border: "1px solid #5E5EF44D" }}
        >
          <ChevronLeft className="h-5 w-5 text-[#72728A]" />
        </button>

        <div className="text-[18.75px] font-semibold text-[#0F0F14]">
          {formatWeekRange(weekStart, weekEnd)}
        </div>

        <button
          type="button"
          onClick={onNextWeek}
          className="rounded-2xl p-3 transition"
          style={{ border: "1px solid #5E5EF44D" }}
        >
          <ChevronRight className="h-5 w-5 text-[#72728A]" />
        </button>

        <Button
          variant="ghost"
          onPress={onJumpToNow}
          className="ml-1 text-[11.25px] font-semibold text-[#0F0F14]"
          style={{ border: "1px solid #5E5EF466" }}
        >
          Jump to now
        </Button>
      </div>
    </>
  );
}
