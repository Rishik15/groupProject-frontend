import React from "react";
import { Button, Modal, Spinner } from "@heroui/react";
import { AlertTriangle } from "lucide-react";
import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";
import type { RequestPredictionCancellationPayload } from "../../../utils/Interfaces/Predictions/predictionForms";

type RequestCancellationModalProps = {
  isOpen: boolean;
  market?: PredictionMarket | null;
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (
    payload: RequestPredictionCancellationPayload,
  ) => void | Promise<void>;
};

export default function RequestCancellationModal({
  isOpen,
  market,
  isSubmitting = false,
  error,
  onClose,
  onSubmit,
}: RequestCancellationModalProps) {
  const [reason, setReason] = React.useState("");
  const [validationError, setValidationError] = React.useState<string | null>(
    null,
  );

  React.useEffect(() => {
    if (!isOpen) return;
    setReason("");
    setValidationError(null);
  }, [isOpen, market?.market_id]);

  const handleSubmit = async () => {
    const trimmedReason = reason.trim();

    if (!market) {
      setValidationError("Choose a market before requesting cancellation.");
      return;
    }

    if (!trimmedReason) {
      setValidationError("A cancellation reason is required.");
      return;
    }

    setValidationError(null);

    await onSubmit({
      market_id: market.market_id,
      reason: trimmedReason,
    });
  };

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen && !!market}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) onClose();
        }}
        variant="opaque"
        isDismissable={!isSubmitting}
      >
        <Modal.Container placement="center" size="md" scroll="inside">
          <Modal.Dialog
            aria-label="Request market cancellation"
            className="rounded-3xl"
          >
            <Modal.Header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[11.25px] font-semibold text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                  Request Cancellation
                </div>
                <h2 className="text-[18.75px] font-semibold text-slate-900">
                  {market?.title ?? "Request cancellation"}
                </h2>
                <p className="text-[13.125px] text-slate-500">
                  This sends the market to admin cancel review and should only
                  be used when necessary.
                </p>
              </div>
            </Modal.Header>

            <Modal.Body className="space-y-5 px-6 py-6">
              <div className="space-y-2">
                <label
                  htmlFor="prediction-cancel-reason"
                  className="text-[13.125px] font-medium text-slate-700"
                >
                  Cancellation reason
                </label>
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <textarea
                    id="prediction-cancel-reason"
                    className="min-h-32 w-full resize-y border-0 bg-transparent text-[13.125px] text-slate-900 outline-none"
                    placeholder="Explain why this market should be cancelled."
                    value={reason}
                    disabled={isSubmitting}
                    onChange={(event) => setReason(event.target.value)}
                  />
                </div>
              </div>

              {(validationError || error) && (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13.125px] text-rose-700">
                  {validationError ?? error}
                </div>
              )}
            </Modal.Body>

            <Modal.Footer className="flex gap-3 border-t border-slate-100 px-10 py-2">
              <Button
                variant="outline"
                onPress={onClose}
                isDisabled={isSubmitting}
              >
                Keep market
              </Button>

              <Button
                variant="danger"
                onPress={handleSubmit}
                isDisabled={isSubmitting || !market}
              >
                <span className="inline-flex items-center gap-2">
                  {isSubmitting ? (
                    <Spinner size="sm" />
                  ) : (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  Send for review
                </span>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
