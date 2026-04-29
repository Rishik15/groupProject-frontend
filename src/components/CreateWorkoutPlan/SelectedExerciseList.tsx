import type { Exercise } from "./ExerciseCard";

export interface SelectedExercise {
  exercise: Exercise;
  sets: number;
  reps: number;
}

interface SelectedExerciseListProps {
  selected: SelectedExercise[];
  activeDayLabel: string;
  onRemove: (id: number) => void;
  onUpdateSets: (id: number, sets: number) => void;
  onUpdateReps: (id: number, reps: number) => void;
}

export default function SelectedExerciseList({
  selected,
  activeDayLabel,
  onRemove,
  onUpdateSets,
  onUpdateReps,
}: SelectedExerciseListProps) {
  if (selected.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-[#5B5EF4]/10 flex items-center justify-center mb-3">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#5B5EF4"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>

        <p className="text-sm font-medium text-black">
          No exercises added to {activeDayLabel}
        </p>

        <p className="text-xs text-[#72728A] mt-1">
          Browse exercises and add them to this day.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {selected.map(({ exercise, sets, reps }) => (
        <div
          key={exercise.exercise_id}
          className="bg-white border border-[#E6E6EE] rounded-2xl p-4 flex flex-col gap-3"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-black">
                {exercise.exercise_name}
              </p>
              <p className="text-xs text-[#72728A]">{exercise.equipment}</p>
            </div>

            <button
              onClick={() => onRemove(exercise.exercise_id)}
              className="text-[#72728A] hover:text-red-500 transition-colors"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#72728A]">Sets</label>
              <input
                type="number"
                min={1}
                max={10}
                value={sets}
                onChange={(e) =>
                  onUpdateSets(exercise.exercise_id, Number(e.target.value))
                }
                className="w-14 text-center text-sm font-medium border border-[#E6E6EE] rounded-lg py-1 focus:outline-none focus:border-[#5B5EF4]"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-[#72728A]">Reps</label>
              <input
                type="number"
                min={1}
                max={100}
                value={reps}
                onChange={(e) =>
                  onUpdateReps(exercise.exercise_id, Number(e.target.value))
                }
                className="w-14 text-center text-sm font-medium border border-[#E6E6EE] rounded-lg py-1 focus:outline-none focus:border-[#5B5EF4]"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
