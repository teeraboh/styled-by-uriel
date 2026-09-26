-- ============================================
-- Styled by Uriel — Order Delivery Status Migration
-- Conforms to .agents/skills/db-migration-runner/SKILL.md
-- ============================================

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS delivery_status TEXT NOT NULL DEFAULT 'confirmed'
CHECK (
  delivery_status IN (
    'confirmed',
    'dispatched',
    'in_transit',
    'delayed',
    'delivered'
  )
);

CREATE INDEX IF NOT EXISTS idx_orders_delivery_status
ON public.orders(delivery_status);
