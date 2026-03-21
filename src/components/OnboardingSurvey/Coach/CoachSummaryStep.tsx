import { Card, Chip } from "@heroui/react";
import {
  coachClientTypeLabelMap,
  coachDayLabelMap,
  coachDaysOfWeek,
  coachSessionFormatLabelMap,
  coachSpecialtyLabelMap,
  formatAvailabilityRange,
  type CoachAvailabilityBlock,
  type CoachCertificationValues,
} from "../../../utils/OnboardingSurvey/coachSurvey";

interface CoachSummaryStepProps {
  primarySpecialties: string[];
  secondarySpecialties: string[];
  clientTypes: string[];
  availability: CoachAvailabilityBlock[];
  sessionFormats: string[];
  price: string;
  yearsExperience: string;
  bio: string;
  certifications: CoachCertificationValues[];
  profileDescription: string;
}

const summaryCardClassName =
  "rounded-[20px] border border-[#E4E4EC] bg-[#FAFAFD] px-6 py-6 shadow-none";

const primaryChipClassName =
  "bg-[#E8E8FF] text-[14px] font-medium text-[#5B5EF4]";

const neutralChipClassName =
  "border border-[#E4E4EC] bg-white text-[14px] font-medium text-[#6E728C]";

interface SummaryChipListProps {
  values: string[];
  labelMap: Record<string, string>;
  emptyMessage: string;
  chipClassName: string;
}

function SummaryChipList({
  values,
  labelMap,
  emptyMessage,
  chipClassName,
}: SummaryChipListProps) {
  if (values.length === 0) {
    return <p className="text-[14px] text-[#6E728C]">{emptyMessage}</p>;
  }

  return (
    <>
      {values.map((value) => (
        <Chip key={value} className={chipClassName}>
          {labelMap[value] ?? value}
        </Chip>
      ))}
    </>
  );
}

