"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Users,
  Download,
  Calendar
} from "lucide-react";

interface ReportData {
  totalRevenue: number;
  paidRevenue: number;
  pendingRevenue: number;
  totalOrders: number;
  paidOrdersCount: number;
  pendingOrdersCount: number;
  averageOrderValue: number;
  totalCustomers: number;
  revenueChange: number;
  ordersChange: number;
  topProducts: Array<{
    id: string;
    name: string;
    color: string;
    total_sold: number;
    revenue: number;
  }>;
  topCustomers: Array<{
    id: string;
    name: string;
    email: string;
    total_spent: number;
    order_count: number;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
  }>;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState(30); // days

  useEffect(() => {
    fetchReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/reports?days=${dateRange}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error("Failed to fetch report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData) return;

    const csvContent = [
      ["Kibana Sales Report"],
      [`Generated: ${format(new Date(), "MMM dd, yyyy HH:mm")}`],
      [`Period: Last ${dateRange} days`],
      [],
      ["Summary Metrics"],
      ["Total Revenue", `₹${(reportData.totalRevenue || 0).toLocaleString("en-IN")}`],
      ["Total Orders", reportData.totalOrders || 0],
      ["Average Order Value", `₹${(reportData.averageOrderValue || 0).toLocaleString("en-IN")}`],
      ["Total Customers", reportData.totalCustomers || 0],
      [],
      ["Top Products"],
      ["Product", "Color", "Units Sold", "Revenue"],
      ...(reportData.topProducts || []).map(p => [
        p.name,
        p.color,
        p.total_sold || 0,
        `₹${(p.revenue || 0).toLocaleString("en-IN")}`
      ]),
      [],
      ["Top Customers"],
      ["Name", "Email", "Orders", "Total Spent"],
      ...(reportData.topCustomers || []).map(c => [
        c.name,
        c.email,
        c.order_count || 0,
        `₹${(c.total_spent || 0).toLocaleString("en-IN")}`
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kibana-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading reports...</div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load report data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
          <p className="text-gray-600 mt-1">
            Analytics and insights for your business
          </p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <select
            value={dateRange}
            onChange={(e) => setDateRange(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{(reportData?.totalRevenue || 0).toLocaleString("en-IN")}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${(reportData?.revenueChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-sm ${(reportData?.revenueChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(reportData?.revenueChange || 0) >= 0 ? '+' : ''}{reportData?.revenueChange || 0}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Paid Revenue</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                ₹{(reportData?.paidRevenue || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {reportData?.paidOrdersCount || 0} paid orders
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Revenue (COD)</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                ₹{(reportData?.pendingRevenue || 0).toLocaleString("en-IN")}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {reportData?.pendingOrdersCount || 0} pending orders
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {reportData?.totalOrders || 0}
              </p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={`w-4 h-4 ${(reportData?.ordersChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`} />
                <span className={`text-sm ${(reportData?.ordersChange || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {(reportData?.ordersChange || 0) >= 0 ? '+' : ''}{reportData?.ordersChange || 0}%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{(reportData?.averageOrderValue || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {reportData?.totalCustomers || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {reportData?.totalOrders && reportData?.totalCustomers 
                  ? ((reportData.totalOrders / Math.max(reportData.totalCustomers, 1)) * 100).toFixed(1)
                  : '0'}%
              </p>
              <p className="text-xs text-gray-500 mt-1">Orders per customer</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Top Products</h2>
        {(reportData?.topProducts || []).length === 0 ? (
          <p className="text-gray-500 text-center py-8">No product data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Units Sold</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(reportData?.topProducts || []).map((product) => (
                  <tr key={product.id}>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.color}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{product.total_sold || 0}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      ₹{(product.revenue || 0).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Top Customers */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Top Customers</h2>
        {(reportData?.topCustomers || []).length === 0 ? (
          <p className="text-gray-500 text-center py-8">No customer data available</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Orders</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(reportData?.topCustomers || []).map((customer) => (
                  <tr key={customer.id}>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{customer.order_count || 0}</td>
                    <td className="py-3 px-4 font-medium text-gray-900">
                      ₹{(customer.total_spent || 0).toLocaleString("en-IN")}
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
