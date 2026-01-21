import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Kibana",
  description: "Learn about Kibana's story, craftsmanship, and commitment to quality.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif mb-8">About Kibana</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          Welcome to Kibana - where tradition meets contemporary design.
        </p>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon for more information about our brand story.
        </p>
      </div>
    </div>
  );
}
