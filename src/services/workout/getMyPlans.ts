import axios from "axios";
import type { WorkoutPlan } from "../../components/CreateWorkoutPlan/MyPlans";

const BASE_URL = "http://localhost:8080";

// this gets all saved workout plans for the current user
export async function getMyPlans(): Promise<WorkoutPlan[]> {
  const { data } = await axios.get(`${BASE_URL}/my-workouts`, {
    withCredentials: true,
  });
  return data;
}