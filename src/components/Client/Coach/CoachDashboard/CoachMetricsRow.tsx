import { Users, DollarSign, Dumbbell, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { getCoachMetrics } from "../../../../services/dashboard/coach/getCoachMetrics";

type Metrics = {
  activeClients: {
    count: number;
    diff: number;
  };
  revenue: {
    amount: number;
    diff: number;
  };
  sessions: {
    week: number;
    month: number;
  };
  rating: {
    avg: number;
    count: number;
  };
};

const MetricCard = ({
  icon,
  title,
  value,
  subtitle,
  diff,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  diff?: number;
}) => {
  const isPositive = diff && diff >= 0;

  return (
    <div className="flex items-center gap-4 bg-white rounded-2xl px-6 py-5 w-full shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#eef0ff] text-[#5b5fc7]">
        {icon}
      </div>

      <div className="flex flex-col">
        <div className="text-sm text-gray-500">{title}</div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold">{value}</span>

          {diff !== undefined && (
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-green-600" : "text-red-500"
              }`}
            >
              {isPositive ? `+${diff}` : diff}
            </span>
          )}
        </div>

        <div className="text-xs text-gray-400">{subtitle}</div>
      </div>
    </div>
  );
};

const CoachMetricRow = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getCoachMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Failed to fetch coach metrics", err);
      }
    };

    fetchMetrics();
  }, []);

  if (!metrics) return null;

  return (
    <section className="grid grid-cols-4 gap-6 px-32 py-6">
      {/* Active Clients */}
      <MetricCard
        icon={<Users className="w-5 h-5" />}
        title="Active Clients"
        value={metrics.activeClients.count}
        diff={metrics.activeClients.diff}
        subtitle="vs last month"
      />

      {/* Revenue */}
      <MetricCard
        icon={<DollarSign className="w-5 h-5" />}
        title="Revenue (MTD)"
        value={`$${metrics.revenue.amount.toLocaleString()}`}
        diff={metrics.revenue.diff}
        subtitle="vs last month"
      />

      {/* Sessions */}
      <MetricCard
        icon={<Dumbbell className="w-5 h-5" />}
        title="Sessions / Week"
        value={metrics.sessions.week}
        subtitle={`${metrics.sessions.month} total this month`}
      />

      {/* Rating */}
      <MetricCard
        icon={<Star className="w-5 h-5" />}
        title="Avg. Rating"
        value={metrics.rating.avg}
        subtitle={`${metrics.rating.count} reviews`}
      />
    </section>
  );
};

export default CoachMetricRow;
