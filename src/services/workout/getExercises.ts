import axios from "axios";
import type { Exercise } from "../../components/CreateWorkoutPlan/ExerciseCard";

const BASE_URL = "http://localhost:8080";

export async function getExercises(
  name: string = "",
  equipment: string[] = [],
): Promise<Exercise[]> {
  const { data } = await axios.post(
    `${BASE_URL}/exercise/search`,
    { name, equipment },
    { withCredentials: true },
  );
  return data.exercises;
}
