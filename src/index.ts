import cors from "cors";
import http from "node:http";
import express from "express";
import pinoHttp from "pino-http";
import mongoSanitize from "express-mongo-sanitize";

import env from "./utils/env";
import authRouter from "./modules/auth";
import messageRouter from "./modules/message";
import { SocketService } from "./utils/socket";
import { authMiddleware } from "./middlewares/auth";
import globalErrorHandlerMiddleware from "./utils/error";
import { initializeServer, setupBasicRoutes } from "./utils/init";
import { checkIdempotencyKeyMiddleware } from "./middlewares/idempotency";

const app = express();
const server = http.createServer(app);
const socketService = new SocketService(server);

app.disable("x-powered-by");
app.use(cors({ credentials: true, origin: env.CLIENT_URL }));
app.use(checkIdempotencyKeyMiddleware);

app.use(pinoHttp({}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(mongoSanitize());
app.use(authMiddleware);

setupBasicRoutes(app);
app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);

app.use(globalErrorHandlerMiddleware);

initializeServer()
  .then(() => {
    app.listen(env.SERVER_PORT, () => console.log("server is running"));
    socketService.initListeners();
  })
  .catch((err) => {
    console.error("Error in initializing server");
    console.error(err);
    process.exit(1);
  });
