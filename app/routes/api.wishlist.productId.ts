import type { ActionFunctionArgs } from "react-router";

import {
  removeWishlistProduct,
  requireWishlistUserId,
  wishlistPayload,
} from "~/lib/wishlist.server";

export async function action({ request, params }: ActionFunctionArgs) {
  if (request.method !== "DELETE") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const productId = params.productId?.trim();
  if (!productId) {
    return Response.json({ error: "productId is required" }, { status: 400 });
  }

  const userId = await requireWishlistUserId(request);
  if (userId instanceof Response) return userId;

  removeWishlistProduct(userId, productId);
  const payload = await wishlistPayload(userId);
  return Response.json(payload, {
    headers: { "Cache-Control": "no-store" },
  });
}
