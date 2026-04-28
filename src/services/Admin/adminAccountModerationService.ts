import { adminGet, adminPatch } from "../../utils/Admin/adminApi";
import type {
  DeactivateUserPayload,
  GetActiveCoachesResponse,
  GetUsersResponse,
  SuspendUserPayload,
  UpdateUserStatusPayload,
  UserStatusMutationResponse,
} from "../../utils/Interfaces/Admin";

export const getUsers = (signal?: AbortSignal) => {
  return adminGet<GetUsersResponse>("/users", signal);
};

export const suspendUser = (
  payload: SuspendUserPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<UserStatusMutationResponse, SuspendUserPayload>(
    "/users/suspend",
    payload,
    signal,
  );
};

export const deactivateUser = (
  payload: DeactivateUserPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<UserStatusMutationResponse, DeactivateUserPayload>(
    "/users/deactivate",
    payload,
    signal,
  );
};

export const updateUserStatus = (
  payload: UpdateUserStatusPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<UserStatusMutationResponse, UpdateUserStatusPayload>(
    "/users/status",
    payload,
    signal,
  );
};

export const getActiveCoaches = (signal?: AbortSignal) => {
  return adminGet<GetActiveCoachesResponse>("/coaches/active", signal);
};

const adminAccountModerationService = {
  getUsers,
  suspendUser,
  deactivateUser,
  updateUserStatus,
  getActiveCoaches,
};

export default adminAccountModerationService;
