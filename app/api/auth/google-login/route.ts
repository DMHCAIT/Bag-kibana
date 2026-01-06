import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Helper to extract device info from user agent
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();
  
  let device_type = 'desktop';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(userAgent)) {
    device_type = 'tablet';
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(userAgent)) {
    device_type = 'mobile';
  }
  
  let browser = 'unknown';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('edge')) browser = 'Edge';
  
  let os = 'unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'MacOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('ios') || ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';
  
  return { device_type, browser, os };
}

export async function POST(request: NextRequest) {
  try {
    const { credential, user_info } = await request.json();

    if (!credential || !user_info) {
      return NextResponse.json(
        { error: 'Google credential and user info are required' },
        { status: 400 }
      );
    }

    const { email, name, picture, sub: google_id } = user_info;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required from Google account' },
        { status: 400 }
      );
    }

    // Check if user exists by email or Google ID
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, phone, email, full_name, google_id, role, login_count')
      .eq('email', email)
      .single();

    let user = existingUser;
    const isNewUser = !existingUser;

    if (existingUser) {
      // Update existing user with Google info if missing
      const updateData: any = {
        last_login_at: new Date().toISOString(),
        login_count: (existingUser.login_count || 0) + 1,
      };

      if (!existingUser.google_id) {
        updateData.google_id = google_id;
      }
      if (!existingUser.full_name && name) {
        updateData.full_name = name;
      }

      const { data: updatedUser } = await supabaseAdmin
        .from('users')
        .update(updateData)
        .eq('id', existingUser.id)
        .select()
        .single();

      user = updatedUser || existingUser;

      // Log login
      try {
        const deviceInfo = parseUserAgent(request.headers.get('user-agent') || '');
        await supabaseAdmin
          .from('login_history')
          .insert({
            user_id: existingUser.id,
            phone: existingUser.phone,
            email: existingUser.email,
            login_method: 'google',
            ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            user_agent: request.headers.get('user-agent'),
            device_type: deviceInfo.device_type,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            status: 'success',
          });
      } catch (loginHistoryError) {
        console.error('Failed to log login history (non-fatal):', loginHistoryError);
      }
    } else {
      // Create new user with all required fields
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert({
          email: email,
          full_name: name || null,
          phone: null, // Will be updated when user adds phone
          google_id: google_id,
          role: 'customer',
          phone_verified: false,
          registration_method: 'google',
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || null,
          user_agent: request.headers.get('user-agent') || null,
          last_login_at: new Date().toISOString(),
          login_count: 1,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create Google user:', {
          error: error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          userData: { email, name, google_id }
        });
        
        let errorMessage = 'Failed to create user account';
        if (error.message?.includes('duplicate key value')) {
          errorMessage = 'User with this email already exists';
        } else if (error.message?.includes('violates check constraint')) {
          errorMessage = 'Invalid data provided for user creation';
        } else if (error.message?.includes('column') && error.message?.includes('does not exist')) {
          errorMessage = 'Database schema mismatch - please contact support';
        }
        
        return NextResponse.json(
          { 
            error: errorMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
          },
          { status: 500 }
        );
      }

      user = newUser;

      // Log registration
      try {
        const deviceInfo = parseUserAgent(request.headers.get('user-agent') || '');
        await supabaseAdmin
          .from('login_history')
          .insert({
            user_id: newUser.id,
            phone: null,
            email: newUser.email,
            login_method: 'google',
            ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            user_agent: request.headers.get('user-agent'),
            device_type: deviceInfo.device_type,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            status: 'success',
          });
      } catch (registrationHistoryError) {
        console.error('Failed to log registration history (non-fatal):', registrationHistoryError);
      }

      // Log user activity
      try {
        await supabaseAdmin
          .from('user_activity_logs')
          .insert({
            user_id: newUser.id,
            activity_type: 'registration',
            activity_description: 'New user registered via Google OAuth',
            metadata: { 
              email: newUser.email,
              full_name: newUser.full_name,
              registration_method: 'google',
            },
            ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
            user_agent: request.headers.get('user-agent'),
          });
      } catch (activityLogError) {
        console.error('Failed to log user activity (non-fatal):', activityLogError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Google login successful',
      user: user,
      isNewUser: isNewUser
    });

  } catch (error: any) {
    console.error('Google login error:', error);
    return NextResponse.json(
      { error: 'Failed to process Google login' },
      { status: 500 }
    );
  }
}