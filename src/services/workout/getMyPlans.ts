import api from "../api";
import type { WorkoutPlan } from "../../components/CreateWorkoutPlan/MyPlans";

export interface PlanExercise {
  exercise_id: number;
  exercise_name: string;
  sets_goal: number;
  reps_goal: number;
}

export async function getMyPlans(): Promise<WorkoutPlan[]> {
  const { data } = await api.get("/workouts/my-workouts");

  return data.workouts;
}

export async function getPlanExercises(
  plan_id: number,
): Promise<PlanExercise[]> {
  const { data } = await api.get("/workouts/workout-plan/exercises", {
    params: {
      plan_id,
    },
  });

  return data.exercises;
}