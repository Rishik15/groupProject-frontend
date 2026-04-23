import axios from "axios";

export const getNotifications = async (mode: string | null) => {
  const res = await axios.get(
    "http://localhost:8080/notifications/getNotifications",
    {
      params: { mode }, 
      withCredentials: true,
    },
  );

  return res.data;
};
