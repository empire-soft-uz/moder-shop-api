import { body } from "express-validator";

export const adminCreation = [
  body("email").notEmpty().withMessage("Please enter admin email"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8, max: 20 })
    .withMessage(
      "Password length shoulr be between 4 and 20 characters cantaining capital and lower case letters with numbers"
    ),
];
