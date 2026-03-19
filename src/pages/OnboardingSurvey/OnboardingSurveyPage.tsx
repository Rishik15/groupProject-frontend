import ClientOnboardingPage from "./ClientOnboardingPage";
import CoachOnboardingPage from "./CoachOnboardingPage";

type SurveyType = "client" | "coach";

interface OnboardingSurveyPageProps {
  surveyType?: SurveyType;
}

/**
 * Thin entry component that switches between the client and coach flows.
 * Keeping the branch here lets each survey page stay focused on its own state.
 */
function OnboardingSurveyPage({
  surveyType = "client",
}: OnboardingSurveyPageProps) {
  return surveyType === "client" ? (
    <ClientOnboardingPage />
  ) : (
    <CoachOnboardingPage />
  );
}

export default OnboardingSurveyPage;
