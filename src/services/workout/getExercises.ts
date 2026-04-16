import axios from "axios";
import type { Exercise } from "../../components/CreateWorkoutPlan/ExerciseCard";

const BASE_URL = "http://localhost:8080";

export async function getExercises(): Promise<Exercise[]> {
  const { data } = await axios.get(`${BASE_URL}/workout/exercises`, {
    withCredentials: true,
  });
  return data;
}