import axios from "axios";

export type CoachApplicationStatus = "pending" | "approved" | "rejected";

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
        data.coach_application_status ?? ("rejected" as CoachApplicationStatus),
    };
  } catch {
    return {
      authenticated: false,
      roles: [],
      user: null,
      needs_onboarding: false,
      coachApplicationStatus: "rejected" as CoachApplicationStatus,
    };
  }
}
