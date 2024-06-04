import { createClient, RedisClientType } from "redis";

export const redis: RedisClientType = createClient({
    url: process.env.REDIS_URL
});

export const cacheService: RedisClientType = redis.duplicate();
