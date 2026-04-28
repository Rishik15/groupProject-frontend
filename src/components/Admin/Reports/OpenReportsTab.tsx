import { Card } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  closeReport,
  getReports,
} from "../../../services/Admin/adminReportService";
import type {
  AdminReport,
  CloseReportPayload,
} from "../../../utils/Interfaces/Admin/adminReport";
import ReportActionPanel from "./ReportActionPanel";
import ReportCard from "./ReportCard";
import ReportFilterBar from "./ReportFilterBar";

const OpenReportsTab = () => {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(
    null,
  );
  const [adminAction, setAdminAction] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const actionIsOpen = Boolean(selectedReport);

  const loadReports = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getReports({ status: "open" }, signal);
      setReports(response.reports ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to load reports.");
      setReports([]);
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    void loadReports(controller.signal);
    return () => controller.abort();
  }, []);

  const filteredReports = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return reports;

    return reports.filter((report) =>
      [report.title, report.description, report.status, report.admin_action]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query)),
    );
  }, [reports, searchValue]);

  const openAction = (report: AdminReport) => {
    setSelectedReport(report);
    setAdminAction(report.admin_action ?? "");
    setActionError(null);
  };

  const closeAction = () => {
    setSelectedReport(null);
    setAdminAction("");
    setActionError(null);
  };

  const submitClose = async () => {
    if (!selectedReport) return;

    if (!adminAction.trim()) {
      setActionError("An admin action note is required to close the report.");
      return;
    }

    setSubmitting(true);
    setActionError(null);

    try {
      const payload: CloseReportPayload = {
        report_id: selectedReport.report_id,
        admin_action: adminAction.trim(),
      };

      await closeReport(payload);
      closeAction();
      await loadReports();
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to close the report.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
        <div className="p-6">
          <ReportFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            bucket="open"
            onBucketChange={() => undefined}
            onRefresh={() => void loadReports()}
            isRefreshing={loading}
            visibleCount={filteredReports.length}
            totalCount={reports.length}
          />
        </div>
      </Card>

      {loading ? (
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-4 p-6">
            <div>
              <p className="text-lg font-semibold text-default-900">
                Loading reports
              </p>
              <p className="mt-1 text-sm text-default-600">
                Pulling the open report moderation queue.
              </p>
            </div>
            <RefreshCw className="h-5 w-5 animate-spin text-default-500" />
          </div>
        </Card>
      ) : error ? (
        <Card className="rounded-[24px] border border-danger/20 bg-white shadow-sm">
          <div className="flex items-start gap-3 p-6">
            <div className="rounded-full bg-danger/10 p-2 text-danger">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="text-lg font-semibold text-default-900">
                Unable to load reports
              </p>
              <p className="mt-1 text-sm text-default-600">{error}</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
          <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                    Open moderation queue
                  </p>
                  <p className="mt-1 text-sm text-default-600">
                    {actionIsOpen
                      ? "The queue is paused while you finish the selected close action."
                      : "Review open reports and move them into the closed history after investigation."}
                  </p>
                </div>
              </div>

              {actionIsOpen ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  <p className="font-medium text-default-800">
                    Queue paused for active moderation
                  </p>
                  <p className="mt-2">
                    Finish or cancel the current action on{" "}
                    <span className="font-medium text-default-800">
                      {selectedReport?.title}
                    </span>{" "}
                    to return to the full report queue.
                  </p>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  No open reports matched your current search.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredReports.map((report) => (
                    <ReportCard
                      key={report.report_id}
                      report={report}
                      showCloseAction
                      onSelect={openAction}
                      onClose={openAction}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          <ReportActionPanel
            selectedReport={selectedReport}
            adminAction={adminAction}
            submitting={submitting}
            actionError={actionError}
            onAdminActionChange={setAdminAction}
            onSubmit={() => void submitClose()}
            onCancel={closeAction}
          />
        </div>
      )}
    </div>
  );
};

export default OpenReportsTab;
