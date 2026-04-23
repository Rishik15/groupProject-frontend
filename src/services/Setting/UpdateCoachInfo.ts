import axios from "axios";
import type { Coach } from "../../types/Coach";

export async function updateCoachProfile(payload: Partial<Coach>) {
  const res = await axios.patch(
    "http://localhost:8080/coach/update",
    payload,
    {
      withCredentials: true,
    }
  );

  return res.data;
}