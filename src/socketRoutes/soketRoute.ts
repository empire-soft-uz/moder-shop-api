import SocketServer from "../SoketServer";

import fs from "node:fs";
const io = SocketServer.getInstance;
import path from "path";
import IUser from "../Interfaces/IUser";
import Chat from "../Models/Chat";
import Message from "../Models/Message";

const startSocketServer = () => {
  console.log("Starting Socket Server");
  io.on("connection", (socket) => {
    console.log("New user connected", socket.id);
    socket.on("newUser", (msg) => {
      socket.data.user = { ...JSON.parse(msg), socketId: socket.id };
      const users: IUser[] = [];

      io.sockets.sockets.forEach((value, key, map) => {
        users.push(value.data.user);
      });
      io.emit("activeUsers", users);
    });
    socket.on("chatSelected", (chat) => {
      socket.join(chat.id.toString());
      console.log("joined room", chat.id.toString());
    });
    socket.on("recieveMsg", async (msg) => {
      let m = {
        sender: msg.sender,
        reciever: msg.reciever,
        chat: msg.chat,
      };

      if (msg.message) {
        m = { ...m, message: msg.message };
      }
      const newMsg = Message.build(m);

      if (msg.file) {
        const filePath = path.join(
          __dirname,
          "..",
          "..",
          "public",
          newMsg.id + msg.file.originalName
        );
        fs.writeFileSync(filePath, msg.file.buffer);
        newMsg.file = newMsg.id + msg.file.originalName;
      }
      await newMsg.save();
      //@ts-ignore
      io.to(newMsg.chat.toString()).emit("sendMessage", newMsg);

      //socket.to(msg.reciever.socketId).emit("sendMessage", msg);
    });

    socket.on("getChatMessages", async (user) => {
      const existingChat = await Chat.findOne({
        users: { $in: [socket.data.user.id, user.id] },
      });
      if (!existingChat) {
        const newChat = await Chat.create({
          users: [socket.data.user.id, user.id],
        });
      }
    });

    //     // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
      const users: IUser[] = [];
      io.sockets.sockets.forEach((value, key, map) => {
        users.push(value.data.user);
      });
      io.emit("activeUsers", users);
    });
  });
};
export default startSocketServer;
