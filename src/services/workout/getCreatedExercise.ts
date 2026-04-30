import api from "../api";
import type { Exercise } from "../../components/CreateWorkoutPlan/ExerciseCard";

export async function getCreatedExercises(mode = "coach"): Promise<Exercise[]> {
  const { data } = await api.get("/coach/exercise/my-exercises", {
    params: { mode },
  });

  return data.exercises ?? [];
}
