import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Kibana",
  description: "Get in touch with Kibana customer support.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <h1 className="text-4xl font-serif mb-8">Contact Us</h1>
      <div className="prose prose-lg">
        <p className="text-gray-600 mb-6">
          We&apos;d love to hear from you.
        </p>
        <p className="text-gray-600 mb-6">
          This page is under construction. Check back soon for contact information and forms.
        </p>
      </div>
    </div>
  );
}
