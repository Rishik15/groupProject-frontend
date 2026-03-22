import SelectCardGroup from "../SelectCardGroup";

import {
  clientGoalOptions,
} from "../../../utils/OnboardingSurvey/clientConfig";

interface ClientGoalsStepProps {
  selectedGoals: string[];
  onChange: (values: string[]) => void;
}

/**
 * First client step.
 * Lets the user pick one or more fitness goals.
 */
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
