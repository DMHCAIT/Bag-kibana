import { NextRequest, NextResponse } from 'next/server';
import twilio from 'twilio';

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

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

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with 5-minute expiry
    otpStore.set(formattedPhone, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

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
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}

// Export OTP store for verification
export { otpStore };
