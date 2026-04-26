import { Button } from "@heroui/react";
import {
    ArrowUpRight,
    CircleX,
    CheckCircle2,
    Coins,
    Users,
} from "lucide-react";

export interface PredictionOptionCardProps {
    side: "yes" | "no";
    points: number;
    bets: number;
    totalPoints: number;
    isDisabled?: boolean;
    onPress?: (side: "yes" | "no") => void;
}

const formatShare = (value: number, total: number): string => {
    if (total <= 0) {
        return "0%";
    }

    return `${Math.round((value / total) * 100)}%`;
};

export default function PredictionOptionCard({
    side,
    points,
    bets,
    totalPoints,
    isDisabled = false,
    onPress,
}: PredictionOptionCardProps) {
    const isYes = side === "yes";
    const Icon = isYes ? CheckCircle2 : CircleX;
    const label = isYes ? "Yes" : "No";
    const description = isYes
        ? "Back the goal being achieved by the deadline."
        : "Back the goal falling short by the deadline.";

    return (
        <div
            className={`rounded-2xl border p-4 ${isYes
                ? "border-emerald-200 bg-emerald-50/60"
                : "border-rose-200 bg-rose-50/60"
                }`}
        >
            <div className="flex items-start justify-between gap-1">
                <div className="flex items-center gap-3">
                    <div
                        className={`rounded-2xl p-2.5 ${isYes
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-rose-500/10 text-rose-600"
                            }`}
                    >
                        <Icon className="h-4 w-4" strokeWidth={2.2} />
                    </div>
                    <div>
                        <p className="text-[13.125px] font-semibold text-foreground">
                            {label}
                        </p>
                        <p className="text-[11.25px] text-foreground/55">
                            {description}
                        </p>
                    </div>
                </div>

                <div
                    className={`rounded-full px-2.5 py-1 text-[11.25px] font-semibold ${isYes
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                        }`}
                >
                    {formatShare(points, totalPoints)} of pool
                </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-black/5 bg-white/70 px-3 py-2">
                    <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-foreground/55">
                        <Coins className="h-3.5 w-3.5" />
                        Points
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                        {points} pts
                    </p>
                </div>

                <div className="rounded-xl border border-black/5 bg-white/70 px-3 py-2">
                    <div className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-foreground/55">
                        <Users className="h-3.5 w-3.5" />
                        Bets
                    </div>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                        {bets}
                    </p>
                </div>
            </div>

            <Button
                variant="outline"
                onPress={() => onPress?.(side)}
                isDisabled={isDisabled}
                fullWidth
                className="mt-4"
            >
                <span className="inline-flex items-center justify-center gap-2">
                    Choose {label}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </span>
            </Button>
        </div>
    );
}