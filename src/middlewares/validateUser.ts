import { NextFunction, Request, Response } from "express";
import UnauthorizedError from "../Classes/Errors/UnauthoruzedError";
import jwt from "jsonwebtoken";
import ForbidenError from "../Classes/Errors/ForbidenError";
const jwtKey = process.env.JWT || "someKEy";
export default function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) throw new UnauthorizedError("User Unathorised");
  try {
    const validatedUser = jwt.verify(authHeader, jwtKey);
    next();
  } catch (error) {
    throw new ForbidenError("Invalid User Signature");
  }
}
