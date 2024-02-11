import env from "./env";

export const IDEMPOTENCY_KEY_HEADER = "x-idempotency-key";

export const MESSAGES_KAFKA_TOPIC = "MESSAGES";

export const MESSAGES_CHANNEL_REDIS = "MESSAGES";
export const MESSAGES_EVENT_REDIS = "message";

export const isDevelopment = env.NODE_ENV === "development";
