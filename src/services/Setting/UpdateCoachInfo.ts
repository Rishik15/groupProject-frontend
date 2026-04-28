import api from "../api";
import type { Coach } from "./Coach";

export async function updateCoachProfile(payload: Partial<Coach>) {
  const res = await api.patch("/coach/update", payload);

  return res.data;
}