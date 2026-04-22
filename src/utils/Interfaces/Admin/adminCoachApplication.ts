import type { ApiSuccess, Nullable } from "./api";

export type AdminCoachApplicationStatus = "pending" | "approved" | "rejected";

export interface AdminCoachApplication {
  id: number;
  application_id: number;
  user_id: number;
  name: string;
  email: string;
  appliedLabel: Nullable<string>;
  status: AdminCoachApplicationStatus;
  years_experience: Nullable<number>;
  coach_description: Nullable<string>;
  desired_price: Nullable<number>;
  admin_action: Nullable<string>;
  certifications: string[];
}

export interface GetCoachApplicationsPayload {
  status: AdminCoachApplicationStatus;
}

export interface CoachApplicationActionPayload {
  application_id: number;
  admin_action: string;
}

export interface GetCoachApplicationsResponse extends ApiSuccess {
  applications: AdminCoachApplication[];
}

export interface CoachApplicationActionResponse extends ApiSuccess {
  application: Pick<
    AdminCoachApplication,
    "application_id" | "status" | "admin_action"
  >;
}
