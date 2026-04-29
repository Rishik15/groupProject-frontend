import { Button } from "@heroui/react";
import { BookCheck } from "lucide-react";

type WellnessButtonProps = {
  onPress: () => void;
};

const WellnessButton = ({ onPress }: WellnessButtonProps) => {
  return (
    <Button
      type="button"
      onPress={onPress}
      className="h-8 rounded-xl border border-[#5B5EF4]/15 bg-[#5B5EF4] px-4 text-xs font-semibold text-white shadow-sm shadow-indigo-100 hover:bg-[#4A4DE8]"
    >
      <BookCheck className="h-4 w-4" />
      <span>Daily Survey</span>
    </Button>
  );
};

export default WellnessButton;
