import { NextFunction, Request, Response } from "express";
import UnauthorizedError from "../Classes/Errors/UnauthoruzedError";
import jwt from "jsonwebtoken";
import ForbidenError from "../Classes/Errors/ForbidenError";
import JWTDecrypter from "../utils/JWTDecrypter";
const jwtKey = process.env.JWT || "someKEy";

export default function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  JWTDecrypter.decryptUser(jwtKey, req);
  next();
}
