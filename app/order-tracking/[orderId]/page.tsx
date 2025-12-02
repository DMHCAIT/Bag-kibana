"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Order {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  shipping_address: string;
  items: any[];
}

export default function OrderTrackingPage({ params }: { params: Promise<{ orderId: string }> }) {
  const unwrappedParams = use(params);
  const orderId = unwrappedParams.orderId;
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/signin?redirect=/order-tracking/${orderId}`);
      return;
    }

    async function fetchOrder() {
      if (user && orderId) {
        try {
          // Fetch orders from admin API
          const response = await fetch('/api/admin/orders');
          const data = await response.json();
          
          if (response.ok && data.orders) {
            // Find the specific order
            const foundOrder = data.orders.find((o: Order) => o.id === orderId);

            if (!foundOrder) {
              setError('Order not found');
            } else if (foundOrder.user_id && foundOrder.user_id !== user.id) {
              setError('You do not have permission to view this order');
            } else {
              setOrder(foundOrder);
            }
          } else {
            setError('Failed to load order');
          }
        } catch (err) {
          console.error('Error loading order:', err);
          setError('Failed to load order details');
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchOrder();
  }, [orderId, user, authLoading, router]);

  const getStatusStep = (status: string) => {
    const steps: {[key: string]: number} = {
      pending: 1,
      confirmed: 2,
      processing: 2,
      shipped: 3,
      delivered: 4,
    };
    return steps[status] || 1;
  };

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p>Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h1 className="text-2xl font-bold mb-2">{error || 'Order Not Found'}</h1>
            <p className="text-gray-600 mb-6">
              {error || 'The order you are looking for does not exist or you do not have permission to view it.'}
            </p>
            <Link href="/account">
              <Button>View All Orders</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const currentStep = getStatusStep(order.order_status);

  const trackingSteps = [
    { step: 1, label: 'Order Placed', icon: Clock, status: order.order_status },
    { step: 2, label: 'Confirmed', icon: CheckCircle, status: order.order_status },
    { step: 3, label: 'Shipped', icon: Truck, status: order.order_status },
    { step: 4, label: 'Delivered', icon: Package, status: order.order_status },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link href="/account">
              <Button variant="outline" size="sm" className="mb-4">
                ← Back to Orders
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-wide">Order Tracking</h1>
            <p className="text-gray-600 mt-1">Order #{order.id}</p>
          </div>

          {/* Order Status Timeline */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
                  <div
                    className="absolute h-full bg-black transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                  />
                </div>

                {/* Steps */}
                <div className="relative flex justify-between">
                  {trackingSteps.map(({ step, label, icon: Icon }) => (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                          step <= currentStep
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <p className={`text-xs text-center ${step <= currentStep ? 'font-medium' : 'text-gray-500'}`}>
                        {label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Current Status:</strong>{' '}
                  <span className="capitalize">{order.order_status}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Ordered on:</strong>{' '}
                  {format(new Date(order.created_at), 'MMMM dd, yyyy • h:mm a')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{order.shipping_address}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span>{order.customer_phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span>{order.customer_email}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items ({order.items?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm">₹{order.total.toLocaleString('en-IN')}</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm text-green-600">FREE</p>
                </div>
                <div className="flex justify-between items-center text-lg font-bold">
                  <p>Total</p>
                  <p>₹{order.total.toLocaleString('en-IN')}</p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <strong>Payment Method:</strong>{' '}
                  <span className="uppercase">{order.payment_method}</span>
                </p>
                <p className="text-sm mt-1">
                  <strong>Payment Status:</strong>{' '}
                  <span className="capitalize">{order.payment_status}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}

