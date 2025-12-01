import { createClient } from 'redis';

let redisClient: ReturnType<typeof createClient> | null = null;

async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });
    
    await redisClient.connect();
  }
  
  return redisClient;
}

export async function rateLimit(identifier: string, limit: number = 5, window: number = 60) {
  try {
    const client = await getRedisClient();
    const key = `rate_limit:${identifier}`;
    
    const current = await client.get(key);
    const count = current ? parseInt(current, 10) : 0;
    
    if (count >= limit) {
      const ttl = await client.ttl(key);
      return {
        success: false,
        remaining: 0,
        reset: Date.now() + ttl * 1000,
      };
    }
    
    await client.multi()
      .incr(key)
      .expire(key, window)
      .exec();
    
    return {
      success: true,
      remaining: limit - count - 1,
      reset: Date.now() + window * 1000,
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // Fail open - allow request if Redis is down
    return { success: true, remaining: limit, reset: Date.now() + window * 1000 };
  }
}
