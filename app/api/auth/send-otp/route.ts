import { NextRequest, NextResponse } from 'next/server';
// Import Twilio for SMS functionality
import twilio from 'twilio';

// For real OTP with Twilio SMS service
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
    const cleanPhone = phone.replace(/\s+/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Indian mobile number' },
        { status: 400 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Format phone number for Twilio (with +91)
    const formattedPhone = cleanPhone.startsWith('+91') 
      ? cleanPhone 
      : `+91${cleanPhone.replace(/^91/, '')}`;

    // Send SMS using Twilio
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;

      if (!accountSid || !authToken || !fromNumber) {
        console.log('Twilio credentials not found, running in development mode');
        console.log(`Development OTP for ${formattedPhone}: ${otp}`);
        
        // Store OTP for verification
        global.otpStorage = global.otpStorage || {};
        global.otpStorage[cleanPhone] = { otp, expiry };

        return NextResponse.json({
          success: true,
          message: 'OTP sent successfully',
          // In development, return OTP for testing
          ...(process.env.NODE_ENV === 'development' && { otp, dev_note: 'OTP shown for development' })
        });
      }

      // Initialize Twilio client
      const client = twilio(accountSid, authToken);

      // Send SMS
      await client.messages.create({
        body: `Your KIBANA verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
        from: fromNumber,
        to: formattedPhone
      });

      console.log(`SMS sent successfully to ${formattedPhone}`);

    } catch (twilioError: any) {
      console.error('Twilio SMS error:', twilioError);
      
      // Fallback to development mode if Twilio fails
      console.log(`Fallback - Development OTP for ${formattedPhone}: ${otp}`);
    }

    // Store OTP in memory (use Redis in production)
    global.otpStorage = global.otpStorage || {};
    global.otpStorage[cleanPhone] = { otp, expiry };

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
      ...(process.env.NODE_ENV === 'development' && { otp, dev_note: 'Check your SMS or use this OTP for testing' })
    });

  } catch (error: any) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    );
  }
}