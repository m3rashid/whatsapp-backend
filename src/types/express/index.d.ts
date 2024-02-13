import type { User } from "../../modules/auth/schema/user";

declare global {
  namespace Express {
    interface Request {
      userId?: User._id;
      isAuthenticated: boolean;
      idempotentKey: string;
    }
  }
}
