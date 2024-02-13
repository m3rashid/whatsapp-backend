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
      60 * 10 // 10 minutes
    );
  } catch (err: any) {
    console.log("Could not add to the redis cache.");
    console.error(err);
  }
}

export async function removeIdempotencyKeyValue(idempotentKey: string) {
  try {
    await idempotenceRedis.del(idempotentKey);
  } catch (err: any) {
    console.log("Could not remove from the redis cache.");
    console.error(err);
  }
}
