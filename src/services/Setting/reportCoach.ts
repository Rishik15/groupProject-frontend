import api from "../api";

export type ReportCoachItem = {
  coach_id: number;
  full_name: string;
  email: string;
  image?: string | null;
  contract_status?: string;
};

export const getPreviousCoaches = async (): Promise<ReportCoachItem[]> => {
  const res = await api.get("/client/getPreviousCoaches");
  return Array.isArray(res.data) ? res.data : [];
};

export const reportCoach = async ({
  coachId,
  reason,
  details,
  terminateRequested,
}: {
  coachId: number;
  reason: string;
  details: string;
  terminateRequested: boolean;
}) => {
  const res = await api.post("/client/reportCoach", {
    coach_id: coachId,
    reason,
    description: details,
    terminate_requested: terminateRequested,
  });

  return res.data;
};
