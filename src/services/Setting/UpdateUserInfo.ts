import api from "../api";

export async function updateProfile(
  weight: number,
  height: number,
  goal_weight: number,
) {
  const res = await api.put("/client/update-metrics", {
    weight,
    height,
    goal_weight,
  });

  return res.data;
}