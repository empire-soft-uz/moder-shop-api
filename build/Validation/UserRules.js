"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLoginRules = exports.userRegistrationRules = void 0;
const express_validator_1 = require("express-validator");
exports.userRegistrationRules = [
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 4, max: 20 })
        .withMessage("Password length shoulr be between 4 and 20 characters cantaining capital and lower case letters with numbers"),
    (0, express_validator_1.body)("phoneNumber")
        .notEmpty()
        .withMessage("Please provide valid phone number")
        .isMobilePhone("any")
        .withMessage("Please provide valid phone number"),
    // body("fullName").notEmpty().withMessage("Name is required"),
    // body("gender").notEmpty().withMessage("Please provide your gender"),
    // body("birthDate").notEmpty().withMessage("Please provide your Date of Birth"),
];
exports.userLoginRules = [
    (0, express_validator_1.body)("password")
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 4, max: 20 })
        .withMessage("Password length shoulr be between 4 and 20 characters cantaining capital and lower case letters with numbers"),
    (0, express_validator_1.body)("phoneNumber")
        .notEmpty()
        .withMessage("Please provide valid phone number")
        .isMobilePhone("any")
        .withMessage("Please provide valid phone number"),
];
