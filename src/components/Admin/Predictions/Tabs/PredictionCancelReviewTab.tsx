import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";
import PredictionCancelReviewList from "../Lists/PredictionCancelReviewList";

export interface PredictionCancelReviewTabProps {
    markets: PredictionMarket[];
    pendingMarketId?: number | null;
    onApproveCancel: (market: PredictionMarket) => void;
    onRejectCancel: (market: PredictionMarket) => void;
}

export default function PredictionCancelReviewTab(
    props: PredictionCancelReviewTabProps,
) {
    return <PredictionCancelReviewList {...props} />;
}