import env from "./env";

export const IDEMPOTENCY_KEY_HEADER_NAME = "x-idempotence-key";

export const MESSAGES_KAFKA_TOPIC = "MESSAGES";

export const MESSAGES_EVENT_REDIS = "MESSAGES";

export const isDevelopment = env.NODE_ENV === "development";

export const socketEvents = {
  MESSAGE: "message",
};
