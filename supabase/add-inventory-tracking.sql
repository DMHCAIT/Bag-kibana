-- =====================================================
-- INVENTORY TRACKING MIGRATION
-- =====================================================
-- This migration adds inventory management capabilities:
-- 1. Stock tracking for products
-- 2. Low stock alerts
-- 3. Inventory transaction history
-- =====================================================

-- Add inventory columns to products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER DEFAULT 5,
ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS allow_backorder BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS sku VARCHAR(100);

-- Create unique constraint on SKU
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_sku ON public.products(sku) WHERE sku IS NOT NULL;

-- Add comments
COMMENT ON COLUMN public.products.stock_quantity IS 'Current available stock quantity';
COMMENT ON COLUMN public.products.low_stock_threshold IS 'Quantity below which low stock alert is triggered';
COMMENT ON COLUMN public.products.track_inventory IS 'Whether to track inventory for this product';
COMMENT ON COLUMN public.products.allow_backorder IS 'Allow orders when out of stock';
COMMENT ON COLUMN public.products.sku IS 'Stock Keeping Unit - unique product identifier';

-- =====================================================
-- INVENTORY TRANSACTIONS TABLE
-- =====================================================

-- Create inventory_transactions table for tracking all stock changes
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL, -- 'purchase', 'sale', 'adjustment', 'return'
  quantity INTEGER NOT NULL, -- Positive for additions, negative for subtractions
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reference_type VARCHAR(50), -- 'order', 'manual_adjustment', 'return', etc.
  reference_id VARCHAR(255), -- Order ID, adjustment ID, etc.
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product 
ON public.inventory_transactions(product_id);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_type 
ON public.inventory_transactions(transaction_type);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_reference 
ON public.inventory_transactions(reference_type, reference_id);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created 
ON public.inventory_transactions(created_at DESC);

-- Add comment
COMMENT ON TABLE public.inventory_transactions IS 'Tracks all inventory changes with full audit trail';

-- =====================================================
-- INVENTORY FUNCTIONS
-- =====================================================

