import axios from "axios";
import type {
    ApplicationReviewItem,
    CertificationDetail,
    ReportReviewItem,
} from "../../utils/Interfaces/Admin/reviewQueue";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const adminApi = axios.create({
    baseURL: `${API_BASE}/admin`,
    withCredentials: true,
});

export interface AdminDashboardStats {
    total_users: number;
    active_coaches: number;
    pending_reviews: number;
    pending_coach_applications: number;
    open_reports: number;
    monthly_revenue: number;
}

export interface AdminUser {
    user_id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    phone_number?: string | null;
    dob?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    profile_picture?: string | null;
    weight?: number | null;
    height?: number | null;
    goal_weight?: number | null;
    username?: string | null;
    is_coach: boolean;
    is_admin: boolean;
}

export interface ActiveCoach {
    user_id: number;
    first_name: string;
    last_name: string;
    name: string;
    email: string;
    phone_number?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    profile_picture?: string | null;
    weight?: number | null;
    height?: number | null;
    goal_weight?: number | null;
    coach_description?: string | null;
    price?: number | null;
    contract_count: number;
    certifications: CertificationDetail[];
}

interface StatsResponse {
    message: string;
    stats: AdminDashboardStats;
}

interface UsersResponse {
    message: string;
    users: AdminUser[];
}

interface CoachesResponse {
    message: string;
    coaches: ActiveCoach[];
}

interface CoachApplicationsResponse {
    message: string;
    applications: ApplicationReviewItem[];
}

interface CoachApplicationMutationResponse {
    message: string;
    application: ApplicationReviewItem;
}

interface ReportsResponse {
    message: string;
    reports: ReportReviewItem[];
}

interface ReportMutationResponse {
    message: string;
    report: ReportReviewItem;
}

function formatDisplayDate(value?: string | null) {
    if (!value) return "";

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) return value;

    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(parsed);
}

function formatStatusLabel(status?: string) {
    if (!status) return undefined;

    return status.charAt(0).toUpperCase() + status.slice(1);
}

function normalizeApplication(
    application: ApplicationReviewItem,
): ApplicationReviewItem {
    const appliedDate = formatDisplayDate(application.appliedLabel);
    const yearsSuffix =
        application.years_experience != null
            ? ` · ${application.years_experience}yr experience`
            : "";

    return {
        ...application,
        id: String(application.id),
        appliedLabel: appliedDate
            ? `Applied: ${appliedDate}${yearsSuffix}`
            : application.appliedLabel,
        avatarInitial:
            application.avatarInitial ?? application.name?.charAt(0) ?? undefined,
    };
}

function normalizeReport(report: ReportReviewItem): ReportReviewItem {
    const submittedDate = formatDisplayDate(report.submittedLabel);

    return {
        ...report,
        id: String(report.id),
        submittedLabel: submittedDate
            ? `Submitted: ${submittedDate}`
            : report.submittedLabel,
        statusLabel: formatStatusLabel(report.statusLabel ?? report.status),
    };
}

export function formatCurrencyCompact(value: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

export async function getDashboardStats() {
    const { data } = await adminApi.get<StatsResponse>("/dashboard/stats");
    return data.stats;
}

export async function getAdminUsers() {
    const { data } = await adminApi.get<UsersResponse>("/users");
    return data.users;
}

export async function getActiveCoaches() {
    const { data } = await adminApi.get<CoachesResponse>("/coaches/active");
    return data.coaches;
}

export async function getCoachApplications(status: "pending" | "approved" | "rejected" = "pending") {
    const { data } = await adminApi.get<CoachApplicationsResponse>("/coach-applications", {
        params: { status },
    });

    return data.applications.map(normalizeApplication);
}

export async function approveCoachApplication(
    applicationId: number,
    adminAction?: string,
) {
    const { data } = await adminApi.patch<CoachApplicationMutationResponse>(
        `/coach-applications/${applicationId}/approve`,
        { admin_action: adminAction },
    );

    return normalizeApplication(data.application);
}

export async function rejectCoachApplication(
    applicationId: number,
    adminAction?: string,
) {
    const { data } = await adminApi.patch<CoachApplicationMutationResponse>(
        `/coach-applications/${applicationId}/reject`,
        { admin_action: adminAction },
    );

    return normalizeApplication(data.application);
}

export async function getAdminReports(status: "open" | "closed" = "open") {
    const { data } = await adminApi.get<ReportsResponse>("/reports", {
        params: { status },
    });

    return data.reports.map(normalizeReport);
}

export async function closeAdminReport(reportId: number, adminAction?: string) {
    const { data } = await adminApi.patch<ReportMutationResponse>(
        `/reports/${reportId}/close`,
        { admin_action: adminAction },
    );

    return normalizeReport(data.report);
}