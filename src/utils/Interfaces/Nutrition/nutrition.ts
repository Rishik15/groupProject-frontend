export interface LoggedMeal {
  log_id: number;
  user_id?: number;
  meal_id?: number | null;
  food_item_id?: number | null;
  eaten_at: string;
  servings: number;
  notes?: string | null;
  photo_url?: string | null;
  created_at?: string;
  updated_at?: string;
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface NutritionMacroSummary {
  current: number;
  goal: number | null;
}

export interface NutritionCaloriesSummary {
  current: number;
  goal: number | null;
}

export interface TodayNutritionSummary {
  meals: LoggedMeal[];
  calories: NutritionCaloriesSummary;
  macros: {
    protein: NutritionMacroSummary;
    carbs: NutritionMacroSummary;
    fats: NutritionMacroSummary;
  };
}
