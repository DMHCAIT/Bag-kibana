"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Star,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Product } from "@/lib/products-data";

interface ProductWithExtras extends Product {
  stock?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  status?: 'published' | 'draft';
}

interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  totalValue: number;
  lowStockProducts: number;
  featuredProducts: number;
  newArrivals: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    totalValue: 0,
    lowStockProducts: 0,
    featuredProducts: 0,
    newArrivals: 0,
  });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all products
      const response = await fetch('/api/admin/products?limit=100');
      const data = await response.json();
      
      if (response.ok && data.products) {
        const products = data.products;

        // Calculate stats
        const statsData: DashboardStats = {
          totalProducts: products.length,
          publishedProducts: products.filter((p: ProductWithExtras) => (p.status || 'published') === 'published').length,
          draftProducts: products.filter((p: ProductWithExtras) => (p.status || 'published') === 'draft').length,
          totalValue: products.reduce((sum: number, p: ProductWithExtras) => sum + (p.price * (p.stock || 100)), 0),
          lowStockProducts: products.filter((p: ProductWithExtras) => (p.stock || 100) <= 10).length,
          featuredProducts: products.filter((p: ProductWithExtras) => p.isFeatured === true).length,
          newArrivals: products.filter((p: ProductWithExtras) => p.isNewArrival === true).length,
        };

        setStats(statsData);

        // Get recent products (sorted by updatedAt)
        interface SortableProduct {
          updatedAt?: string;
          createdAt?: string;
        }
        const sorted = [...products].sort((a: SortableProduct, b: SortableProduct) => {
          const dateA = a.updatedAt || a.createdAt || '2025-01-01';
          const dateB = b.updatedAt || b.createdAt || '2025-01-01';
          return new Date(dateB).getTime() - new Date(dateA).getTime();
        });

        setRecentProducts(sorted.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-500",
      href: "/admin/products",
    },
    {
      title: "Published",
      value: stats.publishedProducts,
      icon: Eye,
      color: "bg-green-500",
      href: "/admin/products?status=published",
    },
    {
      title: "Draft",
      value: stats.draftProducts,
      icon: AlertCircle,
      color: "bg-yellow-500",
      href: "/admin/products?status=draft",
    },
    {
      title: "Inventory Value",
      value: `₹${(stats.totalValue / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: "bg-purple-500",
      href: "/admin/products",
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: TrendingUp,
      color: "bg-red-500",
      href: "/admin/products",
    },
    {
      title: "Featured",
      value: stats.featuredProducts,
      icon: Star,
      color: "bg-indigo-500",
      href: "/admin/products?featured=true",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 -m-6 mb-8 p-8 rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-300 text-lg">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-right">
              <p className="text-gray-400 text-sm">Last updated</p>
              <p className="text-white font-medium">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat) => (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-0 shadow-lg overflow-hidden group">
                  <CardContent className="p-0">
                    <div className="relative">
                      <div className={`${stat.color} absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">{stat.title}</p>
                            <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                          </div>
                          <div className={`${stat.color} text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-8 h-8" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
          </Link>
        ))}
      </div>

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">⚡</span>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/admin/products/new">
                  <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                    <Package className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
                <Link href="/admin/products">
                  <Button variant="outline" className="w-full h-12 border-2 hover:bg-gray-50 hover:border-gray-400 transition-all">
                    <Eye className="w-4 h-4 mr-2" />
                    View Products
                  </Button>
                </Link>
                <Link href="/admin/orders">
                  <Button variant="outline" className="w-full h-12 border-2 hover:bg-gray-50 hover:border-gray-400 transition-all">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    View Orders
                  </Button>
                </Link>
                <Link href="/admin/placements">
                  <Button variant="outline" className="w-full h-12 border-2 hover:bg-gray-50 hover:border-gray-400 transition-all">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Placements
                  </Button>
            </Link>
          </div>
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <span className="text-2xl">📦</span>
                Recently Updated Products
              </CardTitle>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm" className="hover:bg-white">View All →</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-6">
              {recentProducts.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">No products yet</p>
                  <Link href="/admin/products/new">
                    <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                      <Package className="w-4 h-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/admin/products/${product.id}/edit`}
                      className="flex items-center gap-4 p-4 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-xl transition-all border border-transparent hover:border-gray-200 group"
                    >
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-8 h-8" />
            </div>
          )}
        </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{product.name} - {product.color}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">{product.category}</span>
                        </p>
      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">₹{product.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Stock: <span className="font-medium">{(product as ProductWithExtras).stock || 100}</span>
          </p>
                      </div>
        </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Alerts */}
          {stats.lowStockProducts > 0 && (
            <Card className="border-0 border-l-4 border-red-500 shadow-lg bg-gradient-to-r from-red-50 to-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xl">Low Stock Alert</span>
                    <p className="text-sm font-normal text-gray-600 mt-1">Immediate attention required</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg mb-4">
                  <span className="font-bold text-red-600 text-2xl">{stats.lowStockProducts}</span> product(s) with low stock levels (≤10 units).
                  <br />
                  <span className="text-sm">Consider restocking soon to avoid running out.</span>
                </p>
                <Link href="/admin/products">
                  <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    View Low Stock Products
                  </Button>
        </Link>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
