import { NextFunction, Request, Response, Router } from "express";

import mongoose from "mongoose";
import IUser from "../Interfaces/IUser";
import Chat from "../Models/Chat";
import Message from "../Models/Message";
import JWTDecrypter from "../utils/JWTDecrypter";
import "express-async-errors";
import validateUser from "../middlewares/validateUser";
import validateAdmin from "../middlewares/validateAdmin";
import IAdmin from "../Interfaces/IAdmin";
import IChat from "../Interfaces/IChat";
const chatRouter = Router();
interface UserPayload {
  id: string;
  email?: string;
  phoneNumber?: string;
}
chatRouter.get(
  "/admin",
  validateAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const admin = JWTDecrypter.decryptUser<IAdmin>(req, process.env.JWT_ADMIN);

    const chats = await Chat.find({ admin: admin.id })
    .populate({
      path: "admin",
      select: "id email",
    })
    .populate({
      path: "user",
      select: "id fullName phoneNumber",
    });
   
    const chatCountFns = [];
    // const result=[]
    // if (chats.length > 0) {
    //   chats.forEach((c) => {
        
    //     chatCountFns.push(
    //       Message.find({
    //         reciever: admin.id,
    //         chat: c.id,
    //         viewed: false,
    //       }).count()
    //     );
    //   });
    // } 
    // const counts=await Promise.all(chatCountFns);
    // chats.forEach((c,i)=>{
    //   result.push({...c.toObject(),id:c._id, unreadMsgs:counts[i]})
    // })
    // console.log(chats)
    res.send(chats);
  }
);
chatRouter.get(
  "/admin/:chatId",
  validateAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = new mongoose.Types.ObjectId(req.params.chatId);
    const admin = JWTDecrypter.decryptUser<IAdmin>(req, process.env.JWT_ADMIN);

    // const viewedMsgs = await Message.updateMany(
    //   {
    //     chat: id,
    //     reciever: admin.id,
    //   },
    //   { viewed: true }
    // );
    const msgs = await Message.find({ chat: id });
    //.populate('user');
    res.send({ messages: msgs });
  }
);

chatRouter.get(
  "/user",
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = JWTDecrypter.decryptUser<IUser>(req, process.env.JWT);

    const chats = await Chat.find({ user: user.id })
      .populate({
        path: "admin",
        select: "id email",
      })
      .populate({
        path: "user",
        select: "id fullName phoneNumber",
      });
     
    res.send(chats);
  }
);
chatRouter.get(
  "/user/:chatId",
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = new mongoose.Types.ObjectId(req.params.chatId);
    const user = JWTDecrypter.decryptUser<IUser>(req, process.env.JWT);


    const msgs = await Message.find({
      chat: id,
    });
    console.log(msgs[msgs.length - 1]);
    res.send({ messages: msgs });
  }
);
chatRouter.post(
  "/new",
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const validUser = JWTDecrypter.decryptUser<IUser>(req, process.env.JWT);
    const { author, product } = req.body;
    let chat;
    const data = { user: validUser.id, admin: author };
    chat = await Chat.findOne(data);
    if (!chat) {
      chat = Chat.build(data);
      await chat.save();
    }
    res.send(chat);
  }
);
chatRouter.get(
  "/:chatId",
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = new mongoose.Types.ObjectId(req.params.chatId);
    const msgs = await Message.updateMany(
      {
        chat: id,
      },
      { viewed: true }
    );

    res.send({ messages: msgs });
  }
);
export default chatRouter;
