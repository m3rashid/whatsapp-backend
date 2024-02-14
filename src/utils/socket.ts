import { type Server } from "node:http";
import { Server as SocketServer } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";

import env from "./env";
import type { Message } from "../modules/message/schema/message";
import { publisherRedisClient, subscriberRedisClient } from "./redis";

export type ClientToServerSocketEvents = {
  "new-message": { message: string; sender: string; receiver: string };
};

export type ServerToClientSocketEvents = {
  message: Message;
};

export type InterServerSocketEvents = {
  // ...
};

export type SocketData = {
  // ...
};

export type IO = SocketServer<
  ClientToServerSocketEvents,
  ServerToClientSocketEvents,
  InterServerSocketEvents,
  SocketData
>;

export class SocketService {
  private _io: IO;

  constructor(server: Server) {
    this._io = new SocketServer(server, {
      cors: {
        credentials: true,
        origin: env.CLIENT_URL,
        methods: ["GET", "POST"],
      },
    });
  }

  get io() {
    return this._io;
  }

  public initListeners() {
    const io = this.io;
    io.adapter(createAdapter(publisherRedisClient, subscriberRedisClient));

    io.on("connection", (socket) => {
      console.log("New Socket Connected", socket.id);
      // socket.on(
      //   socketEvents.MESSAGE,
      //   // async ({ message }: { message: string }) => {
      //   async (params) => {
      //     console.log(params);
      //     console.log("New Message Rec.", params.message);
      //     // publish this message to redis
      //     await publisher.publish(
      //       MESSAGES_EVENT_REDIS,
      //       JSON.stringify({ message: params.message })
      //     );
      //   }
      // );
    });

    io.engine.on("connection_error", (err) => {
      console.log(err.req); // the request object
      console.log(err.code); // the error code, for example 1
      console.log(err.message); // the error message, for example "Session ID unknown"
      console.log(err.context); // some additional error context
    });

    // subscriberRedisClient.on(MESSAGES_EVENT_REDIS, async (channel, message) => {
    //   if (channel === MESSAGES_EVENT_REDIS) {
    //     console.log("new message from redis", message);
    //     // io.emit("message", message);
    //     // await produceMessage(message);
    //     console.log("Message Produced to Kafka Broker");
    //   }
    // });
  }
}
