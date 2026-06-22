import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  type Bag,
  type DisplayProduct,
  fetchBags,
  bagImage,
  heroBagImage,
  getCategoryImage,
  productImage,
  searchProducts,
} from "../lib/api";
import { useLanguage } from "../lib/i18n";
import { ProductPrice } from "../components/product-price";

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
      <CategoryPillars />
      <BrandTiles />
      <FeaturedBags />
      <CrossCategoryProducts />
      <EditorialBanner />
    </main>
  );
}

// ── Hero ───────────────────────────────────────────────────────────────────

const HERO_BAG_ID = "bag-hermes-birkin-25";

function Hero() {
  const { t, formatCurrency, translateProductName } = useLanguage();
  const [heroBag, setHeroBag] = useState<Bag | null>(null);

  useEffect(() => {
    fetchBags()
      .then((bags) => {
        const selected =
          bags.find((bag) => bag.id === HERO_BAG_ID) ??
          bags.find((bag) => bag.brand === "Hermès") ??
          bags[0] ??
          null;
        setHeroBag(selected);
      })
      .catch(() => {});
  }, []);

  const shopLink = heroBag
    ? `/product/${heroBag.id}`
    : "/category/product-type/handbags";

  return (
    <section className="flex min-h-[88vh] flex-col md:flex-row">
      {/* Text pane */}
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-20 text-center md:items-start md:px-16 md:text-left">
        <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-400">
          {t("home.eyebrow")}
        </p>
        <h1
          className="text-6xl font-light leading-none tracking-tight text-zinc-950 md:text-8xl lg:text-[7rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("home.heroTitleLine1")}
          <br />
          <em className="not-italic text-zinc-400">{t("home.heroTitleLine2")}</em>
        </h1>
        <p className="mt-6 max-w-sm text-sm leading-loose text-zinc-400">
          {t("home.heroDescription")}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex h-12 items-center gap-2 bg-zinc-950 px-8 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
          >
            {t("home.shopNow")}
          </Link>
          <Link
            to="/category/product-type/handbags"
            className="inline-flex h-12 items-center gap-2 border border-zinc-200 px-8 text-xs font-semibold uppercase tracking-widest text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
          >
            {t("home.heroTitleLine1")}
            <br />
            <em className="not-italic text-zinc-400">{t("home.heroTitleLine2")}</em>
          </h1>
          <p className="mx-auto mt-6 max-w-sm text-sm leading-loose text-zinc-500 lg:mx-0">
            {t("home.heroDescription")}
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              to={shopLink}
              className="inline-flex h-12 items-center justify-center bg-zinc-950 px-8 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
            >
              {t("home.shopNow")}
            </Link>
            <Link
              to="/category/product-type/handbags"
              className="inline-flex h-12 items-center justify-center border border-zinc-300/80 bg-white/40 px-8 text-xs font-semibold uppercase tracking-widest text-zinc-600 backdrop-blur-sm transition hover:border-zinc-950 hover:text-zinc-950"
            >
              {t("home.styleConsult")}
            </Link>
          </div>
        </div>

        <div className="relative flex min-h-[28rem] items-end px-6 pb-10 pt-4 sm:min-h-[34rem] lg:min-h-0 lg:items-center lg:px-10 lg:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(200,169,110,0.18),transparent_42%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.85),transparent_35%),linear-gradient(135deg,#faf6f0_0%,#efe5d9_52%,#e4d8ca_100%)]" />
          <div className="absolute inset-y-10 left-0 hidden w-px bg-gradient-to-b from-transparent via-[#c8a96e]/60 to-transparent lg:block" />

          {heroBag ? (
            <Link
              to={`/product/${heroBag.id}`}
              className="group relative z-10 mx-auto flex w-full max-w-xl flex-col items-center lg:items-start"
            >
              <div className="mb-5 flex items-center gap-3 self-start">
                <span className="inline-flex items-center gap-2 border border-[#c8a96e]/30 bg-white/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#9a7b45] backdrop-blur-sm">
                  {t("home.heroFeatured")}
                </span>
                <span className="hidden h-px w-10 bg-[#c8a96e]/40 sm:block" />
              </div>

              <div className="relative flex w-full items-center justify-center">
                <div className="absolute inset-x-8 bottom-2 h-16 rounded-full bg-zinc-950/10 blur-3xl transition duration-700 group-hover:bg-zinc-950/15" />
                <img
                  src={heroBagImage(heroBag.image, heroBag.brand)}
                  alt={translateProductName(heroBag.id, heroBag.name)}
                  className="relative z-10 max-h-[26rem] w-full object-contain transition duration-700 group-hover:scale-[1.02] lg:max-h-[34rem]"
                />
              </div>

              <div className="mt-8 w-full border-t border-zinc-950/10 pt-5 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c8a96e]">
                  {heroBag.brand}
                </p>
                <h2
                  className="mt-2 text-2xl font-light leading-tight text-zinc-950 lg:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {translateProductName(heroBag.id, heroBag.name)}
                </h2>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <p className="text-lg font-medium tracking-tight text-zinc-950">
                    {formatCurrency(heroBag.price)}
                  </p>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-500 transition group-hover:text-zinc-950">
                    {t("home.heroViewProduct")} →
                  </span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="relative z-10 mx-auto h-[26rem] w-full max-w-xl animate-pulse rounded-[2rem] bg-white/30" />
          )}
        </div>
      </div>
    </section>
  );
}

