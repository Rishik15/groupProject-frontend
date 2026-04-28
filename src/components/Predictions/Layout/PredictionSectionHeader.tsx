import type { LucideIcon } from "lucide-react";
import { Button } from "@heroui/react";

export interface PredictionSectionHeaderProps {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: LucideIcon;
}

export default function PredictionSectionHeader({
    title,
    description,
    actionLabel,
    onAction,
    actionIcon: ActionIcon,
}: PredictionSectionHeaderProps) {
    return (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
                {description ? <p className="mt-2 text-[11.25px] leading-6 text-foreground/65">{description}</p> : null}
            </div>

            {actionLabel && onAction ? (
                <Button variant="outline" onPress={onAction}>
                    <span className="inline-flex items-center gap-2">
                        {ActionIcon ? <ActionIcon className="h-4 w-4" strokeWidth={2.2} /> : null}
                        {actionLabel}
                    </span>
                </Button>
            ) : null}
        </div>
    );
}