import SelectCardGroup from "../SelectCardGroup";
import { coachPrimarySpecialtyOptions } from "../../../utils/OnboardingSurvey/coachSurvey";

interface CoachPrimarySpecialtiesStepProps {
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

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