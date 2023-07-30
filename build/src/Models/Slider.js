"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const Vendor_1 = __importDefault(require("./Vendor"));
const Product_1 = __importDefault(require("./Product"));
const mediaSchema = new mongoose_1.Schema({
    name: String,
    fileId: String,
}, { id: false, _id: false });
const sliderSchema = new mongoose_1.Schema({
    image: mediaSchema,
    title: String,
    descriptionn: String,
    productId: { type: mongoose_1.Schema.Types.ObjectId, ref: Product_1.default },
    vendorId: { type: mongoose_1.Schema.Types.ObjectId, ref: Vendor_1.default },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
sliderSchema.statics.build = (attrs) => {
    return new Slider(attrs);
};
const Slider = (0, mongoose_1.model)("Slider", sliderSchema);
exports.default = Slider;
