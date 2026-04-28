import api from "../api";

export type CoachApplicationStatus =
  | "none"
  | "pending"
  | "approved"
  | "rejected";

export async function getAuth() {
  try {
    const { data } = await api.get("/auth/me");

    console.log("AUTH ME RESPONSE:", data);

    return {
      authenticated: true,
      roles: data.roles ?? [],
      user: data.user ?? null,
      needs_onboarding: data.needs_onboarding ?? false,
      coachApplicationStatus:
        data.coachApplicationStatus ?? data.coach_application_status ?? "none",
      coachModeActivated:
        data.coachModeActivated ?? data.coach_mode_activated ?? false,
    };
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.log("[AUTH CHECK] User is not logged in");
    } else {
      console.error("[AUTH CHECK FAILED]", error);
    }

    return {
      authenticated: false,
      roles: [],
      user: null,
      needs_onboarding: false,
      coachApplicationStatus: "none" as CoachApplicationStatus,
      coachModeActivated: false,
    };
  }
}
