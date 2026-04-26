import { useEffect, useState } from "react";
import CalorieCount from "./Today/CalorieCount";
import Macros from "./Today/Macros";
import MealsToday from "./Today/MealsToday";
import WeeklyCalories from "./Week/WeeklyCalories";
import type { TodayNutritionSummary } from "../../utils/Interfaces/Nutrition/nutrition";
import { getTodayNutritionSummary } from "../../services/Nutrition/nutritionDashboardService";
import MealPlan from "./MealPlan/MealPlan";
import CreateMealPlan from "../NutritionPage/MealPlan/CreateMealPlan";
import AssignedPlans from "./MealPlan/AssignedPlans";

type MainTab = "today" | "week" | "plans" | "food";
type PlansSubTab = "meal-plans" | "assigned-plans" | "create-plan";

const tabStyle = (active: boolean) => ({
  padding: "10px 16px",
  fontSize: "14px",
  fontWeight: 500,
  color: active ? "#5B5EF4" : "#72728A",
  background: "none",
  border: "none",
  borderBottom: active ? "2px solid #5B5EF4" : "2px solid transparent",
  cursor: "pointer",
  transition: "color 0.15s",
});

const subTabStyle = (active: boolean) => ({
  padding: "6px 14px",
  fontSize: "13px",
  fontWeight: 500,
  color: active ? "#5B5EF4" : "#72728A",
  background: active ? "rgba(91,94,244,0.08)" : "var(--color-background-secondary)",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  transition: "all 0.15s",
});

const NutritionTabs = () => {
  const [summary, setSummary] = useState<TodayNutritionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<MainTab>("today");
  const [activeSubTab, setActiveSubTab] = useState<PlansSubTab>("meal-plans");

  useEffect(() => {
    const fetchTodayNutrition = async () => {
      try {
        const data = await getTodayNutritionSummary();
        setSummary(data);
      } catch (error) {
        console.error("Failed to load today nutrition summary", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodayNutrition();
  }, []);

  const calorieCurrent = summary?.calories.current ?? 0;
  const calorieGoal = summary?.calories.goal ?? 2000;
  const protein = summary?.macros.protein ?? { current: 0, goal: 150 };
  const carbs = summary?.macros.carbs ?? { current: 0, goal: 200 };
  const fats = summary?.macros.fats ?? { current: 0, goal: 65 };
  const todayMeals = summary?.meals ?? [];

  return (
    <div className="mx-auto flex w-full flex-col gap-4 py-4">

      
      <div style={{ borderBottom: "0.5px solid var(--color-border-tertiary)" }}>
        <div style={{ display: "flex" }}>
          <button style={tabStyle(activeTab === "today")} onClick={() => setActiveTab("today")}>Today</button>
          <button style={tabStyle(activeTab === "week")} onClick={() => setActiveTab("week")}>This Week</button>
          <button style={tabStyle(activeTab === "plans")} onClick={() => setActiveTab("plans")}>Plans</button>
          <button style={tabStyle(activeTab === "food")} onClick={() => setActiveTab("food")}>Food</button>
        </div>
      </div>

     
      {activeTab === "plans" && (
        <div style={{ display: "flex", gap: "8px", paddingLeft: "4px" }}>
          <button style={subTabStyle(activeSubTab === "meal-plans")} onClick={() => setActiveSubTab("meal-plans")}>Meal Plans</button>
          <button style={subTabStyle(activeSubTab === "assigned-plans")} onClick={() => setActiveSubTab("assigned-plans")}>Assigned Plans</button>
          <button style={subTabStyle(activeSubTab === "create-plan")} onClick={() => setActiveSubTab("create-plan")}>Create Plan</button>
        </div>
      )}

    
      {activeTab === "today" && (
        <div>
          <div className="flex w-full gap-6">
            <CalorieCount Current={calorieCurrent} Goal={calorieGoal} />
            <Macros protein={protein} carbs={carbs} fats={fats} />
          </div>
          <div className="mt-6">
            <MealsToday meals={todayMeals} isLoading={isLoading} />
          </div>
        </div>
      )}

      {activeTab === "week" && <WeeklyCalories />}

      {activeTab === "plans" && activeSubTab === "meal-plans" && (
        
        <MealPlan />
    
      )}


      {activeTab === "plans" && activeSubTab === "create-plan" &&  (
          <CreateMealPlan/>
      )}

      {activeTab === "food" && (
        <p className="text-sm text-gray-400">Food section coming soon.</p>
      )}

      {activeTab === "plans" && activeSubTab === "assigned-plans" && (
        <AssignedPlans />
)}
    </div>
  );
};

export default NutritionTabs;