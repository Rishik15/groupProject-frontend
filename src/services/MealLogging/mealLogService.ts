import axios from "axios";
import type {
    CreateMealLogPayload,
    FoodItemSuggestion,
} from "../../utils/Interfaces/MealLogging/mealLog";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const DEFAULT_FOOD_IMAGE_URL =
    "https://placehold.co/400x300/png?text=Food+Item";

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

const normalizeFoodItem = (item: any): FoodItemSuggestion => ({
    food_item_id: Number(item.food_item_id),
    name: String(item.name ?? ""),
    calories: Number(item.calories ?? 0),
    protein: Number(item.protein ?? 0),
    carbs: Number(item.carbs ?? 0),
    fats: Number(item.fats ?? 0),
    image_url: item.image_url ?? "",
});

export const buildBackendMediaUrl = (photoUrl?: string | null): string | null => {
    if (!photoUrl) {
        return null;
    }

    if (/^https?:\/\//i.test(photoUrl)) {
        return photoUrl;
    }

    return `${API_BASE_URL}${photoUrl.startsWith("/") ? "" : "/"}${photoUrl}`;
};

export const getFoodItems = async (): Promise<FoodItemSuggestion[]> => {
    const response = await nutritionApi.get("/nutrition/getFoodItems");

    const items = Array.isArray(response.data?.foodItemsList)
        ? response.data.foodItemsList
        : [];

    return items.map(normalizeFoodItem);
};

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

const findFoodItemByName = (
    items: FoodItemSuggestion[],
    name: string,
): FoodItemSuggestion | undefined => {
    const normalizedName = name.trim().toLowerCase();

    return items.find(
        (item) => item.name.trim().toLowerCase() === normalizedName,
    );
};

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

export const createMealLog = async (
    payload: CreateMealLogPayload,
    photoFile?: File | null,
) => {
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

    const uniqueFoodItemIds = [...new Set(resolvedFoodItemIds)];

    const formData = new FormData();
    formData.append("name", payload.meal.name.trim());
    formData.append("eaten_at", payload.meal_log.eaten_at);
    formData.append("servings", String(payload.meal_log.servings));
    formData.append("notes", payload.meal_log.notes?.trim() || "");
    formData.append("food_item_ids", JSON.stringify(uniqueFoodItemIds));

    if (photoFile) {
        formData.append("photo", photoFile);
    }

    const response = await nutritionApi.post("/nutrition/logMeal", formData);

    return {
        ...response.data,
        photo_url: buildBackendMediaUrl(response.data?.photo_url ?? null),
    };
};

export const getLoggedMeals = async (
    start_datetime?: string,
    end_datetime?: string,
) => {
    const response = await nutritionApi.post("/nutrition/getLoggedMeals", {
        start_datetime,
        end_datetime,
    });

    const meals = response.data?.loggedMeals ?? [];

    return meals.map((meal: any) => ({
        ...meal,
        photo_url: buildBackendMediaUrl(meal.photo_url ?? null),
    }));
};