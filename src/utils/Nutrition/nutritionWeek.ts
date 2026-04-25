import type { LoggedMeal } from "../Interfaces/Nutrition/nutrition";
import { getMealCalories } from "./nutritionDashboard";

export interface WeeklyDayCalories {
    dayKey: string;
    dayLabel: string;
    calories: number;
}

export interface WeeklyCaloriesSummary {
    days: WeeklyDayCalories[];
    averageDailyCalories: number;
    bestDayCalories: number;
    goalCalories: number;
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DEFAULT_GOAL_CALORIES = 2000;

const formatLocalDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const getStartOfWeek = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    result.setDate(result.getDate() + diff);
    result.setHours(0, 0, 0, 0);

    return result;
};

export const getCurrentWeekDateRange = () => {
    const now = new Date();

    const start = getStartOfWeek(now);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return {
        start_datetime: formatLocalDateTime(start),
        end_datetime: formatLocalDateTime(end),
    };
};

export const buildWeeklyCaloriesSummary = (
    backendDays: { date: string; calories: number }[],
): WeeklyCaloriesSummary => {
    const weekStart = getStartOfWeek(new Date());

    const days: WeeklyDayCalories[] = DAY_LABELS.map((label, index) => {
        const currentDay = new Date(weekStart);
        currentDay.setDate(weekStart.getDate() + index);

        const dayKey = `${currentDay.getFullYear()}-${String(
            currentDay.getMonth() + 1,
        ).padStart(2, "0")}-${String(currentDay.getDate()).padStart(2, "0")}`;

        const match = backendDays.find((d) => d.date === dayKey);

        return {
            dayKey,
            dayLabel: label,
            calories: match ? match.calories : 0,
        };
    });

    const totalCalories = days.reduce((sum, day) => sum + day.calories, 0);
    const averageDailyCalories = Math.round(totalCalories / 7);

    const bestDay = days.reduce((best, current) => {
        return current.calories > best.calories ? current : best;
    }, days[0]);

    return {
        days,
        averageDailyCalories,
        bestDayCalories: Math.round(bestDay.calories),
        goalCalories: DEFAULT_GOAL_CALORIES,
    };
};