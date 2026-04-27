import PredictionCancelReviewModal from "../Modals/PredictionCancelReviewModal";
import PredictionSettlementModal from "../Modals/PredictionSettlementModal";
import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";

type PredictionAdminModalsProps = {
  settlementMarket: PredictionMarket | null;
  cancelReviewMarket: PredictionMarket | null;
  cancelReviewMode: "approve" | "reject";
  settlementError?: string | null;
  cancelReviewError?: string | null;
  isSettlementSubmitting?: boolean;
  isCancelReviewSubmitting?: boolean;
  onCloseSettlementModal: () => void;
  onCloseCancelReviewModal: () => void;
  onSettlementSubmit: (payload: {
    market_id: number;
    result: "yes" | "no" | "cancelled";
    admin_action?: string;
  }) => void | Promise<void>;
  onCancelReviewSubmit: (payload: {
    market_id: number;
    admin_action?: string;
    decision: "approve" | "reject";
  }) => void | Promise<void>;
};

export default function PredictionAdminModals({
  settlementMarket,
  cancelReviewMarket,
  cancelReviewMode,
  settlementError = null,
  cancelReviewError = null,
  isSettlementSubmitting = false,
  isCancelReviewSubmitting = false,
  onCloseSettlementModal,
  onCloseCancelReviewModal,
  onSettlementSubmit,
  onCancelReviewSubmit,
}: PredictionAdminModalsProps) {
  return (
    <>
      <PredictionSettlementModal
        isOpen={Boolean(settlementMarket)}
        market={settlementMarket}
        isSubmitting={isSettlementSubmitting}
        error={settlementError}
        onClose={onCloseSettlementModal}
        onSubmit={onSettlementSubmit}
      />

      <PredictionCancelReviewModal
        isOpen={Boolean(cancelReviewMarket)}
        market={cancelReviewMarket}
        mode={cancelReviewMode}
        isSubmitting={isCancelReviewSubmitting}
        error={cancelReviewError}
        onClose={onCloseCancelReviewModal}
        onSubmit={onCancelReviewSubmit}
      />
    </>
  );
}
