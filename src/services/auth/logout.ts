import api from "../api";

export async function logout() {
  try {
    await api.post(
      "/auth/logout",
      {},
      {
        skipAuthGate: true,
      } as any,
    );
  } catch (err) {
    console.error("Logout failed", err);
  }
}