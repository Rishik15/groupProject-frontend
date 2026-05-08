import api from "../api";

const getBrowserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
};

export async function register(
  name: string,
  email: string,
  password: string,
  role: string,
) {
  try {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
      timezone: getBrowserTimezone(),
    });

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Registration failed");
  }
}
