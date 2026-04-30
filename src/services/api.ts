import axios, { type AxiosError } from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<any>) => {
    if (!err.response) {
      console.error("[API NETWORK ERROR] Backend may be down or waking up");
    }

    return Promise.reject(err);
  },
);

export default api;
