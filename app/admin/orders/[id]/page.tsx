"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Printer,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface OrderDetails {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: any;
  billing_address: any;
  items: any[];
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_method: string;
  payment_status: string;
  payment_id: string | null;
  order_status: string;
  tracking_number: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`);
      const data = await response.json();
      setOrder(data);
      setNewStatus(data.order_status);
      setTrackingNumber(data.tracking_number || "");
    } catch (error) {
      console.error("Failed to fetch order:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async () => {
    if (!order) return;
    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_status: newStatus,
          tracking_number: trackingNumber || null,
        }),
      });

      if (response.ok) {
        await fetchOrderDetails();
        alert("Order updated successfully!");
      } else {
        alert("Failed to update order");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  const processRefund = async () => {
    if (!order || !confirm("Are you sure you want to process a refund?"))
      return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/refund`, {
        method: "POST",
      });

      if (response.ok) {
        await fetchOrderDetails();
        setShowRefundDialog(false);
        alert("Refund processed successfully!");
      } else {
        alert("Failed to process refund");
      }
    } catch (error) {
      console.error("Refund error:", error);
      alert("Failed to process refund");
    } finally {
      setUpdating(false);
    }
  };

  const printInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Order not found</p>
        <Link
          href="/admin/orders"
          className="text-black hover:underline mt-4 inline-block"
        >
          ← Back to orders
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "text-yellow-600 bg-yellow-100",
      confirmed: "text-blue-600 bg-blue-100",
      processing: "text-purple-600 bg-purple-100",
      shipped: "text-indigo-600 bg-indigo-100",
      delivered: "text-green-600 bg-green-100",
      cancelled: "text-red-600 bg-red-100",
    };
    return colors[status as keyof typeof colors] || "text-gray-600 bg-gray-100";
  };

  return (
    <div className="space-y-6 print:space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className="text-gray-600">
              Placed on {format(new Date(order.created_at), "MMMM dd, yyyy 'at' HH:mm")}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={printInvoice}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          {order.payment_status === "paid" &&
            order.order_status !== "refunded" && (
              <button
                onClick={() => setShowRefundDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <RefreshCw className="w-4 h-4" />
                Refund
              </button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status Update */}
          <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Status
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                    order.order_status
                  )}`}
                >
                  {order.order_status.toUpperCase()}
                </div>
                {order.payment_status === "paid" && (
                  <div className="px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-600">
                    PAID
                  </div>
                )}
              </div>

              <div className="print:hidden space-y-4 pt-4 border-t">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {(newStatus === "shipped" || order.tracking_number) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                )}

                <button
                  onClick={updateOrderStatus}
                  disabled={updating}
                  className="w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {updating ? "Updating..." : "Update Order"}
                </button>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Order Items
            </h2>
            <div className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-0">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg shrink-0">
                    {item.product?.images?.[0] && (
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {item.product?.name || "Product"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {item.product?.color}
                    </p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      ₹{(item.product?.price || 0).toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹
                      {(
                        (item.product?.price || 0) * item.quantity
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>
                  {order.shipping_fee === 0
                    ? "FREE"
                    : `₹${order.shipping_fee.toLocaleString("en-IN")}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>₹{order.total.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Customer Information
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{order.customer_email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{order.customer_phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Shipping Address
            </h2>
            <div className="text-gray-600">
              <p className="font-medium text-gray-900">
                {order.shipping_address?.fullName}
              </p>
              <p>{order.shipping_address?.address}</p>
              <p>{order.shipping_address?.apartment}</p>
              <p>
                {order.shipping_address?.city},{" "}
                {order.shipping_address?.state}{" "}
                {order.shipping_address?.postalCode}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Information
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="font-medium">{order.payment_method}</span>
              </div>
              {order.payment_id && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID</span>
                  <span className="font-medium text-sm">
                    {order.payment_id.slice(0, 20)}...
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span
                  className={`font-medium ${
                    order.payment_status === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.payment_status.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-lg shadow p-6 print:shadow-none">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Order Notes
              </h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Refund Dialog */}
      {showRefundDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Process Refund
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to process a refund for this order? This
              will refund ₹{order.total.toLocaleString("en-IN")} to the
              customer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRefundDialog(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={processRefund}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {updating ? "Processing..." : "Confirm Refund"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:shadow-none,
          .print\\:shadow-none * {
            visibility: visible;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
