import { adminDelete, adminGet, adminPatch, adminPost } from "../../utils/Admin/adminApi";
import type {
  CreateExercisePayload,
  DeleteExercisePayload,
  ExerciseMutationResponse,
  GetExercisesResponse,
  UpdateExercisePayload,
} from "../../utils/Interfaces/Admin";

export const getExercises = (signal?: AbortSignal) => {
  return adminGet<GetExercisesResponse>("/exercises", signal);
};

export const createExercise = (
  payload: CreateExercisePayload,
  signal?: AbortSignal,
) => {
  return adminPost<ExerciseMutationResponse, CreateExercisePayload>(
    "/exercises",
    payload,
    signal,
  );
};

export const updateExercise = (
  payload: UpdateExercisePayload,
  signal?: AbortSignal,
) => {
  return adminPatch<ExerciseMutationResponse, UpdateExercisePayload>(
    "/exercises",
    payload,
    signal,
  );
};

export const deleteExercise = (
  payload: DeleteExercisePayload,
  signal?: AbortSignal,
) => {
  return adminDelete<{ message: string }, DeleteExercisePayload>(
    "/exercises",
    payload,
    signal,
  );
};

const adminExerciseService = {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
};

export default adminExerciseService;
