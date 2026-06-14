import { Link, useLocation } from "react-router";
import { formatPrice } from "../lib/cart";

interface ConfirmationState {
  orderNumber?: string;
  total?: number;
  email?: string;
}

export function meta() {
  return [
    { title: "Order Confirmed — Schick" },
    {
      name: "description",
      content: "Your Schick order has been placed successfully.",
    },
  ];
}

export default function CheckoutConfirmationPage() {
  const location = useLocation();
  const state = (location.state ?? {}) as ConfirmationState;

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 text-center md:py-24">
        <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-full border border-zinc-200">
          <CheckIcon />
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c8a96e]">
          Order Confirmed
        </p>
        <h1
          className="mt-4 text-4xl font-light text-zinc-950 md:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Thank You
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-zinc-400">
          {state.email
            ? `A confirmation email will be sent to ${state.email}.`
            : "A confirmation email will be sent shortly."}
        </p>

        {(state.orderNumber || state.total != null) && (
          <dl className="mx-auto mt-10 inline-grid gap-4 border border-zinc-100 bg-zinc-50/50 px-8 py-6 text-left text-sm md:min-w-[320px]">
            {state.orderNumber && (
              <div className="flex justify-between gap-8">
                <dt className="text-zinc-400">Order</dt>
                <dd className="font-medium text-zinc-950">{state.orderNumber}</dd>
              </div>
            )}
            {state.total != null && (
              <div className="flex justify-between gap-8">
                <dt className="text-zinc-400">Total</dt>
                <dd className="font-semibold text-zinc-950">
                  {formatPrice(state.total)}
                </dd>
              </div>
            )}
          </dl>
        )}

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex h-12 min-w-[200px] items-center justify-center bg-zinc-950 px-8 text-[10px] font-semibold uppercase tracking-widest text-white transition hover:bg-zinc-800"
          >
            Continue Shopping
          </Link>
          <Link
            to="/history"
            className="inline-flex h-12 min-w-[200px] items-center justify-center border border-zinc-200 px-8 text-[10px] font-semibold uppercase tracking-widest text-zinc-600 transition hover:border-zinc-950 hover:text-zinc-950"
          >
            View Orders
          </Link>
        </div>
      </div>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" className="size-7 text-zinc-950" viewBox="0 0 24 24" fill="none">
      <path d="M20 7 10 17l-5-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
