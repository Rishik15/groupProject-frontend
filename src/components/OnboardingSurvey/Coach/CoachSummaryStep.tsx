import { Card, Chip } from "@heroui/react";
import {
  coachAvailabilityLabelMap,
  coachClientTypeLabelMap,
  coachSessionFormatLabelMap,
  coachSpecialtyLabelMap,
} from "../../../utils/OnboardingSurvey/coachSurvey";

interface CoachSummaryStepProps {
  primarySpecialties: string[];
  secondarySpecialties: string[];
  clientTypes: string[];
  sessionFormats: string[];
  availability: string[];
  yearsExperience: string;
  certifications: string;
}

/**
 * Final coach onboarding summary.
 * This screen gives the coach a quick review of the profile information
 * they entered before continuing to the dashboard.
 */
function CoachSummaryStep({
  primarySpecialties,
  secondarySpecialties,
  clientTypes,
  sessionFormats,
  availability,
  yearsExperience,
  certifications,
}: CoachSummaryStepProps) {
  // Treat whitespace-only input as empty so the summary does not show
  // "Provided" when the user did not actually enter certification text.
  const hasCertifications = certifications.trim().length > 0;

  return (
    <div className="space-y-5">
      {/* Top summary card with the most important profile details. */}
      <Card className="rounded-[20px] border border-[#CFCFFE] bg-[#F7F7FF] px-6 py-6 shadow-none">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8E8FF] text-[28px] text-[#5B5EF4]">
            ✓
          </div>

          <div className="flex-1">
            <h2 className="text-[18px] font-semibold text-black">
              Coach Profile Created
            </h2>

            <p className="mt-1 text-[15px] text-[#6E728C]">
              {primarySpecialties.length} primary{" "}
              {primarySpecialties.length === 1 ? "specialty" : "specialties"}{" "}
              selected
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-[14px] text-[#6E728C]">
              <span>
                <span className="font-medium text-black">Experience:</span>{" "}
                {yearsExperience || "—"} {yearsExperience ? "years" : ""}
              </span>
              <span>
                <span className="font-medium text-black">Certifications:</span>{" "}
                {hasCertifications ? "Provided" : "Not provided"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/*
        Label maps from coachSurvey.ts convert stored option values into user-facing
        text. That keeps this summary component focused on layout instead of hardcoded
        display strings.
      */}
      <Card className="rounded-[20px] border border-[#E4E4EC] bg-[#FAFAFD] px-6 py-6 shadow-none">
        <h3 className="text-[17px] font-semibold text-black">
          Primary Specialties
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">
          {primarySpecialties.length > 0 ? (
            primarySpecialties.map((specialty) => (
              <Chip
                key={specialty}
                className="bg-[#E8E8FF] text-[14px] font-medium text-[#5B5EF4]"
              >
                {coachSpecialtyLabelMap[specialty] ?? specialty}
              </Chip>
            ))
          ) : (
            <p className="text-[14px] text-[#6E728C]">
              No primary specialties selected
            </p>
          )}
        </div>
      </Card>

      {/* Secondary specialties are optional additional focus areas. */}
      <Card className="rounded-[20px] border border-[#E4E4EC] bg-[#FAFAFD] px-6 py-6 shadow-none">
        <h3 className="text-[17px] font-semibold text-black">
          Secondary Specialties
        </h3>

        <div className="mt-4 flex flex-wrap gap-3">
          {secondarySpecialties.length > 0 ? (
            secondarySpecialties.map((specialty) => (
              <Chip
                key={specialty}
                className="border border-[#E4E4EC] bg-white text-[14px] font-medium text-[#6E728C]"
              >
                {coachSpecialtyLabelMap[specialty] ?? specialty}
              </Chip>
            ))
          ) : (
            <p className="text-[14px] text-[#6E728C]">
              No secondary specialties selected
            </p>
          )}
        </div>
      </Card>

      {/*
        Keep all coaching preferences grouped together so the final review mirrors
        how the user filled them out earlier in the onboarding flow.
      */}
      <Card className="rounded-[20px] border border-[#E4E4EC] bg-[#FAFAFD] px-6 py-6 shadow-none">
        <h3 className="text-[17px] font-semibold text-black">
          Coaching Preferences
        </h3>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-[14px] font-medium text-black">Who You Coach</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {clientTypes.length > 0 ? (
                clientTypes.map((clientType) => (
                  <Chip
                    key={clientType}
                    className="border border-[#E4E4EC] bg-white text-[14px] font-medium text-[#6E728C]"
                  >
                    {coachClientTypeLabelMap[clientType] ?? clientType}
                  </Chip>
                ))
              ) : (
                <p className="text-[14px] text-[#6E728C]">
                  No client preferences selected yet
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-[14px] font-medium text-black">Session Formats</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {sessionFormats.length > 0 ? (
                sessionFormats.map((format) => (
                  <Chip
                    key={format}
                    className="border border-[#E4E4EC] bg-white text-[14px] font-medium text-[#6E728C]"
                  >
                    {coachSessionFormatLabelMap[format] ?? format}
                  </Chip>
                ))
              ) : (
                <p className="text-[14px] text-[#6E728C]">
                  No session formats selected yet
                </p>
              )}
            </div>
          </div>

          <div>
            <p className="text-[14px] font-medium text-black">Availability</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {availability.length > 0 ? (
                availability.map((slot) => (
                  <Chip
                    key={slot}
                    className="border border-[#E4E4EC] bg-white text-[14px] font-medium text-[#6E728C]"
                  >
                    {coachAvailabilityLabelMap[slot] ?? slot}
                  </Chip>
                ))
              ) : (
                <p className="text-[14px] text-[#6E728C]">
                  No availability selected yet
                </p>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Final reminder card telling the coach what happens after onboarding. */}
      <Card className="rounded-[20px] border border-[#E4E4EC] bg-[#FAFAFD] px-6 py-6 shadow-none">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center text-[18px] text-[#6E728C]">
            ⛓
          </div>

          <div>
            <h3 className="text-[18px] font-semibold text-black">
              Next: Coach Dashboard
            </h3>

            <p className="mt-1 max-w-[520px] text-[15px] leading-7 text-[#6E728C]">
              Your coach profile is ready. Continue to your dashboard to manage
              your profile, availability, and future clients.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CoachSummaryStep;
