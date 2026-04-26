import type {
  ClientInfoValues,
  ClientFitnessLevel,
} from "../../utils/Interfaces/OnboardingSurvey/client";

import type {
  CoachAvailabilityBlock,
  CoachCredentialsValues,
} from "../../utils/Interfaces/OnboardingSurvey/coach";

export interface CombinedClientOnboardingInput {
  goals: string[];
  fitnessLevel: ClientFitnessLevel | "";
  info: ClientInfoValues;
}

export interface CoachPayloadInput {
  primarySpecialties: string[];
  secondarySpecialties: string[];
  clientTypes: string[];
  availability: CoachAvailabilityBlock[];
  sessionFormats: string[];
  price: string;
  credentials: CoachCredentialsValues;
  profileDescription?: string;
}

export interface CombinedCoachOnboardingInput {
  client: CombinedClientOnboardingInput;
  coach: CoachPayloadInput;
}

export interface BackendClientOnboardingPayload {
  dob: string;
  profile_picture: string;
  weight: number;
  height: number;
  goal_weight: number | null;
}

export interface BackendCoachApplicationPayload {
  coach_description: string;
  price: number;
  years_experience: number | null;

  primary_specialties: string[];
  secondary_specialties: string[];
  client_types: string[];
  session_formats: string[];
  bio: string;

  num_cert: number;
  cert_name: string[];
  provider_name: string[];
  description: string[];
  issued_date: string[];
  expires_date: string[];

  num_days: number;
  day_of_week: string[];
  start_time: string[];
  end_time: string[];
  recurring: boolean[];
  active: boolean[];
}

export interface OnboardingSuccessResponse {
  message: string;
}
