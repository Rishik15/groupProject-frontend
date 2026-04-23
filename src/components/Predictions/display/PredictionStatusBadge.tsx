import { Chip } from "@heroui/react";
import { AlertTriangle, CheckCircle2, Clock3, ShieldBan, Trophy } from "lucide-react";

export type PredictionStatusBadgeKind = "review" | "market" | "cancel" | "result";

export interface PredictionStatusBadgeProps {
    kind: PredictionStatusBadgeKind;
    value?: string | null;
    size?: "sm" | "md" | "lg";
}

function getStatusMeta(kind: PredictionStatusBadgeKind, value?: string | null) {
    const normalized = (value ?? "unknown").toLowerCase();

    if (kind === "review") {
        switch (normalized) {
            case "approved":
                return { label: "Approved", color: "success" as const, variant: "soft" as const, Icon: CheckCircle2 };
            case "pending":
                return { label: "Pending review", color: "warning" as const, variant: "secondary" as const, Icon: Clock3 };
            case "rejected":
                return { label: "Rejected", color: "danger" as const, variant: "soft" as const, Icon: ShieldBan };
            default:
                return { label: "Review unknown", color: "default" as const, variant: "secondary" as const, Icon: AlertTriangle };
        }
    }

    if (kind === "market") {
        switch (normalized) {
            case "open":
                return { label: "Open", color: "accent" as const, variant: "soft" as const, Icon: CheckCircle2 };
            case "closed":
                return { label: "Closed", color: "warning" as const, variant: "secondary" as const, Icon: Clock3 };
            case "settled":
                return { label: "Settled", color: "success" as const, variant: "soft" as const, Icon: Trophy };
            case "cancelled":
                return { label: "Cancelled", color: "danger" as const, variant: "secondary" as const, Icon: ShieldBan };
            default:
                return { label: "Unknown status", color: "default" as const, variant: "secondary" as const, Icon: AlertTriangle };
        }
    }

    if (kind === "cancel") {
        switch (normalized) {
            case "none":
                return { label: "No cancel request", color: "default" as const, variant: "tertiary" as const, Icon: CheckCircle2 };
            case "pending":
                return { label: "Cancel review", color: "warning" as const, variant: "secondary" as const, Icon: Clock3 };
            case "approved":
                return { label: "Cancel approved", color: "danger" as const, variant: "soft" as const, Icon: ShieldBan };
            case "rejected":
                return { label: "Cancel rejected", color: "default" as const, variant: "secondary" as const, Icon: AlertTriangle };
            default:
                return { label: "Cancel unknown", color: "default" as const, variant: "secondary" as const, Icon: AlertTriangle };
        }
    }

    switch (normalized) {
        case "yes":
            return { label: "Yes won", color: "success" as const, variant: "soft" as const, Icon: Trophy };
        case "no":
            return { label: "No won", color: "danger" as const, variant: "soft" as const, Icon: Trophy };
        case "cancelled":
            return { label: "Cancelled", color: "warning" as const, variant: "secondary" as const, Icon: ShieldBan };
        default:
            return { label: "Pending result", color: "default" as const, variant: "secondary" as const, Icon: Clock3 };
    }
}

export default function PredictionStatusBadge({ kind, value, size = "md" }: PredictionStatusBadgeProps) {
    const { label, color, variant, Icon } = getStatusMeta(kind, value);

    return (
        <Chip color={color} variant={variant} size={size}>
            <span className="inline-flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" strokeWidth={2.2} />
                {label}
            </span>
        </Chip>
    );
}