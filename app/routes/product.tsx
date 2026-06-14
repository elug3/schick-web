import { useState } from "react";
import { Link, useParams } from "react-router";
import { mockProducts, type Product } from "../data/mockProducts";

export function meta({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id);
  return [
    { title: product ? `${product.name} — Schick` : "Product | Schick" },
    { name: "description", content: product?.description ?? "" },
  ];
}

export default function ProductPage() {
  const { id } = useParams();
  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p
          className="text-5xl font-light text-zinc-300"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Not Found
        </p>
        <p className="text-sm text-zinc-400">This product doesn't exist.</p>
        <Link
          to="/"
          className="mt-2 text-xs font-semibold uppercase tracking-widest text-zinc-950 underline-offset-4 hover:underline"
        >
          Browse all bags
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <Breadcrumb product={product} />
      <ProductLayout product={product} />
    </main>
  );
}

// ── Breadcrumb ─────────────────────────────────────────────────────────────

function Breadcrumb({ product }: { product: Product }) {
  return (
    <div className="border-b border-zinc-100 px-4 py-3 md:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400">
          <Link to="/" className="transition hover:text-zinc-950">Home</Link>
          <ChevronIcon />
          <Link to="/" className="transition hover:text-zinc-950">Bags</Link>
          <ChevronIcon />
          <Link
            to="/"
            className="transition hover:text-zinc-950"
          >
            {product.brand}
          </Link>
          <ChevronIcon />
          <span className="text-zinc-600">{product.name}</span>
        </nav>
      </div>
    </div>
  );
}

// ── Main product layout ────────────────────────────────────────────────────

