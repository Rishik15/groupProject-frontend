import axios from "axios";

export const getWorkoutCompletion = async () => {
  const res = await axios.get(
    "http://localhost:8080/dashboard/client/workout-completion",
    { withCredentials: true },
  );

  return res.data;
};
