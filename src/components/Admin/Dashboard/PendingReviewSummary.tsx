import { Card } from "@heroui/react";
import { FileWarning, ShieldAlert, TriangleAlert } from "lucide-react";
import type { AdminDashboardStats } from "../../../utils/Interfaces/Admin/adminDashboard";

interface PendingReviewSummaryProps {
  stats: AdminDashboardStats;
}

const PendingReviewSummary = ({ stats }: PendingReviewSummaryProps) => {
  const hasReviewBacklog = stats.pending_reviews > 0;

  return (
    <section className="space-y-4" aria-labelledby="dashboard-review-heading">
      <div>
        <h2 id="dashboard-review-heading" className="text-xl font-semibold text-default-900">
          Pending Review Summary
        </h2>
        <p className="mt-1 text-sm text-default-600">
          Breakdown of the current moderation backlog. Detailed handling happens in the dedicated pages.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr]">
        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex h-full flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-[18px] border border-default-200 bg-default-50 p-3">
                <TriangleAlert className="h-5 w-5 text-default-700" />
              </div>
              <div>
                <p className="text-sm font-medium text-default-600">Review backlog status</p>
                <p className="text-2xl font-semibold tracking-tight text-default-900">
                  {stats.pending_reviews.toLocaleString()} items pending
                </p>
              </div>
            </div>

            <p className="text-sm leading-6 text-default-500">
              {hasReviewBacklog
                ? "There are moderation items waiting for action. Use the quick navigation buttons above to jump into the correct workflow."
                : "There is no current moderation backlog. The dashboard is clear right now."}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[20px] border border-default-200 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-default-700">
                  <ShieldAlert className="h-4 w-4" />
                  Coach applications
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-default-900">
                  {stats.pending_coach_applications.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-default-500">
                  Approval and rejection decisions waiting in Coach Governance.
                </p>
              </div>

              <div className="rounded-[20px] border border-default-200 p-4">
                <div className="flex items-center gap-2 text-sm font-medium text-default-700">
                  <FileWarning className="h-4 w-4" />
                  Open reports
                </div>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-default-900">
                  {stats.open_reports.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-default-500">
                  Reports still waiting for admin closure or follow-up.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex h-full flex-col justify-between gap-3 p-5">
            <div>
              <p className="text-sm font-medium text-default-600">Coach application share</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-default-900">
                {stats.pending_reviews === 0
                  ? "0%"
                  : `${Math.round((stats.pending_coach_applications / stats.pending_reviews) * 100)}%`}
              </p>
            </div>
            <p className="text-sm leading-6 text-default-500">
              Portion of the backlog driven by coach onboarding requests.
            </p>
          </div>
        </Card>

        <Card className="rounded-[24px] border border-default-200 bg-white shadow-sm">
          <div className="flex h-full flex-col justify-between gap-3 p-5">
            <div>
              <p className="text-sm font-medium text-default-600">Report share</p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-default-900">
                {stats.pending_reviews === 0
                  ? "0%"
                  : `${Math.round((stats.open_reports / stats.pending_reviews) * 100)}%`}
              </p>
            </div>
            <p className="text-sm leading-6 text-default-500">
              Portion of the backlog driven by moderation reports from users or coaches.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default PendingReviewSummary;
