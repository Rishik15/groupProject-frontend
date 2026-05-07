import api from "../api";

export const cancelSubscription = () => {
  return api.patch("/payments/subscription/cancel");
};
