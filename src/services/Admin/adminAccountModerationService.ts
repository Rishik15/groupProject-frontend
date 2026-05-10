import { adminGet, adminPatch } from "../../utils/Admin/adminApi";
import type {
  DeactivateUserPayload,
  GetActiveCoachesResponse,
  GetUsersResponse,
  SuspendUserPayload,
  UpdateUserStatusPayload,
  UserStatusMutationResponse,
} from "../../utils/Interfaces/Admin";

export const getUsers = () => {
  return adminGet<GetUsersResponse>("/users");
};

export const suspendUser = (payload: SuspendUserPayload) => {
  return adminPatch<UserStatusMutationResponse, SuspendUserPayload>(
    "/users/suspend",
    payload,
  );
};

export const deactivateUser = (payload: DeactivateUserPayload) => {
  return adminPatch<UserStatusMutationResponse, DeactivateUserPayload>(
    "/users/deactivate",
    payload,
  );
};

export const updateUserStatus = (payload: UpdateUserStatusPayload) => {
  return adminPatch<UserStatusMutationResponse, UpdateUserStatusPayload>(
    "/users/status",
    payload,
  );
};

export const getActiveCoaches = () => {
  return adminGet<GetActiveCoachesResponse>("/coaches/active");
};

const adminAccountModerationService = {
  getUsers,
  suspendUser,
  deactivateUser,
  updateUserStatus,
  getActiveCoaches,
};

export default adminAccountModerationService;
