import type {
    CreateMealLogPayload,
    FoodItemDraft,
    FoodItemSuggestion,
    MealLogFormValues,
    MealTotals,
} from "../Interfaces/MealLogging/mealLog";

/**
 * Create an empty editable row for a brand new custom food item.
 */
export const createEmptyFoodItemDraft = (): FoodItemDraft => ({
    clientId: crypto.randomUUID(),
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    imageUrl: "",
    isCustom: true,
});

/**
 * Convert a saved backend food item into the local editable row shape.
 */
export const mapSuggestionToDraft = (
    item: FoodItemSuggestion,
): FoodItemDraft => ({
    clientId: crypto.randomUUID(),
    foodItemId: item.food_item_id,
    name: item.name,
    calories: String(item.calories),
    protein: String(item.protein),
    carbs: String(item.carbs),
    fats: String(item.fats),
    imageUrl: item.image_url ?? "",
    isCustom: false,
});

/**
 * Keep nutrition parsing forgiving for form input:
 * empty, invalid, or negative values are treated as 0.
 */
export const parseNutritionValue = (value: string): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

/**
 * Sum the nutrition values from every food item row to build the meal totals.
 */
export const calculateMealTotals = (foodItems: FoodItemDraft[]): MealTotals =>
    foodItems.reduce(
        (totals, item) => ({
            calories: totals.calories + parseNutritionValue(item.calories),
            protein: totals.protein + parseNutritionValue(item.protein),
            carbs: totals.carbs + parseNutritionValue(item.carbs),
            fats: totals.fats + parseNutritionValue(item.fats),
        }),
        {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
        },
    );

/**
 * Keep validation simple:
 * - meal needs a name
 * - at least one food item is required
 * - every food item needs a name
 * - eaten time is required
 * - servings must be greater than 0
 */
export const validateMealLogForm = (
    values: MealLogFormValues,
): string | null => {
    if (!values.mealName.trim()) {
        return "Please enter a meal name.";
    }

    if (values.foodItems.length === 0) {
        return "Please add at least one food item.";
    }

    const hasInvalidFoodItem = values.foodItems.some(
        (item) => item.name.trim().length === 0,
    );
    if (hasInvalidFoodItem) {
        return "Each food item needs a name.";
    }

    if (!values.eatenAt) {
        return "Please select when the meal was eaten.";
    }

    const servings = Number(values.servings);
    if (!Number.isFinite(servings) || servings <= 0) {
        return "Servings must be greater than 0.";
    }

    return null;
};

/**
 * Convert the modal form state into the payload shape used by the service layer.
 * The backend still resolves custom food items into real ids later in the service.
 */
export const buildMealLogPayload = (
    values: MealLogFormValues,
    photoUrl: string,
): CreateMealLogPayload => {
    const totals = calculateMealTotals(values.foodItems);

    return {
        meal_type: values.mealType,
        meal: {
            name: values.mealName.trim(),
            calories: totals.calories,
            protein: totals.protein,
            carbs: totals.carbs,
            fats: totals.fats,
        },
        meal_log: {
            eaten_at: new Date(values.eatenAt).toISOString(),
            servings: Number(values.servings),
            notes: values.notes.trim(),
            photo_url: photoUrl,
        },
        food_items: values.foodItems.map((item) => ({
            food_item_id: item.foodItemId,
            name: item.name.trim(),
            calories: parseNutritionValue(item.calories),
            protein: parseNutritionValue(item.protein),
            carbs: parseNutritionValue(item.carbs),
            fats: parseNutritionValue(item.fats),
            image_url: item.imageUrl.trim(),
            is_custom: item.isCustom,
        })),
    };
};