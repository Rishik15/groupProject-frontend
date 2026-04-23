import { Button, Card } from "@heroui/react";
import { LayoutDashboard, PlusCircle } from "lucide-react";
import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";
import MyMarketsSection from "../Lists/MyMarketsSection";

type MyMarketsTabContentProps = {
    markets: PredictionMarket[];
    isLoading?: boolean;
    error?: string | null;
    onCreateMarket?: () => void;
    onCloseMarket?: (market: PredictionMarket) => void;
    onRequestCancel?: (market: PredictionMarket) => void;
};

export default function MyMarketsTabContent({
    markets,
    isLoading = false,
    error,
    onCreateMarket,
    onCloseMarket,
    onRequestCancel,
}: MyMarketsTabContentProps) {
    if (error) {
        return (
            <Card className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
                <h3 className="text-[18.75px] font-semibold text-rose-800">Unable to load your markets</h3>
                <p className="mt-2 text-[13.125px] text-rose-700">{error}</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#5B5EF4]">
                            <LayoutDashboard className="h-4 w-4" />
                            My Markets
                        </div>
                        <h2 className="text-[18.75px] font-semibold text-slate-900">Manage the markets you created</h2>
                        <p className="max-w-3xl text-[13.125px] text-slate-500">
                            Review market lifecycle, close eligible markets, and send cancellation requests when necessary.
                        </p>
                    </div>

                    {onCreateMarket && (
                        <Button
                            className="text-white"
                            style={{ backgroundColor: "#5B5EF4" }}
                            onPress={onCreateMarket}
                        >
                            <span className="inline-flex items-center gap-2">
                                <PlusCircle className="h-4 w-4" />
                                New market
                            </span>
                        </Button>
                    )}
                </div>
            </Card>

            {isLoading ? (
                <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-[13.125px] text-slate-500">Loading your creator dashboard...</p>
                </Card>
            ) : (
                <MyMarketsSection
                    markets={markets}
                    onCloseMarket={onCloseMarket}
                    onRequestCancel={onRequestCancel}
                />
            )}
        </div>
    );
}