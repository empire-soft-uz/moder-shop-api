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
        .withMessage("Password length shoulr be between 4 and 20 characters cantaining capital and lower case letters with numbers"),
];
