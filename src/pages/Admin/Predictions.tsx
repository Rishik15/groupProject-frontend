import React from "react";
import { ClipboardCheck, Shield, ShieldAlert } from "lucide-react";
import type { PredictionModerationTabKey } from "../../components/Admin/Predictions/Tabs/PredictionModerationTabs";
import PredictionAdminContent from "../../components/Admin/Predictions/Page/PredictionAdminContent";
import PredictionAdminHeaderBlock from "../../components/Admin/Predictions/Page/PredictionAdminHeaderBlock";
import PredictionAdminModals from "../../components/Admin/Predictions/Page/PredictionAdminModals";
import {
    approvePredictionCancellation,
    approvePredictionMarket,
    getCancellationReviewMarkets,
    getMarketsInReview,
    getPendingSettlementMarkets,
    rejectPredictionCancellation,
    rejectPredictionMarket,
    settlePredictionMarket,
} from "../../services/Admin/adminPredictionService";
import type { AdminPrediction } from "../../utils/Interfaces/Predictions/adminPrediction";
import type { PredictionMarket } from "../../utils/Interfaces/Predictions/predictionMarket";

const toPredictionMarket = (market: AdminPrediction): PredictionMarket => ({
    market_id: market.market_id,
    creator_user_id: 0,
    creator_name: market.creator_name,
    creator_email: market.creator_email ?? "",
    title: market.title,
    goal_text: market.goal_text,
    end_date: market.end_date,
    status: market.status,
    review_status: market.review_status,
    reviewed_by_admin_id: null,
    reviewed_at: null,
    review_note: market.review_note,
    settlement_result: market.settlement_result,
    settled_by_admin_id: null,
    settled_at: null,
    settlement_note: market.settlement_note,
    cancel_request_status: market.cancel_request_status,
    cancel_request_reason: market.cancel_request_reason,
    cancel_requested_at: null,
    cancel_reviewed_by_admin_id: null,
    cancel_reviewed_at: null,
    cancel_review_note: market.cancel_review_note,
    result: market.settlement_result,
    total_bets: market.total_bets,
    total_points: market.total_points,
    created_at: market.created_at,
    updated_at: market.updated_at,
});

const emptyState = {
    review: [] as PredictionMarket[],
    settlement: [] as PredictionMarket[],
    cancelReview: [] as PredictionMarket[],
};

