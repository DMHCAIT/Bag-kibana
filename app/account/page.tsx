"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, User, LogOut, ShoppingBag, Clock } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

interface Order {
  id: string;
  total: number;
  order_status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
  items: any[];
}

export default function AccountPage() {
  const router = useRouter();
  const { user, signOut, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin?redirect=/account');
    }
  }, [user, isLoading, router]);

  // Fetch user's orders from database
  useEffect(() => {
    async function fetchUserOrders() {
      if (user) {
        try {
          // Fetch orders for this user from the user orders API
          const response = await fetch(`/api/user/orders?email=${encodeURIComponent(user.email)}`);
          const data = await response.json();
          
          if (response.ok && data.orders) {
            setOrders(data.orders);
          }
        } catch (error) {
          console.error('Error loading orders:', error);
        } finally {
          setLoadingOrders(false);
        }
      }
    }
    
    fetchUserOrders();
  }, [user]);

  const handleSignOut = () => {
    signOut();
    router.push('/');
  };

  if (isLoading || !user) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: {[key: string]: string} = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-wide">My Account</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.name}!</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium">{format(new Date(user.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Orders Summary */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5" />
                  Order Summary
                </CardTitle>
                <CardDescription>
                  You have {orders.length} order{orders.length !== 1 ? 's' : ''} in total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold">{orders.length}</p>
                    <p className="text-sm text-gray-600">Total Orders</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold">
                      {orders.filter(o => o.order_status === 'pending').length}
                    </p>
                    <p className="text-sm text-gray-600">Pending</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold">
                      {orders.filter(o => o.order_status === 'shipped').length}
                    </p>
                    <p className="text-sm text-gray-600">Shipped</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold">
                      {orders.filter(o => o.order_status === 'delivered').length}
                    </p>
                    <p className="text-sm text-gray-600">Delivered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders List */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                My Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingOrders ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-500 mb-6">You haven't placed any orders</p>
                  <Link href="/shop">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold">Order #{order.id}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.order_status)}`}>
                              {order.order_status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {format(new Date(order.created_at), 'MMM dd, yyyy • h:mm a')}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₹{order.total.toLocaleString('en-IN')}</p>
                          <p className="text-xs text-gray-500 uppercase">{order.payment_method}</p>
                        </div>
                      </div>

                      <div className="border-t pt-3 mt-3">
                        <p className="text-sm text-gray-600 mb-2">
                          {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                        </p>
                        <Link href={`/order-tracking/${order.id}`}>
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            Track Order
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}

