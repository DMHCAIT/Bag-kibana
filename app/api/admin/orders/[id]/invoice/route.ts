import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: orderId } = await params;
    const supabase = supabaseAdmin;

    // Fetch order details
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(order);

    return new NextResponse(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}

function generateInvoiceHTML(order: any): string {
  const items = order.items || [];
  const subtotal = order.subtotal || 0;
  const discount = order.discount || 0;
  const shippingFee = order.shipping_fee || 0;
  const total = order.total || 0;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${order.id}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      background: #f5f5f5;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #000;
    }
    .company-info h1 {
      font-size: 32px;
      margin-bottom: 5px;
      letter-spacing: 2px;
    }
    .company-info p {
      color: #666;
      font-size: 14px;
    }
    .invoice-details {
      text-align: right;
    }
    .invoice-details h2 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .invoice-details p {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }
    .addresses {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .address-block h3 {
      font-size: 14px;
      text-transform: uppercase;
      margin-bottom: 10px;
      color: #666;
    }
    .address-block p {
      font-size: 14px;
      line-height: 1.6;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    thead {
      background: #000;
      color: white;
    }
    th {
      padding: 12px;
      text-align: left;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    td {
      padding: 15px 12px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    .text-right {
      text-align: right;
    }
    .totals {
      margin-left: auto;
      width: 300px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      font-size: 14px;
    }
    .totals-row.subtotal {
      border-top: 1px solid #eee;
    }
    .totals-row.total {
      border-top: 2px solid #000;
      font-size: 18px;
      font-weight: bold;
      padding-top: 15px;
      margin-top: 10px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .status-badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .status-paid {
      background: #d4edda;
      color: #155724;
    }
    .status-pending {
      background: #fff3cd;
      color: #856404;
    }
    .status-cod {
      background: #f8d7da;
      color: #721c24;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .invoice-container {
        box-shadow: none;
        padding: 20px;
      }
      .no-print {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <h1>KIBANA LIFE</h1>
        <p>Premium Vegan Leather Bags</p>
        <p>Made in India</p>
      </div>
      <div class="invoice-details">
        <h2>INVOICE</h2>
        <p><strong>Invoice #:</strong> ${order.id.slice(0, 8).toUpperCase()}</p>
        <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-IN', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</p>
        <p><strong>Payment Status:</strong> 
          <span class="status-badge ${
            order.payment_status === 'paid' ? 'status-paid' : 
            order.payment_method === 'cod' ? 'status-cod' : 'status-pending'
          }">
            ${order.payment_method === 'cod' ? 'COD' : order.payment_status.toUpperCase()}
          </span>
        </p>
      </div>
    </div>

    <!-- Addresses -->
    <div class="addresses">
      <div class="address-block">
        <h3>Bill To</h3>
        <p><strong>${order.customer_name}</strong></p>
        <p>${order.customer_email}</p>
        <p>${order.customer_phone}</p>
        ${order.billing_address ? `
          <p style="margin-top: 10px;">
            ${order.billing_address.addressLine1 || ''}<br>
            ${order.billing_address.addressLine2 ? order.billing_address.addressLine2 + '<br>' : ''}
            ${order.billing_address.city || ''}, ${order.billing_address.state || ''}<br>
            ${order.billing_address.postalCode || ''}<br>
            ${order.billing_address.country || 'India'}
          </p>
        ` : ''}
      </div>
      <div class="address-block">
        <h3>Ship To</h3>
        ${order.shipping_address ? `
          <p><strong>${order.customer_name}</strong></p>
          <p>${order.customer_phone}</p>
          <p style="margin-top: 10px;">
            ${order.shipping_address.addressLine1 || ''}<br>
            ${order.shipping_address.addressLine2 ? order.shipping_address.addressLine2 + '<br>' : ''}
            ${order.shipping_address.city || ''}, ${order.shipping_address.state || ''}<br>
            ${order.shipping_address.postalCode || ''}<br>
            ${order.shipping_address.country || 'India'}
          </p>
        ` : '<p>Same as billing address</p>'}
      </div>
    </div>

    <!-- Items Table -->
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Color</th>
          <th class="text-right">Qty</th>
          <th class="text-right">Price</th>
          <th class="text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((item: any) => `
          <tr>
            <td><strong>${item.name || item.product_name || 'Product'}</strong></td>
            <td>${item.color || 'Default'}</td>
            <td class="text-right">${item.quantity || 1}</td>
            <td class="text-right">₹${(item.price || 0).toLocaleString('en-IN')}</td>
            <td class="text-right">₹${((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="totals-row subtotal">
        <span>Subtotal:</span>
        <span>₹${subtotal.toLocaleString('en-IN')}</span>
      </div>
      ${discount > 0 ? `
      <div class="totals-row">
        <span>Discount (50% OFF):</span>
        <span>-₹${discount.toLocaleString('en-IN')}</span>
      </div>
      ` : ''}
      <div class="totals-row">
        <span>Shipping:</span>
        <span>${shippingFee > 0 ? '₹' + shippingFee.toLocaleString('en-IN') : 'FREE'}</span>
      </div>
      <div class="totals-row total">
        <span>Total:</span>
        <span>₹${total.toLocaleString('en-IN')}</span>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      <p><strong>Thank you for your purchase!</strong></p>
      <p style="margin-top: 10px;">For any queries, please contact us at support@kibanalife.com</p>
      <p style="margin-top: 20px; font-size: 11px;">
        This is a computer-generated invoice and does not require a signature.
      </p>
    </div>

    <!-- Print Button -->
    <div class="no-print" style="text-align: center; margin-top: 30px;">
      <button onclick="window.print()" style="
        background: #000;
        color: white;
        border: none;
        padding: 12px 30px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 1px;
      ">
        Print Invoice
      </button>
    </div>
  </div>
</body>
</html>
  `.trim();
}
