"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function OurStoryPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-[0.15em] mb-6">
            OUR STORY
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Where craftsmanship meets contemporary design, and every bag tells a story of passion, 
            dedication, and timeless elegance.
          </p>
        </div>

        {/* Journey Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
            <Image
              src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Teal%20Blue/09-10-2025--livia00539.jpg"
              alt="KibanaLife Craftsmanship"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-3xl font-serif tracking-wider">The Beginning</h2>
            <p className="text-gray-600 leading-relaxed">
              KibanaLife was born from a simple vision: to create bags that are more than just 
              accessories – they are companions in your life's journey. Founded with a passion 
              for quality and design, we set out to redefine luxury in the world of handbags.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every piece we create is a testament to our commitment to excellence. From the 
              selection of premium materials to the final stitch, we ensure that each bag meets 
              the highest standards of craftsmanship.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="bg-gray-50 rounded-2xl p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-serif tracking-wider text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black flex items-center justify-center">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-semibold mb-3 uppercase tracking-wider text-sm">Quality First</h3>
              <p className="text-sm text-gray-600">
                We source only the finest materials and employ skilled artisans who pour their 
                expertise into every detail.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black flex items-center justify-center">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="font-semibold mb-3 uppercase tracking-wider text-sm">Sustainability</h3>
              <p className="text-sm text-gray-600">
                We're committed to ethical practices, using vegan leather and sustainable 
                production methods.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-black flex items-center justify-center">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="font-semibold mb-3 uppercase tracking-wider text-sm">Timeless Design</h3>
              <p className="text-sm text-gray-600">
                Our designs transcend trends, offering you pieces that remain stylish and 
                relevant for years to come.
              </p>
            </div>
          </div>
        </div>

        {/* Craftsmanship Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="flex flex-col justify-center space-y-6 order-2 md:order-1">
            <h2 className="text-3xl font-serif tracking-wider">Handcrafted Excellence</h2>
            <p className="text-gray-600 leading-relaxed">
              Each KibanaLife bag is meticulously handcrafted by skilled artisans who have 
              perfected their craft over years. From pattern cutting to the final touches, 
              every step is executed with precision and care.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We believe in the beauty of imperfection – the subtle variations that make each 
              piece unique. This is not mass production; this is art meeting functionality.
            </p>
          </div>
          <div className="relative aspect-[4/3] rounded-lg overflow-hidden order-1 md:order-2">
            <Image
              src="https://hrahjiccbwvhtocabxja.supabase.co/storage/v1/object/public/product-images/VISTARA%20TOTE%20(%20png%20)/VISTARA%20TOTE%20-%20Milky%20Blue/09-10-2025--livia00521.jpg"
              alt="KibanaLife Quality"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Made in India Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-8 md:p-12 mb-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif tracking-wider mb-6">Proudly Made in India</h2>
            <p className="text-gray-200 leading-relaxed mb-8">
              We take immense pride in our Indian heritage. Every KibanaLife bag is designed 
              and crafted in India, supporting local artisans and celebrating the rich tradition 
              of Indian craftsmanship while embracing modern design sensibilities.
            </p>
            <div className="flex flex-wrap justify-center gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Made in India</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Premium</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">Materials</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">Handcrafted</div>
                <div className="text-sm text-gray-300 uppercase tracking-wider">With Love</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-serif tracking-wider mb-6">Join Our Journey</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Be part of the KibanaLife story. Discover our collections and find the perfect 
            companion for your life's adventures.
          </p>
          <Link href="/shop">
            <Button className="px-8 py-6 uppercase tracking-wider bg-black text-white hover:bg-gray-800">
              Explore Our Collection
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
