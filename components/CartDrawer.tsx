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
                    {/* PhonePe */}
                    <div className="w-10 h-10 bg-[#5F259F] rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
                        <path d="M20 0C8.95 0 0 8.95 0 20s8.95 20 20 20 20-8.95 20-20S31.05 0 20 0zm7 26h-3V14h-8v-3h11v15z" fill="white"/>
                      </svg>
                    </div>
                    {/* Google Pay */}
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md border border-gray-200">
                      <svg className="w-9 h-9" viewBox="0 0 122.88 35.28" fill="none">
                        <path d="M15.45,17.34a8.68,8.68,0,0,1-8.25,9.11c-4.85,0-8.83-3.9-8.83-9.11S2.35,8.23,7.2,8.23a8.56,8.56,0,0,1,6.13,2.43l-2.48,2.38A5.24,5.24,0,0,0,7.2,11.28c-3.14,0-5.69,2.53-5.69,6.06s2.55,6.06,5.69,6.06a5.48,5.48,0,0,0,5.73-4.48H7.2V15.85h8.09a7.86,7.86,0,0,1,.16,1.49Z" fill="#4285F4"/>
                        <path d="M28.11,11.38a5.91,5.91,0,0,1,5.92,6.15,5.92,5.92,0,1,1-11.84,0,5.91,5.91,0,0,1,5.92-6.15Zm0,9.82a3.67,3.67,0,1,0-3.41-3.67A3.48,3.48,0,0,0,28.11,21.2Z" fill="#EA4335"/>
                        <path d="M42.77,11.38a5.91,5.91,0,0,1,5.92,6.15,5.92,5.92,0,1,1-11.84,0,5.91,5.91,0,0,1,5.92-6.15Zm0,9.82a3.67,3.67,0,1,0-3.41-3.67A3.48,3.48,0,0,0,42.77,21.2Z" fill="#FBBC04"/>
                        <path d="M56.79,11.64V25.5c0,5.71-3.37,8-7.35,8a7.45,7.45,0,0,1-6.92-4.61l2.19-0.91a5,5,0,0,0,4.73,3.27c3.09,0,5-1.91,5-5.5v-1.1h-0.14a5.82,5.82,0,0,1-4.52,2,6.15,6.15,0,0,1,0-12.29,5.76,5.76,0,0,1,4.52,2h0.14V11.64h2.35Zm-2.18,5.89a3.94,3.94,0,0,0-3.65-4.15,4.14,4.14,0,1,0,0,8.27,3.93,3.93,0,0,0,3.65-4.12Z" fill="#4285F4"/>
                        <path d="M63.54,0.77V26.1H61.19V0.77h2.35Z" fill="#34A853"/>
                        <path d="M77.42,21.2l5.95,14.08H80.77L78.54,29.9H71.25l-2.23,5.38H66.48l6.08-14.08h4.86ZM74.9,15.51l-2.59,6.12h5.18l-2.59-6.12Z" fill="#EA4335"/>
                        <path d="M93.81,11.38c3.78,0,6.48,2.61,6.48,6.15a6.48,6.48,0,1,1-12.95,0c0-3.54,2.7-6.15,6.47-6.15Zm0,2.46a3.94,3.94,0,0,0-3.95,3.69,4,4,0,1,0,7.9,0,3.94,3.94,0,0,0-3.95-3.69Z" fill="#4285F4"/>
                        <path d="M109.79,26.1l-6.95-10.81V26.1h-2.35V11.64h2.6l6.7,10.44V11.64h2.35V26.1h-2.35Z" fill="#34A853"/>
                        <path d="M122.88,17.74a8,8,0,0,1-7.94,8.36,7.85,7.85,0,0,1-5.75-2.39l1.69-1.69a5.68,5.68,0,0,0,4.06,1.62,5.54,5.54,0,0,0,5.51-4.46H114.9V17.38h7.82a7.32,7.32,0,0,1,.16.36Z" fill="#FBBC04"/>
                      </svg>
                    </div>
                    {/* Paytm */}
                    <div className="w-10 h-10 bg-[#00BAF2] rounded-lg flex items-center justify-center shadow-md">
                      <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
                        <path d="M8,10 h8 c3,0 5,2 5,5 s-2,5 -5,5 h-3 v10 h-5 V10 z M13,16 h3 c1.5,0 2,-0.5 2,-2 s-0.5,-2 -2,-2 h-3 v4 z" fill="white"/>
                        <circle cx="27" cy="13" r="2.5" fill="white"/>
                        <rect x="24.5" y="17" width="5" height="13" fill="white"/>
                      </svg>
                    </div>
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
