import {
  adminDelete,
  adminGet,
  adminPatch,
  adminPost,
} from "../../utils/Admin/adminApi";
import type {
  CreateExercisePayload,
  DeleteExercisePayload,
  ExerciseMutationResponse,
  GetExercisesResponse,
  UpdateExercisePayload,
} from "../../utils/Interfaces/Admin";

export const getExercises = () => {
  return adminGet<GetExercisesResponse>("/exercises");
};

export const createExercise = (payload: CreateExercisePayload) => {
  return adminPost<ExerciseMutationResponse, CreateExercisePayload>(
    "/exercises",
    payload,
  );
};

export const updateExercise = (payload: UpdateExercisePayload) => {
  return adminPatch<ExerciseMutationResponse, UpdateExercisePayload>(
    "/exercises",
    payload,
  );
};

export const deleteExercise = (payload: DeleteExercisePayload) => {
  return adminDelete<{ message: string }, DeleteExercisePayload>(
    "/exercises",
    payload,
  );
};

const adminExerciseService = {
  getExercises,
  createExercise,
  updateExercise,
  deleteExercise,
};

export default adminExerciseService;
