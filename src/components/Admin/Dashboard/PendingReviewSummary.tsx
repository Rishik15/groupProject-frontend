import { Button, Card } from "@heroui/react";
import {
  FileWarning,
  ShieldAlert,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import type { AdminDashboardStats } from "../../../utils/Interfaces/Admin/adminDashboard";

interface PendingReviewSummaryProps {
  stats: AdminDashboardStats;
  predictionPendingReviews: number;
  totalPendingReviewsIncludingPredictions: number;
  onNavigateToCoachGovernance: () => void;
  onNavigateToReports: () => void;
  onNavigateToPredictions: () => void;
}

const formatShare = (part: number, whole: number) => {
  if (whole <= 0) {
    return "0%";
  }

  return `${Math.round((part / whole) * 100)}%`;
};

const PendingReviewSummary = ({
  stats,
  predictionPendingReviews,
  totalPendingReviewsIncludingPredictions,
  onNavigateToCoachGovernance,
  onNavigateToReports,
  onNavigateToPredictions,
}: PendingReviewSummaryProps) => {
  const hasReviewBacklog = totalPendingReviewsIncludingPredictions > 0;

  return (
    <section className="space-y-2" aria-labelledby="dashboard-review-heading">
      <div>
        <h2
          id="dashboard-review-heading"
          className="text-xl font-semibold text-default-900"
        >
          Pending Review Summary
        </h2>
        <p className="mt-1 text-sm text-default-600">
          Breakdown of the current moderation backlog. Detailed handling happens
          in the dedicated pages.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex h-full flex-col justify-between gap-3 p-5">
            <div>
              <p className="text-[13.125px] font-medium text-default-600">
                Coach application share
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-default-900">
                {formatShare(
                  stats.pending_coach_applications,
                  totalPendingReviewsIncludingPredictions,
                )}
              </p>
            </div>
            <p className="text-[13.125px] leading-6 text-default-500">
              Portion of the backlog driven by coach onboarding requests.
            </p>
          </div>
        </Card>

        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex h-full flex-col justify-between gap-3 p-5">
            <div>
              <p className="text-[13.125px] font-medium text-default-600">
                Report share
              </p>
              <p className="mt-3 text-[24px] font-semibold tracking-tight text-default-900">
                {formatShare(
                  stats.open_reports,
                  totalPendingReviewsIncludingPredictions,
                )}
              </p>
            </div>
            <p className="text-[13.125px] leading-6 text-default-500">
              Portion of the backlog driven by moderation reports from users or
              coaches.
            </p>
          </div>
        </Card>

        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex h-full flex-col justify-between gap-3 p-5">
            <div>
              <p className="text-[13.125px] font-medium text-default-600">
                Prediction review share
              </p>
              <p className="mt-3 text-[24px] font-semibold tracking-tight text-default-900">
                {formatShare(
                  predictionPendingReviews,
                  totalPendingReviewsIncludingPredictions,
                )}
              </p>
            </div>
            <p className="text-[13.125px] leading-6 text-default-500">
              Portion of the backlog driven by prediction market review,
              settlement, and cancel-review items.
            </p>
          </div>
        </Card>

        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm lg:col-span-3">
          <div className="flex h-full flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-[18px] border border-default-200 bg-default-50 p-3">
                <TriangleAlert className="h-5 w-5 text-default-700" />
              </div>
              <div>
                <p className="text-[13.125px] font-medium text-default-600">
                  Review backlog status
                </p>
                <p className="text-[24px] font-semibold tracking-tight text-default-900">
                  {totalPendingReviewsIncludingPredictions.toLocaleString()}{" "}
                  items pending
                </p>
              </div>
            </div>

            <p className="text-[13.125px] leading-6 text-default-500">
              {hasReviewBacklog
                ? "There are moderation items waiting for action. Use the buttons below to jump directly into the correct workflow."
                : "There is no current moderation backlog. The dashboard is clear right now."}
            </p>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-[20px] border border-default-200 p-4">
                <div className="flex items-center gap-2 text-[13.125px] font-medium text-default-700">
                  <ShieldAlert className="h-4 w-4" />
                  Coach applications
                </div>
                <p className="mt-3 text-[24px] font-semibold tracking-tight text-default-900">
                  {stats.pending_coach_applications.toLocaleString()}
                </p>
                <p className="mt-2 text-[13.125px] text-default-500">
                  Approval and rejection decisions waiting in Coach Governance.
                </p>
                <Button
                  className="mt-4 bg-[#5B5EF4] text-white"
                  size="sm"
                  onPress={onNavigateToCoachGovernance}
                >
                  Open Coach Governance
                </Button>
              </div>

              <div className="rounded-[20px] border border-default-200 p-4">
                <div className="flex items-center gap-2 text-[13.125px] font-medium text-default-700">
                  <FileWarning className="h-4 w-4" />
                  Open reports
                </div>
                <p className="mt-3 text-[24px] font-semibold tracking-tight text-default-900">
                  {stats.open_reports.toLocaleString()}
                </p>
                <p className="mt-2 text-[13.125px] text-default-500">
                  Reports still waiting for admin closure or follow-up.
                </p>
                <Button
                  className="mt-4 bg-[#5B5EF4] text-white"
                  size="sm"
                  onPress={onNavigateToReports}
                >
                  Open Reports
                </Button>
              </div>

              <div className="rounded-[20px] border border-default-200 p-4">
                <div className="flex items-center gap-2 text-[13.125px] font-medium text-default-700">
                  <Sparkles className="h-4 w-4" />
                  Prediction items
                </div>
                <p className="mt-3 text-[24px] font-semibold tracking-tight text-default-900">
                  {predictionPendingReviews.toLocaleString()}
                </p>
                <p className="mt-2 text-[13.125px] text-default-500">
                  Prediction reviews, settlements, and cancel-review decisions
                  waiting in Predictions moderation.
                </p>
                <Button
                  className="mt-4 bg-[#5B5EF4] text-white"
                  size="sm"
                  onPress={onNavigateToPredictions}
                >
                  Open Predictions Review
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PendingReviewSummary;
