import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from './supabase';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name?: string;
}

/**
 * Admin authentication middleware
 * Verifies user has admin role before allowing access
 */
export async function requireAdmin(request: NextRequest): Promise<{ user: AuthenticatedUser } | NextResponse> {
  try {
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Check if user has admin role in database
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('role, name')
      .eq('id', user.id)
      .single();

    if (userError || !userData || userData.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Return authenticated user
    return {
      user: {
        id: user.id,
        email: user.email || '',
        role: userData.role,
        name: userData.name
      }
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Check if user is authenticated (any role)
 */
export async function requireAuth(request: NextRequest): Promise<{ user: AuthenticatedUser } | NextResponse> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - Missing or invalid token' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role, name')
      .eq('id', user.id)
      .single();

    return {
      user: {
        id: user.id,
        email: user.email || '',
        role: userData?.role || 'user',
        name: userData?.name
      }
    };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

/**
 * Optional authentication - returns user if authenticated, null otherwise
 */
export async function optionalAuth(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return null;
    }

    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('role, name')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email || '',
      role: userData?.role || 'user',
      name: userData?.name
    };
  } catch {
    return null;
  }
}
