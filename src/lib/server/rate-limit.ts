type Hit = {
  count: number;
  resetAt: number;
};

const hits = new Map<string, Hit>();

export function checkRateLimit(key: string, limit = 8, windowMs = 60_000) {
  const now = Date.now();
  const current = hits.get(key);

  if (!current || current.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  current.count += 1;

  return {
    allowed: current.count <= limit,
    remaining: Math.max(0, limit - current.count)
  };
}

export function clearRateLimitForTests() {
  hits.clear();
}
