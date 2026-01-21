import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Shipping Policy - KIBANA",
  description: "Learn about KIBANA's shipping methods, delivery times, and international shipping options.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Shipping Policy</h1>
        <p className="text-gray-600 mb-12">
          Thank you for shopping with KIBANA. We want your luxury handbag experience to be smooth from checkout to delivery. Please read our shipping policy below.
        </p>

        <div className="space-y-12">
          {/* Order Processing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">📦</span>
              1. Order Processing
            </h2>
            <ul className="space-y-3 text-gray-700 ml-8">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>All orders are processed within <strong>1–2 business days</strong> from the date of purchase.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Orders placed on weekends or public holidays will be processed the next business day.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Once your order has shipped, you will receive an email confirmation with tracking information.</span>
              </li>
            </ul>
          </section>

          {/* Shipping Methods */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">🚚</span>
              2. Shipping Methods
            </h2>
            <div className="space-y-6 ml-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Standard Shipping</h3>
                <p className="text-gray-700">Delivery time: <strong>3–6 business days</strong></p>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
                <p className="text-gray-700">Delivery time: <strong>1-3 business days</strong></p>
                <p className="text-sm text-gray-600 mt-2">Available at an additional charge.</p>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg mb-2">International Shipping</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></span>
                    <span>Delivery time: <strong>7–15 business days</strong>, depending on destination.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></span>
                    <span>International shipping fees are calculated at checkout.</span>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-600 italic">
                <strong>Note:</strong> Delivery times are estimates and may vary due to customs delays, weather, or courier issues.
              </p>
            </div>
          </section>

          {/* Order Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">📍</span>
              3. Order Tracking
            </h2>
            <ul className="space-y-3 text-gray-700 ml-8">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Once your order has shipped, you will receive an email with a tracking number and link to track your package in real time.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>If you do not receive a tracking email, please check your spam folder or contact us at <a href="mailto:support@kibanalife.com" className="text-blue-600 hover:underline">support@kibanalife.com</a></span>
              </li>
            </ul>
          </section>

          {/* Customs, Duties & Taxes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">🌍</span>
              4. Customs, Duties & Taxes (International Orders)
            </h2>
            <ul className="space-y-3 text-gray-700 ml-8">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>KIBANA is not responsible for any customs fees, import duties, or taxes charged by your destination country.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>These charges, if applicable, must be paid by the customer.</span>
              </li>
            </ul>
          </section>

          {/* Shipping Address Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">📮</span>
              5. Shipping Address Information
            </h2>
            <ul className="space-y-3 text-gray-700 ml-8">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Please ensure your shipping address is correct when placing the order.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>KIBANA is not responsible for packages delivered to incorrectly provided addresses.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>If you need to update your address, contact us within <strong>12 hours</strong> of placing the order.</span>
              </li>
            </ul>
          </section>

          {/* Lost, Damaged, or Stolen Packages */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span>
              6. Lost, Damaged, or Stolen Packages
            </h2>
            <ul className="space-y-3 text-gray-700 ml-8">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>If your package is marked "delivered" but you have not received it, please contact the courier first.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>For damaged items, contact us within <strong>48 hours</strong> of receiving the package with photos of the damage.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>We will assist in filing a claim with the courier and help resolve the issue promptly.</span>
              </li>
            </ul>
          </section>

          {/* Shipping Restrictions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">🚫</span>
              7. Shipping Restrictions
            </h2>
            <ul className="space-y-3 text-gray-700 ml-8">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>We do not ship to P.O. boxes in certain countries.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Some regions may have limited shipping availability. We will notify you if delivery to your location is not possible.</span>
              </li>
            </ul>
          </section>

          {/* Contact */}
          <section className="bg-gray-900 text-white p-8 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <p className="mb-4">If you have any questions about our shipping policy, please contact us:</p>
            <a 
              href="mailto:support@kibanalife.com" 
              className="inline-block px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Contact Support
            </a>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

