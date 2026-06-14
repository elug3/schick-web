import { useCallback, useSyncExternalStore } from "react";
import {
  addToCart,
  cartEventName,
  clearCart,
  getCart,
  getCartCount,
  getCartTotals,
  removeFromCart,
  updateQuantity,
  type CartItem,
  type CartTotals,
} from "./cart";

function subscribe(onStoreChange: () => void): () => void {
  const event = cartEventName();
  window.addEventListener(event, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(event, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getServerSnapshot(): CartItem[] {
  return [];
}

export function useCart() {
  const items = useSyncExternalStore(
    subscribe,
    getCart,
    getServerSnapshot
  );

  const count = useSyncExternalStore(
    subscribe,
    getCartCount,
    () => 0
  );

  const add = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      addToCart(item);
    },
    []
  );

  const setQuantity = useCallback(
    (productId: string, size: string | undefined, quantity: number) => {
      updateQuantity(productId, size, quantity);
    },
    []
  );

  const remove = useCallback((productId: string, size?: string) => {
    removeFromCart(productId, size);
  }, []);

  const clear = useCallback(() => {
    clearCart();
  }, []);

  const totals = useCallback(
    (promoCode?: string): CartTotals => getCartTotals(promoCode),
    [items]
  );

  return {
    items,
    count,
    add,
    setQuantity,
    remove,
    clear,
    totals,
  };
}
