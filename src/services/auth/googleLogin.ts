const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getBrowserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
};

export function startGoogleLogin() {
  if (!API_BASE_URL) {
    console.error("Missing VITE_API_BASE_URL");
    return;
  }

  const timezone = getBrowserTimezone();
  const baseUrl = API_BASE_URL.replace(/\/$/, "");

  window.location.assign(
    `${baseUrl}/auth/googleLogin/start?timezone=${encodeURIComponent(
      timezone,
    )}`,
  );
}
