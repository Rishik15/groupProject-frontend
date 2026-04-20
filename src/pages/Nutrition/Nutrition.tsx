import { useState } from "react";
import MealLoggingModal from "../../components/MealLoggingModal/Modal";
import NutritionHeader from "../../components/NutritionPage/NutritionHeader";

const Nutrition = () => {
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);

    return (
        <section className="min-h-screen bg-[#F7F7FB]">
            <NutritionHeader onLogMeal={() => setIsMealModalOpen(true)} />

            <div className="px-8 py-6">
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6">
                    <p className="text-[13.125px] text-[#72728A]">
                        Meal history and macro summary can go here next.
                    </p>
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