import Redis from "ioredis";

let redisClient: Redis | null = null;

export function getRedisClient() {
  if (redisClient) return redisClient;

  const url = process.env.REDIS_URL || process.env.REDIS_URI;
  if (!url) return null;

  redisClient = new Redis(url);
  redisClient.on("error", (err) => {
    console.error("Redis error:", err);
  });

  return redisClient;
}

export async function getCached(key: string) {
  const client = getRedisClient();
  if (!client) return null;
  try {
    const raw = await client.get(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("Redis get error", err);
    return null;
  }
}

export async function setCached(key: string, value: unknown, ttlSeconds = 30) {
  const client = getRedisClient();
  if (!client) return false;
  try {
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
    return true;
  } catch (err) {
    console.error("Redis set error", err);
    return false;
  }
}
