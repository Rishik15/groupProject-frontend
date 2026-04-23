import { Button, Card } from "@heroui/react";
import { FileCheck } from "lucide-react";
import { formatAdminDateTime } from "../../../utils/Admin/adminFormatters";
import type { AdminReport } from "../../../utils/Interfaces/Admin/adminReport";

interface ReportActionPanelProps {
  selectedReport: AdminReport | null;
  adminAction: string;
  submitting: boolean;
  actionError: string | null;
  onAdminActionChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const ReportActionPanel = ({
  selectedReport,
  adminAction,
  submitting,
  actionError,
  onAdminActionChange,
  onSubmit,
  onCancel,
}: ReportActionPanelProps) => {
  return (
    <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
      <div className="space-y-4 p-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
            Report action panel
          </p>
          <p className="mt-1 text-sm text-default-600">
            Select an open report to document the moderation outcome and move it
            into the closed history bucket.
          </p>
        </div>

        {selectedReport ? (
          <>
            <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
              <p className="text-sm font-semibold text-default-900">{selectedReport.title}</p>
              <p className="mt-1 text-sm text-default-600">{selectedReport.description}</p>
              <div className="mt-3 space-y-1 text-sm text-default-600">
                <p>
                  <span className="font-medium text-default-800">Report ID:</span>{" "}
                  {selectedReport.report_id}
                </p>
                <p>
                  <span className="font-medium text-default-800">Submitted:</span>{" "}
                  {formatAdminDateTime(
                    selectedReport.submittedLabel ?? selectedReport.updated_at ?? null,
                  )}
                </p>
              </div>
            </div>

            <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-default-800">
                <FileCheck className="h-4 w-4" />
                Close report
              </div>
              <p className="mt-2 text-sm text-default-600">
                Provide the admin action note that should be stored when this report
                is closed.
              </p>
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium text-default-700"
                htmlFor="report-admin-action"
              >
                Admin action
              </label>
              <textarea
                id="report-admin-action"
                value={adminAction}
                onChange={(event) => onAdminActionChange(event.target.value)}
                rows={6}
                className="w-full rounded-[18px] border border-default-200 px-4 py-3 text-sm outline-none transition focus:border-default-400"
                placeholder="Describe how the report was reviewed and what action was taken"
              />
            </div>

            {actionError ? (
              <div className="rounded-[18px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                {actionError}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button className={"bg-[#5B5EF4]"} onPress={onSubmit} isDisabled={submitting}>
                {submitting ? "Saving..." : "Confirm close"}
              </Button>
              <Button className={"bg-[#5B5EF4]"} onPress={onCancel} isDisabled={submitting}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
            Select a report card to review its details and close it with an admin
            note.
          </div>
        )}
      </div>
    </Card>
  );
};

export default ReportActionPanel;
