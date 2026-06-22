import { useState } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";
import { NotFoundPage } from "./components/not-found";
import { LanguageProvider, useLanguage, type LanguageCode } from "./lib/i18n";
import { useCart } from "./lib/useCart";

export const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Noto+Sans+KR:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-white pb-28 text-zinc-950 md:pb-0">
        <AnnouncementBar />
        <TopNav />
        {/* announcement 32px + logo row 56px = 88px mobile; + nav row ~36px = 124px desktop */}
        <div className="pt-[5.5rem] md:pt-[7.75rem]">
          <Outlet />
        </div>
        <Footer />
        <BottomNav />
      </div>
    </LanguageProvider>
  );
}

function AnnouncementBar() {
  const { t } = useLanguage();

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center bg-zinc-950 px-4 py-2">
      <p className="text-center text-[10px] tracking-[0.18em] text-white/70 uppercase">
        {t("announcement.freeShipping")}&ensp;·&ensp;{t("announcement.code")}&ensp;
        <span className="font-medium text-[#c8a96e] tracking-widest">SUMMER30</span>
        &ensp;—&ensp;{t("announcement.discount")}
      </p>
    </div>
  );
}

const navItems = [
  { labelKey: "nav.home", to: "/", icon: HomeIcon },
  { labelKey: "nav.bag", to: "/cart", icon: BagIcon },
  { labelKey: "nav.profile", to: "/profile", icon: ProfileIcon },
];

const desktopNavLinks = [
  {
    id: "productType",
    labelKey: "nav.productType",
    to: "/category/product-type/handbags",
    items: [
      { labelKey: "home.categoryBags", to: "/category/product-type/handbags" },
      { labelKey: "category.totes", to: "/category/product-type/totes" },
      { labelKey: "category.shoulderBags", to: "/category/product-type/shoulder-bags" },
      { labelKey: "category.crossbody", to: "/category/product-type/crossbody" },
      { labelKey: "category.miniBags", to: "/category/product-type/mini-bags" },
    ],
  },
  {
    id: "brand",
    labelKey: "nav.brand",
    to: "/category/brand/louis-vuitton",
    items: [
      { label: "Louis Vuitton", to: "/category/brand/louis-vuitton", image: "/brands/louis-vuitton.svg" },
      { label: "Miu Miu", to: "/category/brand/miu-miu", image: "/brands/prada.svg" },
      { label: "Balenciaga", to: "/category/brand/balenciaga", image: "/brands/gucci.svg" },
      { label: "Hermès", to: "/category/brand/hermes", image: "/brands/hermes.svg" },
    ],
  },
  {
    id: "style",
    labelKey: "nav.style",
    to: "/category/style",
    items: [
      { labelKey: "category.casual", to: "/category/style/casual" },
      { labelKey: "category.evening", to: "/category/style/evening" },
      { labelKey: "category.business", to: "/category/style/business" },
      { labelKey: "category.weekend", to: "/category/style/weekend" },
      { labelKey: "category.statement", to: "/category/style/statement" },
    ],
  },
  {
    id: "family",
    labelKey: "nav.family",
    to: "/category/family",
    items: [
      { labelKey: "category.women", to: "/category/family/women" },
      { labelKey: "category.men", to: "/category/family/men" },
      { labelKey: "category.kids", to: "/category/family/kids" },
      { labelKey: "category.unisex", to: "/category/family/unisex" },
    ],
  },
];

