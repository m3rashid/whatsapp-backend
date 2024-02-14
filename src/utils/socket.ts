import { type Server } from "node:http";
import { Server as SocketServer } from "socket.io";

import env from "./env";
import { produceMessage } from "./kafka";
import { publisher, subscriber } from "./redis";
import { MESSAGES_EVENT_REDIS, socketEvents } from "./constants";

export type ClientToServerSocketEvents = {
  // ...
};

export type ServerToClientSocketEvents = {
  // ...
};

export type InterServerSocketEvents = {
  // ...
};

export class SocketService {
  private _io: SocketServer;

  constructor(server: Server) {
    this._io = new SocketServer(server, {
      cors: {
        credentials: true,
        origin: env.CLIENT_URL,
        methods: ["GET", "POST"],
      },
    });
    subscriber.subscribe(MESSAGES_EVENT_REDIS);
  }

  get io() {
    return this._io;
  }

  public initListeners() {
    const io = this.io;
    io.on("connection", (socket) => {
      console.log("New Socket Connected", socket.id);
      socket.on(
        socketEvents.MESSAGE,
        // async ({ message }: { message: string }) => {
        async (params) => {
          console.log(params);
          console.log("New Message Rec.", params.message);
          // publish this message to redis
          await publisher.publish(
            MESSAGES_EVENT_REDIS,
            JSON.stringify({ message: params.message })
          );
        }
      );
    });

    io.engine.on("connection_error", (err) => {
      console.log(err.req); // the request object
      console.log(err.code); // the error code, for example 1
      console.log(err.message); // the error message, for example "Session ID unknown"
      console.log(err.context); // some additional error context
    });

    subscriber.on(MESSAGES_EVENT_REDIS, async (channel, message) => {
      if (channel === MESSAGES_EVENT_REDIS) {
        console.log("new message from redis", message);
        io.emit("message", message);
        await produceMessage(message);
        console.log("Message Produced to Kafka Broker");
      }
    });
  }
}
