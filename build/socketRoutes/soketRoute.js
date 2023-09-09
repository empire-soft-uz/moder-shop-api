"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SoketServer_1 = __importDefault(require("../SoketServer"));
const node_fs_1 = __importDefault(require("node:fs"));
const io = SoketServer_1.default.getInstance;
const path_1 = __importDefault(require("path"));
const Chat_1 = __importDefault(require("../Models/Chat"));
const Message_1 = __importDefault(require("../Models/Message"));
let usrs = [];
const startSocketServer = () => {
    console.log("Starting Socket Server");
    io.on("connection", (socket) => {
        console.log("New user connected", socket.id);
        socket.on("newUser", (msg) => {
            let user = Object.assign(Object.assign({}, JSON.parse(msg)), { socketId: socket.id });
            usrs.push({ socketId: socket.id, id: user.id });
        });
        socket.on("chatSelected", (chat) => {
            const u = usrs.find((U) => U.id === chat.admin.id || chat.user.id);
            socket.join(chat.id.toString());
            if (u) {
                //@ts-ignore
                io.sockets.sockets.get(u.socketId).join(chat.id);
                //@ts-ignore
                io.sockets.sockets
                    .get(u.socketId)
                    .emit("newChatAdminNotification", chat);
            }
        });
        socket.on("recieveMsg", (msg) => __awaiter(void 0, void 0, void 0, function* () {
            let m = {
                sender: msg.sender,
                reciever: msg.reciever,
                chat: msg.chat,
            };
            //@ts-ignore
            // var room = io.in(msg.chat);
            // console.log([...room.adapter.rooms], msg.chat);
            if (msg.message) {
                m = Object.assign(Object.assign({}, m), { message: msg.message });
            }
            const newMsg = Message_1.default.build(m);
            // if (
            //   usrs.find((u) => {
            //     if (u.id === msg.reciever) {
            //       return u;
            //     }
            //   })
            // ) {
            //   newMsg.viewed = true;
            // }
            if (msg.file) {
                const filePath = path_1.default.join(__dirname, "..", "..", "public", newMsg.id + msg.file.originalName);
                node_fs_1.default.writeFileSync(filePath, msg.file.buffer);
                newMsg.file = newMsg.id + msg.file.originalName;
            }
            yield newMsg.save();
            //@ts-ignore
            io.to(newMsg.chat.toString()).emit("sendMessage", newMsg);
        }));
        socket.on("messageViewed", (msg) => __awaiter(void 0, void 0, void 0, function* () {
            const m = yield Message_1.default.findByIdAndUpdate(msg.id, { viewed: true }, { new: true });
            if (!m) {
                return;
            }
            //@ts-ignore
            io.to(m.chat.toString()).emit(String(m.id), m);
            console.log(m);
        }));
        socket.on("getChatMessages", (user) => __awaiter(void 0, void 0, void 0, function* () {
            const existingChat = yield Chat_1.default.findOne({
                users: { $in: [socket.data.user.id, user.id] },
            });
            if (!existingChat) {
                const newChat = yield Chat_1.default.create({
                    users: [socket.data.user.id, user.id],
                });
            }
        }));
        //  Handle disconnection
        socket.on("disconnect", () => {
            console.log("User disconnected");
            usrs = usrs.filter((u) => u.socketId != socket.id);
            io.emit("userDisconnected", socket.data.user);
        });
    });
};
exports.default = startSocketServer;
