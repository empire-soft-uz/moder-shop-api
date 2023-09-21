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
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Chat_1 = __importDefault(require("../Models/Chat"));
const Message_1 = __importDefault(require("../Models/Message"));
const JWTDecrypter_1 = __importDefault(require("../utils/JWTDecrypter"));
require("express-async-errors");
const validateUser_1 = __importDefault(require("../middlewares/validateUser"));
const validateAdmin_1 = __importDefault(require("../middlewares/validateAdmin"));
const mongoose_2 = require("mongoose");
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const chatRouter = (0, express_1.Router)();
chatRouter.get("/admin", validateAdmin_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = JWTDecrypter_1.default.decryptUser(req, process.env.JWT_ADMIN);
    const chats = yield Chat_1.default.find({ admin: admin.id })
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
}));
chatRouter.get("/admin/msgcount", validateAdmin_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = JWTDecrypter_1.default.decryptUser(req, process.env.JWT_ADMIN);
    const unreadMsgs = yield Message_1.default.find({
        reciever: admin.id,
        viewed: false,
    }).count();
    res.send({ unreadMsgs });
}));
chatRouter.get("/admin/:chatId", validateAdmin_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(req.params.chatId);
    const admin = JWTDecrypter_1.default.decryptUser(req, process.env.JWT_ADMIN);
    // const viewedMsgs = await Message.updateMany(
    //   {
    //     chat: id,
    //     reciever: admin.id,
    //   },
    //   { viewed: true }
    // );
    const msgs = yield Message_1.default.find({ chat: id });
    //.populate('user');
    res.send({ messages: msgs });
}));
chatRouter.get("/user", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = JWTDecrypter_1.default.decryptUser(req, process.env.JWT);
    const chats = yield Chat_1.default.find({ user: user.id })
        .populate({
        path: "admin",
        select: "id email",
    })
        .populate({
        path: "user",
        select: "id fullName phoneNumber",
    });
    res.send(chats);
}));
chatRouter.get("/user/:chatId", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(req.params.chatId);
    const user = JWTDecrypter_1.default.decryptUser(req, process.env.JWT);
    const msgs = yield Message_1.default.find({
        chat: id,
    });
    console.log(msgs[msgs.length - 1]);
    res.send({ messages: msgs });
}));
chatRouter.post("/new", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validUser = JWTDecrypter_1.default.decryptUser(req, process.env.JWT);
    const { admin, product } = req.body;
    let chat;
    const data = { user: validUser.id, admin: admin };
    chat = yield Chat_1.default.findOne(data);
    console.log(chat);
    if (!chat) {
        if (!mongoose_2.Types.ObjectId.isValid(admin))
            throw new BadRequestError_1.default("Invalid Product Admin id is suplied to create chat");
        chat = Chat_1.default.build(data);
        yield chat.save();
    }
    res.send(chat);
}));
chatRouter.get("/:chatId", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(req.params.chatId);
    const msgs = yield Message_1.default.updateMany({
        chat: id,
    }, { viewed: true });
    res.send({ messages: msgs });
}));
exports.default = chatRouter;
