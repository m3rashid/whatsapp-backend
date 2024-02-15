import type { Socket as SocketType, Server as SocketServer } from "socket.io";

import type { User } from "../auth/schema/user";

export type ClientToServerSocketEvents = {
  // "new-message": { message: string; sender: string; receiver: string };
  "new-message": any;
  connect: any;
};

export type ServerToClientSocketEvents = {
  // message: Message;
  message: any;
  error: any;
};

export type InterServerSocketEvents = {
  // ...
};

export type SocketData = {
  userId: string;
};

export type IO = SocketServer<
  ClientToServerSocketEvents,
  ServerToClientSocketEvents,
  InterServerSocketEvents,
  SocketData
>;

export type Socket = SocketType<
  ClientToServerSocketEvents,
  ServerToClientSocketEvents,
  InterServerSocketEvents,
  SocketData
>;
