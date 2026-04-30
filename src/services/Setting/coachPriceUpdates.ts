import api from "../api";

export type CoachPriceUpdateStatus = "pending" | "approved" | "rejected";

export type CoachPriceUpdate = {
  request_id: number;
  coach_id: number;
  current_price: number | null;
  proposed_price: number | null;
  status: CoachPriceUpdateStatus;
  admin_action: string | null;
  reviewed_by_admin_id: number | null;
  reviewed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export const getMyCoachPriceUpdates = async (): Promise<CoachPriceUpdate[]> => {
  const res = await api.get("/coach/price-updates/my");
  return res.data.updates ?? [];
};
