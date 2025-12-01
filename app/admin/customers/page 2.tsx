"use client";

import { Package } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-600 mt-1">Manage your customer database</p>
      </div>

      <div className="bg-white rounded-lg shadow p-12">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Customer Management Coming Soon
          </h3>
          <p className="text-gray-600">
            This feature is under development. Customer data will be available here soon.
          </p>
        </div>
      </div>
    </div>
  );
}

