import { Button } from "@heroui/react";
import type { RatingBreakdownRow } from "../../utils/Interfaces/CoachReview/coachReview";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";
import StarRating from "./StarRating";

interface CoachReviewSummaryProps {
  averageRating: string;
  averageRatingValue: number;
  reviewCount: number;
  breakdown: RatingBreakdownRow[];
  onWriteReview?: () => void;
}

export default function CoachReviewSummary({
  averageRating,
  averageRatingValue,
  reviewCount,
  breakdown,
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
          <div className="flex items-center gap-3">
            <h2
              className="text-2xl font-semibold leading-none"
              style={{
                color: coachReviewTheme.colors.heading,
              }}
            >
              {averageRating}
            </h2>

            <div>
              <StarRating rating={Math.round(averageRatingValue)} />

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

        {onWriteReview && (
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
        )}
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
              {row.star}
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
