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
    const chats = await Chat.find({ admin: admin.id }).populate({
      path: "user",
      select: "id fullName phoneNumber",
    });

    res.send(chats);
  }
);
chatRouter.get(
  "/admin/:chatId",
  validateAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = new mongoose.Types.ObjectId(req.params.chatId);
    const msgs = await Message.find({
      chat: id,
    });

    res.send({ messages: msgs });
  }
);
chatRouter.get(
  "/user",
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = JWTDecrypter.decryptUser<IUser>(req, process.env.JWT);

    const chats = await Chat.find({ user: user.id }).populate({
      path: "admin",
      select: "id email",
    });
    res.send(chats);
  }
);
chatRouter.post(
  "/new",
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const validUser = JWTDecrypter.decryptUser<IUser>(req, process.env.JWT);
    const { admin } = req.body;
    const chat = await Chat.create({ user: validUser.id, admin });
    res.send(chat);
  }
);
chatRouter.get(
  "/:chatId",
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const id = new mongoose.Types.ObjectId(req.params.chatId);
    const msgs = await Message.find({
      chat: id,
    });

    res.send({ messages: msgs });
  }
);
export default chatRouter;
