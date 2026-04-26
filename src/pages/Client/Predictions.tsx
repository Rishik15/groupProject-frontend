import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Card, Spinner } from "@heroui/react";
import {
    LayoutDashboard,
    RefreshCcw,
    ShieldCheck,
    Sparkles
} from "lucide-react";
import {
    CompletedMarketResultModal,
    CreateGoalMarketModal,
    GamblingDenSection,
    MyBetsTabContent,
    MyMarketsTabContent,
    PlacePredictionModal,
    PredictionHeader,
    PredictionLeaderboardList,
    PredictionPageTabs,
    PredictionSummaryCards,
    RequestCancellationModal,
} from "../../components/Predictions";
import type { PredictionPageTabKey } from "../../components/Predictions/Layout/PredictionPageTabs";
import {
    closeMarket,
    createMarket,
    getCompletedMarkets,
    getLeaderboard,
    getMyBets,
    getMyMarkets,
    getOpenMarkets,
    getPredictionSummary,
    placeBet,
    requestMarketCancellation,
} from "../../services/Predictions/predictionMarketService";
import {
    getWalletSummary,
} from "../../services/Predictions/predictionWalletService";
import type { PredictionBet } from "../../utils/Interfaces/Predictions/predictionBet";
import type { PredictionLeaderboardEntry } from "../../utils/Interfaces/Predictions/predictionLeaderboard";
import type { PredictionMarket } from "../../utils/Interfaces/Predictions/predictionMarket";
import type { PredictionSummary } from "../../utils/Interfaces/Predictions/predictionSummary";
import type { PredictionWallet } from "../../utils/Interfaces/Predictions/predictionWallet";

type PageData = {
    wallet: PredictionWallet | null;
    summary: PredictionSummary | null;
    openMarkets: PredictionMarket[];
    myBets: PredictionBet[];
    myMarkets: PredictionMarket[];
    completedMarkets: PredictionMarket[];
    leaderboard: PredictionLeaderboardEntry[];
};

const EMPTY_DATA: PageData = {
    wallet: null,
    summary: null,
    openMarkets: [],
    myBets: [],
    myMarkets: [],
    completedMarkets: [],
    leaderboard: [],
};

function isStillBettable(market: PredictionMarket) {
    if (market.status !== "open" || market.review_status !== "approved") {
        return false;
    }

    if (!market.end_date) {
        return false;
    }

    const deadline = new Date(market.end_date);
    if (Number.isNaN(deadline.getTime())) {
        return false;
    }

    return deadline.getTime() > Date.now();
}

