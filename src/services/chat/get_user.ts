import axios from "axios";

export async function get_users(activeMode: "client" | "coach") {
  try {
    const res = await axios.get("http://localhost:8080/chat/get_users", {
      params: { mode: activeMode },
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}
