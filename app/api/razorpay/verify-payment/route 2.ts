import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: "Payment gateway not configured. Please add Razorpay API keys." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      customerDetails,
      cartItems,
      amount,
    } = body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Here you can:
      // 1. Save order to database
      // 2. Send confirmation email
      // 3. Update inventory
      
      // For now, we'll just return success with order details
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      return NextResponse.json({
        success: true,
        orderId,
        paymentId: razorpay_payment_id,
        message: "Payment verified successfully",
        orderDetails: {
          orderId,
          amount,
          customerDetails,
          items: cartItems,
          paymentId: razorpay_payment_id,
          status: "paid",
          createdAt: new Date().toISOString(),
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
