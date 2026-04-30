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
import { useAuth } from "../../utils/auth/AuthContext";

interface CoachReviewsSectionProps {
  coachId: number;
  onReviewSubmitted?: () => void;
}

export default function CoachReviewsSection({
  coachId,
  onReviewSubmitted,
}: CoachReviewsSectionProps) {
  const { activeMode } = useAuth();

  const [reviewData, setReviewData] = useState<CoachReviewResponse | null>(
    null,
  );

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchReviews = useCallback(async () => {
    try {
      console.log(
        "[CoachReviewsSection] fetching reviews for coachId:",
        coachId,
      );
      console.log("[CoachReviewsSection] activeMode:", activeMode);

      setIsLoading(true);
      setLoadError("");

      const data = await getCoachReviews(coachId, activeMode);

      console.log("[CoachReviewsSection] review response:", data);
      console.log("[CoachReviewsSection] can_review:", data.can_review);
      console.log(
        "[CoachReviewsSection] reviews length:",
        data.reviews?.length,
      );

      setReviewData(data);
    } catch (error) {
      console.error("[CoachReviewsSection] failed to load reviews:", error);

      if (axios.isAxiosError(error)) {
        console.error(
          "[CoachReviewsSection] axios response:",
          error.response?.data,
        );
        setLoadError(error.response?.data?.error || "Failed to load reviews.");
      } else {
        setLoadError("Failed to load reviews.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [coachId, activeMode]);

  useEffect(() => {
    console.log("[CoachReviewsSection] mounted/changed coachId:", coachId);
    console.log(
      "[CoachReviewsSection] mounted/changed activeMode:",
      activeMode,
    );

    if (!Number.isFinite(coachId) || coachId <= 0) {
      console.log("[CoachReviewsSection] invalid coach id:", coachId);
      setLoadError("Invalid coach id.");
      setIsLoading(false);
      return;
    }

    void fetchReviews();
  }, [coachId, activeMode, fetchReviews]);

  const reviews = reviewData?.reviews ?? [];

  const breakdown = useMemo(() => {
    console.log(
      "[CoachReviewsSection] building breakdown for reviews:",
      reviews,
    );

    return buildRatingBreakdown(reviews);
  }, [reviews]);

  const averageRating =
    reviewData?.coach_avg_rating == null
      ? "0.0"
      : reviewData.coach_avg_rating.toFixed(1);

  const canReview = reviewData?.can_review ?? false;

  console.log("[CoachReviewsSection render] reviewData:", reviewData);
  console.log("[CoachReviewsSection render] canReview:", canReview);
  console.log("[CoachReviewsSection render] averageRating:", averageRating);
  console.log("[CoachReviewsSection render] reviewCount:", reviews.length);
  console.log("[CoachReviewsSection render] isLoading:", isLoading);
  console.log("[CoachReviewsSection render] loadError:", loadError);
  console.log("[CoachReviewsSection render] activeMode:", activeMode);

  const openModal = () => {
    console.log("[CoachReviewsSection] write review clicked");
    console.log("[CoachReviewsSection] canReview:", canReview);
    console.log("[CoachReviewsSection] activeMode:", activeMode);

    if (!canReview) {
      console.log(
        "[CoachReviewsSection] modal blocked because canReview is false",
      );
      return;
    }

    setSubmitError("");
    setRating(5);
    setReviewText("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("[CoachReviewsSection] close modal clicked");
    console.log("[CoachReviewsSection] isSubmitting:", isSubmitting);

    if (!isSubmitting) {
      setIsModalOpen(false);
      setSubmitError("");
    }
  };

  const submitReview = async () => {
    try {
      console.log("[CoachReviewsSection] submitting review");
      console.log("[CoachReviewsSection] coachId:", coachId);
      console.log("[CoachReviewsSection] rating:", rating);
      console.log("[CoachReviewsSection] reviewText:", reviewText);
      console.log("[CoachReviewsSection] activeMode:", activeMode);

      setIsSubmitting(true);
      setSubmitError("");

      await leaveCoachReview(
        {
          coach_id: coachId,
          rating,
          review_text: reviewText.trim(),
        },
        activeMode,
      );

      console.log("[CoachReviewsSection] review submitted successfully");

      setIsModalOpen(false);
      setRating(5);
      setReviewText("");

      await fetchReviews();

      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error("[CoachReviewsSection] failed to submit review:", error);

      if (axios.isAxiosError(error)) {
        console.error(
          "[CoachReviewsSection] submit axios response:",
          error.response?.data,
        );

        setSubmitError(
          error.response?.data?.error || "Failed to submit review.",
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
          onWriteReview={canReview ? openModal : undefined}
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
