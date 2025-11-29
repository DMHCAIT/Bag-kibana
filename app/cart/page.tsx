"use client";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] py-16">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <ShoppingBag className="w-24 h-24 mx-auto mb-6 text-gray-300" />
            <h1 className="font-serif text-3xl md:text-4xl tracking-[0.15em] mb-4">
              YOUR CART IS EMPTY
            </h1>
            <p className="text-gray-600 mb-8">
              Add some items to your cart to get started
            </p>
            <Link href="/shop">
              <Button className="uppercase tracking-wider bg-black text-white hover:bg-gray-800">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <h1 className="font-serif text-3xl md:text-4xl tracking-[0.15em] mb-8 text-center">
          SHOPPING CART
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.product.id} className="overflow-hidden">
                <CardContent className="p-4 md:p-6">
                  <div className="flex gap-4 md:gap-6">
                    {/* Product Image */}
                    <Link href={`/products/${item.product.id}`}>
                      <div className="relative w-24 h-24 md:w-32 md:h-32 bg-linear-to-br from-gray-100 to-gray-200 rounded-sm shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                          {item.product.name}
                        </div>
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-medium text-sm md:text-base mb-2 hover:opacity-60 transition-opacity cursor-pointer">
                          {item.product.name} - {item.product.color}
                        </h3>
                      </Link>
                      <p className="text-gray-600 text-sm mb-2">
                        {item.product.category}
                      </p>
                      {item.selectedColor && (
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs text-gray-600">Color:</span>
                          <div
                            className="w-5 h-5 rounded-full border-2 border-gray-300"
                            style={{ backgroundColor: item.selectedColor.value }}
                          />
                          <span className="text-xs">{item.selectedColor.name}</span>
                        </div>
                      )}
                      <p className="font-medium text-lg mb-4">
                        ₹{item.product.price.toLocaleString()}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded-sm">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-gray-100 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Item Total (Desktop) */}
                    <div className="hidden md:block text-right">
                      <p className="font-medium text-lg">
                        ₹{(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Item Total (Mobile) */}
                  <div className="md:hidden mt-4 pt-4 border-t text-right">
                    <p className="text-sm text-gray-600">Subtotal:</p>
                    <p className="font-medium text-lg">
                      ₹{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h2 className="font-serif text-xl tracking-[0.15em]">
                  ORDER SUMMARY
                </h2>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span>₹{cart.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="flex justify-between font-medium text-lg pt-4 border-t">
                  <span>Total</span>
                  <span>₹{cart.subtotal.toLocaleString()}</span>
                </div>

                <Link href="/checkout" className="block">
                  <Button className="w-full uppercase tracking-wider bg-black text-white hover:bg-gray-800 py-6">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/shop">
                  <Button
                    variant="outline"
                    className="w-full uppercase tracking-wider"
                  >
                    Continue Shopping
                  </Button>
                </Link>

                {/* Trust Badges */}
                <div className="pt-6 border-t space-y-3 text-xs text-gray-600">
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Free shipping on all orders
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Secure payment
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                    Easy returns within 30 days
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
