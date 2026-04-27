import { Card } from "@heroui/react";
import { Coins, UsersRound } from "lucide-react";
import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";
import PredictionSettlementActions from "../Actions/PredictionSettlementActions";

export interface PredictionSettlementCardProps {
  market: PredictionMarket;
  isPending?: boolean;
  onOpenSettlement: (market: PredictionMarket) => void;
}

export default function PredictionSettlementCard({
  market,
  isPending = false,
  onOpenSettlement,
}: PredictionSettlementCardProps) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex rounded-full bg-violet-50 px-3 py-1 text-[11.25px] font-semibold text-violet-700 ring-1 ring-violet-200">
              Pending settlement
            </div>
            <div>
              <h3 className="text-[18.75px] font-semibold text-slate-900">
                {market.title}
              </h3>
              <p className="mt-1 text-[13.125px] text-slate-600">
                {market.goal_text}
              </p>
            </div>
          </div>
          <div className="rounded-full bg-slate-50 px-3 py-1 text-[13.125px] font-medium text-slate-600 ring-1 ring-slate-200">
            Market #{market.market_id}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 inline-flex items-center gap-2 text-[11.25px] font-semibold uppercase tracking-wide text-slate-500">
              <Coins className="h-4 w-4 text-[#5B5EF4]" />
              Total points
            </div>
            <p className="text-base font-semibold text-slate-900">
              {market.total_points} pts
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 inline-flex items-center gap-2 text-[11.25px] font-semibold uppercase tracking-wide text-slate-500">
              <UsersRound className="h-4 w-4 text-[#5B5EF4]" />
              Total bets
            </div>
            <p className="text-base font-semibold text-slate-900">
              {market.total_bets}
            </p>
          </div>
        </div>

        <PredictionSettlementActions
          isPending={isPending}
          onOpenSettlement={() => onOpenSettlement(market)}
        />
      </div>
    </Card>
  );
}
