export interface CertificationDetail {
    cert_name: string;
    provider_name?: string | null;
    description?: string | null;
    issued_date?: string | null;
    expires_date?: string | null;
}

export interface ApplicationReviewItem {
    id: string | number;
    application_id?: number;
    user_id?: number;
    name: string;
    email: string;
    appliedLabel: string;
    certifications: string[];
    avatarInitial?: string;
    status?: "pending" | "approved" | "rejected";
    years_experience?: number | null;
    coach_description?: string | null;
    desired_price?: number | null;
    reviewed_at?: string | null;
    reviewed_by_admin_id?: number | null;
    admin_action?: string | null;
    certification_details?: CertificationDetail[];
}

export interface ReportReviewItem {
    id: string | number;
    report_id?: number;
    reported_user_id?: number;
    reporter_user_id?: number;
    title: string;
    description: string;
    submittedLabel: string;
    statusLabel?: string;
    status?: string;
    reason?: string;
    admin_action?: string | null;
    resolved_by_admin_id?: number | null;
    reported_name?: string;
    reporter_name?: string;
    created_at?: string | null;
    updated_at?: string | null;
}