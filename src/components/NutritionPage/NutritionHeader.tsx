import { useState } from "react";
import LogMealButton from "./LogMealButton";
import NutritionGoalsButton from "./NutritionGoalsButton";
import NutritionGoalsModal from "./NutritionGoalsModal";

interface NutritionHeaderProps {
  onLogMeal: () => void;
}

const NutritionHeader = ({ onLogMeal }: NutritionHeaderProps) => {
  const [isGoalsOpen, setIsGoalsOpen] = useState(false);

  return (
    <>
      <div className="py-4 px-36 border-b border-neutral-200 bg-white">
        <div className="flex h-full items-center justify-between">
          <div>
            <h1 className="text-[18.75px] font-semibold leading-none text-[#0F0F14]">
              Nutrition
            </h1>
            <p className="mt-2 text-[13.125px] leading-none text-[#72728A]">
              Track meals and macros
            </p>
          </div>

          <div className="flex items-center gap-3">
            <NutritionGoalsButton onPress={() => setIsGoalsOpen(true)} />
            <LogMealButton onPress={onLogMeal} />
          </div>
        </div>
      </div>

      <NutritionGoalsModal isOpen={isGoalsOpen} onOpenChange={setIsGoalsOpen} />
    </>
  );
};

export default NutritionHeader;
