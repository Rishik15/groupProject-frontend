import type {
  PredefinedPlansRequest,
  PredefinedPlansResponse,
} from "./types";

export async function fetchPredefinedPlans(
  payload: PredefinedPlansRequest,
): Promise<PredefinedPlansResponse> {
  const res = await fetch("http://localhost:8080/workouts/predefined", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}