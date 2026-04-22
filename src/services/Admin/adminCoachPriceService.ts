import { adminGet, adminPatch } from "../../utils/Admin/adminApi";
import type {
  CoachPriceActionPayload,
  CoachPriceActionResponse,
  GetPendingCoachPriceRequestsResponse,
} from "../../utils/Interfaces/Admin";

export const getPendingCoachPriceRequests = (signal?: AbortSignal) => {
  return adminGet<GetPendingCoachPriceRequestsResponse>(
    "/coach-prices/pending",
    signal,
  );
};

export const approveCoachPriceRequest = (
  payload: CoachPriceActionPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<CoachPriceActionResponse, CoachPriceActionPayload>(
    "/coach-prices/approve",
    payload,
    signal,
  );
};

export const rejectCoachPriceRequest = (
  payload: CoachPriceActionPayload,
  signal?: AbortSignal,
) => {
  return adminPatch<CoachPriceActionResponse, CoachPriceActionPayload>(
    "/coach-prices/reject",
    payload,
    signal,
  );
};

const adminCoachPriceService = {
  getPendingCoachPriceRequests,
  approveCoachPriceRequest,
  rejectCoachPriceRequest,
};

export default adminCoachPriceService;
