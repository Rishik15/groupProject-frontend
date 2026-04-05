import type { CoachReview } from "../../utils/Interfaces/CoachReview/coachReview";
import {
    formatRelativeDate,
    formatReviewerName,
} from "../../utils/CoachReview/coachReviewHelper";
import StarRating from "./StarRating";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";

interface CoachReviewCardProps {
    review: CoachReview;
}
export default function CoachReviewCard({ review }: CoachReviewCardProps) {
    return (
        <div
            className="rounded-2xl border p-6"
            style={{
                borderColor: coachReviewTheme.colors.border,
                backgroundColor: coachReviewTheme.colors.white,
            }}
        >
            <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                    <h3
                        className="font-semibold"
                        style={{
                            color: coachReviewTheme.colors.heading,
                            fontSize: coachReviewTheme.fontSizes.title,
                        }}
                    >
                        {formatReviewerName(review)}
                    </h3>

                    <p
                        style={{
                            color: coachReviewTheme.colors.secondaryText,
                            fontSize: coachReviewTheme.fontSizes.label,
                        }}
                    >
                        {formatRelativeDate(review.created_at)}
                    </p>
                </div>

                <StarRating rating={review.rating} />
            </div>

            <p
                style={{
                    color: coachReviewTheme.colors.secondaryText,
                    fontSize: coachReviewTheme.fontSizes.label,
                }}
            >
                {review.review_text || "No written review provided."}
            </p>
        </div>
    );
}
