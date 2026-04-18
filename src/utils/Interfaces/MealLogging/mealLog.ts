<<<<<<< HEAD
import type { DateValue } from "@internationalized/date";
import type { TimeValue } from "@heroui/react";

export type MealType = "breakfast" | "lunch" | "snack" | "dinner";

export interface MealTotals {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface FoodItemSuggestion {
    food_item_id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    image_url?: string;
}

export interface FoodItemDraft {
    clientId: string;
    foodItemId?: number;
    name: string;
    calories: string;
    protein: string;
    carbs: string;
    fats: string;

    // Keep the backend-facing url field for now.
    imageUrl: string;

    // Local upload support for the UI, same idea as the meal photo.
    imageFile: File | null;
    imagePreviewUrl: string;

    isCustom: boolean;
}

export interface MealLogFormValues {
    mealType: MealType;
    mealName: string;
    foodItems: FoodItemDraft[];

    // Split date and time so HeroUI can manage each field cleanly.
    eatenOn: DateValue | null;
    eatenTime: TimeValue | null;

    servings: string;
    notes: string;
    photoFile: File | null;
    photoPreviewUrl: string;
}

export interface CreateMealLogPayload {
    meal_type: MealType;
    meal: {
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    meal_log: {
        eaten_at: string;
        servings: number;
        notes: string;
        photo_url: string;
    };
    food_items: Array<{
        food_item_id?: number;
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
        image_url: string;
        is_custom: boolean;
    }>;
=======
import type { DateValue } from "@internationalized/date";
import type { TimeValue } from "@heroui/react";

export type MealType = "breakfast" | "lunch" | "snack" | "dinner";

export interface MealTotals {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface FoodItemSuggestion {
    food_item_id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    image_url?: string;
}

export interface FoodItemDraft {
    clientId: string;
    foodItemId?: number;
    name: string;
    calories: string;
    protein: string;
    carbs: string;
    fats: string;

    imageUrl: string;

    // Still UI-only for now.
    imageFile: File | null;
    imagePreviewUrl: string;

    isCustom: boolean;
}

export interface MealLogFormValues {
    mealType: MealType;
    mealName: string;
    foodItems: FoodItemDraft[];
    eatenOn: DateValue | null;
    eatenTime: TimeValue | null;
    servings: string;
    notes: string;
    photoFile: File | null;
    photoPreviewUrl: string;
}

export interface CreateMealLogPayload {
    meal_type: MealType;
    meal: {
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
    };
    meal_log: {
        eaten_at: string;
        servings: number;
        notes: string;
    };
    food_items: Array<{
        food_item_id?: number;
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
        image_url: string;
        is_custom: boolean;
    }>;
>>>>>>> 22064e8ba5687c54f20c66bf425f607dd431124b
}