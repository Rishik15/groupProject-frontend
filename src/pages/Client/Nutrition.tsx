import { useState } from "react";
import MealLoggingModal from "../../components/MealLoggingModal/Modal";
import NutritionHeader from "../../components/NutritionPage/NutritionHeader";
import NutritionTabs from "../../components/NutritionPage/Tabs";

const Nutrition = () => {
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);

    return (
        <section className="min-h-screen bg-[#F7F7FB]">
            <NutritionHeader onLogMeal={() => setIsMealModalOpen(true)} />

            <div className="px-36 py-6">
                <div className="flex items-left">
                    <NutritionTabs />
                </div>
            </div>

            <MealLoggingModal
                isOpen={isMealModalOpen}
                onOpenChange={setIsMealModalOpen}
                onSuccess={() => {
                    console.log("Meal logged successfully");
                }}
            />
        </section>
    );
};

export default Nutrition;