function TopNav() {
  const { t } = useLanguage();
  const { count } = useCart();
  const [activeNav, setActiveNav] = useState<string | null>(null);

  return (
    <header
      className="fixed inset-x-0 top-8 z-40 bg-white"
      onMouseLeave={() => setActiveNav(null)}
    >
      {/* Row 1 — Logo (center) + Icons (right) */}
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10">
        <div />

        <NavLink
          to="/"
          data-brand-logo
          className="justify-self-center text-sm font-medium uppercase tracking-[0.4em] text-zinc-950 transition hover:opacity-70"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Schick
        </NavLink>

        <div className="flex justify-end gap-0.5">
          <LanguageSelector />
          <NavLink
            to="/cart"
            aria-label={t("nav.shoppingBag")}
            className="relative rounded p-2 text-zinc-400 transition hover:text-zinc-950"
          >
            <BagIcon />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center bg-zinc-950 text-[9px] font-semibold text-white">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </NavLink>
          <NavLink
            to="/profile"
            aria-label={t("nav.profile")}
            className="rounded p-2 text-zinc-400 transition hover:text-zinc-950"
          >
            <ProfileIcon />
          </NavLink>
        </div>
      </div>

      {/* Row 2 — Nav links below logo (desktop only) */}
      <nav
        aria-label={t("nav.main")}
        className="hidden border-b border-zinc-100 md:flex items-center justify-center gap-7 pb-3"
      >
        {desktopNavLinks.map(({ id, labelKey, to }) => (
          <NavLink
            key={id}
            to={to}
            onMouseEnter={() => setActiveNav(id)}
            className={({ isActive }) =>
              [
                "whitespace-nowrap text-[11px] uppercase tracking-[0.15em] transition-colors",
                isActive || activeNav === id ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-950",
              ].join(" ")
            }
          >
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>

      {/* Mega dropdown — half viewport width, centered */}
      {activeNav && (() => {
        const activeGroup = desktopNavLinks.find((n) => n.id === activeNav);
        const isBrand = activeNav === "brand";
        return (
          <div className="absolute inset-x-0 flex justify-center border-b border-zinc-100 bg-white shadow-md">
            <div className="w-[50vw] px-10 py-8">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-300">
                {activeGroup ? t(activeGroup.labelKey) : ""}
              </p>
              <div className={isBrand ? "grid grid-cols-4 gap-4" : "grid grid-cols-4 gap-x-6 gap-y-3"}>
                {activeGroup?.items.map((item) => {
                  const label = "labelKey" in item ? t(item.labelKey) : item.label;
                  return (
                  isBrand && "image" in item ? (
                    <NavLink
                      key={label}
                      to={item.to}
                      onClick={() => setActiveNav(null)}
                      aria-label={label}
                      className="group flex items-center justify-center border border-zinc-100 bg-zinc-50 p-4 transition hover:border-zinc-300"
                    >
                      <img
                        src={(item as { image: string }).image}
                        alt={label}
                        className="h-7 w-auto object-contain opacity-60 transition group-hover:opacity-100"
                      />
                    </NavLink>
                  ) : (
                    <NavLink
                      key={label}
                      to={item.to}
                      onClick={() => setActiveNav(null)}
                      className="text-[11px] uppercase tracking-[0.12em] text-zinc-400 transition hover:text-zinc-950 py-1"
                    >
                      {label}
                    </NavLink>
                  )
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </header>
  );
}

function LanguageSelector({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const { language, languages, setLanguage, t } = useLanguage();
  const isMobile = variant === "mobile";

  return (
    <label
      className={[
        "items-center rounded text-zinc-400 transition hover:text-zinc-950",
        isMobile
          ? "inline-flex gap-2 border border-zinc-100 bg-zinc-50 px-3 py-1.5"
          : "mr-1 hidden gap-1 p-1 sm:flex",
      ].join(" ")}
    >
      <span className="sr-only">{t("language.label")}</span>
      <GlobeIcon />
      <select
        value={language}
        onChange={(event) => setLanguage(event.target.value as LanguageCode)}
        aria-label={t("language.label")}
        className={[
          "cursor-pointer bg-transparent font-semibold uppercase outline-none",
          isMobile ? "text-[11px] tracking-[0.08em]" : "text-[10px] tracking-[0.12em]",
        ].join(" ")}
      >
        {languages.map((option) => (
          <option key={option.code} value={option.code}>
            {option.nativeLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="hidden border-t border-zinc-100 bg-white px-4 py-16 md:block md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <p
              data-brand-logo
              className="mb-3 text-2xl font-light tracking-[0.35em] uppercase text-zinc-950"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Schick
            </p>
            <p className="text-xs leading-relaxed text-zinc-400">
              {t("footer.description")}
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-950">
              {t("footer.shop")}
            </p>
            <ul className="space-y-2">
              {desktopNavLinks.map(({ id, labelKey, to }) => (
                <li key={id}>
                  <NavLink
                    to={to}
                    className="text-xs text-zinc-400 transition hover:text-zinc-950"
                  >
                    {t(labelKey)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-950">
              {t("footer.services")}
            </p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><Link to="/category/product-type/handbags" className="hover:text-zinc-950 transition">{t("footer.styleConsultation")}</Link></li>
              <li><NavLink to="/history" className="hover:text-zinc-950 transition">{t("footer.orderHistory")}</NavLink></li>
              <li><NavLink to="/profile" className="hover:text-zinc-950 transition">{t("footer.myAccount")}</NavLink></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-950">
              {t("footer.info")}
            </p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>{t("footer.shippingReturns")}</li>
              <li>{t("footer.authenticityGuarantee")}</li>
              <li>{t("footer.privacyPolicy")}</li>
              <li>{t("footer.termsConditions")}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-zinc-100 pt-8">
          <p className="text-[11px] text-zinc-300">{t("footer.rights")}</p>
          <p className="text-[11px] text-zinc-300">{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}

function BottomNav() {
  const { t } = useLanguage();

  return (
    <nav
      aria-label={t("nav.primary")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-100 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
    >
      <div className="mx-auto mb-2 flex max-w-md justify-center sm:hidden">
        <LanguageSelector variant="mobile" />
      </div>
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {navItems.map(({ labelKey, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              [
                "flex h-12 flex-col items-center justify-center gap-1 rounded-lg text-[10px] font-medium uppercase tracking-widest transition-colors",
                isActive ? "text-zinc-950" : "text-zinc-300 hover:text-zinc-950",
              ].join(" ")
            }
          >
            <Icon />
            <span>{t(labelKey)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────

function HomeIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="m20 20-4.35-4.35M18 11a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 1 0 2.35-5.65M4 5v5h5m3-2v5l3 2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="M6 8h12l-1 13H7L6 8Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.25 2.45 3.35 5.45 3.35 9S14.25 18.55 12 21c-2.25-2.45-3.35-5.45-3.35-9S9.75 5.45 12 3Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

export function ErrorBoundary({ error }: { error: unknown }) {
  const { t } = useLanguage();
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundPage />;
    }

    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? t("notFound.description") : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-24">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && <pre className="w-full overflow-x-auto p-4"><code>{stack}</code></pre>}
    </main>
  );
}
