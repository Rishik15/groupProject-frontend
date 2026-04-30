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
  mode?: string | null,
): Promise<CoachReviewResponse> {
  console.log("[getCoachReviews] sending:", { coach_id: coachId, mode });

  const response = await api.get<CoachReviewResponse>("/coach/get_review", {
    params: {
      coach_id: coachId,
      mode,
    },
  });

  console.log("[getCoachReviews] response:", response.data);

  return response.data;
}

export async function leaveCoachReview(
  payload: LeaveCoachReviewPayload,
  mode?: string | null,
): Promise<{ message: string }> {
  const finalPayload = {
    ...payload,
    mode,
  };

  console.log("[leaveCoachReview] payload:", finalPayload);

  const response = await api.post<{ message: string }>(
    "/coach/leave_review",
    finalPayload,
  );

  console.log("[leaveCoachReview] response:", response.data);

  return response.data;
}
