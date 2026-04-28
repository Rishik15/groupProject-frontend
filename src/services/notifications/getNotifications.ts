import api from "../api";

export const getNotifications = async (mode: string | null) => {
  const res = await api.get("/notifications/getNotifications", {
    params: {
      mode,
    },
  });

  return res.data;
};
