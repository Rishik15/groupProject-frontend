import { adminGet, AdminApiError } from "../../utils/Admin/adminApi";
import type {
  GetDashboardStatsResponse,
  GetEngagementAnalyticsResponse,
} from "../../utils/Interfaces/Admin/adminDashboard";

export const getDashboardStats = (_signal?: AbortSignal) => {
  return adminGet<GetDashboardStatsResponse>("/dashboard/stats");
};

export const getEngagementAnalytics = async (_signal?: AbortSignal) => {
  try {
    return await adminGet<GetEngagementAnalyticsResponse>(
      "/analytics/engagement",
    );
  } catch (error) {
    if (error instanceof AdminApiError && error.status === 404) {
      return null;
    }

    throw error;
  }
};

const adminDashboardService = {
  getDashboardStats,
  getEngagementAnalytics,
};

export default adminDashboardService;
