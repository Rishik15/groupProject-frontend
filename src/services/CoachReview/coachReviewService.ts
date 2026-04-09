import axios from "axios";
import type {
    CoachInfoResponse,
    CoachReviewResponse,
    LeaveCoachReviewPayload,
} from "../../utils/Interfaces/CoachReview/coachReview";

const API_BASE =
    import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ||
    "http://localhost:8080";

// Fetch the main coach profile info for the header/body card.
export async function getCoachInfo(
    coachId: number
): Promise<CoachInfoResponse> {
    const response = await axios.get<CoachInfoResponse>(
        `${API_BASE}/coach/get_coach_info`,
        {
            params: { coach_id: coachId },
            withCredentials: true,
        }
    );

    return response.data;
}

// Fetch all reviews and the average rating for one coach.
export async function getCoachReviews(
    coachId: number
): Promise<CoachReviewResponse> {
    const response = await axios.get<CoachReviewResponse>(
        `${API_BASE}/coach/get_review`,
        {
            params: { coach_id: coachId },
            withCredentials: true,
        }
    );

    return response.data;
}

// Submit a new review for one coach.
// The backend expects coach_id, rating, and review_text in the request body.
export async function leaveCoachReview(
    payload: LeaveCoachReviewPayload
): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(
        `${API_BASE}/coach/leave_review`,
        payload,
        {
            withCredentials: true,
        }
    );

    return response.data;
}