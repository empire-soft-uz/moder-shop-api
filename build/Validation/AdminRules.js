"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCreation = void 0;
const express_validator_1 = require("express-validator");
exports.adminCreation = [
    (0, express_validator_1.body)("email").notEmpty().withMessage("Please enter admin email"),
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8, max: 20 })
        .withMessage("Password length should be between 8 and 20 characters containing capital and lower case letters with numbers"),
];
