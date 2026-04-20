import axios from "axios";

const BASE_URL = "http://localhost:8080";

export interface Availability {
  day_of_week: string;
  start_time: string;
  end_time: string;
}

export interface Review {
  review_id: number;
  rating: number;
  review_text: string;
  reviewer_first_name: string;
  reviewer_last_name: string;
  created_at: string;
}

export interface CoachProfile {
  first_name: string;
  last_name: string;
  coach_description: string;
  avg_rating: number;
  active_clients: number;
  price: string;
  profile_picture: string;
  availability: Availability[];
  reviews: Review[];
}

// sends coach_id to backend and returns full coach profile
export async function getCoachProfile(coach_id: number): Promise<CoachProfile> {
  const { data } = await axios.post(
    `${BASE_URL}/coach/profile`,
    { coach_id },
    { withCredentials: true }
  );
  return data.coach;
}