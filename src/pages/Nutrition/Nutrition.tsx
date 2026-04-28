import { useState } from "react";
import MealLoggingModal from "../../components/MealLoggingModal/Modal";
import NutritionHeader from "../../components/NutritionPage/NutritionHeader";
import NutritionTabs from "@/components/NutritionPage/Tabs";

const Nutrition = () => {
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshNutrition = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <section className="min-h-screen bg-[#F7F7FB]">
      <NutritionHeader onLogMeal={() => setIsMealModalOpen(true)} />

      <div className="px-36 py-6">
        <NutritionTabs refreshKey={refreshKey} />
      </div>

      <MealLoggingModal
        isOpen={isMealModalOpen}
        onOpenChange={setIsMealModalOpen}
        onSuccess={refreshNutrition}
      />
    </section>
  );
};

export default Nutrition;
