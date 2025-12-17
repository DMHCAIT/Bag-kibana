-- Create cart_reminders table for tracking abandoned cart notifications
CREATE TABLE IF NOT EXISTS cart_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_phone TEXT NOT NULL,
  item_count INTEGER NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed
  sms_sent BOOLEAN DEFAULT false,
  whatsapp_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_cart_reminders_phone ON cart_reminders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_cart_reminders_sent_at ON cart_reminders(sent_at);
CREATE INDEX IF NOT EXISTS idx_cart_reminders_user_id ON cart_reminders(user_id);

-- Enable RLS
ALTER TABLE cart_reminders ENABLE ROW LEVEL SECURITY;

-- Policy: Admin can view all cart reminders
CREATE POLICY "Admin can view all cart reminders" ON cart_reminders
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.user_id = auth.uid()
      AND user_roles.role = 'admin'
    )
  );

-- Policy: Users can view their own cart reminders
CREATE POLICY "Users can view their own cart reminders" ON cart_reminders
  FOR SELECT
  USING (user_id = auth.uid());
