import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface VendorProduct {
  id: string;
  sku: string;
  name: string;
  category: "tracksuits" | "tees" | "denim" | "shorts";
  categoryLabel: string;
  details: string;
  price: number;
  stock: number;
  maxStock: number;
  status: "Active" | "Draft" | "Low Stock";
  imageUrl: string;
}

const INITIAL_VENDOR_PRODUCTS: VendorProduct[] = [];


interface VendorCatalogState {
  products: VendorProduct[];
  setProducts: (products: VendorProduct[]) => void;
  addProduct: (product: {
    name: string;
    category: "tracksuits" | "tees" | "denim" | "shorts";
    price: number;
    stock: number;
    description: string;
    imageUrl: string;
  }) => VendorProduct;
  updateProduct: (id: string, updates: Partial<VendorProduct>) => void;
  deleteProduct: (id: string) => void;
  toggleStatus: (id: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  tracksuits: "Tracksuits & Co-ords",
  tees: "Tees & Tops",
  denim: "Denim & Cargo",
  shorts: "Shorts & Sets",
};

export const useVendorCatalogStore = create<VendorCatalogState>()(
  persist(
    (set) => ({
      products: INITIAL_VENDOR_PRODUCTS,

      setProducts: (products) => set({ products }),

      addProduct: (input) => {
        const nextId = `prod-${Date.now()}`;
        const prefixMap: Record<string, string> = {
          tracksuits: "TRK",
          tees: "TEE",
          denim: "DNM",
          shorts: "SHT",
        };
        const randomNum = Math.floor(10 + Math.random() * 90);
        const sku = `SBU-${prefixMap[input.category] || "GAR"}-${randomNum}`;

        const newProd: VendorProduct = {
          id: nextId,
          sku,
          name: input.name,
          category: input.category,
          categoryLabel: CATEGORY_LABELS[input.category] || "Boutique Garment",
          details: input.description || `${input.name} • Handcrafted in Aba`,
          price: input.price,
          stock: input.stock,
          maxStock: Math.max(input.stock * 2, 20),
          status: input.stock > 4 ? "Active" : "Low Stock",
          imageUrl: input.imageUrl,
        };

        set((state) => ({
          products: [newProd, ...state.products],
        }));

        return newProd;
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      toggleStatus: (id) => {
        set((state) => ({
          products: state.products.map((p) => {
            if (p.id === id) {
              const nextStatus = p.status === "Active" ? "Draft" : "Active";
              return { ...p, status: nextStatus };
            }
            return p;
          }),
        }));
      },
    }),
    {
      name: "styled-by-uriel-vendor-catalog",
      partialize: (state) => ({ products: state.products }),
    }
  )
);
