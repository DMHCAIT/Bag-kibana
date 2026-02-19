"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Lock, ChevronRight, ChevronDown, ChevronUp, Truck, Shield, Package, Check, MapPin, Tag, CreditCard, Smartphone, Wallet, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Product } from "@/lib/products-data";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface QuickCheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  // For "Buy It Now" — pass a single product directly
  buyNowProduct?: Product | null;
  buyNowQuantity?: number;
}

interface AddressData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

type CheckoutStep = "login" | "address" | "payment";
type PaymentMethod = "upi" | "cards" | "cod";

export default function QuickCheckoutModal({
  isOpen,
  onClose,
  buyNowProduct,
  buyNowQuantity = 1,
}: QuickCheckoutProps) {
  const { cart, clearCart, addToCart } = useCart();
  const { user, isAuthenticated, requestOTP, signInWithOTP } = useAuth();
  const router = useRouter();

  // Steps
  const [step, setStep] = useState<CheckoutStep>("login");
  const [loading, setLoading] = useState(false);

  // Login state
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  // Address state
  const [addressData, setAddressData] = useState<AddressData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [addressSaved, setAddressSaved] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("upi");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [orderSummaryExpanded, setOrderSummaryExpanded] = useState(true);

  // Determine checkout items
  const checkoutItems = buyNowProduct
    ? [{ product: buyNowProduct, quantity: buyNowQuantity }]
    : cart.items;

  // Calculate totals
  const originalSubtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountedSubtotal = Math.round(originalSubtotal * 0.7);
  const discountAmount = originalSubtotal - discountedSubtotal;
  const finalTotal = discountedSubtotal;
  const totalItems = checkoutItems.reduce((sum, item) => sum + item.quantity, 0);

  // Set initial step based on auth state
  useEffect(() => {
    if (isOpen) {
      if (isAuthenticated && user) {
        // Pre-fill address data
        const [firstName, ...lastNameParts] = (user.name || "").split(" ");
        setAddressData((prev) => ({
          ...prev,
          firstName: firstName || "",
          lastName: lastNameParts.join(" ") || "",
          email: user.email || "",
          phone: user.phone || "",
        }));

        // Load saved address from localStorage
        const savedAddr = localStorage.getItem("kibana_saved_address");
        if (savedAddr) {
          try {
            const parsed = JSON.parse(savedAddr);
            setAddressData((prev) => ({ ...prev, ...parsed }));
            setAddressSaved(true);
            setStep("payment");
          } catch {
            setStep("address");
          }
        } else {
          setStep("address");
        }
      } else {
        setStep("login");
        setPhone("");
        setOtp("");
        setOtpSent(false);
        setOtpError("");
      }
    }
  }, [isOpen, isAuthenticated, user]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // ────────── Login Handlers ──────────
  const handleSendOTP = async () => {
    const cleanPhone = phone.replace(/\s+/g, "").replace(/^\+91/, "");
    if (cleanPhone.length !== 10 || !/^\d{10}$/.test(cleanPhone)) {
      setOtpError("Please enter a valid 10-digit mobile number");
      return;
    }
    setSendingOtp(true);
    setOtpError("");
    const result = await requestOTP(cleanPhone);
    setSendingOtp(false);
    if (result.success) {
      setOtpSent(true);
    } else {
      setOtpError(result.error || "Failed to send OTP");
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length < 4) {
      setOtpError("Please enter the OTP");
      return;
    }
    setLoading(true);
    setOtpError("");
    const cleanPhone = phone.replace(/\s+/g, "").replace(/^\+91/, "");
    const result = await signInWithOTP(cleanPhone, otp);
    setLoading(false);
    if (result.success) {
      // Will auto-advance via useEffect
    } else {
      setOtpError(result.error || "Invalid OTP");
    }
  };

  // ────────── Address Handlers ──────────
  const validateAddress = (): boolean => {
    const errors: Record<string, string> = {};
    if (!addressData.firstName.trim()) errors.firstName = "Required";
    if (!addressData.lastName.trim()) errors.lastName = "Required";
    if (!addressData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressData.email))
      errors.email = "Valid email required";
    if (!addressData.phone || !/^\d{10}$/.test(addressData.phone.replace(/\s+/g, "")))
      errors.phone = "Valid 10-digit number required";
    if (!addressData.address.trim()) errors.address = "Required";
    if (!addressData.city.trim()) errors.city = "Required";
    if (!addressData.state.trim()) errors.state = "Required";
    if (!addressData.pincode || !/^\d{6}$/.test(addressData.pincode))
      errors.pincode = "Valid 6-digit pincode required";
    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAddress = () => {
    if (!validateAddress()) return;
    localStorage.setItem("kibana_saved_address", JSON.stringify(addressData));
    setAddressSaved(true);
    setEditingAddress(false);
    setStep("payment");
  };

  // ────────── Payment Handlers ──────────
  const handlePlaceOrder = async () => {
    if (!validateAddress()) {
      setStep("address");
      return;
    }
    setLoading(true);

    const shippingAddress = {
      full_name: `${addressData.firstName} ${addressData.lastName}`,
      phone: addressData.phone,
      address_line1: addressData.address,
      city: addressData.city,
      state: addressData.state,
      postal_code: addressData.pincode,
      country: "India",
    };

    const orderItems = checkoutItems.map((item) => ({
      product_id: item.product.id,
      name: `${item.product.name} - ${item.product.color}`,
      color: item.product.color,
      quantity: item.quantity,
      price: Math.round(item.product.price * 0.7),
      image: item.product.images?.[0] || "",
    }));

    try {
      if (paymentMethod === "cod") {
        // ──── Cash on Delivery ────
        const orderData = {
          user_id: user?.id || null,
          customer_name: `${addressData.firstName} ${addressData.lastName}`,
          customer_email: addressData.email,
          customer_phone: addressData.phone,
          shipping_address: shippingAddress,
          billing_address: shippingAddress,
          items: orderItems,
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

        const saveResponse = await fetch("/api/admin/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        const savedOrder = await saveResponse.json();

        if (saveResponse.ok && savedOrder.success && savedOrder.order) {
          // Send notifications
          try {
            await fetch("/api/notifications/order-confirmation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: savedOrder.order.id,
                customerName: `${addressData.firstName} ${addressData.lastName}`,
                customerPhone: addressData.phone,
                orderTotal: finalTotal,
                items: checkoutItems.map((item) => ({
                  name: item.product.name,
                  quantity: item.quantity,
                })),
                deliveryAddress: `${addressData.address}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`,
              }),
            });
          } catch {
            // Notification failure is non-blocking
          }

          localStorage.setItem(
            "kibana-order-tracking",
            JSON.stringify({
              value: discountedSubtotal,
              currency: "INR",
              orderId: savedOrder.order.id,
            })
          );

          if (!buyNowProduct) clearCart();
          onClose();
          router.push(`/order-success?orderId=${savedOrder.order.id}&method=cod`);
        } else {
          alert("Failed to place order. Please try again.");
        }
      } else {
        // ──── Razorpay (UPI / Cards) ────
        const response = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: finalTotal,
            currency: "INR",
            customerDetails: addressData,
            items: checkoutItems,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to create order");

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "KIBANA",
          description: "Purchase from KIBANA",
          order_id: data.id,
          handler: async (res: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            const verifyResponse = await fetch("/api/razorpay/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: res.razorpay_order_id,
                razorpay_payment_id: res.razorpay_payment_id,
                razorpay_signature: res.razorpay_signature,
                customerDetails: addressData,
                items: checkoutItems,
                discountedTotal: finalTotal,
                discountAmount,
                shippingAddress,
              }),
            });
            const verifyData = await verifyResponse.json();
            if (verifyResponse.ok && verifyData.success) {
              const orderId = verifyData.order_id || res.razorpay_order_id;
              try {
                await fetch("/api/notifications/order-confirmation", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    orderId,
                    customerName: `${addressData.firstName} ${addressData.lastName}`,
                    customerPhone: addressData.phone,
                    orderTotal: finalTotal,
                    items: checkoutItems.map((item) => ({
                      name: item.product.name,
                      quantity: item.quantity,
                    })),
                    deliveryAddress: `${addressData.address}, ${addressData.city}, ${addressData.state} - ${addressData.pincode}`,
                  }),
                });
              } catch {
                // non-blocking
              }
              localStorage.setItem(
                "kibana-order-tracking",
                JSON.stringify({ value: finalTotal, currency: "INR", orderId })
              );
              if (!buyNowProduct) clearCart();
              onClose();
              router.push(
                `/order-success?orderId=${orderId}&paymentId=${res.razorpay_payment_id}`
              );
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          },
          prefill: {
            name: `${addressData.firstName} ${addressData.lastName}`,
            email: addressData.email,
            contact: addressData.phone,
          },
          theme: { color: "#000000" },
          modal: {
            ondismiss: () => setLoading(false),
          },
        };

        const razorpay = new (
          window as unknown as Window & {
            Razorpay: new (opts: object) => { open: () => void };
          }
        ).Razorpay(options);
        razorpay.open();
      }
    } catch (err) {
      console.error("Quick checkout error:", err);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center">
        <div
          className="bg-white w-full sm:max-w-[480px] max-h-[95vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ─── Header ─── */}
          <div className="flex items-center justify-between px-5 py-4 border-b bg-white sticky top-0 z-10">
            <div className="flex items-center gap-3">
              {step !== "login" && !(!isAuthenticated && step === "login") && (
                <button
                  onClick={() => {
                    if (step === "payment") setStep("address");
                    else if (step === "address" && isAuthenticated) setStep("payment");
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h2 className="text-lg font-bold tracking-wider" style={{ fontFamily: "var(--font-abhaya)" }}>
                  KIBANA
                </h2>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
                <Lock className="w-3 h-3" />
                <span className="font-medium">100% Secured</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* ─── Scrollable Content ─── */}
          <div className="flex-1 overflow-y-auto">
            {/* ════════ STEP 1: LOGIN ════════ */}
            {step === "login" && (
              <div className="p-5 space-y-6">
                {/* Order Preview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Order Summary</span>
                    <span className="text-sm font-bold">{formatPrice(finalTotal)}</span>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {checkoutItems.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                        {item.product.images?.[0] && (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                        {item.quantity > 1 && (
                          <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        )}
                      </div>
                    ))}
                    {checkoutItems.length > 3 && (
                      <div className="w-14 h-14 rounded-lg bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 flex-shrink-0">
                        +{checkoutItems.length - 3}
                      </div>
                    )}
                  </div>
                </div>

                {/* Login Form */}
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold mb-1">Login to continue</h3>
                    <p className="text-sm text-gray-500">Enter your mobile number to proceed</p>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-black transition-colors">
                        <span className="px-3 py-3.5 text-gray-500 text-sm font-medium bg-gray-50 border-r">+91</span>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value.replace(/\D/g, "").slice(0, 10));
                            setOtpError("");
                          }}
                          placeholder="Enter mobile number"
                          className="flex-1 px-3 py-3.5 outline-none text-sm"
                          maxLength={10}
                          disabled={otpSent}
                        />
                        {otpSent && (
                          <button
                            onClick={() => {
                              setOtpSent(false);
                              setOtp("");
                              setOtpError("");
                            }}
                            className="px-3 text-xs text-blue-600 font-medium hover:underline"
                          >
                            Change
                          </button>
                        )}
                      </div>
                    </div>

                    {otpSent && (
                      <div className="space-y-3 animate-fade-in">
                        <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-black transition-colors">
                          <input
                            type="text"
                            value={otp}
                            onChange={(e) => {
                              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                              setOtpError("");
                            }}
                            placeholder="Enter OTP"
                            className="flex-1 px-4 py-3.5 outline-none text-sm tracking-[0.3em] text-center font-medium"
                            maxLength={6}
                          />
                        </div>
                        <p className="text-xs text-gray-500 text-center">
                          OTP sent to +91 {phone}
                        </p>
                      </div>
                    )}

                    {otpError && (
                      <p className="text-sm text-red-500 text-center">{otpError}</p>
                    )}

                    <button
                      onClick={otpSent ? handleVerifyOTP : handleSendOTP}
                      disabled={loading || sendingOtp || (otpSent ? otp.length < 4 : phone.length < 10)}
                      className="w-full bg-black text-white py-3.5 rounded-xl font-medium text-sm tracking-wider uppercase hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading
                        ? "Verifying..."
                        : sendingOtp
                        ? "Sending OTP..."
                        : otpSent
                        ? "Verify & Continue"
                        : "Continue"}
                    </button>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-6 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Lock className="w-4 h-4 text-green-600" />
                    <span>PCI DSS Compliant</span>
                  </div>
                </div>

                {/* Powered by */}
                <p className="text-center text-[11px] text-gray-400">
                  Powered by <span className="font-semibold text-gray-600">KIBANA</span> Secure Checkout
                </p>
              </div>
            )}

            {/* ════════ STEP 2: ADDRESS ════════ */}
            {step === "address" && (
              <div className="p-5 space-y-4">
                <h3 className="text-base font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Delivery Address
                </h3>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="text"
                        placeholder="First Name *"
                        value={addressData.firstName}
                        onChange={(e) => setAddressData((p) => ({ ...p, firstName: e.target.value }))}
                        className={`w-full px-3 py-3 border rounded-xl text-sm outline-none focus:border-black transition-colors ${
                          addressErrors.firstName ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Last Name *"
                        value={addressData.lastName}
                        onChange={(e) => setAddressData((p) => ({ ...p, lastName: e.target.value }))}
                        className={`w-full px-3 py-3 border rounded-xl text-sm outline-none focus:border-black transition-colors ${
                          addressErrors.lastName ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                    </div>
                  </div>

                  <input
                    type="email"
                    placeholder="Email Address *"
                    value={addressData.email}
                    onChange={(e) => setAddressData((p) => ({ ...p, email: e.target.value }))}
                    className={`w-full px-3 py-3 border rounded-xl text-sm outline-none focus:border-black transition-colors ${
                      addressErrors.email ? "border-red-400" : "border-gray-200"
                    }`}
                  />

                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={addressData.phone}
                    onChange={(e) =>
                      setAddressData((p) => ({
                        ...p,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                      }))
                    }
                    className={`w-full px-3 py-3 border rounded-xl text-sm outline-none focus:border-black transition-colors ${
                      addressErrors.phone ? "border-red-400" : "border-gray-200"
                    }`}
                    maxLength={10}
                  />

                  <input
                    type="text"
                    placeholder="Full Address (House No., Street, Area) *"
                    value={addressData.address}
                    onChange={(e) => setAddressData((p) => ({ ...p, address: e.target.value }))}
                    className={`w-full px-3 py-3 border rounded-xl text-sm outline-none focus:border-black transition-colors ${
                      addressErrors.address ? "border-red-400" : "border-gray-200"
                    }`}
                  />

                  <div className="grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="City *"
                      value={addressData.city}
                      onChange={(e) => setAddressData((p) => ({ ...p, city: e.target.value }))}
                      className={`w-full px-3 py-3 border rounded-xl text-sm outline-none focus:border-black transition-colors ${
                        addressErrors.city ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="State *"
                      value={addressData.state}
                      onChange={(e) => setAddressData((p) => ({ ...p, state: e.target.value }))}
                      className={`w-full px-3 py-3 border rounded-xl text-sm outline-none focus:border-black transition-colors ${
                        addressErrors.state ? "border-red-400" : "border-gray-200"
                      }`}
                    />
                    <input
                      type="text"
                      placeholder="Pincode *"
                      value={addressData.pincode}
                      onChange={(e) =>
                        setAddressData((p) => ({
                          ...p,
                          pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                        }))
                      }
                      className={`w-full px-3 py-3 border rounded-xl text-sm outline-none focus:border-black transition-colors ${
                        addressErrors.pincode ? "border-red-400" : "border-gray-200"
                      }`}
                      maxLength={6}
                    />
                  </div>

                  {Object.keys(addressErrors).length > 0 && (
                    <p className="text-xs text-red-500">Please fill in all required fields correctly</p>
                  )}
                </div>

                <button
                  onClick={handleSaveAddress}
                  className="w-full bg-black text-white py-3.5 rounded-xl font-medium text-sm tracking-wider uppercase hover:bg-gray-800 transition-colors"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* ════════ STEP 3: PAYMENT ════════ */}
            {step === "payment" && (
              <div className="p-5 space-y-4">
                {/* Order Summary Collapsible */}
                <div className="bg-gray-50 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOrderSummaryExpanded(!orderSummaryExpanded)}
                    className="w-full flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">
                        Order Summary ({totalItems} {totalItems === 1 ? "item" : "items"})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{formatPrice(finalTotal)}</span>
                      {orderSummaryExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {orderSummaryExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-gray-200 pt-3">
                      {checkoutItems.map((item, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {item.product.images?.[0] && (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {item.product.color} • Qty: {item.quantity}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-semibold">
                              {formatPrice(Math.round(item.product.price * 0.7 * item.quantity))}
                            </p>
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Price Breakdown */}
                      <div className="border-t border-gray-200 pt-3 space-y-1.5">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Original Price</span>
                          <span className="line-through">{formatPrice(originalSubtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-green-600 font-medium">
                          <span>Discount (30% OFF)</span>
                          <span>-{formatPrice(discountAmount)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Shipping</span>
                          <span className="text-green-600 font-medium">FREE</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold pt-1 border-t border-gray-200">
                          <span>Total</span>
                          <span className="text-green-700">{formatPrice(finalTotal)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Delivery Address (compact, editable) */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium">Deliver to</span>
                    </div>
                    <button
                      onClick={() => {
                        setEditingAddress(true);
                        setStep("address");
                      }}
                      className="text-xs text-blue-600 font-medium hover:underline"
                    >
                      Change
                    </button>
                  </div>
                  <p className="text-sm text-gray-700">
                    {addressData.firstName} {addressData.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {addressData.address}, {addressData.city}, {addressData.state} - {addressData.pincode}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-xs text-green-700">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Standard Shipping — <strong>Free</strong></span>
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">Offers & Rewards</span>
                  </div>
                  {couponApplied ? (
                    <div className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-700">30% OFF Applied!</span>
                      </div>
                      <button
                        onClick={() => {
                          setCouponCode("");
                          setCouponApplied(false);
                        }}
                        className="text-xs text-red-500 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-black transition-colors"
                      />
                      <button
                        onClick={() => {
                          if (couponCode) setCouponApplied(true);
                        }}
                        className="px-4 py-2.5 bg-gray-100 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    🎉 30% discount already applied automatically
                  </p>
                </div>

                {/* Payment Options */}
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Options
                  </h4>

                  {/* UPI */}
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "upi"
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "upi"}
                      onChange={() => setPaymentMethod("upi")}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "upi" ? "border-black" : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "upi" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <span className="text-sm font-medium">UPI</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Image src="/images/paytm.png" alt="Paytm" width={28} height={28} className="rounded-full object-contain" />
                        <Image src="/images/phonepe.png" alt="PhonePe" width={28} height={28} className="rounded-full object-contain" />
                        <Image src="/images/gpay.jpeg" alt="GPay" width={28} height={28} className="rounded-full object-contain" />
                        <span className="text-[10px] text-gray-500 ml-1">& more</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-700">{formatPrice(finalTotal)}</span>
                  </label>

                  {/* Cards */}
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "cards"
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cards"}
                      onChange={() => setPaymentMethod("cards")}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "cards" ? "border-black" : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "cards" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm font-medium">Debit / Credit Cards</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Visa, Mastercard, Rupay & more</p>
                    </div>
                    <span className="text-sm font-semibold text-green-700">{formatPrice(finalTotal)}</span>
                  </label>

                  {/* COD */}
                  <label
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === "cod"
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === "cod" ? "border-black" : "border-gray-300"
                      }`}
                    >
                      {paymentMethod === "cod" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-black" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        <span className="text-sm font-medium">Cash on Delivery</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Pay when you receive your order</p>
                    </div>
                    <span className="text-sm font-semibold">{formatPrice(finalTotal)}</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* ─── Sticky Bottom CTA ─── */}
          {step === "payment" && (
            <div className="p-4 border-t bg-white sticky bottom-0">
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-xl font-medium text-sm tracking-wider uppercase hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    {paymentMethod === "cod"
                      ? `Place Order • ${formatPrice(finalTotal)}`
                      : `Pay ${formatPrice(finalTotal)}`}
                  </>
                )}
              </button>
              <div className="flex items-center justify-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Shield className="w-3 h-3" />
                  <span>Secured</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Truck className="w-3 h-3" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Package className="w-3 h-3" />
                  <span>Easy Returns</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Razorpay Script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.35s ease-out;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
