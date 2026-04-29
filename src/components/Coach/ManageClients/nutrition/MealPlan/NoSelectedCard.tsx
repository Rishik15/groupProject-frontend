import { Card } from "@heroui/react";
import { Utensils } from "lucide-react";

const NoSelectedCard = () => {
  return (
    <Card className="flex h-[560px] w-full items-center justify-center border border-[#E6E6EE] bg-[#FAFAFF] p-6 shadow-sm">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EDEBFF] text-[18px]">
          <Utensils className="h-4 w-4 text-[#5E5EF4]" />
        </div>

        <p className="text-[18px] font-bold text-[#202033]">
          No Meal Plan Selected
        </p>

        <p className="mx-auto mt-2 max-w-sm text-[14px] leading-6 text-[#72728A]">
          Select a meal plan from the left to view the weekly breakdown, meals,
          and macros.
        </p>

        <div className="mx-auto mt-3 w-fit rounded-full bg-[#EDEBFF] px-3 py-1 text-[12px] font-semibold text-[#5E5EF4]">
          Start by clicking a plan
        </div>
      </div>
    </Card>
  );
};

export default NoSelectedCard;
