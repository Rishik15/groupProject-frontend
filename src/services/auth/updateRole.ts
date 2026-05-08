import api from "../api";

export const updateRole = async (
  role: "client" | "coach",
  timezone?: string,
) => {
  const res = await api.post("/auth/updateRole", {
    role,
    timezone:
      timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      "America/New_York",
  });

  return res.data;
};
