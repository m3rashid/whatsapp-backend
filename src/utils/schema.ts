import { type ObjectId } from "mongoose";

export type SchemaBase = {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
};
