import axios from "axios";

export const getClientContract = () => {
  return axios.get("http://localhost:8080/contract/clientCoachStatus", {
    withCredentials: true,
  });
};