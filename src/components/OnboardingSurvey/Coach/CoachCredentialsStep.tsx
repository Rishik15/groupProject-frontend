import type { ChangeEvent } from "react";
import { Input, TextArea } from "@heroui/react";

import type { CoachCredentialsValues } from "../../../utils/OnboardingSurvey/coachSurvey";

interface CoachCredentialsStepProps {
  values: CoachCredentialsValues;
  onChange: (name: keyof CoachCredentialsValues, value: string) => void;
}

/**
 * Coach credentials form.
 * This step keeps the HeroUI field markup local to the component,
 * while the shared value shape stays in the survey utils file.
 */
function CoachCredentialsStep({
  values,
  onChange,
}: CoachCredentialsStepProps) {
  const maxBioLength = 500;
  const bioCharacterCount = values.bio.length;

  /**
   * Years of experience should stay non-negative.
   * Allow an empty string too so the user can still clear the field.
   */
  const handleYearsExperienceChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;

    if (value === "" || Number(value) >= 0) {
      onChange("yearsExperience", value);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="mb-2 block text-[15px] font-semibold">
          Certifications (optional)
        </label>
        <Input
          value={values.certifications}
          placeholder="e.g., ACE, NASM, ISSA, CSCS"
          onChange={(event) =>
            onChange("certifications", event.target.value)
          }
          className="w-full"
        />
      </div>

      <div>
        <label className="mb-2 block text-[15px] font-semibold">
          Years of Coaching Experience
        </label>
        <Input
          type="number"
          value={values.yearsExperience}
          placeholder="e.g., 5"
          min={0}
          onChange={handleYearsExperienceChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="mb-2 block text-[15px] font-semibold">
          Coaching Bio (optional)
        </label>
        <TextArea
          value={values.bio}
          rows={7}
          maxLength={maxBioLength}
          placeholder="Tell clients about your approach, philosophy, and what makes you unique..."
          onChange={(event) => onChange("bio", event.target.value)}
          className="w-full"
        />
        <p className="mt-3 text-[14px] text-zinc-500">
          {bioCharacterCount} / {maxBioLength}
        </p>
      </div>
    </div>
  );
}

export default CoachCredentialsStep;
