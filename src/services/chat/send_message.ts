import axios from "axios";

export const sendMessage = async (message: string, conv_id: number) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/chat/sendMessage",
      {
        message,
        conv_id,
      },
      {
        withCredentials: true,
      },
    );

    return res.data.message;
  } catch (err: any) {
    console.error("Send message error:", err);
    throw err;
  }
};
