import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import RequestValidationError from "../Classes/Errors/RequestValidationError";
const userRoute = Router();
import "express-async-errors";
import { userRegistrationRules } from "../Validation/UserRules";
import User from "../Models/User";
import Password from "../utils/Password";
import BadRequestError from "../Classes/Errors/BadRequestError";

userRoute.post(
  "/register",
  [...userRegistrationRules],
  async (req: Request, res: Response) => {
    const errs = validationResult(req).array();
    if (errs.length > 0) {
      throw new RequestValidationError(errs);
    }

    const { fullName, phoneNumber, email, password, gender, birthDate } =
      req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      throw new BadRequestError(`User with ${email} already exists`);
    const user = User.build(req.body);
    const p = await Password.hashPassword(password);
    user.password = `${p.buff}.${p.salt}`;
    await user.save();

    res.send({ id: user.id, email: user.email, fullName: user.fullName });
  }
);

export default userRoute;