// ── Category Pillars ────────────────────────────────────────────────────────

const categoryPillars = [
  {
    key: "bags",
    titleKey: "home.categoryBags",
    descriptionKey: "home.categoryBagsDescription",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=1100&fit=crop",
    to: "/category/product-type/handbags",
  },
];

function CategoryPillars() {
  const { t } = useLanguage();

  return (
    <section className="bg-zinc-950 px-4 py-14 text-white md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c8a96e]">
            {t("home.categoryEyebrow")}
          </p>
          <h2
            className="text-4xl font-light tracking-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("home.categoryTitle")}
          </h2>
          <p className="mt-4 text-sm leading-loose text-white/55">
            {t("home.categoryDescription")}
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-1">
          {categoryPillars.map((category) => (
            <Link
              key={category.key}
              to={category.to}
              className="group relative min-h-[22rem] overflow-hidden bg-zinc-900"
            >
              <img
                src={category.image}
                alt={t(category.titleKey)}
                className="absolute inset-0 h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c8a96e]">
                  {t("home.shopCollection")}
                </p>
                <h3
                  className="mt-2 text-3xl font-light"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {t(category.titleKey)}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/60">
                  {t(category.descriptionKey)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Brand Tiles ────────────────────────────────────────────────────────────

function BrandTiles() {
  const { t } = useLanguage();
  const [tiles, setTiles] = useState<{ brand: string; id: string; image?: string }[]>([]);

  useEffect(() => {
    fetchBags().then((bags) => {
      const seen = new Set<string>();
      const unique: { brand: string; id: string; image?: string }[] = [];
      for (const b of bags) {
        if (!seen.has(b.brand)) {
          seen.add(b.brand);
          unique.push({ brand: b.brand, id: b.id, image: b.image });
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
            {t("home.shopByBrand")}
          </h2>
          <Link
            to="/category/brand"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 transition hover:text-zinc-950"
          >
            {t("home.viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {tiles.map(({ brand, id, image }) => (
            <Link key={brand} to={`/product/${id}`} className="group relative overflow-hidden">
              <div className="relative overflow-hidden" style={{ paddingBottom: "120%" }}>
                <img
                  src={bagImage(brand, image)}
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
  const { t, translateProductName } = useLanguage();
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBags()
      .then(setBags)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : t("home.failedToLoadBags"))
      )
      .finally(() => setLoading(false));
  }, [t]);

  return (
    <section className="border-t border-zinc-100 px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h2
            className="text-3xl font-light tracking-tight text-zinc-950 md:text-4xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("home.featuredBags")}
          </h2>
          <Link
            to="/category/product-type/handbags"
            className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 transition hover:text-zinc-950"
          >
            {t("home.seeAll")}
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
                      src={bagImage(bag.brand, bag.image)}
                      alt={bag.name}
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {bag.stock <= 5 && bag.stock > 0 && (
                      <span className="absolute left-3 top-3 bg-zinc-950 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                        {t("home.lowStock")}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    {bag.brand}
                  </p>
                  <p className="mt-0.5 text-sm font-medium leading-snug text-zinc-950">
                    {translateProductName(bag.id, bag.name)}
                  </p>
                  <ProductPrice price={bag.price} />
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}

// ── Cross-category products ────────────────────────────────────────────────

function CrossCategoryProducts() {
  const { t, translateProductName } = useLanguage();
  const [products, setProducts] = useState<DisplayProduct[]>([]);

  useEffect(() => {
    Promise.all(
      ["bags"].map((category) =>
        searchProducts(category).then((data) => data.results.slice(0, 8))
      )
    )
      .then((groups) => setProducts(groups.flat()))
      .catch(() => {});
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="border-t border-zinc-100 px-4 py-12 md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
              {t("home.crossCategoryEyebrow")}
            </p>
            <h2
              className="mt-2 text-3xl font-light tracking-tight text-zinc-950 md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("home.crossCategoryTitle")}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-zinc-400">
            {t("home.crossCategoryDescription")}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4 md:gap-x-5 md:gap-y-12">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="group">
              <div
                className="relative mb-3 overflow-hidden bg-zinc-50"
                style={{ paddingBottom: "116%" }}
              >
                <img
                  src={
                    product.image
                      ? productImage(product.category, String(product.details.Brand ?? ""), product.image)
                      : getCategoryImage(product.category)
                  }
                  alt={translateProductName(product.id, product.name)}
                  className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 bg-white/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-zinc-950">
                  {t(`home.categoryLabel.${product.category}`)}
                </span>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {product.details.Brand}
              </p>
              <p className="mt-0.5 text-sm font-medium leading-snug text-zinc-950">
                {translateProductName(product.id, product.name)}
              </p>
              <ProductPrice price={product.price} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Editorial Banner ───────────────────────────────────────────────────────

function EditorialBanner() {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=1600&h=600&fit=crop"
        alt={t("home.summerEditAlt")}
        className="h-64 w-full object-cover md:h-96"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/50 text-center text-white">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60">
          {t("home.limitedTime")}
        </p>
        <h3
          className="text-4xl font-light md:text-6xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t("home.summerEdit")}
        </h3>
        <p className="mt-2 text-sm tracking-widest text-white/70">{t("home.saleDescription")}</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center border border-white px-8 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-zinc-950"
        >
          {t("home.shopSale")}
        </Link>
      </div>
    </section>
  );
}

