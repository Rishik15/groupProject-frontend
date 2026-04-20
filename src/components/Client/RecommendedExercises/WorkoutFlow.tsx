import { useState } from "react";
import GoalSelection from "./GoalSelection";
import { RecommendationForm } from "./RecommendationForm";
import type {
  ExerciseGoal,
  PredefinedPlansRequest,
  WorkoutPlan,
} from "./types";
import { fetchPredefinedPlans, assignPlan } from "./api";
import { Button } from "@heroui/react";
import { Award } from "lucide-react";

function WorkoutFlow() {
  const [step, setStep] = useState<"select" | "form" | "results">("select");
  const [selectedGoal, setSelectedGoal] = useState<ExerciseGoal | null>(null);
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const [assignedPlanId, setAssignedPlanId] = useState<number | null>(null);

  const handleGoalSelect = (goal: ExerciseGoal) => {
    setSelectedGoal(goal);
    setStep("form");
  };

  const handleFormSubmit = async (payload: PredefinedPlansRequest) => {
    try {
      setLoading(true);
      const data = await fetchPredefinedPlans(payload);
      setPlans(data.plans);
      setStep("results");
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === "form") {
      setSelectedGoal(null);
      setStep("select");
      return;
    }

    if (step === "results") {
      setStep("form");
    }
  };

const handleAssign = async (planId: number) => {
  try {
    await assignPlan(planId);
    setAssignedPlanId(planId); 
  } catch (err) {
    console.error("Failed to assign plan:", err);
  }
};

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gray-50 flex justify-center pt-16">

      {step === "select" && <GoalSelection onSelect={handleGoalSelect} />}

      {step === "form" && selectedGoal && (
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleBack}
            className="mb-4 p-0 h-auto min-h-0 bg-transparent text-sm text-gray-500 hover:text-black shadow-none border-none"
          >
            ← Back
          </Button>

          <RecommendationForm
            goal={selectedGoal}
            onSubmit={handleFormSubmit}
            loading={loading}
          />
        </div>
      )}

      {step === "results" && (
        <div className="w-full max-w-4xl p-6">
            <Button
                onClick={handleBack}
                className="mb-4 p-0 bg-white h-auto min-h-0 text-sm text-gray-500 hover:text-black justify-start"
            >
                ← Back
            </Button>

          <h1 className="text-xl font-medium">Recommended Workout Plans</h1>
          <p className="mb-8 text-md text-gray-500">
            Based on your goals and preferences
          </p>

          <div className="grid gap-4">
            {plans.map((plan) => (
              <div
                key={plan.plan_id}
                className="rounded-2xl border bg-white p-6 shadow-sm hover:border-indigo-500"
              >
                <div className="grid grid-cols-2">
                  <h2 className="text-xl font-semibold">
                    {plan.plan_name}
                  </h2>

                  <div className="flex justify-end">
                    <Button
                      onClick={() => handleAssign(plan.plan_id)}
                      isDisabled={assignedPlanId === plan.plan_id}
                      className={
                        assignedPlanId === plan.plan_id
                          ? "rounded-lg bg-green-500 text-white cursor-default"
                          : "rounded-lg bg-indigo-500 text-white"
                      }
                    >
                      <Award className="mr-2 h-4 w-4" />
                      <span>
                        {assignedPlanId === plan.plan_id
                          ? "Assigned"
                          : "Assign Plan"}
                      </span>
                    </Button>
                  </div>
                </div>

                <p className="mt-1 text-gray-500">{plan.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutFlow;