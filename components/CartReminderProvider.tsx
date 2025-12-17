"use client";

import { useCartReminder } from '@/hooks/useCartReminder';

/**
 * Component to initialize cart reminder functionality
 * Must be placed inside CartProvider and AuthProvider
 */
export default function CartReminderProvider() {
  useCartReminder();
  return null;
}
