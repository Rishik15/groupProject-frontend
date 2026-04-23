import { useState } from "react";
import MealLoggingModal from "../../components/MealLoggingModal/Modal";
import NutritionHeader from "../../components/NutritionPage/NutritionHeader";
import NutritionTabs from "../../components/NutritionPage/Tabs";
import ViewMeals from "../../components/Nutrition/ViewMeals";

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
      <div>
        <ViewMeals></ViewMeals>
      </div>
    </section>
  );
};

export default Nutrition;
