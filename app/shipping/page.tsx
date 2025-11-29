import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Information - Kibana",
  description: "Shipping rates and delivery information.",
};

export default function ShippingPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif mb-8">Shipping Information</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          Fast and reliable shipping to your doorstep.
        </p>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon for shipping details.
        </p>
      </div>
    </div>
  );
}
