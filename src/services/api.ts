import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRedirecting = false;

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;

    if (status === 401) {
      if (!isRedirecting && window.location.pathname !== "/signin") {
        isRedirecting = true;
        window.location.href = "/signin";
      }

      return Promise.reject(err);
    }

    if (!err.response) {
      console.error("Server unreachable or network error");
    }

    return Promise.reject(err);
  },
);

export default api;
