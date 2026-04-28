import { isApiError } from "../Interfaces/Admin/api";

const DEFAULT_HEADERS: HeadersInit = {
  "Content-Type": "application/json",
};

export const ADMIN_API_BASE = "http://localhost:8080/admin";

export interface AdminRequestOptions<TBody = unknown> {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: TBody;
  headers?: HeadersInit;
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
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  if (path.startsWith("/admin")) {
    return path;
  }

  return `${ADMIN_API_BASE}/${path.replace(/^\/+/, "")}`;
};

export async function adminRequest<TResponse, TBody = unknown>(
  path: string,
  options: AdminRequestOptions<TBody> = {},
): Promise<TResponse> {
  const { method = "GET", body, headers, signal } = options;

  const response = await fetch(buildAdminUrl(path), {
    method,
    credentials: "include",
    headers: body === undefined ? headers : { ...DEFAULT_HEADERS, ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload: unknown = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = isApiError(payload)
      ? payload.error
      : `Admin request failed with status ${response.status}`;

    throw new AdminApiError(message, response.status);
  }

  if (isApiError(payload)) {
    throw new AdminApiError(payload.error, response.status);
  }

  return payload as TResponse;
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
