import api from "../api";
import type { Coach, CoachQuery } from "../../utils/Interfaces/coachquery";

export async function searchCoaches(
  query: CoachQuery,
): Promise<{ coaches: Coach[]; count: number }> {
  console.log("sending to backend:", query);

  const { data } = await api.post(
    "/coach/search",
    query,
    {
      skipAuthGate: true,
    } as any,
  );

  return data;
}