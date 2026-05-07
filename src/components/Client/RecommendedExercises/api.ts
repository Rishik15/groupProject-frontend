import api from "@/services/api";
import type { PredefinedPlansRequest, PredefinedPlansResponse } from "./types";

export async function fetchPredefinedPlans(
  payload: PredefinedPlansRequest,
): Promise<PredefinedPlansResponse> {
  const res = await api.post<PredefinedPlansResponse>(
    "/workouts/predefined",
    payload,
  );

  return res.data;
}

export async function assignPlan(planId: number) {
  const res = await api.post("/workouts/predefined/assign", {
    plan_id: planId,
  });

  return res.data;
}
