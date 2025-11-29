import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions - Kibana",
  description: "Read our terms and conditions.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif mb-8">Terms & Conditions</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          Please read these terms carefully before using our services.
        </p>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon for our complete terms and conditions.
        </p>
      </div>
    </div>
  );
}
