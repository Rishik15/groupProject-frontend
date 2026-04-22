import { Button, Card } from "@heroui/react";
import { CheckCircle2, ClipboardList, XCircle } from "lucide-react";
import { formatAdminCurrency, formatAdminDateTime, formatCoachApplicationStatusLabel } from "../../../../utils/Admin/adminFormatters";
import type { AdminCoachApplication } from "../../../../utils/Interfaces/Admin/adminCoachApplication";

type ActionMode = "approve" | "reject" | null;

interface ApplicationActionPanelProps {
  selectedApplication: AdminCoachApplication | null;
  actionMode: ActionMode;
  adminAction: string;
  submitting: boolean;
  actionError: string | null;
  onAdminActionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ApplicationActionPanel = ({
  selectedApplication,
  actionMode,
  adminAction,
  submitting,
  actionError,
  onAdminActionChange,
  onSubmit,
  onCancel,
}: ApplicationActionPanelProps) => {
  const hasSelection = Boolean(selectedApplication && actionMode);

  return (
    <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
            Application action panel
          </p>
          <p className="mt-1 text-sm text-default-600">
            Select an application card action to load the moderation form here.
          </p>
        </div>

        {hasSelection && selectedApplication ? (
          <>
            <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
              <p className="text-sm font-semibold text-default-900">
                {selectedApplication.name || selectedApplication.email}
              </p>
              <p className="mt-1 text-sm text-default-600">{selectedApplication.email}</p>
              <div className="mt-3 space-y-1 text-sm text-default-600">
                <p>
                  <span className="font-medium text-default-800">Status:</span>{" "}
                  {formatCoachApplicationStatusLabel(selectedApplication.status)}
                </p>
                <p>
                  <span className="font-medium text-default-800">Applied:</span>{" "}
                  {formatAdminDateTime(selectedApplication.appliedLabel)}
                </p>
                <p>
                  <span className="font-medium text-default-800">Desired price:</span>{" "}
                  {formatAdminCurrency(selectedApplication.desired_price)}
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
                {actionMode === "approve" ? "Approve application" : "Reject application"}
              </div>
              <p className="mt-2 text-sm text-default-600">
                Record the review note that should be stored with this application decision.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-default-700" htmlFor="application-admin-action">
                Admin note
              </label>
              <textarea
                id="application-admin-action"
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
              <Button className={"bg-[#5B5EF4]"} onPress={onSubmit} isDisabled={submitting}>
                {submitting ? "Saving..." : "Confirm action"}
              </Button>
              <Button className={"bg-[#5B5EF4]"} onPress={onCancel} isDisabled={submitting}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
            <div className="inline-flex items-center gap-2 font-medium text-default-800">
              <ClipboardList className="h-4 w-4" />
              No active application selection
            </div>
            <p className="mt-2">
              Use Approve or Reject on a pending application card to load the action panel.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ApplicationActionPanel;
