import SocketServer from "../SoketServer";

import fs from "node:fs";
const io = SocketServer.getInstance;
import path from "path";
import Chat from "../Models/Chat";
import Message from "../Models/Message";

let usrs: Map<string, string> = new Map<string, string>();
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
      } catch (error) {
        console.log("new user error-------------------------");
        console.log(error);
      }
    });

    socket.on("chatSelected", async (chat) => {
      try {
        socket.join(chat.id.toString());
        const u = usrs.get(chat.admin.toString());

        if (u) {
          const c = await Chat.findById(chat.id)
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
          //@ts-ignore
          m = { ...m, message: msg.message };
        }
        //@ts-ignore
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

        io.to(newMsg.chat.toString()).emit(
          //@ts-ignore
          `sendMessage-${newMsg.chat}`,
          newMsg
        );
        let usr = usrs.get(newMsg.reciever.toString());

        //@ts-ignore
        if (usr) {
          io.to(usr) //@ts-ignore
            .emit(newMsg.chat.toString(), newMsg);
          io.to(usr) //@ts-ignore
            .emit("total-count", newMsg);
        }
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
      //usrs = usrs.filter((u) => u.socketId != socket.id);
      io.emit("userDisconnected", socket.data.user);
    });
  });
};
export default startSocketServer;
