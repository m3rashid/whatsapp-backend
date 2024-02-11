import cors from "cors";
import http from "node:http";
import express from "express";
import pinoHttp from "pino-http";

import env from "./utils/env";
import { SocketService } from "./utils/socket";
import globalErrorHandlerMiddleware from "./utils/error";
import { IDEMPOTENCY_KEY_HEADER } from "./utils/constants";
import { initializeServer, setupBasicRoutes } from "./utils/init";

const app = express();
const server = http.createServer(app);
const socketService = new SocketService(server);

app.use(cors({ credentials: true, origin: env.CLIENT_URL }));
app.disable("x-powered-by");
app.use(
  pinoHttp({
    genReqId: (req) => {
      const reqId = req.headers[IDEMPOTENCY_KEY_HEADER];
      if (!reqId) throw new Error("No idempotency key found");
      return reqId;
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

setupBasicRoutes(app);
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
