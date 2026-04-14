import { useState } from "react";

import ClientGoalsStep from "../../components/OnboardingSurvey/Client/ClientGoalsStep";
import ClientInfoStep from "../../components/OnboardingSurvey/Client/ClientInfoStep";
import ClientSummaryStep from "../../components/OnboardingSurvey/Client/ClientSummaryStep";
import SurveyLayout from "../../components/OnboardingSurvey/SurveyLayout";

import type {
  ClientFitnessLevel,
  ClientInfoValues,
} from "../../utils/Interfaces/OnboardingSurvey/client";

import {
  clientSteps,
  clientTotalSteps,
} from "../../utils/OnboardingSurvey/clientConfig";

interface ClientOnboardingPageProps {
  selectedGoals: string[];
  fitnessLevel: ClientFitnessLevel | "";
  clientInfo: ClientInfoValues;
  onGoalsChange: (values: string[]) => void;
  onFitnessLevelChange: (value: ClientFitnessLevel) => void;
  onClientInfoChange: (name: keyof ClientInfoValues, value: string) => void;
  onComplete: () => void;
  isCoachFlow?: boolean;
}

function ClientOnboardingPage({
  selectedGoals,
  fitnessLevel,
  clientInfo,
  onGoalsChange,
  onFitnessLevelChange,
  onClientInfoChange,
  onComplete,
  isCoachFlow = false,
}: ClientOnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step titles and subtitles live in the survey utils file so this page only
  // controls flow and rendering.
  const stepDetails = clientSteps[currentStep - 1];

  const handleNext = () => {
    if (currentStep < clientTotalSteps) {
      setCurrentStep((previousStep) => previousStep + 1);
      return;
    }

    onComplete();
  };

  const handleBack = () => {
    setCurrentStep((previousStep) => Math.max(1, previousStep - 1));
  };

  const isCurrentStepDisabled = () => {
    switch (currentStep) {
      case 1:
        return selectedGoals.length === 0;

      case 2:
        return (
          !fitnessLevel ||
          !clientInfo.height.trim() ||
          !clientInfo.weight.trim() ||
          !clientInfo.dateOfBirth.trim()
        );

      default:
        return false;
    }
  };

  // Keeping step rendering in one switch makes the page easier to scan than
  // scattering step checks throughout the JSX.
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ClientGoalsStep
            selectedGoals={selectedGoals}
            onChange={onGoalsChange}
          />
        );

      case 2:
        return (
          <ClientInfoStep
            values={clientInfo}
            fitnessLevel={fitnessLevel}
            onFieldChange={onClientInfoChange}
            onFitnessLevelChange={onFitnessLevelChange}
          />
        );

      default:
        return (
          <ClientSummaryStep
            goals={selectedGoals}
            values={clientInfo}
            fitnessLevel={fitnessLevel}
          />
        );
    }
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
        currentStep === clientTotalSteps
          ? isCoachFlow
            ? "Complete Onboarding"
            : "Get Started"
          : "Continue"
      }
      isNextDisabled={isCurrentStepDisabled()}
    >
      {renderStep()}
    </SurveyLayout>
  );
}

export default ClientOnboardingPage;
