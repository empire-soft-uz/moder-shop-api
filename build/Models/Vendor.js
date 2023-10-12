"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mediaSchema = new mongoose_1.Schema({
    name: String,
    fileId: String,
}, { id: false, _id: false });
const vendorSchema = new mongoose_1.Schema({
    name: String,
    description: String,
    contacts: {
        phoneNumber: Number,
    },
    baner: mediaSchema,
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Product" }],
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
vendorSchema.statics.build = (attrs) => {
    return new Vendor(attrs);
};
const Vendor = (0, mongoose_1.model)("Vendor", vendorSchema);
exports.default = Vendor;
