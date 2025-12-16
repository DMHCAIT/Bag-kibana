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

    // Check if user exists or create new user
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, phone, email, full_name, role')
      .eq('phone', formattedPhone)
      .single();

    let user = existingUser;

    if (existingUser) {
      // Update last login
      await supabaseAdmin
        .from('users')
        .update({
          last_login_at: new Date().toISOString(),
          login_count: supabaseAdmin.rpc('increment', { 
            row_id: existingUser.id, 
            column_name: 'login_count' 
          }),
        })
        .eq('id', existingUser.id);

      // Log login
      await supabaseAdmin
        .from('login_history')
        .insert({
          user_id: existingUser.id,
          phone: formattedPhone,
          email: existingUser.email,
          login_method: 'phone_otp',
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
          user_agent: request.headers.get('user-agent'),
          status: 'success',
        });
    }

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      phone: formattedPhone,
      user: user || null,
      isNewUser: !existingUser
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
