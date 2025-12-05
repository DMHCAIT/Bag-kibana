import { NextRequest, NextResponse } from 'next/server';

// For real OTP, you'll need to choose one of these services:
// 1. Twilio - https://www.twilio.com/
// 2. AWS SNS - https://aws.amazon.com/sns/
// 3. Firebase Auth - https://firebase.google.com/products/auth
// 4. MSG91 (India) - https://msg91.com/
// 5. Textlocal (India) - https://www.textlocal.in/

export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Validate Indian mobile number
    const phoneRegex = /^(\+91|91)?[6-9][0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      return NextResponse.json(
        { success: false, error: 'Invalid Indian mobile number' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // For development - just log the OTP
    console.log(`OTP for ${phone}: ${otp}`);

    // PRODUCTION SETUP NEEDED:
    // Uncomment and configure one of these services:

    // Option 1: Twilio
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = require('twilio')(accountSid, authToken);

    await client.messages.create({
      body: `Your KIBANA verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });
    */

    // Option 2: MSG91 (India)
    /*
    const response = await fetch('https://api.msg91.com/api/v5/otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': process.env.MSG91_API_KEY
      },
      body: JSON.stringify({
        template_id: process.env.MSG91_TEMPLATE_ID,
        mobile: phone,
        authkey: process.env.MSG91_API_KEY,
        otp: otp
      })
    });
    */

    // Store OTP in a database or cache (Redis recommended for production)
    // For now, using in-memory storage (not suitable for production)
    global.otpStorage = global.otpStorage || {};
    global.otpStorage[phone] = { otp, expiry };

    // Clean up expired OTPs
    Object.keys(global.otpStorage).forEach(key => {
      if (Date.now() > global.otpStorage[key].expiry) {
        delete global.otpStorage[key];
      }
    });

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      // In development, return OTP for testing
      ...(process.env.NODE_ENV === 'development' && { otp })
    });

  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}