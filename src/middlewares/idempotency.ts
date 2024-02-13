import { z } from "zod";
import type { NextFunction, Request, Response } from "express";

import { idempotenceRedis } from "../utils/redis";
import { IDEMPOTENCY_KEY_HEADER_NAME } from "../utils/constants";

const idempotencyKeyHeaderSchema = z.string().refine((val) => val.length > 0);
export async function checkIdempotencyKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const idempotentKeyDetails = idempotencyKeyHeaderSchema.safeParse(
      req.headers[IDEMPOTENCY_KEY_HEADER_NAME]
    );

    if (!idempotentKeyDetails.success) {
      return res.status(400).json({ message: "Idempotency key is required" });
    }
    req.idempotentKey = idempotentKeyDetails.data;

    const redisDetails = await idempotenceRedis.get(req.idempotentKey);
    if (!redisDetails) {
      console.log("CACHE MISS for " + req.idempotentKey);
      return next();
    }

    const cacheRes = JSON.parse(redisDetails);
    console.log("CACHE HIT", cacheRes);
    return res.status(cacheRes.code).json(cacheRes.json);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
