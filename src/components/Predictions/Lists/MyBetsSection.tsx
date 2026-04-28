import React from "react";
import { ChevronDown } from "lucide-react";
import type { PredictionBet } from "../../../utils/Interfaces/Predictions/predictionBet";
import MyBetCard from "../Cards/MyBetCard";

type MyBetsSectionProps = {
  bets: PredictionBet[];
  onViewResult?: (bet: PredictionBet) => void;
};

type BetGroups = {
  open: PredictionBet[];
  pending: PredictionBet[];
  closed: PredictionBet[];
};

type SectionBlockProps = {
  title: string;
  description: string;
  items: PredictionBet[];
  isOpen: boolean;
  onToggle: () => void;
  onViewResult?: (bet: PredictionBet) => void;
};

const groupBets = (bets: PredictionBet[]): BetGroups =>
  bets.reduce<BetGroups>(
    (accumulator, bet) => {
      const status = (bet.market_status ?? "").toLowerCase();

      if (status === "open") {
        accumulator.open.push(bet);
      } else if (status === "settled" || status === "cancelled") {
        accumulator.closed.push(bet);
      } else {
        accumulator.pending.push(bet);
      }

      return accumulator;
    },
    { open: [], pending: [], closed: [] },
  );

const SectionBlock = ({
  title,
  description,
  items,
  isOpen,
  onToggle,
  onViewResult,
}: SectionBlockProps) => (
  <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start justify-between gap-3 text-left"
      aria-expanded={isOpen}
    >
      <div>
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        <p className="text-[13.125px] text-slate-500">{description}</p>
      </div>

      <div className="flex items-center gap-2">
        <div className="rounded-full bg-slate-100 px-3 py-1 text-[11.25px] font-semibold text-slate-700">
          {items.length}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>
    </button>

    {isOpen ? (
      items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-[13.125px] text-slate-500">
          Nothing to show in this section yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {items.map((bet) => (
            <MyBetCard
              key={bet.prediction_id}
              bet={bet}
              onViewResult={onViewResult}
            />
          ))}
        </div>
      )
    ) : null}
  </section>
);

export default function MyBetsSection({
  bets,
  onViewResult,
}: MyBetsSectionProps) {
  const grouped = React.useMemo(() => groupBets(bets), [bets]);

  const [openSections, setOpenSections] = React.useState({
    open: true,
    pending: true,
    closed: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((current) => ({
      ...current,
      [section]: !current[section],
    }));
  };

  return (
    <div className="space-y-3">
      <SectionBlock
        title="Open Bets"
        description="Markets that are still open and actively running."
        items={grouped.open}
        isOpen={openSections.open}
        onToggle={() => toggleSection("open")}
        onViewResult={onViewResult}
      />

      <SectionBlock
        title="Pending Bets"
        description="Markets awaiting final settlement."
        items={grouped.pending}
        isOpen={openSections.pending}
        onToggle={() => toggleSection("pending")}
        onViewResult={onViewResult}
      />

      <SectionBlock
        title="Closed Bets"
        description="Markets that settled or were cancelled."
        items={grouped.closed}
        isOpen={openSections.closed}
        onToggle={() => toggleSection("closed")}
        onViewResult={onViewResult}
      />
    </div>
  );
}
