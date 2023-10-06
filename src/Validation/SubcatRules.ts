import { body } from "express-validator";

export const subcatCreation = [
  body("category").notEmpty().withMessage("Parent category required"),
  body("name").notEmpty().withMessage("Subcategory name is required"),
];
