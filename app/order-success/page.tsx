"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Package, Truck, Home, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    orderId: "",
    paymentId: "",
    method: "",
  });
  const [trackingFired, setTrackingFired] = useState(false);

  useEffect(() => {
    setOrderDetails({
      orderId: searchParams.get("orderId") || "",
      paymentId: searchParams.get("paymentId") || "",
      method: searchParams.get("method") || "razorpay",
    });
  }, [searchParams]);

  // Facebook Pixel Purchase Tracking
  useEffect(() => {
    if (!trackingFired && orderDetails.orderId) {
      try {
        const orderData = localStorage.getItem('kibana-order-tracking');
        if (orderData) {
          const { value, currency } = JSON.parse(orderData);
          
          // Fire Facebook Pixel purchase event
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Purchase', {
              value: value,
              currency: currency
            });
            console.log('Facebook Pixel Purchase event fired:', { value, currency });
          }

          // Clear the tracking data after use
          localStorage.removeItem('kibana-order-tracking');
          setTrackingFired(true);
        }
      } catch (error) {
        console.error('Error tracking purchase:', error);
      }
    }
  }, [orderDetails.orderId, trackingFired]);

  const isCOD = orderDetails.method === "cod" || orderDetails.orderId.startsWith("COD");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl tracking-wider mb-4">
                Order Confirmed!
              </h1>
              <p className="text-gray-700 text-lg mb-2">
                Thank you for your purchase
              </p>
              <p className="text-gray-600">
                We've sent a confirmation email with your order details
              </p>
            </CardContent>
          </Card>

          {/* Order Details */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-serif text-2xl tracking-wider mb-6">
                Order Details
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-medium font-mono text-sm">
                    {orderDetails.orderId || "Processing..."}
                  </span>
                </div>

                {orderDetails.paymentId && (
                  <div className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="font-medium font-mono text-sm">
                      {orderDetails.paymentId}
                    </span>
                  </div>
                )}

                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">
                    {isCOD ? "Cash on Delivery" : "Online Payment"}
                  </span>
                </div>

                <div className="flex justify-between py-3 border-b">
                  <span className="text-gray-600">Order Status</span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    <Package className="w-4 h-4" />
                    Processing
                  </span>
                </div>

                <div className="flex justify-between py-3">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="font-medium">5-7 Business Days</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <h2 className="font-serif text-2xl tracking-wider mb-6">
                What Happens Next?
              </h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Order Confirmation</h3>
                    <p className="text-gray-600">
                      You'll receive a confirmation email with your order details and tracking information.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Processing & Packaging</h3>
                    <p className="text-gray-600">
                      Our team will carefully prepare your order for shipment.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Shipment</h3>
                    <p className="text-gray-600">
                      Your order will be dispatched and you'll receive tracking details via email and SMS.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center flex-shrink-0 font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Delivery</h3>
                    <p className="text-gray-600">
                      {isCOD
                        ? "Your order will be delivered to your doorstep. Please keep the exact cash amount ready."
                        : "Your order will be delivered to your doorstep within 5-7 business days."}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/tracking" className="flex-1">
              <Button
                variant="outline"
                className="w-full uppercase tracking-wider py-6"
              >
                <Truck className="w-5 h-5 mr-2" />
                Track Order
              </Button>
            </Link>

            <Link href="/shop" className="flex-1">
              <Button
                variant="outline"
                className="w-full uppercase tracking-wider py-6"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Continue Shopping
              </Button>
            </Link>

            <Link href="/" className="flex-1">
              <Button
                className="w-full uppercase tracking-wider bg-black text-white hover:bg-gray-800 py-6"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Help Section */}
          <Card className="mt-8 bg-gray-100">
            <CardContent className="p-6 text-center">
              <h3 className="font-medium text-lg mb-2">Need Help?</h3>
              <p className="text-gray-600 mb-4">
                Our customer support team is here to assist you
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <a
                  href="mailto:support@kibanalife.com"
                  className="text-blue-600 hover:underline"
                >
                  support@kibanalife.com
                </a>
                <a
                  href="tel:+919711414110"
                  className="text-blue-600 hover:underline"
                >
                  +91 9711414110
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}

