import axios from "axios";
import type { ClientInfoValues } from "../../utils/Interfaces/OnboardingSurvey/client";
import apiClient from "./apiClient";
import {
  buildClientOnboardingPayload,
  buildCoachOnboardingPayload,
} from "./onboardingPayloadBuilders";
import type {
  CombinedCoachOnboardingInput,
  OnboardingSuccessResponse,
} from "./onboardingTypes";

const ONBOARDING_PATH = "/onboard/";

async function postOnboarding(
  payload: unknown
): Promise<OnboardingSuccessResponse> {
  console.log("Onboarding payload JSON:", JSON.stringify(payload, null, 2));

  try {
    const response = await apiClient.post<OnboardingSuccessResponse>(
      ONBOARDING_PATH,
      payload
    );

    return response.data ?? { message: "Onboarding completed successfully." };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.error;

      if (typeof backendMessage === "string") {
        throw new Error(backendMessage);
      }

      throw new Error(
        `Onboarding request failed with status ${error.response?.status ?? "unknown"}.`
      );
    }

    throw new Error("Onboarding request failed.");
  }
}

export async function submitClientOnboarding(clientInfo: ClientInfoValues) {
  const payload = buildClientOnboardingPayload(clientInfo);
  return postOnboarding(payload);
}

export async function submitCoachOnboarding(
  data: CombinedCoachOnboardingInput
) {
  const payload = buildCoachOnboardingPayload(data);
  return postOnboarding(payload);
}
