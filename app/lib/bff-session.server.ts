import { randomUUID } from "node:crypto";

import type { User } from "./auth";

const SESSION_COOKIE_NAME = "schick_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const ACCESS_TOKEN_TTL_SECONDS = 60 * 5;
const ACCESS_TOKEN_REFRESH_SKEW_MS = 15_000;
const TOKEN_AUDIENCE = "web";

type ApiService = "auth" | "products";

interface TokenResponse {
  access_token?: unknown;
  refresh_token?: unknown;
  expires_in?: unknown;
  user?: unknown;
  [key: string]: unknown;
}

interface SessionRecord {
  refreshToken: string;
  accessToken: string;
  accessTokenExpiresAt: number;
  expiresAt: number;
  user?: User;
}

interface AccessTokenResult {
  token: string;
  setCookie?: string;
}

declare global {
  // Keep the cache stable across Vite server reloads during local development.
  // Production deployments should replace this with shared server-side storage.
  var __schickBffSessions: Map<string, SessionRecord> | undefined;
}

const sessions = (globalThis.__schickBffSessions ??= new Map());

function now(): number {
  return Date.now();
}

function sharedApiBaseUrl(): string | undefined {
  return process.env.SCHICK_API_BASE_URL;
}

function authApiBaseUrl(): string {
  return (
    process.env.SCHICK_AUTH_API_BASE_URL ??
    sharedApiBaseUrl() ??
    "http://localhost:8080"
  );
}

function productApiBaseUrl(): string {
  return (
    process.env.SCHICK_PRODUCT_API_BASE_URL ??
    sharedApiBaseUrl() ??
    "http://localhost:8081"
  );
}

function apiBaseUrl(service: ApiService): string {
  return service === "auth" ? authApiBaseUrl() : productApiBaseUrl();
}

function upstreamUrl(service: ApiService, path: string, requestUrl?: string): string {
  const target = new URL(path, apiBaseUrl(service));
  if (requestUrl) {
    target.search = new URL(requestUrl).search;
  }
  return target.toString();
}

function parseCookies(header: string | null): Map<string, string> {
  const cookies = new Map<string, string>();
  if (!header) return cookies;

  for (const part of header.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (!rawName || rawValue.length === 0) continue;
    cookies.set(rawName, decodeURIComponent(rawValue.join("=")));
  }

  return cookies;
}

function sessionCookie(sessionId: string, maxAge = SESSION_TTL_SECONDS): string {
  const parts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(sessionId)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];

  if (process.env.NODE_ENV === "production") {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function clearSessionCookie(): string {
  return sessionCookie("", 0);
}

function sessionIdFromRequest(request: Request): string | null {
  return parseCookies(request.headers.get("Cookie")).get(SESSION_COOKIE_NAME) ?? null;
}

function readSession(request: Request): { id: string; record: SessionRecord } | null {
  const sessionId = sessionIdFromRequest(request);
  if (!sessionId) return null;

  const record = sessions.get(sessionId);
  if (!record) return null;

  if (record.expiresAt <= now()) {
    sessions.delete(sessionId);
    return null;
  }

  return { id: sessionId, record };
}

function isTokenResponse(value: TokenResponse): value is {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: User;
} {
  return (
    typeof value.access_token === "string" &&
    typeof value.refresh_token === "string"
  );
}

function accessTokenExpiresAt(expiresIn?: number): number {
  const seconds =
    typeof expiresIn === "number" && Number.isFinite(expiresIn)
      ? Math.min(expiresIn, ACCESS_TOKEN_TTL_SECONDS)
      : ACCESS_TOKEN_TTL_SECONDS;
  return now() + seconds * 1000;
}

function createSession(tokens: {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: User;
}): { setCookie: string } {
  const sessionId = randomUUID();
  sessions.set(sessionId, {
    refreshToken: tokens.refresh_token,
    accessToken: tokens.access_token,
    accessTokenExpiresAt: accessTokenExpiresAt(tokens.expires_in),
    expiresAt: now() + SESSION_TTL_SECONDS * 1000,
    user: tokens.user,
  });

  return { setCookie: sessionCookie(sessionId) };
}

function touchSession(sessionId: string, record: SessionRecord): string {
  record.expiresAt = now() + SESSION_TTL_SECONDS * 1000;
  sessions.set(sessionId, record);
  return sessionCookie(sessionId);
}

function forgetSession(request: Request): void {
  const sessionId = sessionIdFromRequest(request);
  if (sessionId) sessions.delete(sessionId);
}

async function parseJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const body = await request.json();
    return body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}

function tokenRequestBody(body: Record<string, unknown>): string {
  // The current Go backend ignores these extra fields, but keeping them in the
  // BFF request preserves the intended contract when audience/TTL support lands.
  return JSON.stringify({
    ...body,
    audience: TOKEN_AUDIENCE,
    access_token_ttl_seconds: ACCESS_TOKEN_TTL_SECONDS,
  });
}

async function requestTokens(
  path: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(upstreamUrl("auth", path), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: tokenRequestBody(body),
  });
}

function json(
  data: unknown,
  init: ResponseInit = {},
  setCookie?: string
): Response {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", "no-store");
  if (setCookie) headers.append("Set-Cookie", setCookie);
  return new Response(JSON.stringify(data), { ...init, headers });
}

async function sanitizedAuthResponse(
  upstream: Response,
  setCookie?: string
): Promise<Response> {
  const contentType = upstream.headers.get("Content-Type") ?? "";
  let payload: unknown = { ok: upstream.ok };

  if (contentType.includes("application/json")) {
    try {
      const body = (await upstream.json()) as TokenResponse;
      const { access_token, refresh_token, ...safeBody } = body;
      void access_token;
      void refresh_token;
      payload = Object.keys(safeBody).length ? safeBody : { ok: upstream.ok };
    } catch {
      payload = { ok: upstream.ok };
    }
  } else if (!upstream.ok) {
    payload = { error: await upstream.text() };
  }

  return json(payload, { status: upstream.status }, setCookie);
}

