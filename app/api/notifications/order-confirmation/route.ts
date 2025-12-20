import { NextRequest, NextResponse } from "next/server";
import { sendOrderConfirmationWhatsApp, sendOrderConfirmationSMS } from "@/lib/notification-service";

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

    // Format items for the notification service
    const formattedItems = items.map((item: any) => ({
      name: item.name,
      quantity: item.quantity,
      price: Math.round((orderTotal / items.reduce((sum: number, i: any) => sum + i.quantity, 0)) * item.quantity),
    }));

    const orderDetails = {
      orderId,
      customerName,
      customerPhone,
      totalAmount: orderTotal,
      items: formattedItems,
      shippingAddress: deliveryAddress,
    };

    const results = await Promise.allSettled([
      sendOrderConfirmationWhatsApp(orderDetails),
      sendOrderConfirmationSMS(orderDetails),
    ]);

    const whatsappResult = results[0];
    const smsResult = results[1];

    return NextResponse.json({
      success: true,
      whatsapp: whatsappResult.status === "fulfilled" ? { success: whatsappResult.value } : { error: (whatsappResult as any).reason },
      sms: smsResult.status === "fulfilled" ? { success: smsResult.value } : { error: (smsResult as any).reason },
    });

  } catch (error) {
    console.error("Order confirmation notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
