import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Return & Exchange Policy - KIBANA",
  description: "Learn about KIBANA's return and exchange policy for luxury handbags.",
};

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-wide">Return & Exchange Policy</h1>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg mb-12 border border-blue-200">
          <p className="text-lg text-gray-800 leading-relaxed">
            At Kibana, your satisfaction is at the heart of everything we do. Every product is crafted with care, and we hope it brings joy to your everyday moments. If for any reason it doesn't meet your expectations, we're here to help.
          </p>
        </div>

        <div className="space-y-12">
          {/* Important Exceptions */}
          <section className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">⚠️</span>
              Important Exceptions to Our Policy
            </h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-yellow-600 rounded-full shrink-0"></span>
                <span><strong>Return and refund policy is NOT applicable on items bought during a sale or special events.</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-yellow-600 rounded-full shrink-0"></span>
                <span>Returned items must be <strong>unused, unworn, and in original packaging</strong>, including dust bags, tags, and accessories.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-yellow-600 rounded-full shrink-0"></span>
                <span>Returned items must have <strong>no visible signs of wear or use</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 w-1.5 h-1.5 bg-yellow-600 rounded-full shrink-0"></span>
                <span>Orders cannot be modified or cancelled after the <strong>12 hour cancellation window</strong>.</span>
              </li>
            </ul>
          </section>

          {/* Damaged or Defective Items */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">📦</span>
              Damaged or Defective Items
            </h2>
            <div className="space-y-4 text-gray-700">
              <p>
                At Kibana, every product goes through careful craftsmanship and strict quality checks before it reaches you. Still, on rare occasions, shipping or handling may cause unexpected damage — and we want to ensure you are supported immediately if that happens.
              </p>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h3 className="font-semibold text-lg mb-3 text-red-900">If Package Arrives Damaged</h3>
                <p className="mb-3">
                  If you notice that the outer packaging is <strong>torn, crushed, or visibly damaged</strong> during delivery, we request you to kindly <strong>refuse the delivery</strong> and inform us right away.
                </p>
                <p>Our team will coordinate with our logistics partner to resolve the issue as quickly as possible.</p>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-900">🎥 Unboxing Video Required</h3>
                <p className="mb-3">
                  For your safety and ours, we request all customers to <strong>record a video while unboxing the product for the very first time</strong>. This helps us clearly verify if any damage or defect was present upon arrival.
                </p>
                <div className="bg-white p-4 rounded mt-4">
                  <p className="text-sm font-semibold mb-2">To File a Claim:</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm">
                    <li>Record unboxing video from start to finish</li>
                    <li>Notify us within <strong>24 hours</strong> of receiving the order</li>
                    <li>Send the unboxing video along with your order details</li>
                    <li>We will arrange a priority replacement after verification</li>
                  </ol>
                </div>
              </div>

              <div className="bg-gray-100 p-6 rounded-lg">
                <h3 className="font-semibold text-lg mb-3">📌 Important Notice</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                    <span>We are <strong>unable to accept claims or offer replacements without an unboxing video</strong>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                    <span>Claims reported after the replacement/return window has expired cannot be processed.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1.5 w-1.5 h-1.5 bg-gray-600 rounded-full shrink-0"></span>
                    <span>If you accept a package with minor outer-box damage, please ensure the delivery agent <strong>notes it on the slip</strong>.</span>
                  </li>
                </ul>
              </div>

              <p className="italic text-center text-gray-600 text-lg pt-4">
                <strong>A gentle reminder:</strong> We may not be able to assist with damages reported after delivery is fully accepted without documentation.
              </p>
            </div>
          </section>

          {/* Order Cancellation */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">❌</span>
              Order Cancellation
            </h2>
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-orange-600 rounded-full shrink-0"></span>
                  <span>Orders can be cancelled within <strong>12 hours</strong> of placing the order.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-orange-600 rounded-full shrink-0"></span>
                  <span>After 12 hours, orders cannot be modified or cancelled.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-orange-600 rounded-full shrink-0"></span>
                  <span>To cancel your order, please contact us immediately at <a href="mailto:support@kibanalife.com" className="text-blue-600 hover:underline">support@kibanalife.com</a></span>
                </li>
              </ul>
            </div>
          </section>

          {/* How to Initiate a Return */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <span className="text-3xl">📝</span>
              How to Initiate a Return or Exchange
            </h2>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <ol className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-semibold shrink-0">1</span>
                  <div>
                    <strong>Contact Us:</strong> Email us at <a href="mailto:support@kibanalife.com" className="text-blue-600 hover:underline">support@kibanalife.com</a> with your order number and reason for return.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-semibold shrink-0">2</span>
                  <div>
                    <strong>Receive Authorization:</strong> Our team will review your request and provide return authorization if eligible.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-semibold shrink-0">3</span>
                  <div>
                    <strong>Ship the Item:</strong> Package the item securely with all original packaging and ship it back to us.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full font-semibold shrink-0">4</span>
                  <div>
                    <strong>Processing:</strong> Once we receive and inspect your return, we will process your refund or exchange within 5-7 business days.
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Closing Message */}
          <section className="bg-gradient-to-r from-purple-900 to-blue-900 text-white p-8 rounded-lg text-center">
            <h3 className="text-2xl font-serif mb-4">Your Satisfaction Means Everything to Us</h3>
            <p className="text-lg mb-6">
              We're always here to make things right. If you have any questions or concerns, please don't hesitate to reach out.
            </p>
            <a 
              href="mailto:support@kibanalife.com" 
              className="inline-block px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
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

