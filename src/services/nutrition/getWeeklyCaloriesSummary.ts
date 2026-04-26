import api from "../api";

export interface WeeklyDayCalories {
  dayKey: string;
  dayLabel: string;
  calories: number;
}

export interface WeeklyCaloriesSummary {
  days: WeeklyDayCalories[];
  averageDailyCalories: number;
  bestDayCalories: number;
  goalCalories: number | null;
}

interface GetWeeklyCaloriesSummaryResponse extends WeeklyCaloriesSummary {
  message?: string;
}

export const getWeeklyCaloriesSummary =
  async (): Promise<WeeklyCaloriesSummary> => {
    const response = await api.get<GetWeeklyCaloriesSummaryResponse>(
      "/nutrition/getWeeklyCaloriesSummary",
    );

    const { days, averageDailyCalories, bestDayCalories, goalCalories } =
      response.data;

    return {
      days,
      averageDailyCalories,
      bestDayCalories,
      goalCalories,
    };
  };
