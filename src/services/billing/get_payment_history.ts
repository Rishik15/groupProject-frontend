import api from "../api";

export const get_PaymentHistory = async () => {
  const res = await api.get("/payments/history");
  return res;
};
