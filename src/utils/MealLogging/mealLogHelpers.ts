import {
    getLocalTimeZone,
    Time,
    toCalendarDateTime,
} from "@internationalized/date";
import type {
    CreateMealLogPayload,
    FoodItemDraft,
    FoodItemSuggestion,
    MealLogFormValues,
    MealTotals,
} from "../Interfaces/MealLogging/mealLog";

export const createEmptyFoodItemDraft = (): FoodItemDraft => ({
    clientId: crypto.randomUUID(),
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    imageUrl: "",
    imageFile: null,
    imagePreviewUrl: "",
    isCustom: true,
});

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
    imageFile: null,
    imagePreviewUrl: item.image_url ?? "",
    isCustom: false,
});

export const parseNutritionValue = (value: string): number => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
};

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

    if (!values.eatenOn) {
        return "Please select the meal date.";
    }

    if (!values.eatenTime) {
        return "Please select the meal time.";
    }

    const servings = Number(values.servings);
    if (!Number.isFinite(servings) || servings <= 0) {
        return "Servings must be greater than 0.";
    }

    return null;
};

const buildEatenAtIso = (values: MealLogFormValues): string => {
    if (!values.eatenOn || !values.eatenTime) {
        return new Date().toISOString();
    }

    const time = new Time(
        values.eatenTime.hour,
        values.eatenTime.minute,
        values.eatenTime.second ?? 0,
    );

    const calendarDateTime = toCalendarDateTime(values.eatenOn, time);

    return calendarDateTime.toDate(getLocalTimeZone()).toISOString();
};

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
            eaten_at: buildEatenAtIso(values),
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

            // Same open question as the meal photo:
            // local upload can preview in the UI, but without a real upload endpoint
            // this still needs to fall back to url text or a placeholder on submit.
            image_url: item.imageUrl.trim(),
            is_custom: item.isCustom,
        })),
    };
};