"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorProduct = exports.productCreation = void 0;
const express_validator_1 = require("express-validator");
exports.productCreation = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Product name is required"),
    // body("category").notEmpty().withMessage("Product Category is required"),
    // body("subcategory").notEmpty().withMessage("Product Subcategory is required"),
    // body("price")
    //   .notEmpty()
    //   .withMessage("Please provide price for varity of product quantity"),
    // .custom((c) => {
    //   if (!c[0].price)
    //     throw new Error("Please provide price for varity of product quantity");
    //   if (!c[0].qtyMin)
    //     throw new Error("Please provide price for varity of product quantity");
    //   if (!c[0].qtyMax)
    //     throw new Error("Please provide price for varity of product quantity");
    // }),
    // body("video").notEmpty().withMessage("Product Video is Required"),
];
exports.vendorProduct = [
    (0, express_validator_1.body)("name").notEmpty().withMessage("Product name is required"),
];
