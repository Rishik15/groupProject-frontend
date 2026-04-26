import api from "../api";

export async function register(
  name: string,
  email: string,
  password: string,
  role: string,
) {
  try {
    const response = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
        role,
      },
      {
        skipAuthGate: true,
      } as any,
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Registration failed");
  }
}