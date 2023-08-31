import SocketServer from "../SoketServer";

import fs from "node:fs";
const io = SocketServer.getInstance;
import path from "path";
import IUser from "../Interfaces/IUser";
import Chat from "../Models/Chat";
import Message from "../Models/Message";
import IChat from "../Interfaces/IChat";

let usrs: Array<{ socketId: string; id: string }> = [];
const startSocketServer = () => {
  console.log("Starting Socket Server");
  io.on("connection", (socket) => {
    console.log("New user connected", socket.id);

    socket.on("newUser", (msg) => {
      console.log("new user");
      let user = { ...JSON.parse(msg), socketId: socket.id };
      usrs.push({ socketId: socket.id, id: user.id });

      console.log(usrs);
    });

    socket.on("chatSelected", (chat) => {
      console.log(chat)
      const u = usrs.find((U) => U.id === chat.admin.id || chat.user.id);
      socket.join(chat.id.toString());
      if (u) {
       
        //@ts-ignore
        io.sockets.sockets.get(u.socketId).join(chat.id);
        //@ts-ignore
        io.sockets.sockets.get(u.socketId).emit('newChatAdminNotification',chat);
      }
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
      usrs = usrs.filter((u) => u.socketId != socket.id);
    });
  });
};
export default startSocketServer;
