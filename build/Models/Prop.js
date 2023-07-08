"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const optionSchema = new mongoose_1.Schema({
    label: String,
    value: String,
}, { id: false, _id: false });
const propSchema = new mongoose_1.Schema({
    type: String,
    options: [optionSchema],
    label: String,
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
});
propSchema.statics.build = (attrs) => {
    return new Prop(attrs);
};
const Prop = (0, mongoose_1.model)("Prop", propSchema);
exports.default = Prop;
