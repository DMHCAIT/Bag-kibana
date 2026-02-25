import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto py-20">
          {/* Large 404 */}
          <p className="text-[120px] leading-none font-light text-gray-100 select-none">
            404
          </p>
          <h1
            className="text-2xl md:text-3xl tracking-[0.15em] uppercase text-[#2C2C2C] mb-4 -mt-4"
            style={{ fontFamily: "var(--font-abhaya, serif)" }}
          >
            Page Not Found
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed mb-10">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3 bg-[#2C2C2C] text-white text-xs tracking-[0.2em] uppercase hover:bg-[#444] transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/shop"
              className="w-full sm:w-auto px-8 py-3 border border-[#2C2C2C] text-[#2C2C2C] text-xs tracking-[0.2em] uppercase hover:bg-gray-50 transition-colors"
            >
              Shop All Bags
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
