import { Button, Card } from "@heroui/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
    AdminDashboardStats,
    AdminEngagementAnalytics,
} from "../../utils/Interfaces/Admin/adminDashboard";
import {
    getDashboardStats,
    getEngagementAnalytics,
} from "../../services/Admin/adminDashboardService";
import AdminDashboardHeader from "../../components/Admin/Dashboard/Header";
import StatsCards from "../../components/Admin/Dashboard/StatsCards";
import EngagementAnalytics from "../../components/Admin/Dashboard/EngagementAnalytics";
import PendingReviewSummary from "../../components/Admin/Dashboard/PendingReviewSummary";

const Dashboard = () => {
    const navigate = useNavigate();

    const overviewRef = useRef<HTMLDivElement | null>(null);
    const engagementRef = useRef<HTMLDivElement | null>(null);
    const reviewsRef = useRef<HTMLDivElement | null>(null);

    const [stats, setStats] = useState<AdminDashboardStats | null>(null);
    const [analytics, setAnalytics] = useState<AdminEngagementAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadDashboard = async (signal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);

        try {
            const [statsResult, analyticsResult] = await Promise.allSettled([
                getDashboardStats(signal),
                getEngagementAnalytics(signal),
            ]);

            if (signal?.aborted) {
                return;
            }

            if (statsResult.status !== "fulfilled" || !statsResult.value?.stats) {
                throw new Error("Dashboard stats response was empty.");
            }

            setStats(statsResult.value.stats);

            if (
                analyticsResult.status === "fulfilled" &&
                analyticsResult.value?.analytics
            ) {
                setAnalytics(analyticsResult.value.analytics);
            } else {
                setAnalytics(null);
            }
        } catch (err) {
            if (err instanceof DOMException && err.name === "AbortError") {
                return;
            }

            const message =
                err instanceof Error ? err.message : "Failed to load dashboard data.";

            setError(message);
            setStats(null);
            setAnalytics(null);
        } finally {
            if (!signal?.aborted) {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        void loadDashboard(controller.signal);

        return () => controller.abort();
    }, []);

    const scrollToSection = (element: HTMLDivElement | null) => {
        element?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div className="min-h-[calc(100vh-56px)] bg-default-50 px-36 py-8">
            <div className="space-y-6">
                <AdminDashboardHeader
                    onNavigateToAccounts={() => navigate("/admin/accounts")}
                    onNavigateToCoachGovernance={() =>
                        navigate("/admin/coach-governance")
                    }
                    onNavigateToReports={() => navigate("/admin/reports")}
                    onNavigateToExercises={() => navigate("/admin/exercises")}
                    onNavigateToWorkouts={() => navigate("/admin/workouts")}
                    onScrollToOverview={() => scrollToSection(overviewRef.current)}
                    onScrollToEngagement={() => scrollToSection(engagementRef.current)}
                    onScrollToReviews={() => scrollToSection(reviewsRef.current)}
                />

                {isLoading ? (
                    <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                        <div className="flex items-center justify-between gap-4 p-6">
                            <div>
                                <p className="text-lg font-semibold text-default-900">
                                    Loading dashboard
                                </p>
                                <p className="mt-1 text-sm text-default-600">
                                    Pulling stats and engagement metrics from the admin endpoints.
                                </p>
                            </div>
                            <RefreshCw className="h-5 w-5 animate-spin text-default-500" />
                        </div>
                    </Card>
                ) : error ? (
                    <Card className="rounded-[24px] border border-danger/20 bg-white shadow-sm">
                        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-danger/10 p-2 text-danger">
                                    <AlertCircle className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-default-900">
                                        Unable to load the dashboard
                                    </p>
                                    <p className="mt-1 text-sm text-default-600">{error}</p>
                                </div>
                            </div>

                            <Button onPress={() => void loadDashboard()}>Retry</Button>
                        </div>
                    </Card>
                ) : stats ? (
                    <>
                        <div ref={overviewRef}>
                            <StatsCards stats={stats} />
                        </div>

                        <div ref={engagementRef}>
                            {analytics ? (
                                <EngagementAnalytics analytics={analytics} />
                            ) : (
                                <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
                                    <div className="p-6">
                                        <p className="text-lg font-semibold text-default-900">
                                            Engagement analytics unavailable
                                        </p>
                                        <p className="mt-1 text-sm text-default-600">
                                            Dashboard stats loaded successfully, but the analytics
                                            endpoint is not currently available on the backend.
                                        </p>
                                    </div>
                                </Card>
                            )}
                        </div>

                        <div ref={reviewsRef}>
                            <PendingReviewSummary
                                stats={stats}
                                onNavigateToCoachGovernance={() =>
                                    navigate("/admin/coach-governance")
                                }
                                onNavigateToReports={() => navigate("/admin/reports")}
                            />
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
};

export default Dashboard;