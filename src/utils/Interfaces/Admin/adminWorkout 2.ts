import type { ApiSuccess, Nullable } from "./api";

export interface AdminWorkout {
  plan_id: number;
  plan_name: string;
  description: Nullable<string>;
  author_user_id: number;
  is_public: number;
  total_exercises?: number;
}

export interface AdminWorkoutExerciseInput {
  exercise_id: number;
  sets?: Nullable<number>;
  reps?: Nullable<number>;
}

export interface CreateWorkoutPayload {
  plan_name: string;
  description?: Nullable<string>;
  author_user_id: number;
  is_public: number;
  exercises: AdminWorkoutExerciseInput[];
}

export interface UpdateWorkoutPayload {
  plan_id: number;
  plan_name?: string;
  description?: Nullable<string>;
  is_public?: number;
}

export interface DeleteWorkoutPayload {
  plan_id: number;
}

/**
 * Current backend behavior only updates the first day.
 * Keep this typed for the dedicated editor flow, but do not assume multi-day support yet.
 */
export interface UpdateWorkoutExercisesPayload {
  plan_id: number;
  exercises: AdminWorkoutExerciseInput[];
}

export interface GetWorkoutsResponse extends ApiSuccess {
  workouts: AdminWorkout[];
}

export interface WorkoutMutationResponse extends ApiSuccess {
  workout: AdminWorkout;
}
