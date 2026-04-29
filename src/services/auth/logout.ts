import api from "../api";

export async function logout() {
  try {
    const res = await api.post("/auth/logout");
    return res.data;
  } catch (err) {
    console.error("Logout failed", err);
    throw err;
  }
}
