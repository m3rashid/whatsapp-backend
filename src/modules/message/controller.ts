import { z } from "zod";
import type { Request, Response } from "express";

import { messageTypes } from "./schema/message";

const newMessageSchema = z
  .object({
    message: z.string(),
    sender: z.string(),
    receiver: z.string(),
    type: z.enum(messageTypes).optional(),
  })
  .strict();
export function newMessage(
  req: Request<any, any, z.infer<typeof newMessageSchema>>,
  res: Response
) {
  newMessageSchema.parse(req.body);
  // ...
  return res.status(200).json({ message: "Message Sent" });
}
