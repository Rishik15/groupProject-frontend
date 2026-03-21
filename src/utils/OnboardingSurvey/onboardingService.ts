import type { ClientInfoValues } from "./clientSurvey";
import {
  buildCoachProfileDescription,
  isAvailabilityBlockValid,
  type CoachAvailabilityBlock,
  type CoachCertificationValues,
  type CoachCredentialsValues,
} from "./coachSurvey";

const API_BASE_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8080").replace(
  /\/$/,
  ""
);
const ONBOARDING_PATH = "/onboard/";

export interface BackendClientOnboardingPayload {
  dob: string;
  profile_picture: string;
  weight: number;
  height: number;
  goal_weight: number | null;
}

export interface BackendCoachOnboardingPayload
  extends BackendClientOnboardingPayload {
  coach_description: string;
  price: number;
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

interface CoachPayloadInput {
  primarySpecialties: string[];
  secondarySpecialties: string[];
  clientTypes: string[];
  availability: CoachAvailabilityBlock[];
  sessionFormats: string[];
  price: string;
  credentials: CoachCredentialsValues;
  profileDescription?: string;
}

interface CombinedCoachOnboardingInput {
  client: {
    info: ClientInfoValues;
  };
  coach: CoachPayloadInput;
}

interface OnboardingSuccessResponse {
  message: string;
}

function toNumberOrNull(value: string): number | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parsedValue = Number(trimmedValue);
  return Number.isNaN(parsedValue) ? null : parsedValue;
}

function toRequiredNumber(value: string): number {
  const parsedValue = Number(value.trim());
  return Number.isNaN(parsedValue) ? 0 : parsedValue;
}

function toBackendDateTime(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return trimmedValue.includes("T") ? trimmedValue : `${trimmedValue}T00:00:00`;
}

function toBackendTime(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  return trimmedValue.length === 5 ? `${trimmedValue}:00` : trimmedValue;
}

function toBackendDayOfWeek(
  dayOfWeek: CoachAvailabilityBlock["dayOfWeek"]
): string {
  return dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1).toLowerCase();
}

function hasAnyCertificationValue(
  certification: CoachCertificationValues
): boolean {
  return [
    certification.cert_name,
    certification.provider_name,
    certification.description,
    certification.issued_date,
    certification.expires_date,
  ].some((value) => value.trim() !== "");
}

function buildCoachDescription(input: CoachPayloadInput): string {
  if (input.profileDescription?.trim()) {
    return input.profileDescription.trim();
  }

  return buildCoachProfileDescription({
    primarySpecialties: input.primarySpecialties,
    secondarySpecialties: input.secondarySpecialties,
    clientTypes: input.clientTypes,
    sessionFormats: input.sessionFormats,
    yearsExperience: input.credentials.yearsExperience,
    bio: input.credentials.bio,
  });
}

async function postOnboardingPayload(
  payload: BackendClientOnboardingPayload | BackendCoachOnboardingPayload
): Promise<OnboardingSuccessResponse> {
  // Log the exact payload being sent to the backend.
  // The second log is formatted so it is easier to copy and inspect.
  console.log("Onboarding payload object:", payload);
  console.log("Onboarding payload JSON:", JSON.stringify(payload, null, 2));
  const response = await fetch(`${API_BASE_URL}${ONBOARDING_PATH}`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let responseBody: unknown = null;

  try {
    responseBody = await response.json();
  } catch {
    responseBody = null;
  }

  if (!response.ok) {
    const errorMessage =
      typeof responseBody === "object" &&
        responseBody !== null &&
        "error" in responseBody &&
        typeof responseBody.error === "string"
        ? responseBody.error
        : `Onboarding request failed with status ${response.status}.`;

    throw new Error(errorMessage);
  }

  if (
    typeof responseBody === "object" &&
    responseBody !== null &&
    "message" in responseBody &&
    typeof responseBody.message === "string"
  ) {
    return responseBody as OnboardingSuccessResponse;
  }

  return { message: "Onboarding completed successfully." };
}

export function buildBackendClientOnboardingPayload(
  clientInfo: ClientInfoValues
): BackendClientOnboardingPayload {
  return {
    dob: toBackendDateTime(clientInfo.dateOfBirth),
    profile_picture: "",
    weight: toRequiredNumber(clientInfo.weight),
    height: toRequiredNumber(clientInfo.height),
    goal_weight: toNumberOrNull(clientInfo.goalWeight),
  };
}

export function buildBackendCoachOnboardingPayload(
  data: CombinedCoachOnboardingInput
): BackendCoachOnboardingPayload {
  // Only include certifications that actually contain user-entered data.
  const certifications = data.coach.credentials.certifications
    .filter(hasAnyCertificationValue)
    .map((certification) => ({
      cert_name: certification.cert_name.trim(),
      provider_name: certification.provider_name.trim(),
      description: certification.description.trim(),
      issued_date: toBackendDateTime(certification.issued_date),
      expires_date: toBackendDateTime(certification.expires_date),
    }));

  // Only send active and valid availability blocks to the backend.
  const availabilityBlocks = data.coach.availability
    .filter((block) => block.active)
    .filter(isAvailabilityBlockValid)
    .map((block) => ({
      day_of_week: toBackendDayOfWeek(block.dayOfWeek),
      start_time: toBackendTime(block.startTime),
      end_time: toBackendTime(block.endTime),
      recurring: block.recurring,
      active: block.active,
    }));

  return {
    ...buildBackendClientOnboardingPayload(data.client.info),
    coach_description: buildCoachDescription(data.coach),
    price: toRequiredNumber(data.coach.price),
    num_cert: certifications.length,
    cert_name: certifications.map((certification) => certification.cert_name),
    provider_name: certifications.map(
      (certification) => certification.provider_name
    ),
    description: certifications.map((certification) => certification.description),
    issued_date: certifications.map((certification) => certification.issued_date),
    expires_date: certifications.map(
      (certification) => certification.expires_date
    ),
    num_days: availabilityBlocks.length,
    day_of_week: availabilityBlocks.map((block) => block.day_of_week),
    start_time: availabilityBlocks.map((block) => block.start_time),
    end_time: availabilityBlocks.map((block) => block.end_time),
    recurring: availabilityBlocks.map((block) => block.recurring),
    active: availabilityBlocks.map((block) => block.active),
  };
}

export async function submitClientOnboarding(clientInfo: ClientInfoValues) {
  const payload = buildBackendClientOnboardingPayload(clientInfo);
  return postOnboardingPayload(payload);
}

export async function submitCoachOnboarding(
  data: CombinedCoachOnboardingInput
) {
  const payload = buildBackendCoachOnboardingPayload(data);
  return postOnboardingPayload(payload);
}
