import { Card, Chip } from "@heroui/react";
import { CalendarDays, Coins, UserRound, Users } from "lucide-react";
import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";
import PoolFooter from "../display/PoolFooter";
import PredictionStatusBadge from "../display/PredictionStatusBadge";
import TimeLeftBadge from "../display/TimeLeftBadge";
import PredictionOptionCard from "./PredictionOptionCard";

export interface PredictionMarketCardProps {
  market: PredictionMarket;
  onSelectSide?: (market: PredictionMarket, side: "yes" | "no") => void;
}

function formatDate(value?: string | null) {
  if (!value) {
    return "No deadline";
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

export default function PredictionMarketCard({
  market,
  onSelectSide,
}: PredictionMarketCardProps) {
  const canBet =
    market.status === "open" &&
    market.review_status === "approved" &&
    market.cancel_request_status !== "pending";

  return (
    <Card className="border border-default-200 shadow-sm">
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <PredictionStatusBadge
                kind="review"
                value={market.review_status}
                size="sm"
              />
              <PredictionStatusBadge
                kind="market"
                value={market.status}
                size="sm"
              />
              {market.cancel_request_status &&
              market.cancel_request_status !== "none" ? (
                <PredictionStatusBadge
                  kind="cancel"
                  value={market.cancel_request_status}
                  size="sm"
                />
              ) : null}
            </div>

            <h3 className="text-[18.75px] font-semibold text-foreground">
              {market.title}
            </h3>
            <p className="mt-3 max-w-3xl text-[13.125px] leading-7 text-foreground/70">
              {market.goal_text}
            </p>
          </div>

          <TimeLeftBadge endDate={market.end_date} status={market.status} />
        </div>

        <div className="grid grid-cols-3 gap-1">
          <div className="flex items-center gap-1 rounded-3xl border border-default-200 bg-content2/50 p-4">
            <div className="rounded-2xl bg-[#5B5EF4]/10 p-2.5 text-[#5B5EF4]">
              <UserRound className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">
                Creator
              </p>
              <p className="text-[11.25px] font-semibold text-foreground">
                {market.creator_name || market.creator_email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-3xl border border-default-200 bg-content2/50 p-4">
            <div className="rounded-2xl bg-amber-500/10 p-2.5 text-amber-600">
              <CalendarDays className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">
                Deadline
              </p>
              <p className="text-[11.25px] font-semibold text-foreground">
                {formatDate(market.end_date)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-3xl border border-default-200 bg-content2/50 p-4">
            <div className="rounded-2xl bg-emerald-500/10 p-2.5 text-emerald-600">
              <Users className="h-4 w-4" strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">
                Participation
              </p>
              <p className="text-[11.25px] font-semibold text-foreground">
                {market.total_bets} total bets
              </p>
            </div>
          </div>
        </div>

        <PoolFooter
          totalPoints={market.total_points}
          totalBets={market.total_bets}
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11.25px] font-semibold text-foreground">
                Prediction sides
              </p>
              <p className="text-[11.25px] text-foreground/55">
                Live yes/no participation based on current bets.
              </p>
            </div>

            <Chip color="accent" variant="secondary" size="sm">
              <span className="inline-flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5" strokeWidth={2.2} />
                {market.total_points} pooled points
              </span>
            </Chip>
          </div>

          <div className="grid gap-1 grid-cols-2">
            <PredictionOptionCard
              side="yes"
              points={market.yes_points}
              bets={market.yes_bets}
              totalPoints={market.total_points}
              isDisabled={!canBet}
              onPress={(side) => onSelectSide?.(market, side)}
            />
            <PredictionOptionCard
              side="no"
              points={market.no_points}
              bets={market.no_bets}
              totalPoints={market.total_points}
              isDisabled={!canBet}
              onPress={(side) => onSelectSide?.(market, side)}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
