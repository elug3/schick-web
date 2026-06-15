import { useEffect, useState } from "react";
import { Link } from "react-router";
import { type Bag, fetchBags, bagImage } from "../lib/api";

export function meta() {
  return [
    { title: "Schick — Curated Luxury Bags" },
    { name: "description", content: "Authentic luxury bags from the world's most coveted brands." },
  ];
}


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
            New Season — Curated Luxury
          </span>
        </div>
      </div>
    </section>
  );
}

// ── Brand Tiles ────────────────────────────────────────────────────────────

function BrandTiles() {
  const [tiles, setTiles] = useState<{ brand: string; id: string }[]>([]);

  useEffect(() => {
    fetchBags().then((bags) => {
      const seen = new Set<string>();
      const unique: { brand: string; id: string }[] = [];
      for (const b of bags) {
        if (!seen.has(b.brand)) {
          seen.add(b.brand);
          unique.push({ brand: b.brand, id: b.id });
        }
      }
      setTiles(unique);
    }).catch(() => {});
  }, []);

  if (tiles.length === 0) return null;

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
            to="/category/brand"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 transition hover:text-zinc-950"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {tiles.map(({ brand, id }) => (
            <Link key={brand} to={`/product/${id}`} className="group relative overflow-hidden">
              <div className="relative overflow-hidden" style={{ paddingBottom: "120%" }}>
                <img
                  src={bagImage(brand)}
                  alt={brand}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <p
                    className="text-xl font-light text-white md:text-2xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {brand}
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

function FeaturedBags() {
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBags()
      .then(setBags)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Failed to load bags")
      )
      .finally(() => setLoading(false));
  }, []);

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

        {error && (
          <p className="text-sm text-zinc-400">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="mb-3 bg-zinc-100" style={{ paddingBottom: "110%" }} />
                  <div className="h-2.5 w-16 rounded bg-zinc-100" />
                  <div className="mt-1.5 h-3.5 w-32 rounded bg-zinc-100" />
                  <div className="mt-2 h-3 w-20 rounded bg-zinc-100" />
                </div>
              ))
            : bags.map((bag) => (
                <Link key={bag.id} to={`/product/${bag.id}`} className="group">
                  <div
                    className="relative mb-3 overflow-hidden bg-zinc-50"
                    style={{ paddingBottom: "110%" }}
                  >
                    <img
                      src={bagImage(bag.brand)}
                      alt={bag.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {bag.stock <= 5 && bag.stock > 0 && (
                      <span className="absolute left-3 top-3 bg-zinc-950 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                        Low Stock
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    {bag.brand}
                  </p>
                  <p className="mt-0.5 text-sm font-medium leading-snug text-zinc-950">
                    {bag.name}
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-zinc-950">
                    ${bag.price.toLocaleString()}
                  </p>
                </Link>
              ))}
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

