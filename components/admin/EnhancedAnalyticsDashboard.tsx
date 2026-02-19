"use client";

import { useState, useEffect } from "react";

// Type definitions
interface Order {
  id: string;
  total: number;
  payment_status: string;
  created_at: string;
  user_id: string;
}

interface Customer {
  id: string;
  created_at: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
  stock: number;
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  revenueChange: number;
  ordersChange: number;
  customersChange: number;
  averageOrderValue: number;
}

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

interface ProductSales {
  name: string;
  revenue: number;
  units: number;
  color: string;
}

interface CategoryData {
  category: string;
  value: number;
  color: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function EnhancedAnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    revenueChange: 0,
    ordersChange: 0,
    customersChange: 0,
    averageOrderValue: 0,
  });

  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [productSales, setProductSales] = useState<ProductSales[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchSalesData(),
        fetchProductSales(),
        fetchCategoryData(),
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Current period
      const currentStart = getDateRange().start;
      const currentEnd = getDateRange().end;
      
      // Previous period for comparison
      const previousStart = subDays(currentStart, getDaysInRange());
      const previousEnd = subDays(currentEnd, getDaysInRange());

      // Fetch current period data
      const [ordersResponse, customersResponse, productsResponse] = await Promise.all([
        supabase
          .from('orders')
          .select('total, payment_status, created_at')
          .gte('created_at', currentStart.toISOString())
          .lte('created_at', currentEnd.toISOString()),
        
        supabase
          .from('users')
          .select('id, created_at')
          .eq('role', 'customer')
          .gte('created_at', currentStart.toISOString())
          .lte('created_at', currentEnd.toISOString()),
        
        supabase
          .from('products')
          .select('id')
      ]);

      // Fetch previous period data for comparison
      const [prevOrdersResponse, prevCustomersResponse] = await Promise.all([
        supabase
          .from('orders')
          .select('total, payment_status')
          .gte('created_at', previousStart.toISOString())
          .lte('created_at', previousEnd.toISOString()),
        
        supabase
          .from('users')
          .select('id')
          .eq('role', 'customer')
          .gte('created_at', previousStart.toISOString())
          .lte('created_at', previousEnd.toISOString())
      ]);

      const currentOrders = ordersResponse.data || [];
      const currentCustomers = customersResponse.data || [];
      const products = productsResponse.data || [];
      const prevOrders = prevOrdersResponse.data || [];
      const prevCustomers = prevCustomersResponse.data || [];

      // Calculate current stats
      const paidOrders = currentOrders.filter((o: Order) => o.payment_status === 'paid');
      const totalRevenue = paidOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
      const totalOrders = currentOrders.length;
      const totalCustomers = currentCustomers.length;
      const totalProducts = products.length;
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

      // Calculate previous period stats
      const prevPaidOrders = prevOrders.filter((o: Order) => o.payment_status === 'paid');
      const prevRevenue = prevPaidOrders.reduce((sum: number, order: Order) => sum + order.total, 0);
      const prevOrderCount = prevOrders.length;
      const prevCustomerCount = prevCustomers.length;

      // Calculate percentage changes
      const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
      const ordersChange = prevOrderCount > 0 ? ((totalOrders - prevOrderCount) / prevOrderCount) * 100 : 0;
      const customersChange = prevCustomerCount > 0 ? ((totalCustomers - prevCustomerCount) / prevCustomerCount) * 100 : 0;

      setStats({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
        revenueChange,
        ordersChange,
        customersChange,
        averageOrderValue,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSalesData = async () => {
    try {
      const { start, end } = getDateRange();
      
      const { data, error } = await supabase
        .from('orders')
        .select('total, payment_status, created_at')
        .eq('payment_status', 'paid')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at');

      if (error) {
        console.error('Error fetching sales data:', error);
        return;
      }

      // Group by date
      const salesByDate: { [key: string]: { revenue: number; orders: number } } = {};
      
      data?.forEach((order: Order) => {
        const date = format(new Date(order.created_at), 'MMM dd');
        if (!salesByDate[date]) {
          salesByDate[date] = { revenue: 0, orders: 0 };
        }
        salesByDate[date].revenue += order.total;
        salesByDate[date].orders += 1;
      });

      const chartData = Object.entries(salesByDate).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }));

      setSalesData(chartData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const fetchProductSales = async () => {
    try {
      const { start, end } = getDateRange();
      
      const { data, error } = await supabase
        .from('orders')
        .select('items')
        .eq('payment_status', 'paid')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (error) {
        console.error('Error fetching product sales:', error);
        return;
      }

      // Aggregate product sales
      const productSales: { [key: string]: { revenue: number; units: number } } = {};
      
      data?.forEach((order: any) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            if (!productSales[item.name]) {
              productSales[item.name] = { revenue: 0, units: 0 };
            }
            productSales[item.name].revenue += item.price * item.quantity;
            productSales[item.name].units += item.quantity;
          });
        }
      });

      const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b.revenue - a.revenue)
        .slice(0, 10)
        .map(([name, data], index) => ({
          name,
          revenue: data.revenue,
          units: data.units,
          color: COLORS[index % COLORS.length],
        }));

      setProductSales(topProducts);
    } catch (error) {
      console.error('Error fetching product sales:', error);
    }
  };

  const fetchCategoryData = async () => {
    try {
      const { start, end } = getDateRange();
      
      const { data, error } = await supabase
        .from('orders')
        .select('items')
        .eq('payment_status', 'paid')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      if (error) {
        console.error('Error fetching category data:', error);
        return;
      }

      // Aggregate by category
      const categoryRevenue: { [key: string]: number } = {};
      
      data?.forEach((order: any) => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const category = item.category || 'Other';
            if (!categoryRevenue[category]) {
              categoryRevenue[category] = 0;
            }
            categoryRevenue[category] += item.price * item.quantity;
          });
        }
      });

      const chartData = Object.entries(categoryRevenue)
        .map(([category, value], index) => ({
          category,
          value,
          color: COLORS[index % COLORS.length],
        }))
        .sort((a, b) => b.value - a.value);

      setCategoryData(chartData);
    } catch (error) {
      console.error('Error fetching category data:', error);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    
    switch (timeRange) {
      case 'week':
        return { start: startOfWeek(now), end: endOfWeek(now) };
      case 'month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'year':
        return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear(), 11, 31) };
      default:
        return { start: subDays(now, 7), end: now };
    }
  };

  const getDaysInRange = () => {
    switch (timeRange) {
      case 'week':
        return 7;
      case 'month':
        return 30;
      case 'year':
        return 365;
      default:
        return 7;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your store performance and insights</p>
        </div>
        <div className="flex gap-2">
          {['week', 'month', 'year'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
                <div className={`flex items-center text-sm mt-1 ${
                  stats.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.revenueChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(stats.revenueChange).toFixed(1)}%
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{stats.totalOrders}</p>
                <div className={`flex items-center text-sm mt-1 ${
                  stats.ordersChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.ordersChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(stats.ordersChange).toFixed(1)}%
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Customers</p>
                <p className="text-2xl font-bold">{stats.totalCustomers}</p>
                <div className={`flex items-center text-sm mt-1 ${
                  stats.customersChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.customersChange >= 0 ? (
                    <ArrowUpRight className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 mr-1" />
                  )}
                  {Math.abs(stats.customersChange).toFixed(1)}%
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                <p className="text-2xl font-bold">₹{stats.averageOrderValue.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">{stats.totalProducts} products</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
                <Line type="monotone" dataKey="revenue" stroke="#0088FE" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Product and Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productSales.slice(0, 5).map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: product.color }}
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-500">{product.units} units sold</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={(props: any) => `${props.category}: ₹${props.value.toLocaleString()}`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}