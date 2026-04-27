import { Button } from "@heroui/react";
import { FileWarning } from "lucide-react";
import { formatAdminDateTime } from "../../../utils/Admin/adminFormatters";
import type { AdminReport } from "../../../utils/Interfaces/Admin/adminReport";

interface ReportCardProps {
  report: AdminReport;
  isSelected?: boolean;
  showCloseAction?: boolean;
  onSelect?: (report: AdminReport) => void;
  onClose?: (report: AdminReport) => void;
}

const toLabel = (value: string | null | undefined) => {
  if (!value) return "—";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const ReportCard = ({
  report,
  isSelected = false,
  showCloseAction = false,
  onSelect,
  onClose,
}: ReportCardProps) => {
  return (
    <div
      className={`rounded-[20px] border p-5 transition ${
        isSelected
          ? "border-default-900 bg-white shadow-sm"
          : "border-default-200 bg-default-50"
      }`}
    >
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-default-200 bg-white px-3 py-1 text-xs font-medium text-default-700">
              <FileWarning className="h-3.5 w-3.5" />
              {toLabel(report.status)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-default-900">
                {report.title}
              </h3>
              <p className="mt-1 line-clamp-3 text-sm text-default-600">
                {report.description}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1 text-sm text-default-600">
          <p>
            <span className="font-medium text-default-800">Report ID:</span>{" "}
            {report.report_id}
          </p>
          <p>
            <span className="font-medium text-default-800">Reporter:</span>{" "}
            {report.reporter_user_id}
          </p>
          <p>
            <span className="font-medium text-default-800">Reported user:</span>{" "}
            {report.reported_user_id}
          </p>
          <p>
            <span className="font-medium text-default-800">Submitted:</span>{" "}
            {formatAdminDateTime(
              report.submittedLabel ?? report.updated_at ?? null,
            )}
          </p>
          <p>
            <span className="font-medium text-default-800">Admin note:</span>{" "}
            {report.admin_action ?? "—"}
          </p>
        </div>

        <div className="mt-auto flex flex-wrap gap-2 border-t border-default-200 pt-4">
          <Button className={"bg-[#5B5EF4]"} onPress={() => onSelect?.(report)}>
            View details
          </Button>

          {showCloseAction ? (
            <Button
              className={"bg-[#5B5EF4]"}
              onPress={() => onClose?.(report)}
            >
              Close report
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
