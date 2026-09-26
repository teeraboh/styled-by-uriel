-- ============================================
-- Styled by Uriel — Inventory RPC & Storage Bucket Configuration
-- Conforms to .agents/rules/security.md & architecture.md
-- ============================================

-- 1. Atomic Stock Decrement Function (avoids overselling under concurrency)
CREATE OR REPLACE FUNCTION public.decrement_stock(
    p_product_id UUID,
    p_quantity INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_stock INT;
BEGIN
    -- Row lock on product for atomicity
    SELECT stock_quantity INTO v_current_stock
    FROM public.products
    WHERE id = p_product_id
    FOR UPDATE;

    IF v_current_stock IS NULL OR v_current_stock < p_quantity THEN
        RETURN FALSE;
    END IF;

    -- Decrement stock and automatically mark unavailable if 0
    UPDATE public.products
    SET 
        stock_quantity = stock_quantity - p_quantity,
        availability = CASE WHEN (stock_quantity - p_quantity) > 0 THEN true ELSE false END,
        updated_at = now()
    WHERE id = p_product_id;

    RETURN TRUE;
END;
$$;

-- 2. Storage Bucket Creation for Product Images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Storage Policies (Public read, vendor write)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Public read product images bucket'
    ) THEN
        CREATE POLICY "Public read product images bucket"
        ON storage.objects FOR SELECT
        USING (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Vendor insert product images bucket'
    ) THEN
        CREATE POLICY "Vendor insert product images bucket"
        ON storage.objects FOR INSERT
        TO authenticated
        WITH CHECK (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Vendor update product images bucket'
    ) THEN
        CREATE POLICY "Vendor update product images bucket"
        ON storage.objects FOR UPDATE
        TO authenticated
        USING (bucket_id = 'product-images');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'objects' 
        AND schemaname = 'storage' 
        AND policyname = 'Vendor delete product images bucket'
    ) THEN
        CREATE POLICY "Vendor delete product images bucket"
        ON storage.objects FOR DELETE
        TO authenticated
        USING (bucket_id = 'product-images');
    END IF;
END $$;
