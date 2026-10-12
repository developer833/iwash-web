import "server-only";

/**
 * Minimal client for the iWash ERP API.
 *
 * SECURITY: the API key is a staff credential. It is read from a
 * server-only environment variable and sent from the server only. Never
 * prefix it with NEXT_PUBLIC_ and never import this file from a Client
 * Component (the "server-only" import makes that a build error).
 *
 * Environment, all read from the .env file (which is git-ignored):
 *   NEXT_PUBLIC_BASE_URL  base URL of the ERP API
 *   IWASH_API_KEY         required for live prices and online booking
 *   IWASH_BRANCH_ID       required for online booking (orders need a branch)
 * Nothing is hardcoded: if a value is missing, the feature that needs it
 * switches off and the site falls back to phone and email.
 */

function baseUrl() {
  return (process.env.NEXT_PUBLIC_BASE_URL ?? "").trim().replace(/\/+$/, "");
}

export function apiConfigured() {
  return Boolean(process.env.IWASH_API_KEY) && Boolean(baseUrl());
}

export function bookingConfigured() {
  return apiConfigured() && Boolean(process.env.IWASH_BRANCH_ID);
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiInit = {
  method?: "GET" | "POST" | "PUT" | "PATCH";
  body?: unknown;
  query?: Record<string, string | undefined>;
};

export async function api<T = unknown>(path: string, init: ApiInit = {}): Promise<T> {
  const key = process.env.IWASH_API_KEY;
  if (!key) throw new ApiError(0, "IWASH_API_KEY is not set");
  if (!baseUrl()) throw new ApiError(0, "NEXT_PUBLIC_BASE_URL is not set");

  const url = new URL(`${baseUrl()}${path}`);
  for (const [k, v] of Object.entries(init.query ?? {})) {
    if (v !== undefined) url.searchParams.set(k, v);
  }

  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      "X-API-Key": key,
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    signal: AbortSignal.timeout(12_000),
  });

  const text = await res.text();
  let json: unknown = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    // Non-JSON body: handled below.
  }

  if (!res.ok) {
    const message =
      json && typeof json === "object" && "message" in json
        ? String((json as { message: unknown }).message)
        : `Request failed with ${res.status}`;
    throw new ApiError(res.status, message);
  }
  if (json === null) throw new ApiError(res.status, "Response was not JSON");
  return json as T;
}

/* ---------- tolerant readers ----------
   The API reference documents endpoints but not response shapes, so these
   helpers accept the common envelopes and field spellings and return
   undefined instead of guessing when a value is not there. */

export type Json = Record<string, unknown>;

export function isObject(v: unknown): v is Json {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Accepts `[...]` or `{ data | items | results | rows | <any single array> : [...] }`. */
export function asList(v: unknown): Json[] {
  if (Array.isArray(v)) return v.filter(isObject);
  if (isObject(v)) {
    for (const k of ["data", "items", "results", "rows", "records"]) {
      if (Array.isArray(v[k])) return (v[k] as unknown[]).filter(isObject);
    }
    const arrays = Object.values(v).filter(Array.isArray);
    if (arrays.length === 1) return (arrays[0] as unknown[]).filter(isObject);
  }
  return [];
}

/** Accepts the object itself or `{ data | <name> : {...} }`. */
export function asRecord(v: unknown, ...names: string[]): Json | undefined {
  if (!isObject(v)) return undefined;
  for (const k of ["data", ...names]) {
    if (isObject(v[k])) return v[k] as Json;
  }
  return v;
}

export function str(o: Json | undefined, ...keys: string[]): string | undefined {
  if (!o) return undefined;
  for (const k of keys) {
    const v = o[k];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (typeof v === "number") return String(v);
  }
  return undefined;
}

export function num(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return undefined;
}
