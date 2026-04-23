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
  coach_id: number;
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

export type ContractStatus = "none" | "active" | "pending" | "closed";

// sends coach_id to backend and returns full coach profile
export async function getCoachProfile(coach_id: number): Promise<CoachProfile> {
  const { data } = await axios.post(
    `${BASE_URL}/coach/profile`,
    { coach_id },
    { withCredentials: true }
  );
  return data.coach;
}

// gets the current contract status between logged-in user and selected coach
export async function getContractStatus(coach_id: number): Promise<ContractStatus> {
  const { data } = await axios.get(`${BASE_URL}/contract/contractStatus`, {
    params: { coach_id },
    withCredentials: true,
  });

  return data.status;
}

// sends coach_id to the clientContracts route so the contract request is saved in the database
export async function requestCoachContract(coach_id: number) {
  const { data } = await axios.post(
    `${BASE_URL}/contract/requestContract`,
    { coach_id },
    { withCredentials: true }
  );

  return data;
}