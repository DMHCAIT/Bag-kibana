import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Craftsmanship - Kibana",
  description: "Discover the art and craft behind Kibana products.",
};

export default function CraftsmanshipPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif mb-8">Our Craftsmanship</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          Every Kibana piece is crafted with precision and care.
        </p>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon to learn about our craftsmanship.
        </p>
      </div>
    </div>
  );
}
