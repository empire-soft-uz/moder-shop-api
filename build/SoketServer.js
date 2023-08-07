"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const WebServer_1 = __importDefault(require("./WebServer"));
class SocketServer {
    static get getInstance() {
        return (this._io ||
            (this._io = new socket_io_1.Server(WebServer_1.default, { cors: { origin: "*" }, maxHttpBufferSize: 2e7 })));
    }
}
exports.default = SocketServer;
