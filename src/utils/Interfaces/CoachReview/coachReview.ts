// Shared TypeScript types for the coach review MVP.
// Keeping these in one place makes the page, components, and services agree
// on the same backend request/response shapes.

export interface CoachReview {
  review_id: number;
  rating: number;
  review_text: string;
  reviewer_first_name: string;
  reviewer_last_name: string;
  created_at: string;
  updated_at: string;
}

export interface CoachReviewResponse {
  coach_avg_rating: number | null;
  reviews: CoachReview[];
  coach_first_name: string;
  coach_last_name: string;
}

export interface LeaveCoachReviewPayload {
  coach_id: number;
  rating: number;
  review_text: string;
}

// Small UI-only helper type for the rating bars shown in the review summary.
export interface RatingBreakdownRow {
  star: number;
  count: number;
  percent: number;
}
