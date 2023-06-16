import { Router, Request, Response } from "express";
import { validationResult } from "express-validator";
import RequestValidationError from "../Classes/Errors/RequestValidationError";
const userRoute = Router();
import "express-async-errors";
import jwt from "jsonwebtoken";
import { userLoginRules, userRegistrationRules } from "../Validation/UserRules";
import User from "../Models/User";
import Password from "../utils/Password";
import BadRequestError from "../Classes/Errors/BadRequestError";
import Validator from "../utils/Valiadtor";

const jwtKey = process.env.JWT || "someKEy";

userRoute.post(
  "/register",
  [...userRegistrationRules],
  async (req: Request, res: Response) => {
    Validator.validate(req);

    const { fullName, phoneNumber, email, password, gender, birthDate } =
      req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser)
      throw new BadRequestError(`User with ${email} already exists`);
    const user = User.build(req.body);
    const p = await Password.hashPassword(password);
    user.password = `${p.buff}.${p.salt}`;
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      jwtKey
    );
    await user.save();
    res.send({ user: token });
  }
);
userRoute.post(
  "login",
  [...userLoginRules],
  async (req: Request, res: Response) => {}
);
export default userRoute;
