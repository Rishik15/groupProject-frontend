import api from "../api";

export const get_PaymentMethods = async () => {
  const res = await api.get("/payments/payment-methods");
  return res;
};
