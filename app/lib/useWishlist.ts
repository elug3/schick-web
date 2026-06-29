import { useCallback, useEffect, useState } from "react";
import {
  addWishlistItem,
  fetchWishlist,
  removeWishlistItem,
  type Bag,
} from "./api";
import { getMe } from "./auth";

interface WishlistState {
  productIds: string[];
  items: Bag[];
  loading: boolean;
  authenticated: boolean | null;
}

export function useWishlist() {
  const [state, setState] = useState<WishlistState>({
    productIds: [],
    items: [],
    loading: true,
    authenticated: null,
  });

  const refresh = useCallback(async () => {
    const user = await getMe();
    if (!user) {
      setState({
        productIds: [],
        items: [],
        loading: false,
        authenticated: false,
      });
      return;
    }

    try {
      const data = await fetchWishlist();
      setState({
        productIds: data.productIds,
        items: data.items,
        loading: false,
        authenticated: true,
      });
    } catch {
      setState({
        productIds: [],
        items: [],
        loading: false,
        authenticated: true,
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const isWishlisted = useCallback(
    (productId: string) => state.productIds.includes(productId),
    [state.productIds]
  );

  const toggle = useCallback(
    async (productId: string): Promise<"added" | "removed" | "auth_required"> => {
      if (!state.authenticated) return "auth_required";

      try {
        if (isWishlisted(productId)) {
          const data = await removeWishlistItem(productId);
          setState((prev) => ({
            ...prev,
            productIds: data.productIds,
            items: data.items,
          }));
          return "removed";
        }

        const data = await addWishlistItem(productId);
        setState((prev) => ({
          ...prev,
          productIds: data.productIds,
          items: data.items,
        }));
        return "added";
      } catch (error) {
        if (error instanceof Error && error.message === "Not authenticated") {
          setState((prev) => ({ ...prev, authenticated: false }));
          return "auth_required";
        }
        throw error;
      }
    },
    [isWishlisted, state.authenticated]
  );

  const remove = useCallback(async (productId: string) => {
    const data = await removeWishlistItem(productId);
    setState((prev) => ({
      ...prev,
      productIds: data.productIds,
      items: data.items,
    }));
  }, []);

  return {
    productIds: state.productIds,
    items: state.items,
    loading: state.loading,
    authenticated: state.authenticated,
    isWishlisted,
    toggle,
    remove,
    refresh,
  };
}
