/**
 * Redis Cache Layer using Upstash
 * 
 * Setup Instructions:
 * 1. Go to https://upstash.com
 * 2. Create a free Redis database
 * 3. Add to .env.local:
 *    UPSTASH_REDIS_REST_URL=your_url
 *    UPSTASH_REDIS_REST_TOKEN=your_token
 * 4. Install: npm install @upstash/redis
 */

// Conditional Redis import - won't break if not installed
let Redis: any;
let redis: any = null;

try {
  Redis = require('@upstash/redis').Redis;
  
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    redis = Redis.fromEnv();
  }
} catch (error) {
  console.log('Redis not configured - using API cache only');
}

/**
 * Get data from cache
 */
export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  
  try {
    const data = await redis.get(key);
    return data as T | null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
}

/**
 * Set data in cache with TTL (seconds)
 */
export async function setCached<T>(key: string, data: T, ttl: number = 600): Promise<boolean> {
  if (!redis) return false;
  
  try {
    await redis.setex(key, ttl, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Redis set error:', error);
    return false;
  }
}

/**
 * Delete data from cache
 */
export async function deleteCached(key: string): Promise<boolean> {
  if (!redis) return false;
  
  try {
    await redis.del(key);
    return true;
  } catch (error) {
    console.error('Redis delete error:', error);
    return false;
  }
}

/**
 * Clear all cache (use sparingly)
 */
export async function clearCache(pattern: string = '*'): Promise<boolean> {
  if (!redis) return false;
  
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return true;
  } catch (error) {
    console.error('Redis clear error:', error);
    return false;
  }
}

/**
 * Check if Redis is available
 */
export function isRedisAvailable(): boolean {
  return redis !== null;
}

// Export redis instance for advanced usage
export { redis };
