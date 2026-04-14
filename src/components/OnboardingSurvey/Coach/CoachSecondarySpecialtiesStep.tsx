import type { SelectCardOption } from "../../../utils/Interfaces/OnboardingSurvey/selectCard";
import SelectCardGroup from "../SelectCardGroup";

interface CoachSecondarySpecialtiesStepProps {
  options: SelectCardOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

/**
 * Secondary specialties exclude anything already chosen as a primary specialty.
 * The page decides which options are available and passes them in here.
 */
function CoachSecondarySpecialtiesStep({
  options,
  selectedValues,
  onChange,
}: CoachSecondarySpecialtiesStepProps) {
  return (
    <SelectCardGroup
      options={options}
      selectedValues={selectedValues}
      onChange={onChange}
    />
  );
}

export default CoachSecondarySpecialtiesStep;
