import { Button } from "@heroui/react";
import { Target } from "lucide-react";

interface NutritionGoalsButtonProps {
  onPress: () => void;
}

const NutritionGoalsButton = ({ onPress }: NutritionGoalsButtonProps) => {
  return (
    <Button
      className="h-8 rounded-xl border border-indigo-500 bg-indigo-500 px-2 text-[13.125px] font-semibold text-white shadow-sm hover:bg-indigo-600"
      onPress={onPress}
    >
      <Target className="h-4 w-4" />
      <span>Set Goals</span>
    </Button>
  );
};

export default NutritionGoalsButton;
