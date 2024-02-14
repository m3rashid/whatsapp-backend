import env from "./env";

export const IDEMPOTENCY_KEY_HEADER_NAME = "x-idempotence-key";

export const MESSAGES_KAFKA_TOPIC = "MESSAGES";

export const isDevelopment = env.NODE_ENV === "development";
