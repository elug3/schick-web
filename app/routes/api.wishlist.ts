import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";

import {
  addWishlistProduct,
  requireWishlistUserId,
  wishlistPayload,
} from "~/lib/wishlist.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await requireWishlistUserId(request);
  if (userId instanceof Response) return userId;

  const payload = await wishlistPayload(userId);
  return Response.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const userId = await requireWishlistUserId(request);
  if (userId instanceof Response) return userId;

  let body: { productId?: string };
  try {
    body = (await request.json()) as { productId?: string };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const productId = body.productId?.trim();
  if (!productId) {
    return Response.json({ error: "productId is required" }, { status: 400 });
  }

  addWishlistProduct(userId, productId);
  const payload = await wishlistPayload(userId);
  return Response.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
