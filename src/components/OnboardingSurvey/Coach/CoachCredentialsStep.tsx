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

const MAX_CERTIFICATIONS = 10;
const MAX_CERT_NAME_LENGTH = 100;
const MAX_PROVIDER_NAME_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 300;
const MAX_BIO_LENGTH = 500;
const MAX_YEARS_EXPERIENCE = 80;

function CoachCredentialsStep({
  values,
  onFieldChange,
  onCertificationCountChange,
  onCertificationChange,
}: CoachCredentialsStepProps) {
  const bioCharacterCount = values.bio.length;

  const todayString = new Date().toISOString().split("T")[0];

  const getInputClass = (error: string, extraClasses = "") =>
    [
      "outline outline-2 -outline-offset-1",
      error ? "outline-red-400" : "outline-transparent",
      extraClasses,
    ].join(" ");

  const getShortTextError = (value: string, maxLength: number) => {
    if (value.length > maxLength) {
      return `Max ${maxLength} chars`;
    }

    return "";
  };

  const getCertificationCountError = () => {
    if (values.certificationCount > MAX_CERTIFICATIONS) {
      return `Max ${MAX_CERTIFICATIONS}`;
    }

    return "";
  };

  const getYearsExperienceError = () => {
    if (values.yearsExperience.trim() === "") {
      return "";
    }

    const parsedValue = Number(values.yearsExperience);

    if (!Number.isFinite(parsedValue)) {
      return "Invalid";
    }

    if (parsedValue < 0 || parsedValue > MAX_YEARS_EXPERIENCE) {
      return `0-${MAX_YEARS_EXPERIENCE} yrs`;
    }

    return "";
  };

  const getIssuedDateError = (issuedDate: string) => {
    if (!issuedDate) {
      return "";
    }

    if (issuedDate > todayString) {
      return "No future dates";
    }

    return "";
  };

  const getExpiresDateError = (issuedDate: string, expiresDate: string) => {
    if (!expiresDate) {
      return "";
    }

    if (issuedDate && expiresDate < issuedDate) {
      return "After issue date";
    }

    return "";
  };

  const handleCertificationCountInput = (value: string) => {
    if (value === "") {
      onCertificationCountChange(0);
      return;
    }

    if (!/^\d{0,2}$/.test(value)) {
      return;
    }

    const parsedValue = Number(value);

    if (
      Number.isFinite(parsedValue) &&
      parsedValue >= 0 &&
      parsedValue <= MAX_CERTIFICATIONS
    ) {
      onCertificationCountChange(parsedValue);
    }
  };

  const handleYearsExperienceInput = (value: string) => {
    if (value === "") {
      onFieldChange("yearsExperience", value);
      return;
    }

    if (!/^\d{0,2}(\.\d{0,1})?$/.test(value)) {
      return;
    }

    const parsedValue = Number(value);

    if (
      Number.isFinite(parsedValue) &&
      parsedValue >= 0 &&
      parsedValue <= MAX_YEARS_EXPERIENCE
    ) {
      onFieldChange("yearsExperience", value);
    }
  };

  const handleCertificationTextInput = (
    index: number,
    name: keyof CoachCertificationValues,
    value: string,
    maxLength: number,
  ) => {
    if (value.length <= maxLength) {
      onCertificationChange(index, name, value);
    }
  };

  const certificationCountError = getCertificationCountError();
  const yearsExperienceError = getYearsExperienceError();
  const bioError =
    values.bio.length > MAX_BIO_LENGTH ? `Max ${MAX_BIO_LENGTH} chars` : "";

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-[13.125px] font-semibold">
          Number of Certifications (optional)
        </label>

        <Input
          type="number"
          min={0}
          max={MAX_CERTIFICATIONS}
          value={String(values.certificationCount)}
          placeholder="0"
          aria-invalid={Boolean(certificationCountError)}
          onChange={(event) =>
            handleCertificationCountInput(event.target.value)
          }
          className={getInputClass(
            certificationCountError,
            "w-full h-[37.5px] text-[13.125px]",
          )}
        />

        <p className="mt-1 h-4 text-[11px] leading-4 text-red-500">
          {certificationCountError}
        </p>
      </div>

      {values.certifications.map((certification, index) => {
        const certNameError = getShortTextError(
          certification.cert_name,
          MAX_CERT_NAME_LENGTH,
        );
        const providerNameError = getShortTextError(
          certification.provider_name,
          MAX_PROVIDER_NAME_LENGTH,
        );
        const descriptionError = getShortTextError(
          certification.description,
          MAX_DESCRIPTION_LENGTH,
        );
        const issuedDateError = getIssuedDateError(certification.issued_date);
        const expiresDateError = getExpiresDateError(
          certification.issued_date,
          certification.expires_date,
        );

        return (
          <div
            key={index}
            className="space-y-4 rounded-[20px] border border-[#E4E4EC] bg-[#FAFAFD] p-5"
          >
            <h3 className="text-[13.125px] text-[#0F0F14] font-semibold">
              Certification {index + 1}
            </h3>

            <div>
              <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
                Certification Name
              </label>

              <Input
                value={certification.cert_name}
                placeholder="e.g., NASM CPT"
                maxLength={MAX_CERT_NAME_LENGTH}
                aria-invalid={Boolean(certNameError)}
                onChange={(event) =>
                  handleCertificationTextInput(
                    index,
                    "cert_name",
                    event.target.value,
                    MAX_CERT_NAME_LENGTH,
                  )
                }
                className={getInputClass(
                  certNameError,
                  "w-full h-[37.5px] text-[13.125px] text-gray-700",
                )}
              />

              <p className="h-2 text-[11px] leading-4 text-red-500">
                {certNameError}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
                Provider Name
              </label>

              <Input
                value={certification.provider_name}
                placeholder="e.g., National Academy of Sports Medicine"
                maxLength={MAX_PROVIDER_NAME_LENGTH}
                aria-invalid={Boolean(providerNameError)}
                onChange={(event) =>
                  handleCertificationTextInput(
                    index,
                    "provider_name",
                    event.target.value,
                    MAX_PROVIDER_NAME_LENGTH,
                  )
                }
                className={getInputClass(
                  providerNameError,
                  "w-full h-[37.5px] text-[13.125px] text-gray-700",
                )}
              />

              <p className="h-2 text-[11px] leading-4 text-red-500">
                {providerNameError}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
                Description
              </label>

              <TextArea
                value={certification.description}
                rows={4}
                maxLength={MAX_DESCRIPTION_LENGTH}
                placeholder="Briefly describe the certification or focus area..."
                aria-invalid={Boolean(descriptionError)}
                onChange={(event) =>
                  handleCertificationTextInput(
                    index,
                    "description",
                    event.target.value,
                    MAX_DESCRIPTION_LENGTH,
                  )
                }
                className={getInputClass(
                  descriptionError,
                  "w-full text-[13.125px] text-gray-700",
                )}
              />

              <p className="h-2 text-[11px] leading-4 text-red-500">
                {descriptionError}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
                  Issued Date
                </label>

                <Input
                  type="date"
                  value={certification.issued_date}
                  max={todayString}
                  aria-invalid={Boolean(issuedDateError)}
                  onChange={(event) =>
                    onCertificationChange(
                      index,
                      "issued_date",
                      event.target.value,
                    )
                  }
                  className={getInputClass(
                    issuedDateError,
                    "w-full h-[37.5px] text-[13.125px] text-gray-700",
                  )}
                />

                <p className="h-2 text-[11px] leading-4 text-red-500">
                  {issuedDateError}
                </p>
              </div>

              <div>
                <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
                  Expires Date
                </label>

                <Input
                  type="date"
                  value={certification.expires_date}
                  min={certification.issued_date || undefined}
                  aria-invalid={Boolean(expiresDateError)}
                  onChange={(event) =>
                    onCertificationChange(
                      index,
                      "expires_date",
                      event.target.value,
                    )
                  }
                  className={getInputClass(
                    expiresDateError,
                    "w-full h-[37.5px] text-[13.125px] text-gray-700",
                  )}
                />

                <p className="h-2 text-[11px] leading-4 text-red-500">
                  {expiresDateError}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div>
        <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
          Years of Coaching Experience
        </label>

        <Input
          type="number"
          min={0}
          max={MAX_YEARS_EXPERIENCE}
          step="0.1"
          value={values.yearsExperience}
          placeholder="e.g., 5"
          aria-invalid={Boolean(yearsExperienceError)}
          onChange={(event) => handleYearsExperienceInput(event.target.value)}
          className={getInputClass(
            yearsExperienceError,
            "w-full h-[37.5px] text-[13.125px] text-gray-700",
          )}
        />

        <p className="h-2 text-[11px] leading-4 text-red-500">
          {yearsExperienceError}
        </p>
      </div>

      <div>
        <label className="mb-2 block text-[13.125px] text-[#0F0F14] font-semibold">
          Coaching Bio (optional)
        </label>

        <TextArea
          value={values.bio}
          rows={7}
          maxLength={MAX_BIO_LENGTH}
          placeholder="Tell clients about your approach, philosophy, and what makes you unique..."
          aria-invalid={Boolean(bioError)}
          onChange={(event) => onFieldChange("bio", event.target.value)}
          className={getInputClass(
            bioError,
            "w-full text-[13.125px] text-gray-700",
          )}
        />

        <div className="mt-3 flex h-2 items-center justify-between">
          <p className="text-[11.25px] text-[#72728A]">
            {bioCharacterCount} / {MAX_BIO_LENGTH}
          </p>

          <p className="text-[11px] leading-4 text-red-500">{bioError}</p>
        </div>
      </div>
    </div>
  );
}

export default CoachCredentialsStep;
