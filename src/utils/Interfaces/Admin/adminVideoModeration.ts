import type { ApiSuccess } from "./api";
import type { VideoStatus } from "./adminExercise";

export interface AdminModeratedVideo {
  exercise_id: number;
  exercise_name: string;
  video_url: string | null;
  video_status: VideoStatus;
  video_review_note: string | null;
  created_by: number;
}

export interface ApproveVideoPayload {
  exercise_id: number;
}

export interface RejectVideoPayload {
  exercise_id: number;
  video_review_note: string;
}

export interface RemoveVideoPayload {
  exercise_id: number;
}

export interface GetPendingVideosResponse extends ApiSuccess {
  videos: AdminModeratedVideo[];
}

export interface VideoModerationMutationResponse extends ApiSuccess {
  video: Pick<
    AdminModeratedVideo,
    "exercise_id" | "video_status" | "video_review_note" | "video_url"
  >;
}