export default function Predictions() {
    const [activeTab, setActiveTab] =
        React.useState<PredictionModerationTabKey>("review");
    const [queues, setQueues] = React.useState(emptyState);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [pageError, setPageError] = React.useState<string | null>(null);
    const [pendingMarketId, setPendingMarketId] = React.useState<number | null>(
        null,
    );
    const [settlementMarket, setSettlementMarket] =
        React.useState<PredictionMarket | null>(null);
    const [settlementError, setSettlementError] =
        React.useState<string | null>(null);
    const [isSettlementSubmitting, setIsSettlementSubmitting] =
        React.useState(false);
    const [cancelReviewMarket, setCancelReviewMarket] =
        React.useState<PredictionMarket | null>(null);
    const [cancelReviewMode, setCancelReviewMode] = React.useState<
        "approve" | "reject"
    >("approve");
    const [cancelReviewError, setCancelReviewError] =
        React.useState<string | null>(null);
    const [isCancelReviewSubmitting, setIsCancelReviewSubmitting] =
        React.useState(false);

    const loadQueues = React.useCallback(async (showLoader: boolean) => {
        if (showLoader) {
            setIsLoading(true);
        } else {
            setIsRefreshing(true);
        }

        setPageError(null);

        try {
            const [reviewQueue, settlementQueue, cancelQueue] =
                await Promise.all([
                    getMarketsInReview(),
                    getPendingSettlementMarkets(),
                    getCancellationReviewMarkets(),
                ]);

            setQueues({
                review: reviewQueue.map(toPredictionMarket),
                settlement: settlementQueue.map(toPredictionMarket),
                cancelReview: cancelQueue.map(toPredictionMarket),
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to load admin prediction queues.";
            setPageError(message);
        } finally {
            if (showLoader) {
                setIsLoading(false);
            } else {
                setIsRefreshing(false);
            }
        }
    }, []);

    React.useEffect(() => {
        void loadQueues(true);
    }, [loadQueues]);

    const queueSummary = React.useMemo(
        () => ({
            reviewCount: queues.review.length,
            settlementCount: queues.settlement.length,
            cancelReviewCount: queues.cancelReview.length,
        }),
        [queues],
    );

    const summaryCards = React.useMemo(
        () => [
            {
                id: "review",
                title: "In Review",
                value: String(queueSummary.reviewCount),
                icon: Shield,
                description: "Markets waiting for approval or rejection.",
            },
            {
                id: "settlement",
                title: "Pending Settlement",
                value: String(queueSummary.settlementCount),
                icon: ClipboardCheck,
                description:
                    "Closed approved markets awaiting final resolution.",
            },
            {
                id: "cancel",
                title: "Cancel Review",
                value: String(queueSummary.cancelReviewCount),
                icon: ShieldAlert,
                description:
                    "Markets with pending creator cancellation requests.",
            },
        ],
        [queueSummary],
    );

    const handleRefresh = async () => {
        await loadQueues(false);
    };

    const handleApprove = async (market: PredictionMarket) => {
        setPendingMarketId(market.market_id);
        setPageError(null);
        try {
            await approvePredictionMarket({
                market_id: market.market_id,
                admin_action: "Approved by admin moderation.",
            });
            await loadQueues(false);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to approve market.";
            setPageError(message);
        } finally {
            setPendingMarketId(null);
        }
    };

    const handleReject = async (market: PredictionMarket) => {
        setPendingMarketId(market.market_id);
        setPageError(null);
        try {
            await rejectPredictionMarket({
                market_id: market.market_id,
                admin_action: "Rejected by admin moderation.",
            });
            await loadQueues(false);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to reject market.";
            setPageError(message);
        } finally {
            setPendingMarketId(null);
        }
    };

    const openSettlementModal = (market: PredictionMarket) => {
        setSettlementError(null);
        setSettlementMarket(market);
    };

    const handleSettlementSubmit = async (payload: {
        market_id: number;
        result: "yes" | "no" | "cancelled";
        admin_action?: string;
    }) => {
        setIsSettlementSubmitting(true);
        setPendingMarketId(payload.market_id);
        setSettlementError(null);
        setPageError(null);

        try {
            await settlePredictionMarket(payload);
            setSettlementMarket(null);
            await loadQueues(false);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to settle market.";
            setSettlementError(message);
        } finally {
            setIsSettlementSubmitting(false);
            setPendingMarketId(null);
        }
    };

    const openCancelReviewModal = (
        market: PredictionMarket,
        mode: "approve" | "reject",
    ) => {
        setCancelReviewError(null);
        setCancelReviewMode(mode);
        setCancelReviewMarket(market);
    };

    const handleCancelReviewSubmit = async (payload: {
        market_id: number;
        admin_action?: string;
        decision: "approve" | "reject";
    }) => {
        setIsCancelReviewSubmitting(true);
        setPendingMarketId(payload.market_id);
        setCancelReviewError(null);
        setPageError(null);

        try {
            if (payload.decision === "approve") {
                await approvePredictionCancellation({
                    market_id: payload.market_id,
                    admin_action: payload.admin_action,
                });
            } else {
                await rejectPredictionCancellation({
                    market_id: payload.market_id,
                    admin_action: payload.admin_action,
                });
            }

            setCancelReviewMarket(null);
            await loadQueues(false);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to update cancellation review.";
            setCancelReviewError(message);
        } finally {
            setIsCancelReviewSubmitting(false);
            setPendingMarketId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-36 py-10">
            <div className="mx-auto flex max-w-7xl flex-col gap-8">
                <PredictionAdminHeaderBlock
                    summaryCards={summaryCards}
                    isLoading={isLoading}
                    isRefreshing={isRefreshing}
                    onRefresh={handleRefresh}
                />

                <PredictionAdminContent
                    activeTab={activeTab}
                    reviewMarkets={queues.review}
                    settlementMarkets={queues.settlement}
                    cancelReviewMarkets={queues.cancelReview}
                    pendingMarketId={pendingMarketId}
                    pageError={pageError}
                    isLoading={isLoading}
                    onTabChange={setActiveTab}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    onOpenSettlement={openSettlementModal}
                    onApproveCancel={(market) =>
                        openCancelReviewModal(market, "approve")
                    }
                    onRejectCancel={(market) =>
                        openCancelReviewModal(market, "reject")
                    }
                />
            </div>

            <PredictionAdminModals
                settlementMarket={settlementMarket}
                cancelReviewMarket={cancelReviewMarket}
                cancelReviewMode={cancelReviewMode}
                settlementError={settlementError}
                cancelReviewError={cancelReviewError}
                isSettlementSubmitting={isSettlementSubmitting}
                isCancelReviewSubmitting={isCancelReviewSubmitting}
                onCloseSettlementModal={() => {
                    if (!isSettlementSubmitting) {
                        setSettlementMarket(null);
                        setSettlementError(null);
                    }
                }}
                onCloseCancelReviewModal={() => {
                    if (!isCancelReviewSubmitting) {
                        setCancelReviewMarket(null);
                        setCancelReviewError(null);
                    }
                }}
                onSettlementSubmit={handleSettlementSubmit}
                onCancelReviewSubmit={handleCancelReviewSubmit}
            />
        </div>
    );
}
