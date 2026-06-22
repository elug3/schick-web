import { useCallback, useState } from "react";
import { type CartItem } from "./cart";
import { useCart } from "./useCart";

export const CART_MUTATION_DELAY_MS = 800;

export type CartMutationAction = "increase" | "decrease" | "remove" | "add";

export function cartItemKey(productId: string, size?: string): string {
  return `${productId}:${size ?? ""}`;
}

export function useCartMutation() {
  const { add, setQuantity, remove } = useCart();
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<CartMutationAction | null>(
    null
  );

  const isPending = useCallback(
    (productId: string, size?: string) =>
      pendingKey === cartItemKey(productId, size),
    [pendingKey]
  );

  const getAction = useCallback(
    (productId: string, size?: string) =>
      isPending(productId, size) ? pendingAction : null,
    [isPending, pendingAction]
  );

  const withDelay = useCallback(
    async (key: string, action: CartMutationAction, fn: () => void) => {
      if (pendingKey) return;
      setPendingKey(key);
      setPendingAction(action);
      await new Promise((resolve) => setTimeout(resolve, CART_MUTATION_DELAY_MS));
      fn();
      setPendingKey(null);
      setPendingAction(null);
    },
    [pendingKey]
  );

  const increaseQuantity = useCallback(
    (productId: string, size: string | undefined, currentQuantity: number) =>
      withDelay(cartItemKey(productId, size), "increase", () =>
        setQuantity(productId, size, currentQuantity + 1)
      ),
    [setQuantity, withDelay]
  );

  const decreaseQuantity = useCallback(
    (productId: string, size: string | undefined, currentQuantity: number) =>
      withDelay(cartItemKey(productId, size), "decrease", () =>
        setQuantity(productId, size, currentQuantity - 1)
      ),
    [setQuantity, withDelay]
  );

  const removeItem = useCallback(
    (productId: string, size?: string) =>
      withDelay(cartItemKey(productId, size), "remove", () =>
        remove(productId, size)
      ),
    [remove, withDelay]
  );

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity"> & { quantity?: number }) =>
      withDelay(cartItemKey(item.productId, item.size), "add", () => add(item)),
    [add, withDelay]
  );

  return {
    pendingKey,
    pendingAction,
    isPending,
    getAction,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    addItem,
  };
}
