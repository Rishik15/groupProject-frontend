import { useState } from "react";
import type { LoggedMeal } from "../../../utils/Interfaces/Nutrition/nutrition";
import {
    Apple,
    Coffee,
    Moon,
    Sandwich,
    Utensils,
} from "lucide-react";

interface MealsTodayProps {
    meals: LoggedMeal[];
    isLoading?: boolean;
}

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const formatMealTime = (isoString: string) => {
    const date = new Date(isoString);

    return date.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    });
};

const getMealTypeFromTime = (isoString: string) => {
    const date = new Date(isoString);
    const hour = date.getHours();

    if (hour < 11) return "Breakfast";
    if (hour < 15) return "Lunch";
    if (hour < 18) return "Snack";
    return "Dinner";
};

const getMealIcon = (mealType: string) => {
    switch (mealType) {
        case "Breakfast":
            return Coffee;
        case "Lunch":
            return Sandwich;
        case "Snack":
            return Apple;
        case "Dinner":
            return Moon;
        default:
            return Utensils;
    }
};

const formatMacroValue = (value: number) => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
};

const formatServings = (value: number) => {
    return Number.isInteger(value) ? value.toString() : value.toFixed(1);
};

const getMealPhotoSrc = (photoUrl?: string | null) => {
    if (!photoUrl) return null;

    if (/^https?:\/\//i.test(photoUrl)) {
        return photoUrl;
    }

    return `${API_BASE_URL}${photoUrl.startsWith("/") ? "" : "/"}${photoUrl}`;
};

const MealsToday = ({ meals, isLoading = false }: MealsTodayProps) => {
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
    const [selectedMealName, setSelectedMealName] = useState<string>("");

    const sortedMeals = [...meals].sort(
        (a, b) =>
            new Date(b.eaten_at).getTime() - new Date(a.eaten_at).getTime(),
    );

    const totalCalories = sortedMeals.reduce((sum, meal) => {
        const servings = Number(meal.servings ?? 1);
        return sum + Number(meal.calories ?? 0) * servings;
    }, 0);

    const openPhotoModal = (meal: LoggedMeal) => {
        const src = getMealPhotoSrc(meal.photo_url);

        if (!src) return;

        setSelectedPhotoUrl(src);
        setSelectedMealName(meal.meal_name);
    };

    const closePhotoModal = () => {
        setSelectedPhotoUrl(null);
        setSelectedMealName("");
    };

    if (isLoading) {
        return (
            <div className="w-full rounded-2xl border border-neutral-300 bg-white p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-[15px] font-semibold text-[#0F0F14]">
                        Today&apos;s Meals
                    </h2>
                    <span className="text-[11.25px] text-[#72728A]">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full rounded-2xl border border-neutral-300 bg-white p-6">
                <div className="flex items-start justify-between">
                    <h2 className="text-[15px] font-semibold text-[#0F0F14]">
                        Today&apos;s Meals
                    </h2>
                    <span className="text-[11.25px] text-[#72728A]">
                        {Math.round(totalCalories)} kcal total
                    </span>
                </div>

                {sortedMeals.length === 0 ? (
                    <div className="mt-6 text-[13.125px] text-[#72728A]">
                        No meals logged today.
                    </div>
                ) : (
                    <div className="mt-6 space-y-4">
                        {sortedMeals.map((meal) => {
                            const mealType = getMealTypeFromTime(meal.eaten_at);
                            const Icon = getMealIcon(mealType);

                            const servings = Number(meal.servings ?? 1);
                            const totalMealCalories =
                                Number(meal.calories ?? 0) * servings;
                            const totalProtein =
                                Number(meal.protein ?? 0) * servings;
                            const totalCarbs = Number(meal.carbs ?? 0) * servings;
                            const totalFats = Number(meal.fats ?? 0) * servings;

                            const hasPhoto = Boolean(meal.photo_url);

                            return (
                                <div
                                    key={meal.log_id}
                                    className="flex min-h-[60px] items-center justify-between gap-6"
                                >
                                    <div className="flex min-w-0 items-center gap-4">
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#F3F2FF]">
                                            <Icon
                                                className="h-6 w-6 text-[#5E5EF4]"
                                                strokeWidth={1.75}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="truncate text-[15px] font-medium text-[#0F0F14]">
                                                    {meal.meal_name}
                                                </span>

                                                <span className="rounded-xl bg-[#F3F3F7] px-3 py-1 text-[11.25px] font-medium text-[#0F0F14]">
                                                    {mealType}
                                                </span>

                                                {hasPhoto && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openPhotoModal(meal)}
                                                        className="rounded-xl border border-[#D8D8E5] px-3 py-1 text-[11.25px] font-medium text-[#5E5EF4] transition hover:bg-[#F6F5FF]"
                                                    >
                                                        View Meal Photo
                                                    </button>
                                                )}
                                            </div>

                                            <div className="mt-1 text-[13.125px] text-[#72728A]">
                                                {formatMealTime(meal.eaten_at)} ·{" "}
                                                {formatServings(servings)} serving
                                                {servings !== 1 ? "s" : ""} · P:{" "}
                                                {formatMacroValue(totalProtein)}g · C:{" "}
                                                {formatMacroValue(totalCarbs)}g · F:{" "}
                                                {formatMacroValue(totalFats)}g
                                            </div>
                                        </div>
                                    </div>

                                    <div className="shrink-0 text-[13.125px] font-medium text-[#0F0F14]">
                                        {Math.round(totalMealCalories)} kcal
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {selectedPhotoUrl && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6"
                    onClick={closePhotoModal}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                        if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
                            closePhotoModal();
                        }
                    }}
                >
                    <div className="flex max-h-full max-w-5xl flex-col items-center gap-3">
                        <div className="text-center text-sm font-medium text-white">
                            {selectedMealName}
                        </div>

                        <img
                            src={selectedPhotoUrl}
                            alt={`${selectedMealName} meal`}
                            className="max-h-[85vh] max-w-full rounded-2xl bg-white object-contain shadow-2xl"
                        />

                        <div className="text-xs text-white/80">
                            Click anywhere to close
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};


export default MealsToday;