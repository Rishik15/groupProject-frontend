import { Button, Card, Chip, Spinner } from "@heroui/react";
import { Coins, Gift, Sparkles } from "lucide-react";

export interface PredictionRewardResult {
    already_awarded: boolean;
    points_awarded: number;
    new_balance?: number;
}

export interface WalletSurveyBannerProps {
    walletBalance?: number | null;
    canClaimReward?: boolean;
    isRewardPending?: boolean;
    rewardResult?: PredictionRewardResult | null;
    onClaimReward?: () => void;
}

function formatNumber(value?: number | null) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "—";
    }

    return new Intl.NumberFormat().format(value);
}

export default function WalletSurveyBanner({
    walletBalance,
    canClaimReward = true,
    isRewardPending = false,
    rewardResult,
    onClaimReward,
}: WalletSurveyBannerProps) {
    const rewardCopy = rewardResult?.already_awarded
        ? "Today’s reward has already been claimed."
        : rewardResult
            ? `Reward granted: +${rewardResult.points_awarded} points.`
            : "Complete your daily survey in the UI, then claim the once-per-day reward.";

    return (
        <Card className="border border-default-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <Chip color="accent" variant="soft" size="sm">
                            <span className="inline-flex items-center gap-1.5">
                                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
                                Daily reward
                            </span>
                        </Chip>
                        <Chip color="default" variant="secondary" size="sm">
                            <span className="inline-flex items-center gap-1.5">
                                <Coins className="h-3.5 w-3.5" strokeWidth={2.2} />
                                Wallet {formatNumber(walletBalance)}
                            </span>
                        </Chip>
                    </div>

                    <div>
                        <h3 className="text-[18.75px] font-semibold tracking-tight text-foreground">Claim your daily 100-point reward</h3>
                        <p className="mt-1 text-[13.125px] leading-6 text-foreground/65">{rewardCopy}</p>
                    </div>
                </div>

                <div className="flex w-full flex-col gap-2 lg:max-w-[260px] lg:items-end">
                    <Button
                        onPress={onClaimReward}
                        isDisabled={!canClaimReward || isRewardPending}
                        className="w-full text-white lg:w-auto"
                        style={{ backgroundColor: "#5B5EF4" }}
                    >
                        <span className="inline-flex items-center justify-center gap-2">
                            {isRewardPending ? <Spinner size="sm" /> : <Gift className="h-4 w-4" strokeWidth={2.2} />}
                            {rewardResult?.already_awarded ? "Reward claimed" : "Claim reward"}
                        </span>
                    </Button>
                    <p className="text-[11.25px] text-foreground/50">Reward call uses the finalized daily-reward endpoint.</p>
                </div>
            </div>
        </Card>
    );
}