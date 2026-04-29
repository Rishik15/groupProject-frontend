import { Button } from "@heroui/react";
import { Check } from "lucide-react";

const WellnessComplete = () => {
  return (
    <Button
      isDisabled
      className="h-9 rounded-xl border border-emerald-200 bg-emerald-50 px-4 text-xs font-semibold text-emerald-700 opacity-100"
    >
      <Check className="h-4 w-4" />
      <span>Survey Complete</span>
    </Button>
  );
};

export default WellnessComplete;
