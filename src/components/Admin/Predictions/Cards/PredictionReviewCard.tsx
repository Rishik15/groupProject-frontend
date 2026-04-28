import { Card } from "@heroui/react";
import { CalendarDays, UserRound } from "lucide-react";
import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";
import PredictionApprovalActions from "../Actions/PredictionApprovalActions";

export interface PredictionReviewCardProps {
  market: PredictionMarket;
  isPending?: boolean;
  onApprove: (market: PredictionMarket) => void;
  onReject: (market: PredictionMarket) => void;
}

const formatDate = (value: string | null | undefined): string => {
  if (!value) return "No deadline";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function PredictionReviewCard({
  market,
  isPending = false,
  onApprove,
  onReject,
}: PredictionReviewCardProps) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="space-y-5 p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-[11.25px] font-semibold text-amber-700 ring-1 ring-amber-200">
              Pending review
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
              <UserRound className="h-4 w-4 text-[#5B5EF4]" />
              Creator
            </div>
            <p className="text-base font-semibold text-slate-900">
              {market.creator_name}
            </p>
            <p className="text-[13.125px] text-slate-500">
              {market.creator_email}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 inline-flex items-center gap-2 text-[11.25px] font-semibold uppercase tracking-wide text-slate-500">
              <CalendarDays className="h-4 w-4 text-[#5B5EF4]" />
              Deadline
            </div>
            <p className="text-base font-semibold text-slate-900">
              {formatDate(market.end_date)}
            </p>
          </div>
        </div>

        <PredictionApprovalActions
          isPending={isPending}
          onApprove={() => onApprove(market)}
          onReject={() => onReject(market)}
        />
      </div>
    </Card>
  );
}
