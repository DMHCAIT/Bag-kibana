import { NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage, sendSMS } from "@/lib/notification-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      orderId, 
      customerName, 
      customerPhone, 
      orderTotal, 
      items,
      deliveryAddress 
    } = body;

    if (!customerPhone) {
      return NextResponse.json(
        { error: "Customer phone number is required" },
        { status: 400 }
      );
    }

    // Format items for message
    const itemsList = items
      .map((item: any) => `${item.quantity}x ${item.name}`)
      .join(", ");

    // WhatsApp message
    const whatsappMessage = `🎉 *Order Confirmed!*

Thank you ${customerName}! Your order has been confirmed.

📦 *Order ID:* ${orderId}
💰 *Total:* ₹${orderTotal.toLocaleString()}
🛍️ *Items:* ${itemsList}

📍 *Delivery Address:*
${deliveryAddress}

We'll send you tracking details once your order ships.

Need help? Reply to this message or call us at +91-XXXXXXXXXX

Thank you for shopping with KibanaLife! 🛍️`;

    // SMS message (shorter version)
    const smsMessage = `KibanaLife: Order ${orderId} confirmed! Total: ₹${orderTotal}. Items: ${itemsList}. Track your order at kibanalife.com/tracking`;

    const results = await Promise.allSettled([
      sendWhatsAppMessage(customerPhone, whatsappMessage),
      sendSMS(customerPhone, smsMessage),
    ]);

    const whatsappResult = results[0];
    const smsResult = results[1];

    return NextResponse.json({
      success: true,
      whatsapp: whatsappResult.status === "fulfilled" ? whatsappResult.value : { error: (whatsappResult as any).reason },
      sms: smsResult.status === "fulfilled" ? smsResult.value : { error: (smsResult as any).reason },
    });

  } catch (error) {
    console.error("Order confirmation notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
