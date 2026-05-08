import api from "../api";

const getBrowserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
};

export async function login(email: string, password: string) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
      timezone: getBrowserTimezone(),
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
}
