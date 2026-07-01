const KEY = "dupli1_cart";
export const FREE_SHIPPING_THRESHOLD = 100;
export const PROMO_CODE = "SUMMER30";
export const PROMO_DISCOUNT = 0.3;

export function getSalePrice(price: number): number {
  return Math.round(price * (1 - PROMO_DISCOUNT));
}

// Memoize getCart so useSyncExternalStore gets a stable reference when data hasn't changed
let _cachedJson = "";
let _cachedCart: CartItem[] = [];

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  size?: string;
  quantity: number;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoApplied: boolean;
}

const CART_EVENT = "dupli1-cart-update";

function emitCartUpdate(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_EVENT));
  }
}

export function cartEventName(): string {
  return CART_EVENT;
}

export function getCart(): CartItem[] {
  try {
    const json = localStorage.getItem(KEY) ?? "[]";
    if (json !== _cachedJson) {
      _cachedJson = json;
      _cachedCart = JSON.parse(json) as CartItem[];
    }
    return _cachedCart;
  } catch {
    return _cachedCart;
  }
}

function saveCart(items: CartItem[]): void {
  const json = JSON.stringify(items);
  _cachedJson = json;
  _cachedCart = items;
  localStorage.setItem(KEY, json);
  emitCartUpdate();
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

export function addToCart(
  item: Omit<CartItem, "quantity"> & { quantity?: number }
): void {
  try {
    const qty = item.quantity ?? 1;
    const cart = getCart();
    const key = `${item.productId}:${item.size ?? ""}`;
    const idx = cart.findIndex(
      (c) => `${c.productId}:${c.size ?? ""}` === key
    );

    if (idx >= 0) {
      cart[idx] = { ...cart[idx], quantity: cart[idx].quantity + qty };
    } else {
      cart.push({ ...item, quantity: qty });
    }

    saveCart(cart);
  } catch {
    // no-op in SSR
  }
}

export function updateQuantity(
  productId: string,
  size: string | undefined,
  quantity: number
): void {
  try {
    const cart = getCart();
    const key = `${productId}:${size ?? ""}`;
    const idx = cart.findIndex(
      (c) => `${c.productId}:${c.size ?? ""}` === key
    );

    if (idx < 0) return;

    if (quantity <= 0) {
      cart.splice(idx, 1);
    } else {
      cart[idx] = { ...cart[idx], quantity };
    }

    saveCart(cart);
  } catch {
    // no-op in SSR
  }
}

export function removeFromCart(
  productId: string,
  size?: string
): void {
  updateQuantity(productId, size, 0);
}

export function clearCart(): void {
  try {
    _cachedJson = "[]";
    _cachedCart = [];
    localStorage.removeItem(KEY);
    emitCartUpdate();
  } catch {
    // no-op in SSR
  }
}

export function getCartTotals(promoCode?: string): CartTotals {
  const items = getCart();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const promoApplied =
    promoCode?.trim().toUpperCase() === PROMO_CODE && subtotal > 0;
  const discount = promoApplied ? subtotal * PROMO_DISCOUNT : 0;
  const afterDiscount = subtotal - discount;
  const shipping =
    itemCount === 0
      ? 0
      : afterDiscount >= FREE_SHIPPING_THRESHOLD
        ? 0
        : 15;
  const total = afterDiscount + shipping;

  return {
    itemCount,
    subtotal,
    shipping,
    discount,
    total,
    promoApplied,
  };
}

export function formatPrice(amount: number): string {
  return `$${amount.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}
