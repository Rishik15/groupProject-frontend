import api from "../api";

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

export interface ClientCoachStatus {
  status: ContractStatus;
  has_active_contract: boolean;
  active_coach_id: number | null;
  active_contract_id: number | null;
  active_coach_name: string | null;
}

export interface ContractRequestPayload {
  coach_id: number;
  training_reason: string;
  goals: string;
  preferred_schedule: string;
  notes: string;
}

export async function getCoachProfile(coach_id: number): Promise<CoachProfile> {
  console.log("[getCoachProfile] sending coach_id:", coach_id);

  const { data } = await api.post("/coach/profile", { coach_id });

  console.log("[getCoachProfile] response:", data);

  return data.coach;
}

export async function getClientCoachStatus(
  coach_id: number,
): Promise<ClientCoachStatus> {
  console.log("[getClientCoachStatus] sending coach_id:", coach_id);

  const { data } = await api.get("/contract/clientCoachStatus", {
    params: {
      coach_id,
    },
  });

  console.log("[getClientCoachStatus] raw response:", data);
  console.log("[getClientCoachStatus] status:", data.status);
  console.log(
    "[getClientCoachStatus] has_active_contract:",
    data.has_active_contract,
  );
  console.log("[getClientCoachStatus] active_coach_id:", data.active_coach_id);
  console.log(
    "[getClientCoachStatus] active_contract_id:",
    data.active_contract_id,
  );
  console.log(
    "[getClientCoachStatus] active_coach_name:",
    data.active_coach_name,
  );

  return {
    status: data.status,
    has_active_contract: Boolean(data.has_active_contract),
    active_coach_id:
      data.active_coach_id === null || data.active_coach_id === undefined
        ? null
        : Number(data.active_coach_id),
    active_contract_id:
      data.active_contract_id === null || data.active_contract_id === undefined
        ? null
        : Number(data.active_contract_id),
    active_coach_name: data.active_coach_name ?? null,
  };
}

export async function requestCoachContract(payload: ContractRequestPayload) {
  console.log("[requestCoachContract] payload:", payload);

  const { data } = await api.post("/contract/requestContract", payload);

  console.log("[requestCoachContract] response:", data);

  return data;
}
