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
                    <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none">
                      <circle cx="25" cy="25" r="24" fill="white" stroke="#DDD" strokeWidth="1"/>
                      <path d="M15 18h6c2.2 0 4 1.8 4 4s-1.8 4-4 4h-2v6h-4v-14zm4 6h2c1.1 0 2-.9 2-2s-.9-2-2-2h-2v4z" fill="#00BAF2"/>
                      <circle cx="33" cy="21" r="2" fill="#00BAF2"/>
                      <rect x="31" y="24" width="4" height="8" rx="0.5" fill="#00BAF2"/>
                    </svg>
                    {/* PhonePe */}
                    <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none">
                      <circle cx="25" cy="25" r="24" fill="#5F259F"/>
                      <path d="M18 16h8c2.2 0 4 1.8 4 4s-1.8 4-4 4h-3v6h-5v-14zm5 6h3c1.1 0 2-.9 2-2s-.9-2-2-2h-3v4z" fill="white"/>
                      <path d="M28 26h5v8h-5z" fill="white"/>
                    </svg>
                    {/* Google Pay */}
                    <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none">
                      <circle cx="25" cy="25" r="24" fill="white" stroke="#DDD" strokeWidth="1"/>
                      <text x="16" y="32" fontSize="11" fontWeight="700" fill="#4285F4" fontFamily="Arial">G</text>
                      <text x="25" y="32" fontSize="7" fontWeight="500" fill="#5F6368" fontFamily="Arial">Pay</text>
                    </svg>
                    {/* UPI */}
                    <svg className="w-10 h-10" viewBox="0 0 50 50" fill="none">
                      <circle cx="25" cy="25" r="24" fill="white" stroke="#DDD" strokeWidth="1"/>
                      <path d="M25 12l8 12-8 4-8-12z" fill="#FF6F00"/>
                      <path d="M25 28l8-4-8 14-8-14z" fill="#097B3E"/>
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
