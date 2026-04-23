import { Coins, Users } from "lucide-react";

export interface PoolFooterProps {
    totalPoints?: number | null;
    totalBets?: number | null;
}

function formatNumber(value?: number | null) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "—";
    }

    return new Intl.NumberFormat().format(value);
}

export default function PoolFooter({ totalPoints, totalBets }: PoolFooterProps) {
    return (
        <div className="grid grid-cols-1 gap-3 rounded-3xl border border-default-200 bg-content2/50 p-4 sm:grid-cols-2">
            <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#5B5EF4]/10 p-2.5 text-[#5B5EF4]">
                    <Coins className="h-4 w-4" strokeWidth={2.2} />
                </div>
                <div>
                    <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">Total points</p>
                    <p className="text-base font-semibold text-foreground">{formatNumber(totalPoints)}</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-500/10 p-2.5 text-emerald-600">
                    <Users className="h-4 w-4" strokeWidth={2.2} />
                </div>
                <div>
                    <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">Total bets</p>
                    <p className="text-base font-semibold text-foreground">{formatNumber(totalBets)}</p>
                </div>
            </div>
        </div>
    );
}