"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { ArrowLeft, Lock, Settings } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center space-y-6">
            <div className="relative">
              <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <Settings className="w-6 h-6 text-blue-500 absolute -top-1 -right-1 animate-spin" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-2xl font-serif text-gray-900">
                Login Temporarily Disabled
              </h1>
              <p className="text-gray-600">
                We are currently updating our authentication system to provide you with a better and more secure experience.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-blue-900">Admin Access Available</h3>
              <p className="text-sm text-blue-700">
                Admin panel access has been enabled without authentication during the system maintenance period.
              </p>
              <Link 
                href="/admin" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Access Admin Panel
              </Link>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                You can still browse our products and add items to your cart. 
                Login will be restored once the authentication system is fully configured.
              </p>
              
              <div className="flex gap-3 justify-center">
                <Link 
                  href="/shop" 
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Browse Products
                </Link>
                <Link 
                  href="/contact" 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
