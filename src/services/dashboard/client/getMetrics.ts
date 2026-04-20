import axios from "axios";

export const getMetrics = async () => {
  const res = await axios.get(
    "http://localhost:8080/dashboard/client/metrics",
    { withCredentials: true }
  );

  return res.data;
};