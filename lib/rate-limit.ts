/**
 * In-memory sliding window rate limiter for Next.js API routes & Server Actions.
 * Protects against brute force attacks and checkout spam.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitRecord>();

// Clean up expired tokens periodically (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetAt) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  /** Identifier prefix (e.g. "login", "checkout", "webhook") */
  prefix: string;
  /** Maximum allowed requests within the window */
  limit: number;
  /** Time window in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
}

/**
 * Checks and increments rate limit counter for a given client identifier (IP or user ID).
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const key = `${options.prefix}:${identifier}`;
  const now = Date.now();
  const windowMs = options.windowSeconds * 1000;

  const current = store.get(key);

  if (!current || now > current.resetAt) {
    const record: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(key, record);
    return {
      success: true,
      remaining: options.limit - 1,
      reset: Math.ceil((now + windowMs) / 1000),
    };
  }

  if (current.count >= options.limit) {
    return {
      success: false,
      remaining: 0,
      reset: Math.ceil(current.resetAt / 1000),
    };
  }

  current.count += 1;
  return {
    success: true,
    remaining: options.limit - current.count,
    reset: Math.ceil(current.resetAt / 1000),
  };
}
