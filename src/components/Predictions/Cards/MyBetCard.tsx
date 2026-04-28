import { Button, Card } from "@heroui/react";
import { CalendarDays, CircleDollarSign, Trophy } from "lucide-react";
import type { PredictionBet } from "../../../utils/Interfaces/Predictions/predictionBet";

type MyBetCardProps = {
  bet: PredictionBet;
  onViewResult?: (bet: PredictionBet) => void;
};

const statusToneMap: Record<string, string> = {
  open: "bg-emerald-50 text-emerald-700",
  closed: "bg-amber-50 text-amber-700",
  settled: "bg-slate-100 text-slate-700",
  cancelled: "bg-rose-50 text-rose-700",
};

export default function MyBetCard({ bet, onViewResult }: MyBetCardProps) {
  const marketStatus = bet.market_status ?? "unknown";
  const statusTone =
    statusToneMap[marketStatus] ?? "bg-slate-100 text-slate-700";

  return (
    <Card className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm max-w-[450px]">
      <div className="flex flex-wrap items-start justify-between gap-1">
        <div className="space-y-2">
          <div
            className={`inline-flex rounded-full px-3 py-1 text-[11.25px] font-semibold ${statusTone}`}
          >
            {marketStatus}
          </div>
          <h3 className="text-[16x] font-semibold text-slate-900">
            {bet.market_title ?? `Market #${bet.market_id}`}
          </h3>
          {bet.goal_text && (
            <p className="max-w-2xl text-[13.125px] text-slate-500">
              {bet.goal_text}
            </p>
          )}
        </div>

        <div className="rounded-2xl bg-[#EEF0FF] px-4 py-1">
          <div className="text-[11.25px] font-medium uppercase tracking-wide text-[#5B5EF4]">
            My pick
          </div>
          <div className="mt-1 text-[18.75px] font-semibold uppercase text-slate-900">
            {bet.prediction_value}
          </div>
        </div>
      </div>

      <div className="mt-2 grid gap-2 grid-cols-3">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <div className="inline-flex items-center gap-2 text-[11.25px] font-medium text-slate-500">
            <CircleDollarSign className="h-4 w-4" />
            Wagered
          </div>
          <p className="mt-2 text-[13.125px] font-semibold text-slate-900">
            {bet.points_wagered} points
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <div className="inline-flex items-center gap-2 text-[11.25px] font-medium text-slate-500">
            <CalendarDays className="h-4 w-4" />
            End date
          </div>
          <p className="mt-2 text-[13.125px] font-semibold text-slate-900">
            {bet.end_date ?? "—"}
          </p>
        </div>
      </div>

      {onViewResult &&
        (marketStatus === "settled" || marketStatus === "cancelled") && (
          <div className="mt-5 flex justify-end">
            <Button variant="outline" onPress={() => onViewResult(bet)}>
              <span className="inline-flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                View result
              </span>
            </Button>
          </div>
        )}
    </Card>
  );
}
