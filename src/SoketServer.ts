import { Server } from "socket.io";
import server from "./WebServer";
import ClientToServerEvents from "./Interfaces/Socket/ClientToServerEvents";
import InterServerEvents from "./Interfaces/Socket/InterServerEvents";
import ServerToClientEvents from "./Interfaces/Socket/ServerToClientEvents";
import SocketData from "./Interfaces/Socket/SocketData";

class SocketServer {
  private static _io:
    | Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >
    | undefined;

  public static get getInstance() {
    return (
      this._io ||
      (this._io = new Server<
        ClientToServerEvents,
        ServerToClientEvents,
        InterServerEvents,
        SocketData
      >(server, { cors: { origin: "*" }, maxHttpBufferSize: 2e7 }))
    );
  }
}

export default SocketServer;
