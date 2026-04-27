import { Card, Spinner } from "@heroui/react";
import { CheckCheck } from "lucide-react";
import PredictionModerationTabs, {
  type PredictionModerationTabKey,
} from "../Tabs/PredictionModerationTabs";
import PredictionReviewTab from "../Tabs/PredictionReviewTab";
import PredictionSettlementTab from "../Tabs/PredictionSettlementTab";
import PredictionCancelReviewTab from "../Tabs/PredictionCancelReviewTab";
import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";

type PredictionAdminContentProps = {
  activeTab: PredictionModerationTabKey;
  reviewMarkets: PredictionMarket[];
  settlementMarkets: PredictionMarket[];
  cancelReviewMarkets: PredictionMarket[];
  pendingMarketId?: number | null;
  pageError?: string | null;
  isLoading?: boolean;
  onTabChange: (tab: PredictionModerationTabKey) => void;
  onApprove: (market: PredictionMarket) => void;
  onReject: (market: PredictionMarket) => void;
  onOpenSettlement: (market: PredictionMarket) => void;
  onApproveCancel: (market: PredictionMarket) => void;
  onRejectCancel: (market: PredictionMarket) => void;
};

export default function PredictionAdminContent({
  activeTab,
  reviewMarkets,
  settlementMarkets,
  cancelReviewMarkets,
  pendingMarketId = null,
  pageError = null,
  isLoading = false,
  onTabChange,
  onApprove,
  onReject,
  onOpenSettlement,
  onApproveCancel,
  onRejectCancel,
}: PredictionAdminContentProps) {
  return (
    <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-slate-100 p-6">
        <div className="rounded-xl bg-[#EEF0FF] p-2 text-[#5B5EF4]">
          <CheckCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-[18.75px] font-semibold text-slate-900">
            Moderation queues
          </h2>
          <p className="text-[13.125px] text-slate-500">
            Manage review, settlement, and cancellation decisions against the
            finalized backend contract.
          </p>
        </div>
      </div>

      <div className="space-y-6 p-6">
        <PredictionModerationTabs
          activeTab={activeTab}
          onChange={onTabChange}
        />

        {pageError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-[13.125px] text-rose-700">
            {pageError}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex min-h-[280px] items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : activeTab === "review" ? (
          <PredictionReviewTab
            markets={reviewMarkets}
            pendingMarketId={pendingMarketId}
            onApprove={onApprove}
            onReject={onReject}
          />
        ) : activeTab === "pending-settlement" ? (
          <PredictionSettlementTab
            markets={settlementMarkets}
            pendingMarketId={pendingMarketId}
            onOpenSettlement={onOpenSettlement}
          />
        ) : (
          <PredictionCancelReviewTab
            markets={cancelReviewMarkets}
            pendingMarketId={pendingMarketId}
            onApproveCancel={onApproveCancel}
            onRejectCancel={onRejectCancel}
          />
        )}
      </div>
    </Card>
  );
}
