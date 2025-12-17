import twilio from 'twilio';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886'; // Twilio Sandbox

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

interface OrderDetails {
  orderId: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress?: string;
}

interface CartReminderDetails {
  customerName: string;
  customerPhone: string;
  itemCount: number;
  cartUrl: string;
}

/**
 * Send Order Confirmation via SMS
 */
export async function sendOrderConfirmationSMS(orderDetails: OrderDetails): Promise<boolean> {
  if (!client || !twilioPhone) {
    console.log('Twilio not configured. SMS not sent.');
    console.log('Order Confirmation SMS:', orderDetails);
    return false;
  }

  try {
    const message = `Hi ${orderDetails.customerName}! 🎉\n\nYour order #${orderDetails.orderId} has been confirmed!\n\nTotal: ₹${orderDetails.totalAmount.toLocaleString()}\n\nTrack your order: https://kibanalife.com/order-tracking\n\nThank you for shopping with KibanaLife!`;

    const formattedPhone = formatPhoneNumber(orderDetails.customerPhone);

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: formattedPhone
    });

    console.log(`Order confirmation SMS sent to ${formattedPhone}`);
    return true;
  } catch (error: any) {
    console.error('Failed to send order confirmation SMS:', error);
    return false;
  }
}

/**
 * Send Order Confirmation via WhatsApp
 */
export async function sendOrderConfirmationWhatsApp(orderDetails: OrderDetails): Promise<boolean> {
  if (!client || !twilioWhatsAppNumber) {
    console.log('Twilio WhatsApp not configured. WhatsApp message not sent.');
    console.log('Order Confirmation WhatsApp:', orderDetails);
    return false;
  }

  try {
    const itemsList = orderDetails.items
      .map((item, idx) => `${idx + 1}. ${item.name} (Qty: ${item.quantity}) - ₹${item.price.toLocaleString()}`)
      .join('\n');

    const message = `🎉 *Order Confirmed!*\n\nHi ${orderDetails.customerName},\n\nYour order has been successfully placed!\n\n*Order ID:* ${orderDetails.orderId}\n\n*Items:*\n${itemsList}\n\n*Total Amount:* ₹${orderDetails.totalAmount.toLocaleString()}\n\n${orderDetails.shippingAddress ? `*Shipping to:*\n${orderDetails.shippingAddress}\n\n` : ''}We'll notify you once your order is shipped.\n\n*Track your order:*\nhttps://kibanalife.com/order-tracking\n\nThank you for choosing KibanaLife! 🛍️`;

    const formattedPhone = formatPhoneNumber(orderDetails.customerPhone);

    await client.messages.create({
      body: message,
      from: twilioWhatsAppNumber,
      to: `whatsapp:${formattedPhone}`
    });

    console.log(`Order confirmation WhatsApp sent to ${formattedPhone}`);
    return true;
  } catch (error: any) {
    console.error('Failed to send order confirmation WhatsApp:', error);
    return false;
  }
}

/**
 * Send Cart Abandonment Reminder via WhatsApp
 */
export async function sendCartReminderWhatsApp(details: CartReminderDetails): Promise<boolean> {
  if (!client || !twilioWhatsAppNumber) {
    console.log('Twilio WhatsApp not configured. Cart reminder not sent.');
    console.log('Cart Reminder WhatsApp:', details);
    return false;
  }

  try {
    const message = `Hi ${details.customerName}! 👋\n\n🛒 You left ${details.itemCount} item${details.itemCount > 1 ? 's' : ''} in your cart.\n\n🎁 *Special Offer: 50% OFF* on all products!\n\nComplete your purchase now:\n${details.cartUrl}\n\n⏰ Hurry! This offer won't last long.\n\n- KibanaLife Team`;

    const formattedPhone = formatPhoneNumber(details.customerPhone);

    await client.messages.create({
      body: message,
      from: twilioWhatsAppNumber,
      to: `whatsapp:${formattedPhone}`
    });

    console.log(`Cart reminder WhatsApp sent to ${formattedPhone}`);
    return true;
  } catch (error: any) {
    console.error('Failed to send cart reminder WhatsApp:', error);
    return false;
  }
}

/**
 * Send Cart Abandonment Reminder via SMS
 */
export async function sendCartReminderSMS(details: CartReminderDetails): Promise<boolean> {
  if (!client || !twilioPhone) {
    console.log('Twilio not configured. Cart reminder SMS not sent.');
    console.log('Cart Reminder SMS:', details);
    return false;
  }

  try {
    const message = `Hi ${details.customerName}! You have ${details.itemCount} item${details.itemCount > 1 ? 's' : ''} in your cart. 🛒\n\nGet 50% OFF now! Complete your order: ${details.cartUrl}\n\n- KibanaLife`;

    const formattedPhone = formatPhoneNumber(details.customerPhone);

    await client.messages.create({
      body: message,
      from: twilioPhone,
      to: formattedPhone
    });

    console.log(`Cart reminder SMS sent to ${formattedPhone}`);
    return true;
  } catch (error: any) {
    console.error('Failed to send cart reminder SMS:', error);
    return false;
  }
}

/**
 * Format phone number to E.164 format
 */
function formatPhoneNumber(phone: string): string {
  let formatted = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  
  if (!formatted.startsWith('+')) {
    if (formatted.startsWith('91')) {
      formatted = '+' + formatted;
    } else {
      formatted = '+91' + formatted;
    }
  }
  
  return formatted;
}

/**
 * Send both SMS and WhatsApp for order confirmation
 */
export async function sendOrderConfirmationNotifications(orderDetails: OrderDetails): Promise<{
  smsSuccess: boolean;
  whatsappSuccess: boolean;
}> {
  const [smsSuccess, whatsappSuccess] = await Promise.all([
    sendOrderConfirmationSMS(orderDetails),
    sendOrderConfirmationWhatsApp(orderDetails)
  ]);

  return { smsSuccess, whatsappSuccess };
}

/**
 * Send both SMS and WhatsApp for cart reminder
 */
export async function sendCartReminderNotifications(details: CartReminderDetails): Promise<{
  smsSuccess: boolean;
  whatsappSuccess: boolean;
}> {
  const [smsSuccess, whatsappSuccess] = await Promise.all([
    sendCartReminderSMS(details),
    sendCartReminderWhatsApp(details)
  ]);

  return { smsSuccess, whatsappSuccess };
}
