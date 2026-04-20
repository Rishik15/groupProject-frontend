import axios from "axios";

export const getWeight = async () => {
  const res = await axios.get(
    "http://localhost:8080/dashboard/client/weight",
    { withCredentials: true }
  );

  return res.data;
};