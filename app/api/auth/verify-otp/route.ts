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
      .select('id, phone, email, full_name, role, login_count')
      .eq('phone', formattedPhone)
      .single();

    let user = existingUser;

    if (existingUser) {
      // Update last login and increment login count
      await supabaseAdmin
        .from('users')
        .update({
          last_login_at: new Date().toISOString(),
          login_count: (existingUser as any).login_count ? (existingUser as any).login_count + 1 : 1,
        })
        .eq('id', existingUser.id);

      // Log login to login_history
      try {
        await supabaseAdmin
          .from('login_history')
          .insert({
            user_id: existingUser.id,
            phone: formattedPhone,
            email: existingUser.email || null,
            login_method: 'phone_otp',
            ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
            user_agent: request.headers.get('user-agent') || 'unknown',
            status: 'success',
          });
        console.log('Login history recorded for user:', existingUser.id);
      } catch (loginHistoryError) {
        console.error('Failed to log login history:', loginHistoryError);
        // Don't fail the login if history logging fails
      }
    } else {
      // New user — create in Supabase users table and log first login
      try {
        const { data: newUser, error: createError } = await supabaseAdmin
          .from('users')
          .insert({
            phone: formattedPhone,
            role: 'user',
            login_count: 1,
            last_login_at: new Date().toISOString(),
          })
          .select('id, phone, email, full_name, role')
          .single();

        if (!createError && newUser) {
          user = newUser;
          console.log('New user created:', newUser.id);

          // Log first login
          await supabaseAdmin
            .from('login_history')
            .insert({
              user_id: newUser.id,
              phone: formattedPhone,
              login_method: 'phone_otp',
              ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
              user_agent: request.headers.get('user-agent') || 'unknown',
              status: 'success',
            });
        } else {
          console.error('Failed to create new user:', createError);
        }
      } catch (newUserError) {
        console.error('Error creating new user:', newUserError);
      }
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
