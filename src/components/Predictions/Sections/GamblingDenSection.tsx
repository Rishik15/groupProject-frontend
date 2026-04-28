import { RefreshCcw } from "lucide-react";
import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";
import PredictionMarketGrid from "../Lists/PredictionMarketGrid";
import PredictionSectionHeader from "../Layout/PredictionSectionHeader";

export interface GamblingDenSectionProps {
  markets?: PredictionMarket[] | null;
  isLoading?: boolean;
  onRefresh?: () => void;
  onSelectSide?: (market: PredictionMarket, side: "yes" | "no") => void;
}

export default function GamblingDenSection({
  markets,
  isLoading = false,
  onRefresh,
  onSelectSide,
}: GamblingDenSectionProps) {
  return (
    <section className="space-y-4">
      <PredictionSectionHeader
        title="Gambling Den"
        description="Browse approved open markets and choose the side you want to back. Expired markets are filtered out even if mock data still marks them open."
        actionLabel="Refresh markets"
        onAction={onRefresh}
        actionIcon={RefreshCcw}
      />

      <PredictionMarketGrid
        markets={markets}
        isLoading={isLoading}
        onSelectSide={onSelectSide}
      />
    </section>
  );
}
