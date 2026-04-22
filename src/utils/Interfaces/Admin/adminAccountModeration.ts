import type { ApiSuccess, IsoDateString, Nullable } from "./api";

export type AccountStatus = "active" | "suspended" | "deactivated";

export interface AdminManagedUser {
  user_id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  phone_number?: Nullable<string>;
  is_coach: boolean;
  is_admin: boolean;
  account_status: AccountStatus;
  suspension_reason: Nullable<string>;
  updated_at: Nullable<IsoDateString>;
}

export interface AdminActiveCoachCertification {
  cert_name: string;
  provider_name: Nullable<string>;
  description: Nullable<string>;
  issued_date: Nullable<IsoDateString>;
  expires_date: Nullable<IsoDateString>;
}

export interface AdminActiveCoach {
  user_id: number;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  coach_description: Nullable<string>;
  price: Nullable<number>;
  contract_count: number;
  certifications: AdminActiveCoachCertification[];
}

export interface SuspendUserPayload {
  user_id: number;
  suspension_reason: string;
}

export interface DeactivateUserPayload {
  user_id: number;
  suspension_reason: string;
}

export interface UpdateUserStatusPayload {
  user_id: number;
  account_status: AccountStatus;
  suspension_reason: Nullable<string>;
}

export interface GetUsersResponse extends ApiSuccess {
  users: AdminManagedUser[];
}

export interface GetActiveCoachesResponse extends ApiSuccess {
  coaches: AdminActiveCoach[];
}

export interface UserStatusMutationResponse extends ApiSuccess {
  user: Pick<AdminManagedUser, "user_id" | "account_status" | "suspension_reason">;
}
