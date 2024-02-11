import cors from "cors";
import http from "node:http";
import express from "express";
import { Server } from "socket.io";
import pinoHttp from "pino-http";

import env from "./utils/env";
import { initializeServer, setupBasicRoutes } from "./utils/init";
import globalErrorHandlerMiddleware from "./utils/error";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: env.CLIENT_URL, credentials: true },
});

app.use(cors({ credentials: true, origin: env.CLIENT_URL }));
app.disable("x-powered-by");
app.use(
  pinoHttp({
    genReqId: (req) => {
      const reqId = req.headers["x-idempotency-key"];
      if (!reqId) throw new Error("No idempotency key found");
      return reqId;
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

io.on("connection", (socket) => {
  socket.emit("", socket.id);
});

setupBasicRoutes(app);
app.use(globalErrorHandlerMiddleware);

initializeServer()
  .then(() => {
    app.listen(env.SERVER_PORT, () => console.log("server is running"));
  })
  .catch((err) => {
    console.error("Error in initializing server");
    console.error(err);
    process.exit(1);
  });
