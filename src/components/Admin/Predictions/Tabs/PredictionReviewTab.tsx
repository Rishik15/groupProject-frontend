import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";
import PredictionReviewList from "../Lists/PredictionReviewList";

export interface PredictionReviewTabProps {
  markets: PredictionMarket[];
  pendingMarketId?: number | null;
  onApprove: (market: PredictionMarket) => void;
  onReject: (market: PredictionMarket) => void;
}

export default function PredictionReviewTab(props: PredictionReviewTabProps) {
  return <PredictionReviewList {...props} />;
}
