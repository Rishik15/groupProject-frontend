import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { SelectedExercise } from "./SelectedExerciseList";

export interface WorkoutDay {
  label: string;
  exercises: SelectedExercise[];
}

interface DayTabsProps {
  days: WorkoutDay[];
  activeDay: number;
  onSelectDay: (index: number) => void;
  onRenameDay: (index: number, label: string) => void;
}

export default function DayTabs({
  days,
  activeDay,
  onSelectDay,
  onRenameDay,
}: DayTabsProps) {
  const currentDay = days[activeDay];

  if (!currentDay) return null;

  const isFirstDay = activeDay === 0;
  const isLastDay = activeDay === days.length - 1;

  function goPrevious() {
    if (isFirstDay) return;
    onSelectDay(activeDay - 1);
  }

  function goNext() {
    if (isLastDay) return;
    onSelectDay(activeDay + 1);
  }

  return (
    <div className="border border-[#E6E6EE] rounded-2xl p-4 bg-[#F7F7FB]">
      <div className="flex items-center justify-between gap-3">
        <Button
          isIconOnly
          size="sm"
          variant="secondary"
          isDisabled={isFirstDay}
          onPress={goPrevious}
          className="bg-white text-[#5B5EF4] border border-[#E6E6EE]"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <div className="flex-1 text-center min-w-0">
          <p className="text-xs text-[#72728A]">
            Day {activeDay + 1} of {days.length}
          </p>

          <input
            value={currentDay.label}
            onChange={(e) => onRenameDay(activeDay, e.target.value)}
            className="w-full bg-transparent text-center outline-none text-sm font-semibold text-black mt-1"
          />

          <p className="text-xs text-[#72728A] mt-1">
            {currentDay.exercises.length} exercise
            {currentDay.exercises.length !== 1 ? "s" : ""}
          </p>
        </div>

        <Button
          isIconOnly
          size="sm"
          variant="secondary"
          isDisabled={isLastDay}
          onPress={goNext}
          className="bg-white text-[#5B5EF4] border border-[#E6E6EE]"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
