import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";
import PredictionSettlementList from "../Lists/PredictionSettlementList";

export interface PredictionSettlementTabProps {
  markets: PredictionMarket[];
  pendingMarketId?: number | null;
  onOpenSettlement: (market: PredictionMarket) => void;
}

export default function PredictionSettlementTab(
  props: PredictionSettlementTabProps,
) {
  return <PredictionSettlementList {...props} />;
}
