import axios from "axios";

export const getNotifications = async () => {
  const res = await axios.get(
    "http://localhost:8080/notifications/getNotifications",
    {
      withCredentials: true,
    },
  );

  return res.data;
};
