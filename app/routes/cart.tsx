import { useState } from "react";
import { Link } from "react-router";
import { mockProducts } from "../data/mockProducts";
import {
  formatPrice,
  FREE_SHIPPING_THRESHOLD,
  PROMO_CODE,
  PROMO_DISCOUNT,
} from "../lib/cart";
import { useCart } from "../lib/useCart";

export function meta() {
  return [
    { title: "Shopping Bag — Schick" },
    {
      name: "description",
      content: "Review your selected luxury bags and proceed to checkout.",
    },
  ];
}

export default function CartPage() {
  const { items, setQuantity, remove, totals } = useCart();
  const [promoCode, setPromoCode] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");

  const summary = totals(promoCode);
  const recommendations = mockProducts
    .filter((p) => p.category === "Bag" && p.inStock)
    .slice(0, 8);

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (code === PROMO_CODE) {
      setPromoCode(code);
      setPromoError("");
    } else {
      setPromoCode("");
      setPromoError("Invalid promo code");
    }
  }

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-10 md:py-14">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:text-zinc-950"
        >
          <BackIcon />
          Continue Shopping
        </Link>

        <div className="mb-10 flex flex-col gap-2 md:mb-14 md:flex-row md:items-end md:justify-between">
          <h1
            className="text-4xl font-light tracking-tight text-zinc-950 md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Shopping Bag
          </h1>
          {items.length > 0 && (
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400">
              {summary.itemCount} {summary.itemCount === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyBag recommendations={recommendations} />
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16">
            <section aria-label="Bag items" className="space-y-0">
              {items.map((item) => (
                <article
                  key={`${item.productId}:${item.size ?? ""}`}
                  className="grid grid-cols-[120px_1fr] gap-5 border-b border-zinc-100 py-8 first:pt-0 md:grid-cols-[160px_1fr]"
                >
                  <Link
                    to={`/product/${item.productId}`}
                    className="overflow-hidden bg-zinc-50"
                  >
                    <div className="relative" style={{ paddingBottom: "125%" }}>
                      <img
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  </Link>

                  <div className="flex min-w-0 flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#c8a96e]">
                        {item.brand}
                      </p>
                      <Link
                        to={`/product/${item.productId}`}
                        className="mt-1 block text-lg font-medium leading-snug text-zinc-950 transition hover:opacity-70 md:text-xl"
                      >
                        {item.name}
                      </Link>
                      {item.size && (
                        <p className="mt-2 text-[11px] uppercase tracking-widest text-zinc-400">
                          Size {item.size}
                        </p>
                      )}
                    </div>

                    <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
                      <QuantityControl
                        quantity={item.quantity}
                        onDecrease={() =>
                          setQuantity(
                            item.productId,
                            item.size,
                            item.quantity - 1
                          )
                        }
                        onIncrease={() =>
                          setQuantity(
                            item.productId,
                            item.size,
                            item.quantity + 1
                          )
                        }
                      />

                      <div className="text-right">
                        <p className="text-base font-semibold text-zinc-950">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        {item.quantity > 1 && (
                          <p className="mt-0.5 text-[11px] text-zinc-400">
                            {formatPrice(item.price)} each
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => remove(item.productId, item.size)}
                          className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 underline-offset-4 transition hover:text-zinc-950 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <OrderSummary
                summary={summary}
                promoInput={promoInput}
                promoError={promoError}
                onPromoInputChange={setPromoInput}
                onApplyPromo={applyPromo}
                checkoutHref="/checkout"
                checkoutLabel="Proceed to Checkout"
              />
            </aside>
          </div>
        )}

        {items.length > 0 && (
          <Recommendations
            title="Complete the Look"
            subtitle="Most Viewed"
            products={recommendations.slice(0, 4)}
          />
        )}
      </div>

      <HelpBar />
    </main>
  );
}

function EmptyBag({
  recommendations,
}: {
  recommendations: typeof mockProducts;
}) {
  return (
    <>
      <div className="border-b border-zinc-100 py-16 text-center md:py-24">
        <p
          className="text-3xl font-light text-zinc-950 md:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your bag is empty.
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
          Discover our curated selection of authenticated luxury bags from the
          world&apos;s most coveted maisons.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex h-12 items-center bg-zinc-950 px-10 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
        >
          Shop Bags
        </Link>
      </div>

      <Recommendations
        title="Pairs Well With"
        subtitle="Most Viewed"
        products={recommendations}
      />
    </>
  );
}

function Recommendations({
  title,
  subtitle,
  products,
}: {
  title: string;
  subtitle: string;
  products: typeof mockProducts;
}) {
  return (
    <section className="mt-16 border-t border-zinc-100 pt-12 md:mt-20 md:pt-16">
      <div className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
          {subtitle}
        </p>
        <h2
          className="mt-2 text-2xl font-light text-zinc-950 md:text-3xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/${product.id}`}
            className="group"
          >
            <div
              className="relative mb-3 overflow-hidden bg-zinc-50"
              style={{ paddingBottom: "120%" }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
            </div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {product.brand}
            </p>
            <p className="mt-0.5 text-sm font-medium text-zinc-950">
              {product.name}
            </p>
            <p className="mt-1.5 text-sm font-semibold text-zinc-950">
              {formatPrice(product.price)}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function OrderSummary({
  summary,
  promoInput,
  promoError,
  onPromoInputChange,
  onApplyPromo,
  checkoutHref,
  checkoutLabel,
  disabled = false,
}: {
  summary: ReturnType<ReturnType<typeof useCart>["totals"]>;
  promoInput: string;
  promoError: string;
  onPromoInputChange: (value: string) => void;
  onApplyPromo: () => void;
  checkoutHref: string;
  checkoutLabel: string;
  disabled?: boolean;
}) {
  const amountToFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - (summary.subtotal - summary.discount)
  );

  return (
    <div className="border border-zinc-100 bg-zinc-50/50 p-6 md:p-8">
      <h2 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-950">
        Order Summary
      </h2>

      <dl className="mt-6 space-y-4 text-sm">
        <div className="flex justify-between text-zinc-600">
          <dt>Subtotal</dt>
          <dd className="font-medium text-zinc-950">
            {formatPrice(summary.subtotal)}
          </dd>
        </div>
        {summary.promoApplied && (
          <div className="flex justify-between text-emerald-700">
            <dt>Promo ({PROMO_CODE})</dt>
            <dd className="font-medium">
              −{formatPrice(summary.discount)}
            </dd>
          </div>
        )}
        <div className="flex justify-between text-zinc-600">
          <dt>Shipping</dt>
          <dd className="font-medium text-zinc-950">
            {summary.shipping === 0 ? "Complimentary" : formatPrice(summary.shipping)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-zinc-200 pt-4 text-base">
          <dt className="font-semibold uppercase tracking-widest text-zinc-950">
            Total
          </dt>
          <dd className="text-xl font-semibold text-zinc-950">
            {formatPrice(summary.total)}
          </dd>
        </div>
      </dl>

      {summary.itemCount > 0 && amountToFreeShipping > 0 && (
        <p className="mt-4 text-[11px] leading-relaxed text-zinc-400">
          Add {formatPrice(amountToFreeShipping)} more for complimentary
          shipping.
        </p>
      )}

      <div className="mt-6">
        <label
          htmlFor="promo-code"
          className="text-[10px] font-semibold uppercase tracking-widest text-zinc-600"
        >
          Promo Code
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="promo-code"
            type="text"
            value={promoInput}
            onChange={(e) => onPromoInputChange(e.target.value)}
            placeholder={PROMO_CODE}
            className="h-11 flex-1 border border-zinc-200 bg-white px-3 text-sm text-zinc-950 outline-none transition focus:border-zinc-950"
          />
          <button
            type="button"
            onClick={onApplyPromo}
            className="h-11 border border-zinc-950 px-4 text-[10px] font-semibold uppercase tracking-widest text-zinc-950 transition hover:bg-zinc-950 hover:text-white"
          >
            Apply
          </button>
        </div>
        {promoError && (
          <p className="mt-2 text-[11px] text-red-600">{promoError}</p>
        )}
        {summary.promoApplied && (
          <p className="mt-2 text-[11px] text-emerald-700">
            {Math.round(PROMO_DISCOUNT * 100)}% off applied.
          </p>
        )}
      </div>

      {disabled ? (
        <button
          type="button"
          disabled
          className="mt-6 flex h-14 w-full cursor-not-allowed items-center justify-center bg-zinc-200 text-[10px] font-semibold uppercase tracking-widest text-zinc-400"
        >
          {checkoutLabel}
        </button>
      ) : (
        <Link
          to={checkoutHref}
          className="mt-6 flex h-14 w-full items-center justify-center bg-zinc-950 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
        >
          {checkoutLabel}
        </Link>
      )}

      <ul className="mt-6 space-y-2 border-t border-zinc-200 pt-6 text-[11px] text-zinc-400">
        <li className="flex items-center gap-2">
          <ShieldIcon />
          Authenticity guaranteed on every order
        </li>
        <li className="flex items-center gap-2">
          <TruckIcon />
          Complimentary shipping over {formatPrice(FREE_SHIPPING_THRESHOLD)}
        </li>
        <li className="flex items-center gap-2">
          <ReturnIcon />
          30-day returns on eligible items
        </li>
      </ul>
    </div>
  );
}

function QuantityControl({
  quantity,
  onDecrease,
  onIncrease,
}: {
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <div className="inline-flex items-center border border-zinc-200">
      <button
        type="button"
        onClick={onDecrease}
        aria-label="Decrease quantity"
        className="flex h-10 w-10 items-center justify-center text-zinc-500 transition hover:text-zinc-950"
      >
        <MinusIcon />
      </button>
      <span className="flex h-10 w-10 items-center justify-center text-sm font-medium text-zinc-950">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Increase quantity"
        className="flex h-10 w-10 items-center justify-center text-zinc-500 transition hover:text-zinc-950"
      >
        <PlusIcon />
      </button>
    </div>
  );
}

function HelpBar() {
  return (
    <section className="mt-16 border-t border-zinc-100 bg-zinc-50 px-4 py-12 md:mt-20 md:px-10">
      <div className="mx-auto max-w-7xl text-center">
        <p
          className="text-xl font-light text-zinc-950 md:text-2xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Need assistance?
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          Contact the Schick Client Services team for personal shopping support.
        </p>
        <a
          href="mailto:concierge@schick.com"
          className="mt-4 inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-950 underline-offset-4 hover:underline"
        >
          concierge@schick.com
        </a>
      </div>
    </section>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg aria-hidden="true" className="size-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none">
      <path d="M12 3 4 7v5c0 5.25 3.5 10.15 8 11.25C16.5 22.15 20 17.25 20 12V7l-8-4Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg aria-hidden="true" className="size-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none">
      <path d="M5 17H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v2m0 0h3l3 4v4h-2m-4-6H14m0 0v6m0-6h7m-7 6H8m12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-12 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg aria-hidden="true" className="size-4 shrink-0 text-zinc-400" viewBox="0 0 24 24" fill="none">
      <path d="M4 12a8 8 0 1 0 2.35-5.65M4 5v5h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
