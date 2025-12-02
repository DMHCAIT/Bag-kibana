"use client";

import Link from "next/link";
import Header from "@/components/Header";
import { ArrowLeft, Lock, Settings } from "lucide-react";

export default function SignupPage() {
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
                Registration Temporarily Disabled
              </h1>
              <p className="text-gray-600">
                We are currently updating our user registration system to provide enhanced security and features.
              </p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-orange-900">Coming Soon</h3>
              <p className="text-sm text-orange-700">
                New user registration will be available once our authentication system upgrade is complete.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                You can still browse our products and add items to your cart without an account. 
                Registration will be restored soon.
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
                  Get Notified
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
