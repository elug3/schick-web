import { getAccessToken } from "./bff-session.server";
import {
  fetchUpstreamBags,
  fetchUpstreamProductById,
  toBagResponse,
  type BagResponse,
} from "./product-upstream.server";

declare global {
  var __schickWishlists: Map<string, string[]> | undefined;
}

const wishlists = (globalThis.__schickWishlists ??= new Map());

interface MeResponse {
  user_id?: string;
  id?: string;
}

export async function requireWishlistUserId(
  request: Request
): Promise<string | Response> {
  const tokenResult = await getAccessToken(request);
  if (tokenResult instanceof Response) return tokenResult;

  const authBase =
    process.env.SCHICK_AUTH_API_BASE_URL ??
    process.env.SCHICK_API_BASE_URL ??
    "http://localhost:8080";

  const upstream = await fetch(new URL("/api/v1/auth/me", authBase), {
    headers: { Authorization: `Bearer ${tokenResult.token}` },
  });

  if (upstream.status === 401) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!upstream.ok) {
    return Response.json({ error: "Failed to resolve user" }, { status: 502 });
  }

  const body = (await upstream.json()) as MeResponse;
  const userId = body.user_id ?? body.id;
  if (!userId) {
    return Response.json({ error: "User id missing from auth response" }, { status: 502 });
  }

  return userId;
}

export function getWishlistProductIds(userId: string): string[] {
  return [...(wishlists.get(userId) ?? [])];
}

export function addWishlistProduct(userId: string, productId: string): string[] {
  const ids = getWishlistProductIds(userId);
  if (!ids.includes(productId)) {
    ids.unshift(productId);
    wishlists.set(userId, ids);
  }
  return ids;
}

export function removeWishlistProduct(userId: string, productId: string): string[] {
  const ids = getWishlistProductIds(userId).filter((id) => id !== productId);
  wishlists.set(userId, ids);
  return ids;
}

export function isProductWishlisted(userId: string, productId: string): boolean {
  return getWishlistProductIds(userId).includes(productId);
}

export async function resolveWishlistBags(productIds: string[]): Promise<BagResponse[]> {
  if (productIds.length === 0) return [];

  let catalog: Awaited<ReturnType<typeof fetchUpstreamBags>> = [];
  try {
    catalog = await fetchUpstreamBags();
  } catch {
    catalog = [];
  }

  const byId = new Map(catalog.map((product) => [product.id, product]));
  const items: BagResponse[] = [];

  for (const id of productIds) {
    const fromCatalog = byId.get(id);
    if (fromCatalog) {
      items.push(toBagResponse(fromCatalog));
      continue;
    }

    try {
      const product = await fetchUpstreamProductById(id);
      if (product) items.push(toBagResponse(product));
    } catch {
      // Skip unavailable products.
    }
  }

  return items;
}

export async function wishlistPayload(userId: string) {
  const productIds = getWishlistProductIds(userId);
  const items = await resolveWishlistBags(productIds);
  return { productIds, items };
}
