import type { GenerateRequest } from "./schema";

interface CacheEntry {
  data: string;
  timestamp: number;
}

const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// In-memory fallback
const memoryCache = new Map<string, CacheEntry>();

let redisClient: import("ioredis").default | null = null;
let redisInitialized = false;

async function getRedis() {
  if (redisInitialized) return redisClient;
  redisInitialized = true;

  const url = process.env.REDIS_URL;
  if (!url) {
    console.log("[WorksheetCache] No REDIS_URL — using in-memory cache");
    return null;
  }

  try {
    const Redis = (await import("ioredis")).default;
    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      connectTimeout: 3000,
      lazyConnect: true,
    });

    await client.connect();
    console.log("[WorksheetCache] Connected to Redis");
    redisClient = client;
    return client;
  } catch (err) {
    console.warn("[WorksheetCache] Redis unavailable, using in-memory cache:", err);
    return null;
  }
}

export function buildCacheKey(req: GenerateRequest): string {
  const date = new Date().toISOString().split("T")[0];
  return `ws:${req.classNum}:${req.subject}:${req.chapter}:${req.topic || "all"}:${req.difficulty}:${req.questionTypes.sort().join(",")}:${req.numQuestions}:${date}`;
}

export async function getCached(key: string): Promise<string | null> {
  const redis = await getRedis();

  if (redis) {
    try {
      return await redis.get(key);
    } catch {
      /* fall through to memory */
    }
  }

  const entry = memoryCache.get(key);
  if (entry && Date.now() - entry.timestamp < TTL_MS) {
    return entry.data;
  }
  if (entry) memoryCache.delete(key);
  return null;
}

export async function setCache(key: string, data: string): Promise<void> {
  const redis = await getRedis();

  if (redis) {
    try {
      await redis.set(key, data, "EX", Math.floor(TTL_MS / 1000));
      return;
    } catch {
      /* fall through to memory */
    }
  }

  memoryCache.set(key, { data, timestamp: Date.now() });

  // Evict oldest entries if memory cache grows too large
  if (memoryCache.size > 500) {
    const oldest = [...memoryCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp);
    for (let i = 0; i < 100; i++) {
      memoryCache.delete(oldest[i][0]);
    }
  }
}
