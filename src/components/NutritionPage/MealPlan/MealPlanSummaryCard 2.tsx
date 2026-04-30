import { Card } from "@heroui/react";
import type { MealPlan } from "./type";

type Prop = {
    meal_plan: MealPlan;
    onSelectPlan: (plan: MealPlan) => void;
};

const MealPlanSummaryCard = ({ meal_plan, onSelectPlan }: Prop) => {
    return (
        <Card
            onClick={() => onSelectPlan(meal_plan)}
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
            <Card.Header className="p-5">
                <div className="flex flex-row gap-5">
                    <p className="my-auto font-extrabold">
                        {meal_plan.plan_name.split(' - ')[0]}
                    </p>

                    <div className="ml-auto w-fit rounded-2xl bg-[#ede9ff] px-2 py-1 font-bold text-indigo-500">
                        {meal_plan.total_calories} kcal
                    </div>
                </div>
            </Card.Header>
        </Card>
    );
};

export default MealPlanSummaryCard;