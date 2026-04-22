import axios from "axios";

export const getMessages = async (convId: number) => {
  try {
    const res = await axios.get("http://localhost:8080/chat/getMessages", {
      params: { conv_id: convId },
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    return [];
  }
};
