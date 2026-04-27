import api from "../api";
import type { Exercise } from "../../components/CreateWorkoutPlan/ExerciseCard";

export async function getExercises(
  name: string = "",
  equipment: string[] = [],
): Promise<Exercise[]> {
  const { data } = await api.post("/exercise/search", {
    name,
    equipment,
  });

  return data.exercises;
}
