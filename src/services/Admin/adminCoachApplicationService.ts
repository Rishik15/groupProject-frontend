import { adminPatch, adminPost } from "../../utils/Admin/adminApi";
import type {
  CoachApplicationActionPayload,
  CoachApplicationActionResponse,
  GetCoachApplicationsPayload,
  GetCoachApplicationsResponse,
} from "../../utils/Interfaces/Admin";

export const getCoachApplications = (payload: GetCoachApplicationsPayload) => {
  return adminPost<GetCoachApplicationsResponse, GetCoachApplicationsPayload>(
    "/coach-applications/list",
    payload,
  );
};

export const approveCoachApplication = (
  payload: CoachApplicationActionPayload,
) => {
  return adminPatch<
    CoachApplicationActionResponse,
    CoachApplicationActionPayload
  >("/coach-applications/approve", payload);
};

export const rejectCoachApplication = (
  payload: CoachApplicationActionPayload,
) => {
  return adminPatch<
    CoachApplicationActionResponse,
    CoachApplicationActionPayload
  >("/coach-applications/reject", payload);
};

const adminCoachApplicationService = {
  getCoachApplications,
  approveCoachApplication,
  rejectCoachApplication,
};

export default adminCoachApplicationService;