async function proxyResponse(
  upstream: Response,
  options: { noStore?: boolean; setCookie?: string } = {}
): Promise<Response> {
  const headers = new Headers();
  const contentType = upstream.headers.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);
  if (options.noStore) headers.set("Cache-Control", "no-store");
  if (options.setCookie) headers.append("Set-Cookie", options.setCookie);

  return new Response(await upstream.arrayBuffer(), {
    status: upstream.status,
    statusText: upstream.statusText,
    headers,
  });
}

export async function handleLogin(request: Request): Promise<Response> {
  const body = await parseJsonBody(request);
  const upstream = await requestTokens("/api/v1/auth/login", body);

  if (!upstream.ok) {
    return sanitizedAuthResponse(upstream);
  }

  const tokens = (await upstream.json()) as TokenResponse;
  if (!isTokenResponse(tokens)) {
    return json({ error: "Auth server did not return a token pair" }, { status: 502 });
  }

  const { setCookie } = createSession(tokens);
  return json({ ok: true, user: tokens.user ?? null }, { status: 200 }, setCookie);
}

export async function handleRegister(request: Request): Promise<Response> {
  const body = await parseJsonBody(request);
  const upstream = await requestTokens("/api/v1/auth/register", body);

  if (!upstream.ok) {
    return sanitizedAuthResponse(upstream);
  }

  const tokens = (await upstream.json()) as TokenResponse;
  if (isTokenResponse(tokens)) {
    const { setCookie } = createSession(tokens);
    return json({ ok: true, user: tokens.user ?? null }, { status: 200 }, setCookie);
  }

  const { access_token, refresh_token, ...safeBody } = tokens;
  void access_token;
  void refresh_token;
  return json(
    Object.keys(safeBody).length ? safeBody : { ok: true },
    { status: upstream.status }
  );
}

export async function getAccessToken(request: Request): Promise<AccessTokenResult | Response> {
  const session = readSession(request);
  if (!session) {
    return json(
      { error: "Not authenticated" },
      { status: 401 },
      clearSessionCookie()
    );
  }

  const shouldRefresh =
    session.record.accessTokenExpiresAt - ACCESS_TOKEN_REFRESH_SKEW_MS <= now();

  if (!shouldRefresh) {
    return { token: session.record.accessToken };
  }

  const upstream = await requestTokens("/api/v1/auth/refresh", {
    refresh_token: session.record.refreshToken,
  });

  if (!upstream.ok) {
    sessions.delete(session.id);
    return json(
      { error: "Session expired. Please sign in again." },
      { status: 401 },
      clearSessionCookie()
    );
  }

  const tokens = (await upstream.json()) as TokenResponse;
  if (!isTokenResponse(tokens)) {
    sessions.delete(session.id);
    return json(
      { error: "Auth server did not refresh the token pair" },
      { status: 502 },
      clearSessionCookie()
    );
  }

  session.record.accessToken = tokens.access_token;
  session.record.refreshToken = tokens.refresh_token;
  session.record.accessTokenExpiresAt = accessTokenExpiresAt(tokens.expires_in);
  if (tokens.user) session.record.user = tokens.user;

  return {
    token: session.record.accessToken,
    setCookie: touchSession(session.id, session.record),
  };
}

export async function handleRefresh(request: Request): Promise<Response> {
  const result = await getAccessToken(request);
  if (result instanceof Response) return result;
  return json({ ok: true }, { status: 200 }, result.setCookie);
}

export async function handleMe(request: Request): Promise<Response> {
  const result = await getAccessToken(request);
  if (result instanceof Response) return result;

  const upstream = await fetch(upstreamUrl("auth", "/api/v1/auth/me"), {
    headers: {
      Authorization: `Bearer ${result.token}`,
    },
  });

  if (upstream.status === 401) {
    forgetSession(request);
    return json(
      { error: "Not authenticated" },
      { status: 401 },
      clearSessionCookie()
    );
  }

  return proxyResponse(upstream, { noStore: true, setCookie: result.setCookie });
}

export async function handleLogout(request: Request): Promise<Response> {
  const session = readSession(request);

  if (session) {
    await fetch(upstreamUrl("auth", "/api/v1/auth/logout"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refresh_token: session.record.refreshToken,
        audience: TOKEN_AUDIENCE,
      }),
    }).catch(() => {});
    sessions.delete(session.id);
  }

  return json({ ok: true }, { status: 200 }, clearSessionCookie());
}

export async function proxyProductApi(
  request: Request,
  path: string,
  options: { requireAuth?: boolean; noStore?: boolean } = {}
): Promise<Response> {
  const headers = new Headers();
  headers.set("Accept", request.headers.get("Accept") ?? "application/json");

  let setCookie: string | undefined;
  if (options.requireAuth) {
    const result = await getAccessToken(request);
    if (result instanceof Response) return result;
    headers.set("Authorization", `Bearer ${result.token}`);
    setCookie = result.setCookie;
  }

  const contentType = request.headers.get("Content-Type");
  if (contentType) headers.set("Content-Type", contentType);

  const hasBody = request.method !== "GET" && request.method !== "HEAD";
  const upstream = await fetch(upstreamUrl("products", path, request.url), {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  });

  return proxyResponse(upstream, {
    noStore: options.noStore ?? options.requireAuth,
    setCookie,
  });
}
