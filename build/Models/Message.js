"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User_1 = __importDefault(require("./User"));
const Chat_1 = __importDefault(require("./Chat"));
const messageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: User_1.default },
    reciever: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: User_1.default },
    chat: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: Chat_1.default },
    message: String,
    file: String,
    viewed: { type: Boolean, default: false }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
    timestamps: true,
});
messageSchema.statics.build = (attrs) => {
    return new Message(attrs);
};
const Message = (0, mongoose_1.model)("Message", messageSchema);
exports.default = Message;
