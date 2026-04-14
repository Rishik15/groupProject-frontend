import type React from "react";
import { Dumbbell, Scale, Heart, Zap } from "lucide-react";
import { ExerciseCard } from "../../components/client/RecommendedExercises/ExerciseCard";

export type Exercise = {
  title: string;
  description: string;
  icon: React.ElementType;
  iconBg: string;
  category: string;
};

type RecExerciseProps = {
  onExerciseClick: (exercise: Exercise) => void;
};


function RecExercise({ onExerciseClick }: RecExerciseProps) {
  const exercises: Exercise[] = [
    {
      title: "Muscle Gain",
      description: "Build muscle mass and increase size",
      icon: Dumbbell,
      iconBg: "bg-blue-500 text-blue-100",
      category: "Muscle Gain",
    },
    {
      title: "Weight Loss",
      description: "Burn fat and lose weight",
      icon: Scale,
      iconBg: "bg-yellow-500 text-yellow-100",
      category: "Weight Loss",
    },
    {
      title: "Endurance",
      description: "Build cardiovascular and muscular endurance",
      icon: Heart,
      iconBg: "bg-red-500 text-red-100",
      category: "Endurance",
    },
    {
      title: "Strength",
      description: "Increase muscle size and power",
      icon: Zap,
      iconBg: "bg-purple-500 text-purple-100",
      category: "Strength",
    },
  ];
  const handleCardClick = (exercise: Exercise) => {
    onExerciseClick(exercise);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="w-full flex flex-col items-center justify-start px-6 py-6">
        <div className="w-full flex flex-col items-start text-left mb-6">
          <h1 className="text-2xl font-semibold">Workout Recommendations</h1>
          <p className="text-sm text-gray-400">
            Get personalized workout plans based on your fitness goals
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.title}
              title={exercise.title}
              description={exercise.description}
              icon={exercise.icon}
              iconBg={exercise.iconBg}
              onClick={() => handleCardClick(exercise)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecExercise;