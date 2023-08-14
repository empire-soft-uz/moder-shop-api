"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PropValue_1 = __importDefault(require("./PropValue"));
const subcategorySchema = new mongoose_1.Schema({
    name: String,
    props: { type: [mongoose_1.Schema.Types.ObjectId], ref: PropValue_1.default },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
subcategorySchema.statics.build = (attrs) => {
    return new Subcategory(attrs);
};
subcategorySchema.statics.removePropValues = (vals) => { };
const Subcategory = (0, mongoose_1.model)("Subcategory", subcategorySchema);
exports.default = Subcategory;
