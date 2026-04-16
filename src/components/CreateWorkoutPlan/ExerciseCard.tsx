// Card for a single exercise that can be added to the workout plan

export interface Exercise {
  id: number;
  name: string;
  category: string;
  description: string;
  muscle_group: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onAdd: (exercise: Exercise) => void;
  isAdded: boolean;
}

export default function ExerciseCard({ exercise, onAdd, isAdded }: ExerciseCardProps) {
  return (
    <div className="bg-white border border-[#E6E6EE] rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-black">{exercise.name}</p>
          <p className="text-xs text-[#72728A] mt-0.5">{exercise.muscle_group}</p>
        </div>
        <span className="text-xs font-medium text-[#5B5EF4] bg-[#5B5EF4]/10 px-2 py-0.5 rounded-full shrink-0">
          {exercise.category}
        </span>
      </div>

      <p className="text-xs text-[#72728A] leading-relaxed">{exercise.description}</p>

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