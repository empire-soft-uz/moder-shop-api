"use strict";
const optionSchema = new Schema({
    label: String,
    value: String,
}, { id: false, _id: false });
const propSchema = new Schema({
    type: String,
    options: [optionSchema],
    label: String,
}, { id: false, _id: false });
