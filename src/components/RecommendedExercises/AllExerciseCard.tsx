import { Button, Card, Spinner } from "@heroui/react";
import { useState } from "react";

import api from "../../services/api";
import type { Plan } from "../../services/RecommendationExercises/types";
import PlanDetailModal from "./PlanDetailModal";
import type { ExerciseResponse } from "./ExerciseCard";

type Prop = {
  plan: Plan;
};

const AllExerciseCard = ({ plan }: Prop) => {
  const descriptionParts = plan.description?.split(" | ") ?? [];

  const goal = descriptionParts[0] || "General";
  const days = descriptionParts[1] || "Flexible";
  const duration = descriptionParts[2] || "Custom";
  const level = descriptionParts[3] || "All Levels";

  const [exerciseData, setExerciseData] = useState<ExerciseResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const handlePreview = async () => {
    try {
      setLoadingPlan(true);

      const res = await api.get<ExerciseResponse>(
        "/workouts/workout-plan/exercises",
        {
          params: { plan_id: plan.plan_id },
        },
      );

      setExerciseData(res.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch exercises:", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <>
      <Card className="border border-gray-300 p-4">
        <div className="flex flex-row items-center gap-4">
          <div>
            <div className="flex flex-row gap-2">
              <div className="w-fit rounded-2xl bg-[#F0EFFF] px-3 py-1 font-bold text-indigo-500">
                {goal}
              </div>

              <div className="w-fit rounded-2xl bg-[#F1F2F7] px-3 py-1 font-bold text-[#4C5469]">
                {days}
              </div>
            </div>

            <div className="my-3">
              <p className="text-xl font-bold text-black">{plan.plan_name}</p>
              <p>{goal}</p>
            </div>

            <div className="flex flex-row gap-2">
              <div className="w-fit rounded-2xl bg-[#F1F2F7] px-3 py-1 font-bold text-[#4C5469]">
                {level}
              </div>

              <div className="w-fit rounded-2xl bg-[#F1F2F7] px-3 py-1 font-bold text-[#4C5469]">
                {duration}
              </div>
            </div>
          </div>

          <Button
            className="ml-auto h-11 rounded-xl border-2 border-gray-300 bg-white font-bold text-black"
            onPress={handlePreview}
            isDisabled={loadingPlan}
          >
            {loadingPlan ? <Spinner size="lg" color="accent" /> : "Preview"}
          </Button>
        </div>
      </Card>

      <PlanDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        exerciseData={exerciseData}
        planName={plan.plan_name}
        plan_id={plan.plan_id}
        goal={goal}
        level={level}
        days={days}
        duration={duration}
      />
    </>
  );
};

export default AllExerciseCard;
