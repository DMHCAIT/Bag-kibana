"use client";

import { Fragment } from "react";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[90%] sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6" />
              <h2 className="text-xl font-semibold">Shopping Bag</h2>
              <span className="text-sm text-gray-500">({cart.totalItems} items)</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cart.isEmpty ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your bag is empty</h3>
                <p className="text-gray-500 mb-6">Start adding items to your cart</p>
                <Link
                  href="/shop"
                  onClick={onClose}
                  className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {cart.items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Color */}
                      {item.selectedColor && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-500">Color:</span>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-5 h-5 rounded-full border border-gray-300"
                              style={{ backgroundColor: item.selectedColor.value }}
                            />
                            <span className="text-sm text-gray-700">{item.selectedColor.name}</span>
                          </div>
                        </div>
                      )}

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-black">
                            ₹{Math.round(item.product.price * 0.7 * item.quantity).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400 line-through">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {!cart.isEmpty && (
            <div className="border-t border-gray-200 p-6 space-y-4">
              {/* Discount Banner */}
              <div className="bg-black p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎉</span>
                  <div>
                    <p className="text-sm font-medium text-white">
                      30% OFF Applied Automatically!
                    </p>
                    <p className="text-xs text-gray-200">
                      You're saving ₹{Math.round(cart.subtotal * 0.3).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-medium text-gray-900">Estimated Total:</span>
                  <span className="text-2xl font-bold text-black">₹{Math.round(cart.subtotal * 0.7).toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Inclusive of all taxes. Discounts & Coupons applicable at checkout.
                </p>
              </div>

              {/* Payment Button */}
              <Link
                href="/checkout"
                onClick={onClose}
                className="block w-full py-4 bg-[#0A2540] text-white text-center rounded-lg hover:bg-[#0d3052] transition-colors font-medium relative overflow-hidden group"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-base font-semibold">UPI/Cards/COD</span>
                  <div className="flex items-center gap-1.5">
                    {/* Paytm */}
                    <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="23" fill="#00B9F5" stroke="#E8F5FD" strokeWidth="1"/>
                      <path d="M16 15c0-1.1.9-2 2-2h4c2.2 0 4 1.8 4 4s-1.8 4-4 4h-2v5h-4V15zm4 4h2c1.1 0 2-.9 2-2s-.9-2-2-2h-2v4z" fill="white"/>
                      <circle cx="31" cy="18" r="2.5" fill="white"/>
                      <rect x="29" y="22" width="4" height="7" rx="0.8" fill="white"/>
                    </svg>
                    {/* PhonePe */}
                    <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="23" fill="#5F259F"/>
                      <path d="M15 14h7c2.8 0 5 2.2 5 5s-2.2 5-5 5h-2v6h-5V14zm5 7h2c1.7 0 3-1.3 3-3s-1.3-3-3-3h-2v6z" fill="white"/>
                      <rect x="27" y="24" width="5" height="10" rx="0.5" fill="white"/>
                      <circle cx="29.5" cy="18.5" r="2.5" fill="white"/>
                    </svg>
                    {/* Google Pay */}
                    <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="23" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
                      <path d="M18.5 27.5v-11h5.2c1.4 0 2.5.4 3.3 1.2.8.8 1.2 1.9 1.2 3.3 0 1.4-.4 2.5-1.2 3.3-.8.8-1.9 1.2-3.3 1.2h-2.7v2h-2.5zm2.5-4.5h2.7c.7 0 1.3-.2 1.7-.7.4-.4.7-1 .7-1.8s-.2-1.3-.7-1.8c-.4-.4-1-.7-1.7-.7h-2.7v5z" fill="#4285F4"/>
                      <path d="M31.5 27.5v-5.8c0-.9.3-1.6.9-2.2.6-.6 1.3-.9 2.2-.9.9 0 1.6.3 2.2.9.6.6.9 1.3.9 2.2v5.8h-2v-5.8c0-.4-.1-.7-.4-1-.3-.3-.6-.4-1-.4s-.7.1-1 .4c-.3.3-.4.6-.4 1v5.8h-2z" fill="#34A853"/>
                      <circle cx="32.5" cy="17" r="1.2" fill="#FBBC04"/>
                      <circle cx="35.5" cy="17" r="1.2" fill="#EA4335"/>
                    </svg>
                    {/* UPI */}
                    <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                      <circle cx="24" cy="24" r="23" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
                      <path d="M24 14l6 9-6 3-6-9z" fill="#FF6F00" opacity="0.9"/>
                      <path d="M24 26l6-3-6 11-6-11z" fill="#097B3E" opacity="0.9"/>
                      <path d="M24 23l4-6-4 9-4-9z" fill="#FF9800" opacity="0.7"/>
                    </svg>
                  </div>
                  <span className="text-xl">›</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
