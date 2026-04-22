import axios from "axios";

export const markAsRead = async (id: number) => {
  await axios.post(
    "http://localhost:8080/notifications/markAsRead",
    { id },
    { withCredentials: true },
  );
};
