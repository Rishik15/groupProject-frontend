import axios from "axios";
import { API_BASE_URL } from "../api";

export async function checkBackendHealth() {
  const response = await axios.get(`${API_BASE_URL}/test/health`, {
    timeout: 8000,
    withCredentials: false,
  });

  return response.status >= 200 && response.status < 300;
}
