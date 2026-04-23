export interface PredictionProgressBarProps {
    value?: number | null;
    label?: string;
    showValue?: boolean;
}

function clampPercentage(value?: number | null) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return 0;
    }

    return Math.max(0, Math.min(100, value));
}

export default function PredictionProgressBar({
    value,
    label = "Progress",
    showValue = true,
}: PredictionProgressBarProps) {
    const percentage = clampPercentage(value);

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-[13.125px]">
                <span className="font-medium text-foreground/70">{label}</span>
                {showValue ? <span className="text-foreground/60">{percentage}%</span> : null}
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-default-200">
                <div
                    className="h-full rounded-full bg-[#5B5EF4] transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}