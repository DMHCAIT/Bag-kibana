import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy - Kibana",
  description: "Learn about Kibana shipping options and policies.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif mb-8">Shipping Policy</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          We ship worldwide with care and precision.
        </p>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon for detailed shipping information.
        </p>
      </div>
    </div>
  );
}
