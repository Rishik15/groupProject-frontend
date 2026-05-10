import api from "../api";
import type { PaymentHistoryDetail } from "../../components/Billing/type";

type PayCoachNowResponse = {
  message: string;
  payment: PaymentHistoryDetail;
};

export const payCoachNow = async (): Promise<PayCoachNowResponse> => {
  const res = await api.post("/payments/pay-coach-now");

  return res.data;
};
