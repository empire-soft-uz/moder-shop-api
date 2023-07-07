"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const createReview = [
    (0, express_validator_1.body)('review').notEmpty().withMessage('Review text is required'),
    (0, express_validator_1.body)('rating').notEmpty().withMessage('Rating is required').isNumeric().withMessage("Rating must be  Number").
];
