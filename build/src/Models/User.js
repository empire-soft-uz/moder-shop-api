"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullName: String,
    password: String,
    phoneNumber: Number,
    avatar: String,
    gender: String,
    birthdate: Date,
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
