import { useState } from "react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "./app.css";
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
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
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
    <div className="min-h-screen overflow-x-hidden bg-white pb-20 text-zinc-950 md:pb-0">
      <AnnouncementBar />
      <TopNav />
      {/* announcement 32px + logo row 56px = 88px mobile; + nav row ~36px = 124px desktop */}
      <div className="pt-[5.5rem] md:pt-[7.75rem]">
        <Outlet />
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}

function AnnouncementBar() {
  return (
    <div className="fixed inset-x-0 top-0 z-50 flex items-center justify-center bg-zinc-950 px-4 py-2">
      <p className="text-center text-[9px] uppercase tracking-[0.12em] text-white/70 sm:text-[10px] sm:tracking-[0.18em]">
        Free shipping on orders over $100&ensp;·&ensp;Code&ensp;
        <span className="font-medium text-[#c8a96e] tracking-widest">SUMMER30</span>
        &ensp;—&ensp;30% off
      </p>
    </div>
  );
}

const navItems = [
  { label: "Home", to: "/", icon: HomeIcon },
  { label: "Bag", to: "/cart", icon: BagIcon },
  { label: "Profile", to: "/profile", icon: ProfileIcon },
];

const desktopNavLinks = [
  {
    label: "Product Type",
    to: "/category/product-type",
    items: [
      { label: "Totes", to: "/category/product-type/totes" },
      { label: "Shoulder Bags", to: "/category/product-type/shoulder-bags" },
      { label: "Crossbody", to: "/category/product-type/crossbody" },
      { label: "Clutches", to: "/category/product-type/clutches" },
      { label: "Mini Bags", to: "/category/product-type/mini-bags" },
      { label: "Backpacks", to: "/category/product-type/backpacks" },
      { label: "Wallets", to: "/category/product-type/wallets" },
    ],
  },
  {
    label: "Brand",
    to: "/category/brand",
    items: [
      { label: "Gucci", to: "/category/brand/gucci", image: "/brands/gucci.svg" },
      { label: "Louis Vuitton", to: "/category/brand/louis-vuitton", image: "/brands/louis-vuitton.svg" },
      { label: "Chanel", to: "/category/brand/chanel", image: "/brands/chanel.svg" },
      { label: "Prada", to: "/category/brand/prada", image: "/brands/prada.svg" },
      { label: "Hermès", to: "/category/brand/hermes", image: "/brands/hermes.svg" },
      { label: "Dior", to: "/category/brand/dior", image: "/brands/dior.svg" },
      { label: "Bottega Veneta", to: "/category/brand/bottega-veneta", image: "/brands/bottega-veneta.svg" },
      { label: "Coach", to: "/category/brand/coach", image: "/brands/coach.svg" },
    ],
  },
  {
    label: "Style",
    to: "/category/style",
    items: [
      { label: "Casual", to: "/category/style/casual" },
      { label: "Evening", to: "/category/style/evening" },
      { label: "Business", to: "/category/style/business" },
      { label: "Weekend", to: "/category/style/weekend" },
      { label: "Statement", to: "/category/style/statement" },
    ],
  },
  {
    label: "Family",
    to: "/category/family",
    items: [
      { label: "Women", to: "/category/family/women" },
      { label: "Men", to: "/category/family/men" },
      { label: "Kids", to: "/category/family/kids" },
      { label: "Unisex", to: "/category/family/unisex" },
    ],
  },
];

