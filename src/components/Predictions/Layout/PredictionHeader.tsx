import { Card, Spinner } from "@heroui/react";
import { Coins } from "lucide-react";

export interface PredictionHeaderProps {
    title?: string;
    subtitle?: string;
    walletBalance?: number | null;
    isLoading?: boolean;
    onRefresh?: () => void;
}

function formatPoints(value?: number | null) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "—";
    }

    return new Intl.NumberFormat().format(value);
}

export default function PredictionHeader({
    title = "Predictions",
    subtitle = "Track open markets, manage your bets, and monitor your goal challenges.",
    walletBalance,
    isLoading = false,
}: PredictionHeaderProps) {
    return (
        <div className="justify-between items-center px-38 py-4 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col flex-row items-center justify-between">
                <div className="min-w-0">
                    <h1 className="text-[24px] font-semibold tracking-tight">{title}</h1>
                    <p className="mt-2 text-[13.125px]">{subtitle}</p>
                </div>

                <div className="flex flex-col gap-3 min-w-[260px] items-end">
                    <div className="flex w-full items-center justify-between rounded-2xl border border-default-200 bg-white px-4 py-3 max-w-[280px]">
                        <div>
                            <p className="text-[11.25px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
                                Wallet balance
                            </p>
                            <div className="m-1 flex items-center gap-2 text-2xl font-semibold text-foreground">
                                <Coins className="h-5 w-5 text-[#5B5EF4]" strokeWidth={2.2} />
                                {isLoading ? <Spinner size="sm" /> : <span>{formatPoints(walletBalance)}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}