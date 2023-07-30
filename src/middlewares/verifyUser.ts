import { NextFunction, Request, Response } from "express";
import BadRequestError from "../Classes/Errors/BadRequestError";
import OTP from "../Models/OTP";

export default async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber)
      throw new BadRequestError("Invalid Verification Credentials");
    const otp = await OTP.findOne({ phoneNumber, isVerified: true });
    if (!otp) throw new BadRequestError("User is not verified");
    next();
  } catch (error) {
    next(error);
  }
}
