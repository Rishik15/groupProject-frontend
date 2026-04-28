import { adminPatch, adminPost } from "../../utils/Admin/adminApi";
import type {
  CoachApplicationActionPayload,
  CoachApplicationActionResponse,
  GetCoachApplicationsPayload,
  GetCoachApplicationsResponse,
} from "../../utils/Interfaces/Admin";

export const getCoachApplications = (
  payload: GetCoachApplicationsPayload,
  signal?: AbortSignal,
) => {
  return adminPost<GetCoachApplicationsResponse, GetCoachApplicationsPayload>(
    "/coach-applications/list",
    payload,
    signal,
  );
};

export const approveCoachApplication = (
  payload: CoachApplicationActionPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<CoachApplicationActionResponse, CoachApplicationActionPayload>(
    "/coach-applications/approve",
    payload,
    signal,
  );
};

export const rejectCoachApplication = (
  payload: CoachApplicationActionPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<CoachApplicationActionResponse, CoachApplicationActionPayload>(
    "/coach-applications/reject",
    payload,
    signal,
  );
};

const adminCoachApplicationService = {
  getCoachApplications,
  approveCoachApplication,
  rejectCoachApplication,
};

export default adminCoachApplicationService;
