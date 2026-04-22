import { adminDelete, adminGet, adminPatch, adminPost } from "../../utils/Admin/adminApi";
import type {
  CreateWorkoutPayload,
  DeleteWorkoutPayload,
  GetWorkoutsResponse,
  UpdateWorkoutExercisesPayload,
  UpdateWorkoutPayload,
  WorkoutMutationResponse,
} from "../../utils/Interfaces/Admin";

export const getWorkouts = (signal?: AbortSignal) => {
  return adminGet<GetWorkoutsResponse>("/workouts", signal);
};

export const createWorkout = (
  payload: CreateWorkoutPayload,
  signal?: AbortSignal,
) => {
  return adminPost<WorkoutMutationResponse, CreateWorkoutPayload>(
    "/workouts",
    payload,
    signal,
  );
};

export const updateWorkout = (
  payload: UpdateWorkoutPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<WorkoutMutationResponse, UpdateWorkoutPayload>(
    "/workouts",
    payload,
    signal,
  );
};

export const deleteWorkout = (
  payload: DeleteWorkoutPayload,
  signal?: AbortSignal,
) => {
  return adminDelete<{ message: string }, DeleteWorkoutPayload>(
    "/workouts",
    payload,
    signal,
  );
};

export const updateWorkoutExercises = (
  payload: UpdateWorkoutExercisesPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<WorkoutMutationResponse, UpdateWorkoutExercisesPayload>(
    "/workouts/exercises",
    payload,
    signal,
  );
};

const adminWorkoutService = {
  getWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  updateWorkoutExercises,
};

export default adminWorkoutService;