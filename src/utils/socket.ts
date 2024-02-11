import { type Server } from "node:http";
import { Server as SocketServer } from "socket.io";

import env from "./env";
import { produceMessage } from "./kafka";
import { publisher, subscriber } from "./redis";
import { MESSAGES_CHANNEL_REDIS, MESSAGES_EVENT_REDIS } from "./constants";

export class SocketService {
  private _io: SocketServer;

  constructor(server: Server) {
    console.log("Init Socket Service...");
    this._io = new SocketServer(server, {
      cors: { credentials: true, origin: env.CLIENT_URL },
    });
    subscriber.subscribe(MESSAGES_CHANNEL_REDIS);
  }

  get io() {
    return this._io;
  }

  public initListeners() {
    const io = this.io;
    console.log("Init Socket Listeners...");

    io.on("connect", (socket) => {
      console.log(`New Socket Connected`, socket.id);
      socket.on("event:message", async ({ message }: { message: string }) => {
        console.log("New Message Rec.", message);
        // publish this message to redis
        await publisher.publish(
          MESSAGES_CHANNEL_REDIS,
          JSON.stringify({ message })
        );
      });
    });

    subscriber.on(MESSAGES_EVENT_REDIS, async (channel, message) => {
      if (channel === MESSAGES_CHANNEL_REDIS) {
        console.log("new message from redis", message);
        io.emit("message", message);
        await produceMessage(message);
        console.log("Message Produced to Kafka Broker");
      }
    });
  }
}
