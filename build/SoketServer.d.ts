import { Server } from "socket.io";
import ClientToServerEvents from "./Interfaces/Socket/ClientToServerEvents";
import InterServerEvents from "./Interfaces/Socket/InterServerEvents";
import ServerToClientEvents from "./Interfaces/Socket/ServerToClientEvents";
import SocketData from "./Interfaces/Socket/SocketData";
declare class SocketServer {
    private static _io;
    static get getInstance(): Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;
}
export default SocketServer;
