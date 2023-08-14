"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Prop_1 = __importDefault(require("./Prop"));
const propValueSchema = new mongoose_1.Schema({
    value: { type: String, unique: true },
    prop: { type: mongoose_1.Schema.Types.ObjectId, ref: Prop_1.default },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
propValueSchema.statics.build = (attrs) => {
    return new PropValue(attrs);
};
const PropValue = (0, mongoose_1.model)("PropValue", propValueSchema);
exports.default = PropValue;
