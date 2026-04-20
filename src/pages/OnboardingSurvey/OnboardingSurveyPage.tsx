import { useState } from "react";
import { useNavigate } from "react-router-dom";

import ClientOnboardingPage from "./ClientOnboardingPage";
import CoachOnboardingPage from "./CoachOnboardingPage";

import type {
  ClientFitnessLevel,
  ClientInfoValues,
} from "../../utils/Interfaces/OnboardingSurvey/client";

import type {
  CoachAvailabilityBlock,
  CoachCertificationValues,
  CoachCredentialsValues,
} from "../../utils/Interfaces/OnboardingSurvey/coach";

import { coachInitialCredentials } from "../../utils/OnboardingSurvey/coachConfig";

import {
  buildCoachProfileDescription,
  createEmptyCoachCertification,
} from "../../utils/OnboardingSurvey/coachHelpers";

import {
  submitClientOnboarding,
  submitCoachOnboarding,
} from "../../services/OnboardingSurvey/onboardingService";

type SurveyType = "client" | "coach";
type ActiveFlow = "coach" | "client";

export interface CombinedOnboardingData {
  client: {
    goals: string[];
    fitnessLevel: ClientFitnessLevel | "";
    info: ClientInfoValues;
  };
  coach?: {
    primarySpecialties: string[];
    secondarySpecialties: string[];
    clientTypes: string[];
    availability: CoachAvailabilityBlock[];
    sessionFormats: string[];
    price: string;
    credentials: CoachCredentialsValues;
    profileDescription: string;
  };
}

interface OnboardingSurveyPageProps {
  surveyType?: SurveyType;
  onComplete?: (data: CombinedOnboardingData) => void;
}

const initialClientInfo: ClientInfoValues = {
  height: "",
  weight: "",
  goalWeight: "",
  profilePicture: "",
  dateOfBirth: "",
};

function OnboardingSurveyPage({
  surveyType = "client",
  onComplete,
}: OnboardingSurveyPageProps) {
  const navigate = useNavigate();

  // A coach completes two phases:
  // 1. coach-specific onboarding
  // 2. client/personal onboarding
  const [activeFlow, setActiveFlow] = useState<ActiveFlow>(
    surveyType === "coach" ? "coach" : "client",
  );

  // Client state
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [fitnessLevel, setFitnessLevel] = useState<ClientFitnessLevel | "">("");
  const [clientInfo, setClientInfo] =
    useState<ClientInfoValues>(initialClientInfo);

  // Coach state
  const [primarySpecialties, setPrimarySpecialties] = useState<string[]>([]);
  const [secondarySpecialties, setSecondarySpecialties] = useState<string[]>(
    [],
  );
  const [clientTypes, setClientTypes] = useState<string[]>([]);
  const [availability, setAvailability] = useState<CoachAvailabilityBlock[]>(
    [],
  );
  const [sessionFormats, setSessionFormats] = useState<string[]>([]);
  const [price, setPrice] = useState("");
  const [credentials, setCredentials] = useState<CoachCredentialsValues>(
    coachInitialCredentials,
  );

  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleClientInfoChange = (
    name: keyof ClientInfoValues,
    value: string,
  ) => {
    setClientInfo((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));
  };

  const handleCredentialFieldChange = (
    name: Extract<keyof CoachCredentialsValues, "yearsExperience" | "bio">,
    value: string,
  ) => {
    setCredentials((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));
  };

  const handleCertificationCountChange = (count: number) => {
    setCredentials((previousValues) => {
      const normalizedCount = Math.max(0, Math.floor(count));
      const nextCertifications = [...previousValues.certifications];

      if (normalizedCount > nextCertifications.length) {
        const certificationsToAdd = Array.from(
          { length: normalizedCount - nextCertifications.length },
          () => createEmptyCoachCertification(),
        );

        nextCertifications.push(...certificationsToAdd);
      } else {
        nextCertifications.length = normalizedCount;
      }

      return {
        ...previousValues,
        certificationCount: normalizedCount,
        certifications: nextCertifications,
      };
    });
  };

  const handleCertificationChange = (
    index: number,
    name: keyof CoachCertificationValues,
    value: string,
  ) => {
    setCredentials((previousValues) => ({
      ...previousValues,
      certifications: previousValues.certifications.map(
        (certification, currentIndex) =>
          currentIndex === index
            ? {
              ...certification,
              [name]: value,
            }
            : certification,
      ),
    }));
  };

  const handleCoachPhaseComplete = () => {
    setActiveFlow("client");
  };

  const handleSurveyComplete = async () => {
    const profileDescription = buildCoachProfileDescription({
      primarySpecialties,
      secondarySpecialties,
      clientTypes,
      sessionFormats,
      yearsExperience: credentials.yearsExperience,
      bio: credentials.bio,
    });

    const combinedData: CombinedOnboardingData = {
      client: {
        goals: selectedGoals,
        fitnessLevel,
        info: clientInfo,
      },
      ...(surveyType === "coach"
        ? {
          coach: {
            primarySpecialties,
            secondarySpecialties,
            clientTypes,
            availability,
            sessionFormats,
            price,
            credentials,
            profileDescription,
          },
        }
        : {}),
    };

    if (onComplete) {
      onComplete(combinedData);
      return;
    }

    try {
      setSubmitError(null);

      if (surveyType === "coach" && combinedData.coach) {
        const response = await submitCoachOnboarding({
          client: combinedData.client,
          coach: combinedData.coach,
        });

        console.log("Coach onboarding saved:", response);
        navigate("/coach", { replace: true });
        return;
      }

      const response = await submitClientOnboarding(combinedData.client.info);
      console.log("Client onboarding saved:", response);
      navigate("/client", { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit onboarding.",
      );
    }
  };

  const errorBanner = submitError ? (
    <div className="px-4 pt-4 sm:px-6">
      <p className="rounded-medium border border-danger-200 bg-danger-50 px-3 py-2 text-sm text-danger-700">
        {submitError}
      </p>
    </div>
  ) : null;

  if (surveyType === "coach" && activeFlow === "coach") {
    return (
      <>
        {errorBanner}
        <CoachOnboardingPage
          primarySpecialties={primarySpecialties}
          secondarySpecialties={secondarySpecialties}
          clientTypes={clientTypes}
          availability={availability}
          sessionFormats={sessionFormats}
          price={price}
          credentials={credentials}
          onPrimarySpecialtiesChange={setPrimarySpecialties}
          onSecondarySpecialtiesChange={setSecondarySpecialties}
          onClientTypesChange={setClientTypes}
          onAvailabilityChange={setAvailability}
          onSessionFormatsChange={setSessionFormats}
          onPriceChange={setPrice}
          onCredentialFieldChange={handleCredentialFieldChange}
          onCertificationCountChange={handleCertificationCountChange}
          onCertificationChange={handleCertificationChange}
          onComplete={handleCoachPhaseComplete}
        />
      </>
    );
  }

  return (
    <>
      {errorBanner}
      <ClientOnboardingPage
        selectedGoals={selectedGoals}
        fitnessLevel={fitnessLevel}
        clientInfo={clientInfo}
        onGoalsChange={setSelectedGoals}
        onFitnessLevelChange={setFitnessLevel}
        onClientInfoChange={handleClientInfoChange}
        onComplete={handleSurveyComplete}
        isCoachFlow={surveyType === "coach"}
      />
    </>
  );
}

export default OnboardingSurveyPage;
