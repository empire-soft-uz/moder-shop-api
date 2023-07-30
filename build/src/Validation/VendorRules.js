"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorCreation = void 0;
const express_validator_1 = require("express-validator");
exports.vendorCreation = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Vendor name is Required"),
    (0, express_validator_1.body)("contacts")
        .exists()
        .withMessage("Vendor contacts are Required")
        .custom((c) => {
        if (!c.phoneNumber)
            throw new Error("Vendor phone number required");
    }),
];
