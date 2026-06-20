import type { LoaderFunctionArgs } from "react-router";

import { getMockProduct, toProductResponse } from "~/data/mock-products";

export async function loader({ params }: LoaderFunctionArgs) {
  const product = getMockProduct(params.id ?? "");

  if (!product) {
    return Response.json({ error: "Product not found" }, { status: 404 });
  }

  return Response.json(toProductResponse(product));
}
