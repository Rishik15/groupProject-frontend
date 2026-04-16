import SelectCardGroup from "../SelectCardGroup";

import { coachPrimarySpecialtyOptions } from "../../../utils/OnboardingSurvey/coachConfig";

interface CoachPrimarySpecialtiesStepProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

/**
 * Step 1 for the coach flow.
 * Lets the coach choose their main specialties.
 */
function CoachPrimarySpecialtiesStep({
  selectedValues,
  onChange,
}: CoachPrimarySpecialtiesStepProps) {
  return (
    <SelectCardGroup
      options={coachPrimarySpecialtyOptions}
      selectedValues={selectedValues}
      onChange={onChange}
      maxSelections={3}
    />
  );
}

export default CoachPrimarySpecialtiesStep;
