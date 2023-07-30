"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const otpSchema = new mongoose_1.Schema({
    phoneNumber: { type: String, unique: true },
    code: String,
    expiresAt: Date,
    isVerified: { type: Boolean, default: false },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
otpSchema.statics.build = (attrs) => new OTP(attrs);
const OTP = (0, mongoose_1.model)("OTP", otpSchema);
exports.default = OTP;
