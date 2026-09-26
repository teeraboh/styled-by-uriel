import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartState } from "@/types";

/**
 * Guest cart store — Zustand + localStorage persistence.
 * No server session for buyers (PRD §5, §11).
 * SSR-guarded: only hydrates on the client.
 */
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAdded: null,

      addItem: (newItem: CartItem) => {
        // Guard against non-UUID product IDs from legacy mock data
        if (!newItem.productId || !UUID_REGEX.test(newItem.productId)) {
          console.warn("[useCartStore] Refusing to add item with invalid UUID:", newItem.productId);
          return;
        }

        set((state) => {
          // Check if this exact product + variation + size + colour combo already exists
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              (item.variationId || null) === (newItem.variationId || null) &&
              (item.selectedSize || null) === (newItem.selectedSize || null) &&
              (item.selectedColour || null) === (newItem.selectedColour || null)
          );

          let items: CartItem[];

          if (existingIndex >= 0) {
            // Update quantity of existing item
            const updated = [...state.items];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + newItem.quantity,
            };
            items = updated;
          } else {
            // Add new item
            items = [...state.items, newItem];
          }

          return { items, lastAdded: newItem };
        });
      },

      buyNow: (item: CartItem) => {
        if (!item.productId || !UUID_REGEX.test(item.productId)) {
          console.warn("[useCartStore] Refusing buyNow with invalid UUID:", item.productId);
          return;
        }
        set({ items: [item], lastAdded: item });
      },

      removeItem: (
        productId: string,
        variationId: string | null,
        selectedSize?: string | null,
        selectedColour?: string | null
      ) => {
        set((state) => ({
          items: state.items.filter((item) => {
            const matchesProduct = item.productId === productId;
            const matchesVariation = (item.variationId || null) === (variationId || null);
            const matchesSize =
              selectedSize === undefined || (item.selectedSize || null) === (selectedSize || null);
            const matchesColour =
              selectedColour === undefined || (item.selectedColour || null) === (selectedColour || null);

            return !(matchesProduct && matchesVariation && matchesSize && matchesColour);
          }),
        }));
      },

      updateQuantity: (
        productId: string,
        variationId: string | null,
        quantity: number,
        selectedSize?: string | null,
        selectedColour?: string | null
      ) => {
        if (quantity < 1) return; // No invalid quantities (PRD §11)
        set((state) => ({
          items: state.items.map((item) => {
            const matchesProduct = item.productId === productId;
            const matchesVariation = (item.variationId || null) === (variationId || null);
            const matchesSize =
              selectedSize === undefined || (item.selectedSize || null) === (selectedSize || null);
            const matchesColour =
              selectedColour === undefined || (item.selectedColour || null) === (selectedColour || null);

            if (matchesProduct && matchesVariation && matchesSize && matchesColour) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [], lastAdded: null }),

      clearLastAdded: () => set({ lastAdded: null }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "styled-by-uriel-cart",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.items)) {
          // Auto-purge any stale items with non-UUID product IDs from older mock versions
          state.items = state.items.filter(
            (item) =>
              item &&
              typeof item.productId === "string" &&
              UUID_REGEX.test(item.productId)
          );
        }
      },
    }
  )
);
