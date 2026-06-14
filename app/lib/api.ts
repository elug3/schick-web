import { authedFetch } from "./auth";

export interface DisplayProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  stock?: number;
  details: Record<string, string | number>;
}

export const CATEGORY_IMAGES: Record<string, string> = {
  consultations:
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
  shoes: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
  outerwear: "https://images.unsplash.com/photo-1539533057592-4516c98775cb?w=400",
  bottoms: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400",
  bags: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
  clocks: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400",
};

export function getCategoryImage(category: string): string {
  return (
    CATEGORY_IMAGES[category.toLowerCase()] ??
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400"
  );
}

function normalizeProduct(
  raw: Record<string, unknown>,
  category: string
): DisplayProduct {
  if ("Title" in raw) {
    const details: Record<string, string | number> = {};
    if (raw.Status != null) details["Status"] = String(raw.Status);
    if (raw.Duration != null) details["Duration"] = `${raw.Duration} min`;
    return {
      id: String(raw.ID),
      name: String(raw.Title),
      price: Number(raw.Price),
      description: String(raw.Description),
      category: category.toLowerCase(),
      details,
    };
  }
  const details: Record<string, string | number> = {};
  for (const k of [
    "Brand",
    "Color",
    "Material",
    "Size",
    "Gender",
    "Capacity",
    "Type",
  ]) {
    if (raw[k] != null) details[k] = raw[k] as string | number;
  }
  return {
    id: String(raw.ID),
    name: String(raw.Name),
    price: Number(raw.Price),
    description: String(raw.Description),
    category: String(raw.Category ?? category).toLowerCase(),
    stock: raw.Stock != null ? Number(raw.Stock) : undefined,
    details,
  };
}

export async function getCategories(): Promise<string[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const { categories } = (await res.json()) as { categories: string[] };
  return categories;
}

export async function getFilters(category: string): Promise<string[]> {
  const res = await fetch(
    `/api/filters?category=${encodeURIComponent(category)}`
  );
  if (!res.ok) return [];
  const { filters } = (await res.json()) as { filters: string[] };
  return filters;
}

export async function searchProducts(
  category: string,
  params: Record<string, string> = {}
): Promise<{ total: number; results: DisplayProduct[] }> {
  const qs = new URLSearchParams({ category });
  for (const [k, v] of Object.entries(params)) {
    if (v.trim()) qs.set(k, v.trim());
  }
  const res = await fetch(`/api/products/search?${qs}`);
  if (!res.ok) throw new Error("Search failed");
  const { total, results } = (await res.json()) as {
    total: number;
    results: Record<string, unknown>[];
  };
  return {
    total,
    results: results.map((r) => normalizeProduct(r, category)),
  };
}

export async function getUploadUrl(
  filename: string,
  contentType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const res = await authedFetch("/api/products/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename, contentType }),
  });
  if (!res.ok) throw new Error("Failed to get upload URL");
  return res.json() as Promise<{ uploadUrl: string; publicUrl: string }>;
}

export async function uploadToS3(uploadUrl: string, file: File): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type },
    body: file,
  });
  if (!res.ok) throw new Error("Image upload to S3 failed");
}

export async function createProduct(
  category: string,
  data: Record<string, unknown>,
  imageUrl?: string
): Promise<void> {
  const res = await authedFetch("/api/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ category, imageUrl, ...data }),
  });
  if (!res.ok) {
    let msg = "Failed to create product";
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) msg = body.error;
    } catch {}
    throw new Error(msg);
  }
}

export async function searchAcrossAll(
  query: string
): Promise<DisplayProduct[]> {
  const cats = [
    "consultations",
    "shoes",
    "outerwear",
    "bottoms",
    "bags",
    "clocks",
  ];
  const settled = await Promise.allSettled(
    cats.map((cat) => {
      const p: Record<string, string> = {};
      if (query) {
        p[cat === "consultations" ? "title" : "brand"] = query;
      }
      return searchProducts(cat, p);
    })
  );
  return settled
    .filter(
      (
        r
      ): r is PromiseFulfilledResult<{
        total: number;
        results: DisplayProduct[];
      }> => r.status === "fulfilled"
    )
    .flatMap((r) => r.value.results);
}
