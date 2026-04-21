import { Card, Button } from "@heroui/react";
import type { Plan } from "../../services/RecommendationExercises/types";
import axios from "axios";
import { useState } from "react";
import assign_plan from "../../services/RecommendationExercises/assignPlan";
import PlanDetailModal from "./PlanDetailModal";

type Prop = {
  plan: Plan;
  submit: boolean
  setSubmit: (val: boolean) => void;
};

export type Exercise = {
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

export type ExerciseResponse = {
  exercise_count: number;
  exercises: Exercise[];
  plan_id: string;
};

export default function ExerciseCard({ plan, submit, setSubmit }: Prop) {
  const [exerciseData, setExerciseData] = useState<ExerciseResponse | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [goal, days, duration, level] = plan.description.split(" | ");

  const handleAssign = async () => {
    try {
      await assign_plan(plan.plan_id);
      setSubmit(true);
    } catch (err) {
      console.error("Failed to assign plan:", err);
    }
  };

  const handleViewPlan = async () => {
    try {
      setLoadingPlan(true);

      const res = await axios.get<ExerciseResponse>(
        "http://localhost:8080/workouts/workout-plan/exercises",
        {
          params: { plan_id: plan.plan_id },
          withCredentials: true,
        }
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
      <Card className="max-w-2xl w-[50%] rounded-3xl border border-indigo-200 p-6 shadow-sm mt-5">
        <div className="mb-4 flex gap-2">
          <div className="rounded-full bg-indigo-100 px-4 py-1 text-sm font-semibold text-indigo-500">
            Recommended
          </div>
          <div className="rounded-full bg-black px-4 py-1 text-sm font-semibold text-white">
            {level}
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-gray-900">{plan.plan_name}</h1>

        <div className="mb-6 flex gap-4">
          <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-semibold text-gray-900">{goal}</p>
          </div>

          <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Days / Week</p>
            <p className="font-semibold text-gray-900">{days}</p>
          </div>

          <div className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-semibold text-gray-900">{duration}</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Click <span className="font-medium text-gray-900">View Plan</span> to preview exercises.
          </p>
        </div>

        <div className="flex gap-4">
          <Button
            className="flex-1 rounded-2xl bg-indigo-500 text-white font-semibold py-6"
            onPress={handleViewPlan}
            isPending={loadingPlan}
          >
            {loadingPlan ? "Loading..." : "View Plan"}
          </Button>

          <Button
            className={`flex-1 rounded-2xl border py-6 font-semibold ${submit
                ? "border-green-500 bg-[#E4FBF0] text-[#5E8F7E]"
                : "border-gray-300 bg-white text-gray-900"
              }`}
            onPress={handleAssign}
          >
            {submit ? "Assigned" : "Assign Plan"}
          </Button>
        </div>
      </Card>

      <PlanDetailModal
        submit={submit}
        setSubmit={setSubmit}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        exerciseData={exerciseData}
        plan_id={plan.plan_id}
        planName={plan.plan_name}
        goal={goal}
        level={level}
        days={days}
        duration={duration}
      />
    </>
  );
}