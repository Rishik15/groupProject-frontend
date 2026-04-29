import { adminPatch, adminPost } from "../../utils/Admin/adminApi";
import type {
  CloseReportPayload,
  CloseReportResponse,
  GetReportsPayload,
  GetReportsResponse,
} from "../../utils/Interfaces/Admin";

export const getReports = (
  payload: GetReportsPayload,
  signal?: AbortSignal,
) => {
  return adminPost<GetReportsResponse, GetReportsPayload>(
    "/reports/list",
    payload,
    signal,
  );
};

export const closeReport = (
  payload: CloseReportPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<CloseReportResponse, CloseReportPayload>(
    "/reports/close",
    payload,
    signal,
  );
};

const adminReportService = {
  getReports,
  closeReport,
};

export default adminReportService;
