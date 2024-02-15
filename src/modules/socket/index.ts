import { safeSocket } from "./helpers";
import type { IO, Socket } from "./types";

function socketHandler(io: IO, socket: Socket) {
  console.log(
    "incoming connection wit ID:",
    socket.id,
    "for userID:",
    socket.data.userId
  );

  socket.on(
    "new-message",
    safeSocket((io, socket) => async (data: any) => {
      // console.log("new-message", data);
      io.emit("message", data);
    })(io, socket)
  );
}

export default socketHandler;