-- Function to update product stock
CREATE OR REPLACE FUNCTION update_product_stock(
  p_product_id INTEGER,
  p_quantity_change INTEGER,
  p_transaction_type VARCHAR(20),
  p_reference_type VARCHAR(50) DEFAULT NULL,
  p_reference_id VARCHAR(255) DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_user_id UUID DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_current_quantity INTEGER;
  v_new_quantity INTEGER;
  v_result JSON;
BEGIN
  -- Get current quantity with row lock
  SELECT stock_quantity INTO v_current_quantity
  FROM public.products
  WHERE id = p_product_id
  FOR UPDATE;

  IF v_current_quantity IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  -- Calculate new quantity
  v_new_quantity := v_current_quantity + p_quantity_change;

  -- Validate new quantity
  IF v_new_quantity < 0 THEN
    -- Check if backorder is allowed
    DECLARE
      v_allow_backorder BOOLEAN;
    BEGIN
      SELECT allow_backorder INTO v_allow_backorder
      FROM public.products
      WHERE id = p_product_id;

      IF NOT v_allow_backorder THEN
        RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_current_quantity, ABS(p_quantity_change);
      END IF;
    END;
  END IF;

  -- Update product stock
  UPDATE public.products
  SET stock_quantity = v_new_quantity,
      updated_at = NOW()
  WHERE id = p_product_id;

  -- Record transaction
  INSERT INTO public.inventory_transactions (
    product_id,
    transaction_type,
    quantity,
    previous_quantity,
    new_quantity,
    reference_type,
    reference_id,
    notes,
    created_by
  ) VALUES (
    p_product_id,
    p_transaction_type,
    p_quantity_change,
    v_current_quantity,
    v_new_quantity,
    p_reference_type,
    p_reference_id,
    p_notes,
    p_user_id
  );

  -- Build result
  v_result := json_build_object(
    'success', true,
    'previous_quantity', v_current_quantity,
    'new_quantity', v_new_quantity,
    'is_low_stock', v_new_quantity <= (SELECT low_stock_threshold FROM public.products WHERE id = p_product_id)
  );

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Add comment
COMMENT ON FUNCTION update_product_stock IS 'Safely updates product stock with transaction logging and validation';

-- =====================================================
-- FUNCTION TO CHECK STOCK AVAILABILITY
-- =====================================================

CREATE OR REPLACE FUNCTION check_stock_availability(
  p_product_id INTEGER,
  p_required_quantity INTEGER
)
RETURNS JSON AS $$
DECLARE
  v_stock_quantity INTEGER;
  v_track_inventory BOOLEAN;
  v_allow_backorder BOOLEAN;
  v_result JSON;
BEGIN
  -- Get product inventory settings
  SELECT stock_quantity, track_inventory, allow_backorder
  INTO v_stock_quantity, v_track_inventory, v_allow_backorder
  FROM public.products
  WHERE id = p_product_id;

  IF v_stock_quantity IS NULL THEN
    RAISE EXCEPTION 'Product not found';
  END IF;

  -- If not tracking inventory, always available
  IF NOT v_track_inventory THEN
    v_result := json_build_object(
      'available', true,
      'in_stock', true,
      'quantity_available', 999999
    );
    RETURN v_result;
  END IF;

  -- Check stock availability
  IF v_stock_quantity >= p_required_quantity THEN
    v_result := json_build_object(
      'available', true,
      'in_stock', true,
      'quantity_available', v_stock_quantity
    );
  ELSIF v_allow_backorder THEN
    v_result := json_build_object(
      'available', true,
      'in_stock', false,
      'quantity_available', v_stock_quantity,
      'backorder', true
    );
  ELSE
    v_result := json_build_object(
      'available', false,
      'in_stock', false,
      'quantity_available', v_stock_quantity
    );
  END IF;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- Add comment
COMMENT ON FUNCTION check_stock_availability IS 'Checks if sufficient stock is available for a given quantity';

-- =====================================================
-- TRIGGER TO PREVENT NEGATIVE STOCK
-- =====================================================

CREATE OR REPLACE FUNCTION prevent_negative_stock()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.stock_quantity < 0 AND NEW.track_inventory AND NOT NEW.allow_backorder THEN
    RAISE EXCEPTION 'Stock quantity cannot be negative for product ID %', NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_stock_before_update
BEFORE UPDATE OF stock_quantity ON public.products
FOR EACH ROW
EXECUTE FUNCTION prevent_negative_stock();

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

-- Enable RLS on inventory_transactions
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view inventory transactions
CREATE POLICY "Public can view inventory transactions"
ON public.inventory_transactions
FOR SELECT
TO public
USING (true);

-- Policy: Only admins can insert/update inventory transactions
CREATE POLICY "Admins can manage inventory transactions"
ON public.inventory_transactions
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- =====================================================
-- GRANTS
-- =====================================================

GRANT SELECT ON public.inventory_transactions TO anon, authenticated;
GRANT INSERT, UPDATE ON public.inventory_transactions TO authenticated;

-- =====================================================
-- POPULATE INITIAL STOCK DATA
-- =====================================================

-- Update existing products with default inventory settings
UPDATE public.products
SET 
  stock_quantity = COALESCE(stock_quantity, 100), -- Set default stock
  low_stock_threshold = COALESCE(low_stock_threshold, 5),
  track_inventory = COALESCE(track_inventory, true),
  allow_backorder = COALESCE(allow_backorder, false)
WHERE stock_quantity IS NULL;

-- =====================================================
-- VERIFICATION
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE 'Inventory tracking migration completed';
  RAISE NOTICE 'Products table updated with inventory columns';
  RAISE NOTICE 'Inventory transactions table created';
  RAISE NOTICE 'Stock management functions created';
END $$;
