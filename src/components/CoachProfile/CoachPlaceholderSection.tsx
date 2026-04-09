import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";

interface CoachPlaceholderSectionProps {
    message: string;
}

// Reusable card for empty states, loading states, and placeholders.
export default function CoachPlaceholderSection({
    message,
}: CoachPlaceholderSectionProps) {
    return (
        <div
            className="rounded-2xl border p-6"
            style={{
                borderColor: coachReviewTheme.colors.border,
                backgroundColor: coachReviewTheme.colors.white,
            }}
        >
            <p
                style={{
                    color: coachReviewTheme.colors.secondaryText,
                    fontSize: coachReviewTheme.fontSizes.label,
                }}
            >
                {message}
            </p>
        </div>
    );
}
