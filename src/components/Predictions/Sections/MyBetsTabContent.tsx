import { Button, Card } from "@heroui/react";
import { CircleGauge, Trophy } from "lucide-react";
import type { PredictionBet } from "../../../utils/Interfaces/Predictions/predictionBet";
import MyBetsSection from "../Lists/MyBetsSection";

type MyBetsTabContentProps = {
    bets: PredictionBet[];
    isLoading?: boolean;
    error?: string | null;
    onViewResult?: (bet: PredictionBet) => void;
    onRefresh?: () => void;
};

export default function MyBetsTabContent({
    bets,
    isLoading = false,
    error,
    onViewResult,
    onRefresh,
}: MyBetsTabContentProps) {
    if (error) {
        return (
            <Card className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
                <h3 className="text-lg font-semibold text-rose-800">Unable to load bets</h3>
                <p className="mt-2 text-sm text-rose-700">{error}</p>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#5B5EF4]">
                            <Trophy className="h-4 w-4" />
                            My Bets
                        </div>
                        <h2 className="text-2xl font-semibold text-slate-900">Track every prediction you placed</h2>
                        <p className="max-w-3xl text-sm text-slate-500">
                            This tab groups your participation by active, pending, and completed market lifecycle states.
                        </p>
                    </div>

                    {onRefresh && (
                        <Button variant="outline" onPress={onRefresh} isDisabled={isLoading}>
                            <span className="inline-flex items-center gap-2">
                                <CircleGauge className="h-4 w-4" />
                                Refresh bets
                            </span>
                        </Button>
                    )}
                </div>
            </Card>

            {isLoading ? (
                <Card className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">Loading your betting activity...</p>
                </Card>
            ) : (
                <MyBetsSection bets={bets} onViewResult={onViewResult} />
            )}
        </div>
    );
}