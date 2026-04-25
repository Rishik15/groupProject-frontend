import axios from "axios";

export type CoachApplicationStatus =
  | "none"
  | "pending"
  | "approved"
  | "rejected";

export async function getAuth() {
  try {
    const { data } = await axios.get("http://localhost:8080/auth/me", {
      withCredentials: true,
    });

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
  } catch {
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
