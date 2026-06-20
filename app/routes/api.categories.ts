import { getMockCategories } from "~/data/mock-products";

export async function loader() {
  return Response.json({ categories: getMockCategories() });
}
