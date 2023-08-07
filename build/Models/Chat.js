"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("./User"));
const Admin_1 = __importDefault(require("./Admin"));
const chatSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: User_1.default },
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: Admin_1.default },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
chatSchema.statics.build = (attrs) => {
    return new Chat(attrs);
};
const Chat = (0, mongoose_1.model)("Chat", chatSchema);
exports.default = Chat;
