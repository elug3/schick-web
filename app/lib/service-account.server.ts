export function serviceAccountConfigured(): boolean {
  return Boolean(process.env.DUPLI1_WEB_SERVICE_TOKEN?.trim());
}

export function requireServiceAccountToken(): string {
  const token = process.env.DUPLI1_WEB_SERVICE_TOKEN?.trim();
  if (!token) {
    throw new Error("DUPLI1_WEB_SERVICE_TOKEN is required");
  }
  return token;
}

export async function getServiceAccountAccessToken(): Promise<string> {
  return requireServiceAccountToken();
}
