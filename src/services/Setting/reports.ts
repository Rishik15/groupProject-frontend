import api from "../api";

export type ClientReport = {
  id: number;
  report_id: number;
  reported_user_id: number;
  reported_name: string | null;
  reported_email: string | null;
  reason: string;
  description: string | null;
  status: string;
  admin_action: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export const getMyReports = async (): Promise<ClientReport[]> => {
  const res = await api.get("/client/reports/my");
  return res.data.reports ?? [];
};
