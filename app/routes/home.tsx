import { Link } from "react-router";
import { mockProducts } from "../data/mockProducts";

export function meta() {
  return [
    { title: "Schick — Curated Luxury Bags" },
    { name: "description", content: "Authentic luxury bags from the world's most coveted brands." },
  ];
}

const BRAND_TILES = [
  {
    name: "Gucci",
    to: "/product/b1",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=900&fit=crop",
    label: "Gucci",
    sub: "Italian Heritage",
  },
  {
    name: "Louis Vuitton",
    to: "/product/b2",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=900&fit=crop",
    label: "Louis Vuitton",
    sub: "Parisian Luxury",
  },
  {
    name: "Chanel",
    to: "/product/b3",
    image: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&h=900&fit=crop",
    label: "Chanel",
    sub: "Timeless Elegance",
  },
  {
    name: "Prada",
    to: "/product/b4",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=900&fit=crop",
    label: "Prada",
    sub: "Milan Sophistication",
  },
  {
    name: "Coach",
    to: "/product/b5",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&h=900&fit=crop",
    label: "Coach",
    sub: "New York Craft",
  },
  {
    name: "Hermès",
    to: "/product/b6",
    image: "https://images.unsplash.com/photo-1473188588951-666fce8e7c68?w=800&h=900&fit=crop",
    label: "Hermès",
    sub: "Ultimate Rarity",
  },
];

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <BrandTiles />
      <FeaturedBags />
      <EditorialBanner />
    </main>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="flex min-h-[88vh] flex-col md:flex-row">
      {/* Text pane */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center md:items-start md:px-16 md:text-left">
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
          New Season 2026
        </p>
        <h1
          className="text-6xl font-light leading-none tracking-tight text-zinc-950 md:text-8xl lg:text-[7rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Carry
          <br />
          <em className="not-italic text-zinc-400">the Icon.</em>
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-loose text-zinc-400">
          Uncompromising materials. Meticulous craftsmanship. Authentic luxury
          bags from the world's most coveted brands.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-12 items-center gap-2 bg-zinc-950 px-8 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
          >
            Shop Now
          </Link>
          <Link
            to="/product/c1"
            className="inline-flex h-12 items-center gap-2 border border-zinc-200 px-8 text-xs font-semibold uppercase tracking-widest text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
          >
            Style Consult
          </Link>
        </div>
      </div>

      {/* Image pane */}
      <div className="relative hidden overflow-hidden md:flex md:w-[52%]">
        <img
          src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&h=1200&fit=crop"
          alt="Luxury bag hero"
          className="h-full w-full object-cover"
        />
        {/* Subtle editorial overlay */}
        <div className="absolute inset-0 bg-zinc-950/5" />
        <div className="absolute bottom-8 left-8 right-8">
          <span className="inline-block border border-white/40 bg-white/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
            Chanel Classic Flap — $6,200
          </span>
        </div>
      </div>
    </section>
  );
}

// ── Brand Tiles ────────────────────────────────────────────────────────────

function BrandTiles() {
  return (
    <section className="border-t border-zinc-100 px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2
            className="text-3xl font-light tracking-tight text-zinc-950 md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Shop by Brand
          </h2>
          <Link
            to="/"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 transition hover:text-zinc-950"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {BRAND_TILES.map((brand) => (
            <Link
              key={brand.name}
              to={brand.to}
              className="group relative overflow-hidden"
            >
              {/* Image */}
              <div className="relative overflow-hidden" style={{ paddingBottom: "120%" }}>
                <img
                  src={brand.image}
                  alt={brand.label}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />

                {/* Text overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <p className="text-xs font-light tracking-[0.2em] uppercase text-white/60 mb-1">
                    {brand.sub}
                  </p>
                  <p
                    className="text-xl font-light text-white md:text-2xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {brand.label}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Featured Bags ──────────────────────────────────────────────────────────

function getBadge(product: (typeof mockProducts)[number]) {
  if ((product.reviews ?? 0) >= 300 && (product.rating ?? 0) >= 4.9)
    return { label: "Best", style: "bg-[#c8a96e] text-white" };
  if ((product.reviews ?? 0) >= 300)
    return { label: "Top Seller", style: "bg-zinc-950 text-white" };
  if ((product.rating ?? 0) >= 4.9)
    return { label: "Top Rated", style: "bg-zinc-600 text-white" };
  if (product.isNew)
    return { label: "New", style: "bg-white text-zinc-950 border border-zinc-200" };
  return null;
}

function FeaturedBags() {
  const featured = mockProducts.filter((p) => p.category === "Bag" && p.inStock);

  return (
    <section className="border-t border-zinc-100 px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2
            className="text-3xl font-light tracking-tight text-zinc-950 md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Featured Bags
          </h2>
          <Link
            to="/"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 transition hover:text-zinc-950"
          >
            See All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
          {featured.map((product) => {
            const badge = getBadge(product);
            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                {/* Image */}
                <div className="relative mb-3 overflow-hidden bg-zinc-50" style={{ paddingBottom: "110%" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  {badge && (
                    <span className={`absolute left-3 top-3 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${badge.style}`}>
                      {badge.label}
                    </span>
                  )}
                </div>

                {/* Info */}
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                  {product.brand}
                </p>
                <p className="mt-0.5 text-sm font-medium text-zinc-950 leading-snug">
                  {product.name}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-950">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.rating && (
                    <span className="flex items-center gap-0.5 text-[10px] text-zinc-400">
                      <StarIcon />
                      {product.rating}
                      {product.reviews && (
                        <span className="ml-0.5">({product.reviews})</span>
                      )}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Editorial Banner ───────────────────────────────────────────────────────

function EditorialBanner() {
  return (
    <section className="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=1600&h=600&fit=crop"
        alt="Summer Edit"
        className="h-64 w-full object-cover md:h-96"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/50 text-center text-white">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
          Limited Time
        </p>
        <h3
          className="text-4xl font-light md:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Summer Edit
        </h3>
        <p className="mt-2 text-sm tracking-widest text-white/70">30% off selected bags</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center border border-white px-8 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-zinc-950"
        >
          Shop Sale
        </Link>
      </div>
    </section>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function StarIcon() {
  return (
    <svg aria-hidden="true" className="size-2.5 fill-[#c8a96e]" viewBox="0 0 24 24">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}
