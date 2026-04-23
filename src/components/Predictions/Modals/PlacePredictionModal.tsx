import React from "react";
import { Button, Input, Modal, Spinner } from "@heroui/react";
import { CheckCircle2, Coins, TrendingUp } from "lucide-react";
import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";
import type { PlacePredictionBetPayload } from "../../../utils/Interfaces/Predictions/predictionForms";

type PlacePredictionModalProps = {
    isOpen: boolean;
    market?: PredictionMarket | null;
    walletBalance: number;
    isSubmitting?: boolean;
    error?: string | null;
    onClose: () => void;
    onSubmit: (payload: PlacePredictionBetPayload) => void | Promise<void>;
};

type PredictionSide = "yes" | "no";

export default function PlacePredictionModal({
    isOpen,
    market,
    walletBalance,
    isSubmitting = false,
    error,
    onClose,
    onSubmit,
}: PlacePredictionModalProps) {
    const [predictionValue, setPredictionValue] = React.useState<PredictionSide>("yes");
    const [pointsWagered, setPointsWagered] = React.useState<string>("");
    const [validationError, setValidationError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!isOpen) return;
        setPredictionValue("yes");
        setPointsWagered("");
        setValidationError(null);
    }, [isOpen, market?.market_id]);

    const numericWager = Number(pointsWagered || 0);

    const handleSubmit = async () => {
        if (!market) {
            setValidationError("Select a market before placing a bet.");
            return;
        }

        if (!Number.isInteger(numericWager) || numericWager <= 0) {
            setValidationError("Points wagered must be a positive whole number.");
            return;
        }

        if (numericWager > walletBalance) {
            setValidationError("You do not have enough points in your wallet.");
            return;
        }

        setValidationError(null);

        await onSubmit({
            market_id: market.market_id,
            prediction_value: predictionValue,
            points_wagered: numericWager,
        });
    };

    return (
        <Modal>
            <Modal.Backdrop
                isOpen={isOpen && !!market}
                onOpenChange={(open) => {
                    if (!open && !isSubmitting) onClose();
                }}
                variant="opaque"
                isDismissable={!isSubmitting}
            >
                <Modal.Container placement="center" size="md" scroll="inside">
                    <Modal.Dialog aria-label="Place prediction bet" className="rounded-3xl">
                        <Modal.Header className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-5">
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-2 rounded-full bg-[#EEF0FF] px-3 py-1 text-xs font-semibold text-[#5B5EF4]">
                                    <TrendingUp className="h-4 w-4" />
                                    Place Bet
                                </div>
                                <h2 className="text-xl font-semibold text-slate-900">{market?.title ?? "Place a bet"}</h2>
                                <p className="text-sm text-slate-500">{market?.goal_text ?? "Choose a side and confirm your wager."}</p>
                            </div>
                        </Modal.Header>

                        <Modal.Body className="space-y-5 px-6 py-6">
                            <div className="grid gap-3 sm:grid-cols-2">
                                {(["yes", "no"] as const).map((side) => {
                                    const active = predictionValue === side;

                                    return (
                                        <button
                                            key={side}
                                            type="button"
                                            onClick={() => setPredictionValue(side)}
                                            disabled={isSubmitting}
                                            className={[
                                                "rounded-2xl border px-4 py-4 text-left transition",
                                                active
                                                    ? "border-[#5B5EF4] bg-[#EEF0FF] shadow-sm"
                                                    : "border-slate-200 bg-white hover:border-slate-300",
                                            ].join(" ")}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold capitalize text-slate-900">{side}</span>
                                                {active && <CheckCircle2 className="h-4 w-4 text-[#5B5EF4]" />}
                                            </div>
                                            <p className="mt-2 text-xs text-slate-500">
                                                {side === "yes"
                                                    ? "You are predicting the goal will be achieved."
                                                    : "You are predicting the goal will not be achieved."}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="prediction-points-wagered" className="text-sm font-medium text-slate-700">
                                    Points wagered
                                </label>
                                <Input
                                    id="prediction-points-wagered"
                                    type="number"
                                    inputMode="numeric"
                                    min={1}
                                    value={pointsWagered}
                                    variant="primary"
                                    disabled={isSubmitting}
                                    onChange={(event) => setPointsWagered(event.target.value)}
                                    fullWidth
                                    aria-label="Points wagered"
                                />
                                <p className="text-xs text-slate-500">Available balance: {walletBalance} points</p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                <div className="inline-flex items-center gap-2 font-medium text-slate-700">
                                    <Coins className="h-4 w-4 text-[#5B5EF4]" />
                                    Wager summary
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span>Chosen side</span>
                                    <span className="font-medium uppercase text-slate-900">{predictionValue}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <span>Points committed</span>
                                    <span className="font-medium text-slate-900">{Number.isFinite(numericWager) ? numericWager : 0}</span>
                                </div>
                                <p className="mt-3 text-xs text-slate-500">
                                    Final payout calculations remain backend-driven. This modal focuses on the finalized MVP bet payload.
                                </p>
                            </div>

                            {(validationError || error) && (
                                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {validationError ?? error}
                                </div>
                            )}
                        </Modal.Body>

                        <Modal.Footer className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-5">
                            <Button variant="outline" onPress={onClose} isDisabled={isSubmitting}>
                                Cancel
                            </Button>

                            <Button
                                className="text-white"
                                style={{ backgroundColor: "#5B5EF4" }}
                                onPress={handleSubmit}
                                isDisabled={isSubmitting || !market}
                            >
                                <span className="inline-flex items-center gap-2">
                                    {isSubmitting ? <Spinner size="sm" /> : <TrendingUp className="h-4 w-4" />}
                                    Confirm bet
                                </span>
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}
