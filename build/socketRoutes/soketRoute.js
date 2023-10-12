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
let usrs = new Map();
const startSocketServer = () => {
    console.log("Starting Socket Server");
    io.on("connection", (socket) => {
        console.log("New user connected", socket.id);
        socket.on("newUser", (msg) => {
            try {
                let user = { id: msg.id, socketId: socket.id };
                socket.data.user = msg;
                //socket.join(msg.id);
                usrs.set(msg.id, user.socketId);
            }
            catch (error) {
                console.log("new user error-------------------------");
                console.log(error);
            }
        });
        socket.on("chatSelected", (chat) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                socket.join(chat.id.toString());
                const u = usrs.get(chat.admin.toString());
                if (u) {
                    const c = yield Chat_1.default.findById(chat.id)
                        .populate({
                        path: "admin",
                        select: "id email",
                    })
                        .populate({
                        path: "user",
                        select: "id fullName phoneNumber",
                    });
                    if (!c) {
                        return;
                    }
                    //@ts-ignore
                    io.sockets.sockets.get(u).join(c.id);
                    //@ts-ignore
                    io.sockets.sockets.get(u).emit("newChatAdminNotification", c);
                }
            }
            catch (error) {
                console.log("chat error ---------------");
                console.log(error);
            }
        }));
        socket.on("recieveMsg", (msg) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                let m = {
                    sender: msg.sender,
                    reciever: msg.reciever,
                    chat: msg.chat,
                };
                if (msg.message) {
                    //@ts-ignore
                    m = Object.assign(Object.assign({}, m), { message: msg.message });
                }
                //@ts-ignore
                const newMsg = Message_1.default.build(m);
                if (msg.file) {
                    const filePath = path_1.default.join(__dirname, "..", "..", "public", newMsg.id + msg.file.originalName);
                    node_fs_1.default.writeFileSync(filePath, msg.file.buffer);
                    newMsg.file = newMsg.id + msg.file.originalName;
                }
                yield newMsg.save();
                //@ts-ignore  sending to chat
                io.to(newMsg.chat.toString()).emit(
                //@ts-ignore
                `sendMessage-${newMsg.chat}`, newMsg);
                let usr = usrs.get(newMsg.reciever.toString());
                //@ts-ignore
                if (usr) {
                    io.to(usr) //@ts-ignore
                        .emit(newMsg.chat.toString(), newMsg);
                    io.to(usr) //@ts-ignore
                        .emit("total-count", newMsg);
                }
            }
            catch (error) {
                console.log(error);
            }
        }));
        socket.on("messageViewed", (msg) => __awaiter(void 0, void 0, void 0, function* () {
            const m = yield Message_1.default.findOneAndUpdate({ _id: msg.id }, { viewed: true }, { new: true });
            if (!m) {
                return;
            }
            //@ts-ignore
            io.to(m.chat.toString()).emit(m.id.toString(), m);
            //@ts-ignore notify
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
            //usrs = usrs.filter((u) => u.socketId != socket.id);
            io.emit("userDisconnected", socket.data.user);
        });
    });
};
exports.default = startSocketServer;
