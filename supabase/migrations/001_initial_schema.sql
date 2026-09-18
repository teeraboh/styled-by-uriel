-- ============================================
-- Styled by Uriel — Initial Database Schema & RLS Policies
-- Baseline conforming to .agents/rules/security.md & architecture.md
-- ============================================

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    availability BOOLEAN NOT NULL DEFAULT true,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Product Images Table
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Product Variations Table
CREATE TABLE IF NOT EXISTS public.product_variations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    colour TEXT NOT NULL,
    size TEXT NOT NULL,
    additional_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    availability BOOLEAN NOT NULL DEFAULT true
);

-- 5. Orders Table (customer_id nullable for future V2 scale)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    flutterwave_reference TEXT UNIQUE,
    customer_id UUID NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_name_snapshot TEXT NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    selected_colour TEXT NULL,
    selected_size TEXT NULL,
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price > 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Categories: Public read, vendor write
CREATE POLICY "Public read categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Vendor all categories" ON public.categories
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Products: Public read available only, vendor all
CREATE POLICY "Public read available products" ON public.products
    FOR SELECT USING (availability = true);

CREATE POLICY "Vendor all products" ON public.products
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Product Images: Public read, vendor all
CREATE POLICY "Public read product images" ON public.product_images
    FOR SELECT USING (true);

CREATE POLICY "Vendor all product images" ON public.product_images
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Product Variations: Public read available, vendor all
CREATE POLICY "Public read product variations" ON public.product_variations
    FOR SELECT USING (availability = true);

CREATE POLICY "Vendor all product variations" ON public.product_variations
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Orders: No public select (protects customer PII), vendor select all
CREATE POLICY "Vendor read all orders" ON public.orders
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Vendor manage orders" ON public.orders
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Order Items: Vendor select all
CREATE POLICY "Vendor read all order items" ON public.order_items
    FOR SELECT TO authenticated USING (true);
