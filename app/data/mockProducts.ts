export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  sizes?: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Classic White Sneaker",
    price: 89.99,
    category: "Shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    description: "Timeless white sneaker perfect for everyday wear",
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.5,
    reviews: 128,
    inStock: true,
  },
  {
    id: "2",
    name: "Premium Winter Jacket",
    price: 249.99,
    category: "Outerwear",
    image: "https://images.unsplash.com/photo-1539533057592-4516c98775cb?w=400",
    description: "Warm and stylish winter jacket with water resistance",
    sizes: ["XS", "S", "M", "L", "XL", "Free"],
    rating: 4.8,
    reviews: 92,
    inStock: true,
  },
  {
    id: "3",
    name: "Blue Denim Jeans",
    price: 79.99,
    category: "Bottoms",
    image: "https://images.unsplash.com/photo-1542272604-787c62d465d1?w=400",
    description: "Classic blue denim jeans with a modern fit",
    sizes: ["XS", "S", "M", "L", "XL"],
    rating: 4.3,
    reviews: 245,
    inStock: true,
  },
  {
    id: "4",
    name: "Leather Crossbody Bag",
    price: 159.99,
    category: "Bag",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400",
    description: "Elegant leather bag perfect for daily use",
    sizes: ["Free"],
    rating: 4.6,
    reviews: 87,
    inStock: true,
  },
  {
    id: "5",
    name: "Minimalist Watch",
    price: 199.99,
    category: "Clock",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400",
    description: "Sleek minimalist watch with premium materials",
    sizes: ["Free"],
    rating: 4.7,
    reviews: 156,
    inStock: false,
  },
  {
    id: "6",
    name: "Consultation Session",
    price: 50.0,
    category: "Consultation",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400",
    description: "Professional style consultation with expert advice",
    sizes: ["Free"],
    rating: 4.9,
    reviews: 203,
    inStock: true,
  },
];
