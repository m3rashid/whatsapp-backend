import { idempotenceRedis } from "./redis";

export type IdempotentResponse = {
  code: number;
  json: Object;
};

export async function setIdempotencyKeyValue(
  idempotentKey: string,
  response: IdempotentResponse
) {
  try {
    await idempotenceRedis.set(
      idempotentKey,
      JSON.stringify(response),
      "EX",
      60 * 15 // 15 minutes
    );
  } catch (err: any) {
    console.log("Could not add to the redis cache.");
    console.error(err);
  }
}
