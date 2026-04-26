import api from "../api";

export async function updateRole(role: "coach" | "client") {
  const { data } = await api.post("/auth/updateRole", { role });

  return data;
}