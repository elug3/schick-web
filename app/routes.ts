import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("product/:id", "routes/product.tsx"),
  route("history", "routes/history.tsx"),
  route("profile", "routes/profile.tsx"),
  route("login", "routes/login.tsx"),
  route("products/new", "routes/product-new.tsx"),
] satisfies RouteConfig;
