import mongoose from "mongoose";

import { SchemaBase } from "../../../utils/schema";

export const userRoles = ["admin", "user"] as const;

export type User = SchemaBase & {
  name: string;
  email: string;
  password: string;
  role: (typeof userRoles)[number];
  phone: string;
};

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: userRoles,
      default: "user",
    },
    phone: {
      type: String,
      required: true,
    },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserModel = mongoose.model<User>("User", userSchema);
export default UserModel;
