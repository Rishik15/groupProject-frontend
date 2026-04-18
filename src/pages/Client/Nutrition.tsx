<<<<<<< HEAD
import { useState } from "react";
import MealLoggingModal from "../../components/MealLoggingModal/Modal";
import NutritionHeader from "../../components/NutritionPage/NutritionHeader";
import NutritionTabs from "../../components/NutritionPage/Tabs";

const Nutrition = () => {
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);

    return (
        <section className="bg-[#F7F7FB]">
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

=======
import { useState } from "react";
import MealLoggingModal from "../../components/MealLoggingModal/Modal";
import NutritionHeader from "../../components/NutritionPage/NutritionHeader";
import NutritionTabs from "../../components/NutritionPage/Tabs";

const Nutrition = () => {
    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [mealsRefreshKey, setMealsRefreshKey] = useState(0);

    return (
        <section className="bg-[#F7F7FB]">
            <NutritionHeader onLogMeal={() => setIsMealModalOpen(true)} />

            <div className="px-36 py-6">
                <div className="flex items-left">
                    <NutritionTabs key={mealsRefreshKey} />
                </div>
            </div>

            <MealLoggingModal
                isOpen={isMealModalOpen}
                onOpenChange={setIsMealModalOpen}
                onSuccess={() => {
                    setMealsRefreshKey((prev) => prev + 1);
                }}
            />
        </section>
    );
};

>>>>>>> 22064e8ba5687c54f20c66bf425f607dd431124b
export default Nutrition;