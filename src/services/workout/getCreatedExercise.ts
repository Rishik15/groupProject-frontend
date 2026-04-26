import api from "../api";
import type { Exercise } from "../../components/CreateWorkoutPlan/ExerciseCard";

export async function getCreatedExercises(): Promise<Exercise[]> {
  const { data } = await api.get("/coach/exercise/my-exercises");

  return data.exercises;
}