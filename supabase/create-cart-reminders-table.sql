-- Create cart_reminders table for tracking abandoned cart notifications
CREATE TABLE IF NOT EXISTS cart_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_phone TEXT NOT NULL,
  item_count INTEGER NOT NULL,
  cart_items JSONB DEFAULT '[]'::jsonb,
  cart_total DECIMAL(10,2) DEFAULT 0,
  reminder_sent BOOLEAN DEFAULT false,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
  sms_sent BOOLEAN DEFAULT false,
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='cart_reminders' AND column_name='cart_items') THEN
    ALTER TABLE cart_reminders ADD COLUMN cart_items JSONB DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='cart_reminders' AND column_name='cart_total') THEN
    ALTER TABLE cart_reminders ADD COLUMN cart_total DECIMAL(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='cart_reminders' AND column_name='reminder_sent') THEN
    ALTER TABLE cart_reminders ADD COLUMN reminder_sent BOOLEAN DEFAULT false;
  END IF;
END $$;

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_cart_reminders_phone ON cart_reminders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_cart_reminders_sent_at ON cart_reminders(sent_at);
CREATE INDEX IF NOT EXISTS idx_cart_reminders_user_id ON cart_reminders(user_id);

-- Enable RLS
ALTER TABLE cart_reminders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can insert cart reminders" ON cart_reminders;
DROP POLICY IF EXISTS "Service role can update cart reminders" ON cart_reminders;
DROP POLICY IF EXISTS "Users can view their own cart reminders" ON cart_reminders;
DROP POLICY IF EXISTS "Service role can view all cart reminders" ON cart_reminders;

-- Policy: Allow service role to insert cart reminders (for API)
CREATE POLICY "Service role can insert cart reminders" ON cart_reminders
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow service role to update cart reminders (for status updates)
CREATE POLICY "Service role can update cart reminders" ON cart_reminders
  FOR UPDATE
  USING (true);

-- Policy: Users can view their own cart reminders
CREATE POLICY "Users can view their own cart reminders" ON cart_reminders
  FOR SELECT
  USING (user_id = auth.uid());

-- Policy: Allow service role to view all (for admin dashboard if needed)
CREATE POLICY "Service role can view all cart reminders" ON cart_reminders
  FOR SELECT
  USING (true);
