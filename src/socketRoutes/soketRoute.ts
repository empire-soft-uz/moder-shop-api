import SocketServer from "../SoketServer";

import fs from "node:fs";
const io = SocketServer.getInstance;
import path from "path";
import Chat from "../Models/Chat";
import Message from "../Models/Message";
import IMessage from "../Interfaces/IMessage";
import IChat from "../Interfaces/IChat";

let usrs: Array<{ socketId: string; id: string }> = [];
const startSocketServer = () => {
  console.log("Starting Socket Server");
  io.on("connection", (socket) => {
    console.log("New user connected", socket.id);

    socket.on("newUser", (msg) => {
      let user = { ...JSON.parse(msg), socketId: socket.id };
      //socket.join(msg.id);
      usrs.push({ socketId: socket.id, id: user.id });
    });

    socket.on("chatSelected", (chat) => {
      try {
        
        console.log("chat selected", chat);
        socket.join(chat.id.toString());
        const u = usrs.find((U) => U.id === chat.admin.id || chat.user.id);
        if (u) {
          //@ts-ignore
          io.sockets.sockets.get(u.socketId).join(chat.id);
          //@ts-ignore
          io.sockets.sockets
            .get(u.socketId)
            .emit("newChatAdminNotification", chat);
        }
      } catch (error) {
        console.log("chat error ---------------");
        console.log(error);
      }
    });
    socket.on("recieveMsg", async (msg) => {
      try {
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
        //@ts-ignore  sending to chat

        io.to(newMsg.chat.toString()).emit("sendMessage", newMsg);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("messageViewed", async (msg) => {
      const m = await Message.findOneAndUpdate(
        { _id: msg.id },
        { viewed: true },
        { new: true }
      );

      if (!m) {
        return;
      }

      //@ts-ignore
      io.to(m.chat.toString()).emit(m.id.toString(), m);
      //@ts-ignore notify
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

    //  Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected");
      usrs = usrs.filter((u) => u.socketId != socket.id);
      io.emit("userDisconnected", socket.data.user);
    });
  });
};
export default startSocketServer;
