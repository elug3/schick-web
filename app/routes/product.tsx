import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { NotFoundPage } from "~/components/not-found";
import { type ServerProduct, fetchProduct, bagImage } from "../lib/api";
import { useLanguage } from "../lib/i18n";
import { useCart } from "../lib/useCart";

export function meta() {
  return [
    { title: "Product | Schick" },
    { name: "description", content: "Authentic luxury bag." },
  ];
}

export default function ProductPage() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [product, setProduct] = useState<ServerProduct | null>(null);
  const [status, setStatus] = useState<"loading" | "unauth" | "error" | "ok">("loading");

  useEffect(() => {
    if (!id) { setStatus("error"); return; }
    fetchProduct(id)
      .then((p) => { setProduct(p); setStatus("ok"); })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : "";
        setStatus(msg === "Not authenticated" ? "unauth" : "error");
      });
  }, [id]);

  if (status === "loading") {
    return (
      <main className="mx-auto max-w-7xl animate-pulse px-4 py-10 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="flex-1 bg-zinc-100" style={{ paddingBottom: "120%" }} />
          <div className="w-full space-y-4 md:w-[420px]">
            <div className="h-4 w-24 rounded bg-zinc-100" />
            <div className="h-10 w-64 rounded bg-zinc-100" />
            <div className="h-8 w-32 rounded bg-zinc-100" />
          </div>
        </div>
      </main>
    );
  }

  if (status === "unauth") {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-5xl font-light text-zinc-300" style={{ fontFamily: "var(--font-display)" }}>
          {t("product.signInRequired")}
        </p>
        <p className="text-sm text-zinc-400">{t("product.signInRequiredDescription")}</p>
        <Link
          to="/login"
          className="mt-4 inline-flex h-12 items-center bg-zinc-950 px-8 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
        >
          {t("product.signIn")}
        </Link>
      </main>
    );
  }

  if (status === "error" || !product) {
    return (
      <NotFoundPage
        eyebrow={t("product.noProduct")}
        title={t("product.notFound")}
        description={t("product.notFoundDescription")}
        primaryAction={{ label: t("product.browseAllBags"), to: "/" }}
      />
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

function Breadcrumb({ product }: { product: ServerProduct }) {
  const { t, translateProductName } = useLanguage();

  return (
    <div className="border-b border-zinc-100 px-4 py-3 md:px-8">
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-400">
          <Link to="/" className="transition hover:text-zinc-950">{t("product.home")}</Link>
          <ChevronIcon />
          <Link to="/" className="transition hover:text-zinc-950">{t("product.bags")}</Link>
          <ChevronIcon />
          <Link
            to="/"
            className="transition hover:text-zinc-950"
          >
            {product.brand}
          </Link>
          <ChevronIcon />
          <span className="text-zinc-600">{translateProductName(product.id, product.name)}</span>
        </nav>
      </div>
    </div>
  );
}

// ── Main product layout ────────────────────────────────────────────────────

function ProductLayout({ product }: { product: ServerProduct }) {
  const { t, translateProductName } = useLanguage();
  const img = bagImage(product.brand);
  const images = [
    { src: img, position: "object-center" },
    { src: img, position: "object-top" },
    { src: img, position: "object-bottom" },
    { src: img, position: "object-left" },
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
                alt={translateProductName(product.id, product.name)}
                className={`absolute inset-0 h-full w-full object-cover transition duration-500 ${images[activeImg].position}`}
              />
              {/* Badge */}
              {(() => { const b = getBadge(product); return b && (
                <span className={`absolute left-4 top-4 px-3 py-1 text-[9px] font-semibold uppercase tracking-wider ${b.style}`}>
                  {t(b.labelKey)}
                </span>
              ); })()}
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

function ProductInfo({ product }: { product: ServerProduct }) {
  const {
    t,
    formatCurrency,
    translateProductDescription,
    translateProductName,
    translateValue,
  } = useLanguage();
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const inStock = product.stock > 0;

  function handleAddToBag() {
    add({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: bagImage(product.brand),
    });
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
        {translateProductName(product.id, product.name)}
      </h1>

      {/* Price + stock */}
      <div className="mt-5 flex items-baseline gap-3">
        <span className="text-3xl font-semibold tracking-tight text-zinc-950">
          {formatCurrency(product.price)}
        </span>
        <span
          className={`text-[10px] font-semibold uppercase tracking-widest ${inStock ? "text-emerald-600" : "text-zinc-400"}`}
        >
          {inStock ? t("product.inStock") : t("product.outOfStock")}
        </span>
      </div>

      <div className="my-6 h-px bg-zinc-100" />

      {/* Description */}
      <p className="text-sm leading-relaxed text-zinc-500">
        {translateProductDescription(product.id, product.description)}
      </p>

      {/* Details */}
      <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-xs">
        {[
          [t("product.brand"), product.brand],
          [t("product.category"), translateValue("category", product.category || "Bags")],
          [t("product.material"), product.material ? translateValue("material", product.material) : t("product.premiumLeather")],
          [t("product.color"), product.color ? translateValue("color", product.color) : "—"],
        ].map(([dt, dd]) => (
          <div key={dt}>
            <dt className="font-semibold uppercase tracking-widest text-zinc-400">{dt}</dt>
            <dd className="mt-0.5 text-zinc-700">{dd}</dd>
          </div>
        ))}
      </dl>

      <div className="my-6 h-px bg-zinc-100" />

      {/* CTAs */}
      <div className="flex gap-3">
        <button
          type="button"
          disabled={!inStock}
          onClick={handleAddToBag}
          className={[
            "flex h-14 flex-1 items-center justify-center gap-2 text-xs font-semibold uppercase tracking-widest transition",
            inStock
              ? added
                ? "bg-zinc-600 text-white"
                : "bg-zinc-950 text-white hover:bg-zinc-800"
              : "cursor-not-allowed bg-zinc-100 text-zinc-400",
          ].join(" ")}
        >
          {added ? (
            <><CheckIcon /> {t("product.added")}</>
          ) : inStock ? (
            t("product.addToBag")
          ) : (
            t("product.outOfStock")
          )}
        </button>

        <button
          type="button"
          onClick={() => setWishlist((v) => !v)}
          aria-label={wishlist ? t("product.removeWishlist") : t("product.addWishlist")}
          className="flex h-14 w-14 items-center justify-center border border-zinc-200 text-zinc-500 transition hover:border-zinc-950 hover:text-zinc-950"
        >
          <HeartIcon filled={wishlist} />
        </button>
      </div>

      <Link
        to="/product/c1"
        className="mt-3 flex h-12 w-full items-center justify-center border border-zinc-200 text-xs font-semibold uppercase tracking-widest text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
      >
        {t("product.bookStyleConsult")}
      </Link>

      {/* Trust signals */}
      <div className="mt-8 grid grid-cols-3 gap-3 border-t border-zinc-100 pt-6">
        {[
          { icon: ShieldIcon, label: t("product.authenticity"), sub: t("product.guaranteed") },
          { icon: TruckIcon, label: t("product.freeShipping"), sub: t("product.over100") },
          { icon: ReturnIcon, label: t("product.easyReturns"), sub: t("product.days30") },
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
            title: t("product.productDetails"),
            body: t("product.productDetailsBody"),
          },
          {
            title: t("product.shippingReturns"),
            body: t("product.shippingReturnsBody"),
          },
          {
            title: t("product.authenticity"),
            body: t("product.authenticityBody"),
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

function getBadge(product: ServerProduct) {
  if (product.status === "new") return { labelKey: "product.badgeNew", style: "bg-white text-zinc-950 border border-zinc-200" };
  if (product.status === "featured") return { labelKey: "product.badgeFeatured", style: "bg-[#c8a96e] text-white" };
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
