import type { NextFunction, Request, Response } from "express";

import { verifyJWT } from "../utils/jwt";

export function authMiddleware(req: Request, _: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    req.isAuthenticated = false;
    req.userId = undefined;
    return next();
  }

  const { expired, payload, valid } = verifyJWT(token);
  if (expired || !valid || !payload) {
    req.isAuthenticated = false;
    req.userId = undefined;
    return next();
  }

  req.userId = payload?.sub;
  req.isAuthenticated = true;
  next();
}

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}
