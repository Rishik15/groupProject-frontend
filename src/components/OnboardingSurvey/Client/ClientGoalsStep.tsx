import SelectCardGroup from "../SelectCardGroup";
import { clientGoalOptions } from "../../../utils/OnboardingSurvey/clientSurvey";

interface ClientGoalsStepProps {
  selectedGoals: string[];
  onChange: (values: string[]) => void;
}

function ClientGoalsStep({
  selectedGoals,
  onChange,
}: ClientGoalsStepProps) {
  return (
    <SelectCardGroup
      options={clientGoalOptions}
      selectedValues={selectedGoals}
      onChange={onChange}
    />
  );
}

export default ClientGoalsStep;