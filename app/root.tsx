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
    <div className="min-h-screen bg-white pb-20 text-zinc-950 md:pb-0">
      <AnnouncementBar />
      <TopNav />
      {/* announcement ~32px + nav h-14 56px = 88px */}
      <div className="pt-[5.5rem]">
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
      <p className="text-center text-[10px] tracking-[0.18em] text-white/70 uppercase">
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
  { label: "All Bags", to: "/" },
  { label: "Gucci", to: "/product/b1" },
  { label: "Louis Vuitton", to: "/product/b2" },
  { label: "Chanel", to: "/product/b3" },
  { label: "Prada", to: "/product/b4" },
  { label: "Coach", to: "/product/b5" },
  { label: "Hermès", to: "/product/b6" },
];

function TopNav() {
  const { count } = useCart();

  return (
    <header className="fixed inset-x-0 top-8 z-40 bg-white">
      {/* 3-column grid: logo | links | icons */}
      <div className="mx-auto grid h-14 max-w-7xl grid-cols-[1fr_auto_1fr] items-center border-b border-zinc-100 px-6 md:px-10">

        {/* Col 1 — Logo (left-aligned) */}
        <NavLink
          to="/"
          className="justify-self-start text-sm font-medium uppercase tracking-[0.4em] text-zinc-950 transition hover:opacity-70"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Schick
        </NavLink>

        {/* Col 2 — All nav links (truly centered) */}
        <nav aria-label="Main" className="hidden items-center gap-7 md:flex">
          {desktopNavLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                [
                  "whitespace-nowrap text-[11px] uppercase tracking-[0.15em] transition-colors",
                  isActive ? "text-zinc-950" : "text-zinc-400 hover:text-zinc-950",
                ].join(" ")
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Col 3 — Icons (right-aligned) */}
        <div className="flex justify-end gap-0.5">
          <NavLink
            to="/cart"
            aria-label="Shopping bag"
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
            className="rounded p-2 text-zinc-400 transition hover:text-zinc-950"
          >
            <ProfileIcon />
          </NavLink>
        </div>
      </div>
    </header>
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
