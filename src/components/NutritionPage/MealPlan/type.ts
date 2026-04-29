export type MealPlan = {
  meal_plan_id: number;
  plan_name: string;
  total_calories: number;
};

export type Meal = {
  meal_id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  meal_type: MealType;
  day_of_week: DayOfWeek;
  servings: number;
};

export type MealPlanDetail = {
  meal_plan_id: number;
  plan_name: string;
  total_calories: number;
  meals: Meal[];
};

export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";
