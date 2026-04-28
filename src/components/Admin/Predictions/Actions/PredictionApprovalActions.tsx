import { Button } from "@heroui/react";
import { CheckCircle2, XCircle } from "lucide-react";

export interface PredictionApprovalActionsProps {
    isPending?: boolean;
    canAct?: boolean;
    onApprove: () => void;
    onReject: () => void;
}

export default function PredictionApprovalActions({
    isPending = false,
    canAct = true,
    onApprove,
    onReject,
}: PredictionApprovalActionsProps) {
    return (
        <div className="flex flex-wrap justify-end gap-3">
            <Button
                variant="outline"
                onPress={onReject}
                isDisabled={!canAct || isPending}
            >
                <span className="inline-flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Reject
                </span>
            </Button>

            <Button
                onPress={onApprove}
                isDisabled={!canAct || isPending}
                className="text-white"
                style={{ backgroundColor: "#5B5EF4" }}
            >
                <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                </span>
            </Button>
        </div>
    );
}