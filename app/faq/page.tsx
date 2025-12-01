import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Kibana",
  description: "Frequently asked questions about Kibana products and services.",
};

export default function FAQPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif mb-8">Frequently Asked Questions</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          Find answers to common questions.
        </p>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon for detailed FAQs.
        </p>
      </div>
    </div>
  );
}
