import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { formatPrice } from "../lib/cart";
import { useCart } from "../lib/useCart";
import { OrderSummary } from "./cart";

export function meta() {
  return [
    { title: "Checkout — Schick" },
    {
      name: "description",
      content: "Complete your Schick order with secure checkout.",
    },
  ];
}

interface FormState {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  delivery: "standard" | "express";
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const initialForm: FormState = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zip: "",
  country: "United States",
  phone: "",
  delivery: "standard",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clear, totals } = useCart();
  const [form, setForm] = useState<FormState>(initialForm);
  const [promoCode, setPromoCode] = useState("");
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const summary = totals(promoCode);
  const expressFee = form.delivery === "express" ? 25 : 0;
  const checkoutTotal = summary.total + expressFee;

  function applyPromo() {
    const code = promoInput.trim().toUpperCase();
    if (code === "SUMMER30") {
      setPromoCode(code);
      setPromoError("");
    } else {
      setPromoCode("");
      setPromoError("Invalid promo code");
    }
  }

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    const required: (keyof FormState)[] = [
      "email",
      "firstName",
      "lastName",
      "address",
      "city",
      "state",
      "zip",
      "phone",
      "cardName",
      "cardNumber",
      "expiry",
      "cvc",
    ];

    for (const field of required) {
      if (!form[field].trim()) {
        next[field] = "Required";
      }
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    clear();
    navigate("/checkout/confirmation", {
      state: {
        orderNumber: `SCK-${Date.now().toString().slice(-8)}`,
        total: checkoutTotal,
        email: form.email,
      },
    });
  }

  if (!mounted) {
    return (
      <main className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-10">
          <div className="h-8 w-48 animate-pulse bg-zinc-100" />
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
        <p
          className="text-3xl font-light text-zinc-950"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Nothing to checkout
        </p>
        <p className="text-sm text-zinc-400">
          Your bag is empty. Add items before proceeding.
        </p>
        <Link
          to="/"
          className="mt-2 inline-flex h-12 items-center bg-zinc-950 px-8 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
        >
          Continue Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-10 md:py-14">
        <Link
          to="/cart"
          className="mb-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400 transition hover:text-zinc-950"
        >
          <BackIcon />
          Back to Bag
        </Link>

        <div className="mb-10 md:mb-14">
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-zinc-400">
            Secure Checkout
          </p>
          <h1
            className="mt-2 text-4xl font-light tracking-tight text-zinc-950 md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Complete Your Order
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16"
        >
          <div className="space-y-12">
            <CheckoutSection step="01" title="Contact">
              <Field
                label="Email"
                id="email"
                type="email"
                value={form.email}
                error={errors.email}
                onChange={(v) => updateField("email", v)}
                autoComplete="email"
              />
              <Field
                label="Phone"
                id="phone"
                type="tel"
                value={form.phone}
                error={errors.phone}
                onChange={(v) => updateField("phone", v)}
                autoComplete="tel"
              />
            </CheckoutSection>

            <CheckoutSection step="02" title="Shipping">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="First Name"
                  id="firstName"
                  value={form.firstName}
                  error={errors.firstName}
                  onChange={(v) => updateField("firstName", v)}
                  autoComplete="given-name"
                />
                <Field
                  label="Last Name"
                  id="lastName"
                  value={form.lastName}
                  error={errors.lastName}
                  onChange={(v) => updateField("lastName", v)}
                  autoComplete="family-name"
                />
              </div>
              <Field
                label="Address"
                id="address"
                value={form.address}
                error={errors.address}
                onChange={(v) => updateField("address", v)}
                autoComplete="street-address"
              />
              <Field
                label="Apartment, suite, etc. (optional)"
                id="apartment"
                value={form.apartment}
                onChange={(v) => updateField("apartment", v)}
                autoComplete="address-line2"
              />
              <div className="grid gap-4 md:grid-cols-3">
                <Field
                  label="City"
                  id="city"
                  value={form.city}
                  error={errors.city}
                  onChange={(v) => updateField("city", v)}
                  autoComplete="address-level2"
                />
                <Field
                  label="State"
                  id="state"
                  value={form.state}
                  error={errors.state}
                  onChange={(v) => updateField("state", v)}
                  autoComplete="address-level1"
                />
                <Field
                  label="ZIP Code"
                  id="zip"
                  value={form.zip}
                  error={errors.zip}
                  onChange={(v) => updateField("zip", v)}
                  autoComplete="postal-code"
                />
              </div>
              <Field
                label="Country"
                id="country"
                value={form.country}
                onChange={(v) => updateField("country", v)}
                autoComplete="country-name"
              />
            </CheckoutSection>

            <CheckoutSection step="03" title="Delivery">
              <div className="space-y-3">
                <DeliveryOption
                  name="delivery"
                  value="standard"
                  checked={form.delivery === "standard"}
                  title="Standard Delivery"
                  subtitle="5–7 business days"
                  price={
                    summary.shipping === 0
                      ? "Complimentary"
                      : formatPrice(summary.shipping)
                  }
                  onChange={() => updateField("delivery", "standard")}
                />
                <DeliveryOption
                  name="delivery"
                  value="express"
                  checked={form.delivery === "express"}
                  title="Express Delivery"
                  subtitle="2–3 business days"
                  price={formatPrice(25)}
                  onChange={() => updateField("delivery", "express")}
                />
              </div>
            </CheckoutSection>

            <CheckoutSection step="04" title="Payment">
              <Field
                label="Name on Card"
                id="cardName"
                value={form.cardName}
                error={errors.cardName}
                onChange={(v) => updateField("cardName", v)}
                autoComplete="cc-name"
              />
              <Field
                label="Card Number"
                id="cardNumber"
                value={form.cardNumber}
                error={errors.cardNumber}
                onChange={(v) => updateField("cardNumber", v)}
                autoComplete="cc-number"
                placeholder="4242 4242 4242 4242"
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Expiry"
                  id="expiry"
                  value={form.expiry}
                  error={errors.expiry}
                  onChange={(v) => updateField("expiry", v)}
                  autoComplete="cc-exp"
                  placeholder="MM / YY"
                />
                <Field
                  label="CVC"
                  id="cvc"
                  value={form.cvc}
                  error={errors.cvc}
                  onChange={(v) => updateField("cvc", v)}
                  autoComplete="cc-csc"
                  placeholder="123"
                />
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-400">
                Your payment details are encrypted. This is a demo checkout —
                no charges will be made.
              </p>
            </CheckoutSection>

            <div className="lg:hidden">
              <MiniBag items={items} total={checkoutTotal} />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex h-14 w-full items-center justify-center bg-zinc-950 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? "Processing…" : `Place Order — ${formatPrice(checkoutTotal)}`}
            </button>
          </div>

          <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
            <div className="mb-6 space-y-4 border-b border-zinc-100 pb-6">
              {items.map((item) => (
                <div
                  key={`${item.productId}:${item.size ?? ""}`}
                  className="flex gap-4"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-zinc-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center bg-zinc-950 text-[10px] text-white">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-400">
                      {item.brand}
                    </p>
                    <p className="truncate text-sm text-zinc-950">{item.name}</p>
                    <p className="mt-1 text-sm font-medium text-zinc-950">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <OrderSummary
              summary={{
                ...summary,
                total: checkoutTotal,
                shipping: summary.shipping + expressFee,
              }}
              promoInput={promoInput}
              promoError={promoError}
              onPromoInputChange={setPromoInput}
              onApplyPromo={applyPromo}
              checkoutHref="#"
              checkoutLabel={
                submitting ? "Processing…" : `Place Order — ${formatPrice(checkoutTotal)}`
              }
              disabled
            />

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 flex h-14 w-full items-center justify-center bg-zinc-950 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? "Processing…" : "Place Order"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}

function CheckoutSection({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-zinc-100 pt-10 first:border-t-0 first:pt-0">
      <div className="mb-6 flex items-baseline gap-4">
        <span className="text-[10px] font-semibold tracking-[0.2em] text-[#c8a96e]">
          {step}
        </span>
        <h2
          className="text-2xl font-light text-zinc-950"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  id,
  value,
  error,
  onChange,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  id: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-[10px] font-semibold uppercase tracking-widest text-zinc-600"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={[
          "h-12 w-full border bg-white px-4 text-sm text-zinc-950 outline-none transition",
          error
            ? "border-red-400 focus:border-red-500"
            : "border-zinc-200 focus:border-zinc-950",
        ].join(" ")}
      />
      {error && <p className="mt-1.5 text-[11px] text-red-600">{error}</p>}
    </div>
  );
}

function DeliveryOption({
  name,
  value,
  checked,
  title,
  subtitle,
  price,
  onChange,
}: {
  name: string;
  value: string;
  checked: boolean;
  title: string;
  subtitle: string;
  price: string;
  onChange: () => void;
}) {
  return (
    <label
      className={[
        "flex cursor-pointer items-center justify-between border px-4 py-4 transition",
        checked
          ? "border-zinc-950 bg-zinc-50"
          : "border-zinc-200 hover:border-zinc-400",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          className="size-4 accent-zinc-950"
        />
        <div>
          <p className="text-sm font-medium text-zinc-950">{title}</p>
          <p className="text-[11px] text-zinc-400">{subtitle}</p>
        </div>
      </div>
      <span className="text-sm font-medium text-zinc-950">{price}</span>
    </label>
  );
}

function MiniBag({
  items,
  total,
}: {
  items: ReturnType<typeof useCart>["items"];
  total: number;
}) {
  return (
    <div className="border border-zinc-100 bg-zinc-50/50 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-950">
        Your Bag ({items.length})
      </p>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li
            key={`${item.productId}:${item.size ?? ""}`}
            className="flex justify-between gap-3 text-sm"
          >
            <span className="truncate text-zinc-600">
              {item.name} × {item.quantity}
            </span>
            <span className="shrink-0 font-medium text-zinc-950">
              {formatPrice(item.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between border-t border-zinc-200 pt-4 text-sm font-semibold text-zinc-950">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 24 24" fill="none">
      <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
