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
}, { id: false, _id: false });
const Prop = (0, mongoose_1.model)("Prop", propSchema);
exports.default = Prop;
