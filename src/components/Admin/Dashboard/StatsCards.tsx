import { Card } from "@heroui/react";
import type { LucideIcon } from "lucide-react";
import { DollarSign, TriangleAlert, UserCheck, Users } from "lucide-react";
import type { AdminDashboardStats } from "../../../utils/Interfaces/Admin/adminDashboard";
import { formatAdminCurrency } from "../../../utils/Admin/adminFormatters";

interface StatCardItem {
  id: string;
  title: string;
  value: string;
  helperText: string;
  icon: LucideIcon;
}

interface StatsCardsProps {
  stats: AdminDashboardStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const items: StatCardItem[] = [
    {
      id: "total-users",
      title: "Total Users",
      value: stats.total_users.toLocaleString(),
      helperText: "Registered accounts across the platform",
      icon: Users,
    },
    {
      id: "active-coaches",
      title: "Active Coaches",
      value: stats.active_coaches.toLocaleString(),
      helperText: "Currently active and visible in coaching flows",
      icon: UserCheck,
    },
    {
      id: "pending-reviews",
      title: "Pending Reviews",
      value: stats.pending_reviews.toLocaleString(),
      helperText: `${stats.pending_coach_applications} applications + ${stats.open_reports} reports`,
      icon: TriangleAlert,
    },
    {
      id: "monthly-revenue",
      title: "Monthly Revenue",
      value: formatAdminCurrency(stats.monthly_revenue),
      helperText: "Derived from active contract revenue",
      icon: DollarSign,
    },
  ];

  return (
    <section className="space-y-3" aria-labelledby="dashboard-overview-heading">
      <div>
        <h2
          id="dashboard-overview-heading"
          className="text-xl font-semibold text-default-900"
        >
          Overview
        </h2>
        <p className="mt-1 text-sm text-default-600">
          High-level platform health metrics pulled from the admin stats
          endpoint.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.id}
              className="rounded-[20px] border border-default-200 bg-white shadow-sm"
            >
              <div className="flex flex-col justify-between gap-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-default-600">
                      {item.title}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-default-900">
                      {item.value}
                    </p>
                  </div>
                  <div className="rounded-[14px] border border-default-200 bg-default-50 p-2.5">
                    <Icon className="h-4.5 w-4.5 text-default-700" />
                  </div>
                </div>

                <p className="text-xs leading-5 text-default-500">
                  {item.helperText}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default StatsCards;
