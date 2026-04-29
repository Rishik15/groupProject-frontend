import api from "@/services/api";
import type {
  CoachInfoResponse,
  CoachReviewResponse,
  LeaveCoachReviewPayload,
} from "../../utils/Interfaces/CoachReview/coachReview";

export async function getCoachInfo(
  coachId: number,
): Promise<CoachInfoResponse> {
  console.log("[getCoachInfo] sending coach_id:", coachId);

  const response = await api.get<CoachInfoResponse>("/coach/get_coach_info", {
    params: { coach_id: coachId },
  });

  console.log("[getCoachInfo] response:", response.data);

  return response.data;
}

export async function getCoachReviews(
  coachId: number,
): Promise<CoachReviewResponse> {
  console.log("[getCoachReviews] sending coach_id:", coachId);

  const response = await api.get<CoachReviewResponse>("/coach/get_review", {
    params: { coach_id: coachId },
  });

  console.log("[getCoachReviews] response:", response.data);

  return response.data;
}

export async function leaveCoachReview(
  payload: LeaveCoachReviewPayload,
): Promise<{ message: string }> {
  console.log("[leaveCoachReview] payload:", payload);

  const response = await api.post<{ message: string }>(
    "/coach/leave_review",
    payload,
  );

  console.log("[leaveCoachReview] response:", response.data);

  return response.data;
}
