import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif tracking-wide mb-8">About KIBANA</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            KIBANA is a luxury handbag brand dedicated to creating timeless pieces that blend elegance with functionality. Founded on the principles of exceptional craftsmanship and innovative design, we believe every woman deserves to carry confidence and style wherever she goes.
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Born from a passion for leather craftsmanship and a vision to create bags that tell stories, KIBANA emerged as a brand that celebrates the modern woman. Each collection is thoughtfully designed to complement diverse lifestyles – from boardroom meetings to weekend getaways.
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Our Values</h2>
          <ul className="list-disc list-inside space-y-3 text-gray-700 mb-6">
            <li><strong>Quality First:</strong> We never compromise on materials or craftsmanship</li>
            <li><strong>Timeless Design:</strong> Our bags transcend fleeting trends</li>
            <li><strong>Sustainability:</strong> We're committed to responsible sourcing and production</li>
            <li><strong>Customer Delight:</strong> Your satisfaction is our ultimate goal</li>
          </ul>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Our Promise</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            When you choose KIBANA, you're not just buying a handbag – you're investing in a piece that will accompany you through life's important moments. We stand behind every product with our lifetime service warranty, ensuring your KIBANA bag remains a trusted companion for years to come.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

