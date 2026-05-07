import api from "../api";

export const startSubscription = () => {
  return api.patch("/payments/subscription/start");
};
