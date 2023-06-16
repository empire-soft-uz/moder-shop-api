import { body } from "express-validator";

export const productCreation = [
  body("vendorId").notEmpty().withMessage("Please provide product vendor"),
  body("name").notEmpty().withMessage("Product name is required"),
  body("price")
    .notEmpty()
    .withMessage("Please provide price for varity of product quantity"),
  body("video").notEmpty().withMessage("Product Video is Required"),
];
