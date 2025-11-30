"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    question: "What materials are KIBANA bags made from?",
    answer: "Our bags are crafted from premium 100% PU Leather and full-grain leather, ensuring durability and a luxurious feel. Each material is carefully selected for its quality and longevity."
  },
  {
    question: "Do you offer international shipping?",
    answer: "Yes! We ship worldwide. International delivery typically takes 7-15 business days depending on your location. Shipping fees are calculated at checkout."
  },
  {
    question: "What is your return policy?",
    answer: "We offer returns within 15 days of delivery. Items must be unused, unworn, and in original packaging. Please note that return policy does not apply to items purchased during sales or special events. Visit our Return Policy page for complete details."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you'll receive an email with a tracking number and link. You can track your package in real-time using this link."
  },
  {
    question: "Are KIBANA bags covered under warranty?",
    answer: "Yes! We offer a lifetime service warranty on all our products. This covers manufacturing defects and craftsmanship issues. Contact our customer support for any repairs or maintenance needs."
  },
  {
    question: "How should I care for my KIBANA bag?",
    answer: "Keep your bag away from water and moisture, clean with a soft dry cloth, store in a cool dry place, and avoid direct sunlight for extended periods. Refer to the product care section on your product page for specific instructions."
  },
  {
    question: "Can I modify or cancel my order?",
    answer: "Orders can be modified or cancelled within 12 hours of placing the order. After this window, orders cannot be changed as they move to processing. Please contact us immediately if you need to make changes."
  },
  {
    question: "Do you offer gift wrapping?",
    answer: "While we don't currently offer gift wrapping, all our products come beautifully packaged in dust bags and premium boxes, making them perfect for gifting."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, net banking, and offer Cash on Delivery (COD) for eligible orders. All transactions are secured through PCI-compliant payment gateways."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us via email at support@kibanalife.com or call us at +91 9711414110. Our team is here to help Monday through Saturday, 10 AM - 6 PM IST."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif tracking-wide text-center mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-center mb-12">
          Find answers to common questions about our products and services
        </p>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gray-900 text-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Still have questions?</h2>
          <p className="mb-6">Our customer support team is here to help</p>
          <a 
            href="mailto:support@kibanalife.com"
            className="inline-block px-8 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}

