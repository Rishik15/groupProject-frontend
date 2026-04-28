export type AdminReportBucket = "open" | "closed";

export type AdminReportStatus =
  | "open"
  | "closed"
  | "resolved"
  | "dismissed"
  | "reviewing"
  | (string & {});

export interface AdminReport {
  id: number;
  report_id: number;
  reported_user_id: number;
  reporter_user_id: number;
  title: string;
  description: string;
  status: AdminReportStatus;
  admin_action: string | null;
  submittedLabel?: string | null;
  updated_at?: string | null;
}

export interface GetReportsPayload {
  status: AdminReportBucket;
}

export interface CloseReportPayload {
  report_id: number;
  admin_action: string;
}

export interface GetReportsResponse {
  message: string;
  reports: AdminReport[];
}

export interface CloseReportResponse {
  message: string;
  report: {
    report_id: number;
    status: AdminReportStatus;
    admin_action: string | null;
  };
}
