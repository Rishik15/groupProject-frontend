import React from "react";
import { Button, Input, Modal, Spinner } from "@heroui/react";
import { Scale, X } from "lucide-react";
import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";

export type PredictionSettlementResult = "yes" | "no" | "cancelled";

export interface PredictionSettlementModalProps {
  isOpen: boolean;
  market?: PredictionMarket | null;
  isSubmitting?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (payload: {
    market_id: number;
    result: PredictionSettlementResult;
    admin_action?: string;
  }) => void | Promise<void>;
}

export default function PredictionSettlementModal({
  isOpen,
  market,
  isSubmitting = false,
  error,
  onClose,
  onSubmit,
}: PredictionSettlementModalProps) {
  const [result, setResult] = React.useState<PredictionSettlementResult>("yes");
  const [adminAction, setAdminAction] = React.useState("");

  React.useEffect(() => {
    if (!isOpen) return;
    setResult("yes");
    setAdminAction("");
  }, [isOpen, market?.market_id]);

  const handleSubmit = async () => {
    if (!market) return;
    await onSubmit({
      market_id: market.market_id,
      result,
      admin_action: adminAction.trim() || undefined,
    });
  };

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
            aria-label="Settle prediction market"
            className="rounded-3xl"
          >
            <Modal.Header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-3 py-1 text-[11.25px] font-semibold text-[#5B5EF4]">
                  <Scale className="h-4 w-4" />
                  Settlement
                </div>
                <h2 className="text-[18.75px] font-semibold text-slate-900">
                  Settle market
                </h2>
                <p className="text-[13.125px] text-slate-500">
                  Choose the verified result for{" "}
                  {market?.title ?? "this market"}.
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
              <div className="grid gap-3 sm:grid-cols-3">
                {(["yes", "no", "cancelled"] as const).map((option) => {
                  const isSelected = result === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => setResult(option)}
                      className={`rounded-2xl border px-4 py-4 text-left transition ${
                        isSelected
                          ? "border-[#5B5EF4] bg-[#EEF0FF] text-slate-900"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      <div className="text-[13.125px] font-semibold capitalize">
                        {option}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="text-[13.125px] font-medium text-slate-700">
                  Admin action note
                </label>
                <Input
                  value={adminAction}
                  onChange={(event) => setAdminAction(event.target.value)}
                  placeholder="Optional note for the settlement record"
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
                style={{ backgroundColor: "#5B5EF4" }}
                onPress={handleSubmit}
                isDisabled={isSubmitting || !market}
              >
                <span className="inline-flex items-center gap-2">
                  {isSubmitting ? (
                    <Spinner size="sm" />
                  ) : (
                    <Scale className="h-4 w-4" />
                  )}
                  Confirm settlement
                </span>
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
