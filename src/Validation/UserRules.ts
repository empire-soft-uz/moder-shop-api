import { body } from "express-validator";

export const userRegistrationRules = [
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
  // body("fullName").notEmpty().withMessage("Name is required"),
  // body("gender").notEmpty().withMessage("Please provide your gender"),
  // body("birthDate").notEmpty().withMessage("Please provide your Date of Birth"),
];
export const userLoginRules = [
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
];
