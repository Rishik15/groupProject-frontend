import axios from "axios";

export async function login(email: string, password: string) {
  try {
    const response = await axios.post(
      "http://localhost:8080/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error || "Login failed");
  }
}
