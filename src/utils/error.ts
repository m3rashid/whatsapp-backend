import {
  type Handler,
  type Request,
  type Response,
  type NextFunction,
} from "express";

import env from "./env";

const globalErrorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  _: NextFunction
) => {
  console.log(err);
  return res.status(500).json({
    message:
      env.NODE_ENV === "production"
        ? "Internal Server Error"
        : JSON.stringify(err?.message) || "Internal Server Error",
  });
};

export default globalErrorHandlerMiddleware;

export function useRoute(handlerFunction: Handler) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(handlerFunction(req, res, next)).catch(next);
  };
}
