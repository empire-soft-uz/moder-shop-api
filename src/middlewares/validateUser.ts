import { NextFunction, Request, Response } from "express";
import JWTDecrypter from "../utils/JWTDecrypter";
const jwtKey = process.env.JWT || "someKEy";

export default function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  JWTDecrypter.decryptUser(req, jwtKey);
  next();
}
