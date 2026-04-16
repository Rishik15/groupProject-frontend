import axios from "axios";

export async function updateProfile(
  weight: number,
  height: number,
  goal_weight: number
) {
  const res = await axios.put(
    "http://localhost:8080/client/update-metrics",
    {
      weight,
      height,
      goal_weight,
    },
    {
      withCredentials: true,
    }
  );

  return res.data;
}