const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 5;

const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, retryAfter: 0 };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count++;
  return { allowed: true, retryAfter: 0 };
}
