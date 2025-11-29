"use client";

import { useEffect, useState } from "react";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalOrders: number;
  ordersChange: number;
  totalRevenue: number;
  revenueChange: number;
  totalProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  customersChange: number;
  recentOrders: any[];
  status?: string;
  error?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await fetch("/api/admin/dashboard");
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch dashboard data`);
      }
      
      const data = await response.json();
      
      // Check if we got fallback data and show warning
      if (data.status === "fallback") {
        setError(`Warning: ${data.error || "Using fallback data due to database connection issues"}`);
      }
      
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      setError(error instanceof Error ? error.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    fetchDashboardStats();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Dashboard
              </h2>
              <p className="text-red-600">{error}</p>
            </div>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Warning banner component for fallback data
  const WarningBanner = () => {
    if (!error || !stats) return null;
    
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="text-yellow-800 text-sm">
            ⚠️ {error}
          </div>
          <button
            onClick={refreshData}
            className="ml-auto text-yellow-800 hover:text-yellow-900 text-sm underline"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  };

  const statCards = [
    {
      name: "Total Orders",
      value: stats?.totalOrders || 0,
      change: stats?.ordersChange || 0,
      icon: ShoppingCart,
      color: "bg-blue-500",
      href: "/admin/orders",
    },
    {
      name: "Revenue",
      value: `₹${(stats?.totalRevenue || 0).toLocaleString("en-IN")}`,
      change: stats?.revenueChange || 0,
      icon: DollarSign,
      color: "bg-green-500",
      href: "/admin/reports",
    },
    {
      name: "Products",
      value: stats?.totalProducts || 0,
      change: stats?.lowStockProducts || 0,
      icon: Package,
      color: "bg-purple-500",
      href: "/admin/products",
      changeLabel: "low stock",
    },
    {
      name: "Customers",
      value: stats?.totalCustomers || 0,
      change: stats?.customersChange || 0,
      icon: Users,
      color: "bg-orange-500",
      href: "/admin/customers",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Warning banner for fallback data */}
      {stats?.status === "fallback" && <WarningBanner />}
      
      {/* Welcome message */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, Admin!
            </h2>
            <p className="mt-1 text-gray-600">
              Here&apos;s what&apos;s happening with your store today.
            </p>
          </div>
          <button
            onClick={refreshData}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <div className="mt-2 flex items-center text-sm">
                  {stat.change > 0 ? (
                    <>
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-green-600">+{stat.change}%</span>
                    </>
                  ) : stat.change < 0 ? (
                    <>
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      <span className="text-red-600">{stat.change}%</span>
                    </>
                  ) : (
                    <span className="text-gray-500">
                      {stat.changeLabel || "No change"}
                    </span>
                  )}
                  {!stat.changeLabel && (
                    <span className="ml-1 text-gray-500">vs last month</span>
                  )}
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View all →
            </Link>
          </div>
        </div>
        <div className="p-6">
          {!stats?.recentOrders || stats.recentOrders.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No orders yet. Orders will appear here once customers start
              purchasing.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.customer_name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            order.order_status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.order_status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : order.order_status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{order.total.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <Link
          href="/admin/products/new"
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 text-center"
        >
          <Package className="w-12 h-12 mx-auto text-purple-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">Add Product</h3>
          <p className="mt-1 text-sm text-gray-600">
            Add a new product to your inventory
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 text-center"
        >
          <ShoppingCart className="w-12 h-12 mx-auto text-blue-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">
            Process Orders
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            View and manage customer orders
          </p>
        </Link>

        <Link
          href="/admin/reports"
          className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 text-center"
        >
          <TrendingUp className="w-12 h-12 mx-auto text-green-500 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">View Reports</h3>
          <p className="mt-1 text-sm text-gray-600">
            Analyze your sales and performance
          </p>
        </Link>
      </div>
    </div>
  );
}
