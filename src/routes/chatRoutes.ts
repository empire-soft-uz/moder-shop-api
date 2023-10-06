import { NextFunction, Request, Response, Router } from "express";

import IUser from "../Interfaces/IUser";
import Chat from "../Models/Chat";
import Message from "../Models/Message";
import JWTDecrypter from "../utils/JWTDecrypter";
import "express-async-errors";
import validateUser from "../middlewares/validateUser";
import validateAdmin from "../middlewares/validateAdmin";
import IAdmin from "../Interfaces/IAdmin";
import mongoose, { Types } from "mongoose";
import IChat from "../Interfaces/IChat";
import BadRequestError from "../Classes/Errors/BadRequestError";
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

    const result = await Chat.aggregate([
      {
        $match: {
          admin: new Types.ObjectId(admin.id),
        },
      },
      {
        $lookup: {
          from: "admins",
          localField: "admin",
          foreignField: "_id",
          as: "admin",
        },
      },
      { $unwind: "$admin" },

      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },

      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "chat",

          as: "messages",
        },
      },

      // {
      //   $match: {
      //     "messages.viewed":false,
      //     "messages.reciever":new Types.ObjectId(admin.id),
      //   },
      // },

      {
        $project: {
          id: "$_id",

          "admin.id": "$admin._id",
          "admin.email": "$admin.email",
          "admin.vendorId": "$admin.vendorId",

          "user.fullName": 1,
          "user.id": "$user._id",
          "user.phoneNumber": 1,
          unreadMsgs: {
            $size: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: {
                  $and: [
                    { $eq: ["$$message.viewed", false] },
                    {
                      $eq: ["$$message.reciever", new Types.ObjectId(admin.id)],
                    },
                  ],
                },
              },
            },
          },
        },
      },
      { $unset: ["_id", "admin._id", "user._id"] },
    ]).exec();

    res.send(result);
  }
);
chatRouter.get(
  "/admin/msgcount",
  validateAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    const admin = JWTDecrypter.decryptUser<IAdmin>(req, process.env.JWT_ADMIN!);
    const unreadMsgs = await Message.find({
      reciever: admin.id,
      viewed: false,
    }).count();

    res.send({ unreadMsgs });
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
    res.send(msgs);
  }
);

chatRouter.get(
  "/user",
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const user = JWTDecrypter.decryptUser<IUser>(req, process.env.JWT!);

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
    const user = JWTDecrypter.decryptUser<IUser>(req, process.env.JWT!);

    const msgs = await Message.find({
      chat: id,
    });
   
    res.send({ messages: msgs });
  }
);
chatRouter.post(
  "/new",
  validateUser,
  async (req: Request, res: Response, next: NextFunction) => {
    const validUser = JWTDecrypter.decryptUser<IUser>(req, process.env.JWT!);
    const { admin, product } = req.body;

    let chat;
    const data = { user: validUser.id, admin: admin };
    chat = await Chat.findOne(data);
    if (!chat) {
      if (!Types.ObjectId.isValid(admin))
        throw new BadRequestError(
          "Invalid Product Admin id is suplied to create chat"
        );
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
