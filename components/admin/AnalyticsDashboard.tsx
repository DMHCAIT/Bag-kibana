'use client';

import { useEffect, useState } from 'react';

interface AnalyticsData {
  metrics: {
    total_revenue: number;
    total_orders: number;
    average_order_value: number;
    unique_customers: number;
  };
  orders_by_status: Record<string, number>;
  orders_by_payment_method: Record<string, number>;
  daily_revenue: Array<{ date: string; revenue: number }>;
  top_products: Array<{
    product_name: string;
    quantity: number;
    revenue: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const result = await response.json();
      
      if (result.success) {
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(parseInt(e.target.value))}
          className="border rounded-lg px-4 py-2"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
          <option value={365}>Last year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={`₹${data.metrics.total_revenue.toLocaleString()}`}
          icon="💰"
        />
        <MetricCard
          title="Total Orders"
          value={data.metrics.total_orders.toLocaleString()}
          icon="📦"
        />
        <MetricCard
          title="Average Order Value"
          value={`₹${Math.round(data.metrics.average_order_value).toLocaleString()}`}
          icon="💳"
        />
        <MetricCard
          title="Unique Customers"
          value={data.metrics.unique_customers.toLocaleString()}
          icon="👥"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Orders by Status</h3>
          <div className="space-y-3">
            {Object.entries(data.orders_by_status).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="capitalize">{status}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Payment Method */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {Object.entries(data.orders_by_payment_method).map(([method, count]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="uppercase">{method}</span>
                <span className="font-semibold">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Product</th>
                <th className="text-right py-2">Quantity Sold</th>
                <th className="text-right py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {data.top_products.map((product, index) => (
                <tr key={index} className="border-b">
                  <td className="py-3">{product.product_name}</td>
                  <td className="text-right">{product.quantity}</td>
                  <td className="text-right">₹{product.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily Revenue Chart */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Daily Revenue</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {data.daily_revenue.slice(-30).map((day, index) => {
            const maxRevenue = Math.max(...data.daily_revenue.map(d => d.revenue));
            const height = (day.revenue / maxRevenue) * 100;
            
            return (
              <div
                key={index}
                className="flex-1 bg-black hover:bg-gray-800 transition-colors relative group"
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {new Date(day.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  <br />
                  ₹{day.revenue.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-gray-500 text-center">
          Last {Math.min(30, data.daily_revenue.length)} days
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}
