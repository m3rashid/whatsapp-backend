import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  JWT_SECRET: z.string(),
  MONGO_URI: z.string(),
  REDIS_PORT: z.string(),
  REDIS_HOST: z.string(),
  REDIS_USERNAME: z.string(),
  REDIS_PASSWORD: z.string(),
  CLIENT_URL: z.string(),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  SERVER_PORT: z.string().default("4000"),
  JWT_ACCESS_SECRET: z.string(),
});

export type ENV = z.infer<typeof envSchema>;

/**
 * @throws error if the env is not valid as per the schema
 */
const env = envSchema.parse(process.env);

export default env;
