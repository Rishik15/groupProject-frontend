import type { ApiSuccess, IsoDateString } from "./api";

export type AdminCoachPriceRequestStatus = "pending" | "approved" | "rejected";

export interface AdminCoachPriceRequest {
  request_id: number;
  coach_id: number;
  coach_name: string;
  current_price: number | null;
  proposed_price: number | null;
  status: AdminCoachPriceRequestStatus;
  admin_action: string | null;
  reviewed_by_admin_id: number | null;
  reviewed_at: IsoDateString | null;
  created_at: IsoDateString | null;
  updated_at: IsoDateString | null;
}

export interface CoachPriceActionPayload {
  request_id: number;
  admin_action?: string;
}

export interface GetPendingCoachPriceRequestsResponse extends ApiSuccess {
  requests: AdminCoachPriceRequest[];
}

export interface CoachPriceActionResponse extends ApiSuccess {
  request: AdminCoachPriceRequest;
}
