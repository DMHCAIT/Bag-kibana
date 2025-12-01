"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Users,
  Eye,
  Star,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Product } from "@/lib/types/product";

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
          publishedProducts: products.filter((p: any) => (p.status || 'published') === 'published').length,
          draftProducts: products.filter((p: any) => (p.status || 'published') === 'draft').length,
          totalValue: products.reduce((sum: number, p: Product) => sum + (p.price * ((p as any).stock || 100)), 0),
          lowStockProducts: products.filter((p: any) => ((p as any).stock || 100) <= 10).length,
          featuredProducts: products.filter((p: any) => (p as any).isFeatured === true).length,
          newArrivals: products.filter((p: any) => (p as any).isNewArrival === true).length,
        };

        setStats(statsData);

        // Get recent products (sorted by updatedAt)
        const sorted = [...products].sort((a: any, b: any) => {
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif tracking-wide">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to Kibana Admin Panel</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat) => (
              <Link key={stat.title} href={stat.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`${stat.color} text-white p-3 rounded-lg`}>
                        <stat.icon className="w-8 h-8" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/admin/products/new">
                  <Button className="w-full bg-black text-white hover:bg-gray-800">
                    Add Product
                  </Button>
                </Link>
                <Link href="/admin/products">
                  <Button variant="outline" className="w-full">
                    View Products
                  </Button>
                </Link>
                <Link href="/admin/orders">
                  <Button variant="outline" className="w-full">
                    View Orders
                  </Button>
                </Link>
                <Link href="/admin/reports">
                  <Button variant="outline" className="w-full">
                    View Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recently Updated Products</CardTitle>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentProducts.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No products yet</p>
              ) : (
                <div className="space-y-4">
                  {recentProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/admin/products/${product.id}/edit`}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition"
                    >
                      <div className="relative w-16 h-16 bg-gray-100 rounded shrink-0">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover rounded"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No image
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{product.name} - {product.color}</p>
                        <p className="text-sm text-gray-500">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₹{product.price.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          Stock: {(product as any).stock || 100}
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
            <Card className="border-l-4 border-red-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                  Low Stock Alert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  You have {stats.lowStockProducts} product(s) with low stock levels (≤10 units).
                  Consider restocking soon.
                </p>
                <Link href="/admin/products">
                  <Button variant="outline" size="sm" className="mt-4">
                    View Products
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
