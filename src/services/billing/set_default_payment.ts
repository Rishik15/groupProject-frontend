import api from "../api";

export const set_default_payment = (payment_method_id: number) => {
  return api.put("/payments/payment-methods/set-default", {
    payment_method_id,
  });
};
