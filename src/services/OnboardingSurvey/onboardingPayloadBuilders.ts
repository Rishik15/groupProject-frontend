import type { ClientInfoValues } from "../../utils/Interfaces/OnboardingSurvey/client";
import type {
  CoachAvailabilityBlock,
  CoachCertificationValues,
} from "../../utils/Interfaces/OnboardingSurvey/coach";
import { buildCoachProfileDescription } from "../../utils/OnboardingSurvey/coachHelpers";
import { isAvailabilityBlockValid } from "../../utils/OnboardingSurvey/coachHelpers";
import type {
  BackendClientOnboardingPayload,
  BackendCoachOnboardingPayload,
  CoachPayloadInput,
  CombinedCoachOnboardingInput,
} from "./onboardingTypes";

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

export function buildClientOnboardingPayload(
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

export function buildCoachOnboardingPayload(
  data: CombinedCoachOnboardingInput
): BackendCoachOnboardingPayload {
  const certifications = data.coach.credentials.certifications
    .filter(hasAnyCertificationValue)
    .map((certification) => ({
      cert_name: certification.cert_name.trim(),
      provider_name: certification.provider_name.trim(),
      description: certification.description.trim(),
      issued_date: toBackendDateTime(certification.issued_date),
      expires_date: toBackendDateTime(certification.expires_date),
    }));

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
    ...buildClientOnboardingPayload(data.client.info),
    coach_description: buildCoachDescription(data.coach),
    price: toRequiredNumber(data.coach.price),
    num_cert: certifications.length,
    cert_name: certifications.map((certification) => certification.cert_name),
    provider_name: certifications.map(
      (certification) => certification.provider_name
    ),
    description: certifications.map((certification) => certification.description),
    issued_date: certifications.map((certification) => certification.issued_date),
    expires_date: certifications.map((certification) => certification.expires_date),
    num_days: availabilityBlocks.length,
    day_of_week: availabilityBlocks.map((block) => block.day_of_week),
    start_time: availabilityBlocks.map((block) => block.start_time),
    end_time: availabilityBlocks.map((block) => block.end_time),
    recurring: availabilityBlocks.map((block) => block.recurring),
    active: availabilityBlocks.map((block) => block.active),
  };
}
