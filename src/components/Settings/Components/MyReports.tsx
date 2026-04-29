import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import { CheckCircle, Clock, FileText } from "lucide-react";
import {
  getMyReports,
  type ClientReport,
} from "../../../services/Setting/reports";

const formatDate = (value: string | null) => {
  if (!value) return "";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getStatusInfo = (status: string) => {
  if (status === "resolved") {
    return {
      label: "Reviewed",
      className: "bg-green-50 text-green-700",
      icon: <CheckCircle className="h-4 w-4" />,
    };
  }

  return {
    label: "Under Review",
    className: "bg-yellow-50 text-yellow-700",
    icon: <Clock className="h-4 w-4" />,
  };
};

export default function MyReports() {
  const [reports, setReports] = useState<ClientReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        const data = await getMyReports();
        setReports(data);
      } catch (err) {
        console.error("Failed to load reports", err);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  return (
    <Card className="w-full max-w-3xl rounded-2xl border border-[#E8E8EF] bg-white shadow-sm">
      <Card.Header className="border-b border-[#E8E8EF] px-6 py-5">
        <div>
          <h2 className="text-xl font-semibold text-[#0F0F14]">Your Reports</h2>
          <p className="mt-1 text-sm text-[#72728A]">
            Track reports you submitted and see admin responses.
          </p>
        </div>
      </Card.Header>

      <Card.Content className="flex flex-col gap-4 px-6 py-6">
        {loading ? (
          <p className="text-sm text-[#72728A]">Loading reports...</p>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#D9DBE3] bg-[#FAFAFC] px-4 py-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-[#A0A0B2]" />
            <p className="mt-3 text-sm font-medium text-[#0F0F14]">
              No reports submitted
            </p>
            <p className="mt-1 text-xs text-[#72728A]">
              Reports you file against a coach will show up here.
            </p>
          </div>
        ) : (
          reports.map((report) => {
            const statusInfo = getStatusInfo(report.status);

            return (
              <div
                key={report.report_id}
                className="rounded-2xl border border-[#E8E8EF] bg-[#FAFAFC] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0F0F14]">
                      Report against {report.reported_name || "Coach"}
                    </p>

                    <p className="mt-1 text-xs text-[#72728A]">
                      Submitted {formatDate(report.created_at)}
                    </p>
                  </div>

                  <div
                    className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${statusInfo.className}`}
                  >
                    {statusInfo.icon}
                    {statusInfo.label}
                  </div>
                </div>

                <div className="mt-4 grid gap-3">
                  <div>
                    <p className="text-xs font-medium text-[#72728A]">Reason</p>
                    <p className="mt-1 text-sm text-[#0F0F14]">
                      {report.reason || "No reason provided"}
                    </p>
                  </div>

                  {report.description && (
                    <div>
                      <p className="text-xs font-medium text-[#72728A]">
                        Your Details
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-[#0F0F14]">
                        {report.description}
                      </p>
                    </div>
                  )}

                  {report.admin_action && (
                    <div className="rounded-xl border border-green-100 bg-white p-3">
                      <p className="text-xs font-medium text-green-700">
                        Admin Response
                      </p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-[#0F0F14]">
                        {report.admin_action}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </Card.Content>
    </Card>
  );
}
