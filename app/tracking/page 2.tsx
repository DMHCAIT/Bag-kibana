"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function TrackingPage() {
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement tracking logic here
    alert(`Tracking order: ${trackingNumber}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif tracking-wide text-center mb-4">
            Track Your Order
          </h1>
          <p className="text-gray-600 text-center mb-12">
            Enter your tracking number to check your order status
          </p>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="tracking">Tracking Number *</Label>
                <Input
                  id="tracking"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter your tracking number"
                  className="mt-2"
                />
                <p className="text-sm text-gray-500 mt-2">
                  You can find your tracking number in the shipping confirmation email
                </p>
              </div>
              <Button 
                type="submit" 
                className="w-full bg-black text-white hover:bg-gray-800 py-6"
              >
                Track Order
              </Button>
            </form>
          </div>

          <div className="mt-12 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-600 mb-4">
              If you haven't received a tracking number or have questions about your order, please contact our support team.
            </p>
            <a 
              href="mailto:support@kibanalife.com"
              className="inline-block px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

