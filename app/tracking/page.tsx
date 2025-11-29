import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Tracking - Kibana",
  description: "Track your Kibana order.",
};

export default function TrackingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif mb-8">Track Your Order</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          Enter your order details to track your shipment.
        </p>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon for order tracking functionality.
        </p>
      </div>
    </div>
  );
}
