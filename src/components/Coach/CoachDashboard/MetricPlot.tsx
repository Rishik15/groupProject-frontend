import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import { getRevenue } from "../../../services/dashboard/coach/getRevenue";
import { getClientGrowth } from "../../../services/dashboard/coach/getClientGrowth";

function formatRevenueData(raw: any[]) {
  const now = new Date();

  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);

    months.push({
      month: d.toLocaleString("en-US", { month: "short" }),
      month_num: d.getMonth() + 1,
      revenue: 0,
    });
  }

  const map = new Map(raw.map((r) => [r.month_num, Number(r.revenue)]));

  return months.map((m) => ({
    month: m.month,
    revenue: map.get(m.month_num) || 0,
  }));
}

function formatClientGrowth(raw: any[]) {
  if (!raw.length) return [];

  const sorted = [...raw].sort((a, b) => a.month_num - b.month_num);

  const start = sorted[0].month_num;

  const months = [];
  for (let i = 0; i < 4; i++) {
    const monthNum = start + i;

    const date = new Date(2026, monthNum - 1, 1);

    months.push({
      month: date.toLocaleString("en-US", { month: "short" }),
      month_num: monthNum,
      new_clients: 0,
    });
  }

  const map = new Map(raw.map((r) => [r.month_num, r.new_clients]));

  return months.map((m) => ({
    month: m.month,
    clients: map.get(m.month_num) || 0,
  }));
}

const RevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-xl shadow-md border text-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-[#5B5EF4]">Revenue: ${payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const ClientTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-xl shadow-md border text-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-[#31d447]">New Clients: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function CoachMetricPlot() {
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [clientData, setClientData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const revenueJson = await getRevenue();
        const clientJson = await getClientGrowth();

        setRevenueData(formatRevenueData(revenueJson.revenue));
        setClientData(formatClientGrowth(clientJson.client_growth));
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <section className="flex gap-6 px-38">
      <div className="bg-white py-8 px-10 rounded-3xl flex flex-col gap-10 w-full shadow-sm">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-[14px]">
            Revenue (Last 6 Months)
          </div>

          <div className="text-[12px] bg-gray-300 px-2 rounded-2xl">
            ${revenueData.reduce((sum, d) => sum + d.revenue, 0)}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <LineChart
            data={revenueData}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              padding={{ left: 20, right: 20 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <Tooltip content={<RevenueTooltip />} />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#5B5EF4"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: "white" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow-sm py-8 px-8 rounded-3xl flex flex-col gap-10 w-200 mx-auto">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-[14px]">Client Growth</div>

          <div className="text-[12px] text-gray-500">
            {clientData.reduce((sum, d) => sum + d.clients, 0)} total
          </div>
        </div>

        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={clientData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              padding={{ left: 20, right: 20 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              allowDecimals={false}
            />

            <Tooltip content={<ClientTooltip />} />

            <Bar dataKey="clients" fill="#31d447" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
