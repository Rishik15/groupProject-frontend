import { Button } from "@heroui/react";
import { Target } from "lucide-react";

interface NutritionGoalsButtonProps {
  onPress: () => void;
}

const NutritionGoalsButton = ({ onPress }: NutritionGoalsButtonProps) => {
  return (
    <Button
      className="h-[30px] min-w-[97px] rounded-xl border border-[#5E5EF4]/20 bg-indigo-50 px-3 text-[13.125px] font-medium text-[#5E5EF4]"
      onPress={onPress}
    >
      <Target className="h-4 w-4" />
      <span>Set Goals</span>
    </Button>
  );
};

export default NutritionGoalsButton;
