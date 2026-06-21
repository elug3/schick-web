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
  category: "bags" | "sneakers" | "watches" | "outerwear";
  productType: string;
  style: string;
  family: string;
  status: MockProductStatus;
  image?: string;
  createdAt: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  ...(REFERENCE_BAGS as MockProduct[]),
  {
    id: "sneaker-lv-trainer-cream",
    name: "Monogram Court Trainer",
    description:
      "A low-profile leather trainer with layered panels, cushioned lining, and an elevated everyday silhouette.",
    price: 249,
    brand: "Louis Vuitton",
    color: "Cream",
    material: "Calfskin Leather",
    capacity: "N/A",
    stock: 9,
    category: "sneakers",
    productType: "Sneakers",
    style: "Casual",
    family: "Unisex",
    status: "featured",
    createdAt: "2026-05-28T10:00:00.000Z",
  },
  {
    id: "sneaker-golden-star-white",
    name: "Vintage Star Leather Sneaker",
    description:
      "A distressed leather sneaker with suede accents, contrast heel detail, and a softly worn-in finish.",
    price: 199,
    brand: "Golden Goose",
    color: "White",
    material: "Leather and Suede",
    capacity: "N/A",
    stock: 14,
    category: "sneakers",
    productType: "Sneakers",
    style: "Weekend",
    family: "Women",
    status: "standard",
    createdAt: "2026-05-30T10:00:00.000Z",
  },
  {
    id: "sneaker-miu-runner-silver",
    name: "Technical Mesh Runner",
    description:
      "A lightweight mixed-material runner with suede overlays, metallic accents, and a sculpted sole.",
    price: 219,
    brand: "Miu Miu",
    color: "Silver",
    material: "Mesh and Suede",
    capacity: "N/A",
    stock: 6,
    category: "sneakers",
    productType: "Sneakers",
    style: "Statement",
    family: "Women",
    status: "new",
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "watch-cartier-tank-ivory",
    name: "Rectangular Dress Watch",
    description:
      "A refined dress watch with a slim rectangular case, roman markers, and a polished leather strap.",
    price: 390,
    brand: "Cartier",
    color: "Ivory",
    material: "Stainless Steel",
    capacity: "N/A",
    stock: 5,
    category: "watches",
    productType: "Dress Watches",
    style: "Business",
    family: "Unisex",
    status: "featured",
    createdAt: "2026-06-03T10:00:00.000Z",
  },
  {
    id: "watch-rolex-diver-black",
    name: "Automatic Diver Watch",
    description:
      "A robust automatic watch with a rotating bezel, luminous markers, and a bracelet-style profile.",
    price: 610,
    brand: "Rolex",
    color: "Black",
    material: "Stainless Steel",
    capacity: "N/A",
    stock: 3,
    category: "watches",
    productType: "Sport Watches",
    style: "Statement",
    family: "Men",
    status: "new",
    createdAt: "2026-06-05T10:00:00.000Z",
  },
  {
    id: "outerwear-moncler-quilted-black",
    name: "Quilted Down Jacket",
    description:
      "A warm quilted jacket with a sculpted hood, high-shine shell, and lightweight insulated fill.",
    price: 420,
    brand: "Moncler",
    color: "Black",
    material: "Nylon Down",
    capacity: "N/A",
    stock: 7,
    category: "outerwear",
    productType: "Padding",
    style: "Weekend",
    family: "Women",
    status: "featured",
    createdAt: "2026-06-07T10:00:00.000Z",
  },
  {
    id: "outerwear-prada-hooded-slate",
    name: "Hooded Technical Parka",
    description:
      "A technical hooded parka with clean hardware, padded warmth, and a minimalist city silhouette.",
    price: 460,
    brand: "Prada",
    color: "Slate",
    material: "Technical Nylon",
    capacity: "N/A",
    stock: 4,
    category: "outerwear",
    productType: "Padding",
    style: "Business",
    family: "Men",
    status: "standard",
    createdAt: "2026-06-09T10:00:00.000Z",
  },
  {
    id: "sneaker-lv-trainer-cream",
    name: "Monogram Court Trainer",
    description:
      "A low-profile leather trainer with layered panels, cushioned lining, and an elevated everyday silhouette.",
    price: 249,
    brand: "Louis Vuitton",
    color: "Cream",
    material: "Calfskin Leather",
    capacity: "N/A",
    stock: 9,
    category: "sneakers",
    productType: "Sneakers",
    style: "Casual",
    family: "Unisex",
    status: "featured",
    createdAt: "2026-05-28T10:00:00.000Z",
  },
  {
    id: "sneaker-golden-star-white",
    name: "Vintage Star Leather Sneaker",
    description:
      "A distressed leather sneaker with suede accents, contrast heel detail, and a softly worn-in finish.",
    price: 199,
    brand: "Golden Goose",
    color: "White",
    material: "Leather and Suede",
    capacity: "N/A",
    stock: 14,
    category: "sneakers",
    productType: "Sneakers",
    style: "Weekend",
    family: "Women",
    status: "standard",
    createdAt: "2026-05-30T10:00:00.000Z",
  },
  {
    id: "sneaker-miu-runner-silver",
    name: "Technical Mesh Runner",
    description:
      "A lightweight mixed-material runner with suede overlays, metallic accents, and a sculpted sole.",
    price: 219,
    brand: "Miu Miu",
    color: "Silver",
    material: "Mesh and Suede",
    capacity: "N/A",
    stock: 6,
    category: "sneakers",
    productType: "Sneakers",
    style: "Statement",
    family: "Women",
    status: "new",
    createdAt: "2026-06-01T10:00:00.000Z",
  },
  {
    id: "watch-cartier-tank-ivory",
    name: "Rectangular Dress Watch",
    description:
      "A refined dress watch with a slim rectangular case, roman markers, and a polished leather strap.",
    price: 390,
    brand: "Cartier",
    color: "Ivory",
    material: "Stainless Steel",
    capacity: "N/A",
    stock: 5,
    category: "watches",
    productType: "Dress Watches",
    style: "Business",
    family: "Unisex",
    status: "featured",
    createdAt: "2026-06-03T10:00:00.000Z",
  },
  {
    id: "watch-rolex-diver-black",
    name: "Automatic Diver Watch",
    description:
      "A robust automatic watch with a rotating bezel, luminous markers, and a bracelet-style profile.",
    price: 610,
    brand: "Rolex",
    color: "Black",
    material: "Stainless Steel",
    capacity: "N/A",
    stock: 3,
    category: "watches",
    productType: "Sport Watches",
    style: "Statement",
    family: "Men",
    status: "new",
    createdAt: "2026-06-05T10:00:00.000Z",
  },
  {
    id: "outerwear-moncler-quilted-black",
    name: "Quilted Down Jacket",
    description:
      "A warm quilted jacket with a sculpted hood, high-shine shell, and lightweight insulated fill.",
    price: 420,
    brand: "Moncler",
    color: "Black",
    material: "Nylon Down",
    capacity: "N/A",
    stock: 7,
    category: "outerwear",
    productType: "Padding",
    style: "Weekend",
    family: "Women",
    status: "featured",
    createdAt: "2026-06-07T10:00:00.000Z",
  },
  {
    id: "outerwear-prada-hooded-slate",
    name: "Hooded Technical Parka",
    description:
      "A technical hooded parka with clean hardware, padded warmth, and a minimalist city silhouette.",
    price: 460,
    brand: "Prada",
    color: "Slate",
    material: "Technical Nylon",
    capacity: "N/A",
    stock: 4,
    category: "outerwear",
    productType: "Padding",
    style: "Business",
    family: "Men",
    status: "standard",
    createdAt: "2026-06-09T10:00:00.000Z",
  },
];

export function getMockProduct(id: string): MockProduct | undefined {
  return MOCK_PRODUCTS.find((product) => product.id === id);
}

export function getMockCategories(): string[] {
  return ["bags", "sneakers", "watches", "outerwear"];
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

      const productValue = getSearchableValue(product, key);
      if (!productValue.toLowerCase().includes(normalizedValue)) return false;
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
