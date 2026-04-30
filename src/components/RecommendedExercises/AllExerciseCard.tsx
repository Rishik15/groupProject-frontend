import { Card, Button, Spinner } from "@heroui/react";
import type { Plan } from "../../services/RecommendationExercises/types";
import { useState } from "react";
import axios from "axios";
import PlanDetailModal from "./PlanDetailModal";

type Prop = {
  plan: Plan;
};

type Exercise = {
  day_label: string;
  day_order: number;
  equipment: string;
  exercise_name: string;
  order_in_workout: number;
  reps_goal: number;
  sets_goal: number;
  video_url: string;
  weight_goal: number | null;
};

type ExerciseResponse = {
  exercise_count: number;
  exercises: Exercise[];
  plan_id: string;
};

const AllExerciseCard = ({ plan }: Prop) => {
  const [goal, days, duration, level] = plan.description.split(" | ");

  const [exerciseData, setExerciseData] = useState<ExerciseResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  const handlePreview = async () => {
    try {
      setLoadingPlan(true);

      const res = await axios.get<ExerciseResponse>(
        "http://localhost:8080/workouts/workout-plan/exercises",
        {
          params: { plan_id: plan.plan_id },
          withCredentials: true,
        },
      );
      setExerciseData(res.data);
      console.log(res.data);
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
            isPending={loadingPlan}
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
