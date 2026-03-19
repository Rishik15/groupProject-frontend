import { useState } from "react";

import SurveyLayout from "../../components/OnboardingSurvey/SurveyLayout";
import ClientGoalsStep from "../../components/OnboardingSurvey/Client/ClientGoalsStep";
import ClientInfoStep from "../../components/OnboardingSurvey/Client/ClientInfoStep";
import ClientSummaryStep from "../../components/OnboardingSurvey/Client/ClientSummaryStep";
import {
  clientSteps,
  clientTotalSteps,
  type ClientFitnessLevel,
  type ClientInfoValues,
} from "../../utils/OnboardingSurvey/clientSurvey";

function ClientOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [fitnessLevel, setFitnessLevel] = useState<ClientFitnessLevel | "">("");
  const [clientInfo, setClientInfo] = useState<ClientInfoValues>({
    age: "",
    height: "",
    weight: "",
  });

  // Step titles and subtitles stay in the survey utils file so this page
  // only controls flow and does not get bloated with display copy.
  const stepDetails = clientSteps[currentStep - 1];

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, clientTotalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  };

  // Keep field updates in one handler so each input can stay simple.
  // This also makes it easier to swap local state for API-backed state later.
  const handleClientInfoChange = (
    name: keyof ClientInfoValues,
    value: string
  ) => {
    setClientInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // The footer button is disabled based on the requirements for the current step.
  // This keeps validation rules in one place instead of scattering them across buttons.
  const isCurrentStepDisabled = () => {
    if (currentStep === 1) {
      return selectedGoals.length === 0;
    }

    if (currentStep === 2) {
      return (
        !fitnessLevel ||
        !clientInfo.age.trim() ||
        !clientInfo.weight.trim() ||
        !clientInfo.height.trim()
      );
    }

    return false;
  };

  // Render only the active step. Keeping this branching in one function makes
  // the page easier to scan than mixing step conditions throughout the JSX.
  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <ClientGoalsStep
          selectedGoals={selectedGoals}
          onChange={setSelectedGoals}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <ClientInfoStep
          values={clientInfo}
          fitnessLevel={fitnessLevel}
          onFieldChange={handleClientInfoChange}
          onFitnessLevelChange={setFitnessLevel}
        />
      );
    }

    return (
      <ClientSummaryStep
        goals={selectedGoals}
        values={clientInfo}
        fitnessLevel={fitnessLevel}
      />
    );
  };

  return (
    <SurveyLayout
      badgeLabel="Client Profile Setup"
      currentStep={currentStep}
      totalSteps={clientTotalSteps}
      title={stepDetails.title}
      subtitle={stepDetails.subtitle}
      onBack={currentStep > 1 ? handleBack : undefined}
      onNext={handleNext}
      nextButtonLabel={
        currentStep === clientTotalSteps ? "Get Started" : "Continue"
      }
      isNextDisabled={isCurrentStepDisabled()}
    >
      {renderStep()}
    </SurveyLayout>
  );
}

export default ClientOnboardingPage;
