import axios from "axios";

export const markAsRead = async (id: number, mode: string) => {
  const response = await axios.post(
    "http://localhost:8080/notifications/markAsRead",
    { id },
    {
      params: { mode },
      withCredentials: true,
    },
  );

  return response.data;
};
