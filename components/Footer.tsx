import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";

// Custom Threads icon component
function ThreadsIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <path d="M141.537 88.988a66.667 66.667 0 0 0-2.518-1.143c-1.482-27.307-16.403-42.94-41.457-43.1h-.34c-14.986 0-27.449 6.396-35.12 18.036l13.779 9.452c5.73-8.695 14.927-10.548 21.153-10.548h.229c8.249.053 14.474 2.452 18.503 7.13 2.932 3.405 4.893 8.111 5.864 14.05-7.314-1.243-15.224-1.626-23.68-1.141-23.82 1.371-39.134 15.265-38.105 34.568.522 9.792 5.4 18.216 13.735 23.719 7.047 4.652 16.124 6.927 25.557 6.412 12.458-.683 22.231-5.436 29.05-14.127 5.178-6.6 8.453-15.153 9.899-25.93 5.937 3.583 10.337 8.298 12.767 13.966 4.132 9.635 4.373 25.468-8.546 38.376-11.319 11.308-24.925 16.2-45.488 16.351-22.809-.169-40.06-7.484-51.275-21.742C35.236 139.966 29.808 120.682 29.605 96c.203-24.682 5.63-43.966 16.133-57.317C56.954 24.425 74.204 17.11 97.013 16.94c22.975.17 40.526 7.52 52.171 21.847 5.71 7.026 10.015 15.86 12.853 26.162l16.147-4.308c-3.44-12.68-8.853-23.606-16.219-32.668C147.036 9.607 125.202.195 97.07 0h-.113C68.882.195 47.292 9.642 32.788 28.08 19.882 44.485 13.224 67.315 13.001 95.932L13 96v.067c.224 28.617 6.882 51.447 19.788 67.854C47.292 182.358 68.882 191.806 96.957 192h.113c24.96-.173 42.554-6.708 57.048-21.19 18.963-18.945 18.392-42.691 12.142-57.27-4.484-10.454-13.033-18.945-24.723-24.552ZM98.44 129.507c-10.44.588-21.286-4.098-21.82-14.135-.397-7.442 5.296-15.746 22.461-16.735 1.966-.114 3.895-.169 5.79-.169 6.235 0 12.068.606 17.371 1.765-1.978 24.702-13.58 28.713-23.802 29.274Z" />
    </svg>
  );
}

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
                href="https://www.instagram.com/kibanalifeofficial/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://threads.net"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Threads"
              >
                <ThreadsIcon className="w-5 h-5" />
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
        <div className="grid grid-cols-3 gap-6 mb-16 pb-16 border-b border-gray-800">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              Premium Quality
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.15em] text-gray-400">
              Easy Returns
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
