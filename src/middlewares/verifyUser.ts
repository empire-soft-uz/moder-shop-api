import { NextFunction, Request, Response } from "express";
import BadRequestError from "../Classes/Errors/BadRequestError";
import OTP from "../Models/OTP";
import JWTDecrypter from "../utils/JWTDecrypter";
import IUserPayload from "../Interfaces/IUserPayload";
const jwtKey = process.env.JWT || "SomeJwT_keY";
interface OTPToken {
  phoneNumber: number | string;
  expiresIn: string | number | undefined;
}
export default async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const otpToken = JWTDecrypter.decryptUser<OTPToken>(req, jwtKey);

    if (!otpToken.phoneNumber)
      throw new BadRequestError("Invalid Verification Credentials");
    const otp = await OTP.findOne({
      phoneNumber: otpToken.phoneNumber,
      isVerified: true,
    });
    if (!otp) throw new BadRequestError("User is not verified");
    next();
  } catch (error) {
    next(error);
  }
}
