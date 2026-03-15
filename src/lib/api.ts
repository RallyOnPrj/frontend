"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ProblemDetail {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
}

export class ApiError extends Error {
  status: number;
  problem?: ProblemDetail;

  constructor(message: string, status: number, problem?: ProblemDetail) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.problem = problem;
  }
}

type ParseMode = "json" | "text" | "void";

interface ApiRequestOptions extends Omit<RequestInit, "body"> {
  auth?: boolean;
  body?: BodyInit | object | null;
  parseAs?: ParseMode;
  retryOnUnauthorized?: boolean;
}

function isJsonLikeResponse(contentType: string | null) {
  return (
    contentType?.includes("application/json") ||
    contentType?.includes("application/problem+json") ||
    contentType?.includes("+json")
  );
}

function normalizeBody(body: ApiRequestOptions["body"]) {
  if (body == null) {
    return undefined;
  }

  if (
    typeof body === "string" ||
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    body instanceof ArrayBuffer
  ) {
    return body as BodyInit;
  }

  return JSON.stringify(body);
}

async function parseProblemDetail(response: Response) {
  if (!isJsonLikeResponse(response.headers.get("content-type"))) {
    return undefined;
  }

  try {
    return (await response.json()) as ProblemDetail;
  } catch {
    return undefined;
  }
}

async function toApiError(response: Response, fallback: string) {
  const problem = await parseProblemDetail(response);
  const message =
    problem?.detail || problem?.title || fallback || `요청에 실패했습니다. (${response.status})`;

  return new ApiError(message, response.status, problem);
}

async function refreshSession() {
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    return response.status === 204;
  } catch {
    return false;
  }
}

async function executeRequest(path: string, options: ApiRequestOptions) {
  const body = normalizeBody(options.body);
  const headers = new Headers(options.headers);

  if (body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (!headers.has("Accept")) {
    headers.set("Accept", "application/json");
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    body,
    headers,
    credentials: "include",
  });
}

export async function apiRequest<T = void>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const {
    auth = false,
    parseAs = "json",
    retryOnUnauthorized = auth,
  } = options;

  let response = await executeRequest(path, options);

  if (
    auth &&
    retryOnUnauthorized &&
    response.status === 401 &&
    path !== "/auth/refresh"
  ) {
    const refreshed = await refreshSession();
    if (refreshed) {
      response = await executeRequest(path, {
        ...options,
        retryOnUnauthorized: false,
      });
    }
  }

  if (!response.ok) {
    throw await toApiError(response, `요청에 실패했습니다. (${response.status})`);
  }

  if (parseAs === "void" || response.status === 204) {
    return undefined as T;
  }

  if (parseAs === "text") {
    return (await response.text()) as T;
  }

  if (!isJsonLikeResponse(response.headers.get("content-type"))) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export { API_URL };
