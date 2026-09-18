import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, CartState } from "@/types";

/**
 * Guest cart store — Zustand + localStorage persistence.
 * No server session for buyers (PRD §5, §11).
 * SSR-guarded: only hydrates on the client.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAdded: null,

      addItem: (newItem: CartItem) => {
        set((state) => {
          // Check if this exact product + variation combo already exists
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              item.variationId === newItem.variationId
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

      removeItem: (productId: string, variationId: string | null) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.variationId === variationId)
          ),
        }));
      },

      updateQuantity: (
        productId: string,
        variationId: string | null,
        quantity: number
      ) => {
        if (quantity < 1) return; // No invalid quantities (PRD §11)
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variationId === variationId
              ? { ...item, quantity }
              : item
          ),
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
    }
  )
);
