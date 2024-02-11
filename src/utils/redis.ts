import Redis from "ioredis";
import env from "./env";

export const publisher = new Redis({
  host: "localhost",
  port: parseInt(env.REDIS_URI.split(":")[1] as string),
  username: "default",
});

export const subscriber = new Redis({
  host: "localhost",
  port: parseInt(env.REDIS_URI.split(":")[1] as string),
  username: "default",
});
