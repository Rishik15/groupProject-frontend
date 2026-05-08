import api from "../api";

export const getClientContract = () => {
  return api.get("/contract/clientCoachStatus");
};
