import axios from "axios";

const BASE_URL = "http://localhost:8080";

interface NewExercise {
  name: string;
  equipment: string;
  description: string;
}

export async function createExercise(exercise: NewExercise): Promise<void> {
  await axios.post(
    `${BASE_URL}/exercise/create`,
    exercise,
    { withCredentials: true }
  );
}