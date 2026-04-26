import api from "../api";

export async function login(email: string, password: string) {
  try {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      },
      {
        skipAuthGate: true,
      } as any,
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
}
