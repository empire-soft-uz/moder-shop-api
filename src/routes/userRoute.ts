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
import "express-async-errors";
import validateUser from "../middlewares/validateUser";
const jwtKey = process.env.JWT || "SomeJwT_keY";

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
    res.send({ name: user.fullName, id: user.id, email: user.email, token });
  }
);
userRoute.post(
  "/login",
  [...userLoginRules],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const isValidPass =
      user &&
      (await Password.compare(password, {
        buff: user.password.split(".")[0],
        salt: user.password.split(".")[1],
      }));
    if (!user || !isValidPass) throw new BadRequestError("Invalid Credentials");
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      jwtKey
    );
    res.send({ name: user.fullName, id: user.id, email: user.email, token });
  }
);
userRoute.put(
  "/update",
  [...userRegistrationRules],
  validateUser,
  async (req: Request, res: Response) => {
    const author = jwt.verify(
      //@ts-ignore
      req.headers.authorization,
      jwtKey
      //@ts-ignore
    ) as IUserPayload;
    const p = await Password.hashPassword(req.body.password);

    const user = await User.findByIdAndUpdate(author.id, {
      ...req.body,
      password: `${p.buff}.${p.salt}`,
    });
    //@ts-ignore
    user?.password = undefined;
    res.send(user);
  }
);

userRoute.get("/current", validateUser, async (req: Request, res: Response) => {
  const author = jwt.verify(
    //@ts-ignore
    req.headers.authorization,
    jwtKey
    //@ts-ignore
  ) as IUserPayload;
  const user = await User.findOne({ _id: author.id }, { password: 0 });

  res.send(user);
});
export default userRoute;
