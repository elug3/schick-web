import type { LoaderFunctionArgs } from "react-router";

import { MOCK_PRODUCTS, toBagResponse } from "~/data/mock-products";

export async function loader({ request }: LoaderFunctionArgs) {
  const params = new URL(request.url).searchParams;
  const products = MOCK_PRODUCTS.filter((product) => product.category === "bags").filter((product) => {
    for (const [key, value] of params.entries()) {
      const normalizedValue = value.trim().toLowerCase();
      if (!normalizedValue) continue;

      const productValue = product[key as keyof typeof product];
      if (
        productValue == null ||
        !String(productValue).toLowerCase().includes(normalizedValue)
      ) {
        return false;
      }
    }

    return true;
  }).map(toBagResponse);

  return Response.json({ total: products.length, results: products });
}
