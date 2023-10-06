import { body } from "express-validator";

export const adminCreation = [
  body("email").notEmpty().withMessage("Please enter admin email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage(
      "Password length should be between 8 and 20 characters containing capital and lower case letters with numbers"
    ),
];
