import axios from "axios";
import type { Coach } from "../../utils/Interfaces/coachquery.ts";
import type { CoachQuery } from "../../utils/Interfaces/coachquery.ts";

const BASE_URL = "http://localhost:8080";

// sends filter payload to backend and returns matching coaches
export async function searchCoaches(
  query: CoachQuery,
): Promise<{ coaches: Coach[]; count: number }> {
  const { data } = await axios.post(
    `${BASE_URL}/routes/coach/searchCoaches.py`,
    query,
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    },
  );
  return data;
}
