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
const chatRouter = (0, express_1.Router)();
chatRouter.get("/admin", validateAdmin_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = JWTDecrypter_1.default.decryptUser(req, process.env.JWT_ADMIN);
    const chats = yield Chat_1.default.find({ admin: admin.id }).populate({
        path: "user",
        select: "id fullName phoneNumber",
    });
    res.send(chats);
}));
chatRouter.get("/admin/:chatId", validateAdmin_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(req.params.chatId);
    const msgs = yield Message_1.default.find({
        chat: id,
    });
    res.send({ messages: msgs });
}));
chatRouter.get("/user", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = JWTDecrypter_1.default.decryptUser(req, process.env.JWT);
    const chats = yield Chat_1.default.find({ user: user.id }).populate({
        path: "admin",
        select: "id email",
    });
    res.send(chats);
}));
chatRouter.post("/new", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const validUser = JWTDecrypter_1.default.decryptUser(req, process.env.JWT);
    const { admin } = req.body;
    const chat = yield Chat_1.default.create({ user: validUser.id, admin });
    res.send(chat);
}));
chatRouter.get("/:chatId", validateUser_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongoose_1.default.Types.ObjectId(req.params.chatId);
    const msgs = yield Message_1.default.find({
        chat: id,
    });
    res.send({ messages: msgs });
}));
exports.default = chatRouter;
