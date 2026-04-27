import api from "../api";

export const sendMessage = async (
  message: string,
  conv_id: number,
  sender_mode: string,
) => {
  try {
    const res = await api.post("/chat/sendMessage", {
      message,
      conv_id,
      sender_mode,
    });

    return res.data.message;
  } catch (err: any) {
    console.error("Send message error:", err);
    throw err;
  }
};
