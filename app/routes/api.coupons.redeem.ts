import type { ActionFunctionArgs } from "react-router";

import { proxyProductApi } from "../lib/bff-session.server";

export async function action({ request }: ActionFunctionArgs) {
  return proxyProductApi(request, "/api/coupons/redeem", {
    requireAuth: true,
  });
}
