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
import OTP from "../Models/OTP";
import NotFoundError from "../Classes/Errors/NotFoundError";
const expiresAt = parseInt(process.env.EXPIRATION || "5");
const jwtKey = process.env.JWT || "SomeJwT_keY";
userRoute.post(
  "/register",
  [...userRegistrationRules],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const { phoneNumber } = req.body;
    var code = "0000" || Math.floor(1000 + Math.random() * 9000).toString();
    const existingUserOPT = await OTP.findOneAndUpdate(
      { phoneNumber },
      { code, expiresAt: new Date(Date.now() + expiresAt * 60 * 1000) }
    );
    if (!existingUserOPT) {
      const opt = OTP.build({
        phoneNumber,
        code,
        expiresAt: new Date(Date.now() + expiresAt * 60 * 1000),
        isVerified: false,
      });
      //handle opt sending
      await opt.save();
    }
    res.send({ message: `One Time Password was send to ${phoneNumber}` });
  }
);
userRoute.post("/verify", async (req: Request, res: Response) => {
  const { fullName, phoneNumber, password, gender, birthDate, code } = req.body;
  const opt = await OTP.findOneAndUpdate(
    { phoneNumber, code },
    { verfied: true, expiresAt: undefined }
  );
  if (!opt) throw new BadRequestError("Invalid Credentials");
  if (opt.expiresAt.getTime() < Date.now())
    throw new BadRequestError("Verification Code Expired");

  const existingUser = await User.findOne({ phoneNumber });
  if (existingUser)
    throw new BadRequestError(`User with ${phoneNumber} already exists`);
  const user = User.build(req.body);
  if (password) {
    const p = await Password.hashPassword(password);
    user.password = `${p.buff}.${p.salt}`;
  }
  const token = jwt.sign(
    {
      id: user.id,
      phoneNumber: user.phoneNumber,
      fullName: user.fullName,
    },
    jwtKey
  );
  await user.save();
  res.send({
    name: user.fullName,
    id: user.id,
    phoneNumber: user.phoneNumber,
    token,
  });
});
// userRoute.post(
//   "/register",

//   async (req: Request, res: Response) => {
//     const { fullName, phoneNumber, password, gender, birthDate } = req.body;
//     const existingUser = await User.findOne({ phoneNumber });
//     if (existingUser)
//       throw new BadRequestError(`User with ${phoneNumber} already exists`);
//     const user = User.build(req.body);
//     const p = await Password.hashPassword(password);
//     user.password = `${p.buff}.${p.salt}`;
//     const token = jwt.sign(
//       {
//         id: user.id,
//         phoneNumber: user.phoneNumber,
//         fullName: user.fullName,
//       },
//       jwtKey
//     );
//     await user.save();
//     res.send({
//       name: user.fullName,
//       id: user.id,
//       phoneNumber: user.phoneNumber,
//       token,
//     });
//   }
// );
userRoute.post(
  "/login",
  [...userLoginRules],
  async (req: Request, res: Response) => {
    Validator.validate(req);
    const { phoneNumber, password } = req.body;
    const user = await User.findOne({ phoneNumber });
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
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
      },
      jwtKey
    );
    res.send({
      name: user.fullName,
      id: user.id,
      phoneNumber: user.phoneNumber,
      token,
    });
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
