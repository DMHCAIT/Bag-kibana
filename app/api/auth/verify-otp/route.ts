import { NextRequest, NextResponse } from 'next/server';

// In-memory OTP store (shared with send-otp route in same process)
// For serverless, use database/Redis
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

// Also import from send-otp if needed
import { otpStore as sendOtpStore } from '../send-otp/route';

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

    // Check OTP in shared store
    const storedData = sendOtpStore.get(formattedPhone) || otpStore.get(formattedPhone);

    if (!storedData) {
      return NextResponse.json(
        { error: 'OTP not found. Please request a new one.' },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (Date.now() > storedData.expiresAt) {
      sendOtpStore.delete(formattedPhone);
      otpStore.delete(formattedPhone);
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      );
    }

    // OTP is valid - remove it from store
    sendOtpStore.delete(formattedPhone);
    otpStore.delete(formattedPhone);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      phone: formattedPhone
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    );
  }
}
