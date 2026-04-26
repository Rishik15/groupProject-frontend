import api from "../api";

export async function get_users(activeMode: "client" | "coach") {
  try {
    const res = await api.get("/chat/get_users", {
      params: {
        mode: activeMode,
      },
    });

    return res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}