import api from "../api";

export const markAsRead = async (id: number, mode: string) => {
  const response = await api.post(
    "/notifications/markAsRead",
    { id },
    {
      params: {
        mode,
      },
    },
  );

  return response.data;
};