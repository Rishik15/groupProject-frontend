import { useState } from "react";

import SurveyLayout from "../../components/OnboardingSurvey/SurveyLayout";
import CoachPrimarySpecialtiesStep from "../../components/OnboardingSurvey/Coach/CoachPrimarySpecialtiesStep";
import CoachSecondarySpecialtiesStep from "../../components/OnboardingSurvey/Coach/CoachSecondarySpecialtiesStep";
import CoachSummaryStep from "../../components/OnboardingSurvey/Coach/CoachSummaryStep";
import CoachPreferencesStep from "../../components/OnboardingSurvey/Coach/CoachPreferencesStep";
import CoachCredentialsStep from "../../components/OnboardingSurvey/Coach/CoachCredentialsStep";
import {
  coachInitialCredentials,
  coachPrimarySpecialtyOptions,
  coachSteps,
  coachTotalSteps,
  type CoachCredentialsValues,
} from "../../utils/OnboardingSurvey/coachSurvey";

function CoachOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [primarySpecialties, setPrimarySpecialties] = useState<string[]>([]);
  const [secondarySpecialties, setSecondarySpecialties] = useState<string[]>([]);
  const [clientTypes, setClientTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [sessionFormats, setSessionFormats] = useState<string[]>([]);
  const [credentials, setCredentials] =
    useState<CoachCredentialsValues>(coachInitialCredentials);

  // Step titles and subtitles live in the utils file so this page can focus on
  // state and navigation instead of becoming a large copy-heavy component.
  const stepDetails = coachSteps[currentStep - 1];

  // Secondary specialties should only show options that are not already chosen
  // as primary specialties. This avoids duplicate selections across both steps.
  const availableSecondaryOptions = coachPrimarySpecialtyOptions.filter(
    (option) => !primarySpecialties.includes(option.value)
  );

  // When a specialty becomes primary, remove it from secondary selections too.
  // This keeps the two lists mutually exclusive without extra validation later.
  const handlePrimarySpecialtiesChange = (values: string[]) => {
    setPrimarySpecialties(values);

    setSecondarySpecialties((prev) =>
      prev.filter((value) => !values.includes(value))
    );
  };

  // Keep credential updates centralized so the step component can stay focused
  // on rendering HeroUI inputs rather than state-shaping logic.
  const handleCredentialsChange = (
    name: keyof CoachCredentialsValues,
    value: string
  ) => {
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setCurrentStep((prevStep) => Math.min(prevStep + 1, coachTotalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prevStep) => Math.max(1, prevStep - 1));
  };

  // Each step has different completion rules.
  // Keeping them here makes the continue button behavior easy to trace.
  const isCurrentStepDisabled = () => {
    if (currentStep === 1) {
      return primarySpecialties.length === 0;
    }

    if (currentStep === 3) {
      return (
        clientTypes.length === 0 ||
        sessionFormats.length === 0 ||
        availability.length === 0
      );
    }

    return false;
  };

  // Render the active step in one place so the overall coach flow is easy to follow.
  const renderStep = () => {
    if (currentStep === 1) {
      return (
        <CoachPrimarySpecialtiesStep
          selectedValues={primarySpecialties}
          onChange={handlePrimarySpecialtiesChange}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <CoachSecondarySpecialtiesStep
          options={availableSecondaryOptions}
          selectedValues={secondarySpecialties}
          onChange={setSecondarySpecialties}
        />
      );
    }

    if (currentStep === 3) {
      return (
        <CoachPreferencesStep
          clientTypes={clientTypes}
          sessionFormats={sessionFormats}
          availability={availability}
          onClientTypesChange={setClientTypes}
          onSessionFormatsChange={setSessionFormats}
          onAvailabilityChange={setAvailability}
        />
      );
    }

    if (currentStep === 4) {
      return (
        <CoachCredentialsStep
          values={credentials}
          onChange={handleCredentialsChange}
        />
      );
    }

    return (
      <CoachSummaryStep
        primarySpecialties={primarySpecialties}
        secondarySpecialties={secondarySpecialties}
        clientTypes={clientTypes}
        sessionFormats={sessionFormats}
        availability={availability}
        yearsExperience={credentials.yearsExperience}
        certifications={credentials.certifications}
      />
    );
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
          ? "Continue to Coach Dashboard"
          : "Continue"
      }
      isNextDisabled={isCurrentStepDisabled()}
    >
      {renderStep()}
    </SurveyLayout>
  );
}

export default CoachOnboardingPage;
