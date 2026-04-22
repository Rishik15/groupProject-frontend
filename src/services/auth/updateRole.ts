import axios from "axios";

export async function updateRole(role: "coach" | "client") {
  const { data } = await axios.post(
    "http://localhost:8080/auth/updateRole",
    { role },
    { withCredentials: true }
  );

  return data;
}