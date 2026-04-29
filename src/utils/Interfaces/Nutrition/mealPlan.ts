export type DayOfWeek = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealPlanSummary = {
  meal_plan_id: number;
  plan_name: string;
  total_calories: number;
};

export type MealPlan = MealPlanSummary;

export type AssignedMealPlan = {
  meal_plan_id: number;
  plan_name: string;
  start_date: string;
  end_date: string;
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

export type MealLibraryItem = {
  meal_id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
};

export type MealPlanDetail = {
  meal_plan_id: number;
  plan_name: string;
  total_calories: number;
  meals: Meal[];
};

export type MealSlot = {
  day: DayOfWeek;
  meal_type: MealType;
  meal_id: number;
  meal_name: string;
  servings: number;
};

export type CreateMealPlanPayload = {
  plan_name: string;
  start_date: string;
  end_date: string;
  meals: {
    day_of_week: DayOfWeek;
    meal_type: MealType;
    meal_id: number;
    servings: number;
  }[];
};

export type UpdateMealPlanPayload = {
  meal_plan_id: number;
  plan_name?: string;
  add_meals?: {
    meal_id: number;
    day_of_week: DayOfWeek;
    meal_type: MealType;
    servings: number;
  }[];
  remove_meals?: {
    meal_id: number;
    day_of_week: DayOfWeek;
    meal_type: MealType;
  }[];
  update_servings?: {
    meal_id: number;
    day_of_week: DayOfWeek;
    meal_type: MealType;
    servings: number;
  }[];
};

export type AssignMealPlanPayload = {
  meal_plan_id: number;
  start_date: string;
  force?: boolean;
};

export const DAYS: { key: DayOfWeek; label: string }[] = [
  { key: "Mon", label: "Monday" },
  { key: "Tue", label: "Tuesday" },
  { key: "Wed", label: "Wednesday" },
  { key: "Thu", label: "Thursday" },
  { key: "Fri", label: "Friday" },
  { key: "Sat", label: "Saturday" },
  { key: "Sun", label: "Sunday" },
];

export const MEAL_TYPES: MealType[] = ["breakfast", "lunch", "dinner", "snack"];
