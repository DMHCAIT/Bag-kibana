import { supabaseAdmin } from './supabase';

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shipping: number;
  discount?: number;
  total: number;
  shippingAddress: any;
  orderStatus: string;
  paymentMethod: string;
  orderDate: string;
}

/**
 * Email Service for sending transactional emails
 * Currently uses Resend API - can be replaced with SendGrid, AWS SES, etc.
 */
export class EmailService {
  private apiKey: string;
  private fromEmail: string;

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || '';
    this.fromEmail = process.env.EMAIL_FROM || 'orders@kibana.com';
  }

  /**
   * Send order confirmation email
   */
  async sendOrderConfirmation(data: OrderEmailData): Promise<boolean> {
    try {
      const template = this.getOrderConfirmationTemplate(data);
      
      // If Resend API key is configured, send via Resend
      if (this.apiKey) {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: this.fromEmail,
            to: data.customerEmail,
            subject: template.subject,
            html: template.html,
          }),
        });

        if (!response.ok) {
          console.error('Failed to send email via Resend:', await response.text());
          return false;
        }

        console.log(`Order confirmation email sent to ${data.customerEmail}`);
        return true;
      }

      // Fallback: Log email to database for manual sending
      await this.logEmailToDatabase({
        to: data.customerEmail,
        subject: template.subject,
        html: template.html,
        type: 'order_confirmation',
        reference_id: data.orderId,
      });

      console.log(`Order confirmation email logged for ${data.customerEmail}`);
      return true;
    } catch (error) {
      console.error('Error sending order confirmation:', error);
      return false;
    }
  }

  /**
   * Send order status update email
   */
  async sendOrderStatusUpdate(
    orderId: string,
    customerEmail: string,
    newStatus: string,
    trackingNumber?: string
  ): Promise<boolean> {
    try {
      const template = this.getOrderStatusTemplate(orderId, newStatus, trackingNumber);

      if (this.apiKey) {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: this.fromEmail,
            to: customerEmail,
            subject: template.subject,
            html: template.html,
          }),
        });

        if (!response.ok) {
          console.error('Failed to send status update email:', await response.text());
          return false;
        }

        return true;
      }

      await this.logEmailToDatabase({
        to: customerEmail,
        subject: template.subject,
        html: template.html,
        type: 'order_status_update',
        reference_id: orderId,
      });

      return true;
    } catch (error) {
      console.error('Error sending status update:', error);
      return false;
    }
  }

  /**
   * Get order confirmation email template
   */
  private getOrderConfirmationTemplate(data: OrderEmailData): EmailTemplate {
    const itemsHtml = data.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            ${item.name}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
            ₹${item.price.toLocaleString()}
          </td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .order-summary { background: #f9f9f9; padding: 20px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">KIBANA</h1>
            </div>
            
            <div class="content">
              <h2>Thank you for your order!</h2>
              <p>Hi ${data.customerName},</p>
              <p>We've received your order and will send you a confirmation when it ships.</p>
              
              <div class="order-summary">
                <h3>Order #${data.orderId}</h3>
                <p><strong>Order Date:</strong> ${new Date(data.orderDate).toLocaleDateString('en-IN')}</p>
                <p><strong>Payment Method:</strong> ${data.paymentMethod.toUpperCase()}</p>
                
                <table style="margin-top: 20px;">
                  <thead>
                    <tr style="background: #f0f0f0;">
                      <th style="padding: 10px; text-align: left;">Item</th>
                      <th style="padding: 10px; text-align: center;">Qty</th>
                      <th style="padding: 10px; text-align: right;">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHtml}
                  </tbody>
                </table>
                
                <table style="margin-top: 20px;">
                  <tr>
                    <td style="text-align: right; padding: 5px;"><strong>Subtotal:</strong></td>
                    <td style="text-align: right; padding: 5px;">₹${data.subtotal.toLocaleString()}</td>
                  </tr>
                  ${data.discount ? `
                  <tr>
                    <td style="text-align: right; padding: 5px;"><strong>Discount:</strong></td>
                    <td style="text-align: right; padding: 5px; color: green;">-₹${data.discount.toLocaleString()}</td>
                  </tr>
                  ` : ''}
                  <tr>
                    <td style="text-align: right; padding: 5px;"><strong>Shipping:</strong></td>
                    <td style="text-align: right; padding: 5px;">${data.shipping === 0 ? 'FREE' : `₹${data.shipping}`}</td>
                  </tr>
                  <tr style="border-top: 2px solid #000;">
                    <td style="text-align: right; padding: 10px 5px;"><strong>Total:</strong></td>
                    <td style="text-align: right; padding: 10px 5px;"><strong>₹${data.total.toLocaleString()}</strong></td>
                  </tr>
                </table>
              </div>
              
              <h3>Shipping Address</h3>
              <p>
                ${data.shippingAddress.full_name || data.customerName}<br>
                ${data.shippingAddress.address_line1}<br>
                ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.postal_code}<br>
                ${data.shippingAddress.country || 'India'}
              </p>
              
              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/order-tracking/${data.orderId}" class="button">
                  Track Your Order
                </a>
              </center>
              
              <p style="margin-top: 30px;">
                If you have any questions, please contact us at support@kibana.com
              </p>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} KIBANA. All rights reserved.</p>
              <p>You received this email because you placed an order on our website.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return {
      subject: `Order Confirmation - #${data.orderId}`,
      html,
      text: `Thank you for your order! Order #${data.orderId}. Total: ₹${data.total}`,
    };
  }

  /**
   * Get order status update template
   */
  private getOrderStatusTemplate(
    orderId: string,
    status: string,
    trackingNumber?: string
  ): EmailTemplate {
    const statusMessages: Record<string, string> = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is being processed.',
      shipped: `Your order has been shipped! ${trackingNumber ? `Tracking: ${trackingNumber}` : ''}`,
      delivered: 'Your order has been delivered. Thank you for shopping with us!',
      cancelled: 'Your order has been cancelled.',
    };

    const message = statusMessages[status] || `Your order status has been updated to: ${status}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">KIBANA</h1>
            </div>
            
            <div class="content">
              <h2>Order Update</h2>
              <p>${message}</p>
              <p><strong>Order ID:</strong> #${orderId}</p>
              
              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/order-tracking/${orderId}" class="button">
                  Track Your Order
                </a>
              </center>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} KIBANA. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    return {
      subject: `Order Update - #${orderId}`,
      html,
      text: `Order #${orderId}: ${message}`,
    };
  }

  /**
   * Log email to database for manual sending (fallback)
   */
  private async logEmailToDatabase(emailData: {
    to: string;
    subject: string;
    html: string;
    type: string;
    reference_id: string;
  }): Promise<void> {
    try {
      await supabaseAdmin.from('email_logs').insert({
        ...emailData,
        status: 'pending',
        created_at: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Failed to log email to database:', error);
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
