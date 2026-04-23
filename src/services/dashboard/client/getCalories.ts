import axios from "axios";

export const getCaloriesMetrics = async () => {
  const res = await axios.get(
    "http://localhost:8080/dashboard/client/calories",
    {
      withCredentials: true,
    },
  );

  return res.data.weekly;
};
