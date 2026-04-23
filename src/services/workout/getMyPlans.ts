import axios from "axios";

const BASE_URL = "http://localhost:8080";

export interface WorkoutPlan {
  plan_id: number;
  plan_name: string;
  description: string;
  source: "authored" | "assigned";
  total_exercises: number;
}

export async function getMyPlans(): Promise<WorkoutPlan[]> {
  const { data } = await axios.get(`${BASE_URL}/workouts/my-workouts`, {
    withCredentials: true,
  });
  return data.workouts;
}

export interface PlanExercise {
  exercise_id: number;
  exercise_name: string;
  sets_goal: number;
  reps_goal: number;
}

export async function getPlanExercises(plan_id: number): Promise<PlanExercise[]> {
  const { data } = await axios.get(`${BASE_URL}/workouts/workout-plan/exercises`, {
    params: { plan_id },
    withCredentials: true,
  });
  return data.exercises;
}