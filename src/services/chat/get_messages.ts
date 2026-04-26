import api from "../api";

export const getMessages = async (convId: number) => {
  try {
    const res = await api.get("/chat/getMessages", {
      params: {
        conv_id: convId,
      },
    });

    return res.data;
  } catch (err) {
    console.error("GET MESSAGES ERROR:", err);
    return [];
  }
};