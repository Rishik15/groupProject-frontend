import api from "../api";
import type { Coach } from "../../utils/Interfaces/coachquery";

export async function top5(): Promise<Coach[]> {
  const response = await api.get("/landing/topCoaches", {
    skipAuthGate: true,
  } as any);

  return response.data;
}