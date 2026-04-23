import { Button } from "@heroui/react";
import { ArrowUpRight, CircleX, CheckCircle2 } from "lucide-react";

export interface PredictionOptionCardProps {
    side: "yes" | "no";
    isDisabled?: boolean;
    onPress?: (side: "yes" | "no") => void;
}

export default function PredictionOptionCard({ side, isDisabled = false, onPress }: PredictionOptionCardProps) {
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
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div
                        className={`rounded-2xl p-2.5 ${isYes ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"
                            }`}
                    >
                        <Icon className="h-4 w-4" strokeWidth={2.2} />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-foreground">{label}</p>
                        <p className="text-xs text-foreground/55">{description}</p>
                    </div>
                </div>

                <div
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isYes ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                        }`}
                >
                    {label}
                </div>
            </div>

            <Button variant="outline" onPress={() => onPress?.(side)} isDisabled={isDisabled} fullWidth className="mt-4">
                <span className="inline-flex items-center justify-center gap-2">
                    Choose {label}
                    <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </span>
            </Button>
        </div>
    );
}