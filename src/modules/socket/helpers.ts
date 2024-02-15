import env from "../../utils/env";
import type { IO, Socket } from "./types";
import { verifyJWT } from "../../utils/jwt";

export function safeSocket(handler: (io: IO, socket: Socket) => any) {
  return function (io: IO, socket: Socket) {
    io.use((socket, e) => {});
    return function (...args: any[]) {
      console.log("Socket", socket.id, "called", handler.name, "with", ...args);

      Promise.resolve(handler(io, socket)(...args)).catch((err: any) => {
        console.log("Socket Err", err);

        io.emit("error", {
          message:
            env.NODE_ENV === "production"
              ? "An error Occured"
              : JSON.stringify(err.message) || "An error Occured",
        });
      });
    };
  };
}

export function socketAuthMiddleware(
  socket: Socket,
  next: (err?: (Error & { data?: any }) | undefined) => void
) {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error("Auth error");
    const { payload } = verifyJWT(token);
    if (!payload) throw new Error("Auth error");
    socket.data.userId = payload.sub as any;
    return next();
  } catch (err: any) {
    console.log("Socket Err", err);
    next(err);
  }
}
