import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns & Exchanges - Kibana",
  description: "Learn about our returns and exchange policy.",
};

export default function ReturnsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif mb-8">Returns & Exchanges</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          We want you to love your Kibana purchase.
        </p>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon for our returns policy.
        </p>
      </div>
    </div>
  );
}
