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
propValueSchema.pre("deleteMany", (next) => __awaiter(void 0, void 0, void 0, function* () {
    return next();
}));
propValueSchema.statics.build = (attrs) => {
    return new PropValue(attrs);
};
const PropValue = (0, mongoose_1.model)("PropValue", propValueSchema);
exports.default = PropValue;
