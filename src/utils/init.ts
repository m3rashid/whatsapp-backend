import mongoose from "mongoose";
import { type Express } from "express";

import env from "./env";
import { setIdempotencyKeyValue } from "./idempotency";

/**
 * @description Connects to the database
 * @throws error if the connection fails
 */
export async function initializeServer() {
  await mongoose.connect(env.MONGO_URI);
  console.log("Connected to the database");
  // !TODO
}

/**
 * @description Set up basic routes for the server
 */
export function setupBasicRoutes(app: Express) {
  app.get("/", async (req, res) => {
    return res.status(200).json({ message: "Welcome to the server" });
  });

  app.get("/health", (req, res) => {
    const healthcheck = {
      uptime: process.uptime(),
      responseTime: process.hrtime(),
      message: "OK",
      timestamp: Date.now(),
    };

    try {
      return res.status(200).send(healthcheck);
    } catch (error: any) {
      healthcheck.message = error;
      return res.status(503).send(healthcheck);
    }
  });
}
