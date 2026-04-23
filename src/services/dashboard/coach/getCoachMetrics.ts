import axios from "axios";

export const getCoachMetrics = async () => {
  const res = await axios.get("http://localhost:8080/dashboard/coach/metric", {
    withCredentials: true,
  });

  return res.data;
};
