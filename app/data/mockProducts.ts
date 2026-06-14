export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  image: string;
  description: string;
  sizes?: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  isNew?: boolean;
}

export const mockProducts: Product[] = [
  // ── Bags ────────────────────────────────────────────────────────────────
  {
    id: "b1",
    name: "GG Marmont Matelassé",
    brand: "Gucci",
    price: 1250,
    category: "Bag",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&sat=-30&hue=200",
    description: "Iconic quilted chevron leather with Double G hardware",
    rating: 4.9,
    reviews: 342,
    inStock: true,
  },
  {
    id: "b2",
    name: "Neverfull MM Tote",
    brand: "Louis Vuitton",
    price: 1550,
    category: "Bag",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
    description: "The ultimate everyday tote in signature monogram canvas",
    rating: 4.8,
    reviews: 512,
    inStock: true,
  },
  {
    id: "b3",
    name: "Classic Flap Bag",
    brand: "Chanel",
    price: 6200,
    category: "Bag",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600",
    description: "The timeless quilted lambskin with interlocking CC clasp",
    rating: 5.0,
    reviews: 189,
    inStock: true,
  },
  {
    id: "b4",
    name: "Re-Edition 2005 Nylon",
    brand: "Prada",
    price: 1490,
    category: "Bag",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600",
    description: "Revisited Prada Archive nylon with adjustable strap",
    rating: 4.7,
    reviews: 276,
    inStock: true,
    isNew: true,
  },
  {
    id: "b5",
    name: "Tabby Shoulder Bag 26",
    brand: "Coach",
    price: 450,
    category: "Bag",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600",
    description: "Buttery pebble leather with signature C hardware detail",
    rating: 4.6,
    reviews: 398,
    inStock: true,
  },
  {
    id: "b6",
    name: "Kelly Mini II",
    brand: "Hermès",
    price: 8500,
    category: "Bag",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600",
    description: "The iconic structured silhouette in togo leather",
    rating: 4.9,
    reviews: 97,
    inStock: true,
    isNew: true,
  },
  {
    id: "b7",
    name: "Dionysus Mini Shoulder",
    brand: "Gucci",
    price: 1390,
    category: "Bag",
    image: "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=600",
    description: "Tiger head closure on a tiger-embroidered velvet body",
    rating: 4.8,
    reviews: 215,
    inStock: true,
  },
  {
    id: "b8",
    name: "Pochette Métis",
    brand: "Louis Vuitton",
    price: 1750,
    category: "Bag",
    image: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600",
    description: "Messenger-inspired flap bag in Monogram Empreinte leather",
    rating: 4.9,
    reviews: 423,
    inStock: true,
  },
  // ── Consultation ────────────────────────────────────────────────────────
  {
    id: "c1",
    name: "Personal Style Session",
    brand: "Schick",
    price: 50,
    category: "Consultation",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600",
    description: "One-on-one consultation with a certified bag stylist",
    rating: 4.9,
    reviews: 203,
    inStock: true,
  },
];
