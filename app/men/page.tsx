"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function MenPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-16 md:py-24">
        {/* Coming Soon Section */}
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <span className="text-5xl">👜</span>
          </div>
          
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-serif tracking-[0.15em] mb-6 text-gray-900">
            COMING SOON
          </h1>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-12 max-w-2xl mx-auto">
            We're crafting an exclusive collection of luxury bags for men. 
            <br className="hidden md:block" />
            Premium designs for the modern gentleman.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              variant="outline" 
              className="px-8 py-6 rounded-lg border-2 border-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-300 text-gray-900 font-medium tracking-wider uppercase"
            >
              Notify Me When Available
            </Button>
            <Link href="/women">
              <Button 
                className="w-full sm:w-auto px-8 py-6 rounded-lg bg-black text-white hover:bg-gray-800 transition-all duration-300 font-medium tracking-wider uppercase"
              >
                Browse Women's Collection
              </Button>
            </Link>
          </div>
          
          {/* Decorative Elements */}
          <div className="flex justify-center gap-3 mt-16">
            {[0, 1, 2].map((idx) => (
              <div
                key={idx}
                className={`w-3 h-3 rounded-full transition-all ${
                  idx === 1 ? "bg-gray-900 scale-125" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-medium mb-2 uppercase tracking-wider text-sm">Premium Quality</h3>
            <p className="text-sm text-gray-600">Handcrafted with the finest materials</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-medium mb-2 uppercase tracking-wider text-sm">Modern Design</h3>
            <p className="text-sm text-gray-600">Sleek and contemporary aesthetics</p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="font-medium mb-2 uppercase tracking-wider text-sm">Versatile Use</h3>
            <p className="text-sm text-gray-600">Perfect for work, travel, and everyday</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

