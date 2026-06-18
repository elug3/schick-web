import type { LoaderFunctionArgs } from "react-router";

import { proxyProductApi } from "../lib/bff-session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  return proxyProductApi(request, "/api/products/bags");
}
