import { Card } from "@heroui/react";

const MealPlanCard = () => {

    return (
        <Card className="w-full border">
            <div className="flex flex-col h-full w-full justify-center bg-[#fafbff] rounded-xl">
                <p className="mx-auto text-[#707286] mb-2 font-extrabold text-xl">No Meal Plan Selected</p>
                <div>
                    <p className="mb-2 w-[50%] mx-auto text-[#707286] text-medium">Select a meal plan from the left to view its weekly breakdown, meals, and macros.</p>
                </div>
                <div className="mx-auto rounded-2xl bg-[#ede9ff] text-[14px] px-2 py-1 font-bold text-indigo-500">Start by clicking a plan</div>
            </div>

        </Card>
    );
}

export default MealPlanCard;