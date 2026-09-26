// ============================================
// Styled by Uriel — Shared TypeScript Types
// Mirrors the Supabase DB schema (PRD §9)
// ============================================

// ── Product Domain ──

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: string;
  availability: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
  // Joined relations (optional, populated by queries)
  category?: Category;
  images?: ProductImage[];
  variations?: ProductVariation[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface ProductVariation {
  id: string;
  product_id: string;
  colour: string;
  size: string;
  additional_price: number;
  stock_quantity: number;
  availability: boolean;
}

export type DeliveryStatus =
  | "confirmed"
  | "dispatched"
  | "in_transit"
  | "delayed"
  | "delivered";

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  payment_status: PaymentStatus;
  delivery_status?: DeliveryStatus;
  flutterwave_reference: string | null;
  customer_id: string | null; // nullable — reserved for future V2 customer accounts
  created_at: string;
  // Joined
  items?: OrderItem[];
}

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  quantity: number;
  selected_colour: string | null;
  selected_size: string | null;
  unit_price: number;
  subtotal: number;
}

// ── Cart (client-side only) ──

export interface CartItem {
  productId: string;
  slug?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  selectedColour: string | null;
  selectedSize: string | null;
  variationId: string | null;
}

export interface CartState {
  items: CartItem[];
  lastAdded: CartItem | null;
  addItem: (item: CartItem) => void;
  buyNow: (item: CartItem) => void;
  removeItem: (
    productId: string,
    variationId: string | null,
    selectedSize?: string | null,
    selectedColour?: string | null
  ) => void;
  updateQuantity: (
    productId: string,
    variationId: string | null,
    quantity: number,
    selectedSize?: string | null,
    selectedColour?: string | null
  ) => void;
  clearCart: () => void;
  clearLastAdded: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

// ── API Error Shape ──

export interface ApiError {
  error: {
    code: string;
    message: string;
  };
}

// ── Checkout ──

export interface CheckoutFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
}
