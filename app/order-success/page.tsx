"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { clearCart } = useCart();
  
  // Get order ID directly from searchParams
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    if (orderId) {
      // Clear cart after successful order
      clearCart();
    } else {
      // Redirect to home if no order ID
      router.push("/");
    }
  }, [orderId, clearCart, router]);

  if (!orderId) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8] py-16">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <CheckCircle className="w-24 h-24 text-green-600" />
              <div className="absolute inset-0 bg-green-600 rounded-full opacity-20 animate-ping"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl md:text-4xl tracking-[0.15em] mb-4">
              ORDER CONFIRMED!
            </h1>
            <p className="text-gray-600 text-lg mb-2">
              Thank you for your purchase
            </p>
            <p className="text-sm text-gray-500">
              Your order has been successfully placed
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <div className="space-y-6">
                {/* Order Number */}
                <div className="text-center pb-6 border-b">
                  <p className="text-sm text-gray-600 mb-2">Order Number</p>
                  <p className="font-mono text-lg font-medium">{orderId}</p>
                </div>

                {/* What's Next */}
                <div>
                  <h2 className="font-serif text-xl tracking-[0.15em] mb-4 text-center">
                    WHAT&apos;S NEXT?
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-gray-600 mt-1 shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Order Confirmation</p>
                        <p className="text-sm text-gray-600">
                          You&apos;ll receive an order confirmation email with details of your order.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-gray-600 mt-1 shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Shipping Update</p>
                        <p className="text-sm text-gray-600">
                          We&apos;ll send you shipping updates as your order is processed.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Package className="w-5 h-5 text-gray-600 mt-1 shrink-0" />
                      <div>
                        <p className="font-medium mb-1">Delivery</p>
                        <p className="text-sm text-gray-600">
                          Your order will be delivered within 5-7 business days.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Support */}
                <div className="pt-6 border-t text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Need help with your order?
                  </p>
                  <p className="text-sm">
                    Contact us at{" "}
                    <a
                      href="mailto:support@kibana.com"
                      className="text-black underline hover:opacity-60"
                    >
                      support@kibana.com
                    </a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/" className="block">
              <Button
                variant="outline"
                className="w-full uppercase tracking-wider"
              >
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/shop" className="block">
              <Button className="w-full uppercase tracking-wider bg-black text-white hover:bg-gray-800">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 p-6 bg-white rounded-lg">
            <div className="grid md:grid-cols-3 gap-4 text-center text-sm">
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="font-medium mb-1">Secure Payment</p>
                <p className="text-xs text-gray-600">
                  Your payment is 100% secure
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-medium mb-1">Fast Delivery</p>
                <p className="text-xs text-gray-600">
                  Delivered within 5-7 days
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShoppingBag className="w-6 h-6 text-purple-600" />
                </div>
                <p className="font-medium mb-1">Easy Returns</p>
                <p className="text-xs text-gray-600">
                  30-day return policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
