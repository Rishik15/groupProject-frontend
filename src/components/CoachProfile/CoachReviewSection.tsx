import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import type { CoachReviewResponse } from "../../utils/Interfaces/CoachReview/coachReview";
import {
    getCoachReviews,
    leaveCoachReview,
} from "../../services/CoachReview/coachReviewService";
import { buildRatingBreakdown } from "../../utils/CoachReview/coachReviewHelper";
import { coachReviewTheme } from "../../utils/CoachReview/coachReviewTheme";
import CoachReviewSummary from "./CoachReviewSummary";
import WriteReviewModal from "./WriteReviewModal";
import CoachPlaceholderSection from "./CoachPlaceholderSection";

interface CoachReviewsSectionProps {
    coachId: number;
}

// This is the main container for the review feature.
// owns the backend calls, modal state, and review submit flow.
export default function CoachReviewsSection({
    coachId,
}: CoachReviewsSectionProps) {
    const [reviewData, setReviewData] = useState<CoachReviewResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // useCallback so the same fetch can be reused after submit.
    const fetchReviews = useCallback(async () => {
        try {
            setIsLoading(true);
            setLoadError("");

            const data = await getCoachReviews(coachId);
            setReviewData(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setLoadError(error.response?.data?.error || "Failed to load reviews.");
            } else {
                setLoadError("Failed to load reviews.");
            }
        } finally {
            setIsLoading(false);
        }
    }, [coachId]);

    useEffect(() => {
        if (!Number.isFinite(coachId) || coachId <= 0) {
            setLoadError("Invalid coach id.");
            setIsLoading(false);
            return;
        }

        void fetchReviews();
    }, [coachId, fetchReviews]);

    const reviews = reviewData?.reviews ?? [];
    const breakdown = useMemo(() => buildRatingBreakdown(reviews), [reviews]);
    const averageRating =
        reviewData?.coach_avg_rating == null
            ? "0.0"
            : reviewData.coach_avg_rating.toFixed(1);

    const openModal = () => {
        setSubmitError("");
        setRating(5);
        setReviewText("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (!isSubmitting) {
            setIsModalOpen(false);
            setSubmitError("");
        }
    };

    const submitReview = async () => {
        try {
            setIsSubmitting(true);
            setSubmitError("");

            await leaveCoachReview({
                coach_id: coachId,
                rating,
                review_text: reviewText.trim(),
            });

            setIsModalOpen(false);
            setRating(5);
            setReviewText("");

            // refresh the list of reviews so new review appears immediately
            await fetchReviews();
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setSubmitError(
                    error.response?.data?.error || "Failed to submit review."
                );
            } else {
                setSubmitError("Failed to submit review.");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <CoachPlaceholderSection message="Loading reviews..." />;
    }

    if (loadError) {
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
                        color: coachReviewTheme.colors.danger,
                        fontSize: coachReviewTheme.fontSizes.label,
                    }}
                >
                    {loadError}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col gap-6">
                <CoachReviewSummary
                    averageRating={averageRating}
                    averageRatingValue={reviewData?.coach_avg_rating ?? 0}
                    reviewCount={reviews.length}
                    breakdown={breakdown}
                    onWriteReview={openModal}
                />
            </div>

            <WriteReviewModal
                isOpen={isModalOpen}
                coachId={coachId}
                rating={rating}
                reviewText={reviewText}
                isSubmitting={isSubmitting}
                submitError={submitError}
                onClose={closeModal}
                onRatingChange={setRating}
                onReviewTextChange={setReviewText}
                onSubmit={submitReview}
            />
        </>
    );
}
