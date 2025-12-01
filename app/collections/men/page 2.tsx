import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MenCollectionPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-5xl">👜</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif tracking-[0.15em] mb-6 text-gray-900">
            COMING SOON
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">
            Our men's collection is launching soon. Stay tuned for premium leather accessories designed for the modern gentleman.
          </p>
          <Link href="/women">
            <Button className="px-8 py-6 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-300 font-medium tracking-wider uppercase">
              Browse Women's Collection
            </Button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}

