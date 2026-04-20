import type { Exercise } from "./ExerciseCard";

interface ExerciseModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export default function ExerciseModal({
  exercise,
  onClose,
}: ExerciseModalProps) {
  if (!exercise) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-md flex flex-col gap-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-base font-bold text-black">
              {exercise.exercise_name}
            </p>
            <p className="text-xs text-[#72728A] mt-0.5">
              {exercise.equipment}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#72728A] hover:text-black transition-colors"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {exercise.video_url ? (
          <div className="w-full rounded-xl aspect-video">
            <img
              src={`/src/assets/gifs/${exercise.video_url}`}
              alt={exercise.exercise_name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full rounded-xl bg-[#F7F7FB] border border-[#E6E6EE] aspect-video flex flex-col items-center justify-center gap-2">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9CA3AF"
              strokeWidth="1.5"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m10 8 6 4-6 4V8z" />
            </svg>
            <p className="text-xs text-[#72728A]">
              No video available for this exercise
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