function ProductLayout({ product }: { product: Product }) {
  // Simulate multiple angles from the single image using crop offsets
  const images = [
    { src: product.image, position: "object-center" },
    { src: product.image, position: "object-top" },
    { src: product.image, position: "object-bottom" },
    { src: product.image, position: "object-left" },
  ];

  const [activeImg, setActiveImg] = useState(0);

  return (
    <div className="mx-auto max-w-7xl px-0 md:px-8 md:py-10">
      <div className="flex flex-col md:flex-row md:gap-12 lg:gap-20">

        {/* ── Left: image gallery ──────────────────────────────────────── */}
        <div className="flex-1 md:flex md:gap-4">

          {/* Thumbnail strip — desktop only */}
          <div className="hidden flex-col gap-2 md:flex">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImg(i)}
                className={[
                  "h-20 w-16 overflow-hidden bg-zinc-50 transition",
                  activeImg === i
                    ? "ring-1 ring-zinc-950"
                    : "opacity-50 hover:opacity-80",
                ].join(" ")}
              >
                <img
                  src={img.src}
                  alt=""
                  className={`h-full w-full object-cover ${img.position}`}
                />
              </button>
            ))}
          </div>

          {/* Main image */}
          <div className="relative flex-1 overflow-hidden bg-zinc-50">
            <div className="relative" style={{ paddingBottom: "120%" }}>
              <img
                src={images[activeImg].src}
                alt={product.name}
                className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${images[activeImg].position}`}
              />
              {/* Badge */}
              {getBadge(product) && (
                <span
                  className={`absolute left-4 top-4 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider ${getBadge(product)!.style}`}
                >
                  {getBadge(product)!.label}
                </span>
              )}
              {product.isNew && !getBadge(product) && (
                <span className="absolute left-4 top-4 border border-zinc-300 bg-white px-3 py-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-700">
                  New Arrival
                </span>
              )}
            </div>

            {/* Mobile dot nav */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 md:hidden">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImg(i)}
                  className={[
                    "h-1.5 rounded-full transition-all",
                    activeImg === i ? "w-5 bg-zinc-950" : "w-1.5 bg-zinc-400",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ── Right: product info ──────────────────────────────────────── */}
        <div className="w-full px-4 py-8 md:w-[420px] md:shrink-0 md:px-0 md:py-0">
          <ProductInfo product={product} />
        </div>
      </div>
    </div>
  );
}

// ── Product Info ───────────────────────────────────────────────────────────

function ProductInfo({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product.sizes?.[0] ?? null
  );
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);

  function handleAddToBag() {
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="flex flex-col gap-0">

      {/* Brand */}
      <Link
        to="/"
        className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c8a96e] transition hover:opacity-70"
      >
        {product.brand}
      </Link>

      {/* Name */}
      <h1
        className="mt-2 text-4xl font-light leading-tight text-zinc-950 md:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {product.name}
      </h1>

      {/* Rating */}
      {product.rating && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon key={i} filled={i < Math.round(product.rating!)} />
            ))}
          </div>
          <span className="text-xs text-zinc-400">
            {product.rating} · {product.reviews?.toLocaleString()} reviews
          </span>
        </div>
      )}

      {/* Price + stock */}
      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-3xl font-semibold tracking-tight text-zinc-950">
          ${product.price.toLocaleString()}
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest ${product.inStock ? "text-emerald-600" : "text-zinc-400"}`}
        >
          {product.inStock ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <div className="my-6 h-px bg-zinc-100" />

      {/* Description */}
      <p className="text-sm leading-relaxed text-zinc-500">{product.description}</p>

      {/* Details */}
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-xs">
        {[
          ["Brand", product.brand],
          ["Category", product.category],
          ["Material", "Premium Leather"],
          ["Origin", "Imported"],
        ].map(([dt, dd]) => (
          <div key={dt}>
            <dt className="font-semibold uppercase tracking-widest text-zinc-400">{dt}</dt>
            <dd className="mt-0.5 text-zinc-700">{dd}</dd>
          </div>
        ))}
      </dl>

      <div className="my-6 h-px bg-zinc-100" />

      {/* Size selector */}
      {product.sizes && product.sizes.length > 1 && (
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              Size
            </p>
            {selectedSize && (
              <span className="text-[10px] text-zinc-400">{selectedSize}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={[
                  "h-9 min-w-[2.75rem] px-3 text-xs font-medium uppercase tracking-wider transition",
                  selectedSize === size
                    ? "bg-zinc-950 text-white"
                    : "border border-zinc-200 text-zinc-600 hover:border-zinc-950",
                ].join(" ")}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CTAs */}
      <div className="flex gap-3">
        <button
          type="button"
          disabled={!product.inStock}
          onClick={handleAddToBag}
          className={[
            "flex h-14 flex-1 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest transition",
            product.inStock
              ? added
                ? "bg-zinc-600 text-white"
                : "bg-zinc-950 text-white hover:bg-zinc-800"
              : "cursor-not-allowed bg-zinc-100 text-zinc-400",
          ].join(" ")}
        >
          {added ? (
            <><CheckIcon /> Added</>
          ) : product.inStock ? (
            "Add to Bag"
          ) : (
            "Out of Stock"
          )}
        </button>

        <button
          type="button"
          onClick={() => setWishlist((v) => !v)}
          aria-label={wishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="flex h-14 w-14 items-center justify-center border border-zinc-200 text-zinc-500 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          <HeartIcon filled={wishlist} />
        </button>
      </div>

      <Link
        to="/product/c1"
        className="mt-3 flex h-12 w-full items-center justify-center border border-zinc-200 text-xs font-semibold uppercase tracking-widest text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
      >
        Book Style Consult
      </Link>

      {/* Trust signals */}
      <div className="mt-8 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-6">
        {[
          { icon: ShieldIcon, label: "Authenticity", sub: "Guaranteed" },
          { icon: TruckIcon, label: "Free Shipping", sub: "Over $100" },
          { icon: ReturnIcon, label: "Easy Returns", sub: "30 Days" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-1.5 text-center">
            <Icon />
            <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-700">{label}</p>
            <p className="text-[9px] text-zinc-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Accordion details */}
      <div className="mt-8 space-y-0 border-t border-zinc-100">
        {[
          {
            title: "Product Details",
            body: "Crafted with the finest materials and meticulous attention to detail. Each piece is individually inspected to ensure the highest quality standards.",
          },
          {
            title: "Shipping & Returns",
            body: "Free standard shipping on orders over $100. Express and overnight options available at checkout. Returns accepted within 30 days of delivery.",
          },
          {
            title: "Authenticity",
            body: "Every item sold by Schick comes with a certificate of authenticity. We partner directly with authorized retailers to guarantee genuine products.",
          },
        ].map((item) => (
          <AccordionItem key={item.title} title={item.title} body={item.body} />
        ))}
      </div>
    </div>
  );
}

function AccordionItem({ title, body }: { title: string; body: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-zinc-100">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-700">
          {title}
        </span>
        <span className={`text-zinc-400 transition ${open ? "rotate-45" : ""}`}>
          <PlusIcon />
        </span>
      </button>
      {open && (
        <p className="pb-4 text-xs leading-relaxed text-zinc-400">{body}</p>
      )}
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getBadge(product: Product) {
  if ((product.reviews ?? 0) >= 300 && (product.rating ?? 0) >= 4.9)
    return { label: "Best", style: "bg-[#c8a96e] text-white" };
  if ((product.reviews ?? 0) >= 300)
    return { label: "Top Seller", style: "bg-zinc-950 text-white" };
  if ((product.rating ?? 0) >= 4.9)
    return { label: "Top Rated", style: "bg-zinc-700 text-white" };
  return null;
}

// ── Icons ──────────────────────────────────────────────────────────────────

function ChevronIcon() {
  return (
    <svg aria-hidden="true" className="size-3 text-zinc-300" viewBox="0 0 24 24" fill="none">
      <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" className={`size-3.5 ${filled ? "fill-[#c8a96e]" : "fill-zinc-200"}`} viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <path d="M20 7 10 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"}>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="size-5 text-zinc-400" viewBox="0 0 24 24" fill="none">
      <path d="M12 3 4 7v5c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V7l-8-4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="m9 12 2 2 4-4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg aria-hidden="true" className="size-5 text-zinc-400" viewBox="0 0 24 24" fill="none">
      <path d="M5 17H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2m0 0h3l3 4v4h-2m-4-6H14m0 0v6m0-6h7m-7 6H8m12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg aria-hidden="true" className="size-5 text-zinc-400" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 1 0 2.35-5.65M4 5v5h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