function TopNav() {
  const { count } = useCart();
  const [activeNav, setActiveNav] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <header
      className="fixed inset-x-0 top-8 z-40 bg-white"
      onMouseLeave={() => setActiveNav(null)}
    >
      {/* Row 1 — Logo (center) + Icons (right) */}
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10">
        <div className="flex justify-start">
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="inline-flex size-10 items-center justify-center rounded text-zinc-500 transition hover:text-zinc-950 md:hidden"
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>

        <NavLink
          to="/"
          onClick={closeMobileMenu}
          className="justify-self-center text-sm font-medium uppercase tracking-[0.4em] text-zinc-950 transition hover:opacity-70"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Schick
        </NavLink>

        <div className="flex justify-end gap-0.5">
          <NavLink
            to="/cart"
            aria-label="Shopping bag"
            onClick={closeMobileMenu}
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
            aria-label="Profile"
            onClick={closeMobileMenu}
            className="rounded p-2 text-zinc-400 transition hover:text-zinc-950"
          >
            <ProfileIcon />
          </NavLink>
        </div>
      </div>

      {/* Row 2 — Nav links below logo (desktop only) */}
      <nav
        aria-label="Main"
        className="hidden border-b border-zinc-100 md:flex items-center justify-center gap-7 pb-3"
      >
        {desktopNavLinks.map(({ label, to }) => (
          <NavLink
            key={label}
            to={to}
            onMouseEnter={() => setActiveNav(label)}
            className={({ isActive }) =>
              [
                "whitespace-nowrap text-[11px] uppercase tracking-[0.15em] transition-colors",
                isActive || activeNav === label ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-950",
              ].join(" ")
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Mega dropdown — half viewport width, centered */}
      {activeNav && (() => {
        const activeGroup = desktopNavLinks.find((n) => n.label === activeNav);
        const isBrand = activeNav === "Brand";
        return (
          <div className="absolute inset-x-0 flex justify-center border-b border-zinc-100 bg-white shadow-md">
            <div className="w-[50vw] px-10 py-8">
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-300">
                {activeNav}
              </p>
              <div className={isBrand ? "grid grid-cols-4 gap-4" : "grid grid-cols-4 gap-x-6 gap-y-3"}>
                {activeGroup?.items.map((item) =>
                  isBrand && "image" in item ? (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={() => setActiveNav(null)}
                      aria-label={item.label}
                      className="group flex items-center justify-center border border-zinc-100 bg-zinc-50 p-4 transition hover:border-zinc-300"
                    >
                      <img
                        src={(item as { image: string }).image}
                        alt={item.label}
                        className="h-7 w-auto object-contain opacity-60 transition group-hover:opacity-100"
                      />
                    </NavLink>
                  ) : (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      onClick={() => setActiveNav(null)}
                      className="text-[11px] uppercase tracking-[0.12em] text-zinc-400 transition hover:text-zinc-950 py-1"
                    >
                      {item.label}
                    </NavLink>
                  )
                )}
              </div>
            </div>
          </div>
        );
      })()}
      {mobileMenuOpen && <MobileMenu onNavigate={closeMobileMenu} />}
    </header>
  );
}

function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div
      id="mobile-menu"
      className="fixed inset-x-0 bottom-0 top-[5.5rem] z-30 overflow-y-auto border-t border-zinc-100 bg-white px-5 pb-28 pt-6 shadow-2xl md:hidden"
    >
      <nav aria-label="Mobile shop menu" className="mx-auto max-w-md">
        <div className="mb-6 grid grid-cols-3 gap-2">
          {navItems.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  "flex h-16 flex-col items-center justify-center gap-1 border text-[10px] font-semibold uppercase tracking-widest transition",
                  isActive
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-100 text-zinc-500 hover:border-zinc-300 hover:text-zinc-950",
                ].join(" ")
              }
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="space-y-7">
          {desktopNavLinks.map((group) => (
            <section key={group.label}>
              <NavLink
                to={group.to}
                onClick={onNavigate}
                className="mb-3 block text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-950"
              >
                {group.label}
              </NavLink>
              <div className="grid grid-cols-2 gap-2">
                {group.items.map((item) => (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    onClick={onNavigate}
                    className="flex min-h-12 items-center justify-center border border-zinc-100 px-3 py-2 text-center text-[11px] uppercase tracking-[0.12em] text-zinc-500 transition hover:border-zinc-300 hover:text-zinc-950"
                  >
                    {"image" in item ? (
                      <img
                        src={(item as { image: string }).image}
                        alt={item.label}
                        className="max-h-6 max-w-24 object-contain opacity-70"
                      />
                    ) : (
                      item.label
                    )}
                  </NavLink>
                ))}
              </div>
            </section>
          ))}
        </div>
      </nav>
    </div>
  );
}

function Footer() {
  return (
    <footer className="hidden border-t border-zinc-100 bg-white px-4 py-16 md:block md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1">
            <p
              className="mb-3 text-2xl font-light tracking-[0.35em] uppercase text-zinc-950"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Schick
            </p>
            <p className="text-xs leading-relaxed text-zinc-400">
              Authentic luxury bags from the world's most coveted brands, curated for the modern wardrobe.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-950">
              Shop
            </p>
            <ul className="space-y-2">
              {desktopNavLinks.map(({ label, to }) => (
                <li key={label}>
                  <NavLink
                    to={to}
                    className="text-xs text-zinc-400 transition hover:text-zinc-950"
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-950">
              Services
            </p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li><NavLink to="/product/c1" className="hover:text-zinc-950 transition">Style Consultation</NavLink></li>
              <li><NavLink to="/history" className="hover:text-zinc-950 transition">Order History</NavLink></li>
              <li><NavLink to="/profile" className="hover:text-zinc-950 transition">My Account</NavLink></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-950">
              Info
            </p>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li>Shipping &amp; Returns</li>
              <li>Authenticity Guarantee</li>
              <li>Privacy Policy</li>
              <li>Terms &amp; Conditions</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-zinc-100 pt-8">
          <p className="text-[11px] text-zinc-300">© 2026 Schick. All rights reserved.</p>
          <p className="text-[11px] text-zinc-300">Premium Bags · Authenticated · Curated</p>
        </div>
      </div>
    </footer>
  );
}

function BottomNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-100 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-3 gap-1">
        {navItems.map(({ label, to, icon: Icon }) => (
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
            <span>{label}</span>
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

function MenuIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
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

export function ErrorBoundary({ error }: { error: unknown }) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
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
