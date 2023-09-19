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
const PropValue_1 = __importDefault(require("./PropValue"));
const Product_1 = __importDefault(require("./Product"));
const propSchema = new mongoose_1.Schema({
    name: { type: String, unique: true },
    label: String,
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
propSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            const values = yield PropValue_1.default.find({
                prop: doc._id,
            }).distinct("_id");
            const res = yield Promise.all([
                PropValue_1.default.find({
                    prop: doc._id,
                }).distinct("_id"),
                PropValue_1.default.deleteMany({ prop: doc._id, })
            ]);
            const delProduct = yield Product_1.default.deleteMany({ props: { $in: res[0] } });
            console.log(delProduct);
        }
    });
});
propSchema.statics.build = (attrs) => {
    return new Prop(attrs);
};
const Prop = (0, mongoose_1.model)("Prop", propSchema);
exports.default = Prop;
