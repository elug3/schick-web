const ACCESS_TOKEN_TTL_SECONDS = 60 * 5;
const ACCESS_TOKEN_REFRESH_SKEW_MS = 15_000;

interface ServiceAccountState {
  refreshToken: string;
  accessToken: string;
  accessTokenExpiresAt: number;
}

interface AuthLoginResponse {
  refresh_token?: string;
}

interface AuthRefreshResponse {
  token?: string;
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
}

declare global {
  var __schickServiceAccount: ServiceAccountState | undefined;
}

function getState(): ServiceAccountState | undefined {
  return globalThis.__schickServiceAccount;
}

function setState(next: ServiceAccountState | undefined): void {
  globalThis.__schickServiceAccount = next;
}

function now(): number {
  return Date.now();
}

function authApiBaseUrl(): string {
  return (
    process.env.SCHICK_AUTH_API_BASE_URL ??
    process.env.SCHICK_API_BASE_URL ??
    "http://localhost:8080"
  );
}

function authUrl(path: string): string {
  return new URL(path, authApiBaseUrl()).toString();
}

function accessTokenExpiresAt(expiresIn?: number): number {
  const seconds =
    typeof expiresIn === "number" && Number.isFinite(expiresIn)
      ? Math.min(expiresIn, ACCESS_TOKEN_TTL_SECONDS)
      : ACCESS_TOKEN_TTL_SECONDS;
  return now() + seconds * 1000;
}

export function serviceAccountConfigured(): boolean {
  const email = process.env.SCHICK_WEB_SERVICE_EMAIL?.trim();
  const password = process.env.SCHICK_WEB_SERVICE_PASSWORD;
  return Boolean(email && password);
}

export function requireServiceAccountConfig(): {
  email: string;
  password: string;
} {
  const email = process.env.SCHICK_WEB_SERVICE_EMAIL?.trim();
  const password = process.env.SCHICK_WEB_SERVICE_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "SCHICK_WEB_SERVICE_EMAIL and SCHICK_WEB_SERVICE_PASSWORD are required"
    );
  }

  return { email, password };
}

async function loginForRefreshToken(
  email: string,
  password: string
): Promise<string> {
  const response = await fetch(authUrl("/api/v1/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Service account login failed (${response.status}): ${message}`
    );
  }

  const body = (await response.json()) as AuthLoginResponse;
  if (typeof body.refresh_token !== "string" || !body.refresh_token) {
    throw new Error("Service account login did not return a refresh token");
  }

  return body.refresh_token;
}

async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}> {
  const response = await fetch(authUrl("/api/v1/auth/refresh"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Service account refresh failed (${response.status}): ${message}`
    );
  }

  const body = (await response.json()) as AuthRefreshResponse;
  const accessToken =
    typeof body.token === "string"
      ? body.token
      : typeof body.access_token === "string"
        ? body.access_token
        : "";

  if (!accessToken) {
    throw new Error("Service account refresh did not return an access token");
  }

  const nextRefreshToken =
    typeof body.refresh_token === "string" && body.refresh_token
      ? body.refresh_token
      : refreshToken;

  return {
    accessToken,
    refreshToken: nextRefreshToken,
    expiresAt: accessTokenExpiresAt(body.expires_in),
  };
}

export async function getServiceAccountAccessToken(): Promise<string> {
  const { email, password } = requireServiceAccountConfig();

  const cached = getState();
  if (
    cached &&
    cached.accessTokenExpiresAt - ACCESS_TOKEN_REFRESH_SKEW_MS > now()
  ) {
    return cached.accessToken;
  }

  if (cached?.refreshToken) {
    try {
      const refreshed = await refreshAccessToken(cached.refreshToken);
      setState({
        refreshToken: refreshed.refreshToken,
        accessToken: refreshed.accessToken,
        accessTokenExpiresAt: refreshed.expiresAt,
      });
      return refreshed.accessToken;
    } catch {
      setState(undefined);
    }
  }

  const refreshToken = await loginForRefreshToken(email, password);
  const refreshed = await refreshAccessToken(refreshToken);
  setState({
    refreshToken: refreshed.refreshToken,
    accessToken: refreshed.accessToken,
    accessTokenExpiresAt: refreshed.expiresAt,
  });

  return refreshed.accessToken;
}
