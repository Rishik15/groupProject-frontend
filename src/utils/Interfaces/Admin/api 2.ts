export type Nullable<T> = T | null;
export type IsoDateString = string;

export interface ApiSuccess {
  message: string;
}

export interface ApiError {
  error: string;
}

export type ApiResult = ApiSuccess | ApiError;

export interface ApiSuccessWithData<T> extends ApiSuccess {
  data: T;
}

export type MutationMethod = "POST" | "PATCH" | "DELETE";

export const isApiError = (value: unknown): value is ApiError => {
  return (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof (value as { error?: unknown }).error === "string"
  );
};

export const isApiSuccess = (value: unknown): value is ApiSuccess => {
  return (
    typeof value === "object" &&
    value !== null &&
    "message" in value &&
    typeof (value as { message?: unknown }).message === "string"
  );
};
