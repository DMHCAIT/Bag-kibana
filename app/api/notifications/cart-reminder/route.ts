import { NextRequest, NextResponse } from 'next/server';
import { sendCartReminderNotifications } from '@/lib/notification-service';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { userId, customerName, customerPhone, itemCount } = await request.json();

    if (!customerPhone || !itemCount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Save cart reminder log to database
    await supabaseAdmin.from('cart_reminders').insert({
      user_id: userId,
      customer_name: customerName,
      customer_phone: customerPhone,
      item_count: itemCount,
      sent_at: new Date().toISOString(),
      status: 'pending'
    });

    // Send notifications
    const cartUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kibanalife.com'}/cart`;
    
    const result = await sendCartReminderNotifications({
      customerName: customerName || 'Customer',
      customerPhone,
      itemCount,
      cartUrl
    });

    // Update status in database
    await supabaseAdmin
      .from('cart_reminders')
      .update({
        status: result.smsSuccess || result.whatsappSuccess ? 'sent' : 'failed',
        sms_sent: result.smsSuccess,
        whatsapp_sent: result.whatsappSuccess
      })
      .eq('customer_phone', customerPhone)
      .order('sent_at', { ascending: false })
      .limit(1);

    return NextResponse.json({
      success: true,
      smsSuccess: result.smsSuccess,
      whatsappSuccess: result.whatsappSuccess,
      message: 'Cart reminder sent'
    });
  } catch (error: any) {
    console.error('Cart reminder API error:', error);
    return NextResponse.json(
      { error: 'Failed to send cart reminder' },
      { status: 500 }
    );
  }
}
