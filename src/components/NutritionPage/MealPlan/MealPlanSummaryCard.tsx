import { Card } from "@heroui/react";
import type { MealPlan } from "./type";

type Prop = {
    meal_plan: MealPlan
}

const MealPlanSummaryCard = ({ meal_plan }: Prop) => {
    return (
        <Card
            className="
    w-95
    border border-indigo-200
    transition-all duration-200 ease-out
    hover:-translate-y-1
    hover:shadow-md
    hover:border-indigo-400
    bg-white
    cursor-pointer

  "
        >
            <Card.Header className="p-2">
                <div className="flex flex-row gap-5">
                    <p className="my-auto font-extrabold">
                        {meal_plan.plan_name.split(" - ")[0]}
                    </p>

                    <div className="ml-auto w-fit rounded-2xl px-2 py-1 bg-[#ede9ff] font-bold text-indigo-500">
                        {meal_plan.total_calories} kcal
                    </div>
                </div>
            </Card.Header>
        </Card>
    );
}

export default MealPlanSummaryCard;