import api from "../../services/api";
import { isApiError } from "../Interfaces/Admin/api";

export interface AdminRequestOptions<TBody = unknown> {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: TBody;
  signal?: AbortSignal;
}

export class AdminApiError extends Error {
  public readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
  }
}

export const buildAdminUrl = (path: string): string => {
  if (path.startsWith("/admin")) {
    return path;
  }

  return `/admin/${path.replace(/^\/+/, "")}`;
};

export async function adminRequest<TResponse, TBody = unknown>(
  path: string,
  options: AdminRequestOptions<TBody> = {},
): Promise<TResponse> {
  const { method = "GET", body, signal } = options;

  try {
    const response = await api.request<TResponse>({
      url: buildAdminUrl(path),
      method,
      data: body,
      signal,
    });

    return response.data;
  } catch (error: any) {
    const status = error.response?.status ?? 500;
    const payload = error.response?.data;

    const message = isApiError(payload)
      ? payload.error
      : `Admin request failed with status ${status}`;

    throw new AdminApiError(message, status);
  }
}

export const adminGet = <TResponse>(path: string, signal?: AbortSignal) =>
  adminRequest<TResponse>(path, { method: "GET", signal });

export const adminPost = <TResponse, TBody>(
  path: string,
  body: TBody,
  signal?: AbortSignal,
) => adminRequest<TResponse, TBody>(path, { method: "POST", body, signal });

export const adminPatch = <TResponse, TBody>(
  path: string,
  body: TBody,
  signal?: AbortSignal,
) => adminRequest<TResponse, TBody>(path, { method: "PATCH", body, signal });

export const adminDelete = <TResponse, TBody>(
  path: string,
  body: TBody,
  signal?: AbortSignal,
) => adminRequest<TResponse, TBody>(path, { method: "DELETE", body, signal });
