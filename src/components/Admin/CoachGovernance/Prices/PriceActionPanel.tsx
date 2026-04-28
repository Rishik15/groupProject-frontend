import { Button, Card } from "@heroui/react";
import { BadgeDollarSign, CheckCircle2, XCircle } from "lucide-react";
import {
  formatAdminCurrency,
  formatAdminDateTime,
} from "../../../../utils/Admin/adminFormatters";
import type { AdminCoachPriceRequest } from "../../../../utils/Interfaces/Admin/adminCoachPrice";

type PriceActionMode = "approve" | "reject" | null;

interface PriceActionPanelProps {
  selectedRequest: AdminCoachPriceRequest | null;
  actionMode: PriceActionMode;
  adminAction: string;
  submitting: boolean;
  actionError: string | null;
  onAdminActionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const PriceActionPanel = ({
  selectedRequest,
  actionMode,
  adminAction,
  submitting,
  actionError,
  onAdminActionChange,
  onSubmit,
  onCancel,
}: PriceActionPanelProps) => {
  const hasSelection = Boolean(selectedRequest && actionMode);

  return (
    <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
            Price action panel
          </p>
          <p className="mt-1 text-sm text-default-600">
            Select a price request card action to load the moderation form here.
          </p>
        </div>

        {hasSelection && selectedRequest ? (
          <>
            <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
              <p className="text-sm font-semibold text-default-900">
                {selectedRequest.coach_name}
              </p>
              <p className="mt-1 text-sm text-default-600">
                Coach ID: {selectedRequest.coach_id}
              </p>
              <div className="mt-3 space-y-1 text-sm text-default-600">
                <p>
                  <span className="font-medium text-default-800">
                    Current price:
                  </span>{" "}
                  {formatAdminCurrency(selectedRequest.current_price)}
                </p>
                <p>
                  <span className="font-medium text-default-800">
                    Proposed price:
                  </span>{" "}
                  {formatAdminCurrency(selectedRequest.proposed_price)}
                </p>
                <p>
                  <span className="font-medium text-default-800">
                    Requested:
                  </span>{" "}
                  {formatAdminDateTime(selectedRequest.created_at)}
                </p>
              </div>
            </div>

            <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-default-800">
                {actionMode === "approve" ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {actionMode === "approve"
                  ? "Approve price request"
                  : "Reject price request"}
              </div>
              <p className="mt-2 text-sm text-default-600">
                Record the review note that should be attached to this price
                decision.
              </p>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-default-700"
                htmlFor="price-admin-action"
              >
                Admin note
              </label>
              <textarea
                id="price-admin-action"
                value={adminAction}
                onChange={(event) => onAdminActionChange(event.target.value)}
                rows={5}
                className="w-full rounded-[18px] border border-default-200 px-4 py-3 text-sm outline-none transition focus:border-default-400"
                placeholder="Document the approval or rejection reason"
              />
            </div>

            {actionError ? (
              <div className="rounded-[18px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                {actionError}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button onPress={onSubmit} isDisabled={submitting}>
                {submitting ? "Saving..." : "Confirm action"}
              </Button>
              <Button onPress={onCancel} isDisabled={submitting}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
            <div className="inline-flex items-center gap-2 font-medium text-default-800">
              <BadgeDollarSign className="h-4 w-4" />
              No active price request selection
            </div>
            <p className="mt-2">
              Use Approve or Reject on a pending price request card to load the
              action panel.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PriceActionPanel;
