import { Card } from "@heroui/react";
import type { MealTotals } from "../../../utils/Interfaces/MealLogging/mealLog";

interface SummaryCardProps {
    totals: MealTotals;
}

export default function SummaryCard({ totals }: SummaryCardProps) {
    return (
        <Card className="rounded-2xl bg-[#F7F7FB]">
            <div className="space-y-3 p-4">
                <p className="text-[18.75px] font-semibold text-[#0F0F14]">
                    Meal Summary
                </p>

                {/* These values are derived from the current food item rows. */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-[11.25px] uppercase tracking-wide text-[#72728A]">
                            Calories
                        </p>
                        <p className="text-[18.75px] font-semibold text-[#5E5EF4]">
                            {totals.calories}
                        </p>
                    </div>

                    <div>
                        <p className="text-[11.25px] uppercase tracking-wide text-[#72728A]">
                            Protein
                        </p>
                        <p className="text-[18.75px] font-semibold text-[#5E5EF4]">
                            {totals.protein} g
                        </p>
                    </div>

                    <div>
                        <p className="text-[11.25px] uppercase tracking-wide text-[#72728A]">
                            Carbs
                        </p>
                        <p className="text-[18.75px] font-semibold text-[#5E5EF4]">
                            {totals.carbs} g
                        </p>
                    </div>

                    <div>
                        <p className="text-[11.25px] uppercase tracking-wide text-[#72728A]">
                            Fats
                        </p>
                        <p className="text-[18.75px] font-semibold text-[#5E5EF4]">
                            {totals.fats} g
                        </p>
                    </div>
                </div>
            </div>
        </Card>
    );
}