import { Button } from "@heroui/react";
import type { MealType } from "../../utils/Interfaces/MealLogging/mealLog";

interface MealTypeSelectorProps {
    value: MealType;
    onChange: (value: MealType) => void;
}

const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "snack", "dinner"];

export default function MealTypeSelector({
    value,
    onChange,
}: MealTypeSelectorProps) {
    return (
        <div className="space-y-2">
            <p className="text-[13.125px] font-semibold text-[#0F0F14]">
                Meal Type
            </p>

            <div className="grid grid-cols-2 gap-3">
                {MEAL_TYPES.map((type) => {
                    const isSelected = value === type;

                    return (
                        <Button
                            key={type}
                            variant={isSelected ? "primary" : "outline"}
                            className={[
                                "h-[42px] w-full max-w-[212.75px] justify-start rounded-2xl text-[13.125px] capitalize",
                                isSelected
                                    ? "border-[#5E5EF4] bg-[#EEF0FF] text-[#5E5EF4]"
                                    : "border-default-200 bg-white text-[#72728A]",
                            ].join(" ")}
                            onPress={() => onChange(type)}
                        >
                            {type}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}