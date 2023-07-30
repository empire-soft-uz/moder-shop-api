"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subcatCreation = void 0;
const express_validator_1 = require("express-validator");
exports.subcatCreation = [
    (0, express_validator_1.body)("category").notEmpty().withMessage("Parent category required"),
    (0, express_validator_1.body)("name").notEmpty().withMessage("Subcategory name is required"),
];
