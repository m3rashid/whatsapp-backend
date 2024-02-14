import Redis from "ioredis";

import env from "./env";

export const publisherRedisClient = new Redis({
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT),
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
});

export const subscriberRedisClient = new Redis({
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT),
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
});

export const idempotenceRedis = new Redis({
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT),
  username: env.REDIS_USERNAME,
  password: env.REDIS_PASSWORD,
});
