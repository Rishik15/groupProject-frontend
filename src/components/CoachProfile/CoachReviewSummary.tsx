import { Button } from "@heroui/react";
import type { RatingBreakdownRow } from "../../utils/Interfaces/CoachReview/coachReview";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";

interface CoachReviewSummaryProps {
    averageRating: string;
    reviewCount: number;
    breakdown: RatingBreakdownRow[];
    starsText: string;
    onWriteReview: () => void;
}

// Summary card shown above the review list
export default function CoachReviewSummary({
    averageRating,
    reviewCount,
    breakdown,
    starsText,
    onWriteReview,
}: CoachReviewSummaryProps) {
    return (
        <div
            className="rounded-2xl border p-6"
            style={{
                borderColor: coachReviewTheme.colors.border,
                backgroundColor: coachReviewTheme.colors.white,
            }}
        >
            <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-end gap-3">
                        <h2
                            className="font-semibold leading-none"
                            style={{
                                color: coachReviewTheme.colors.heading,
                                fontSize: coachReviewTheme.fontSizes.title,
                            }}
                        >
                            {averageRating}
                        </h2>

                        <div>
                            <p
                                style={{
                                    color: coachReviewTheme.colors.star,
                                    fontSize: coachReviewTheme.fontSizes.title,
                                }}
                            >
                                {starsText}
                            </p>

                            <p
                                style={{
                                    color: coachReviewTheme.colors.secondaryText,
                                    fontSize: coachReviewTheme.fontSizes.label,
                                }}
                            >
                                {reviewCount} review{reviewCount === 1 ? "" : "s"}
                            </p>
                        </div>
                    </div>
                </div>

                <Button
                    onPress={onWriteReview}
                    variant="outline"
                    style={{
                        color: coachReviewTheme.colors.heading,
                        fontSize: coachReviewTheme.fontSizes.label,
                    }}
                >
                    Write Review
                </Button>
            </div>

            <div className="flex flex-col gap-3">
                {breakdown.map((row) => (
                    <div key={row.star} className="flex items-center gap-3">
                        <span
                            style={{
                                width: "28px",
                                color: coachReviewTheme.colors.secondaryText,
                                fontSize: coachReviewTheme.fontSizes.label,
                            }}
                        >
                            {row.star}★
                        </span>

                        <div
                            className="h-2 flex-1 overflow-hidden rounded-full"
                            style={{ backgroundColor: coachReviewTheme.colors.track }}
                        >
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${row.percent}%`,
                                    backgroundColor: coachReviewTheme.colors.primary,
                                }}
                            />
                        </div>

                        <span
                            style={{
                                width: "28px",
                                textAlign: "right",
                                color: coachReviewTheme.colors.secondaryText,
                                fontSize: coachReviewTheme.fontSizes.label,
                            }}
                        >
                            {row.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
