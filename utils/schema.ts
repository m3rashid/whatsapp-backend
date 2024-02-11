import { ObjectId } from "mongoose";
import { z } from "zod";

export type SchemaBase = {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
};
