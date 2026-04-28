import React from "react";
import { Button, Input, Modal, Spinner } from "@heroui/react";
import { CircleOff, ShieldCheck, X } from "lucide-react";
import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";

export interface PredictionCancelReviewModalProps {
  isOpen: boolean;
  market?: PredictionMarket | null;
  mode: "approve" | "reject";
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: {
    market_id: number;
    admin_action?: string;
    decision: "approve" | "reject";
  }) => void | Promise<void>;
}

export default function PredictionCancelReviewModal({
  isOpen,
  market,
  mode,
  isSubmitting = false,
  error,
  onClose,
  onSubmit,
}: PredictionCancelReviewModalProps) {
  const [adminAction, setAdminAction] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) return;
    setAdminAction("");
  }, [isOpen, market?.market_id, mode]);

  const handleSubmit = async () => {
    if (!market) return;
    await onSubmit({
      market_id: market.market_id,
      admin_action: adminAction.trim() || undefined,
      decision: mode,
    });
  };

  const isApprove = mode === "approve";

  return (
    <Modal>
      <Modal.Backdrop
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open && !isSubmitting) onClose();
        }}
        variant="opaque"
        isDismissable={!isSubmitting}
      >
        <Modal.Container placement="center" size="lg" scroll="inside">
          <Modal.Dialog
            aria-label="Review cancellation request"
            className="rounded-3xl"
          >
            <Modal.Header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-3 py-1 text-[11.25px] font-semibold text-[#5B5EF4]">
                  {isApprove ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <CircleOff className="h-4 w-4" />
                  )}
                  Cancel review
                </div>
                <h2 className="text-[18.75px] font-semibold text-slate-900">
                  {isApprove ? "Approve cancellation" : "Reject cancellation"}
                </h2>
                <p className="text-[13.125px] text-slate-500">
                  {market?.title ?? "This market"}
                </p>
              </div>
              <Button
                variant="ghost"
                onPress={onClose}
                isDisabled={isSubmitting}
              >
                <span className="inline-flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Close
                </span>
              </Button>
            </Modal.Header>

            <Modal.Body className="space-y-5 px-6 py-6">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13.125px] text-slate-700">
                <p className="font-medium text-slate-900">
                  Creator request reason
                </p>
                <p className="mt-2">
                  {market?.cancel_request_reason ||
                    "No cancellation reason provided."}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-[13.125px] font-medium text-slate-700">
                  Admin action note
                </label>
                <Input
                  value={adminAction}
                  onChange={(event) => setAdminAction(event.target.value)}
                  placeholder={`Optional note for ${isApprove ? "approval" : "rejection"}`}
                  disabled={isSubmitting}
                  variant="primary"
                  fullWidth
                />
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13.125px] text-rose-700">
                  {error}
                </div>
              ) : null}
            </Modal.Body>

            <Modal.Footer className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-5">
              <Button
                variant="outline"
                onPress={onClose}
                isDisabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                className="text-white"
                style={{ backgroundColor: isApprove ? "#5B5EF4" : "#dc2626" }}
                onPress={handleSubmit}
                isDisabled={isSubmitting || !market}
              >
                <span className="inline-flex items-center gap-2">
                  {isSubmitting ? (
                    <Spinner size="sm" />
                  ) : isApprove ? (
                    <ShieldCheck className="h-4 w-4" />
                  ) : (
                    <CircleOff className="h-4 w-4" />
                  )}
                  {isApprove ? "Approve cancellation" : "Reject cancellation"}
                </span>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
