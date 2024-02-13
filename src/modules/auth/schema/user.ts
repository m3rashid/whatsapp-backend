import mongoose from "mongoose";

import { type SchemaBase } from "../../../utils/schema";

export const userRoles = ["admin", "user"] as const;

export type User = SchemaBase & {
  phone: string;
  username?: string;
  role: (typeof userRoles)[number];
};

const userSchema = new mongoose.Schema<User>(
  {
    phone: { type: String, required: true },
    username: { type: String },
    role: { type: String, enum: userRoles, default: "user" },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;
