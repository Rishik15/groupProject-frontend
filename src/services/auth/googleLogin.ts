const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getBrowserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
};

export function startGoogleLogin() {
  const timezone = getBrowserTimezone();

  window.location.assign(
    `${API_BASE_URL}/auth/googleLogin/start?timezone=${encodeURIComponent(
      timezone,
    )}`,
  );
}