export default function Predictions() {
    const [activeTab, setActiveTab] = useState<PredictionPageTabKey>("gambling-den");
    const [data, setData] = useState<PageData>(EMPTY_DATA);
    const [pageError, setPageError] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isCreateSubmitting, setIsCreateSubmitting] = useState(false);
    const [isBetSubmitting, setIsBetSubmitting] = useState(false);
    const [isCancelSubmitting, setIsCancelSubmitting] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState<PredictionMarket | null>(null);
    const [selectedCompletedMarket, setSelectedCompletedMarket] =
        useState<PredictionMarket | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isBetModalOpen, setIsBetModalOpen] = useState(false);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCompletedModalOpen, setIsCompletedModalOpen] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [betError, setBetError] = useState<string | null>(null);
    const [cancelError, setCancelError] = useState<string | null>(null);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);

    const loadAllClientData = useCallback(
        async (mode: "initial" | "refresh" = "refresh") => {
            if (mode === "initial") {
                setIsInitialLoading(true);
            } else {
                setIsRefreshing(true);
            }

            setPageError(null);

            const [
                walletResult,
                summaryResult,
                openMarketsResult,
                myBetsResult,
                myMarketsResult,
                completedMarketsResult,
                leaderboardResult,
            ] = await Promise.allSettled([
                getWalletSummary(),
                getPredictionSummary(),
                getOpenMarkets(),
                getMyBets(),
                getMyMarkets(),
                getCompletedMarkets(),
                getLeaderboard(),
            ]);

            const nextData: PageData = {
                wallet: walletResult.status === "fulfilled" ? walletResult.value : null,
                summary: summaryResult.status === "fulfilled" ? summaryResult.value : null,
                openMarkets:
                    openMarketsResult.status === "fulfilled"
                        ? openMarketsResult.value
                        : [],
                myBets: myBetsResult.status === "fulfilled" ? myBetsResult.value : [],
                myMarkets:
                    myMarketsResult.status === "fulfilled" ? myMarketsResult.value : [],
                completedMarkets:
                    completedMarketsResult.status === "fulfilled"
                        ? completedMarketsResult.value
                        : [],
                leaderboard:
                    leaderboardResult.status === "fulfilled"
                        ? leaderboardResult.value
                        : [],
            };

            setData(nextData);
            setLastUpdatedAt(new Date().toISOString());

            const hasAnyFailure = [
                walletResult,
                summaryResult,
                openMarketsResult,
                myBetsResult,
                myMarketsResult,
                completedMarketsResult,
                leaderboardResult,
            ].some((result) => result.status === "rejected");

            if (hasAnyFailure) {
                setPageError(
                    "Some prediction data could not be loaded. Available sections are showing the latest successful results.",
                );
            }

            setIsInitialLoading(false);
            setIsRefreshing(false);
        },
        [],
    );

    useEffect(() => {
        void loadAllClientData("initial");
    }, [loadAllClientData]);

    const gamblingDenMarkets = useMemo(
        () => data.openMarkets.filter(isStillBettable),
        [data.openMarkets],
    );

    const openBetModal = useCallback((market: PredictionMarket | null) => {
        setSelectedMarket(market);
        setBetError(null);
        setIsBetModalOpen(Boolean(market));
    }, []);

    const openCancelModal = useCallback((market: PredictionMarket | null) => {
        setSelectedMarket(market);
        setCancelError(null);
        setIsCancelModalOpen(Boolean(market));
    }, []);

    const openCompletedModal = useCallback((market: PredictionMarket | null) => {
        setSelectedCompletedMarket(market);
        setIsCompletedModalOpen(Boolean(market));
    }, []);

    const handleRefresh = useCallback(() => {
        void loadAllClientData("refresh");
    }, [loadAllClientData]);

    const handleCreateMarket = useCallback(
        async (payload: { title: string; goal_text: string; end_date: string }) => {
            try {
                setIsCreateSubmitting(true);
                setCreateError(null);
                await createMarket(payload);
                setIsCreateModalOpen(false);
                setActiveTab("my-markets");
                await loadAllClientData("refresh");
            } catch (error) {
                setCreateError(
                    error instanceof Error ? error.message : "Unable to create market.",
                );
            } finally {
                setIsCreateSubmitting(false);
            }
        },
        [loadAllClientData],
    );

    const handlePlaceBet = useCallback(
        async (payload: {
            market_id: number;
            prediction_value: "yes" | "no";
            points_wagered: number;
        }) => {
            try {
                setIsBetSubmitting(true);
                setBetError(null);
                await placeBet(payload);
                setIsBetModalOpen(false);
                setSelectedMarket(null);
                setActiveTab("my-bets");
                await loadAllClientData("refresh");
            } catch (error) {
                setBetError(
                    error instanceof Error ? error.message : "Unable to place bet.",
                );
            } finally {
                setIsBetSubmitting(false);
            }
        },
        [loadAllClientData],
    );

    const handleRequestCancel = useCallback(
        async (payload: { market_id: number; reason: string }) => {
            try {
                setIsCancelSubmitting(true);
                setCancelError(null);
                await requestMarketCancellation(payload);
                setIsCancelModalOpen(false);
                setSelectedMarket(null);
                setActiveTab("my-markets");
                await loadAllClientData("refresh");
            } catch (error) {
                setCancelError(
                    error instanceof Error
                        ? error.message
                        : "Unable to request cancellation.",
                );
            } finally {
                setIsCancelSubmitting(false);
            }
        },
        [loadAllClientData],
    );

    const handleCloseMarket = useCallback(
        async (market: PredictionMarket) => {
            const shouldClose = window.confirm(
                `Close the market "${market.title}"? This will stop new bets and move it toward settlement.`,
            );

            if (!shouldClose) {
                return;
            }

            try {
                setPageError(null);
                await closeMarket({ market_id: market.market_id });
                await loadAllClientData("refresh");
            } catch (error) {
                setPageError(
                    error instanceof Error ? error.message : "Unable to close market.",
                );
            }
        },
        [loadAllClientData],
    );

    const handleViewBetResult = useCallback(
        (bet: PredictionBet) => {
            const matchingMarket = data.completedMarkets.find(
                (market) => market.market_id === bet.market_id,
            );

            if (!matchingMarket) {
                setPageError(
                    "That market has not been finalized yet, so there is no completed result to show.",
                );
                return;
            }

            openCompletedModal(matchingMarket);
        },
        [data.completedMarkets, openCompletedModal],
    );

    const renderActiveTabContent = () => {
        if (activeTab === "gambling-den") {
            return (
                <GamblingDenSection
                    markets={gamblingDenMarkets}
                    isLoading={isInitialLoading}
                    onRefresh={handleRefresh}
                    onSelectSide={(market) => openBetModal(market)}
                />
            );
        }

        if (activeTab === "my-bets") {
            return (
                <MyBetsTabContent
                    bets={data.myBets}
                    isLoading={isInitialLoading}
                    error={pageError}
                    onRefresh={handleRefresh}
                    onViewResult={handleViewBetResult}
                />
            );
        }

        if (activeTab === "leaderboard") {
            return (
                <PredictionLeaderboardList
                    entries={data.leaderboard}
                    currentUserId={data.wallet?.user_id ?? null}
                    isLoading={isInitialLoading}
                    error={pageError}
                    title="Predictions Leaderboard"
                    onRetry={handleRefresh}
                />
            );
        }

        return (
            <MyMarketsTabContent
                markets={data.myMarkets}
                isLoading={isInitialLoading}
                error={pageError}
                onCreateMarket={() => {
                    setCreateError(null);
                    setIsCreateModalOpen(true);
                }}
                onCloseMarket={handleCloseMarket}
                onRequestCancel={openCancelModal}
            />
        );
    };

    return (
        <div>
            <PredictionHeader
                walletBalance={data.wallet?.balance ?? null}
                isLoading={isInitialLoading || isRefreshing}
                onRefresh={handleRefresh}
            />
            <div className="min-h-screen bg-[#F7F8FC] px-36 py-10 text-foreground">
                <div className="mx-auto flex w-full max-w-[1700px] flex-col gap-6">
                    {pageError ? (
                        <Card className="border border-amber-200 bg-amber-50 shadow-sm">
                            <div className="flex items-start gap-3 p-4">
                                <div className="rounded-2xl bg-amber-100 p-2 text-amber-700">
                                    <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
                                </div>
                                <div>
                                    <p className="text-[13.125px] font-semibold text-amber-900">
                                        Prediction page notice
                                    </p>
                                    <p className="mt-1 text-[13.125px] text-amber-800">{pageError}</p>
                                </div>
                            </div>
                        </Card>
                    ) : null}

                    <PredictionSummaryCards summary={data.summary} />

                    <Card className="border border-default-200 bg-white shadow-sm">
                        <div className="space-y-5 p-5">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="inline-flex items-center gap-2 rounded-full bg-[#5B5EF4]/10 px-3 py-1 text-xs font-semibold text-[#5B5EF4]">
                                        <LayoutDashboard className="h-4 w-4" strokeWidth={2.2} />
                                        Client workspace
                                    </div>
                                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                                        Predictions workspace
                                    </h2>
                                    <p className="mt-2 max-w-3xl text-[13.125px] leading-6 text-foreground/65">
                                        Browse bettable markets in Gambling Den, track your participation in My Bets, manage creator workflows in My Markets, and monitor ranking in Leaderboard.
                                    </p>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <Button
                                        className="text-white"
                                        style={{ backgroundColor: "#5B5EF4" }}
                                        onPress={() => {
                                            setCreateError(null);
                                            setIsCreateModalOpen(true);
                                        }}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            <Sparkles className="h-4 w-4" strokeWidth={2.2} />
                                            Create market
                                        </span>
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onPress={handleRefresh}
                                        isDisabled={isRefreshing}
                                    >
                                        <span className="inline-flex items-center gap-2">
                                            {isRefreshing ? (
                                                <Spinner size="sm" />
                                            ) : (
                                                <RefreshCcw className="h-4 w-4" strokeWidth={2.2} />
                                            )}
                                            Refresh page
                                        </span>
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                                <PredictionPageTabs
                                    activeTab={activeTab}
                                    onChange={setActiveTab}
                                />

                                <p className="text-[11.25px] text-foreground/50">
                                    {lastUpdatedAt
                                        ? `Last updated ${new Date(lastUpdatedAt).toLocaleString()}`
                                        : "Loading predictions data…"}
                                </p>
                            </div>

                            {renderActiveTabContent()}
                        </div>
                    </Card>
                </div>

                <CreateGoalMarketModal
                    isOpen={isCreateModalOpen}
                    isSubmitting={isCreateSubmitting}
                    error={createError}
                    onClose={() => {
                        if (isCreateSubmitting) return;
                        setIsCreateModalOpen(false);
                        setCreateError(null);
                    }}
                    onSubmit={handleCreateMarket}
                />

                <PlacePredictionModal
                    isOpen={isBetModalOpen}
                    market={selectedMarket}
                    walletBalance={data.wallet?.balance ?? 0}
                    isSubmitting={isBetSubmitting}
                    error={betError}
                    onClose={() => {
                        if (isBetSubmitting) return;
                        setIsBetModalOpen(false);
                        setSelectedMarket(null);
                        setBetError(null);
                    }}
                    onSubmit={handlePlaceBet}
                />

                <RequestCancellationModal
                    isOpen={isCancelModalOpen}
                    market={selectedMarket}
                    isSubmitting={isCancelSubmitting}
                    error={cancelError}
                    onClose={() => {
                        if (isCancelSubmitting) return;
                        setIsCancelModalOpen(false);
                        setSelectedMarket(null);
                        setCancelError(null);
                    }}
                    onSubmit={handleRequestCancel}
                />

                <CompletedMarketResultModal
                    isOpen={isCompletedModalOpen}
                    market={selectedCompletedMarket}
                    onOpenChange={(open) => {
                        setIsCompletedModalOpen(open);
                        if (!open) {
                            setSelectedCompletedMarket(null);
                        }
                    }}
                />
            </div>
        </div>
    );
}