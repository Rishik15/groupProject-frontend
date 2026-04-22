import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    DollarSign,
    TriangleAlert,
    UserCheck,
    Users,
} from "lucide-react";
import AdminDashboardHeader from "../../components/Admin/Dashboard/Header";
import ReviewQueueSection from "../../components/Admin/Dashboard/ReviewQueueSection";
import AdminStatsSection, {
    type StatCardData,
} from "../../components/Admin/Dashboard/StatSection";
import type {
    ApplicationReviewItem,
    ReportReviewItem,
} from "../../utils/Interfaces/Admin/reviewQueue";
import {
    approveCoachApplication,
    closeAdminReport,
    formatCurrencyCompact,
    getAdminReports,
    getCoachApplications,
    getDashboardStats,
    rejectCoachApplication,
    type AdminDashboardStats,
} from "../../services/Admin/adminDashboardService";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [applications, setApplications] = useState<ApplicationReviewItem[]>([]);
    const [reports, setReports] = useState<ReportReviewItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const loadDashboard = useCallback(async () => {
        try {
            setError(null);

            const [statsData, applicationsData, reportsData] = await Promise.all([
                getDashboardStats(),
                getCoachApplications("pending"),
                getAdminReports("open"),
            ]);

            setStats(statsData);
            setApplications(applicationsData);
            setReports(reportsData);
        } catch (err) {
            console.error(err);
            setError("Failed to load admin dashboard.");
        } finally {
            setLoading(false);
            setBusy(false);
        }
    }, []);

    useEffect(() => {
        void loadDashboard();
    }, [loadDashboard]);

    const statCards = useMemo<StatCardData[]>(() => {
        if (!stats) return [];

        return [
            {
                id: "total-users",
                title: "Total Users",
                value: stats.total_users.toLocaleString(),
                helperText: "Registered accounts",
                icon: Users,
                tone: "default",
            },
            {
                id: "active-coaches",
                title: "Active Coaches",
                value: stats.active_coaches.toLocaleString(),
                helperText: "Currently active",
                icon: UserCheck,
                tone: "default",
            },
            {
                id: "pending-reviews",
                title: "Pending Reviews",
                value: stats.pending_reviews.toLocaleString(),
                helperText: `${stats.pending_coach_applications} coach apps · ${stats.open_reports} reports`,
                icon: TriangleAlert,
                tone: "default",
            },
            {
                id: "monthly-revenue",
                title: "Monthly Revenue",
                value: formatCurrencyCompact(stats.monthly_revenue),
                helperText: "Active contracts",
                icon: DollarSign,
                tone: "default",
            },
        ];
    }, [stats]);

    const handleApprove = async (application: ApplicationReviewItem) => {
        const applicationId = Number(application.application_id ?? application.id);
        if (Number.isNaN(applicationId)) return;

        try {
            setBusy(true);
            await approveCoachApplication(applicationId);
            await loadDashboard();
        } catch (err) {
            console.error(err);
            setBusy(false);
            setError("Failed to approve coach application.");
        }
    };

    const handleReject = async (application: ApplicationReviewItem) => {
        const applicationId = Number(application.application_id ?? application.id);
        if (Number.isNaN(applicationId)) return;

        try {
            setBusy(true);
            await rejectCoachApplication(applicationId);
            await loadDashboard();
        } catch (err) {
            console.error(err);
            setBusy(false);
            setError("Failed to reject coach application.");
        }
    };

    const handleCloseReport = async (report: ReportReviewItem) => {
        const reportId = Number(report.report_id ?? report.id);
        if (Number.isNaN(reportId)) return;

        try {
            setBusy(true);
            await closeAdminReport(reportId);
            await loadDashboard();
        } catch (err) {
            console.error(err);
            setBusy(false);
            setError("Failed to close report.");
        }
    };

    return (
        <div className="min-h-screen bg-default-50">
            <AdminDashboardHeader
                onViewAllUsers={() => navigate("/admin/users")}
                onViewAllActiveCoaches={() => navigate("/admin/coaches")}
                onViewExerciseReview={() => navigate("/admin/exercises")}
            />

            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
                {error ? (
                    <div className="mb-4 rounded-[16px] border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                        {error}
                    </div>
                ) : null}

                {loading ? (
                    <div className="text-sm text-[#72728A]">Loading admin dashboard...</div>
                ) : (
                    <div className="space-y-6">
                        <AdminStatsSection stats={statCards} />

                        <ReviewQueueSection
                            applications={applications}
                            reports={reports}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onCloseReport={handleCloseReport}
                            onViewClosedReports={() => navigate("/admin/reports/closed")}
                        />

                        {busy ? (
                            <div className="text-xs text-[#72728A]">Updating dashboard...</div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;