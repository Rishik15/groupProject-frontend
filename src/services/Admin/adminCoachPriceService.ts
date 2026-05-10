import { adminGet, adminPatch } from "../../utils/Admin/adminApi";
import type {
  CoachPriceActionPayload,
  CoachPriceActionResponse,
  GetPendingCoachPriceRequestsResponse,
} from "../../utils/Interfaces/Admin";

export const getPendingCoachPriceRequests = () => {
  return adminGet<GetPendingCoachPriceRequestsResponse>(
    "/coach-prices/pending",
  );
};

export const approveCoachPriceRequest = (payload: CoachPriceActionPayload) => {
  return adminPatch<CoachPriceActionResponse, CoachPriceActionPayload>(
    "/coach-prices/approve",
    payload,
  );
};

export const rejectCoachPriceRequest = (payload: CoachPriceActionPayload) => {
  return adminPatch<CoachPriceActionResponse, CoachPriceActionPayload>(
    "/coach-prices/reject",
    payload,
  );
};

const adminCoachPriceService = {
  getPendingCoachPriceRequests,
  approveCoachPriceRequest,
  rejectCoachPriceRequest,
};

export default adminCoachPriceService;
