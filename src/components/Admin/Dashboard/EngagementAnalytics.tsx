import { Card } from "@heroui/react";
import { Activity, CalendarDays, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AdminEngagementAnalytics } from "../../../utils/Interfaces/Admin/adminDashboard";

interface EngagementAnalyticsProps {
  analytics: AdminEngagementAnalytics;
}

interface EngagementMetric {
  id: string;
  title: string;
  value: number;
  helperText: string;
  icon: LucideIcon;
}

const EngagementAnalytics = ({ analytics }: EngagementAnalyticsProps) => {
  const metrics: EngagementMetric[] = [
    {
      id: "daily",
      title: "Daily Active Users",
      value: analytics.daily_active_users,
      helperText: "Users active in the last day",
      icon: Activity,
    },
    {
      id: "weekly",
      title: "Weekly Active Users",
      value: analytics.weekly_active_users,
      helperText: "Users active over the last 7 days",
      icon: CalendarDays,
    },
    {
      id: "monthly",
      title: "Monthly Active Users",
      value: analytics.monthly_active_users,
      helperText: "Users active over the last 30 days",
      icon: TrendingUp,
    },
  ];

  const maxValue = Math.max(...metrics.map((metric) => metric.value), 1);

  return (
    <section className="space-y-4" aria-labelledby="dashboard-engagement-heading">
      <div>
        <h2 id="dashboard-engagement-heading" className="text-xl font-semibold text-default-900">
          Engagement Analytics
        </h2>
        <p className="mt-1 text-sm text-default-600">
          DAU, WAU, and MAU from the admin engagement endpoint.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          const percentage = Math.max(8, Math.round((metric.value / maxValue) * 100));

          return (
            <Card key={metric.id} className="rounded-[24px] border border-default-200 bg-white shadow-sm">
              <div className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-default-600">{metric.title}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-default-900">
                      {metric.value.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-[18px] border border-default-200 bg-default-50 p-3">
                    <Icon className="h-5 w-5 text-default-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="h-3 overflow-hidden rounded-full bg-default-100">
                    <div
                      className="h-full rounded-full bg-default-900 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-sm leading-6 text-default-500">{metric.helperText}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default EngagementAnalytics;
