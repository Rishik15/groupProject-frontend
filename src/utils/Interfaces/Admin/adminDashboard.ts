import type { ApiSuccess } from "./api";

export interface AdminDashboardStats {
  total_users: number;
  active_coaches: number;
  pending_reviews: number;
  pending_coach_applications: number;
  open_reports: number;
  monthly_revenue: number;
}

export interface AdminEngagementAnalytics {
  daily_active_users: number;
  weekly_active_users: number;
  monthly_active_users: number;
}

export interface GetDashboardStatsResponse extends ApiSuccess {
  stats: AdminDashboardStats;
}

export interface GetEngagementAnalyticsResponse extends ApiSuccess {
  analytics: AdminEngagementAnalytics;
}
