"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Chat_1 = __importDefault(require("../Models/Chat"));
const Message_1 = __importDefault(require("../Models/Message"));
const JWTDecrypter_1 = __importDefault(require("../utils/JWTDecrypter"));
require("express-async-errors");
const validateUser_1 = __importDefault(require("../middlewares/validateUser"));
const validateAdmin_1 = __importDefault(require("../middlewares/validateAdmin"));
const mongoose_1 = __importStar(require("mongoose"));
const BadRequestError_1 = __importDefault(require("../Classes/Errors/BadRequestError"));
const chatRouter = (0, express_1.Router)();
chatRouter.get("/admin", validateAdmin_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = JWTDecrypter_1.default.decryptUser(req, process.env.JWT_ADMIN);
    const result = yield Chat_1.default.aggregate([
        {
            $match: {
                admin: new mongoose_1.Types.ObjectId(admin.id),
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
                                        $eq: ["$$message.reciever", new mongoose_1.Types.ObjectId(admin.id)],
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
    res.send(msgs);
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
chatRouter.get("/user/msgcount", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validUser = JWTDecrypter_1.default.decryptUser(req, process.env.JWT);
    const unreadMsgs = yield Message_1.default.find({
        reciever: validUser.id,
        viewed: false,
    }).count();
    res.send({ unreadMsgs });
}));
chatRouter.get("/user/:chatId", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(req.params.chatId);
    const msgs = yield Message_1.default.find({
        chat: id,
    });
    res.send({ messages: msgs });
}));
chatRouter.post("/new", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validUser = JWTDecrypter_1.default.decryptUser(req, process.env.JWT);
    const { admin, product } = req.body;
    let chat;
    const data = { user: validUser.id, admin: admin };
    chat = yield Chat_1.default.findOne(data);
    if (!chat) {
        if (!mongoose_1.Types.ObjectId.isValid(admin))
            throw new BadRequestError_1.default("Invalid Product Admin id is suplied to create chat");
        //@ts-ignore
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
