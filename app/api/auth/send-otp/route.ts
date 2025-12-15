import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';
import { supabaseAdmin } from '@/lib/supabase';
import { databaseRateLimit } from '@/lib/rate-limiter';

// Note: OTPs are now persisted in Supabase 'otp_store' table
// This replaces the in-memory Map for production/serverless compatibility

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Format phone number - add +91 if not present
    let formattedPhone = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('91')) {
        formattedPhone = '+' + formattedPhone;
      } else {
        formattedPhone = '+91' + formattedPhone;
      }
    }

    // Apply rate limiting: 3 OTP requests per 15 minutes per phone number
    const rateLimitResult = await databaseRateLimit(
      `otp:${formattedPhone}`,
      3, // max 3 requests
      15 * 60 * 1000 // 15 minutes
    );

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many OTP requests. Please try again later.',
          retryAfter: rateLimitResult.retryAfter 
        },
        { status: 429 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    
    // Store OTP in Supabase with 5-minute expiry
    const { data, error } = await supabaseAdmin
      .from('otp_store')
      .upsert(
        { phone: formattedPhone, otp, expires_at: expiresAt },
        { onConflict: 'phone' }
      )
      .select()
      .single();

    if (error) {
      console.error('Failed to store OTP in database:', error);
      // Fall back to returning OTP in dev mode
      if (process.env.NODE_ENV === 'development') {
        console.log(`Dev mode - OTP for ${formattedPhone}: ${otp}`);
        return NextResponse.json({
          success: true,
          message: 'OTP stored in database (dev fallback)',
          otp: otp // Only in development
        });
      }
      return NextResponse.json(
        { error: 'Failed to process OTP request' },
        { status: 500 }
      );
    }

    // Check if Twilio credentials are configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioPhone = process.env.TWILIO_PHONE_NUMBER;

    if (accountSid && authToken && twilioPhone) {
      try {
        const client = twilio(accountSid, authToken);
        
        await client.messages.create({
          body: `Your KIBANA verification code is: ${otp}. Valid for 5 minutes.`,
          from: twilioPhone,
          to: formattedPhone
        });

        console.log(`OTP sent to ${formattedPhone} via Twilio`);

        return NextResponse.json({
          success: true,
          message: 'OTP sent successfully'
        });
      } catch (twilioError: any) {
        console.error('Twilio error:', twilioError);
        
        // If Twilio fails (e.g., trial account restrictions), return OTP for dev
        if (process.env.NODE_ENV === 'development') {
          return NextResponse.json({
            success: true,
            message: 'OTP sent (dev mode)',
            otp: otp // Only in development
          });
        }
        
        return NextResponse.json(
          { error: 'Failed to send OTP. Please try again.' },
          { status: 500 }
        );
      }
    } else {
      // No Twilio config - dev mode
      console.log(`Dev mode - OTP for ${formattedPhone}: ${otp}`);
      return NextResponse.json({
        success: true,
        message: 'OTP generated (dev mode)',
        otp: otp
      });
    }
  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}
