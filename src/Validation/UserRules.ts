import { body } from "express-validator";

export const userRegistrationRules = [
  body("fullName").notEmpty().withMessage("Name is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4, max: 20 })
    .withMessage(
      "Password length shoulr be between 4 and 20 characters cantaining capital and lower case letters with numbers"
    ),
  body("phoneNumber")
    .notEmpty()
    .withMessage("Please provide valid phone number")
    .isMobilePhone("any")
    .withMessage("Please provide valid phone number"),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please provide valid email address"),
  body("gender").notEmpty().withMessage("Please provide your gender"),
  body("birthDate").notEmpty().withMessage("Please provide your Date of Birth"),
];
