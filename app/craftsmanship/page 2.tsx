import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CraftsmanshipPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif tracking-wide mb-8">Our Craftsmanship</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            At KIBANA, we believe that true luxury lies in the details. Every handbag we create is a testament to exceptional craftsmanship, blending traditional techniques with modern design sensibilities.
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Premium Materials</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We source only the finest materials – from supple full-grain leather to durable hardware. Each component is carefully selected to ensure longevity and timeless appeal.
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Meticulous Attention to Detail</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our artisans bring decades of experience to every piece. From precise stitching to flawless finishing, no detail is too small to perfect. Each bag undergoes rigorous quality checks before reaching you.
          </p>
          <h2 className="text-2xl font-semibold mt-12 mb-4">Timeless Design</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            Our designs are created to transcend trends. We craft bags that become cherished companions for years to come, evolving beautifully with time and use.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

