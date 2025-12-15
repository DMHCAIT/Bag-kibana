"use client";

import { useState } from "react";
import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "Orders & Shipping",
    question: "What is your shipping policy?",
    answer: "We offer free shipping across India on all orders. Delivery typically takes 5-7 business days. We use trusted courier partners to ensure your bag reaches you safely."
  },
  {
    category: "Orders & Shipping",
    question: "Do you ship internationally?",
    answer: "Currently, we ship only within India. We're working on expanding our international shipping options. Stay tuned!"
  },
  {
    category: "Orders & Shipping",
    question: "How can I track my order?",
    answer: "Once your order ships, you'll receive a tracking number via email and SMS. You can use this to track your package on our website or the courier's website."
  },
  {
    category: "Orders & Shipping",
    question: "Can I modify or cancel my order?",
    answer: "You can modify or cancel your order within 2 hours of placing it. Please contact our customer support immediately at support@kibanalife.com or call us."
  },
  {
    category: "Product Information",
    question: "What materials are your bags made from?",
    answer: "Our bags are crafted from premium vegan leather - a high-quality, cruelty-free alternative that's both durable and stylish. We also use gold-toned hardware and quality linings."
  },
  {
    category: "Product Information",
    question: "Are the colors true to the images?",
    answer: "We strive to display accurate colors on our website. However, slight variations may occur due to screen settings. Each product page shows multiple angles to give you the best view."
  },
  {
    category: "Product Information",
    question: "How do I choose the right bag size?",
    answer: "Each product page includes detailed dimensions. Our Tote bags (35cm x 28cm x 15cm) are perfect for daily use and can fit a laptop. Clutches and slings are ideal for evenings or light use."
  },
  {
    category: "Product Information",
    question: "Do your bags come with a warranty?",
    answer: "Yes! All KibanaLife bags come with a 1-year manufacturing warranty covering defects in materials and craftsmanship. Normal wear and tear is not covered."
  },
  {
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer: "We offer a 7-day return policy. If you're not satisfied with your purchase, you can return it within 7 days of delivery for a full refund. The bag must be unused and in original condition with tags."
  },
  {
    category: "Returns & Exchanges",
    question: "How do I initiate a return?",
    answer: "Contact our customer support at support@kibanalife.com with your order number. We'll send you a return shipping label. Pack the bag securely and ship it back to us."
  },
  {
    category: "Returns & Exchanges",
    question: "Can I exchange for a different color or style?",
    answer: "Yes! If you'd like a different color or style, initiate a return and place a new order. We'll process your refund within 5-7 business days of receiving the returned item."
  },
  {
    category: "Returns & Exchanges",
    question: "Who pays for return shipping?",
    answer: "For defective products, we cover return shipping. For size/color preference changes, the customer is responsible for return shipping costs."
  },
  {
    category: "Payment & Pricing",
    question: "What payment methods do you accept?",
    answer: "We accept Credit Cards, Debit Cards, UPI, Net Banking, and Wallets through our secure Razorpay payment gateway. All transactions are encrypted and secure."
  },
  {
    category: "Payment & Pricing",
    question: "Is there a discount on bulk orders?",
    answer: "Yes! For corporate gifting or bulk orders (10+ bags), we offer special pricing. Please contact us at corporate@kibanalife.com for a custom quote."
  },
  {
    category: "Payment & Pricing",
    question: "Do you offer EMI options?",
    answer: "Yes, EMI options are available on select credit and debit cards for purchases above ₹3,000. You'll see EMI options at checkout if your card is eligible."
  },
  {
    category: "Care & Maintenance",
    question: "How do I care for my vegan leather bag?",
    answer: "Wipe with a soft, damp cloth to remove dirt. Avoid harsh chemicals. Store in a cool, dry place away from direct sunlight. Use the dust bag provided for storage."
  },
  {
    category: "Care & Maintenance",
    question: "Can the bag get wet?",
    answer: "Our vegan leather is water-resistant but not waterproof. Light rain is okay, but avoid prolonged exposure to water. If wet, pat dry immediately with a soft cloth."
  },
  {
    category: "Care & Maintenance",
    question: "How do I remove stains?",
    answer: "For minor stains, use a damp cloth with mild soap. For stubborn stains, we recommend professional leather cleaning services. Avoid using alcohol or harsh cleaners."
  },
  {
    category: "Corporate Gifting",
    question: "Do you offer corporate gifting services?",
    answer: "Absolutely! We specialize in corporate gifting with custom branding options, bulk discounts, and dedicated support. Contact corporate@kibanalife.com for more details."
  },
  {
    category: "Corporate Gifting",
    question: "Can you customize bags with our company logo?",
    answer: "Yes! For orders of 25+ bags, we offer customization options including embossing or metal tags with your company logo. Additional charges apply based on customization."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  const filteredFAQs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.15em] mb-6">
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about our products, shipping, returns, and more.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setOpenIndex(null);
              }}
              className={`px-6 py-2 rounded-full uppercase text-sm tracking-wider transition-all ${
                selectedCategory === category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category === "all" ? "All Questions" : category}
            </button>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-start justify-between py-6 text-left group"
              >
                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {faq.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-black transition-colors">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="pb-6 pr-12">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-gray-50 rounded-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif tracking-wider mb-4">Still Have Questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our customer support team is here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@kibanalife.com" 
              className="px-6 py-3 bg-black text-white rounded-lg uppercase tracking-wider text-sm hover:bg-gray-800 transition-colors"
            >
              Email Us
            </a>
            <a 
              href="tel:+919876543210" 
              className="px-6 py-3 border-2 border-black text-black rounded-lg uppercase tracking-wider text-sm hover:bg-black hover:text-white transition-colors"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
