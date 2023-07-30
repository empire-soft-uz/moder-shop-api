"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propCreation = void 0;
const express_validator_1 = require("express-validator");
exports.propCreation = [
    (0, express_validator_1.body)("subcategory").notEmpty().withMessage("Subcategory is required"),
    (0, express_validator_1.body)("name").notEmpty().withMessage("Property name is required"),
    (0, express_validator_1.body)("label").notEmpty().withMessage("Provide property displaying field"),
    // body("values").custom((input) => {
    //   if (input.length < 0) throw new Error("Please provide value for Property");
    // }),
];
