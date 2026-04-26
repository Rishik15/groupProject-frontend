import axios from "axios";

import type { ClientInfoValues } from "../../utils/Interfaces/OnboardingSurvey/client";

import api from "../api";

import {
  buildClientOnboardingPayload,
  buildCoachApplicationPayload,
} from "./onboardingPayloadBuilders";

import type {
  CoachPayloadInput,
  OnboardingSuccessResponse,
} from "./onboardingTypes";

const CLIENT_ONBOARDING_PATH = "/onboard/";
const COACH_APPLICATION_PATH = "/onboard/coachApplication";

async function postOnboarding(
  path: string,
  payload: unknown,
): Promise<OnboardingSuccessResponse> {
  console.log("Onboarding payload JSON:", JSON.stringify(payload, null, 2));

  try {
    const response = await api.post<OnboardingSuccessResponse>(path, payload);

    return response.data ?? { message: "Onboarding completed successfully." };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.error;

      if (typeof backendMessage === "string") {
        throw new Error(backendMessage);
      }

      throw new Error(
        `Onboarding request failed with status ${
          error.response?.status ?? "unknown"
        }.`,
      );
    }

    throw new Error("Onboarding request failed.");
  }
}

export async function submitClientOnboarding(clientInfo: ClientInfoValues) {
  const payload = buildClientOnboardingPayload(clientInfo);
  return postOnboarding(CLIENT_ONBOARDING_PATH, payload);
}

export async function submitCoachApplication(coach: CoachPayloadInput) {
  const payload = buildCoachApplicationPayload(coach);
  return postOnboarding(COACH_APPLICATION_PATH, payload);
}
