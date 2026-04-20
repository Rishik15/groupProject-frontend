import axios from "axios";

export async function register(
  name: string,
  email: string,
  password: string,
  role: string,
) {
  try {
    const response = await axios.post(
      "http://localhost:8080/auth/register",
      {
        name,
        email,
        password,
        role,
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
    throw new Error(error.response?.data?.error || "Registration failed");
  }
}
