import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const createWorkout = async (
  name: string,
  exercises: {
    exercise_id: number;
    sets: number;
    reps: number;
  }[],
) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/workouts/create`,
      { name, exercises },
      { withCredentials: true },
    );

    return res.data;
  } catch (err: any) {
    let message = "Failed to save plan";

    if (err?.response?.data?.error) {
      message = err.response.data.error;
    } else if (err?.message) {
      message = err.message;
    }

    throw new Error(message);
  }
};
