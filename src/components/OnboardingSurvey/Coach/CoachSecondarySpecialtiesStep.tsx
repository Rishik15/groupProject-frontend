import SelectCardGroup, { type SelectCardOption } from "../SelectCardGroup";

interface CoachSecondarySpecialtiesStepProps {
  options: SelectCardOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

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