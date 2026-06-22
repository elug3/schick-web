import { useEffect, useState } from "react";
import { getOriginalPrice, getSalePrice } from "../lib/cart";
import { useLanguage } from "../lib/i18n";

const PRICE_LOAD_DELAY_MS = 800;

export function ProductPrice({
  price,
  size = "sm",
}: {
  price: number;
  size?: "sm" | "lg";
}) {
  const { formatCurrency, t } = useLanguage();
  const [ready, setReady] = useState(false);
  const originalPrice = getOriginalPrice(price);
  const salePrice = getSalePrice(price);

  useEffect(() => {
    setReady(false);
    const timer = window.setTimeout(() => setReady(true), PRICE_LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [price]);

  if (!ready) {
    return <PriceLoadingBadge label={t("product.priceLoading")} size={size} />;
  }

  if (size === "lg") {
    return (
      <div className="flex items-baseline gap-3">
        <span className="text-lg font-medium text-red-500 line-through">
          {formatCurrency(originalPrice)}
        </span>
        <span className="text-3xl font-semibold tracking-tight text-zinc-950">
          {formatCurrency(salePrice)}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-1.5 flex items-baseline gap-2">
      <span className="text-sm text-red-500 line-through">
        {formatCurrency(originalPrice)}
      </span>
      <span className="text-sm font-semibold text-zinc-950">
        {formatCurrency(salePrice)}
      </span>
    </div>
  );
}

function PriceLoadingBadge({
  label,
  size,
}: {
  label: string;
  size: "sm" | "lg";
}) {
  const className = [
    "inline-flex items-center gap-2 border border-zinc-200 bg-zinc-50 font-semibold uppercase tracking-widest text-zinc-500",
    size === "lg"
      ? "px-3 py-1.5 text-[10px]"
      : "mt-1.5 px-2 py-0.5 text-[9px]",
  ].join(" ");

  return (
    <span className={className} aria-live="polite" aria-busy="true">
      <span className="size-2 animate-pulse rounded-full bg-[#c8a96e]" />
      {label}
    </span>
  );
}
