const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function startGoogleLogin() {
  window.location.assign(`${API_BASE_URL}/auth/googleLogin/start`);
}
