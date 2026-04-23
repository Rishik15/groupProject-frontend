import { ExerciseCard } from "./ExerciseCard";
import { exerciseGoals } from "./constants";
import type { ExerciseGoal } from "./types";

type GoalSelectionProps = {
  onSelect: (goal: ExerciseGoal) => void;
};

export default function GoalSelection({ onSelect }: GoalSelectionProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-6 py-8">
        <div className="mb-8 w-full rounded-3xl border border-gray-200 bg-white px-8 py-7 shadow-sm">
          <div className="mb-3 inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600">
            Personalized Training
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            Workout Recommendations
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            Choose your goal and get a training plan that matches your schedule,
            experience level, and workout preferences.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exerciseGoals.map((goal) => (
            <ExerciseCard
              key={goal.title}
              title={goal.title}
              description={goal.description}
              icon={goal.icon}
              iconBg={goal.iconBg}
              onClick={() => onSelect(goal)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}