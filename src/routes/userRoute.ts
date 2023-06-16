import { Router } from "express";
import { body, validationResult } from "express-validator";
import RequestValidationError from "../Classes/Errors/RequestValidationError";
const userRoute = Router();
const validationRules = [
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
    .isMobilePhone("any")
    .withMessage("Please provide valid phone number"),
  body("email")
    .notEmpty()
    .isEmail()
    .withMessage("Please provide valid email address"),
  body("gender").notEmpty().withMessage("Please provide your gender"),
  body("birthDate").notEmpty().withMessage("Please provide your Date of Birth"),
];

userRoute.post("/register", [...validationRules], async (req, res) => {
  const errs = validationResult(req);
  if (!errs.isEmpty) {
    throw new RequestValidationError(errs.array());
  }

  res.send("register route");
});

export default userRoute;
