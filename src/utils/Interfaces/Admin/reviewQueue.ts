export interface ApplicationReviewItem {
  id: string;
  name: string;
  email: string;
  appliedLabel: string;
  certifications: string[];
  avatarInitial?: string;
}

export interface ReportReviewItem {
  id: string;
  title: string;
  description: string;
  submittedLabel: string;
  statusLabel?: string;
}