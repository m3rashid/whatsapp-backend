import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string(),
  MONGO_URI: z.string(),
  REDIS_URI: z.string(),
  CLIENT_URL: z.string(),
  NODE_ENV: z.string().default("development"),
  SERVER_PORT: z.string().default("4000"),
});

export type ENV = z.infer<typeof envSchema>;

/**
 * @throws error if the env is not valid as per the schema
 */
const env = envSchema.parse(process.env);

export default env;
