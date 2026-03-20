import axios from "axios";

export async function logout() {
  try {
    await axios.post(
      "http://localhost:8080/auth/logout",
      {},
      { withCredentials: true },
    );
  } catch (err) {
    console.error("Logout failed", err);
  }
}
