import Link from "next/link";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-6xl font-serif tracking-wide mb-4">404</h1>
          <h2 className="text-2xl font-medium tracking-wide mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/shop">
              <Button
                variant="outline"
                className="uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300"
              >
                Browse All Products
              </Button>
            </Link>
            <Link href="/">
              <Button className="uppercase tracking-wider bg-black text-white hover:bg-gray-900 transition-all duration-300">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
