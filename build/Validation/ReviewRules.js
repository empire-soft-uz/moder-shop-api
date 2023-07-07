"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReview = void 0;
const express_validator_1 = require("express-validator");
exports.createReview = [
    (0, express_validator_1.body)("review").notEmpty().withMessage("Review text is required"),
    (0, express_validator_1.body)("rating")
        .notEmpty()
        .withMessage("Rating is required")
        .isInt({ max: 5, min: 1 })
        .withMessage("Rating must be Number in range 1 to 5"),
];
