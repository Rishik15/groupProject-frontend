import { useState } from "react";

import CoachCredentialsStep from "../../components/OnboardingSurvey/Coach/CoachCredentialsStep";
import CoachPreferencesStep from "../../components/OnboardingSurvey/Coach/CoachPreferencesStep";
import CoachPrimarySpecialtiesStep from "../../components/OnboardingSurvey/Coach/CoachPrimarySpecialtiesStep";
import CoachSecondarySpecialtiesStep from "../../components/OnboardingSurvey/Coach/CoachSecondarySpecialtiesStep";
import CoachSummaryStep from "../../components/OnboardingSurvey/Coach/CoachSummaryStep";
import SurveyLayout from "../../components/OnboardingSurvey/SurveyLayout";
import type {
  CoachAvailabilityBlock,
  CoachCertificationValues,
} from "../../utils/OnboardingSurvey/coachSurvey";
import {
  buildCoachProfileDescription,
  coachPrimarySpecialtyOptions,
  coachSteps,
  coachTotalSteps,
  hasOverlappingAvailabilityBlocks,
  isAvailabilityBlockValid,
  type CoachCredentialsValues,
} from "../../utils/OnboardingSurvey/coachSurvey";

interface CoachOnboardingPageProps {
  primarySpecialties: string[];
  secondarySpecialties: string[];
  clientTypes: string[];
  availability: CoachAvailabilityBlock[];
  sessionFormats: string[];
  price: string;
  credentials: CoachCredentialsValues;
  onPrimarySpecialtiesChange: (values: string[]) => void;
  onSecondarySpecialtiesChange: (values: string[]) => void;
  onClientTypesChange: (values: string[]) => void;
  onAvailabilityChange: (values: CoachAvailabilityBlock[]) => void;
  onSessionFormatsChange: (values: string[]) => void;
  onPriceChange: (value: string) => void;
  onCredentialFieldChange: (
    name: Extract<keyof CoachCredentialsValues, "yearsExperience" | "bio">,
    value: string
  ) => void;
  onCertificationCountChange: (count: number) => void;
  onCertificationChange: (
    index: number,
    name: keyof CoachCertificationValues,
    value: string
  ) => void;
  onComplete: () => void;
}

function isPriceValid(value: string) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return false;
  }

  const parsedValue = Number(trimmedValue);
  return !Number.isNaN(parsedValue) && parsedValue >= 0;
}

function CoachOnboardingPage({
  primarySpecialties,
  secondarySpecialties,
  clientTypes,
  availability,
  sessionFormats,
  price,
  credentials,
  onPrimarySpecialtiesChange,
  onSecondarySpecialtiesChange,
  onClientTypesChange,
  onAvailabilityChange,
  onSessionFormatsChange,
  onPriceChange,
  onCredentialFieldChange,
  onCertificationCountChange,
  onCertificationChange,
  onComplete,
}: CoachOnboardingPageProps) {
  const [currentStep, setCurrentStep] = useState(1);

  const stepDetails = coachSteps[currentStep - 1];

  // Secondary options should not show any specialty already chosen as primary.
  const availableSecondaryOptions = coachPrimarySpecialtyOptions.filter(
    (option) => !primarySpecialties.includes(option.value)
  );

  const coachProfileDescription = buildCoachProfileDescription({
    primarySpecialties,
    secondarySpecialties,
    clientTypes,
    sessionFormats,
    yearsExperience: credentials.yearsExperience,
    bio: credentials.bio,
  });

  const handlePrimarySpecialtiesChange = (values: string[]) => {
    onPrimarySpecialtiesChange(values);

    // If a specialty becomes primary, remove it from secondary selections.
    onSecondarySpecialtiesChange(
      secondarySpecialties.filter((value) => !values.includes(value))
    );
  };

  const handleNext = () => {
    if (currentStep < coachTotalSteps) {
      setCurrentStep((previousStep) => previousStep + 1);
      return;
    }

    onComplete();
  };

  const handleBack = () => {
    setCurrentStep((previousStep) => Math.max(1, previousStep - 1));
  };

  const isCurrentStepDisabled = () => {
    if (currentStep === 1) {
      return primarySpecialties.length === 0;
    }

    if (currentStep === 3) {
      const hasInvalidAvailabilityBlock = availability.some(
        (block) => !isAvailabilityBlockValid(block)
      );

      return (
        clientTypes.length === 0 ||
        sessionFormats.length === 0 ||
        !isPriceValid(price) ||
        availability.length === 0 ||
        hasInvalidAvailabilityBlock ||
        hasOverlappingAvailabilityBlocks(availability)
      );
    }

    return false;
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <CoachPrimarySpecialtiesStep
            selectedValues={primarySpecialties}
            onChange={handlePrimarySpecialtiesChange}
          />
        );

      case 2:
        return (
          <CoachSecondarySpecialtiesStep
            options={availableSecondaryOptions}
            selectedValues={secondarySpecialties}
            onChange={onSecondarySpecialtiesChange}
          />
        );

      case 3:
        return (
          <CoachPreferencesStep
            clientTypes={clientTypes}
            sessionFormats={sessionFormats}
            price={price}
            availability={availability}
            onClientTypesChange={onClientTypesChange}
            onSessionFormatsChange={onSessionFormatsChange}
            onPriceChange={onPriceChange}
            onAvailabilityChange={onAvailabilityChange}
          />
        );

      case 4:
        return (
          <CoachCredentialsStep
            values={credentials}
            onFieldChange={onCredentialFieldChange}
            onCertificationCountChange={onCertificationCountChange}
            onCertificationChange={onCertificationChange}
          />
        );

      default:
        return (
          <CoachSummaryStep
            primarySpecialties={primarySpecialties}
            secondarySpecialties={secondarySpecialties}
            clientTypes={clientTypes}
            sessionFormats={sessionFormats}
            availability={availability}
            price={price}
            yearsExperience={credentials.yearsExperience}
            bio={credentials.bio}
            certifications={credentials.certifications}
            profileDescription={coachProfileDescription}
          />
        );
    }
  };

  return (
    <SurveyLayout
      badgeLabel="Coach Profile Setup"
      currentStep={currentStep}
      totalSteps={coachTotalSteps}
      title={stepDetails.title}
      subtitle={stepDetails.subtitle}
      onBack={currentStep > 1 ? handleBack : undefined}
      onNext={handleNext}
      nextButtonLabel={
        currentStep === coachTotalSteps
          ? "Continue to Personal Profile"
          : "Continue"
      }
      isNextDisabled={isCurrentStepDisabled()}
    >
      {renderStep()}
    </SurveyLayout>
  );
}

export default CoachOnboardingPage;
