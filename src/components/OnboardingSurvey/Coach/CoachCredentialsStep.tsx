import { Input, TextArea } from "@heroui/react";

import type {
  CoachCertificationValues,
  CoachCredentialsValues,
} from "../../../utils/Interfaces/OnboardingSurvey/coach";

interface CoachCredentialsStepProps {
  values: CoachCredentialsValues;
  onFieldChange: (
    name: Extract<keyof CoachCredentialsValues, "yearsExperience" | "bio">,
    value: string,
  ) => void;
  onCertificationCountChange: (count: number) => void;
  onCertificationChange: (
    index: number,
    name: keyof CoachCertificationValues,
    value: string,
  ) => void;
}

function CoachCredentialsStep({
  values,
  onFieldChange,
  onCertificationCountChange,
  onCertificationChange,
}: CoachCredentialsStepProps) {
  const maxBioLength = 500;
  const bioCharacterCount = values.bio.length;

  const handleCertificationCountInput = (value: string) => {
    if (value === "") {
      onCertificationCountChange(0);
      return;
    }

    const parsedValue = Number(value);

    if (Number.isFinite(parsedValue) && parsedValue >= 0) {
      onCertificationCountChange(parsedValue);
    }
  };

  return (
    <div className="space-y-6" data-testid="coach-credentials-step">
      <div data-testid="certification-count-section">
        <label className="mb-2 block text-[13.125px] font-semibold">
          Number of Certifications (optional)
        </label>
        <Input
          data-testid="number-certifications"
          type="number"
          min={0}
          value={String(values.certificationCount)}
          placeholder="0"
          onChange={(event) =>
            handleCertificationCountInput(event.target.value)
          }
          className="w-full h-[37.5px] text-[13.125px]"
        />
      </div>

      {values.certifications.map((certification, index) => (
        <div
          key={index}
          data-testid={`certification-${index}`}
          className="space-y-4 rounded-[20px] border border-[#E4E4EC] bg-[#FAFAFD] p-5"
        >
          <h3
            data-testid={`certification-${index}-title`}
            className="text-[13.125px] text-[#0F0F14] font-semibold"
          >
            Certification {index + 1}
          </h3>

          <div data-testid={`certification-${index}-name-section`}>
            <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
              Certification Name
            </label>
            <Input
              data-testid={`certification-${index}-name`}
              value={certification.cert_name}
              placeholder="e.g., NASM CPT"
              onChange={(event) =>
                onCertificationChange(index, "cert_name", event.target.value)
              }
              className="w-full h-[37.5px] text-[13.125px] text-gray-700"
            />
          </div>

          <div data-testid={`certification-${index}-provider-section`}>
            <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
              Provider Name
            </label>
            <Input
              data-testid={`certification-${index}-provider`}
              value={certification.provider_name}
              placeholder="e.g., National Academy of Sports Medicine"
              onChange={(event) =>
                onCertificationChange(
                  index,
                  "provider_name",
                  event.target.value,
                )
              }
              className="w-full h-[37.5px] text-[13.125px] text-gray-700"
            />
          </div>

          <div data-testid={`certification-${index}-description-section`}>
            <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
              Description
            </label>
            <TextArea
              data-testid={`certification-${index}-description`}
              value={certification.description}
              rows={4}
              placeholder="Briefly describe the certification or focus area..."
              onChange={(event) =>
                onCertificationChange(index, "description", event.target.value)
              }
              className="w-full text-[13.125px] text-gray-700"
            />
          </div>

          <div
            data-testid={`certification-${index}-dates-section`}
            className="grid gap-4 sm:grid-cols-2"
          >
            <div data-testid={`certification-${index}-issued-section`}>
              <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
                Issued Date
              </label>
              <Input
                data-testid={`certification-${index}-issued-date`}
                type="date"
                value={certification.issued_date}
                onChange={(event) =>
                  onCertificationChange(
                    index,
                    "issued_date",
                    event.target.value,
                  )
                }
                className="w-full h-[37.5px] text-[13.125px] text-gray-700"
              />
            </div>

            <div data-testid={`certification-${index}-expires-section`}>
              <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
                Expires Date
              </label>
              <Input
                data-testid={`certification-${index}-expires-date`}
                type="date"
                value={certification.expires_date}
                onChange={(event) =>
                  onCertificationChange(
                    index,
                    "expires_date",
                    event.target.value,
                  )
                }
                className="w-full h-[37.5px] text-[13.125px] text-gray-700"
              />
            </div>
          </div>
        </div>
      ))}

      <div data-testid="years-experience-section">
        <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
          Years of Coaching Experience
        </label>
        <Input
          data-testid="years-experience"
          type="number"
          min={0}
          value={values.yearsExperience}
          placeholder="e.g., 5"
          onChange={(event) =>
            onFieldChange("yearsExperience", event.target.value)
          }
          className="w-full h-[37.5px] text-[13.125px] text-gray-700"
        />
      </div>

      <div data-testid="bio-section">
        <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
          Coaching Bio (optional)
        </label>
        <TextArea
          data-testid="bio"
          value={values.bio}
          rows={7}
          maxLength={maxBioLength}
          placeholder="Tell clients about your approach, philosophy, and what makes you unique..."
          onChange={(event) => onFieldChange("bio", event.target.value)}
          className="w-full text-[13.125px] text-gray-700"
        />
        <p
          data-testid="bio-character-count"
          className="mt-3 text-[11.25px] text-[#72728A]"
        >
          {bioCharacterCount} / {maxBioLength}
        </p>
      </div>
    </div>
  );
}

export default CoachCredentialsStep;