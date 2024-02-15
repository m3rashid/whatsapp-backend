import cors from "cors";
import http from "node:http";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import env from "./utils/env";
import authRouter from "./modules/auth";
import { verifyJWT } from "./utils/jwt";
import socketHandler from "./modules/socket";
import messageRouter from "./modules/message";
import type { IO } from "./modules/socket/types";
import { authMiddleware } from "./middlewares/auth";
import globalErrorHandlerMiddleware from "./utils/error";
import { checkIdempotencyKeyMiddleware } from "./middlewares/idempotency";
import { publisherRedisClient, subscriberRedisClient } from "./utils/redis";
import { corsOptions, initializeServer, setupBasicRoutes } from "./utils/init";
import { socketAuthMiddleware } from "./modules/socket/helpers";

const app = express();
app.use(cors(corsOptions));
app.disable("x-powered-by");

const server = http.createServer(app);

const io: IO = new SocketServer(server, { cors: corsOptions });
io.use(socketAuthMiddleware);

io.on("connection", (socket) => socketHandler(io, socket));

io.engine.on("connection_error", (err) => {
  console.log(err.req); // the request object
  console.log(err.code); // the error code, for example 1
  console.log(err.message); // the error message, for example "Session ID unknown"
  console.log(err.context); // some additional error context
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(mongoSanitize());
app.use((req, _, next) => {
  console.log(
    req.method,
    req.url,
    "body: " + JSON.stringify(req.body),
    "query: " + JSON.stringify(req.query),
    "params: " + JSON.stringify(req.params)
  );
  next();
});

setupBasicRoutes(app);
app.use(checkIdempotencyKeyMiddleware);
app.use(authMiddleware);

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.use(globalErrorHandlerMiddleware);

initializeServer()
  .then(() => {
    server.listen(env.SERVER_PORT, () => console.log("server is running"));
    io.adapter(createAdapter(publisherRedisClient, subscriberRedisClient));
  })
  .catch((err) => {
    console.error("Error in initializing server");
    console.error(err);
    process.exit(1);
  });
