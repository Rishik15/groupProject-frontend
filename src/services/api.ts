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
    url.startsWith("/filtering")
  );
};

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
});

api.interceptors.request.use(
  async (config: CustomAxiosRequestConfig) => {
    if (!shouldSkipAuthGate(config)) {
      await waitForAuthReady();
    }

    console.log("[API REQUEST]", {
      method: config.method,
      url: config.url,
      baseURL: config.baseURL,
      params: config.params,
      data: config.data,
      withCredentials: config.withCredentials,
      currentPath: window.location.pathname,
      authReady,
      headers: config.headers,
    });

    return config;
  },
  (error) => {
    console.error("[API REQUEST ERROR]", error);
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (res) => {
    console.log("[API RESPONSE]", {
      status: res.status,
      url: res.config.url,
      method: res.config.method,
      data: res.data,
    });

    return res;
  },
  (err: AxiosError<any>) => {
    const status = err.response?.status;
    const url = err.config?.url;
    const method = err.config?.method;
    const data = err.response?.data;

    console.warn("[API RESPONSE ERROR]", {
      status,
      url,
      method,
      data,
      currentPath: window.location.pathname,
    });

    if (!err.response) {
      console.error("[API NETWORK ERROR] Server unreachable or network error");
    }

    return Promise.reject(err);
  },
);

export default api;
