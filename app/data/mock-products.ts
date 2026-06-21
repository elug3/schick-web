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
  createdAt: string;
}

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "bag-gucci-jackie-black",
    name: "Jackie 1961 Small Shoulder Bag",
    description:
      "A structured shoulder bag with a curved silhouette, piston hardware, and smooth leather finish.",
    price: 2850,
    brand: "Gucci",
    color: "Black",
    material: "Calfskin Leather",
    capacity: "6L",
    stock: 8,
    category: "bags",
    productType: "Shoulder Bags",
    style: "Evening",
    family: "Women",
    status: "featured",
    createdAt: "2026-05-01T10:00:00.000Z",
  },
  {
    id: "bag-lv-neverfull-monogram",
    name: "Neverfull MM Tote",
    description:
      "A lightweight monogram canvas tote with natural cowhide trim and a removable pouch.",
    price: 2030,
    brand: "Louis Vuitton",
    color: "Brown",
    material: "Coated Canvas",
    capacity: "16L",
    stock: 4,
    category: "bags",
    productType: "Totes",
    style: "Weekend",
    family: "Women",
    status: "new",
    createdAt: "2026-05-08T10:00:00.000Z",
  },
  {
    id: "bag-chanel-classic-flap",
    name: "Classic Medium Flap Bag",
    description:
      "Quilted lambskin bag with chain strap, double flap construction, and signature turn-lock closure.",
    price: 10200,
    brand: "Chanel",
    color: "Beige",
    material: "Lambskin Leather",
    capacity: "4L",
    stock: 2,
    category: "bags",
    productType: "Shoulder Bags",
    style: "Statement",
    family: "Women",
    status: "featured",
    createdAt: "2026-05-12T10:00:00.000Z",
  },
  {
    id: "bag-prada-re-edition-nylon",
    name: "Re-Edition 2005 Nylon Bag",
    description:
      "A compact nylon shoulder bag with Saffiano leather details and detachable chain strap.",
    price: 1950,
    brand: "Prada",
    color: "Black",
    material: "Re-Nylon",
    capacity: "3L",
    stock: 12,
    category: "bags",
    productType: "Mini Bags",
    style: "Casual",
    family: "Women",
    status: "standard",
    createdAt: "2026-05-14T10:00:00.000Z",
  },
  {
    id: "bag-hermes-evelyne-gold",
    name: "Evelyne III 29",
    description:
      "A relaxed crossbody bag in grained leather with perforated H detail and adjustable canvas strap.",
    price: 3800,
    brand: "Hermès",
    color: "Gold",
    material: "Clemence Leather",
    capacity: "8L",
    stock: 1,
    category: "bags",
    productType: "Crossbody",
    style: "Casual",
    family: "Unisex",
    status: "new",
    createdAt: "2026-05-18T10:00:00.000Z",
  },
  {
    id: "bag-dior-book-tote",
    name: "Medium Dior Book Tote",
    description:
      "An embroidered canvas tote designed to carry daily essentials with a structured editorial profile.",
    price: 3500,
    brand: "Dior",
    color: "Blue",
    material: "Embroidered Canvas",
    capacity: "14L",
    stock: 6,
    category: "bags",
    productType: "Totes",
    style: "Business",
    family: "Women",
    status: "standard",
    createdAt: "2026-05-20T10:00:00.000Z",
  },
  {
    id: "bag-bottega-cassette-green",
    name: "Padded Cassette Bag",
    description:
      "A geometric crossbody bag crafted with padded intrecciato leather and a tonal buckle.",
    price: 4200,
    brand: "Bottega Veneta",
    color: "Green",
    material: "Nappa Leather",
    capacity: "5L",
    stock: 5,
    category: "bags",
    productType: "Crossbody",
    style: "Statement",
    family: "Women",
    status: "featured",
    createdAt: "2026-05-22T10:00:00.000Z",
  },
  {
    id: "bag-coach-tabby-ivory",
    name: "Tabby Shoulder Bag 26",
    description:
      "A polished shoulder bag with refined leather, signature hardware, and convertible strap styling.",
    price: 450,
    brand: "Coach",
    color: "Ivory",
    material: "Pebbled Leather",
    capacity: "5L",
    stock: 15,
    category: "bags",
    productType: "Shoulder Bags",
    style: "Business",
    family: "Women",
    status: "standard",
    createdAt: "2026-05-24T10:00:00.000Z",
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
