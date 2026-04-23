import { Button } from "@heroui/react";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";
import { X } from "lucide-react";
import StarRating from "./StarRating";

interface WriteReviewModalProps {
    isOpen: boolean;
    coachId: number;
    rating: number;
    reviewText: string;
    isSubmitting: boolean;
    submitError: string;
    onClose: () => void;
    onRatingChange: (rating: number) => void;
    onReviewTextChange: (value: string) => void;
    onSubmit: () => void;
}

// Small controlled modal used by the review section.
// The parent owns the state so this component stays presentational.
export default function WriteReviewModal({
    isOpen,
    coachId,
    rating,
    reviewText,
    isSubmitting,
    submitError,
    onClose,
    onRatingChange,
    onReviewTextChange,
    onSubmit,
}: WriteReviewModalProps) {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ backgroundColor: coachReviewTheme.colors.overlay }}
        >
            <div
                className="w-full max-w-lg rounded-2xl border p-6"
                style={{
                    borderColor: coachReviewTheme.colors.border,
                    backgroundColor: coachReviewTheme.colors.white,
                }}
            >
                <div className="mb-5 flex items-start justify-between gap-4">
                    <div>
                        <h2
                            className="font-semibold"
                            style={{
                                color: coachReviewTheme.colors.heading,
                                fontSize: coachReviewTheme.fontSizes.title,
                            }}
                        >
                            Write Review
                        </h2>

                        <p
                            className="mt-1"
                            style={{
                                color: coachReviewTheme.colors.secondaryText,
                                fontSize: coachReviewTheme.fontSizes.body,
                            }}
                        >
                            Coach ID: {coachId}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-transparent"
                        style={{
                            color: coachReviewTheme.colors.secondaryText,
                            fontSize: coachReviewTheme.fontSizes.label,
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="mb-5">
                    <p
                        className="mb-2"
                        style={{
                            color: coachReviewTheme.colors.heading,
                            fontSize: coachReviewTheme.fontSizes.label,
                        }}
                    >
                        Rating
                    </p>

                    <StarRating rating={rating} onChange={onRatingChange} size={20} />
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="coach-review-text"
                        className="mb-2 block"
                        style={{
                            color: coachReviewTheme.colors.heading,
                            fontSize: coachReviewTheme.fontSizes.label,
                        }}
                    >
                        Review
                    </label>

                    <textarea
                        id="coach-review-text"
                        value={reviewText}
                        onChange={(event) => onReviewTextChange(event.target.value)}
                        rows={5}
                        className="w-full rounded-xl border p-3 outline-none"
                        style={{
                            borderColor: coachReviewTheme.colors.border,
                            color: coachReviewTheme.colors.heading,
                            fontSize: coachReviewTheme.fontSizes.body,
                        }}
                        placeholder="Write your review here..."
                    />
                </div>

                {submitError ? (
                    <p
                        className="mb-4"
                        style={{
                            color: coachReviewTheme.colors.danger,
                            fontSize: coachReviewTheme.fontSizes.body,
                        }}
                    >
                        {submitError}
                    </p>
                ) : null}

                <div className="flex justify-end gap-3">
                    <Button
                        onPress={onClose}
                        variant="ghost"
                        isDisabled={isSubmitting}
                        style={{
                            color: coachReviewTheme.colors.heading,
                            fontSize: coachReviewTheme.fontSizes.label,
                        }}
                    >
                        Cancel
                    </Button>

                    <Button
                        onPress={onSubmit}
                        variant="primary"
                        isDisabled={isSubmitting}
                        style={{
                            backgroundColor: coachReviewTheme.colors.primary,
                            color: "#FFFFFF",
                            fontSize: coachReviewTheme.fontSizes.label,
                        }}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Review"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
