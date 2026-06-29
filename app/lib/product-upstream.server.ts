/**
 * Server-side client for the Schick product service (elug3/schick).
 *
 * Public reads use GET /api/products/bags. Authenticated catalog reads use
 * GET /api/products and GET /api/products/:id when SCHICK_PRODUCT_API_BEARER_TOKEN
 * is configured (HMAC JWT signed with the product service JWT_SECRET).
 */

export interface UpstreamProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  color: string;
  material: string;
  stock: number;
  category: string;
  status?: string;
  imageUrls?: string[];
  tags?: string[];
  createdAt?: string;
  capacity?: string;
}

export interface BagResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  color: string;
  material: string;
  capacity: string;
  stock: number;
  image?: string;
}

export interface ProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  brand: string;
  color: string;
  material: string;
  stock: number;
  category: string;
  status: string;
  image?: string;
  images?: string[];
  createdAt: string;
}

export interface SearchResult {
  ID: string;
  Name: string;
  Description: string;
  Price: number;
  Brand: string;
  Color: string;
  Material: string;
  Capacity: string;
  Stock: number;
  Category: string;
  Type: string;
  Style: string;
  Gender: string;
  Status: string;
  Image?: string;
}

const BAG_FILTERS = ["brand", "color", "material"] as const;
const SUPPORTED_CATEGORIES = ["bags"] as const;

export function productApiBaseUrl(): string {
  return (
    process.env.SCHICK_PRODUCT_API_BASE_URL ??
    process.env.SCHICK_API_BASE_URL ??
    "http://localhost:8081"
  );
}

function upstreamUrl(path: string, searchParams?: URLSearchParams): string {
  const url = new URL(path, productApiBaseUrl());
  if (searchParams) url.search = searchParams.toString();
  return url.toString();
}

function serviceBearerToken(): string | undefined {
  const token = process.env.SCHICK_PRODUCT_API_BEARER_TOKEN?.trim();
  return token || undefined;
}

function firstImage(imageUrls?: string[]): string | undefined {
  return imageUrls?.find((url) => url.trim().length > 0);
}

function mapDisplayStatus(status?: string, tags?: string[]): string {
  if (tags?.includes("new")) return "new";
  if (tags?.includes("hot") || tags?.includes("top")) return "featured";
  if (status === "active" || !status) return "standard";
  return status;
}

export function toBagResponse(product: UpstreamProduct): BagResponse {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    brand: product.brand,
    color: product.color,
    material: product.material,
    capacity: product.capacity ?? "",
    stock: product.stock,
    image: firstImage(product.imageUrls),
  };
}

export function toProductResponse(product: UpstreamProduct): ProductResponse {
  const images = (product.imageUrls ?? []).filter((url) => url.trim().length > 0);

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    brand: product.brand,
    color: product.color,
    material: product.material,
    stock: product.stock,
    category: product.category || "bags",
    status: mapDisplayStatus(product.status, product.tags),
    image: images[0],
    images: images.length > 0 ? images : undefined,
    createdAt: product.createdAt ?? new Date(0).toISOString(),
  };
}

export function toSearchResult(product: UpstreamProduct): SearchResult {
  return {
    ID: product.id,
    Name: product.name,
    Description: product.description,
    Price: product.price,
    Brand: product.brand,
    Color: product.color,
    Material: product.material,
    Capacity: product.capacity ?? "",
    Stock: product.stock,
    Category: product.category || "bags",
    Type: "",
    Style: "",
    Gender: "",
    Status: mapDisplayStatus(product.status, product.tags),
    Image: firstImage(product.imageUrls),
  };
}

export function supportedCategories(): string[] {
  return [...SUPPORTED_CATEGORIES];
}

export function supportedFilters(category: string): string[] {
  if (!SUPPORTED_CATEGORIES.includes(category.toLowerCase() as (typeof SUPPORTED_CATEGORIES)[number])) {
    return [];
  }
  return [...BAG_FILTERS];
}

function dedupeProducts(products: UpstreamProduct[]): UpstreamProduct[] {
  const seen = new Set<string>();
  const merged: UpstreamProduct[] = [];

  for (const product of products) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    merged.push(product);
  }

  return merged;
}

export async function fetchUpstreamBags(
  filters: Record<string, string> = {}
): Promise<UpstreamProduct[]> {
  const params = new URLSearchParams();
  for (const key of BAG_FILTERS) {
    const value = filters[key]?.trim();
    if (value) params.set(key, value);
  }

  const response = await fetch(upstreamUrl("/api/products/bags", params), {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Upstream bag search failed: ${response.status}`);
  }

  const body = (await response.json()) as {
    total?: number;
    results?: UpstreamProduct[] | null;
  };

  return body.results ?? [];
}

export async function fetchUpstreamCatalog(): Promise<UpstreamProduct[]> {
  const token = serviceBearerToken();
  if (!token) return [];

  const response = await fetch(upstreamUrl("/api/products"), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Upstream product list failed: ${response.status}`);
  }

  const body = (await response.json()) as UpstreamProduct[] | { results?: UpstreamProduct[] };
  if (Array.isArray(body)) return body;
  return body.results ?? [];
}

export async function fetchUpstreamProductById(
  id: string
): Promise<UpstreamProduct | null> {
  const bags = await fetchUpstreamBags().catch(() => []);
  const fromBags = bags.find((product) => product.id === id);
  if (fromBags) return fromBags;

  const token = serviceBearerToken();
  if (!token) return null;

  const response = await fetch(upstreamUrl(`/api/products/${encodeURIComponent(id)}`), {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Upstream product fetch failed: ${response.status}`);
  }

  return (await response.json()) as UpstreamProduct;
}

export async function fetchMergedBagCatalog(
  filters: Record<string, string> = {}
): Promise<UpstreamProduct[]> {
  const [bags, catalog] = await Promise.all([
    fetchUpstreamBags(filters).catch(() => []),
    fetchUpstreamCatalog().catch(() => []),
  ]);

  const bagCatalog = catalog.filter(
    (product) => (product.category || "bags").toLowerCase() === "bags"
  );

  return dedupeProducts([...bags, ...bagCatalog]);
}

function getSearchableValue(product: UpstreamProduct, key: string): string {
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
      return "";
    case "style":
      return "";
    case "family":
    case "gender":
      return "";
    default:
      return "";
  }
}

export async function searchUpstreamProducts(
  params: URLSearchParams
): Promise<UpstreamProduct[]> {
  const category = params.get("category")?.toLowerCase();
  if (category && category !== "bags") return [];

  const query = params.get("query")?.trim().toLowerCase();
  const upstreamFilters: Record<string, string> = {};
  const localFilters: Array<[string, string]> = [];

  for (const [key, value] of params.entries()) {
    const normalizedValue = value.trim();
    if (!normalizedValue || key === "category" || key === "query") continue;

    if ((BAG_FILTERS as readonly string[]).includes(key)) {
      upstreamFilters[key] = normalizedValue;
      continue;
    }

    localFilters.push([key, normalizedValue]);
  }

  try {
    const products = await fetchMergedBagCatalog(upstreamFilters);

    return products.filter((product) => {
      for (const [key, normalizedValue] of localFilters) {
        if (normalizedValue.toLowerCase() === "__no_match__") return false;

        const productValue = getSearchableValue(product, key);
        if (productValue.toLowerCase() !== normalizedValue.toLowerCase()) {
          return false;
        }
      }

      if (!query) return true;

      return [
        product.name,
        product.brand,
        product.description,
        product.color,
        product.material,
      ].some((value) => value.toLowerCase().includes(query));
    });
  } catch {
    return [];
  }
}
