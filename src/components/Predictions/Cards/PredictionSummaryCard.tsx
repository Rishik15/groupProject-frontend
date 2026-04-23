import { Card } from "@heroui/react";
import type { LucideIcon } from "lucide-react";

export type PredictionSummaryCardTone =
    | "accent"
    | "success"
    | "warning"
    | "danger"
    | "default";

export interface PredictionSummaryCardProps {
    label: string;
    value: string | number;
    description?: string;
    icon?: LucideIcon;
    tone?: PredictionSummaryCardTone;
}

const toneClasses: Record<PredictionSummaryCardTone, { icon: string; border: string }> = {
    accent: {
        icon: "bg-[#5B5EF4]/10 text-[#5B5EF4]",
        border: "border-t-[#5B5EF4]",
    },
    success: {
        icon: "bg-emerald-500/10 text-emerald-600",
        border: "border-t-emerald-500",
    },
    warning: {
        icon: "bg-amber-500/10 text-amber-600",
        border: "border-t-amber-500",
    },
    danger: {
        icon: "bg-rose-500/10 text-rose-600",
        border: "border-t-rose-500",
    },
    default: {
        icon: "bg-default-100 text-foreground/70",
        border: "border-t-default-300",
    },
};

export default function PredictionSummaryCard({
    label,
    value,
    description,
    icon: Icon,
    tone = "default",
}: PredictionSummaryCardProps) {
    return (
        <Card
            className={`min-h-[132px] border border-default-200 border-t-2 bg-white shadow-sm ${toneClasses[tone].border}`}
        >
            <div className="flex h-full items-start justify-between gap-3 p-5">
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground/70">{label}</p>
                    <p className="mt-2 text-3xl font-semibold leading-none tracking-tight text-foreground">
                        {value}
                    </p>
                    {description ? (
                        <p className="mt-3 line-clamp-2 text-sm leading-5 text-foreground/55">
                            {description}
                        </p>
                    ) : null}
                </div>

                {Icon ? (
                    <div className={`rounded-2xl p-3 ${toneClasses[tone].icon}`}>
                        <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                ) : null}
            </div>
        </Card>
    );
}