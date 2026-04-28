import type { LucideIcon } from "lucide-react";
import { Button, Card } from "@heroui/react";
import { CircleAlert } from "lucide-react";

export interface PredictionEmptyStateProps {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: LucideIcon;
}

export default function PredictionEmptyState({
    title,
    description = "There is nothing to show here right now.",
    actionLabel,
    onAction,
    icon: Icon = CircleAlert,
}: PredictionEmptyStateProps) {
    return (
        <Card className="border border-dashed border-default-300 bg-content1 shadow-none">
            <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
                <div className="rounded-3xl bg-[#5B5EF4]/10 p-4 text-[#5B5EF4]">
                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                </div>

                <div className="space-y-2">
                    <h3 className="text-[18.75px] font-semibold tracking-tight text-foreground">{title}</h3>
                    <p className="max-w-xl text-[13.125px] leading-6 text-foreground/65">{description}</p>
                </div>

                {actionLabel && onAction ? (
                    <Button variant="outline" onPress={onAction}>
                        {actionLabel}
                    </Button>
                ) : null}
            </div>
        </Card>
    );
}