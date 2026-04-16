import axios from "axios";

export async function get_users() {
  try {
    const res = await axios.get("http://localhost:8080/chat/get_users", {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}
