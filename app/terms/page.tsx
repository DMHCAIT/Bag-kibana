import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions - KIBANA",
  description: "Read our terms and conditions for shopping at KIBANA.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Terms & Conditions</h1>
        <p className="text-gray-600 mb-12">
          Welcome to KIBANA. These Terms & Conditions ("Terms") govern your use of our website, services, and purchases made through www.kibanalife.com. By visiting our site or purchasing from us, you agree to these Terms.
        </p>

        <div className="space-y-12">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700">
              These Terms apply to all users of the site, including browsers, customers, merchants, and contributors of content. If you do not agree with these Terms, you may not access or use our services.
            </p>
          </section>

          {/* Product Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Product Information</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>We make every effort to display accurate product colors, materials, and descriptions.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Slight variations in color or texture may occur due to screen settings or camera lighting.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>All products are subject to availability. We reserve the right to discontinue any item at any time.</span>
              </li>
            </ul>
          </section>

          {/* Pricing & Payments */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Pricing & Payments</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>All prices listed on our website are in Rupees unless otherwise stated.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Prices may change without notice.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>We accept payments through approved methods displayed at checkout.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>KIBANA is not responsible for fees charged by banks, payment providers, or currency converters.</span>
              </li>
            </ul>
          </section>

          {/* Order Acceptance */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Order Acceptance</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>After placing an order, you will receive an order confirmation email.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>We reserve the right to refuse or cancel any order for reasons including:</span>
              </li>
            </ul>
            <ul className="ml-12 mt-2 space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full shrink-0"></span>
                <span>Product unavailability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full shrink-0"></span>
                <span>Suspicious payment activity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1 h-1 bg-gray-400 rounded-full shrink-0"></span>
                <span>Incorrect pricing or information</span>
              </li>
            </ul>
            <p className="text-gray-700 mt-3">
              If your order is canceled, we will notify you and issue a refund if necessary.
            </p>
          </section>

          {/* Shipping & Delivery */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Shipping & Delivery</h2>
            <p className="text-gray-700">
              Our shipping and delivery policies are detailed in our{" "}
              <Link href="/shipping-policy" className="text-blue-600 hover:underline font-medium">
                Shipping Policy
              </Link>
              , which is incorporated herein by reference.
            </p>
          </section>

          {/* Returns, Exchanges & Refunds */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Returns, Exchanges & Refunds</h2>
            <p className="text-gray-700">
              Our{" "}
              <Link href="/returns" className="text-blue-600 hover:underline font-medium">
                Return & Refund Policy
              </Link>
              {" "}governs returns and exchanges. To qualify for a return, items must meet the conditions outlined in that policy.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Intellectual Property</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>All content on this website—including images, logos, text, designs, and trademarks—is the property of KIBANA.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>You may not copy, distribute, or use our intellectual property without prior written consent.</span>
              </li>
            </ul>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">8. User Accounts</h2>
            <p className="text-gray-700 mb-3">If you create an account with us:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>You are responsible for maintaining the confidentiality of your login information.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>You agree to provide accurate and updated information.</span>
              </li>
            </ul>
          </section>

          {/* Prohibited Uses */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Prohibited Uses</h2>
            <p className="text-gray-700 mb-3">You may not:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Use the website for fraudulent or unlawful purposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Interfere with site security or functionality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Upload viruses or harmful code</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Violate intellectual property rights</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Harass or abuse others on the platform</span>
              </li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Indemnification</h2>
            <p className="text-gray-700">
              You agree to indemnify and hold KIBANA harmless from any claims, damages, or expenses arising from your breach of these Terms or misuse of our services.
            </p>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Privacy Policy</h2>
            <p className="text-gray-700">
              Your use of our website is also governed by our{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </Link>
              , which explains how we collect and protect your information.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
            <p className="text-gray-700">
              KIBANA reserves the right to update or modify these Terms at any time. Changes become effective immediately upon posting on the website.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gray-900 text-white p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
            <p className="mb-4">If you have any questions or concerns about these Terms and Conditions, please contact us:</p>
            <a 
              href="mailto:support@kibanalife.com" 
              className="inline-block px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Support@kibanalife.com
            </a>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
