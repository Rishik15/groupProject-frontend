import axios, { type AxiosError } from "axios";

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
