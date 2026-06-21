import { REFERENCE_BAGS } from "./reference-bags";

export type MockProductStatus = "new" | "featured" | "standard";

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  color: string;
  material: string;
  capacity: string;
  stock: number;
  category: "bags";
  productType: string;
  style: string;
  family: string;
  status: MockProductStatus;
  image?: string;
  createdAt: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [...(REFERENCE_BAGS as MockProduct[])];

export function getMockProduct(id: string): MockProduct | undefined {
  return MOCK_PRODUCTS.find((product) => product.id === id);
}

export function getMockCategories(): string[] {
  return ["bags"];
}

export function getMockFilters(category: string): string[] {
  if (!getMockCategories().includes(category.toLowerCase())) return [];

  return ["brand", "color", "material", "productType", "style", "family"];
}

export function searchMockProducts(params: URLSearchParams): MockProduct[] {
  const category = params.get("category")?.toLowerCase();
  const query = params.get("query")?.trim().toLowerCase();

  return MOCK_PRODUCTS.filter((product) => {
    if (category && product.category !== category) return false;

    for (const [key, value] of params.entries()) {
      const normalizedValue = value.trim().toLowerCase();
      if (!normalizedValue || key === "category" || key === "query") continue;

      // Structured facet filters require an exact (case-insensitive) match so
      // that values like "Men" do not partially match "Women".
      const productValue = getSearchableValue(product, key);
      if (productValue.toLowerCase() !== normalizedValue) return false;
    }

    if (!query) return true;

    return [
      product.name,
      product.brand,
      product.description,
      product.color,
      product.material,
      product.productType,
      product.style,
      product.family,
    ].some((value) => value.toLowerCase().includes(query));
  });
}

export function toBagResponse(product: MockProduct) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    brand: product.brand,
    color: product.color,
    material: product.material,
    capacity: product.capacity,
    stock: product.stock,
    image: product.image,
  };
}

export function toProductResponse(product: MockProduct) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    brand: product.brand,
    color: product.color,
    material: product.material,
    stock: product.stock,
    category: product.category,
    status: product.status,
    image: product.image,
    createdAt: product.createdAt,
  };
}

export function toSearchResult(product: MockProduct) {
  return {
    ID: product.id,
    Name: product.name,
    Description: product.description,
    Price: product.price,
    Brand: product.brand,
    Color: product.color,
    Material: product.material,
    Capacity: product.capacity,
    Stock: product.stock,
    Category: product.category,
    Type: product.productType,
    Style: product.style,
    Gender: product.family,
    Status: product.status,
    Image: product.image,
  };
}

function getSearchableValue(product: MockProduct, key: string): string {
  switch (key.toLowerCase()) {
    case "brand":
      return product.brand;
    case "color":
      return product.color;
    case "material":
      return product.material;
    case "producttype":
    case "product-type":
    case "type":
      return product.productType;
    case "style":
      return product.style;
    case "family":
    case "gender":
      return product.family;
    default:
      return "";
  }
}
