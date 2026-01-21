"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Package, Truck, CheckCircle2, MapPin, Phone, Mail } from "lucide-react";

export default function TrackingPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [tracking, setTracking] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      alert("Please enter your order ID");
      return;
    }

    setTracking(true);
    
    // Simulate tracking data
    // TODO: Replace with actual API call
    setTimeout(() => {
      setTrackingData({
        orderId: orderId,
        status: "processing",
        estimatedDelivery: "5-7 business days",
        timeline: [
          { status: "placed", date: new Date().toISOString(), completed: true },
          { status: "confirmed", date: new Date().toISOString(), completed: true },
          { status: "processing", date: null, completed: false },
          { status: "shipped", date: null, completed: false },
          { status: "delivered", date: null, completed: false },
        ],
      });
      setTracking(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif tracking-[0.15em] mb-4">
              TRACK YOUR ORDER
            </h1>
            <p className="text-gray-600">
              Enter your order details to track your shipment
            </p>
          </div>
          
          {/* Tracking Form */}
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleTrack} className="space-y-6">
                <div>
                  <Label htmlFor="orderId">Order ID / Order Number *</Label>
                  <Input
                    id="orderId"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="e.g., ORD-123456 or COD-123456"
                    className="mt-2"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Find this in your order confirmation email
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="mt-2"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-black text-white hover:bg-gray-800 py-6 uppercase tracking-wider"
                  disabled={tracking}
                >
                  {tracking ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Track Order
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tracking Results */}
          {trackingData && (
            <div className="space-y-6">
              {/* Order Status */}
              <Card>
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-serif text-2xl tracking-wider mb-2">
                        Order Status
                      </h2>
                      <p className="text-gray-600">
                        Order ID: <span className="font-mono font-medium">{trackingData.orderId}</span>
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      <Package className="w-4 h-4" />
                      {trackingData.status.charAt(0).toUpperCase() + trackingData.status.slice(1)}
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Estimated Delivery:</strong> {trackingData.estimatedDelivery}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardContent className="p-6 md:p-8">
                  <h3 className="font-serif text-xl tracking-wider mb-6">
                    Shipment Timeline
                  </h3>

                  <div className="space-y-6">
                    {/* Order Placed */}
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">Order Placed</h4>
                        <p className="text-sm text-gray-600">Your order has been confirmed</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date().toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="h-8 border-l-2 border-dashed border-gray-300 ml-6"></div>

                    {/* Processing */}
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-100 animate-pulse">
                        <Package className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">Processing</h4>
                        <p className="text-sm text-gray-600">We're preparing your order for shipment</p>
                      </div>
                    </div>

                    <div className="h-8 border-l-2 border-dashed border-gray-300 ml-6"></div>

                    {/* Shipped */}
                    <div className="flex gap-4 opacity-50">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Truck className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">Shipped</h4>
                        <p className="text-sm text-gray-600">Your order is on the way</p>
                      </div>
                    </div>

                    <div className="h-8 border-l-2 border-dashed border-gray-300 ml-6"></div>

                    {/* Out for Delivery */}
                    <div className="flex gap-4 opacity-50">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">Out for Delivery</h4>
                        <p className="text-sm text-gray-600">Your order is out for delivery</p>
                      </div>
                    </div>

                    <div className="h-8 border-l-2 border-dashed border-gray-300 ml-6"></div>

                    {/* Delivered */}
                    <div className="flex gap-4 opacity-50">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-lg">Delivered</h4>
                        <p className="text-sm text-gray-600">Order successfully delivered</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Help Section */}
              <Card className="bg-gray-50">
                <CardContent className="p-6 md:p-8">
                  <h3 className="font-medium text-lg mb-4">Need Help?</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">Call Us</p>
                        <a href="tel:+919711414110" className="text-sm text-blue-600 hover:underline">
                          +91 9711414110
                        </a>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium">Email Us</p>
                        <a href="mailto:support@kibanalife.com" className="text-sm text-blue-600 hover:underline">
                          support@kibanalife.com
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
