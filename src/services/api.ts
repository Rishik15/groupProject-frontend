import axios, {
  type AxiosError,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";

type CustomAxiosRequestConfig = InternalAxiosRequestConfig & {
  skipAuthGate?: boolean;
};

let authReady = false;
let authWaiters: Array<() => void> = [];

export const markAuthReady = () => {
  authReady = true;

  authWaiters.forEach((resolve) => resolve());
  authWaiters = [];
};

export const markAuthChecking = () => {
  authReady = false;
};

const waitForAuthReady = () => {
  if (authReady) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    authWaiters.push(resolve);
  });
};

const shouldSkipAuthGate = (config: AxiosRequestConfig) => {
  const url = config.url || "";

  return (
    (config as CustomAxiosRequestConfig).skipAuthGate ||
    url.startsWith("/auth") ||
    url.startsWith("/landing") ||
    url.startsWith("/filtering") ||
    url.startsWith("/onboard")
  );
};

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<any>) => {
    if (!err.response) {
      console.error("[API NETWORK ERROR] Backend may be down");
    }

    return Promise.reject(err);
  },
);

export default api;
