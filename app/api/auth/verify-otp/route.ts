import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    // Format phone number
    let formattedPhone = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('91')) {
        formattedPhone = '+' + formattedPhone;
      } else {
        formattedPhone = '+91' + formattedPhone;
      }
    }

    // Fetch OTP from Supabase database
    const { data, error } = await supabaseAdmin
      .from('otp_store')
      .select('otp, expires_at')
      .eq('phone', formattedPhone)
      .single();

    if (error || !data) {
      console.error('OTP lookup error:', error?.message);
      return NextResponse.json(
        { error: 'OTP not found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (new Date(data.expires_at) < new Date()) {
      // Delete expired OTP
      await supabaseAdmin
        .from('otp_store')
        .delete()
        .eq('phone', formattedPhone);
      
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (data.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // OTP is valid - remove it from database
    await supabaseAdmin
      .from('otp_store')
      .delete()
      .eq('phone', formattedPhone);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      phone: formattedPhone
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
