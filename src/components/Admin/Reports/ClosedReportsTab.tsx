import { Button, Card } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getReports } from "../../../services/Admin/adminReportService";
import { formatAdminDateTime } from "../../../utils/Admin/adminFormatters";
import type { AdminReport } from "../../../utils/Interfaces/Admin/adminReport";
import ReportCard from "./ReportCard";
import ReportFilterBar from "./ReportFilterBar";

const ClosedReportsTab = () => {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);

  const loadReports = async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const response = await getReports({ status: "closed" }, signal);
      setReports(response.reports ?? []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to load report history.");
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

  useEffect(() => {
    if (!selectedReport && reports.length > 0) {
      setSelectedReport(reports[0]);
    }

    if (selectedReport && !reports.some((report) => report.report_id === selectedReport.report_id)) {
      setSelectedReport(reports[0] ?? null);
    }
  }, [reports, selectedReport]);

  const filteredReports = useMemo(() => {
    const query = searchValue.trim().toLowerCase();

    if (!query) return reports;

    return reports.filter((report) =>
      [report.title, report.description, report.status, report.admin_action]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query)),
    );
  }, [reports, searchValue]);

  return (
    <div className="space-y-6">
      <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
        <div className="p-6">
          <ReportFilterBar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            bucket="closed"
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
              <p className="text-lg font-semibold text-default-900">Loading closed reports</p>
              <p className="mt-1 text-sm text-default-600">
                Pulling report history and previous admin actions.
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
                Unable to load closed reports
              </p>
              <p className="mt-1 text-sm text-default-600">{error}</p>
            </div>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
          <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                  Closed report history
                </p>
                <p className="mt-1 text-sm text-default-600">
                  Review previously handled reports and the admin notes stored on each one.
                </p>
              </div>

              {filteredReports.length === 0 ? (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  No closed reports matched your current search.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredReports.map((report) => (
                    <ReportCard
                      key={report.report_id}
                      report={report}
                      isSelected={selectedReport?.report_id === report.report_id}
                      onSelect={setSelectedReport}
                    />
                  ))}
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
            <div className="space-y-4 p-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-default-500">
                  Report detail
                </p>
                <p className="mt-1 text-sm text-default-600">
                  Closed reports are read-only here so moderators can review what was previously handled.
                </p>
              </div>

              {selectedReport ? (
                <>
                  <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
                    <p className="text-sm font-semibold text-default-900">{selectedReport.title}</p>
                    <p className="mt-1 text-sm text-default-600">{selectedReport.description}</p>
                  </div>

                  <div className="rounded-[20px] border border-default-200 bg-default-50 p-4">
                    <div className="space-y-2 text-sm text-default-600">
                      <p>
                        <span className="font-medium text-default-800">Report ID:</span>{" "}
                        {selectedReport.report_id}
                      </p>
                      <p>
                        <span className="font-medium text-default-800">Status:</span>{" "}
                        {selectedReport.status}
                      </p>
                      <p>
                        <span className="font-medium text-default-800">Reporter:</span>{" "}
                        {selectedReport.reporter_user_id}
                      </p>
                      <p>
                        <span className="font-medium text-default-800">Reported user:</span>{" "}
                        {selectedReport.reported_user_id}
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
                    <p className="text-sm font-medium text-default-800">Admin action note</p>
                    <p className="mt-2 text-sm text-default-600">
                      {selectedReport.admin_action ?? "No admin note was stored for this report."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button className={"bg-[#5B5EF4]"} onPress={() => setSelectedReport(null)}>Clear selection</Button>
                  </div>
                </>
              ) : (
                <div className="rounded-[20px] border border-default-200 bg-default-50 p-5 text-sm text-default-600">
                  Select a closed report card to review its details and stored admin note.
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClosedReportsTab;
