export interface OrderSummary {
  id: string;
  createdAt: string;
  customerEmail: string;
  totalCents: number;
  lineCount: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: { fullName: string; email: string; phone: string };
  address: { line1: string; city: string; postalCode: string; country: string };
  lines: Array<{
    variantId: string;
    kitId: string;
    kitSlug: string;
    kitName: string;
    variantLabel: string;
    sku: string;
    priceCents: number;
    quantity: number;
    image: string;
  }>;
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
}
