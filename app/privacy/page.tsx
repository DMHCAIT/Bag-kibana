import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy - KIBANA",
  description: "Learn how KIBANA collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Privacy Policy</h1>
        <p className="text-gray-600 mb-12">
          KIBANA ("we", "us", "our") is committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, store, and protect your data when you visit our website www.kibanalife.com, make a purchase, or interact with our services.
        </p>

        <div className="bg-blue-50 p-6 rounded-lg mb-12 border border-blue-200">
          <p className="text-gray-800">
            <strong>By using our site, you agree to the terms of this Privacy Policy.</strong>
          </p>
        </div>

        <div className="space-y-12">
          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <span className="text-3xl">📋</span>
              1. Information We Collect
            </h2>
            <p className="text-gray-700 mb-6">We collect personal information in the following ways:</p>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">1.1 Information You Provide to Us</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span><strong>Personal details:</strong> Name, email address, phone number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span><strong>Billing & shipping information:</strong> Address, postal code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span><strong>Payment details:</strong> Credit/debit card information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span><strong>Account information:</strong> Username, password</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span><strong>Customer service inquiries:</strong> Messages, reviews, or feedback</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">1.2 Information Collected Automatically</h3>
                <p className="text-gray-700 mb-3">When you access our website, we automatically collect:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span>IP address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span>Device type and browser</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span>Pages visited</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span>Time spent on site</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span>Cookies and tracking technologies (see Section 8)</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">1.3 Information from Third Parties</h3>
                <p className="text-gray-700 mb-3">We may receive information from:</p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span>Payment processors (to confirm transactions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                    <span>Marketing partners (for analytics and advertising)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">⚙️</span>
              2. How We Use Your Information
            </h2>
            <p className="text-gray-700 mb-4">We use your information to:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Process and deliver orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Communicate updates about your order</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Improve our website and customer experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Respond to customer inquiries</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Detect and prevent fraud</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Send promotional emails (with your consent)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Maintain and manage your account</span>
              </li>
            </ul>
          </section>

          {/* Sharing Your Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">🤝</span>
              3. Sharing Your Information
            </h2>
            <div className="bg-green-50 p-6 rounded-lg border-2 border-green-300 mb-4">
              <p className="text-gray-800 font-semibold">
                ✅ We do not sell your personal information.
              </p>
            </div>
            <p className="text-gray-700 mb-4">We may share your data with:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span><strong>Service providers:</strong> shipping carriers, payment processors, marketing tools</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span><strong>Business partners:</strong> analytics and advertising platforms</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span><strong>Legal authorities:</strong> if required by law or to protect our rights</span>
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              All third-party partners are required to protect your information.
            </p>
          </section>

          {/* Payment Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">🔒</span>
              4. Payment Security
            </h2>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></span>
                  <span>We use secure, PCI-compliant payment gateways.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-blue-600 rounded-full shrink-0"></span>
                  <span>Your payment details are encrypted and <strong>never stored on our servers</strong>.</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">⏳</span>
              5. Data Retention
            </h2>
            <p className="text-gray-700 mb-4">We retain your information only as long as necessary for:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Fulfilling your orders</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Providing customer support</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Meeting legal and tax obligations</span>
              </li>
            </ul>
            <p className="text-gray-700 mt-4">
              You may request deletion of your data at any time.
            </p>
          </section>

          {/* Your Privacy Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">✋</span>
              6. Your Privacy Rights
            </h2>
            <p className="text-gray-700 mb-4">Depending on your region (EU, UK, California, etc.), you may have the right to:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">✓ Access your personal data</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">✓ Correct or update your information</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">✓ Request deletion</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">✓ Opt out of marketing emails</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">✓ Request a copy of your data</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="font-semibold mb-2">✓ Withdraw consent</p>
              </div>
            </div>
            <p className="text-gray-700 mt-6">
              To exercise these rights, email us at <a href="mailto:support@kibanalife.com" className="text-blue-600 hover:underline font-medium">support@kibanalife.com</a>
            </p>
          </section>

          {/* Marketing Communications */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">📧</span>
              7. Marketing Communications
            </h2>
            <p className="text-gray-700 mb-4">You may receive:</p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Product updates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>New arrivals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Special offers</span>
              </li>
            </ul>
            <p className="text-gray-700">
              You can unsubscribe at any time by clicking <strong>Unsubscribe</strong> in our emails or contacting us.
            </p>
          </section>

          {/* Cookies & Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">🍪</span>
              8. Cookies & Tracking Technologies
            </h2>
            <p className="text-gray-700 mb-4">We use cookies to:</p>
            <ul className="space-y-3 text-gray-700 mb-4">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Improve website performance</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Remember your preferences</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Analyze visitor behavior</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-black rounded-full shrink-0"></span>
                <span>Show personalized ads</span>
              </li>
            </ul>
            <p className="text-sm text-gray-600 italic">
              You may disable cookies through your browser settings, though some site features may not function fully.
            </p>
          </section>

          {/* Data Protection & Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">🛡️</span>
              9. Data Protection & Security
            </h2>
            <p className="text-gray-700 mb-4">We implement industry-standard measures to protect your data:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold">🔐 SSL encryption</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold">💻 Secure servers</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold">👤 Access controls</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="font-semibold">🔍 Regular security reviews</p>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">👶</span>
              10. Children's Privacy
            </h2>
            <p className="text-gray-700">
              We do not knowingly collect information from individuals <strong>under 16 years of age</strong>. If we discover such data, we will delete it immediately.
            </p>
          </section>

          {/* Changes to Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">📝</span>
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700">
              We may update this Privacy Policy when necessary. Changes will be posted on this page with a new "Last Updated" date.
            </p>
          </section>

          {/* Contact Information */}
          <section className="bg-gradient-to-r from-gray-900 to-black text-white p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <p className="mb-6">If you have questions about this Privacy Policy or want to exercise your rights, contact us:</p>
            <div className="space-y-3">
              <p className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <span>Email: <a href="mailto:support@kibanalife.com" className="text-blue-300 hover:underline">support@kibanalife.com</a></span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-2xl">📍</span>
                <span>Address: House No. 1, 2nd floor KH.No. 581/2 village Sultanpur New Delhi -110030</span>
              </p>
              <p className="flex items-start gap-3">
                <span className="text-2xl">📞</span>
                <span>Phone: <a href="tel:+919711414110" className="text-blue-300 hover:underline">+91 9711414110</a></span>
              </p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}

