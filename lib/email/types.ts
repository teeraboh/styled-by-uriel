export interface OrderItemEmailPayload {
  name: string;
  quantity: number;
  size?: string | null;
  colour?: string | null;
  unitPrice: number;
  subtotal: number;
}

export interface OrderConfirmationEmailPayload {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: OrderItemEmailPayload[];
  totalAmount: number;
  deliveryAddress: string;
  customerPhone?: string;
  paymentMethod?: string;
}

export interface OrderDispatchedEmailPayload {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  deliveryAddress: string;
  courier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  items?: OrderItemEmailPayload[];
}

export interface OrderInTransitEmailPayload {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  deliveryAddress: string;
  courier?: string;
  trackingNumber?: string;
  currentLocationOrUpdate?: string;
}

export interface OrderDelayedEmailPayload {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  reason?: string;
  updatedEstimate?: string;
  deliveryAddress?: string;
}

export interface OrderDeliveredEmailPayload {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  deliveryAddress: string;
  deliveredAt?: string;
  items?: OrderItemEmailPayload[];
}

export interface VendorNewOrderEmailPayload {
  vendorEmail: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  items: OrderItemEmailPayload[];
  totalAmount: number;
  paymentStatus: string;
  orderDate?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}
