import axios from "axios";

export async function getAuth() {
  try {
    const { data } = await axios.get("http://localhost:8080/auth/me", {
      withCredentials: true,
    });

    return {
      authenticated: true,
      role: data.role,
      user: data.user,
    };
  } catch {
    return {
      authenticated: false,
      role: null,
    };
  }
}
