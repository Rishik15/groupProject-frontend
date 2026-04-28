import { Button } from "@heroui/react";
import { Scale } from "lucide-react";

export interface PredictionSettlementActionsProps {
    isPending?: boolean;
    onOpenSettlement: () => void;
}

export default function PredictionSettlementActions({
    isPending = false,
    onOpenSettlement,
}: PredictionSettlementActionsProps) {
    return (
        <div className="flex justify-end">
            <Button
                onPress={onOpenSettlement}
                isDisabled={isPending}
                className="text-white"
                style={{ backgroundColor: "#5B5EF4" }}
            >
                <span className="inline-flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Settle market
                </span>
            </Button>
        </div>
    );
}