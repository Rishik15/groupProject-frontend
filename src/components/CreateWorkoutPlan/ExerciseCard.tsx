export interface Exercise {
  exercise_id: number;
  exercise_name: string;
  equipment: string;
  video_url: string | null;
  description: string
}

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd: (exercise: Exercise) => void;
  isAdded: boolean;
  onPreview: (exercise: Exercise) => void;
}

export default function ExerciseCard({ exercise, onAdd, isAdded, onPreview }: ExerciseCardProps) {
  return (
    <div className="bg-white border border-[#E6E6EE] rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-black">{exercise.exercise_name}</p>
          <p className="text-xs text-[#72728A] mt-0.5">{exercise.equipment}</p>
        </div>
        <button
          onClick={() => onPreview(exercise)}
          className="text-xs font-medium px-3 py-1 rounded-lg border border-[#5B5EF4] text-[#5B5EF4] hover:bg-[#5B5EF4]/10 transition-colors shrink-0"
        >
          View Demo
        </button>
      </div>

      <button
        onClick={() => !isAdded && onAdd(exercise)}
        className={`w-full text-xs font-medium py-2 rounded-xl transition-colors ${
          isAdded
            ? "bg-green-50 text-green-600 border border-green-200"
            : "bg-[#5B5EF4] text-white hover:bg-[#4B4EE4]"
        }`}
      >
        {isAdded ? "✓ Added" : "+ Add to Plan"}
      </button>
    </div>
  );
}