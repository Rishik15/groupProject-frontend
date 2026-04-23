import axios from "axios";

export async function getAuth() {
  try {
    const { data } = await axios.get("http://localhost:8080/auth/me", {
      withCredentials: true,
    });

    return {
      authenticated: true,
      roles: data.roles,
      user: data.user,
      needs_onboarding: data.needs_onboarding ?? false,
    };
  } catch {
    return {
      authenticated: false,
      roles: null,
      user: null,
      needs_onboarding: false,
    };
  }
}
