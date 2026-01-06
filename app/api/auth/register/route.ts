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

// POST - Register new user with phone OTP
export async function POST(request: NextRequest) {
  try {
    const { phone, full_name, email } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
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

    // Get request metadata
    const ip_address = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    const user_agent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer');
    const deviceInfo = parseUserAgent(user_agent);

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id, phone, email, full_name, login_count')
      .eq('phone', formattedPhone)
      .single();

    let userId: string;

    if (existingUser) {
      // User exists - update their info if provided
      const updates: any = {
        last_login_at: new Date().toISOString(),
        login_count: (existingUser.login_count || 0) + 1,
        ip_address,
        user_agent,
      };

      if (full_name && !existingUser.full_name) {
        updates.full_name = full_name;
      }
      if (email && !existingUser.email) {
        updates.email = email;
      }

      await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', existingUser.id);

      userId = existingUser.id;

      // Log login activity (non-blocking)
      try {
        await supabaseAdmin
          .from('login_history')
          .insert({
            user_id: userId,
            phone: formattedPhone,
            email: existingUser.email,
            login_method: 'phone_otp',
            ip_address,
            user_agent,
            device_type: deviceInfo.device_type,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            status: 'success',
          });
      } catch (loginHistoryError) {
        console.error('Failed to log login history for existing user:', loginHistoryError);
      }

      try {
        await supabaseAdmin
          .from('user_activity_logs')
          .insert({
            user_id: userId,
            activity_type: 'login',
            activity_description: 'User logged in via phone OTP',
            metadata: { phone: formattedPhone, device: deviceInfo },
            ip_address,
            user_agent,
          });
      } catch (activityLogError) {
        console.error('Failed to log user activity for existing user:', activityLogError);
      }

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: existingUser.id,
          phone: formattedPhone,
          email: existingUser.email,
          full_name: existingUser.full_name,
        },
        isNewUser: false,
      });
    } else {
      // Create new user with Supabase Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        phone: formattedPhone,
        phone_confirm: true, // Auto-confirm since we verified OTP
        user_metadata: {
          full_name: full_name || '',
          phone: formattedPhone,
        },
      });

      if (authError || !authData.user) {
        console.error('Auth user creation error:', authError);
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        );
      }

      userId = authData.user.id;

      // Create user record in public.users table
      const userInsertData = {
        id: userId,
        phone: formattedPhone,
        email: email || `${formattedPhone}@kibana.temp`, // Ensure email is not null
        full_name: full_name || null,
        role: 'customer' as const,
        phone_verified: true,
        registration_method: 'phone' as const,
        ip_address,
        user_agent,
        referral_source: referer || null,
        last_login_at: new Date().toISOString(),
        login_count: 1,
        status: 'active' as const,
      };

      console.log('Attempting to insert user data:', { ...userInsertData, user_agent: userInsertData.user_agent?.substring(0, 50) + '...' });

      const { data: insertResult, error: userError } = await supabaseAdmin
        .from('users')
        .insert(userInsertData)
        .select('*');

      if (userError) {
        console.error('User table insert error:', {
          error: userError,
          message: userError.message,
          details: userError.details,
          hint: userError.hint,
          code: userError.code,
          insertData: { ...userInsertData, user_agent: userInsertData.user_agent?.substring(0, 50) + '...' }
        });

        // Try to clean up auth user
        try {
          await supabaseAdmin.auth.admin.deleteUser(userId);
          console.log('Cleaned up auth user:', userId);
        } catch (cleanupError) {
          console.error('Failed to cleanup auth user:', cleanupError);
        }

        // Return specific error information for debugging
        let errorMessage = 'Failed to create user profile';
        if (userError.message?.includes('duplicate key value')) {
          errorMessage = 'User with this phone number already exists';
        } else if (userError.message?.includes('violates check constraint')) {
          errorMessage = 'Invalid data provided for user creation';
        } else if (userError.message?.includes('column') && userError.message?.includes('does not exist')) {
          errorMessage = 'Database schema mismatch - please contact support';
        }

        return NextResponse.json(
          { 
            error: errorMessage, 
            details: userError.message,
            code: userError.code 
          },
          { status: 500 }
        );
      }

      console.log('User created successfully:', insertResult);

      // Log registration activity (non-blocking)
      try {
        await supabaseAdmin
          .from('login_history')
          .insert({
            user_id: userId,
            phone: formattedPhone,
            email: email,
            login_method: 'phone_otp',
            ip_address,
            user_agent,
            device_type: deviceInfo.device_type,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            status: 'success',
          });
      } catch (loginHistoryError) {
        console.error('Failed to log login history:', loginHistoryError);
      }

      try {
        await supabaseAdmin
          .from('user_activity_logs')
          .insert({
            user_id: userId,
            activity_type: 'registration',
            activity_description: 'New user registered via phone OTP',
            metadata: { 
              phone: formattedPhone, 
              email: email,
              full_name: full_name,
              device: deviceInfo,
            },
            ip_address,
            user_agent,
          });
      } catch (activityLogError) {
        console.error('Failed to log user activity:', activityLogError);
      }

      return NextResponse.json({
        success: true,
        message: 'Registration successful',
        user: {
          id: userId,
          phone: formattedPhone,
          email: email,
          full_name: full_name,
        },
        isNewUser: true,
      });
    }
  } catch (error: any) {
    console.error('Register user error:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
