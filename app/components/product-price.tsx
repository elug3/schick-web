import { getSalePrice } from "../lib/cart";
import { useLanguage } from "../lib/i18n";

export function ProductPrice({
  price,
  size = "sm",
}: {
  price: number;
  size?: "sm" | "lg";
}) {
  const { formatCurrency } = useLanguage();
  const salePrice = getSalePrice(price);

  if (size === "lg") {
    return (
      <div className="flex items-baseline gap-3">
        <span className="text-lg font-medium text-red-500 line-through">
          {formatCurrency(price)}
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
        {formatCurrency(price)}
      </span>
      <span className="text-sm font-semibold text-zinc-950">
        {formatCurrency(salePrice)}
      </span>
    </div>
  );
}
