import { adminPatch, adminPost } from "../../utils/Admin/adminApi";
import type {
  CloseReportPayload,
  CloseReportResponse,
  GetReportsPayload,
  GetReportsResponse,
} from "../../utils/Interfaces/Admin";

export const getReports = (payload: GetReportsPayload) => {
  return adminPost<GetReportsResponse, GetReportsPayload>(
    "/reports/list",
    payload,
  );
};

export const closeReport = (payload: CloseReportPayload) => {
  return adminPatch<CloseReportResponse, CloseReportPayload>(
    "/reports/close",
    payload,
  );
};

const adminReportService = {
  getReports,
  closeReport,
};

export default adminReportService;
