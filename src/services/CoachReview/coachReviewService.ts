import api from "@/services/api";
import type {
  CoachInfoResponse,
  CoachReviewResponse,
  LeaveCoachReviewPayload,
} from "../../utils/Interfaces/CoachReview/coachReview";

export async function getCoachInfo(
  coachId: number,
): Promise<CoachInfoResponse> {
  const response = await api.get<CoachInfoResponse>("/coach/get_coach_info", {
    params: { coach_id: coachId },
  });

  return response.data;
}

export async function getCoachReviews(
  coachId: number,
): Promise<CoachReviewResponse> {
  const response = await api.get<CoachReviewResponse>("/coach/get_review", {
    params: { coach_id: coachId },
  });

  return response.data;
}

export async function leaveCoachReview(
  payload: LeaveCoachReviewPayload,
): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>(
    "/coach/leave_review",
    payload,
  );

  return response.data;
}
