"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Subcateygory_1 = __importDefault(require("./Subcateygory"));
const iconSchema = new mongoose_1.Schema({
    name: String,
    fileId: String,
}, { id: false, _id: false });
const categorySchema = new mongoose_1.Schema({
    name: String,
    icon: iconSchema,
    subcategories: { type: [mongoose_1.Schema.Types.ObjectId], ref: Subcateygory_1.default },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
categorySchema.statics.build = (attrs) => {
    return new Category(attrs);
};
const Category = (0, mongoose_1.model)("Category", categorySchema);
exports.default = Category;
