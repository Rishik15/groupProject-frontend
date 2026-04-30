import api from "../api";

type UpdateCoachPayload = {
  price?: number;
  coach_description?: string | null;
};

export async function updateCoachProfile(payload: UpdateCoachPayload) {
  const res = await api.patch("/coach/update", payload);
  return res.data;
}
