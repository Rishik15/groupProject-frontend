import axios from "axios";
import {
    buildWeeklyCaloriesSummary,
    getCurrentWeekDateRange,
    type WeeklyCaloriesSummary,
} from "../../utils/Nutrition/nutritionWeek";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const nutritionApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const getWeeklyCaloriesSummary = async (): Promise<WeeklyCaloriesSummary> => {
    const { start_datetime, end_datetime } = getCurrentWeekDateRange();

    const response = await nutritionApi.post("/nutrition/weekly-calories", {
        start_datetime,
        end_datetime,
    });

    const days = response.data?.days ?? [];

    return buildWeeklyCaloriesSummary(days);
};