import { useState } from "react";
import { Button } from "@heroui/react";
import { Award } from "lucide-react";
import RecExercise, { type Exercise } from "./RecExercise";
import { RecommendationOptionCard } from "../../components/client/RecommendedExercises/RecommendationOptionCard";

function MuscleGain() {
  const [step, setStep] = useState<"form" | "results" | "select">("select");
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setStep("form");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center">
      {step === "select" && (
        <RecExercise onExerciseClick={handleExerciseClick} />
      )}

      {step === "form" && selectedExercise && (
        <RecommendationOptionCard
          description={selectedExercise.description}
          title={selectedExercise.title}
          icon={selectedExercise.icon}
          iconBg={selectedExercise.iconBg}
          onSuccess={(data) => {
            setStep("results");
            setPlans(data.plans);
          }}
        />
      )}

      {step === "results" && (
        <div className="w-full max-w-6xl p-6">
          <div>
            <h1 className="text-xl font-medium">Recommended Workout Plans</h1>
          </div>
          <p className="text-gray-500 mb-8 text-md">
            Based on your goals and preferences
          </p>

          <div className="grid gap-4">
            {plans.map((plan: any) => (
              <div
                key={plan.plan_id}
                className="rounded-2xl border bg-white p-6 shadow-sm hover:border-indigo-500"
              >
                <div className="grid grid-cols-2">
                  <h2 className="text-xl font-semibold">{plan.plan_name}</h2>
                  <div className="flex justify-end">
                    <Button className="rounded-lg bg-indigo-500 text-white">
                      <Award className="mr-2 w-4 h-4" />
                      <span>Assign Plan</span>
                    </Button>
                  </div>
                </div>
                <p className="text-gray-500 mt-1">{plan.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MuscleGain;