"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MenPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl mx-auto text-center py-16">
          {/* Icon */}
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-6xl">👜</span>
          </div>
          
          {/* Main Heading */}
          <h1 className="section-title mb-6">
            COMING SOON
          </h1>
          
          {/* Description */}
          <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-xl mx-auto" style={{fontFamily: 'var(--font-abhaya)'}}>
            We're crafting an exclusive collection of luxury bags for men. Stay tuned for sophisticated designs tailored for the modern gentleman.
          </p>
          
          {/* CTA Button */}
          <Link href="/women">
            <Button className="px-8 py-6 rounded-lg bg-black text-white hover:bg-gray-800 font-medium tracking-wider uppercase transition-all duration-300 hover:scale-105">
              Browse Women's Collection
            </Button>
          </Link>
          
          {/* Additional Info */}
          <div className="mt-12 pt-12 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4" style={{fontFamily: 'var(--font-abhaya)'}}>
              Want to be notified when we launch?
            </p>
            <Link href="/#newsletter" className="text-black font-medium hover:underline uppercase tracking-wider text-sm">
              Subscribe to our newsletter →
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

