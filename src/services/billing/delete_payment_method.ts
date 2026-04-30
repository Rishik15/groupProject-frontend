import api from "../api";

export const delete_payment_method = (payment_method_id: number) => {
  return api.delete("/payments/payment-methods/delete", {
    data: { payment_method_id },
  });
};
