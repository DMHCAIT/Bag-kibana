"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, Mail, Phone, MapPin, ShoppingCart, Calendar } from "lucide-react";

interface Customer {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  order_count?: number;
  total_spent?: number;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch("/api/admin/customers");
      
      if (!response.ok) {
        throw new Error(`Failed to fetch customers: HTTP ${response.status}`);
      }
      
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
      setError(error instanceof Error ? error.message : "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (customer.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-full mb-4"></div>
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Error Loading Customers
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
          <button
            onClick={fetchCustomers}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">
            Manage and view customer information
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">
              {customers.length}
            </p>
            <p className="text-sm text-gray-600">Total Customers</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {customers.filter((c) => {
                const date = new Date(c.created_at);
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                return date >= thirtyDaysAgo;
              }).length}
            </p>
            <p className="text-sm text-gray-600">New (30 days)</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {customers.filter((c) => (c.order_count || 0) > 0).length}
            </p>
            <p className="text-sm text-gray-600">Active Customers</p>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? "No customers match your search" : "No customers yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Spent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium">
                          {customer.full_name?.[0]?.toUpperCase() ||
                            customer.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {customer.full_name || "No Name"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {customer.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {customer.order_count || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">
                        ₹{(customer.total_spent || 0).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {customer.created_at ? format(new Date(customer.created_at), "MMM dd, yyyy") : 'N/A'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
