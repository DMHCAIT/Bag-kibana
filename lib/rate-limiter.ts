import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from './supabase';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
  identifier?: (request: NextRequest) => string;
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production for multi-instance deployments)
const rateLimitStore = new Map<string, RateLimitStore>();

/**
 * Rate limiter middleware
 * Limits requests per IP/identifier within a time window
 */
export function rateLimit(config: RateLimitConfig) {
  const { maxRequests, windowMs, identifier } = config;

  return async (request: NextRequest): Promise<NextResponse | null> => {
    try {
      // Get identifier (IP address or custom identifier)
      const key = identifier 
        ? identifier(request)
        : getClientIdentifier(request);

      const now = Date.now();
      const limitData = rateLimitStore.get(key);

      // Clean up expired entries periodically
      if (Math.random() < 0.01) { // 1% chance to cleanup
        cleanupExpiredEntries(now);
      }

      // Check if limit exists and is still valid
      if (limitData && limitData.resetTime > now) {
        if (limitData.count >= maxRequests) {
          const retryAfter = Math.ceil((limitData.resetTime - now) / 1000);
          
          return NextResponse.json(
            { 
              error: 'Too many requests. Please try again later.',
              retryAfter 
            },
            { 
              status: 429,
              headers: {
                'Retry-After': retryAfter.toString(),
                'X-RateLimit-Limit': maxRequests.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': limitData.resetTime.toString()
              }
            }
          );
        }

        // Increment count
        limitData.count++;
        
      } else {
        // Create new limit window
        rateLimitStore.set(key, {
          count: 1,
          resetTime: now + windowMs
        });
      }

      return null; // Allow request
    } catch (error) {
      console.error('Rate limiter error:', error);
      return null; // Allow request on error (fail open)
    }
  };
}

/**
 * Database-backed rate limiter for production use
 * Uses Supabase to track rate limits across multiple instances
 */
export async function databaseRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): Promise<{ allowed: boolean; retryAfter?: number }> {
  try {
    const now = Date.now();
    const windowStart = now - windowMs;

    // Get recent requests from database
    const { data: requests, error } = await supabaseAdmin
      .from('rate_limits')
      .select('created_at')
      .eq('identifier', identifier)
      .gte('created_at', new Date(windowStart).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database rate limit error:', error);
      return { allowed: true }; // Fail open
    }

    const requestCount = requests?.length || 0;

    if (requestCount >= maxRequests) {
      // Calculate retry after
      const oldestRequest = requests?.[requestCount - 1];
      const resetTime = oldestRequest 
        ? new Date(oldestRequest.created_at).getTime() + windowMs
        : now + windowMs;
      
      return {
        allowed: false,
        retryAfter: Math.ceil((resetTime - now) / 1000)
      };
    }

    // Record this request
    await supabaseAdmin
      .from('rate_limits')
      .insert({
        identifier,
        created_at: new Date().toISOString()
      });

    return { allowed: true };
  } catch (error) {
    console.error('Database rate limit error:', error);
    return { allowed: true }; // Fail open
  }
}

/**
 * Get client identifier from request
 */
function getClientIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (when behind proxy/CDN)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }

  // Fallback to unknown (Next.js request doesn't expose IP directly)
  return 'unknown';
}

/**
 * Clean up expired entries from in-memory store
 */
function cleanupExpiredEntries(now: number): void {
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * OTP-specific rate limiter
 * More restrictive to prevent abuse
 */
export const otpRateLimiter = rateLimit({
  maxRequests: 3, // 3 OTP requests
  windowMs: 15 * 60 * 1000, // per 15 minutes
  identifier: (request) => {
    const body = request.json();
    return `otp:${getClientIdentifier(request)}`;
  }
});

/**
 * General API rate limiter
 */
export const apiRateLimiter = rateLimit({
  maxRequests: 100, // 100 requests
  windowMs: 60 * 1000, // per minute
});