function CoachSummaryStep({
  primarySpecialties,
  secondarySpecialties,
  clientTypes,
  availability,
  sessionFormats,
  price,
  yearsExperience,
  bio,
  certifications,
  profileDescription,
}: CoachSummaryStepProps) {
  // Group availability by day so the summary is easier to scan than one long list.
  const availabilityByDay = coachDaysOfWeek
    .map((dayOfWeek) => ({
      dayOfWeek,
      blocks: availability
        .filter((block) => block.dayOfWeek === dayOfWeek)
        .sort((left, right) => left.startTime.localeCompare(right.startTime)),
    }))
    .filter((entry) => entry.blocks.length > 0);

  return (
    <div className="space-y-5">
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
              {primarySpecialties.length === 1 ? "specialty" : "specialties"} selected
            </p>

            <div className="mt-3 flex flex-wrap gap-4 text-[14px] text-[#6E728C]">
              <span>
                <span className="font-medium text-black">Experience:</span>{" "}
                {yearsExperience || "—"} {yearsExperience ? "years" : ""}
              </span>
              <span>
                <span className="font-medium text-black">Certifications:</span>{" "}
                {certifications.length}
              </span>
              <span>
                <span className="font-medium text-black">Weekly blocks:</span>{" "}
                {availability.length}
              </span>
              <span>
                <span className="font-medium text-black">Price:</span>{" "}
                {price.trim() || "—"}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className={summaryCardClassName}>
        <h3 className="text-[17px] font-semibold text-black">Primary Specialties</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <SummaryChipList
            values={primarySpecialties}
            labelMap={coachSpecialtyLabelMap}
            emptyMessage="No primary specialties selected"
            chipClassName={primaryChipClassName}
          />
        </div>
      </Card>

      <Card className={summaryCardClassName}>
        <h3 className="text-[17px] font-semibold text-black">Secondary Specialties</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <SummaryChipList
            values={secondarySpecialties}
            labelMap={coachSpecialtyLabelMap}
            emptyMessage="No secondary specialties selected"
            chipClassName={neutralChipClassName}
          />
        </div>
      </Card>

      <Card className={summaryCardClassName}>
        <h3 className="text-[17px] font-semibold text-black">Coaching Preferences</h3>

        <div className="mt-5 space-y-5">
          <div>
            <p className="text-[14px] font-medium text-black">Who You Coach</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <SummaryChipList
                values={clientTypes}
                labelMap={coachClientTypeLabelMap}
                emptyMessage="No client types selected"
                chipClassName={neutralChipClassName}
              />
            </div>
          </div>

          <div>
            <p className="text-[14px] font-medium text-black">Session Formats</p>
            <div className="mt-3 flex flex-wrap gap-3">
              <SummaryChipList
                values={sessionFormats}
                labelMap={coachSessionFormatLabelMap}
                emptyMessage="No session formats selected"
                chipClassName={neutralChipClassName}
              />
            </div>
          </div>

          <div>
            <p className="text-[14px] font-medium text-black">Coaching Price</p>
            <p className="mt-2 text-[14px] text-[#6E728C]">
              {price.trim() || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-[14px] font-medium text-black">Weekly Availability</p>
            <div className="mt-3 space-y-3">
              {availabilityByDay.length > 0 ? (
                availabilityByDay.map(({ dayOfWeek, blocks }) => (
                  <div
                    key={dayOfWeek}
                    className="rounded-[16px] border border-[#E4E4EC] bg-white p-4"
                  >
                    <p className="text-[15px] font-semibold text-black">
                      {coachDayLabelMap[dayOfWeek]}
                    </p>
                    <div className="mt-2 space-y-2">
                      {blocks.map((block) => (
                        <p key={block.id} className="text-[14px] text-[#6E728C]">
                          {formatAvailabilityRange(block)}
                        </p>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[14px] text-[#6E728C]">No weekly availability added</p>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card className={summaryCardClassName}>
        <h3 className="text-[17px] font-semibold text-black">Coaching Experience</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-[16px] border border-[#E4E4EC] bg-white p-4">
            <p className="text-[13px] font-medium uppercase tracking-wide text-[#6E728C]">
              Years of Experience
            </p>
            <p className="mt-2 text-[16px] font-semibold text-black">
              {yearsExperience.trim() || "Not provided"}
            </p>
          </div>

          <div className="rounded-[16px] border border-[#E4E4EC] bg-white p-4">
            <p className="text-[13px] font-medium uppercase tracking-wide text-[#6E728C]">
              Coaching Bio
            </p>
            <p className="mt-2 text-[14px] leading-7 text-[#6E728C]">
              {bio.trim() || "No coaching bio provided"}
            </p>
          </div>
        </div>
      </Card>

      <Card className={summaryCardClassName}>
        <h3 className="text-[17px] font-semibold text-black">Profile Description Preview</h3>
        <p className="mt-4 whitespace-pre-wrap rounded-[16px] border border-[#E4E4EC] bg-white p-4 text-[14px] leading-7 text-[#6E728C]">
          {profileDescription}
        </p>
      </Card>

      <Card className={summaryCardClassName}>
        <h3 className="text-[17px] font-semibold text-black">Certifications</h3>
        <div className="mt-4 space-y-4">
          {certifications.length > 0 ? (
            certifications.map((certification, index) => (
              <div
                key={`${certification.cert_name}-${index}`}
                className="rounded-[16px] border border-[#E4E4EC] bg-white p-4"
              >
                <p className="text-[15px] font-semibold text-black">
                  {certification.cert_name || `Certification ${index + 1}`}
                </p>
                <p className="mt-1 text-[14px] text-[#6E728C]">
                  {certification.provider_name || "No provider listed"}
                </p>
                <p className="mt-2 text-[14px] text-[#6E728C]">
                  {certification.description || "No description provided"}
                </p>
                <div className="mt-3 flex flex-wrap gap-4 text-[13px] text-[#6E728C]">
                  <span>Issued: {certification.issued_date || "—"}</span>
                  <span>Expires: {certification.expires_date || "—"}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[14px] text-[#6E728C]">No certifications provided</p>
          )}
        </div>
      </Card>

      <Card className={summaryCardClassName}>
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center text-[18px] text-[#6E728C]">
            ⛓
          </div>

          <div>
            <h3 className="text-[18px] font-semibold text-black">
              Next: Personal Profile
            </h3>

            <p className="mt-1 max-w-[520px] text-[15px] leading-7 text-[#6E728C]">
              Your coaching details are saved. Continue to your personal profile
              so we can collect the shared information needed for onboarding.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CoachSummaryStep;
