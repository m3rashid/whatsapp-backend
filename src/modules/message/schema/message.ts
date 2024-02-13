import mongoose from "mongoose";
import type { SchemaBase } from "../../../utils/schema";

export const messageTypes = ["text", "image", "video", "audio"] as const;
export type MessageType = (typeof messageTypes)[number];

export type Message = SchemaBase & {
  sender: string;
  receiver: string;
  message: MessageType;
  type: string;
};

const messageSchema = new mongoose.Schema<Message>(
  {
    sender: { type: String, required: true },
    receiver: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: messageTypes, default: "text" },
  },
  { timestamps: true }
);

const MessageModel = mongoose.model<Message>("Message", messageSchema);
export default MessageModel;
