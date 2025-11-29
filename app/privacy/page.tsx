import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Kibana",
  description: "Read our privacy policy and data protection practices.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif mb-8">Privacy Policy</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          Your privacy is important to us.
        </p>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon for our complete privacy policy.
        </p>
      </div>
    </div>
  );
}
