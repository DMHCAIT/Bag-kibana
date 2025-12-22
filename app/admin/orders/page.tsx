"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
  Search,
  Filter,
  Download,
  Eye,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  FileText,
} from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  payment_status: string;
  order_status: string;
  payment_method: string;
  created_at: string;
  items: any[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders from API...');
      const response = await fetch("/api/admin/orders");
      
      if (!response.ok) {
        console.error('Failed to fetch orders:', response.status, response.statusText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Orders fetched:', data.orders?.length || 0, 'orders');
      
      if (data.error) {
        console.error('API returned error:', data.error);
      }
      
      setOrders(data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      alert('Failed to load orders. Please check the console for details.');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customer_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.customer_email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || order.order_status === statusFilter;

    const matchesPayment =
      paymentFilter === "all" || order.payment_status === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      processing: "bg-purple-100 text-purple-800",
      shipped: "bg-indigo-100 text-indigo-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const getPaymentBadge = (status: string) => {
    const styles = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-gray-100 text-gray-800",
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "processing":
        return <Package className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const exportOrders = () => {
    const csv = [
      ["Order ID", "Customer", "Email", "Total", "Status", "Payment", "Date"],
      ...filteredOrders.map((order) => [
        order.id || '',
        order.customer_name || '',
        order.customer_email || '',
        order.total || 0,
        order.order_status || '',
        order.payment_status || '',
        order.created_at ? format(new Date(order.created_at), "MMM dd, yyyy") : 'N/A',
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all customer orders
          </p>
        </div>
        <button
          onClick={exportOrders}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by customer name, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
          </div>

          {/* Order Status Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black appearance-none bg-white"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6 pt-6 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter((o) => o.order_status === "pending").length}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter((o) => o.order_status === "confirmed").length}
            </p>
            <p className="text-sm text-gray-600">Confirmed</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-indigo-600">
              {orders.filter((o) => o.order_status === "shipped").length}
            </p>
            <p className="text-sm text-gray-600">Shipped</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {orders.filter((o) => o.order_status === "delivered").length}
            </p>
            <p className="text-sm text-gray-600">Delivered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">
              {orders.filter((o) => o.payment_method === "cod").length}
            </p>
            <p className="text-sm text-gray-600">COD Orders</p>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all" || paymentFilter !== "all"
                ? "No orders match your filters"
                : "No orders yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.customer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customer_email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.items?.length || 0} items
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        ₹{order.total.toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          order.order_status
                        )}`}
                      >
                        {getStatusIcon(order.order_status)}
                        {order.order_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentBadge(
                          order.payment_status
                        )}`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.payment_method === 'cod' 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.payment_method === 'cod' ? 'COD' : 'Online'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.created_at ? format(new Date(order.created_at), "MMM dd, yyyy") : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-black hover:text-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                        <a
                          href={`/api/admin/orders/${order.id}/invoice`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <FileText className="w-4 h-4" />
                          Invoice
                        </a>
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
