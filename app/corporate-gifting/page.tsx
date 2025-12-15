"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { Gift, Users, Star, Sparkles, TrendingUp, Award } from "lucide-react";

export default function CorporateGiftingPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    quantity: "",
    customization: "",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send this to an API
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
          <Gift className="w-16 h-16 text-white mb-6" />
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.15em] text-white mb-6">
            CORPORATE GIFTING
          </h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Elevate your brand with premium vegan leather bags. Perfect for employee appreciation, client gifts, and corporate events.
          </p>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif tracking-wider mb-4">
            Why Choose KibanaLife for Corporate Gifting?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We make corporate gifting seamless with premium products, custom branding, and exceptional service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Premium Quality</h3>
            <p className="text-gray-600">
              Handcrafted vegan leather bags that reflect your brand's commitment to quality and sustainability.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Custom Branding</h3>
            <p className="text-gray-600">
              Add your company logo through embossing, metal tags, or custom packaging for a personalized touch.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Bulk Discounts</h3>
            <p className="text-gray-600">
              Competitive pricing for bulk orders starting from 10 units. The more you order, the more you save.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
            <p className="text-gray-600">
              A dedicated account manager to guide you through the entire process, from selection to delivery.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">On-Time Delivery</h3>
            <p className="text-gray-600">
              Reliable delivery timelines to meet your event or distribution deadlines without compromise.
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Gift Packaging</h3>
            <p className="text-gray-600">
              Elegant gift packaging included with every order. Custom packaging options available on request.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif tracking-wider mb-4">
              Bulk Order Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Transparent pricing with attractive discounts for larger orders. All prices include premium gift packaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-semibold mb-2">Starter</h3>
              <p className="text-gray-600 mb-6">Perfect for small teams</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">10%</span>
                <span className="text-gray-600 ml-2">OFF</span>
              </div>
              <div className="space-y-3 mb-8">
                <p className="text-sm text-gray-700">✓ 10-24 bags</p>
                <p className="text-sm text-gray-700">✓ Standard packaging</p>
                <p className="text-sm text-gray-700">✓ 2-3 weeks delivery</p>
              </div>
            </div>

            <div className="bg-black text-white rounded-2xl p-8 shadow-xl transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-4 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-semibold mb-2">Business</h3>
              <p className="text-gray-300 mb-6">Ideal for corporate events</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">20%</span>
                <span className="text-gray-300 ml-2">OFF</span>
              </div>
              <div className="space-y-3 mb-8">
                <p className="text-sm">✓ 25-49 bags</p>
                <p className="text-sm">✓ Custom branding available</p>
                <p className="text-sm">✓ Premium packaging</p>
                <p className="text-sm">✓ Dedicated account manager</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200">
              <h3 className="text-2xl font-semibold mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">For large organizations</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">30%</span>
                <span className="text-gray-600 ml-2">OFF</span>
              </div>
              <div className="space-y-3 mb-8">
                <p className="text-sm text-gray-700">✓ 50+ bags</p>
                <p className="text-sm text-gray-700">✓ Full customization</p>
                <p className="text-sm text-gray-700">✓ Priority delivery</p>
                <p className="text-sm text-gray-700">✓ Flexible payment terms</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            * Prices vary based on product selection. Contact us for a detailed quote.
          </p>
        </div>
      </div>

      {/* Popular Collections */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif tracking-wider mb-4">
            Popular Corporate Gifting Collections
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our most requested styles for corporate gifting, loved by teams across India.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group">
            <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
              <Image
                src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(png)/VISTARA%20TOTE%20-%20Black/01.png"
                alt="Tote Bags"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Professional Totes</h3>
            <p className="text-gray-600">Perfect for daily use, fits laptops and documents. Ideal for employees and clients.</p>
          </div>

          <div className="group">
            <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
              <Image
                src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/SANDESH%20TOTE%20(%20png%20)/SANDESH%20TOTE%20-%20Black/01.png"
                alt="Laptop Bags"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">Laptop Bags</h3>
            <p className="text-gray-600">Sleek and functional, designed for modern professionals. Great for tech teams.</p>
          </div>

          <div className="group">
            <div className="relative aspect-square mb-4 overflow-hidden rounded-xl">
              <Image
                src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(png)/VISTARA%20TOTE%20-%20Tan/01.png"
                alt="Executive Bags"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <h3 className="text-xl font-semibold mb-3">Executive Collection</h3>
            <p className="text-gray-600">Premium bags for senior leadership and VIP client gifting occasions.</p>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-gray-50 py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif tracking-wider mb-4">
                Request a Quote
              </h2>
              <p className="text-gray-600">
                Fill out the form below and our corporate gifting team will get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium mb-2">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Your Company Pvt. Ltd."
                  />
                </div>

                <div>
                  <label htmlFor="contactPerson" className="block text-sm font-medium mb-2">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    id="contactPerson"
                    name="contactPerson"
                    required
                    value={formData.contactPerson}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                    Quantity Required *
                  </label>
                  <select
                    id="quantity"
                    name="quantity"
                    required
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select quantity range</option>
                    <option value="10-24">10-24 bags</option>
                    <option value="25-49">25-49 bags</option>
                    <option value="50-99">50-99 bags</option>
                    <option value="100+">100+ bags</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="customization" className="block text-sm font-medium mb-2">
                    Customization Required
                  </label>
                  <select
                    id="customization"
                    name="customization"
                    value={formData.customization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Select customization</option>
                    <option value="none">No customization</option>
                    <option value="embossing">Logo embossing</option>
                    <option value="metal-tag">Metal tag with logo</option>
                    <option value="custom-packaging">Custom packaging</option>
                    <option value="full">Full customization</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Tell us about your event, preferred colors, delivery timeline, or any special requirements..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 rounded-lg uppercase tracking-wider font-semibold hover:bg-gray-800 transition-colors"
              >
                Submit Inquiry
              </button>

              {submitted && (
                <div className="mt-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center">
                  Thank you! We'll get back to you within 24 hours.
                </div>
              )}
            </form>

            <p className="text-center text-sm text-gray-600 mt-6">
              Prefer to talk directly? Email us at <a href="mailto:corporate@kibanalife.com" className="text-black font-semibold underline">corporate@kibanalife.com</a> or call <a href="tel:+919876543210" className="text-black font-semibold underline">+91 98765 43210</a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
