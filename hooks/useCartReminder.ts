"use client";

import { useEffect, useRef } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook to send cart abandonment reminders via WhatsApp and SMS
 * Triggers after 30 minutes of inactivity when cart has items
 */
export function useCartReminder() {
  const { cart } = useCart();
  const { user } = useAuth();
  const reminderSentRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Only send reminder if:
    // 1. Cart has items
    // 2. User is logged in
    // 3. Reminder hasn't been sent yet in this session
    if (cart.items.length > 0 && user && !reminderSentRef.current) {
      // Set timeout for 30 minutes (1800000 ms)
      timeoutRef.current = setTimeout(async () => {
        try {
          // Get user's phone from profile
          const phone = user.phone;
          
          if (!phone) {
            console.log('No phone number available for cart reminder');
            return;
          }

          const response = await fetch('/api/notifications/cart-reminder', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.id,
              customerName: user.name || user.email?.split('@')[0] || 'Customer',
              customerPhone: phone,
              itemCount: cart.items.length,
              cartItems: cart.items.map(item => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
              })),
              cartTotal: cart.subtotal,
            }),
          });

          if (response.ok) {
            console.log('Cart reminder sent successfully');
            reminderSentRef.current = true;
          } else {
            console.error('Failed to send cart reminder');
          }
        } catch (error) {
          console.error('Error sending cart reminder:', error);
        }
      }, 30 * 60 * 1000); // 30 minutes
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [cart.items.length, user]);

  // Reset reminder flag when cart becomes empty
  useEffect(() => {
    if (cart.items.length === 0) {
      reminderSentRef.current = false;
    }
  }, [cart.items.length]);
}
