"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, required: true, reg: User },
    reciever: { type: mongoose_1.Schema.Types.ObjectId, required: true, reg: User },
    chat: { type: mongoose_1.Schema.Types.ObjectId, required: true, reg: Chat },
    message: String,
    file: String,
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
