import { Chip } from "@heroui/react";
import { Clock3 } from "lucide-react";
import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";

export interface TimeLeftBadgeProps {
    endDate?: string | null;
    status?: PredictionMarket["status"] | null;
    size?: "sm" | "md" | "lg";
}

function getTimeLeftLabel(endDate?: string | null, status?: string | null) {
    if (status === "settled" || status === "cancelled") {
        return { label: status === "settled" ? "Settled" : "Cancelled", color: "default" as const, variant: "secondary" as const };
    }

    if (!endDate) {
        return { label: "No deadline", color: "default" as const, variant: "secondary" as const };
    }

    const end = new Date(endDate).getTime();
    if (Number.isNaN(end)) {
        return { label: "Invalid date", color: "danger" as const, variant: "secondary" as const };
    }

    const diff = end - Date.now();
    if (diff <= 0) {
        return { label: "Deadline reached", color: "warning" as const, variant: "secondary" as const };
    }

    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) {
        return { label: `${minutes}m left`, color: "accent" as const, variant: "soft" as const };
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return { label: `${hours}h left`, color: "accent" as const, variant: "soft" as const };
    }

    const days = Math.floor(hours / 24);
    return { label: `${days}d left`, color: "accent" as const, variant: "soft" as const };
}

export default function TimeLeftBadge({ endDate, status, size = "md" }: TimeLeftBadgeProps) {
    const meta = getTimeLeftLabel(endDate, status);

    return (
        <Chip color={meta.color} variant={meta.variant} size={size}>
            <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" strokeWidth={2.2} />
                {meta.label}
            </span>
        </Chip>
    );
}