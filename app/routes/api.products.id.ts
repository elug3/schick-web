import type { LoaderFunctionArgs } from "react-router";

import { proxyProductApi } from "../lib/bff-session.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  return proxyProductApi(
    request,
    `/api/products/${encodeURIComponent(params.id ?? "")}`,
    { requireAuth: true }
  );
}
