import type { LoaderFunctionArgs } from "react-router";

import { searchMockProducts, toSearchResult } from "~/data/mock-products";

export async function loader({ request }: LoaderFunctionArgs) {
  const products = searchMockProducts(new URL(request.url).searchParams).map(
    toSearchResult
  );

  return Response.json({ total: products.length, results: products });
}
