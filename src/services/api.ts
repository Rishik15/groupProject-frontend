import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.log("Session expired → redirecting to signin");
      window.location.href = "/signin";
    }

    else if (!err.response) {
      console.error("Server unreachable or network error");
    }

    return Promise.reject(err);
  }
);

export default api;