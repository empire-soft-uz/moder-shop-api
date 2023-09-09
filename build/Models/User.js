"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Product_1 = __importDefault(require("./Product"));
const userSchema = new mongoose_1.Schema({
    fullName: String,
    password: String,
    phoneNumber: Number,
    avatar: String,
    gender: String,
    birthdate: Date,
    online: { type: Boolean, default: false },
    basket: { type: [mongoose_1.Schema.Types.ObjectId], ref: Product_1.default }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
userSchema.statics.build = (attrs) => {
    return new User(attrs);
};
const User = (0, mongoose_1.model)("User", userSchema);
exports.default = User;
