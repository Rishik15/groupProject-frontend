import type { ApiSuccess, Nullable } from "./api";

export type VideoStatus = "pending" | "approved" | "rejected";

export interface AdminExercise {
  exercise_id: number;
  exercise_name: string;
  equipment: Nullable<string>;
  video_url: Nullable<string>;
  video_status: VideoStatus;
  video_review_note: Nullable<string>;
  created_by: number;
}

export interface CreateExercisePayload {
  exercise_name: string;
  equipment?: Nullable<string>;
  video_url?: Nullable<string>;
  created_by?: number;
}

export interface UpdateExercisePayload {
  exercise_id: number;
  exercise_name?: string;
  equipment?: Nullable<string>;
  video_url?: Nullable<string>;
}

export interface DeleteExercisePayload {
  exercise_id: number;
}

export interface GetExercisesResponse extends ApiSuccess {
  exercises: AdminExercise[];
}

export interface ExerciseMutationResponse extends ApiSuccess {
  exercise: AdminExercise;
}
