import type { LoaderFunctionArgs } from "react-router";

import { getMockFilters } from "~/data/mock-products";

export async function loader({ request }: LoaderFunctionArgs) {
  const category = new URL(request.url).searchParams.get("category") ?? "";

  return Response.json({ filters: getMockFilters(category) });
}
