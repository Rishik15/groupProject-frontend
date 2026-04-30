import api from "../api";
import type { WorkoutPlan } from "../../components/CreateWorkoutPlan/MyPlans";

export interface PlanExercise {
  exercise_id: number;
  exercise_name: string;
  equipment: string | null;
  video_url: string | null;
  sets_goal: number;
  reps_goal: number;
  weight_goal: number | null;
  order_in_workout: number;
}

export interface PlanDay {
  day_id: number;
  day_order: number;
  day_label: string;
  exercises: PlanExercise[];
}

export async function getMyPlans(): Promise<WorkoutPlan[]> {
  const { data } = await api.get("/workouts/my-workouts");

  return data.workouts;
}

export async function getPlanExercises(plan_id: number): Promise<PlanDay[]> {
  const { data } = await api.get("/workouts/workout-plan/exercises", {
    params: {
      plan_id,
    },
  });

  return data.days || [];
}
