"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { Lock, Truck, CreditCard, Package, Smartphone, Wallet } from "lucide-react";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  paymentMethod: "razorpay" | "cod";
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false); // Track if order was placed
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "razorpay",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Redirect if not authenticated or cart is empty (but not after order is placed)
  useEffect(() => {
    if (orderPlaced) return; // Don't redirect if order was just placed
    
    if (!authLoading && !user) {
      router.push("/signin?redirect=/checkout&message=Please sign in to continue checkout");
    }
    if (cart.isEmpty && !loading) {
      router.push("/cart");
    }
  }, [user, authLoading, cart.isEmpty, router, orderPlaced, loading]);

  // Pre-fill form with user data and check if first order
  useEffect(() => {
    if (user) {
      const [firstName, ...lastNameParts] = user.name.split(' ');
      setFormData(prev => ({
        ...prev,
        email: user.email,
        firstName: firstName,
        lastName: lastNameParts.join(' ') || '',
        phone: user.phone,
      }));
      
    }
  }, [user]);

  // Calculate automatic 30% discount
  const originalSubtotal = cart.subtotal;
  const discountedSubtotal = Math.round(cart.subtotal * 0.7);
  const discountAmount = originalSubtotal - discountedSubtotal;
  const finalTotal = discountedSubtotal;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (!formData.phone || !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Valid 10-digit phone number is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.pincode || !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Valid 6-digit pincode is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Build proper address object for database
      const shippingAddress = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        address_line1: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.pincode,
        country: "India",
      };

      if (formData.paymentMethod === "cod") {
        // Cash on Delivery - Direct order creation
        const orderData = {
          user_id: user?.id || null,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: shippingAddress,
          billing_address: shippingAddress,
          items: cart.items.map((item) => ({
            product_id: item.product.id,
            name: `${item.product.name} - ${item.product.color}`,
            color: item.product.color,
            quantity: item.quantity,
            price: Math.round(item.product.price * 0.7),
            image: item.product.images?.[0] || "",
          })),
          subtotal: discountedSubtotal,
          discount: discountAmount,
          discount_code: "AUTO30",
          is_first_order: false,
          shipping_fee: 0,
          total: finalTotal,
          payment_method: "cod",
          payment_status: "pending",
          order_status: "pending",
        };

        // Save order to admin
        try {
          console.log("Sending COD order:", JSON.stringify(orderData, null, 2));
          
          const saveResponse = await fetch("/api/admin/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(orderData),
          });

          const savedOrder = await saveResponse.json();
          console.log("Order save response:", saveResponse.status, savedOrder);
          
          if (saveResponse.ok && savedOrder.success && savedOrder.order) {
            // Send order confirmation notifications
            try {
              await fetch("/api/notifications/order-confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: savedOrder.order.id,
                  customerName: `${formData.firstName} ${formData.lastName}`,
                  customerPhone: formData.phone,
                  orderTotal: finalTotal,
                  items: cart.items.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                  })),
                  deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                }),
              });
            } catch (notifError) {
              console.error("Failed to send order confirmation:", notifError);
            }

            // Store order data for Facebook Pixel tracking
            localStorage.setItem('kibana-order-tracking', JSON.stringify({
              value: discountedSubtotal,
              currency: 'INR',
              orderId: savedOrder.order.id
            }));
            setOrderPlaced(true); // Mark order as placed BEFORE clearing cart
            clearCart();
            router.push(`/order-success?orderId=${savedOrder.order.id}&method=cod`);
            return;
          } else {
            console.error("Order save failed:", savedOrder.error || "Unknown error");
            // Store order data for Facebook Pixel tracking even if save failed
            localStorage.setItem('kibana-order-tracking', JSON.stringify({
              value: discountedSubtotal,
              currency: 'INR',
              orderId: `COD-${Date.now()}`
            }));
            setOrderPlaced(true);
            clearCart();
            router.push(`/order-success?orderId=COD-${Date.now()}&method=cod`);
            return;
          }
        } catch (saveError) {
          console.error("Error saving COD order:", saveError);
          // Store order data for Facebook Pixel tracking even if save failed
          const orderId = `COD-${Date.now()}`;
          localStorage.setItem('kibana-order-tracking', JSON.stringify({
            value: cart.subtotal,
            currency: 'INR',
            orderId
          }));
          setOrderPlaced(true);
          clearCart();
          router.push(`/order-success?orderId=${orderId}&method=cod`);
          return;
        }
      } else {
        // Razorpay Payment
        const response = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalTotal,
            currency: "INR",
            customerDetails: formData,
            items: cart.items,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create order");
        }

        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "KIBANA",
          description: "Purchase from KIBANA",
          order_id: data.id,
          handler: async function (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) {
            // Verify payment and save order
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customerDetails: formData,
                items: cart.items,
              }),
            });

            await verifyResponse.json();

            if (verifyResponse.ok) {
              // Save order to admin with proper address format
              const orderData = {
                user_id: user?.id || null,
                customer_name: `${formData.firstName} ${formData.lastName}`,
                customer_email: formData.email,
                customer_phone: formData.phone,
                shipping_address: shippingAddress,
                billing_address: shippingAddress,
                items: cart.items.map((item) => ({
                  product_id: item.product.id,
                  name: `${item.product.name} - ${item.product.color}`,
                  color: item.product.color,
                  quantity: item.quantity,
                  price: Math.round(item.product.price * 0.7),
                  image: item.product.images?.[0] || "",
                })),
                subtotal: discountedSubtotal,
                discount: discountAmount,
                discount_code: "AUTO30",
                is_first_order: false,
                shipping_fee: 0,
                total: finalTotal,
                payment_method: "razorpay",
                payment_status: "paid",
                order_status: "confirmed",
                payment_id: response.razorpay_payment_id,
              };

              try {
                const saveResponse = await fetch("/api/admin/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(orderData),
                });
                const savedOrder = await saveResponse.json();
                console.log("Order saved:", savedOrder);

                // Send order confirmation notifications
                if (saveResponse.ok && savedOrder.success) {
                  try {
                    await fetch("/api/notifications/order-confirmation", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        orderId: savedOrder.order?.id || response.razorpay_order_id,
                        customerName: `${formData.firstName} ${formData.lastName}`,
                        customerPhone: formData.phone,
                        orderTotal: finalTotal,
                        items: cart.items.map(item => ({
                          name: item.product.name,
                          quantity: item.quantity,
                        })),
                        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
                      }),
                    });
                  } catch (notifError) {
                    console.error("Failed to send order confirmation:", notifError);
                  }
                }
              } catch (saveError) {
                console.error("Error saving order to admin:", saveError);
              }

              // Store order data for Facebook Pixel tracking
              localStorage.setItem('kibana-order-tracking', JSON.stringify({
                value: discountedSubtotal,
                currency: 'INR',
                orderId: response.razorpay_order_id
              }));

              setOrderPlaced(true); // Mark order as placed BEFORE clearing cart
              clearCart();
              router.push(
                `/order-success?orderId=${response.razorpay_order_id}&paymentId=${response.razorpay_payment_id}`
              );
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#000000",
          },
        };

        const razorpay = new (window as unknown as Window & { Razorpay: new (options: object) => { open: () => void } }).Razorpay(options);
        razorpay.open();
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.isEmpty) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="font-serif text-3xl md:text-4xl tracking-[0.15em] mb-8 text-center">
          CHECKOUT
        </h1>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 flex flex-col order-1">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6 flex flex-col">
              {/* Contact Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-xl tracking-wider mb-6 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-red-500" : ""}
                        placeholder="your@email.com"
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Information */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="font-serif text-xl tracking-wider mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Shipping Information
                  </h2>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className={errors.firstName ? "border-red-500" : ""}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={errors.lastName ? "border-red-500" : ""}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? "border-red-500" : ""}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className={errors.address ? "border-red-500" : ""}
                        placeholder="House No., Street, Area"
                      />
                      {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                      )}
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className={errors.city ? "border-red-500" : ""}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className={errors.state ? "border-red-500" : ""}
                        />
                        {errors.state && (
                          <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode *</Label>
                        <Input
                          id="pincode"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className={errors.pincode ? "border-red-500" : ""}
                          placeholder="6 digits"
                          maxLength={6}
                        />
                        {errors.pincode && (
                          <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 order-2 lg:order-none">
            <Card className="lg:sticky lg:top-24">
              <CardContent className="p-6 space-y-6">
                <h2 className="font-serif text-xl tracking-[0.15em]">
                  ORDER SUMMARY
                </h2>

                {/* Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.product.id} className="flex gap-3 text-sm">
                      <div className="w-16 h-16 bg-gray-100 rounded shrink-0 relative overflow-hidden">
                        {item.product.images && item.product.images[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium line-clamp-1">
                          {item.product.name} - {item.product.color}
                        </p>
                        <p className="text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-black">
                          ₹{Math.round(item.product.price * 0.7 * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 line-through">
                          ₹{(item.product.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Automatic Discount Banner */}
                <div className="pt-4 border-t">
                  <div className="bg-black p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎉</span>
                      <div>
                        <p className="text-sm font-medium text-white">
                          30% OFF Applied Automatically!
                        </p>
                        <p className="text-xs text-gray-200">
                          You&apos;re saving ₹{discountAmount.toLocaleString()} on this order
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Original Price ({cart.totalItems} items)</span>
                    <span className="line-through text-gray-400">₹{originalSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-black font-medium">
                    <span>Discount (30% OFF)</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{discountedSubtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600 font-medium">FREE</span>
                  </div>
                </div>

                <div className="flex justify-between font-semibold text-lg pt-4 border-t">
                  <span>Total</span>
                  <span className="text-green-600">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>

                {/* Trust Badges */}
                <div className="pt-6 border-t space-y-3 text-xs text-gray-600">
                  <p className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-600" />
                    Secure checkout
                  </p>
                  <p className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-600" />
                    Fast delivery
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Method */}
          <div className="lg:col-span-2 order-3 lg:order-none">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-serif text-xl tracking-wider mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === "razorpay"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: e.target.value as "razorpay",
                        }))
                      }
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">UPI/Cards/Partial COD</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1.5">
                          {/* Paytm/Wallet */}
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#00B9F5] to-[#0095D5] flex items-center justify-center shadow-sm border border-blue-100">
                            <Wallet className="w-6 h-6 text-white" strokeWidth={2.5} />
                          </div>
                          {/* PhonePe/Mobile Payment */}
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#5F259F] to-[#4A1C7D] flex items-center justify-center shadow-sm">
                            <Smartphone className="w-6 h-6 text-white" strokeWidth={2.5} />
                          </div>
                          {/* Cards */}
                          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm border border-blue-100">
                            <CreditCard className="w-6 h-6 text-white" strokeWidth={2.5} />
                          </div>
                          {/* UPI */}
                          <svg className="w-11 h-11" viewBox="0 0 48 48" fill="none">
                            <defs>
                              <linearGradient id="upiGradientCheckout" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#FF6F00" />
                                <stop offset="100%" stopColor="#FF9800" />
                              </linearGradient>
                            </defs>
                            <circle cx="24" cy="24" r="23" fill="white" stroke="#E8E8E8" strokeWidth="1.5"/>
                            <path d="M24 14l6 9-6 3-6-9z" fill="url(#upiGradientCheckout)" opacity="0.95"/>
                            <path d="M24 26l6-3-6 11-6-11z" fill="#097B3E" opacity="0.95"/>
                            <path d="M24 23l4-6-4 9-4-9z" fill="#FFA726" opacity="0.7"/>
                          </svg>
                        </div>                      </div>                    </div>
                    <Lock className="w-5 h-5 text-green-600" />
                  </label>

                  <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: e.target.value as "cod",
                        }))
                      }
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="font-medium">Cash on Delivery</p>
                      <p className="text-sm text-gray-600">
                        Pay when you receive your order
                      </p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              form="checkout-form"
              className="w-full uppercase tracking-wider bg-black text-white hover:bg-gray-800 py-6 text-base mt-6"
            >
              {loading
                ? "Processing..."
                : formData.paymentMethod === "cod"
                ? "Place Order"
                : "Proceed to Payment"}
            </Button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Load Razorpay Script */}
      <script
        src="https://checkout.razorpay.com/v1/checkout.js"
        async
      ></script>
    </div>
  );
}

