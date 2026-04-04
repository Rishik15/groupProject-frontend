import axios from "axios";

const BASE_URL = "http://localhost:8080";

export interface CoachProfile {
  coach_id: number;
  first_name: string;
  last_name: string;
  coach_description: string;
  avg_rating: number;
  review_count: number;
  price_per_session: number;
  years_exp: number;
  bio: string;
  certifications: string[];
  specialties: string[];
  availability: string;
  active_clients: number;
  success_rate: number;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  date: string;
  text: string;
}

export interface SuccessStory {
  id: number;
  author: string;
  result: string;
  text: string;
}

// i will replace with real backend route when ready
export async function getCoachProfile(coachId: number): Promise<CoachProfile> {
  const { data } = await axios.get(`${BASE_URL}/coach/${coachId}/profile`, {
    withCredentials: true,
  });
  return data;
}

export async function getCoachReviews(coachId: number): Promise<Review[]> {
  const { data } = await axios.get(`${BASE_URL}/coach/${coachId}/reviews`, {
    withCredentials: true,
  });
  return data;
}

export async function getCoachSuccessStories(coachId: number): Promise<SuccessStory[]> {
  const { data } = await axios.get(`${BASE_URL}/coach/${coachId}/success-stories`, {
    withCredentials: true,
  });
  return data;
}