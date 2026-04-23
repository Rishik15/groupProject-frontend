import type { ApiSuccess, IsoDateString } from "./api";

export type AdminCoachPriceRequestStatus = "pending" | "approved" | "rejected";

export interface AdminCoachPriceRequest {
  request_id: number;
  coach_id: number;
  coach_name: string;
  current_price: number;
  proposed_price: number;
  status: AdminCoachPriceRequestStatus;
  created_at: IsoDateString;
}

export interface CoachPriceActionPayload {
  request_id: number;
  admin_action: string;
}

export interface GetPendingCoachPriceRequestsResponse extends ApiSuccess {
  requests: AdminCoachPriceRequest[];
}

export interface CoachPriceActionResponse extends ApiSuccess {
  request: Pick<AdminCoachPriceRequest, "request_id" | "status" | "proposed_price">;
}
