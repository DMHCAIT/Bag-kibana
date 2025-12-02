import Link from "next/link";
import { Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="text-center mb-16 pb-16 border-b border-gray-800">
          <h3 className="font-serif text-2xl md:text-3xl tracking-[0.15em] mb-4">
            STAY CONNECTED
          </h3>
          <p className="text-sm md:text-base text-gray-400 mb-6 tracking-wide">
            Subscribe for exclusive offers and updates
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-transparent border border-gray-700 focus:border-white outline-none text-sm tracking-wide transition-colors"
            />
            <button className="px-8 py-3 bg-white text-black hover:bg-gray-200 transition-colors uppercase tracking-wider text-sm font-medium">
              Subscribe
            </button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1 - Shop */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] mb-6 font-medium">
              Shop
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/collections/handbags"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Handbags
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/tote"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Tote Bags
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/clutch"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Clutches
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/sling"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sling Bags
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/men"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Men&apos;s Collection
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2 - About */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] mb-6 font-medium">
              About
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Our Story
                </Link>
              </li>
              <li>
                <Link
                  href="/craftsmanship"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Craftsmanship
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] mb-6 font-medium">
              Support
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Returns & Exchange
                </Link>
              </li>
              <li>
                <Link
                  href="/tracking"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Follow Us */}
          <div>
            <h4 className="text-sm uppercase tracking-[0.2em] mb-6 font-medium">
              Follow Us
            </h4>
            <div className="flex gap-4 mb-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="text-sm text-gray-400">
              <p className="mb-2">Call/WhatsApp:</p>
              <a
                href="tel:+919711414110"
                className="hover:text-white transition-colors"
              >
                +91 97114 14110
              </a>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 pb-16 border-b border-gray-800">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              Lifetime Warranty
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              Premium Leather
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              Free Shipping
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              COD Available
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© KIBANA 2024. All Rights Reserved</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/shipping-policy" className="hover:text-white transition-colors">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
