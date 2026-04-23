import axios from "axios";
import type { Coach } from "../../utils/Interfaces/coachquery";

export async function top5(): Promise<Coach[]> {
  const response = await axios.get("http://localhost:8080/landing/topCoaches", {
    withCredentials: true,
  });
  return response.data;
}
