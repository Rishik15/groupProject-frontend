import axios from "axios";
import type {
    CreateMealLogPayload,
    FoodItemSuggestion,
} from "../../utils/Interfaces/MealLogging/mealLog";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const DEFAULT_FOOD_IMAGE_URL =
    "https://placehold.co/400x300/png?text=Food+Item";

const DEFAULT_MEAL_PHOTO_URL =
    "https://placehold.co/600x400/png?text=Meal+Photo";

const nutritionApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export interface CreateFoodItemInput {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    image_url?: string;
}

// Convert raw backend values into the shape the frontend uses everywhere else.
const normalizeFoodItem = (item: any): FoodItemSuggestion => ({
    food_item_id: Number(item.food_item_id),
    name: String(item.name ?? ""),
    calories: Number(item.calories ?? 0),
    protein: Number(item.protein ?? 0),
    carbs: Number(item.carbs ?? 0),
    fats: Number(item.fats ?? 0),
    image_url: item.image_url ?? "",
});

/**
 * Get all saved food items for the currently logged-in user.
 */
export const getFoodItems = async (): Promise<FoodItemSuggestion[]> => {
    const response = await nutritionApi.get("/nutrition/getFoodItems");

    const items = Array.isArray(response.data?.foodItemsList)
        ? response.data.foodItemsList
        : [];

    return items.map(normalizeFoodItem);
};

/**
 * Create a new custom food item before it is used in a meal log.
 */
export const createFoodItem = async (payload: CreateFoodItemInput) => {
    const response = await nutritionApi.post("/nutrition/createFoodItem", {
        name: payload.name.trim(),
        calories: payload.calories,
        protein: payload.protein,
        carbs: payload.carbs,
        fats: payload.fats,
        image_url: payload.image_url?.trim() || DEFAULT_FOOD_IMAGE_URL,
    });

    return response.data;
};

// Match by name after trimming/lowercasing so small casing differences do not matter.
const findFoodItemByName = (
    items: FoodItemSuggestion[],
    name: string,
): FoodItemSuggestion | undefined => {
    const normalizedName = name.trim().toLowerCase();

    return items.find(
        (item) => item.name.trim().toLowerCase() === normalizedName,
    );
};

/**
 * Saved food items already have an id.
 * Custom food items need to be created first so the backend can receive ids only.
 */
const resolveFoodItemId = async (
    item: {
        foodItemId?: number;
        name: string;
        calories: number;
        protein: number;
        carbs: number;
        fats: number;
        image_url?: string;
    },
    existingItems: FoodItemSuggestion[],
): Promise<number> => {
    if (item.foodItemId) {
        return item.foodItemId;
    }

    const existingMatch = findFoodItemByName(existingItems, item.name);
    if (existingMatch) {
        return existingMatch.food_item_id;
    }

    await createFoodItem({
        name: item.name,
        calories: item.calories,
        protein: item.protein,
        carbs: item.carbs,
        fats: item.fats,
        image_url: item.image_url,
    });

    const refreshedItems = await getFoodItems();
    const createdMatch = findFoodItemByName(refreshedItems, item.name);

    if (!createdMatch) {
        throw new Error("Food item was created but could not be found afterward.");
    }

    return createdMatch.food_item_id;
};

/**
 * Build the backend meal log request by resolving every selected/custom food item
 * into a real food_item_id first.
 */
export const createMealLog = async (payload: CreateMealLogPayload) => {
    const existingItems = await getFoodItems();

    const resolvedFoodItemIds = await Promise.all(
        payload.food_items.map((item) =>
            resolveFoodItemId(
                {
                    foodItemId: item.food_item_id,
                    name: item.name,
                    calories: Number(item.calories),
                    protein: Number(item.protein),
                    carbs: Number(item.carbs),
                    fats: Number(item.fats),
                    image_url: item.image_url,
                },
                existingItems,
            ),
        ),
    );

    // Remove duplicates before sending the final meal log request.
    const uniqueFoodItemIds = [...new Set(resolvedFoodItemIds)];

    const response = await nutritionApi.post("/nutrition/logMeal", {
        name: payload.meal.name.trim(),
        eaten_at: payload.meal_log.eaten_at,
        servings: Number(payload.meal_log.servings),
        notes: payload.meal_log.notes?.trim() || "",
        photo_url: payload.meal_log.photo_url?.trim() || DEFAULT_MEAL_PHOTO_URL,
        food_item_ids: uniqueFoodItemIds,
    });

    return response.data;
};

/**
 * Fetch logged meals for a date range. This is ready for the future meal history UI.
 */
export const getLoggedMeals = async (
    start_datetime?: string,
    end_datetime?: string,
) => {
    const response = await nutritionApi.post("/nutrition/getLoggedMeals", {
        start_datetime,
        end_datetime,
    });

    return response.data?.loggedMeals ?? [];
};

export const getDefaultMealPhotoUrl = () => DEFAULT_MEAL_PHOTO_URL;