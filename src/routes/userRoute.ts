import { Router } from "express";
import { validationResult } from "express-validator";
import RequestValidationError from "../Classes/Errors/RequestValidationError";
const userRoute = Router();
import "express-async-errors";
import { userRegistrationRules } from "../Validation/UserRules";

//@ts-ignore
userRoute.post("/register", [...userRegistrationRules], async (req, res) => {
  const errs = validationResult(req).array();
  console.log(errs);
  if (errs.length > 0) {
    throw new RequestValidationError(errs);
  }

  res.send("register route");
});

export default userRoute;
