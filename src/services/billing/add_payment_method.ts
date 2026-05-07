import api from "../api";
import type { AddPaymentMethodPayload } from "../../components/Billing/type";

export const add_payment_method = async (card: AddPaymentMethodPayload) => {
  const res = await api.post("/payments/payment-methods/add-card", card);
  return res.data;
};
